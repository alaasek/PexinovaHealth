import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';

export default function StarResetPasswordScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { email, resetToken } = route.params || {};

    const [newPassword, setNewPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReset = async () => {
        if (!newPassword || !confirm) return Alert.alert('Please fill all fields');
        if (newPassword.length < 6) return Alert.alert('Password must be at least 6 characters');
        if (newPassword !== confirm) return Alert.alert('Passwords do not match');

        if (!resetToken) return Alert.alert('Reset token missing');

        setLoading(true);

        try {
            //   const res = await api.resetPassword(resetToken, newPassword);

            //   if (res.success) {
            //     Alert.alert('Success', 'Password reset successfully');
            //     router.replace('/Login');
            //   } else {
            //     Alert.alert('Error', res.message || 'Something went wrong');
            //   }
            setTimeout(() => {
                setLoading(false);
                Alert.alert("Success", "Password reset successfully");
                navigation.popToTop(); // Go back to landing or login
                navigation.navigate('Login');
            }, 1000);

        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Something went wrong');
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    <Text style={styles.title}>Set New Password</Text>
                    <Text style={styles.subtitle}>Enter and confirm your new password</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="New Password"
                        placeholderTextColor="#aaa"
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        placeholderTextColor="#aaa"
                        secureTextEntry
                        value={confirm}
                        onChangeText={setConfirm}
                    />

                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={handleReset}
                        disabled={loading}
                    >
                        <Text style={styles.primaryButtonText}>{loading ? 'Resetting...' : 'Reset Password'}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 22, fontWeight: '700', color: '#fff', textAlign: 'center', marginBottom: 10, fontFamily: 'Poppins-Bold' },
    subtitle: { fontSize: 14, color: '#ccc', marginBottom: 20, textAlign: 'center', fontFamily: 'Poppins-Regular' },
    input: {
        backgroundColor: 'rgba(28,28,60,0.8)',
        color: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
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
