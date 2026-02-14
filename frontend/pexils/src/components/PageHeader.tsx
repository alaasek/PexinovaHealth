import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Check, ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import { BlurView } from 'expo-blur';

interface PageHeaderProps {
    title: string;
}

export default function PageHeader({ title }: PageHeaderProps) {
    const navigation = useNavigation();

    return (
        <BlurView intensity={20} tint="dark" style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <ChevronLeft size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.placeholder} />
        </BlurView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.m,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    backButton: {
        padding: SPACING.xs,
    },
    title: {
        color: COLORS.text,
        fontSize: 18,
        fontFamily: FONTS.semiBold,
    },
    placeholder: {
        width: 24, // To balance the back button
    },
});
