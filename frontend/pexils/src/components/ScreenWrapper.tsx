import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';

export default function ScreenWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ImageBackground
            source={require('../../assets/starhealth/Background.png')}
            resizeMode="cover"
            style={styles.background}
        >
            <SafeAreaView style={styles.safe}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.flex}
                >
                    <ScrollView
                        contentContainerStyle={styles.container}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        {children}
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1 },
    safe: { flex: 1 },
    flex: { flex: 1 },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
});
