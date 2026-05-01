import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import InputField from '../components/InputField';
import { calcularTrezeAvos, parseSalario } from '../utils/calculos';

export default function TrezeAvosScreen({ navigation }) {
  const [salario, setSalario] = useState('');
  const [mes, setMes] = useState('');
  const [temAdiantamento, setTemAdiantamento] = useState(false);
  const [adiantamento, setAdiantamento] = useState('');

  function calcular() {
    const salarioBruto = parseSalario(salario);
    const mesAtual = parseInt(mes);
    const adiantamentoValor = temAdiantamento ? (parseSalario(adiantamento) || 0) : 0;
    if (!salarioBruto || !mesAtual || mesAtual < 1 || mesAtual > 12) {
      Alert.alert('Atenção', 'Preencha salário e mês (1–12) corretamente.');
      return;
    }
    const resultado = calcularTrezeAvos({ salarioBruto, mesAtual, adiantamento: adiantamentoValor });
    navigation.navigate('Resultado', { tipo: 'treze', dados: resultado });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>13º Salário</Text>

        <InputField label="Salário bruto (R$)" value={salario} onChangeText={setSalario} keyboardType="numeric" placeholder="0,00" />
        <InputField label="Mês atual (1 a 12)" value={mes} onChangeText={setMes} keyboardType="number-pad" placeholder="ex: 10" />

        <Text style={styles.secaoLabel}>Já recebeu adiantamento?</Text>
        <View style={styles.opcoes}>
          {[{ label: 'Sim', value: true }, { label: 'Não', value: false }].map((op) => (
            <TouchableOpacity
              key={String(op.value)}
              style={[styles.opcao, temAdiantamento === op.value && styles.opcaoSelecionada]}
              onPress={() => setTemAdiantamento(op.value)}
            >
              <Text style={[styles.opcaoTexto, temAdiantamento === op.value && styles.opcaoTextoSelecionado]}>{op.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {temAdiantamento && (
          <InputField label="Valor do adiantamento (R$)" value={adiantamento} onChangeText={setAdiantamento} keyboardType="numeric" placeholder="0,00" />
        )}

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
