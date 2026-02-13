import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ScreenWrapper from '../components/ScreenWrapper'; // ⚠️ adapte le chemin si nécessaire
import { API_URL } from '../constants/config';

export default function VerifyEmail() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState('');

  const handleVerify = async () => {
    try {
      const res = await fetch(`${API_URL}/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();

      if (data.success) {
        router.push({ pathname: "/enter-password", params: { email } });
      } else {
        alert(data.message || "Invalid code");
      }
    } catch (err) {
      alert("Server error: " + err);
    }
  };

  return (
    <ScreenWrapper>
      <Text style={styles.title}>Verify your email</Text>
      <Text style={styles.subtitle}>
        We just sent a 5-digit code to {email}, enter it below:
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter 5-digit code"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        maxLength={5}
        value={code}
        onChangeText={setCode}
      />

      <TouchableOpacity style={styles.primaryButton} onPress={handleVerify}>
        <Text style={styles.primaryButtonText}>Verify email</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/AddEmail')}>
        <Text style={styles.link}>Wrong email? Send to different email</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
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
    marginBottom: 20,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  link: { color: '#7c3aed', textAlign: 'center', fontSize: 14 },
});

