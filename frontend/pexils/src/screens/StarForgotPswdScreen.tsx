import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';

export default function StarForgotPswdScreen() {
    const [email, setEmail] = useState('');
    const navigation = useNavigation<any>();

    const handleSendCode = async () => {
        // MOCK
        // const res = await api.sendCode(email);
        console.log("sending code to ", email);
        navigation.navigate('VerifyCode', { email }); // Check route naming
    };

    return (
        <ScreenWrapper>
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
                Provide your account's Email ID to reset your password
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Enter your Email ID"
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />

            <TouchableOpacity style={styles.primaryButton} onPress={handleSendCode}>
                <Text style={styles.primaryButtonText}>Send Code</Text>
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
        marginBottom: 10,
        fontFamily: 'Poppins-Bold'
    },
    subtitle: {
        fontSize: 14,
        color: '#ccc',
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: 'Poppins-Regular'
    },
    input: {
        backgroundColor: 'rgba(28,28,60,0.8)',
        color: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        fontFamily: 'Poppins-Regular'
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
