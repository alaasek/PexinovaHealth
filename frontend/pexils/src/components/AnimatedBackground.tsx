import React, { useMemo } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface StarProps {
    size: number;
    top: number;
    left: number;
    opacity: number;
}

const Star = ({ size, top, left, opacity }: StarProps) => (
    <View
        style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: '#FFFFFF',
            top,
            left,
            opacity,
        }}
    />
);

export default function AnimatedBackground() {
    const stars = useMemo(() => {
        return Array.from({ length: 45 }).map((_, i) => ({
            id: i,
            size: Math.random() * 1.2 + 0.6, // Smaller stars
            top: Math.random() * height,
            left: Math.random() * width,
            opacity: Math.random() * 0.5 + 0.1,
        }));
    }, []);

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#0B0F2A', '#1A0F3A', '#071B2F']}
                style={StyleSheet.absoluteFill}
            />
            {stars.map(star => (
                <Star
                    key={star.id}
                    size={star.size}
                    top={star.top}
                    left={star.left}
                    opacity={star.opacity}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#0B0F2A',
    },
});
