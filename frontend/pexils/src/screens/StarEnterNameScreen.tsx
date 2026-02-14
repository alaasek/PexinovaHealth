import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';

export default function StarEnterNameScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { email, password } = route.params || {};
    const [name, setName] = useState('');

    const showError = (message: string) => {
        if (Platform.OS === 'web') {
            alert(message);
        } else {
            Alert.alert('Error', message);
        }
    };

    const handleNext = () => {
        if (!name.trim()) {
            showError('Name is required');
            return;
        }

        navigation.navigate('EnterDOB', { email, password, name });
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
    title: { fontSize: 22, fontWeight: '700', color: '#fff', textAlign: 'center', marginBottom: 20, fontFamily: 'Poppins-Bold' },
    input: {
        backgroundColor: 'rgba(28,28,60,0.8)',
        color: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        fontFamily: 'Poppins-Regular',
    },
    primaryButton: {
        backgroundColor: '#d45425',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', fontFamily: 'Poppins-SemiBold' },
});
