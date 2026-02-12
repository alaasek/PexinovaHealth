import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ScreenWrapper from '../components/ScreenWrapper'; // ⚠️ adapte le chemin selon où tu as mis ScreenWrapper.tsx

export default function EnterName() {
  const router = useRouter();
  const { email, password } = useLocalSearchParams<{ email?: string; password?: string }>();
  const [name, setName] = useState('');

  const showError = (message: string) => {
    if (Platform.OS === 'web') {
      alert(message);
    } else {
      Alert.alert('Error', message);
    }
  };

  const handleNext = () => {
    if (!email || !name) {
      showError('Email and name are required');
      return;
    }

    router.push({
      pathname: '/enter-dob',
      params: { email, password, name }
    });
  };

  return (
    <ScreenWrapper>
      <Text style={styles.title}>Enter your name</Text>

      <TextInput
        style={styles.input}
        placeholder="Your Name"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
        <Text style={styles.primaryButtonText}>Next</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '700', color: '#fff', textAlign: 'center', marginBottom: 20 },
  input: {
    backgroundColor: 'rgba(28,28,60,0.8)',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#d45425',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});




