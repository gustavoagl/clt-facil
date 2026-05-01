// Alíquotas INSS 2024 (tabela progressiva)
const FAIXAS_INSS = [
  { limite: 1412.0, aliquota: 0.075 },
  { limite: 2666.68, aliquota: 0.09 },
  { limite: 4000.03, aliquota: 0.12 },
  { limite: 7786.02, aliquota: 0.14 },
];

export function calcularINSS(salarioBruto) {
  let inss = 0;
  let baseAnterior = 0;
  for (const faixa of FAIXAS_INSS) {
    if (salarioBruto <= baseAnterior) break;
    const base = Math.min(salarioBruto, faixa.limite) - baseAnterior;
    inss += base * faixa.aliquota;
    baseAnterior = faixa.limite;
  }
  return parseFloat(inss.toFixed(2));
}

// Alíquota IRRF simplificada (tabela 2024)
const FAIXAS_IRRF = [
  { limite: 2259.2, aliquota: 0, deducao: 0 },
  { limite: 2826.65, aliquota: 0.075, deducao: 169.44 },
  { limite: 3751.05, aliquota: 0.15, deducao: 381.44 },
  { limite: 4664.68, aliquota: 0.225, deducao: 662.77 },
  { limite: Infinity, aliquota: 0.275, deducao: 896.0 },
];

export function calcularIRRF(baseCalculo) {
  for (const faixa of FAIXAS_IRRF) {
    if (baseCalculo <= faixa.limite) {
      const irrf = baseCalculo * faixa.aliquota - faixa.deducao;
      return parseFloat(Math.max(0, irrf).toFixed(2));
    }
  }
  return 0;
}

export function calcularRescisao({ salarioBruto, dataAdmissao, dataDemissao, tipoDemissao, feriasVencidas }) {
  const admissao = new Date(dataAdmissao);
  const demissao = new Date(dataDemissao);

  const mesesTrabalhados = calcularMeses(admissao, demissao);
  const diasUltimoMes = demissao.getDate();
  const diasNoMes = new Date(demissao.getFullYear(), demissao.getMonth() + 1, 0).getDate();

  const saldoSalario = parseFloat(((salarioBruto / diasNoMes) * diasUltimoMes).toFixed(2));

  const mesesAno = demissao.getMonth() + 1;
  const decimoTerceiroProporcional = parseFloat(((salarioBruto / 12) * mesesAno).toFixed(2));

  const mesesParaFerias = mesesTrabalhados % 12;
  const feriasProporcional = parseFloat(((salarioBruto / 12) * mesesParaFerias).toFixed(2));
  const tercoFerias = parseFloat((feriasProporcional / 3).toFixed(2));

  const feriasVencidasValor = feriasVencidas ? salarioBruto : 0;
  const tercoFeriasVencidas = parseFloat((feriasVencidasValor / 3).toFixed(2));

  const anosCompletos = Math.floor(mesesTrabalhados / 12);
  const multaFGTS =
    tipoDemissao === 'sem_justa_causa'
      ? parseFloat(((salarioBruto * 0.08 * mesesTrabalhados) * 0.4).toFixed(2))
      : 0;

  const avisoPrevia =
    tipoDemissao === 'sem_justa_causa'
      ? parseFloat((salarioBruto + salarioBruto * 0.03 * anosCompletos).toFixed(2))
      : 0;

  const entradas = {
    saldoSalario,
    decimoTerceiroProporcional,
    feriasProporcional,
    tercoFerias,
    feriasVencidas: feriasVencidasValor,
    tercoFeriasVencidas,
    multaFGTS,
    avisoPrevia,
  };

  const totalEntradas = Object.values(entradas).reduce((a, b) => a + b, 0);
  const inss = tipoDemissao === 'sem_justa_causa' ? calcularINSS(salarioBruto) : 0;
  const irrf = tipoDemissao === 'sem_justa_causa' ? calcularIRRF(salarioBruto - inss) : 0;

  const descontos = { inss, irrf };
  const totalDescontos = inss + irrf;
  const totalLiquido = parseFloat((totalEntradas - totalDescontos).toFixed(2));

  return { entradas, descontos, totalEntradas: parseFloat(totalEntradas.toFixed(2)), totalDescontos, totalLiquido, mesesTrabalhados };
}

