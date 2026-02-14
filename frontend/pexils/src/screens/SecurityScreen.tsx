import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, ShieldCheck, ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import HistoryBackground from '../components/HistoryBackground';
import GlassContainer from '../components/GlassContainer';
import PageHeader from '../components/PageHeader';
import { COLORS, FONTS, SPACING } from '../constants/theme';

export default function SecurityScreen() {
    const [activityAlerts, setActivityAlerts] = useState(true);
    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            <HistoryBackground />
            <SafeAreaView style={styles.safeArea}>
                <PageHeader title="Security" />
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                    {/* Privacy Section */}
                    <Text style={styles.sectionLabel}>PRIVACY</Text>
                    <GlassContainer style={styles.section}>
                        <View style={styles.row}>
                            <View style={styles.left}>
                                <Eye size={20} color={COLORS.textSecondary} style={styles.icon} />
                                <Text style={styles.label}>Activity Alerts</Text>
                            </View>
                            <Switch
                                value={activityAlerts}
                                onValueChange={setActivityAlerts}
                                trackColor={{ false: '#3A3A3C', true: COLORS.secondary }}
                                thumbColor={activityAlerts ? '#fff' : '#f4f3f4'}
                            />
                        </View>
                    </GlassContainer>

                    {/* Account Secure Card */}
                    <GlassContainer style={styles.secureCard}>
                        <View style={styles.secureContent}>
                            <View style={styles.secureIconContainer}>
                                <ShieldCheck size={24} color="#34C759" />
                            </View>
                            <View style={styles.secureTextContent}>
                                <Text style={styles.secureTitle}>Account Secure</Text>
                                <Text style={styles.secureSubtitle}>Last security check: 2 days ago</Text>
                            </View>
                        </View>
                    </GlassContainer>

                    {/* Additional Options */}
                    <GlassContainer style={styles.section}>
                        <TouchableOpacity
                            style={[styles.navRow, { borderBottomWidth: 0 }]}
                            onPress={() => navigation.navigate('LoginActivity')}
                        >
                            <Text style={styles.navLabel}>Login Activity</Text>
                            <ChevronRight size={20} color={COLORS.textSecondary} />
                        </TouchableOpacity>
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
    sectionLabel: {
        color: COLORS.textSecondary,
        fontSize: 12,
        fontFamily: FONTS.medium,
        marginBottom: SPACING.s,
        marginLeft: SPACING.xs,
    },
    section: {
        marginBottom: SPACING.l,
        padding: 0,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.m,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: SPACING.m,
        opacity: 0.8,
    },
    label: {
        color: COLORS.text,
        fontSize: 16,
        fontFamily: FONTS.medium,
    },
    secureCard: {
        marginBottom: SPACING.l,
        padding: SPACING.m,
        backgroundColor: 'rgba(52, 199, 89, 0.05)',
        borderColor: 'rgba(52, 199, 89, 0.2)',
    },
    secureContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    secureIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(52, 199, 89, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.m,
    },
    secureTextContent: {
        flex: 1,
    },
    secureTitle: {
        color: COLORS.text,
        fontSize: 16,
        fontFamily: FONTS.bold,
    },
    secureSubtitle: {
        color: COLORS.textSecondary,
        fontSize: 12,
        marginTop: 2,
        fontFamily: FONTS.regular,
    },
    navRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.m,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    navLabel: {
        color: COLORS.text,
        fontSize: 16,
        fontFamily: FONTS.medium,
    },
});
