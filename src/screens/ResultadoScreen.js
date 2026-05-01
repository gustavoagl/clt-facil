import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Share } from 'react-native';
import { formatarMoeda } from '../utils/calculos';

function LinhaResultado({ label, valor, destaque, desconto }) {
  return (
    <View style={[styles.linha, destaque && styles.linhaDestaque]}>
      <Text style={[styles.linhaLabel, destaque && styles.linhaLabelDestaque]}>{label}</Text>
      <Text style={[styles.linhaValor, destaque && styles.linhaValorDestaque, desconto && styles.valorDesconto]}>
        {desconto ? '− ' : ''}{formatarMoeda(valor)}
      </Text>
    </View>
  );
}

function gerarTexto(tipo, dados) {
  switch (tipo) {
    case 'rescisao':
      return `Rescisão\nSaldo salário: ${formatarMoeda(dados.entradas.saldoSalario)}\n13º prop.: ${formatarMoeda(dados.entradas.decimoTerceiroProporcional)}\nFérias prop.: ${formatarMoeda(dados.entradas.feriasProporcional)}\nTotal líquido: ${formatarMoeda(dados.totalLiquido)}`;
    case 'treze':
      return `13º Salário\nBruto: ${formatarMoeda(dados.bruto)}\nINSS: ${formatarMoeda(dados.inss)}\nIRRF: ${formatarMoeda(dados.irrf)}\nLíquido: ${formatarMoeda(dados.liquido)}`;
    case 'ferias':
      return `Férias\nValor: ${formatarMoeda(dados.valorFerias)}\n1/3: ${formatarMoeda(dados.tercoFerias)}\nLíquido: ${formatarMoeda(dados.liquido)}`;
    case 'fgts':
      return `FGTS\nSaldo: ${formatarMoeda(dados.saldoFGTS)}\nMulta 40%: ${formatarMoeda(dados.multa)}\nTotal: ${formatarMoeda(dados.total)}`;
    default:
      return '';
  }
}

