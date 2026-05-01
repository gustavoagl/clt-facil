import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import InputField from '../components/InputField';
import { calcularFerias, parseSalario } from '../utils/calculos';

const DIAS_OPCOES = [15, 20, 30];

export default function FeriasScreen({ navigation }) {
  const [salario, setSalario] = useState('');
  const [dias, setDias] = useState(30);
  const [abono, setAbono] = useState(false);

  function calcular() {
    const salarioBruto = parseSalario(salario);
    if (!salarioBruto) {
      Alert.alert('Atenção', 'Informe o salário bruto.');
      return;
    }
    const resultado = calcularFerias({ salarioBruto, diasFerias: dias, abonoPecuniario: abono });
    navigation.navigate('Resultado', { tipo: 'ferias', dados: resultado });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>Férias</Text>

        <InputField label="Salário bruto (R$)" value={salario} onChangeText={setSalario} keyboardType="numeric" placeholder="0,00" />

        <Text style={styles.secaoLabel}>Dias de férias</Text>
        <View style={styles.opcoes}>
          {DIAS_OPCOES.map((d) => (
            <TouchableOpacity
              key={d}
              style={[styles.opcao, dias === d && styles.opcaoSelecionada]}
              onPress={() => setDias(d)}
            >
              <Text style={[styles.opcaoTexto, dias === d && styles.opcaoTextoSelecionado]}>{d} dias</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.secaoLabel}>Vender 10 dias (abono)?</Text>
        <View style={styles.opcoes}>
          {[{ label: 'Sim', value: true }, { label: 'Não', value: false }].map((op) => (
            <TouchableOpacity
              key={String(op.value)}
              style={[styles.opcao, abono === op.value && styles.opcaoSelecionada]}
              onPress={() => setAbono(op.value)}
            >
              <Text style={[styles.opcaoTexto, abono === op.value && styles.opcaoTextoSelecionado]}>{op.label}</Text>
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
