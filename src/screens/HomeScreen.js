import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const BOTOES = [
  { label: 'Rescisão', icon: 'gavel', tela: 'Rescisao' },
  { label: '13º Salário', icon: 'event-note', tela: 'TrezeAvos' },
  { label: 'Férias', icon: 'flight-takeoff', tela: 'Ferias' },
  { label: 'FGTS', icon: 'account-balance-wallet', tela: 'FGTS' },
];

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.titulo}>CLT Fácil</Text>
          <Text style={styles.subtitulo}>Calcule seus direitos trabalhistas</Text>
        </View>
        <View style={styles.grid}>
          {BOTOES.map((item) => (
            <TouchableOpacity
              key={item.tela}
              style={styles.botao}
              onPress={() => navigation.navigate(item.tela)}
              activeOpacity={0.7}
            >
              <MaterialIcons name={item.icon} size={32} color="#111" style={styles.icone} />
              <Text style={styles.labelBotao}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.sobreBtn} onPress={() => navigation.navigate('Sobre')}>
          <Text style={styles.sobreTexto}>Sobre o app</Text>
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
  scroll: { flexGrow: 1 },
  header: { paddingHorizontal: 28, paddingTop: 36, paddingBottom: 28 },
  titulo: { fontSize: 34, fontWeight: '800', color: '#111', lineHeight: 40 },
  subtitulo: { fontSize: 14, color: '#999', marginTop: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20 },
  botao: {
    width: '47%', aspectRatio: 1, borderRadius: 16, borderWidth: 1.5,
    borderColor: '#E8E8E8', justifyContent: 'center', alignItems: 'center',
    margin: 6, backgroundColor: '#FAFAFA',
  },
  icone: { marginBottom: 10 },
  labelBotao: { fontSize: 14, fontWeight: '600', color: '#111' },
  sobreBtn: { alignItems: 'center', paddingVertical: 16 },
  sobreTexto: { color: '#999', fontSize: 13, textDecorationLine: 'underline' },
  bannerPlaceholder: { height: 50, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' },
  bannerTexto: { color: '#BDBDBD', fontSize: 11 },
});
