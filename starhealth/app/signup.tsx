import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as AuthSession from 'expo-auth-session';
import ScreenWrapper from '../components/ScreenWrapper';

WebBrowser.maybeCompleteAuthSession();

export default function Signup() {
  const router = useRouter();

  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    androidClientId: '1028207408855-74rk5gvfiqh9phjeft6bke5fkanmaqr8.apps.googleusercontent.com',
    webClientId: '1028207408855-2fgsd2qvuo2sgft7u01pli0mkvqjvetl.apps.googleusercontent.com',
    iosClientId: '1028207408855-k7tsbv4v4d7qdetmbl3s99b9k1mor1ko.apps.googleusercontent.com',
  });

  const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
    clientId: '2011845419386722',
  });

  // Print the redirect URIs used by expo-auth-session so you can register them in Google Cloud Console
  useEffect(() => {
  console.log('Signup mounted');
  const nativeUri = AuthSession.makeRedirectUri({ useProxy: false } as any);
  const proxyUri = AuthSession.makeRedirectUri({ useProxy: true } as any);
  console.log('AuthSession redirect (native):', nativeUri);
  console.log('AuthSession redirect (proxy):', proxyUri);
}, []);


  const handleGoogleLogin = async () => {
    if (!googleRequest) return;

    try {
      const result = await googlePromptAsync();

      if (result.type !== 'success') {
        return Alert.alert('Connexion Google annulée ou échouée');
      }

      const idToken = result.authentication?.idToken;
      const accessToken = result.authentication?.accessToken;

      // mobile → idToken (JWT), web → accessToken
      const token = Platform.OS === 'web' ? accessToken : idToken;

      if (!token) {
        return Alert.alert('Erreur : aucun token reçu');
      }

      console.log('Sending token to backend, length:', token.length, 'platform:', Platform.OS);

      const response = await fetch('http://192.168.1.79:5000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const text = await response.text();
      let data: any;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { raw: text };
      }

      if (response.ok && data.success) {
        router.replace('/home');
      } else {
        console.log('Backend error response:', response.status, data);
        Alert.alert('Erreur backend', data.error || JSON.stringify(data));
      }
    } catch (err) {
      console.error('handleGoogleLogin error:', err);
      Alert.alert('Impossible de contacter le backend');
    }
  };

  const handleAppleLogin = () => {
    alert('Apple login pressed');
  };

  return (
    <ScreenWrapper>
      <Text style={styles.title}>Create new account</Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => router.push('/AddEmail')}
      >
        <Text style={styles.primaryButtonText}>Continue with email</Text>
      </TouchableOpacity>

      <Text style={styles.or}>Or</Text>

      {Platform.OS === 'ios' && (
        <TouchableOpacity style={styles.secondaryButton} onPress={handleAppleLogin}>
          <View style={styles.socialContent}>
            <FontAwesome name="apple" size={20} color="#fff" />
            <Text style={styles.secondaryText}>Continue with Apple</Text>
          </View>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.secondaryButton}
        disabled={!fbRequest}
        onPress={() => fbPromptAsync()}
      >
        <View style={styles.socialContent}>
          <FontAwesome name="facebook" size={20} color="#1877F2" />
          <Text style={styles.secondaryText}>Continue with Facebook</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        disabled={!googleRequest}
        onPress={handleGoogleLogin}
      >
        <View style={styles.socialContent}>
          <AntDesign name="google" size={20} color="#EA4335" />
          <Text style={styles.secondaryText}>Continue with Google</Text>
        </View>
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
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#d45425',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  or: { color: '#9ca3af', textAlign: 'center', marginVertical: 12 },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 14,
    width: '100%',
  },
  socialContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  secondaryText: { color: '#fff', fontSize: 15, fontWeight: '500' },
});