export default function ResultadoScreen({ route, navigation }) {
  const { tipo, dados } = route.params;

  async function compartilhar() {
    await Share.share({ message: `Direitos Trabalhistas\n\n${gerarTexto(tipo, dados)}\n\nCalculado pelo app Direitos Trabalhistas` });
  }

  function renderConteudo() {
    switch (tipo) {
      case 'rescisao':
        return (
          <>
            <Text style={styles.secao}>A receber</Text>
            <LinhaResultado label="Saldo de salário" valor={dados.entradas.saldoSalario} />
            <LinhaResultado label="13º proporcional" valor={dados.entradas.decimoTerceiroProporcional} />
            <LinhaResultado label="Férias proporcionais" valor={dados.entradas.feriasProporcional} />
            <LinhaResultado label="1/3 férias proporcionais" valor={dados.entradas.tercoFerias} />
            {dados.entradas.feriasVencidas > 0 && <LinhaResultado label="Férias vencidas" valor={dados.entradas.feriasVencidas} />}
            {dados.entradas.tercoFeriasVencidas > 0 && <LinhaResultado label="1/3 férias vencidas" valor={dados.entradas.tercoFeriasVencidas} />}
            {dados.entradas.multaFGTS > 0 && <LinhaResultado label="Multa FGTS (40%)" valor={dados.entradas.multaFGTS} />}
            {dados.entradas.avisoPrevia > 0 && <LinhaResultado label="Aviso prévio indenizado" valor={dados.entradas.avisoPrevia} />}
            <Text style={styles.secao}>Descontos</Text>
            <LinhaResultado label="INSS" valor={dados.descontos.inss} desconto />
            <LinhaResultado label="IRRF" valor={dados.descontos.irrf} desconto />
            <View style={styles.divisor} />
            <LinhaResultado label="Total líquido" valor={dados.totalLiquido} destaque />
          </>
        );
      case 'treze':
        return (
          <>
            <LinhaResultado label="13º bruto" valor={dados.bruto} />
            <LinhaResultado label="INSS" valor={dados.inss} desconto />
            <LinhaResultado label="IRRF" valor={dados.irrf} desconto />
            {dados.adiantamento > 0 && <LinhaResultado label="Adiantamento" valor={dados.adiantamento} desconto />}
            <View style={styles.divisor} />
            <LinhaResultado label="Total líquido" valor={dados.liquido} destaque />
          </>
        );
      case 'ferias':
        return (
          <>
            <LinhaResultado label="Valor das férias" valor={dados.valorFerias} />
            <LinhaResultado label="1/3 Constitucional" valor={dados.tercoFerias} />
            {dados.abono > 0 && <LinhaResultado label="Abono pecuniário (10 dias)" valor={dados.abono} />}
            {dados.tercoAbono > 0 && <LinhaResultado label="1/3 do abono" valor={dados.tercoAbono} />}
            <LinhaResultado label="INSS" valor={dados.inss} desconto />
            <LinhaResultado label="IRRF" valor={dados.irrf} desconto />
            <View style={styles.divisor} />
            <LinhaResultado label="Total líquido" valor={dados.liquido} destaque />
          </>
        );
      case 'fgts':
        return (
          <>
            <LinhaResultado label="Saldo FGTS estimado" valor={dados.saldoFGTS} />
            {dados.multa > 0 && <LinhaResultado label="Multa rescisória (40%)" valor={dados.multa} />}
            <View style={styles.divisor} />
            <LinhaResultado label="Total a receber" valor={dados.total} destaque />
          </>
        );
      default:
        return null;
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.titulo}>Resumo do Cálculo</Text>
        <View style={styles.card}>{renderConteudo()}</View>
        <Text style={styles.aviso}>Valores estimados. Não substitui orientação jurídica.</Text>
        <TouchableOpacity style={styles.btnCompartilhar} onPress={compartilhar}>
          <Text style={styles.btnTexto}>Compartilhar resultado</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnNovamente} onPress={() => navigation.goBack()}>
          <Text style={styles.btnNovamenteTexto}>Calcular novamente</Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.bannerPlaceholder}>
        <Text style={styles.bannerTexto}>Anúncio</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scroll: { padding: 28 },
  titulo: { fontSize: 28, fontWeight: '800', color: '#111', marginBottom: 24 },
  card: { backgroundColor: '#FAFAFA', borderRadius: 16, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#F0F0F0' },
  secao: { fontSize: 11, fontWeight: '700', color: '#999', textTransform: 'uppercase', letterSpacing: 1, marginTop: 16, marginBottom: 4 },
  linha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  linhaDestaque: { borderBottomWidth: 0, marginTop: 4 },
  linhaLabel: { fontSize: 14, color: '#555', flex: 1 },
  linhaLabelDestaque: { fontSize: 15, fontWeight: '700', color: '#111' },
  linhaValor: { fontSize: 14, color: '#111', fontWeight: '500' },
  linhaValorDestaque: { fontSize: 18, fontWeight: '800', color: '#111' },
  valorDesconto: { color: '#999' },
  divisor: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 8 },
  aviso: { fontSize: 12, color: '#BDBDBD', textAlign: 'center', marginBottom: 24, lineHeight: 18 },
  btnCompartilhar: { backgroundColor: '#111', borderRadius: 12, paddingVertical: 18, alignItems: 'center', marginBottom: 12 },
  btnTexto: { color: '#FFF', fontSize: 15, fontWeight: '700', letterSpacing: 0.5 },
  btnNovamente: { borderWidth: 1.5, borderColor: '#E0E0E0', borderRadius: 12, paddingVertical: 18, alignItems: 'center' },
  btnNovamenteTexto: { color: '#555', fontSize: 15, fontWeight: '600' },
  bannerPlaceholder: { height: 50, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' },
  bannerTexto: { color: '#BDBDBD', fontSize: 11 },
});
