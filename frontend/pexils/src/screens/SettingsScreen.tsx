import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Bell,
    ShieldCheck,
    FileText,
    Lock,
    HelpCircle,
    User,
    LogOut
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import HistoryBackground from '../components/HistoryBackground';
import GlassContainer from '../components/GlassContainer';
import MenuItem from '../components/MenuItem';
import BottomTabs from '../components/BottomTabs';
import LogoutModal from '../components/LogoutModal';
import { COLORS, FONTS, SPACING } from '../constants/theme';

export default function SettingsScreen() {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const navigation = useNavigation<any>();

    const handleLogout = () => {
        setLogoutModalVisible(false);
        // Add real logout logic here
    };

    return (
        <View style={styles.container}>
            <HistoryBackground />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>settings</Text>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Account Section */}
                    <GlassContainer style={styles.section}>
                        <MenuItem
                            icon={User}
                            label="Account"
                            onPress={() => navigation.navigate('Account')}
                        />
                        <MenuItem
                            icon={Bell}
                            label="Notifications"
                            rightElement={
                                <Switch
                                    value={notificationsEnabled}
                                    onValueChange={setNotificationsEnabled}
                                    trackColor={{ false: '#3A3A3C', true: COLORS.secondary }}
                                    thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
                                />
                            }
                            showBorder={false}
                        />
                    </GlassContainer>

                    {/* Security & Legal Section */}
                    <GlassContainer style={styles.section}>
                        <MenuItem
                            icon={ShieldCheck}
                            label="Security"
                            onPress={() => navigation.navigate('Security')}
                        />
                        <MenuItem
                            icon={FileText}
                            label="Terms & Conditions"
                            onPress={() => navigation.navigate('Terms')}
                        />
                        <MenuItem
                            icon={Lock}
                            label="Privacy Policy"
                            onPress={() => navigation.navigate('Privacy')}
                        />
                        <MenuItem
                            icon={HelpCircle}
                            label="Help"
                            onPress={() => navigation.navigate('Help')}
                            showBorder={false}
                        />
                    </GlassContainer>

                    {/* Actions Section */}
                    <GlassContainer style={styles.section}>
                        <MenuItem
                            icon={LogOut}
                            label="Logout"
                            showBorder={false}
                            onPress={() => setLogoutModalVisible(true)}
                        />
                    </GlassContainer>

                    <View style={{ height: 100 }} />
                </ScrollView>

                <BottomTabs />
            </SafeAreaView>

            <LogoutModal
                visible={logoutModalVisible}
                onClose={() => setLogoutModalVisible(false)}
                onConfirm={handleLogout}
            />
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
    header: {
        paddingHorizontal: SPACING.l,
        paddingVertical: SPACING.m,
    },
    headerTitle: {
        fontSize: 28,
        color: '#A0A0A0',
        fontFamily: FONTS.bold,
    },
    scrollContent: {
        paddingHorizontal: SPACING.m,
        paddingTop: SPACING.s,
        paddingBottom: SPACING.xxl,
    },
    section: {
        marginBottom: SPACING.l,
    },
});
