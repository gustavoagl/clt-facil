import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import InputField from '../components/InputField';
import { calcularFGTS, parseSalario } from '../utils/calculos';

const TIPOS = [
  { label: 'Sem justa causa', value: 'sem_justa_causa' },
  { label: 'Com justa causa', value: 'com_justa_causa' },
  { label: 'Pedido de demissão', value: 'pedido_demissao' },
];

export default function FGTSScreen({ navigation }) {
  const [salario, setSalario] = useState('');
  const [meses, setMeses] = useState('');
  const [tipo, setTipo] = useState('sem_justa_causa');

  function calcular() {
    const salarioBruto = parseSalario(salario);
    const mesesTrabalhados = parseInt(meses);
    if (!salarioBruto || !mesesTrabalhados) {
      Alert.alert('Atenção', 'Preencha todos os campos corretamente.');
      return;
    }
    const resultado = calcularFGTS({ salarioBruto, mesesTrabalhados, tipoDemissao: tipo });
    navigation.navigate('Resultado', { tipo: 'fgts', dados: resultado });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>FGTS</Text>

        <InputField label="Salário bruto (R$)" value={salario} onChangeText={setSalario} keyboardType="numeric" placeholder="0,00" />
        <InputField label="Tempo de serviço (meses)" value={meses} onChangeText={setMeses} keyboardType="number-pad" placeholder="ex: 36" />

        <Text style={styles.secaoLabel}>Tipo de saída</Text>
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
