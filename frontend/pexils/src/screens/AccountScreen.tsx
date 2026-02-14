import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Mail, Phone, MapPin, ChevronRight } from 'lucide-react-native';
import HistoryBackground from '../components/HistoryBackground';
import GlassContainer from '../components/GlassContainer';
import PageHeader from '../components/PageHeader';
import MenuItem from '../components/MenuItem';
import BottomTabs from '../components/BottomTabs';
import { COLORS, FONTS, SPACING } from '../constants/theme';

export default function AccountScreen() {
    return (
        <View style={styles.container}>
            <HistoryBackground />
            <SafeAreaView style={styles.safeArea}>
                <PageHeader title="Account" />
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Profile Picture Section */}
                    <View style={styles.profileHeader}>
                        <View style={styles.avatarContainer}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>JD</Text>
                            </View>
                            <TouchableOpacity style={styles.cameraButton}>
                                <Camera size={20} color={COLORS.text} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.userName}>John Doe</Text>
                        <Text style={styles.userEmail}>john.doe@example.com</Text>
                    </View>

                    {/* Personal Info Section */}
                    <Text style={styles.sectionLabel}>Personal Information</Text>
                    <GlassContainer style={styles.section}>
                        <TouchableOpacity style={styles.infoRow}>
                            <View style={styles.infoLeft}>
                                <Mail size={20} color={COLORS.textSecondary} style={styles.icon} />
                                <View>
                                    <Text style={styles.infoLabel}>Email</Text>
                                    <Text style={styles.infoValue}>john.doe@example.com</Text>
                                </View>
                            </View>
                            <ChevronRight size={20} color={COLORS.textSecondary} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.infoRow}>
                            <View style={styles.infoLeft}>
                                <Phone size={20} color={COLORS.textSecondary} style={styles.icon} />
                                <View>
                                    <Text style={styles.infoLabel}>Phone</Text>
                                    <Text style={styles.infoValue}>+1 (555) 123-4567</Text>
                                </View>
                            </View>
                            <ChevronRight size={20} color={COLORS.textSecondary} />
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                            <View style={styles.infoLeft}>
                                <MapPin size={20} color={COLORS.textSecondary} style={styles.icon} />
                                <View>
                                    <Text style={styles.infoLabel}>Address</Text>
                                    <Text style={styles.infoValue}>123 Space St, Nebula City</Text>
                                </View>
                            </View>
                            <ChevronRight size={20} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                    </GlassContainer>

                    {/* Account Actions */}
                    <TouchableOpacity style={styles.deleteButton}>
                        <Text style={styles.deleteButtonText}>Delete Account</Text>
                    </TouchableOpacity>
                    <View style={{ height: 100 }} />
                </ScrollView>
            </SafeAreaView>
            <BottomTabs />
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
    profileHeader: {
        alignItems: 'center',
        marginVertical: SPACING.xl,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: SPACING.m,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    avatarText: {
        color: COLORS.text,
        fontSize: 32,
        fontFamily: FONTS.bold,
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.primary,
        padding: SPACING.s,
        borderRadius: 15,
    },
    userName: {
        color: COLORS.text,
        fontSize: 24,
        fontFamily: FONTS.bold,
    },
    userEmail: {
        color: COLORS.textSecondary,
        fontSize: 16,
        marginTop: 4,
        fontFamily: FONTS.regular,
    },
    sectionLabel: {
        color: COLORS.textSecondary,
        fontSize: 14,
        textTransform: 'uppercase',
        marginBottom: SPACING.s,
        marginLeft: SPACING.xs,
        fontFamily: FONTS.medium,
    },
    section: {
        marginBottom: SPACING.l,
        padding: 0,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.m,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    infoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: SPACING.m,
    },
    infoLabel: {
        color: COLORS.textSecondary,
        fontSize: 12,
        fontFamily: FONTS.regular,
    },
    infoValue: {
        color: COLORS.text,
        fontSize: 16,
        fontFamily: FONTS.medium,
    },
    deleteButton: {
        backgroundColor: 'rgba(239, 69, 101, 0.1)',
        padding: SPACING.m,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: SPACING.m,
        borderWidth: 1,
        borderColor: 'rgba(239, 69, 101, 0.3)',
    },
    deleteButtonText: {
        color: COLORS.error,
        fontFamily: FONTS.semiBold,
        fontSize: 16,
    },
});
