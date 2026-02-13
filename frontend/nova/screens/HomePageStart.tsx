import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Animated,
    TouchableOpacity,
    Image,
    ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'HomePageStart'>;

import { useGame } from '../context/GameContext';

const HomePageStart: React.FC<Props> = ({ navigation }) => {
    const { score } = useGame(); // Get score from context

    // Animation States
    const [starsOpacity1] = useState(new Animated.Value(0.3));
    const [starsOpacity2] = useState(new Animated.Value(0.5));
    // Alien Float Animations
    const [alienFloat1] = useState(new Animated.Value(0));
    const [alienFloat2] = useState(new Animated.Value(0));
    const [alienFloat3] = useState(new Animated.Value(0));

    useEffect(() => {
        // --- Stars Animation (Same as Notifications) ---
        Animated.loop(
            Animated.sequence([
                Animated.timing(starsOpacity1, { toValue: 1, duration: 2500, useNativeDriver: true }),
                Animated.timing(starsOpacity1, { toValue: 0.3, duration: 2500, useNativeDriver: true }),
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(starsOpacity2, { toValue: 1, duration: 1500, useNativeDriver: true }),
                Animated.timing(starsOpacity2, { toValue: 0.2, duration: 1500, useNativeDriver: true }),
            ])
        ).start();

        // --- Aliens Floating Animation ---
        const floatAlien = (anim: Animated.Value, delay: number) => {
            Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(anim, { toValue: -15, duration: 2000, useNativeDriver: true }),
                    Animated.timing(anim, { toValue: 0, duration: 2000, useNativeDriver: true }),
                ])
            ).start();
        };

        floatAlien(alienFloat1, 0);
        floatAlien(alienFloat2, 500);
        floatAlien(alienFloat3, 1000);

    }, []);
    // ...
    // ...
    // ...
    return (
        <ImageBackground
            source={require('../assets/Background.png')}
            style={styles.container}
            resizeMode="cover"
        >

            {/* Animated Stars Layers */}
            <Animated.Image
                source={require('../assets/stars.png')}
                style={[styles.stars, { opacity: starsOpacity1 }]}
                resizeMode="cover"
            />
            <Animated.Image
                source={require('../assets/stars.png')}
                style={[
                    styles.stars,
                    { opacity: starsOpacity2, transform: [{ rotate: '180deg' }] }
                ]}
                resizeMode="cover"
            />

            <SafeAreaView style={styles.safeArea}>

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.scoreContainer}>
                        <Text style={styles.scoreText}>Score : </Text>
                        <Text style={styles.scoreValue}>{score} stars</Text>
                        <Image
                            source={require('../assets/Sparkles.png')}
                            style={styles.starIcon}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Small Helmet */}
                    <Image
                        source={require('../assets/helmet.png')}
                        style={styles.helmet}
                        resizeMode="contain"
                    />
                </View>

                {/* Space Center */}
                <View style={styles.spaceArea}>

                    {/* Aliens scattered AROUND (not on) the planet */}
                    {/* Alien 1: Top Left */}
                    <Animated.Image
                        source={require('../assets/Alien.png')}
                        style={[styles.alien, styles.alien1, { transform: [{ translateY: alienFloat1 }] }]}
                        resizeMode="contain"
                    />
                    {/* Alien 2: Top Right */}
                    <Animated.Image
                        source={require('../assets/Alien.png')}
                        style={[styles.alien, styles.alien2, { transform: [{ translateY: alienFloat2 }] }]}
                        resizeMode="contain"
                    />
                    {/* Alien 3: Mid Right */}
                    <Animated.Image
                        source={require('../assets/Alien.png')}
                        style={[styles.alien, styles.alien3, { transform: [{ translateY: alienFloat3 }] }]}
                        resizeMode="contain"
                    />

                    {/* Planet (Smaller) */}
                    <Image
                        source={require('../assets/planet.png')}
                        style={styles.planet}
                        resizeMode="contain"
                    />
                </View>

                {/* Modal Notification Card (Centered Overlay) */}
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Hi astronaut! 🚀</Text>
                        <Text style={styles.modalText}>
                            It’s time to hunt a start ✨{'\n'}
                            and protect your planet{'\n'}
                            by taking your medicine.
                        </Text>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => navigation.navigate('Notifications')}
                        >
                            <Text style={styles.actionButtonText}>I will have it right Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Bottom Section */}
                <View style={styles.bottomSection}>
                    {/* Rocket */}
                    <Image
                        source={require('../assets/nave.png')}
                        style={styles.rocket}
                        resizeMode="contain"
                    />

                    {/* Greeting Card (Background) */}
                    <View style={styles.glassCard}>
                        <View style={styles.textContainer}>
                            <Text style={styles.greetingTitle}>Hi Harry!</Text>
                            <Text style={styles.greetingSubtitle}>Welcome back, astronaut 🚀</Text>
                            <Text style={styles.greetingBody}>Your galaxy is waiting for you ✨</Text>
                        </View>
                        <View style={styles.profileContainer}>
                            <Image
                                source={{ uri: 'https://via.placeholder.com/150' }}
                                style={styles.profileImage}
                            />
                        </View>
                    </View>
                </View>

                {/* Navigation Bar */}
                <View style={styles.navBar}>
                    <TouchableOpacity style={styles.navItem}>
                        <View style={styles.activeNavIconBg}>
                            <Ionicons name="home-outline" size={24} color="white" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.navItem}
                        onPress={() => navigation.navigate('Notifications')}
                    >
                        <Ionicons name="notifications-outline" size={24} color="#8E8E9F" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navItem}><MaterialCommunityIcons name="seed-outline" size={24} color="#8E8E9F" /></TouchableOpacity>
                    <TouchableOpacity style={styles.navItem}><Feather name="pie-chart" size={22} color="#8E8E9F" /></TouchableOpacity>
                    <TouchableOpacity style={styles.navItem}><Ionicons name="person-outline" size={24} color="#8E8E9F" /></TouchableOpacity>
                </View>

            </SafeAreaView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a0b2e',
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    stars: {
        position: 'absolute',
        width: width,
        height: height,
        top: 0,
        left: 0,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 10,
        zIndex: 10,
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    scoreText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '400',
    },
    scoreValue: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    starIcon: {
        width: 20,
        height: 20,
        marginLeft: 5,
    },
    helmet: {
        width: 80, // Smaller helmet
        height: 80,
        marginRight: -10,
        marginTop: 0,
    },
    spaceArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginTop: -50,
    },
    planet: {
        width: width * 0.28, // Reduced to 28%
        height: width * 0.28,
        zIndex: 1,
    },
    alien: {
        width: 40,
        height: 40,
        position: 'absolute',
        zIndex: 2,
        tintColor: '#FFFFFF',
    },
    alien1: {
        top: 40,
        left: width * 0.2,
    },
    alien2: {
        top: 80,
        right: width * 0.2,
    },
    alien3: {
        top: 150,
        right: width * 0.1,
    },
    // Modal Styles
    modalOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20, // Above everything
    },
    modalCard: {
        backgroundColor: '#1A1225', // Very dark purple/black
        width: width * 0.85,
        padding: 24,
        borderRadius: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        color: '#E0E0E0',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
    },
    actionButton: {
        backgroundColor: '#FF5722', // Orange
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
    },
    actionButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Bottom Background UI (Visible behind modal visually)
    bottomSection: {
        position: 'absolute',
        bottom: 90,
        left: 0,
        right: 0,
        paddingHorizontal: 40, // Increased padding to reduce width
        opacity: 0.5,
    },
    glassCard: {
        backgroundColor: 'rgba(30, 20, 50, 0.6)',
        borderRadius: 24,
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    textContainer: { flex: 1 },
    greetingTitle: { fontSize: 14, color: '#E0E0E0', marginBottom: 4 },
    greetingSubtitle: { fontSize: 15, fontWeight: '600', color: '#FFFFFF', marginBottom: 4 },
    greetingBody: { fontSize: 12, color: '#B0B0C0' },
    profileContainer: { marginLeft: 10 },
    profileImage: { width: 45, height: 45, borderRadius: 22.5, borderWidth: 2, borderColor: '#FFFFFF', backgroundColor: '#ccc' },
    rocket: {
        position: 'absolute',
        bottom: 50, // Floating above card
        right: 10,
        width: 80,
        height: 80,
        zIndex: 5,
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'rgba(23, 16, 40, 0.95)',
        paddingVertical: 15,
        paddingHorizontal: 15,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
    },
    activeNavIconBg: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#4A4A60',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default HomePageStart;
