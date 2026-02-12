import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { api } from '../services/api';
import ScreenWrapper from '../components/ScreenWrapper'; // ⚠️ adapte le chemin si nécessaire

export default function VerifyCode() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState('');
  const router = useRouter();

  const handleVerify = async () => {
    const res = await api.verifyCode(email, code);

if (res.success) {
  router.push({
    pathname: '/resetPassword',
    params: { 
      email,           // 🔹 ajouté pour l'email
      resetToken: res.data.resetToken,
    },
  });
} else {
  Alert.alert('Error', res.message || 'Code invalide');
}


  };

  return (
    <ScreenWrapper>
      <Text style={styles.title}>Verify Reset Code</Text>
      <Text style={styles.subtitle}>Enter the code sent to {email}</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter code"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        maxLength={5}
        value={code}
        onChangeText={setCode}
      />

      <TouchableOpacity style={styles.primaryButton} onPress={handleVerify}>
        <Text style={styles.primaryButtonText}>Verify Code</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(28,28,60,0.8)',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 18,
  },
  primaryButton: {
    backgroundColor: '#d45425',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
