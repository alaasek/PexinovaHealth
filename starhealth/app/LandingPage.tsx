import React from 'react';
import { Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../components/ScreenWrapper'; // ⚠️ adapte le chemin si nécessaire

export default function LandingPage() {
  const router = useRouter();

  return (
    <ScreenWrapper>
      <Text style={styles.title}>
        Let’s Build your <Text style={styles.highlight}>Shining Galaxy</Text> with{' '}
        <Text style={styles.highlight}>StarHealth</Text>
      </Text>

      <Image
        source={require('../assets/images/Splash.png')}
        style={styles.image}
        resizeMode="contain"
      />

      <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/Login')}>
        <Text style={styles.primaryButtonText}>Let’s Go 🚀</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
  },
  highlight: { color: '#d45425' },
  image: { width: 250, height: 250, marginBottom: 30 },
  primaryButton: {
    backgroundColor: '#7c3aed',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});

