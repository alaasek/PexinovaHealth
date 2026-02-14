import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { COLORS, SPACING } from '../constants/theme';

interface GlassContainerProps {
    children: React.ReactNode;
    style?: ViewStyle;
    intensity?: number;
}

export default function GlassContainer({ children, style, intensity = 20 }: GlassContainerProps) {
    return (
        <BlurView intensity={intensity} tint="dark" style={[styles.container, style]}>
            {children}
        </BlurView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.glassBackground,
        borderColor: COLORS.glassBorder,
        borderWidth: 1,
        borderRadius: SPACING.l,
        overflow: 'hidden',
        padding: SPACING.s,
    },
});
