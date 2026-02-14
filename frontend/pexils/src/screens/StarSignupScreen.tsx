import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import ScreenWrapper from '../components/ScreenWrapper';

WebBrowser.maybeCompleteAuthSession();

export default function StarSignupScreen() {
  const navigation = useNavigation<any>();

  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    androidClientId: '1028207408855-74rk5gvfiqh9phjeft6bke5fkanmaqr8.apps.googleusercontent.com',
    webClientId: '1028207408855-2fgsd2qvuo2sgft7u01pli0mkvqjvetl.apps.googleusercontent.com',
    iosClientId: '1028207408855-k7tsbv4v4d7qdetmbl3s99b9k1mor1ko.apps.googleusercontent.com',
  });

  const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
    clientId: '2011845419386722',
  });

  const handleGoogleLogin = async () => {
    if (!googleRequest) return;

    const result = await googlePromptAsync();

    if (result.type === 'success') {
      const idToken = result.authentication?.idToken;
      const accessToken = result.authentication?.accessToken;

      // Sur mobile → idToken, sur web → accessToken
      const token = Platform.OS === 'web' ? accessToken : idToken;

      if (!token) {
        return Alert.alert("Erreur : aucun token reçu");
      }

      try {
        const response = await fetch('http://192.168.1.79:5000/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          navigation.replace('StarHome');
        } else {
          Alert.alert('Erreur backend : ' + data.error);
        }
      } catch (err) {
        Alert.alert('Impossible de contacter le backend');
      }
    }
  };

  const handleAppleLogin = () => {
    Alert.alert('Apple login pressed');
  };

  return (
    <ScreenWrapper>
      <Text style={styles.title}>Create new account</Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.push('AddEmail')}
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

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginLink}>
          Already have an account? <Text style={{ fontWeight: 'bold', color: '#d45425' }}>Log In</Text>
        </Text>
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
    fontFamily: 'Poppins-Bold',
  },
  primaryButton: {
    backgroundColor: '#d45425',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', fontFamily: 'Poppins-SemiBold' },
  or: { color: '#9ca3af', textAlign: 'center', marginVertical: 12, fontFamily: 'Poppins-Regular' },
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
  secondaryText: { color: '#fff', fontSize: 15, fontWeight: '500', marginLeft: 10, fontFamily: 'Poppins-Medium' },
  loginLink: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Poppins-Regular'
  }
});
