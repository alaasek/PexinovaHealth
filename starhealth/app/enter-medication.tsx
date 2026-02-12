import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, View, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ScreenWrapper from '../components/ScreenWrapper';

type Med = { name: string; dosage?: string; time?: string; category?: string };

export default function EnterMedication() {
  const router = useRouter();
  const params = useLocalSearchParams<any>();
  const { email, password, name, dob, disease } = params;

  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState('Flexible');
  const [meds, setMeds] = useState<Med[]>([]);

  const addMed = () => {
    if (!medName.trim()) {
      Alert.alert('Please enter a medication name');
      return;
    }
    setMeds((s) => [...s, { name: medName.trim(), dosage: dosage.trim() || undefined, time: time.trim() || undefined, category }]);
    setMedName('');
    setDosage('');
    setTime('');
    setCategory('Flexible');
  };

  const removeMed = (index: number) => {
    setMeds((s) => s.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    // pass meds as JSON string to avoid serialization issues with useLocalSearchParams
    router.push(
      `/Confirmation?email=${encodeURIComponent(email || '')}&password=${encodeURIComponent(password || '')}&name=${encodeURIComponent(name || '')}&dob=${encodeURIComponent(dob || '')}&disease=${encodeURIComponent(disease || '')}&medications=${encodeURIComponent(JSON.stringify(meds))}`
    );
  };

  return (
    <ScreenWrapper>
      <Text style={styles.title}>Add medication</Text>

      <TextInput style={styles.input} placeholder="Medicine name" placeholderTextColor="#999" value={medName} onChangeText={setMedName} />
      <TextInput style={styles.input} placeholder="Dosage (e.g. 500mg)" placeholderTextColor="#999" value={dosage} onChangeText={setDosage} />
      <TextInput style={styles.input} placeholder="Time (e.g. 07:00 AM)" placeholderTextColor="#999" value={time} onChangeText={setTime} />

      <View style={styles.row}>
        <TouchableOpacity style={[styles.catButton, category === 'Critical' && styles.catActive]} onPress={() => setCategory('Critical')}>
          <Text style={styles.catText}>Critical</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.catButton, category === 'Time-sensitive' && styles.catActive]} onPress={() => setCategory('Time-sensitive')}>
          <Text style={styles.catText}>Time-sensitive</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.catButton, category === 'Flexible' && styles.catActive]} onPress={() => setCategory('Flexible')}>
          <Text style={styles.catText}>Flexible</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={addMed}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>

      <View style={{ width: '100%', marginTop: 12 }}>
        {meds.map((m, i) => (
          <View key={i} style={styles.medRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.medName}>{m.name}</Text>
              <Text style={styles.medMeta}>{m.dosage || '-'} • {m.time || '-'} • {m.category}</Text>
            </View>
            <TouchableOpacity onPress={() => removeMed(i)} style={styles.removeBtn}><Text style={{ color: '#fff' }}>Remove</Text></TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
        <Text style={styles.primaryButtonText}>Next</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 12 },
  input: { width: '100%', backgroundColor: 'rgba(255,255,255,0.06)', padding: 12, borderRadius: 8, color: '#fff', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  catButton: { padding: 10, borderRadius: 8, backgroundColor: '#333', flex: 1, marginHorizontal: 4, alignItems: 'center' },
  catActive: { backgroundColor: '#d45425' },
  catText: { color: '#fff' },
  addButton: { backgroundColor: '#444', padding: 10, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  addButtonText: { color: '#fff' },
  medRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
  medName: { color: '#fff', fontWeight: '600' },
  medMeta: { color: '#ccc', fontSize: 12 },
  removeBtn: { backgroundColor: '#7c3aed', padding: 8, borderRadius: 6 },
  primaryButton: { backgroundColor: '#d45425', paddingVertical: 14, borderRadius: 10, width: '100%', alignItems: 'center', marginTop: 18 },
  primaryButtonText: { color: '#fff', fontWeight: '600' },
});
