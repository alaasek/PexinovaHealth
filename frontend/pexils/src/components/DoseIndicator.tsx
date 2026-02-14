import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS } from '../constants/theme';

export type DoseStatus = 'onTime' | 'late' | 'missed' | 'upcoming';

interface DoseIndicatorProps {
    doses: { time: string; status: DoseStatus }[];
}

const DOSE_COLORS = {
    onTime: ['#CC7360', '#BA5A4A'] as const, // Gradient for onTime
    late: ['rgba(204, 115, 96, 0.4)', 'rgba(204, 115, 96, 0.2)'] as const,
    missed: ['#3A394C', '#2A2F4A'] as const,
    upcoming: ['#3A394C', '#2A2F4A'] as const,
};

export default function DoseIndicator({ doses }: DoseIndicatorProps) {
    return (
        <View style={styles.container}>
            <View style={styles.labelsContainer}>
                {doses.map((dose, index) => (
                    <Text key={index} style={styles.timeLabel}>
                        {dose.time}
                    </Text>
                ))}
            </View>
            <View style={styles.barContainer}>
                {doses.map((dose, index) => (
                    <LinearGradient
                        key={index}
                        colors={DOSE_COLORS[dose.status]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[
                            styles.segment,
                            {
                                borderLeftWidth: index === 0 ? 0 : 2,
                                borderLeftColor: '#1C0C26', // Match inner rail
                            },
                        ]}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 140,
        alignItems: 'flex-end',
    },
    labelsContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'flex-end',
        marginBottom: 4,
        gap: 12,
    },
    timeLabel: {
        color: '#FFFFFF',
        fontSize: 10,
        fontFamily: FONTS.bold,
        opacity: 0.8,
    },
    barContainer: {
        width: '100%',
        height: 24,
        backgroundColor: '#3A394C',
        borderRadius: 12,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    segment: {
        flex: 1,
        height: '100%',
    },
});
