import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Smartphone, Monitor, MapPin, Clock, XCircle } from 'lucide-react-native';
import HistoryBackground from '../components/HistoryBackground';
import GlassContainer from '../components/GlassContainer';
import PageHeader from '../components/PageHeader';
import { COLORS, FONTS, SPACING } from '../constants/theme';

const SESSIONS = [
    {
        id: 1,
        device: 'iPhone 15 Pro',
        location: 'Paris, France',
        time: 'Active now',
        icon: Smartphone,
        isCurrent: true,
    },
    {
        id: 2,
        device: 'MacBook Pro 16"',
        location: 'Lyon, France',
        time: '2 hours ago',
        icon: Monitor,
        isCurrent: false,
    },
    {
        id: 3,
        device: 'Windows PC',
        location: 'Marseille, France',
        time: 'Feb 10, 2024 • 14:20',
        icon: Monitor,
        isCurrent: false,
    },
];

const SessionItem = ({ session }: any) => {
    const Icon = session.icon;
    return (
        <GlassContainer style={styles.sessionCard}>
            <View style={styles.sessionHeader}>
                <View style={styles.deviceIconContainer}>
                    <Icon size={24} color={session.isCurrent ? COLORS.secondary : COLORS.textSecondary} />
                </View>
                <View style={styles.sessionInfo}>
                    <View style={styles.titleRow}>
                        <Text style={styles.deviceTitle}>{session.device}</Text>
                        {session.isCurrent && (
                            <View style={styles.currentBadge}>
                                <Text style={styles.currentBadgeText}>Current</Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.detailRow}>
                        <MapPin size={14} color={COLORS.textSecondary} style={styles.detailIcon} />
                        <Text style={styles.detailText}>{session.location}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Clock size={14} color={COLORS.textSecondary} style={styles.detailIcon} />
                        <Text style={styles.detailText}>{session.time}</Text>
                    </View>
                </View>
                {!session.isCurrent && (
                    <TouchableOpacity style={styles.logoutSession}>
                        <XCircle size={20} color={COLORS.error} />
                    </TouchableOpacity>
                )}
            </View>
        </GlassContainer>
    );
};

export default function LoginActivityScreen() {
    return (
        <View style={styles.container}>
            <HistoryBackground />
            <SafeAreaView style={styles.safeArea}>
                <PageHeader title="Login Activity" />
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    <Text style={styles.sectionLabel}>Active Sessions</Text>
                    <Text style={styles.description}>
                        You're currently logged in to your account on these devices. You can log out of any session that doesn't belong to you.
                    </Text>

                    {SESSIONS.map((session) => (
                        <SessionItem key={session.id} session={session} />
                    ))}

                    <TouchableOpacity style={styles.logoutAllButton}>
                        <Text style={styles.logoutAllText}>Log Out of All Other Sessions</Text>
                    </TouchableOpacity>
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
    sectionLabel: {
        color: COLORS.text,
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: FONTS.bold,
        marginBottom: SPACING.s,
        marginLeft: SPACING.xs,
    },
    description: {
        color: COLORS.textSecondary,
        fontSize: 14,
        lineHeight: 20,
        marginBottom: SPACING.l,
        paddingHorizontal: SPACING.xs,
    },
    sessionCard: {
        marginBottom: SPACING.m,
        padding: SPACING.m,
    },
    sessionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deviceIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.m,
    },
    sessionInfo: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    deviceTitle: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: 'bold',
    },
    currentBadge: {
        backgroundColor: 'rgba(124, 77, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        marginLeft: SPACING.s,
    },
    currentBadgeText: {
        color: COLORS.secondary,
        fontSize: 10,
        fontWeight: 'bold',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    detailIcon: {
        marginRight: 4,
    },
    detailText: {
        color: COLORS.textSecondary,
        fontSize: 12,
    },
    logoutSession: {
        padding: SPACING.s,
    },
    logoutAllButton: {
        marginTop: SPACING.l,
        padding: SPACING.m,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    logoutAllText: {
        color: COLORS.text,
        fontSize: 14,
        fontWeight: '600',
    },
});