export function calcularTrezeAvos({ salarioBruto, mesAtual, adiantamento }) {
  const bruto = parseFloat(((salarioBruto / 12) * mesAtual).toFixed(2));
  const inss = calcularINSS(bruto);
  const irrf = calcularIRRF(bruto - inss);
  const liquido = parseFloat((bruto - inss - irrf - adiantamento).toFixed(2));
  return { bruto, inss, irrf, adiantamento, liquido };
}

export function calcularFerias({ salarioBruto, diasFerias, abonoPecuniario }) {
  const valorDiario = salarioBruto / 30;
  const valorFerias = parseFloat((valorDiario * diasFerias).toFixed(2));
  const tercoFerias = parseFloat((valorFerias / 3).toFixed(2));

  let abono = 0;
  let tercoAbono = 0;
  if (abonoPecuniario) {
    abono = parseFloat((valorDiario * 10).toFixed(2));
    tercoAbono = parseFloat((abono / 3).toFixed(2));
  }

  const brutoTotal = parseFloat((valorFerias + tercoFerias + abono + tercoAbono).toFixed(2));
  const inss = calcularINSS(valorFerias);
  const irrf = calcularIRRF(valorFerias + tercoFerias - inss);
  const liquido = parseFloat((brutoTotal - inss - irrf).toFixed(2));

  return { valorFerias, tercoFerias, abono, tercoAbono, brutoTotal, inss, irrf, liquido };
}

export function calcularFGTS({ salarioBruto, mesesTrabalhados, tipoDemissao }) {
  const saldoFGTS = parseFloat((salarioBruto * 0.08 * mesesTrabalhados).toFixed(2));
  const multa = tipoDemissao === 'sem_justa_causa' ? parseFloat((saldoFGTS * 0.4).toFixed(2)) : 0;
  const total = parseFloat((saldoFGTS + multa).toFixed(2));
  return { saldoFGTS, multa, total };
}

function calcularMeses(dataInicio, dataFim) {
  return (
    (dataFim.getFullYear() - dataInicio.getFullYear()) * 12 +
    (dataFim.getMonth() - dataInicio.getMonth())
  );
}

// Aceita "3500", "3500,50", "3.500,50", "1.000", "1,000"
export function parseSalario(texto) {
  const t = texto.trim();

  // Tem ponto E vírgula: padrão BR (ponto=milhar, vírgula=decimal)
  if (t.includes('.') && t.includes(',')) {
    return parseFloat(t.replace(/\./g, '').replace(',', '.'));
  }

  // Só vírgula: verifica se é milhar (3 dígitos após) ou decimal (1-2 dígitos)
  if (t.includes(',')) {
    const aposVirgula = t.split(',').pop();
    if (aposVirgula.length === 3) return parseFloat(t.replace(',', ''));
    return parseFloat(t.replace(',', '.'));
  }

  // Só ponto: verifica se é milhar (3 dígitos após) ou decimal (1-2 dígitos)
  if (t.includes('.')) {
    const aposPonto = t.split('.').pop();
    if (aposPonto.length === 3) return parseFloat(t.replace('.', ''));
    return parseFloat(t);
  }

  return parseFloat(t);
}

export function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function mascaraData(texto) {
  const numeros = texto.replace(/\D/g, '').slice(0, 8);
  if (numeros.length <= 2) return numeros;
  if (numeros.length <= 4) return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
  return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
}

export function parseDataBR(dataBR) {
  const partes = dataBR.split('/');
  if (partes.length !== 3 || partes[2].length !== 4) return null;
  const data = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
  return isNaN(data) ? null : data;
}
