import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import { COLORS, SPACING } from '../constants/theme';

interface LogoutModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function LogoutModal({ visible, onClose, onConfirm }: LogoutModalProps) {
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <BlurView intensity={30} tint="dark" style={styles.blurContainer}>
                    <GlassContainer style={styles.modal}>
                        <Text style={styles.title}>Log Out</Text>
                        <Text style={styles.subtitle}>Are you sure you want to log out of your account?</Text>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
                                <Text style={styles.confirmText}>Log Out</Text>
                            </TouchableOpacity>
                        </View>
                    </GlassContainer>
                </BlurView>
            </View>
        </Modal>
    );
}

// Internal GlassContainer for the modal to avoid dependency circularity if any
const GlassContainer = ({ children, style }: any) => (
    <View style={[styles.glass, style]}>
        {children}
    </View>
);

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    blurContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        width: '85%',
        padding: SPACING.l,
        borderRadius: 24,
        alignItems: 'center',
    },
    glass: {
        backgroundColor: 'rgba(30, 30, 45, 0.95)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
    },
    title: {
        color: COLORS.text,
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: SPACING.s,
    },
    subtitle: {
        color: COLORS.textSecondary,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: SPACING.xl,
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        gap: SPACING.m,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: SPACING.m,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    confirmButton: {
        flex: 1,
        paddingVertical: SPACING.m,
        borderRadius: 12,
        backgroundColor: COLORS.error,
        alignItems: 'center',
    },
    cancelText: {
        color: COLORS.text,
        fontWeight: '600',
    },
    confirmText: {
        color: COLORS.text,
        fontWeight: '600',
    },
});
