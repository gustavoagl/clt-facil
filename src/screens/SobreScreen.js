import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, Linking, TouchableOpacity } from 'react-native';

export default function SobreScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.titulo}>Sobre</Text>

        <View style={styles.bloco}>
          <Text style={styles.blocoTitulo}>Direitos Trabalhistas</Text>
          <Text style={styles.versao}>Versão 1.0.0</Text>
          <Text style={styles.texto}>
            Simule seus direitos trabalhistas previstos na CLT de forma rápida e simples.
          </Text>
        </View>

        <View style={styles.divisor} />

        <View style={styles.bloco}>
          <Text style={styles.blocoTitulo}>Aviso Legal</Text>
          <Text style={styles.texto}>
            Os valores são <Text style={styles.negrito}>estimativas</Text> baseadas nas regras gerais da CLT e nas tabelas de INSS e IRRF vigentes.{'\n\n'}
            Este app <Text style={styles.negrito}>não substitui</Text> a orientação de um advogado trabalhista ou contador.
          </Text>
        </View>

        <View style={styles.divisor} />

        <TouchableOpacity style={styles.bloco} onPress={() => Linking.openURL('https://www.google.com')}>
          <Text style={styles.blocoTitulo}>Política de Privacidade</Text>
          <Text style={styles.link}>Acessar →</Text>
        </TouchableOpacity>

        <Text style={styles.rodape}>Feito no Brasil</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scroll: { padding: 28 },
  titulo: { fontSize: 28, fontWeight: '800', color: '#111', marginBottom: 32 },
  bloco: { paddingVertical: 4, marginBottom: 8 },
  blocoTitulo: { fontSize: 15, fontWeight: '700', color: '#111', marginBottom: 6 },
  versao: { fontSize: 12, color: '#BDBDBD', marginBottom: 10 },
  texto: { fontSize: 14, color: '#666', lineHeight: 22 },
  negrito: { fontWeight: '700', color: '#333' },
  link: { fontSize: 14, color: '#111', fontWeight: '600', marginTop: 4 },
  divisor: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 20 },
  rodape: { textAlign: 'center', color: '#BDBDBD', fontSize: 13, marginTop: 24 },
});
