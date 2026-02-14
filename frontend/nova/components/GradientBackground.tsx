import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientBackgroundProps {
    children?: React.ReactNode;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({ children }) => {
    return (
        <View style={styles.container}>
            {/* Base dark-to-slightly-lighter gradient */}
            <LinearGradient
                colors={['#0D0B1A', '#080610', '#0A0D1F', '#080610']}
                locations={[0, 0.4, 0.7, 1]}
                style={StyleSheet.absoluteFill}
            />
            {/* Top-left purple/plum glow */}
            <LinearGradient
                colors={['rgba(61,20,56,0.85)', 'rgba(42,14,46,0.5)', 'transparent']}
                locations={[0, 0.4, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.8, y: 0.6 }}
                style={styles.glowTopLeft}
            />

            {/* Center-right teal/navy glow */}
            <LinearGradient
                colors={['rgba(20,48,64,0.7)', 'rgba(15,37,53,0.4)', 'transparent']}
                locations={[0, 0.35, 1]}
                start={{ x: 1, y: 0.3 }}
                end={{ x: 0.1, y: 0.7 }}
                style={styles.glowCenterRight}
            />

            {/* Bottom-left muted purple glow */}
            <LinearGradient
                colors={['rgba(46,21,48,0.6)', 'rgba(26,13,32,0.35)', 'transparent']}
                locations={[0, 0.45, 1]}
                start={{ x: 0, y: 1 }}
                end={{ x: 0.7, y: 0.3 }}
                style={styles.glowBottomLeft}
            />

            {/* Subtle top-center vignette for depth */}
            <LinearGradient
                colors={['rgba(10,13,31,0.6)', 'transparent']}
                start={{ x: 0.5, y: 0.3 }}
                end={{ x: 0.5, y: 0.8 }}
                style={StyleSheet.absoluteFill}
            />

            {/* Content rendered on top */}
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#080610',
    },
    glowTopLeft: {
        ...StyleSheet.absoluteFillObject,
    },
    glowCenterRight: {
        ...StyleSheet.absoluteFillObject,
    },
    glowBottomLeft: {
        ...StyleSheet.absoluteFillObject,
    },
    content: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
    },
});

export default GradientBackground;
