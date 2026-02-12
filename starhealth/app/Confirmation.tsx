import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, View, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ScreenWrapper from '../components/ScreenWrapper';
import { api } from '../services/api';

export default function Confirmation() {
  const router = useRouter();
  const params = useLocalSearchParams<any>();

  const email = params.email ? decodeURIComponent(String(params.email)) : undefined;
  const password = params.password ? decodeURIComponent(String(params.password)) : undefined;
  const name = params.name ? decodeURIComponent(String(params.name)) : undefined;
  const dob = params.dob ? decodeURIComponent(String(params.dob)) : undefined;
  const disease = params.disease ? decodeURIComponent(String(params.disease)) : undefined;

  let meds: any[] = [];
  if (params.medications) {
    try {
      const raw = typeof params.medications === 'string' ? params.medications : String(params.medications);
      meds = JSON.parse(decodeURIComponent(raw));
      if (!Array.isArray(meds)) meds = [];
    } catch (e) {
      meds = [];
    }
  }

  const [loading, setLoading] = useState(false);
  const [serverResp, setServerResp] = useState<any>(null);

  const handleRegister = async () => {
    if (loading) return; // prevent duplicate calls
    console.log('handleRegister called');

    if (!email || !password || !name || !dob) {
      Alert.alert('Missing data', 'Please complete all required fields.');
      return;
    }

    setLoading(true);
    try {
      const payload = { name, email, password, dob, disease: disease || null, medications: meds };
      console.log('Final register payload:', payload);

      const res = await api.register(name, email, password, dob, disease, meds);
      console.log('Register response (raw):', res);
      setServerResp(res);

      const success = !!(res && (res.success === true || (res.data && res.data.token)));
      const message = res?.message || (res?.data && res.data.message) || null;

      if (!success) {
        Alert.alert('Error', message || 'Registration failed');
        setLoading(false);
        return;
      }

      Alert.alert('Success', 'Registration complete! Please log in.');
      router.replace('/Login'); // keep exact case that matches your route file
    } catch (err: any) {
      console.error('confirmation register error:', err);
      Alert.alert('Error', err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <Text style={styles.title}>Confirm your info</Text>

      <View style={{ width: '100%', marginBottom: 20 }}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{name}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{email}</Text>

        <Text style={styles.label}>DOB</Text>
        <Text style={styles.value}>{dob}</Text>

        <Text style={styles.label}>Disease</Text>
        <Text style={styles.value}>{disease || 'None'}</Text>

        <Text style={styles.label}>Medications</Text>
        {meds.length ? (
          meds.map((m: any, i: number) => (
            <Text key={i} style={styles.value}>
              {m.name} — {m.dosage || '-'} — {m.time || '-'} — {m.category || '-'}
            </Text>
          ))
        ) : (
          <Text style={styles.value}>None</Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, loading && { opacity: 0.6 }]}
        onPress={handleRegister}
        disabled={loading}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>{loading ? 'Processing...' : 'Confirm and Register'}</Text>
      </TouchableOpacity>

      {serverResp ? <Text style={{ color: '#fff', marginTop: 12 }}>{JSON.stringify(serverResp)}</Text> : null}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 20 },
  label: { color: '#9ca3af', marginTop: 8 },
  value: { color: '#fff', fontSize: 16 },
  primaryButton: { backgroundColor: '#d45425', paddingVertical: 14, borderRadius: 10, width: '100%', alignItems: 'center', marginTop: 20 },
  primaryButtonText: { color: '#fff', fontWeight: '600' },
});
