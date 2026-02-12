import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import type { AuthView, ApiResponse, User } from '../app/types';
import { AUTH_VIEWS } from '../app/types';
import { analyzePasswordStrength } from '../services/geminiService';
import { api } from '../services/api';

interface SignupFormProps {
  onNavigate: (view: AuthView) => void;
  onRegistered?: (user: User) => void; // optional callback if parent wants to auto-login or navigate
}

export default function SignupForm({ onNavigate, onRegistered }: SignupFormProps) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [strength, setStrength] = useState<{ score: number; label: string; feedback: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (formData.password) {
        try {
          const result = await analyzePasswordStrength(formData.password);
          setStrength(result);
        } catch {
          setStrength({ score: 2, label: 'Fair', feedback: 'Consider adding symbols and mixed case.' });
        }
      } else {
        setStrength(null);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [formData.password]);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // api.register accepts dob as optional; this form only sends name/email/password
      const response: ApiResponse<User> = await api.register(
        formData.name.trim(),
        formData.email.trim(),
        formData.password
      );

      if (response.success && response.data) {
        // optional callback for parent to auto-login or navigate
        onRegistered?.(response.data);
        onNavigate(AUTH_VIEWS.LOGIN);
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch {
      setError('Unexpected error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || (!!strength && strength.score < 2);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Identity</Text>
      <Text style={styles.subtitle}>Join the future of decentralized access</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#aaa"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        autoCapitalize="none"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
      />

      {strength && (
        <View style={styles.strengthBox}>
          <View style={styles.strengthHeader}>
            <Text style={styles.strengthLabel}>AI Strength Guard</Text>
            <Text
              style={[
                styles.strengthBadge,
                strength.score >= 3 ? styles.strong : strength.score === 2 ? styles.medium : styles.weak,
              ]}
            >
              {strength.label}
            </Text>
          </View>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                strength.score >= 3 ? styles.strongFill : strength.score === 2 ? styles.mediumFill : styles.weakFill,
                { width: `${(strength.score / 4) * 100}%` },
              ]}
            />
          </View>

          <Text style={styles.feedback}>{strength.feedback}</Text>
        </View>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.button, isDisabled && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isDisabled}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register Account</Text>}
      </TouchableOpacity>

      <Text style={styles.footer}>
        Already have an account?{' '}
        <Text style={styles.link} onPress={() => onNavigate(AUTH_VIEWS.LOGIN)}>
          Log In
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0c2a', padding: 24, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#ccc', textAlign: 'center', marginBottom: 24 },
  input: { backgroundColor: '#1c1c3c', color: '#fff', padding: 14, borderRadius: 10, marginBottom: 18 },
  button: { backgroundColor: '#4f46e5', paddingVertical: 16, borderRadius: 10, alignItems: 'center', marginTop: 12 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  footer: { color: '#ccc', textAlign: 'center', marginTop: 24 },
  link: { color: '#7c3aed', fontWeight: '600' },
  error: { color: 'red', textAlign: 'center', marginBottom: 12 },
  strengthBox: { backgroundColor: '#1c1c3c', padding: 12, borderRadius: 10, marginBottom: 18 },
  strengthHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  strengthLabel: { fontSize: 12, color: '#aaa' },
  strengthBadge: { fontSize: 12, fontWeight: 'bold' },
  strong: { color: 'green' },
  medium: { color: '#f59e0b' },
  weak: { color: 'red' },
  progressBar: { height: 6, backgroundColor: '#333', borderRadius: 3, overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: '100%' },
  strongFill: { backgroundColor: 'green' },
  mediumFill: { backgroundColor: '#f59e0b' },
  weakFill: { backgroundColor: 'red' },
  feedback: { fontSize: 12, color: '#ccc' },
});
