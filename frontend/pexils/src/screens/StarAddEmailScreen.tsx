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
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';

export default function StarAddEmailScreen() {
    const navigation = useNavigation<any>();
    const [email, setEmail] = useState('');

    const handleContinue = async () => {
        // Logic from user code:
        try {
            //   const res = await fetch("http://localhost:5000/api/auth/send-code", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ email }),
            //   });
            //   const data = await res.json();

            //   if (data.success) {
            //     router.push({ pathname: "/verify-email", params: { email } });
            //   } else {
            //     alert(data.message || "Failed to send code");
            //   }
            console.log("Mock sending code to", email);
            navigation.navigate('VerifyEmail', { email });
        } catch (err) {
            alert("Server error: " + err);
        }
    };

    return (
        <ScreenWrapper>
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
        marginBottom: 16,
        width: '100%',
    },
    primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', fontFamily: 'Poppins-SemiBold' },
});
