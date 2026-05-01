import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import InputField from '../components/InputField';
import { calcularRescisao, mascaraData, parseDataBR, parseSalario } from '../utils/calculos';

const TIPOS = [
  { label: 'Sem justa causa', value: 'sem_justa_causa' },
  { label: 'Com justa causa', value: 'com_justa_causa' },
  { label: 'Pedido de demissão', value: 'pedido_demissao' },
];

export default function RescisaoScreen({ navigation }) {
  const [salario, setSalario] = useState('');
  const [dataAdmissao, setDataAdmissao] = useState('');
  const [dataDemissao, setDataDemissao] = useState('');
  const [tipo, setTipo] = useState('sem_justa_causa');
  const [feriasVencidas, setFeriasVencidas] = useState(false);

  function calcular() {
    const salarioBruto = parseSalario(salario);
    if (!salarioBruto || !dataAdmissao || !dataDemissao) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    const admissao = parseDataBR(dataAdmissao);
    const demissao = parseDataBR(dataDemissao);
    if (!admissao || !demissao || demissao <= admissao) {
      Alert.alert('Data inválida', 'Verifique as datas no formato DD/MM/AAAA.');
      return;
    }
    const dataAdmissaoISO = admissao.toISOString().split('T')[0];
    const dataDemissaoISO = demissao.toISOString().split('T')[0];
    const resultado = calcularRescisao({ salarioBruto, dataAdmissao: dataAdmissaoISO, dataDemissao: dataDemissaoISO, tipoDemissao: tipo, feriasVencidas });
    navigation.navigate('Resultado', { tipo: 'rescisao', dados: resultado });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>Rescisão Contratual</Text>

        <Text style={styles.secaoLabel}>Tipo de demissão</Text>
        <View style={styles.opcoes}>
          {TIPOS.map((t) => (
            <TouchableOpacity
              key={t.value}
              style={[styles.opcao, tipo === t.value && styles.opcaoSelecionada]}
              onPress={() => setTipo(t.value)}
            >
              <Text style={[styles.opcaoTexto, tipo === t.value && styles.opcaoTextoSelecionado]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <InputField label="Salário bruto (R$)" value={salario} onChangeText={setSalario} keyboardType="numeric" placeholder="0,00" />
        <InputField label="Data de admissão" value={dataAdmissao} onChangeText={(t) => setDataAdmissao(mascaraData(t))} keyboardType="number-pad" placeholder="DD/MM/AAAA" />
        <InputField label="Data de demissão" value={dataDemissao} onChangeText={(t) => setDataDemissao(mascaraData(t))} keyboardType="number-pad" placeholder="DD/MM/AAAA" />

        <Text style={styles.secaoLabel}>Férias vencidas?</Text>
        <View style={styles.opcoes}>
          {[{ label: 'Sim', value: true }, { label: 'Não', value: false }].map((op) => (
            <TouchableOpacity
              key={String(op.value)}
              style={[styles.opcao, feriasVencidas === op.value && styles.opcaoSelecionada]}
              onPress={() => setFeriasVencidas(op.value)}
            >
              <Text style={[styles.opcaoTexto, feriasVencidas === op.value && styles.opcaoTextoSelecionado]}>{op.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.btnCalcular} onPress={calcular}>
          <Text style={styles.btnTexto}>Calcular</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scroll: { padding: 28 },
  titulo: { fontSize: 28, fontWeight: '800', color: '#111', marginBottom: 32 },
  secaoLabel: { fontSize: 12, color: '#999', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  opcoes: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 28 },
  opcao: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: '#E0E0E0', backgroundColor: '#FFF', marginRight: 8, marginBottom: 8 },
  opcaoSelecionada: { backgroundColor: '#111', borderColor: '#111' },
  opcaoTexto: { fontSize: 13, color: '#555' },
  opcaoTextoSelecionado: { color: '#FFF', fontWeight: '600' },
  btnCalcular: { backgroundColor: '#111', borderRadius: 12, paddingVertical: 18, alignItems: 'center', marginTop: 16 },
  btnTexto: { color: '#FFF', fontSize: 15, fontWeight: '700', letterSpacing: 0.5 },
});
