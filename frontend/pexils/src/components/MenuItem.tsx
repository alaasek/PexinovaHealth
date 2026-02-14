import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight, LucideIcon } from 'lucide-react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';

interface MenuItemProps {
    icon: LucideIcon;
    label: string;
    rightElement?: React.ReactNode;
    onPress?: () => void;
    showBorder?: boolean;
}

export default function MenuItem({ icon: Icon, label, rightElement, onPress, showBorder = true }: MenuItemProps) {
    return (
        <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={[styles.container, showBorder && styles.border]}>
            <View style={styles.leftContent}>
                <Icon size={20} color={COLORS.text} style={styles.icon} />
                <Text style={styles.label}>{label}</Text>
            </View>
            <View style={styles.rightContent}>
                {rightElement || <ChevronRight size={20} color={COLORS.textSecondary} />}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: SPACING.m,
    },
    border: {
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: SPACING.m,
    },
    label: {
        color: COLORS.text,
        fontSize: 16,
        fontFamily: FONTS.medium,
    },
    rightContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
