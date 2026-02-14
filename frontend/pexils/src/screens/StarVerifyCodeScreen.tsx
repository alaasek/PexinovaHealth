import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper'; // ⚠️ adapte le chemin si nécessaire

export default function StarVerifyCodeScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { email } = route.params || {};

    const [code, setCode] = useState('');

    const handleVerify = async () => {
        // const res = await api.verifyCode(email, code);

        // if (res.success) {
        //   router.push({
        //     pathname: '/resetPassword',
        //     params: { 
        //       email,           // 🔹 ajouté pour l'email
        //       resetToken: res.data.resetToken,
        //     },
        //   });
        // } else {
        //   Alert.alert('Error', res.message || 'Code invalide');
        // }
        console.log("verifying code");
        navigation.navigate('ResetPassword', { email, resetToken: 'mock_token' });

    };

    return (
        <ScreenWrapper>
            <Text style={styles.title}>Verify Reset Code</Text>
            <Text style={styles.subtitle}>Enter the code sent to {email}</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter code"
                placeholderTextColor="#aaa"
                keyboardType="numeric"
                maxLength={5}
                value={code}
                onChangeText={setCode}
            />

            <TouchableOpacity style={styles.primaryButton} onPress={handleVerify}>
                <Text style={styles.primaryButtonText}>Verify Code</Text>
            </TouchableOpacity>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
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
        textAlign: 'center',
        fontSize: 18,
        fontFamily: 'Poppins-Regular'
    },
    primaryButton: {
        backgroundColor: '#d45425',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    primaryButtonText: { color: '#fff', fontSize: 18, fontWeight: '600', fontFamily: 'Poppins-SemiBold' },
});
