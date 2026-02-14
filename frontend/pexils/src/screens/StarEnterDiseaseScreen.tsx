import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';

export default function StarEnterDiseaseScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { email, password, name, dob } = route.params || {};
    const [disease, setDisease] = useState("");

    const handleNext = () => {
        if (!disease.trim()) {
            Alert.alert("Error", "Please enter your disease or type 'None'");
            return;
        }

        navigation.navigate('EnterMedication', { email, password, name, dob, disease: disease.trim() });
    };

    return (
        <ScreenWrapper>
            <Text style={styles.title}>Do you have any disease?</Text>

            <TextInput
                style={styles.input}
                placeholder="e.g. Diabetes or None"
                placeholderTextColor="#999"
                value={disease}
                onChangeText={setDisease}
            />

            <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
                <Text style={styles.primaryButtonText}>Next</Text>
            </TouchableOpacity>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    title: { fontSize: 22, fontWeight: "700", color: "#fff", marginBottom: 20, fontFamily: 'Poppins-Bold' },
    input: {
        width: "100%",
        backgroundColor: "rgba(255,255,255,0.06)",
        padding: 12,
        borderRadius: 8,
        color: "#fff",
        marginBottom: 12,
        fontFamily: 'Poppins-Regular'
    },
    primaryButton: { backgroundColor: "#d45425", paddingVertical: 14, borderRadius: 10, width: "100%", alignItems: "center" },
    primaryButtonText: { color: "#fff", fontWeight: "600", fontFamily: 'Poppins-SemiBold' },
});
