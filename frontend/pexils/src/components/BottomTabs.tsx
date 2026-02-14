import React from 'react';
import { StyleSheet, TouchableOpacity, View, Dimensions } from 'react-native';
import { Home, Bell, User, PieChart, Sprout, Settings } from 'lucide-react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const COLORS = {
    background: '#1E1B2E',
    active: '#FF5722',
    inactive: '#8E8E9F',
    white: '#FFFFFF'
};

export default function BottomTabs() {
    const navigation = useNavigation<any>();
    const currentRouteName = useNavigationState((state) =>
        state ? state.routes[state.index].name : 'Settings'
    );

    const tabs = [
        { name: 'Home', icon: Home, label: 'Home' },
        { name: 'Notifications', icon: Bell, label: 'Notifications' },
        { name: 'Bonus', icon: Sprout, label: 'Bonus' },
        { name: 'Statistics', icon: PieChart, label: 'Progress' },
        { name: 'Settings', icon: User, label: 'Settings' },
    ];

    return (
        <View style={styles.navBar}>
            {tabs.map((tab) => {
                const isActive = currentRouteName === tab.name;
                const Icon = tab.icon;

                return (
                    <TouchableOpacity
                        key={tab.name}
                        style={styles.navItem}
                        onPress={() => {
                            navigation.navigate(tab.name as any);
                        }}
                    >
                        {isActive ? (
                            <View style={styles.activeNavIconBg}>
                                <Icon size={24} color={COLORS.white} />
                            </View>
                        ) : (
                            <Icon size={24} color={COLORS.inactive} />
                        )}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        paddingVertical: 15,
        paddingHorizontal: 15,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopWidth: 0,
        height: 80,
        paddingBottom: 25,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
    },
    activeNavIconBg: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.active,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.active,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
});
