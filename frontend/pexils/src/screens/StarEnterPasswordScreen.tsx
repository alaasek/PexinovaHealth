import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';

export default function StarEnterPasswordScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { email } = route.params || {};

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');

    const showError = (message: string) => {
        if (Platform.OS === 'web') {
            alert(message);
        } else {
            Alert.alert('Error', message);
        }
    };

    const handleSubmit = () => {
        if (!password || !confirm) return showError('Please fill all fields');
        if (password.length < 6) return showError('Password must be at least 6 characters');
        if (password !== confirm) return showError('Passwords do not match');

        // Proceed to Enter Name
        navigation.navigate('EnterName', { email, password });
    };

    return (
        <ScreenWrapper>
            <Text style={styles.title}>Enter Your Password</Text>
            <Text style={styles.subtitle}>Enter and confirm your new password</Text>

            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={confirm}
                onChangeText={setConfirm}
            />

            <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
                <Text style={styles.primaryButtonText}>Create Account</Text>
            </TouchableOpacity>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    title: { fontSize: 22, fontWeight: '700', color: '#fff', textAlign: 'center', marginBottom: 10, fontFamily: 'Poppins-Bold' },
    subtitle: { fontSize: 14, color: '#ccc', textAlign: 'center', marginBottom: 20, fontFamily: 'Poppins-Regular' },
    input: {
        backgroundColor: 'rgba(28,28,60,0.8)',
        color: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
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
