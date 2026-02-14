import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthView, AUTH_VIEWS } from '../Constants'; // We might need to create this or inline it
import ScreenWrapper from '../components/ScreenWrapper';

// Mock API or actual import
// import { api } from '../services/api'; 

export default function StarLoginScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      // Mock login for UI Check
      console.log("Logging in with", email, password);
      // const response = await api.login(email.trim(), password);

      // Simulate success for now or use real API if available
      setTimeout(() => {
        setLoading(false);
        navigation.navigate('StarHome'); // Navigate to StarHome on success
      }, 1000);

      // if (response.success && response.data) {
      //   onSuccess(response.data);
      // } else {
      //   setError(response.message || 'Login failed');
      // }
    } catch (err) {
      setError('Unexpected error. Try again.');
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Enter your credentials to continue</Text>

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('ForgotPswd')}>
        <Text style={styles.linkText}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Log In</Text>}
      </TouchableOpacity>

      <Text style={styles.signup}>
        Don’t have an account?{' '}
        <Text style={styles.linkText} onPress={() => navigation.navigate('Signup')}>
          Sign up
        </Text>
      </Text>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 30,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  input: {
    backgroundColor: 'rgba(28,28,60,0.8)',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontFamily: 'Poppins-Regular',
  },
  link: {
    marginBottom: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#7c3aed',
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  button: {
    backgroundColor: '#d45425',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  signup: {
    color: '#ccc',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Poppins-Regular',
  },
});
