import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function AddEmail() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const API_URL = "http://192.168.1.79:5000/api/auth/send-code"; // ✅ correct

console.log("API_URL in app:", API_URL);


  const handleContinue = async () => {
  try {
    console.log("Sending request to:", API_URL);
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    console.log("Response status:", res.status);

    const text = await res.text();
    console.log("Raw response:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.log("JSON parse error:", e);
      alert("Server returned non-JSON: " + text);
      return;
    }

    if (data.success) {
      router.push({ pathname: "/verify-email", params: { email } });
    } else {
      alert(data.message || "Failed to send code");
    }
  } catch (err) {
    console.log("Fetch error details:", err);
    alert("Server error: " + JSON.stringify(err));
  }
};

  return (
    <ImageBackground
      source={require('../assets/images/Background.png')}
      resizeMode="cover"
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Add your email</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleContinue}>
          <Text style={styles.primaryButtonText}>Continue with email</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
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
    marginBottom: 16,
    width: '100%',
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
