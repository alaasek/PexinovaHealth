import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export default function HistoryBackground() {
    const id = useMemo(() => Math.random().toString(36).substring(2, 9), []);

    return (
        <View style={styles.container}>
            <Svg
                width={width}
                height={height}
                style={StyleSheet.absoluteFill}
                viewBox={`0 0 ${width} ${height}`}
            >
                <Defs>
                    {/* Unique IDs driven by useId to prevent navigation collisions */}
                    <RadialGradient id={`base-${id}`} cx="50%" cy="50%" rx="80%" ry="80%">
                        <Stop offset="0%" stopColor="#0D0B1A" stopOpacity="1" />
                        <Stop offset="100%" stopColor="#080610" stopOpacity="1" />
                    </RadialGradient>

                    <RadialGradient id={`purpleTopLeft-${id}`} cx="15%" cy="10%" rx="55%" ry="40%">
                        <Stop offset="0%" stopColor="#3D1438" stopOpacity="0.9" />
                        <Stop offset="40%" stopColor="#2A0E2E" stopOpacity="0.6" />
                        <Stop offset="100%" stopColor="#0D0B1A" stopOpacity="0" />
                    </RadialGradient>

                    <RadialGradient id={`tealRight-${id}`} cx="75%" cy="50%" rx="50%" ry="45%">
                        <Stop offset="0%" stopColor="#143040" stopOpacity="0.7" />
                        <Stop offset="35%" stopColor="#0F2535" stopOpacity="0.5" />
                        <Stop offset="100%" stopColor="#0D0B1A" stopOpacity="0" />
                    </RadialGradient>

                    <RadialGradient id={`purpleBottomLeft-${id}`} cx="20%" cy="80%" rx="50%" ry="35%">
                        <Stop offset="0%" stopColor="#2E1530" stopOpacity="0.6" />
                        <Stop offset="45%" stopColor="#1A0D20" stopOpacity="0.4" />
                        <Stop offset="100%" stopColor="#0D0B1A" stopOpacity="0" />
                    </RadialGradient>

                    <RadialGradient id={`centerDeep-${id}`} cx="50%" cy="45%" rx="60%" ry="50%">
                        <Stop offset="0%" stopColor="#0A0D1F" stopOpacity="0.8" />
                        <Stop offset="100%" stopColor="#080610" stopOpacity="0" />
                    </RadialGradient>
                </Defs>

                <Rect x="0" y="0" width={width} height={height} fill={`url(#base-${id})`} />
                <Rect x="0" y="0" width={width} height={height} fill={`url(#centerDeep-${id})`} />
                <Rect x="0" y="0" width={width} height={height} fill={`url(#purpleTopLeft-${id})`} />
                <Rect x="0" y="0" width={width} height={height} fill={`url(#tealRight-${id})`} />
                <Rect x="0" y="0" width={width} height={height} fill={`url(#purpleBottomLeft-${id})`} />
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#080610',
    },
});
