import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HistoryBackground from '../components/HistoryBackground';
import GlassContainer from '../components/GlassContainer';
import PageHeader from '../components/PageHeader';
import { COLORS, FONTS, SPACING } from '../constants/theme';

export default function TermsScreen() {
    return (
        <View style={styles.container}>
            <HistoryBackground />
            <SafeAreaView style={styles.safeArea}>
                <PageHeader title="Terms & Conditions" />
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    <GlassContainer>
                        <Text style={styles.lastUpdated}>Last updated: January 15, 2025</Text>

                        <Text style={styles.sectionTitle}>1. ACCEPTANCE OF TERMS</Text>
                        <Text style={styles.text}>
                            By accessing and using this application, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use this application.
                        </Text>

                        <Text style={styles.sectionTitle}>2. USE LICENSE</Text>
                        <Text style={styles.text}>
                            Permission is granted to temporarily use this application for personal, non-commercial use only. This is the grant of a license, not a transfer of title, and under this license you may not modify or copy the materials, use the materials for any commercial purpose, or attempt to decompile or reverse engineer any software contained in the application.
                        </Text>

                        <Text style={styles.sectionTitle}>3. USER ACCOUNTS</Text>
                        <Text style={styles.text}>
                            You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
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
