import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Substitua por: import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
// e configure o app.json com o App ID do AdMob antes de usar em produção.

export default function BannerAdComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Anúncio</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 50, backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' },
  texto: { color: '#9E9E9E', fontSize: 12 },
});
