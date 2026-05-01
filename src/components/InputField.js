import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function InputField({ label, value, onChangeText, keyboardType = 'default', placeholder = '' }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor="#BDBDBD"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  label: { fontSize: 12, color: '#999', marginBottom: 6, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    borderBottomWidth: 1.5, borderColor: '#E0E0E0',
    paddingVertical: 10, fontSize: 16, color: '#111', backgroundColor: 'transparent',
  },
});
