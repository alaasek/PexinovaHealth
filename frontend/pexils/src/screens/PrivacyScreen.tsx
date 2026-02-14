import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HistoryBackground from '../components/HistoryBackground';
import GlassContainer from '../components/GlassContainer';
import PageHeader from '../components/PageHeader';
import { COLORS, FONTS, SPACING } from '../constants/theme';

export default function PrivacyScreen() {
    return (
        <View style={styles.container}>
            <HistoryBackground />
            <SafeAreaView style={styles.safeArea}>
                <PageHeader title="Privacy Policy" />
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    <GlassContainer>
                        <Text style={styles.lastUpdated}>Last updated: January 15, 2025</Text>

                        <Text style={styles.sectionTitle}>INFORMATION WE COLLECT</Text>
                        <Text style={styles.text}>
                            We collect information you provide directly to us, such as when you create an account, update your profile, make a purchase, or contact us for support. This information may include your name, email address, phone number, and payment information.
                        </Text>

                        <Text style={styles.sectionTitle}>HOW WE USE YOUR INFORMATION</Text>
                        <Text style={styles.text}>
                            We use the information we collect to provide, maintain, and improve our services, to process transactions, send you related information including purchase confirmations, invoices, technical notices, updates, security alerts, and support messages.
                        </Text>

                        <Text style={styles.sectionTitle}>INFORMATION SHARING</Text>
                        <Text style={styles.text}>
                            We do not share your personal information with third parties except as described in this privacy policy. We may share information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.
                        </Text>
                    </GlassContainer>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    safeArea: {
        flex: 1,
    },
    content: {
        padding: SPACING.m,
    },
    lastUpdated: {
        color: COLORS.textSecondary,
        fontSize: 14,
        marginBottom: SPACING.m,
        fontFamily: FONTS.regular,
    },
    sectionTitle: {
        color: COLORS.secondary, // Purple color as requested
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: FONTS.bold,
        marginTop: SPACING.m,
        marginBottom: SPACING.s,
        textTransform: 'uppercase',
    },
    text: {
        color: COLORS.text,
        fontSize: 15,
        lineHeight: 22,
        fontFamily: FONTS.regular,
        marginBottom: SPACING.m,
    },
});
