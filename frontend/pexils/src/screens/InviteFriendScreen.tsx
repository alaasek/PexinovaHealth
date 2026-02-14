import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HistoryBackground from '../components/HistoryBackground';
import GlassContainer from '../components/GlassContainer';
import PageHeader from '../components/PageHeader';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import { Copy, Share2 } from 'lucide-react-native';

export default function InviteFriendScreen() {
    const inviteCode = "PEXILS-2024";

    const onShare = async () => {
        try {
            const result = await Share.share({
                message:
                    `Join me on Pexils! Use my invite code: ${inviteCode}`,
            });
        } catch (error: any) {
            // Error handling would go here
        }
    };

    return (
        <View style={styles.container}>
            <HistoryBackground />
            <SafeAreaView style={styles.safeArea}>
                <PageHeader title="Invite a Friend" />
                <View style={styles.content}>
                    <GlassContainer style={styles.centerContainer}>
                        <Text style={styles.title}>Invite Friends</Text>
                        <Text style={styles.subtitle}>Get rewards for every friend who joins!</Text>

                        <View style={styles.codeContainer}>
                            <Text style={styles.codeLabel}>Your Invite Code</Text>
                            <TouchableOpacity style={styles.codeBox}>
                                <Text style={styles.code}>{inviteCode}</Text>
                                <Copy size={20} color={COLORS.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.shareButton} onPress={onShare}>
                            <Share2 size={24} color={COLORS.text} style={styles.shareIcon} />
                            <Text style={styles.shareText}>Share Link</Text>
                        </TouchableOpacity>
                    </GlassContainer>
                </View>
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
        flex: 1,
        justifyContent: 'center',
        padding: SPACING.m,
    },
    centerContainer: {
        alignItems: 'center',
        padding: SPACING.xl,
    },
    title: {
        color: COLORS.text,
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: FONTS.bold,
        marginBottom: SPACING.s,
    },
    subtitle: {
        color: COLORS.textSecondary,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: SPACING.xl,
    },
    codeContainer: {
        width: '100%',
        marginBottom: SPACING.xl,
    },
    codeLabel: {
        color: COLORS.textSecondary,
        marginBottom: SPACING.xs,
        marginLeft: SPACING.xs,
    },
    codeBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        padding: SPACING.m,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    code: {
        color: COLORS.text,
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.m,
        paddingHorizontal: SPACING.xl,
        borderRadius: 30,
        width: '100%',
        justifyContent: 'center',
    },
    shareIcon: {
        marginRight: SPACING.s,
    },
    shareText: {
        color: COLORS.text,
        fontSize: 18,
        fontWeight: 'bold',
    },
});
