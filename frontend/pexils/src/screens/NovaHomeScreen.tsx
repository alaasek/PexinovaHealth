import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    Animated,
    ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';


const { width, height } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

import { useGame } from '../context/GameContext'; // Move import to top

const NovaHomeScreen: React.FC<Props> = ({ navigation, route }) => {
    const { medicines, score, bullets, shootAlien } = useGame();

    // Calculate remaining aliens
    const totalAliens = medicines.length;
    const aliensAlive = totalAliens - score;

    // Game Animations
    const [alienFloat] = useState(new Animated.Value(0));
    const [rocketFloat] = useState(new Animated.Value(0));
    const [laserOpacity] = useState(new Animated.Value(0));
    const [laserWidth] = useState(new Animated.Value(0));

    // Background Animations
    const [starsOpacity1] = useState(new Animated.Value(0.3));
    const [starsOpacity2] = useState(new Animated.Value(0.5));
    const [starsScale] = useState(new Animated.Value(1));

    // Use state to track which alien is being targeted (for visual laser)
    const [targetAlienIndex, setTargetAlienIndex] = useState<number | null>(null);

    // Handle laser trigger from other screens (e.g. SuccessScreen)
    useEffect(() => {
        if (route.params?.triggerLaser) {
            shootLaser();
            // Reset param to avoid re-triggering
            navigation.setParams({ triggerLaser: undefined });
        }
    }, [route.params?.triggerLaser]);

    const handleRocketPress = () => {
        // Check if we have "ammo" (bullets) from taking medicine
        if (bullets > 0 && aliensAlive > 0) {
            shootLaser();
        } else {
            console.log("No ammo or no aliens! Bullets:", bullets, "Aliens:", aliensAlive);
            // Optional: Add a small shake or visual feedback here in future
        }
    };

    // ... inside component
    const [laserAngle, setLaserAngle] = useState('0deg'); // State for angle
    const [laserFinalWidth, setLaserFinalWidth] = useState(0); // State for distance

    const shootLaser = () => {
        // 1. Pick a target (the first alive of the displayed ones)
        // aliensAlive tells us how many are there. The actual aliens rendered are 0 to aliensAlive-1
        // We target the *last* one because usually we shoot the one most forward? Or random?
        // Let's target the one at index 0 for simplicity or cycle.
        // Actually, visually `aliensAlive` defines how many.
        // Let's target the *top-most* or *first* available.

        if (aliensAlive <= 0) return;

        // Target the last one in the list (or first), let's say index 0
        // Because aliens are rendered based on index % alienPositions.length
        const targetIndex = 0;
        const targetPos = alienPositions[targetIndex % alienPositions.length];

        // Alien Center (approx)
        // top/left are top-left corners. Alien is 40x40.
        const alienX = targetPos.left + 20;
        const alienY = targetPos.top + 20; // relative to spaceArea

        // Rocket Center (approx)
        // Rocket is bottom: -20, right: 20 inside bottomSection? 
        // Wait, Rocket is relative to bottomSection which is absolute bottom 90?
        // This coordinate system is tricky.
        // Let's approximate. Rocket is at bottom-right of screen.
        // Screen Height ~ 800. Rocket Center ~ (Width - 70, Height - 100).
        const rocketX = width - 70;
        const rocketY = height - 120; // Rough estimate based on bottomSection and margins

        // Adjust AlienY to be global.
        // spaceArea is marginTop: -20 relative to SafeArea?
        // spaceArea is centered roughly.
        // Let's use relative calculations from the *top* of the screen.
        // AlienY relative to screen top: Header (~100) + SpaceArea offset + alien.top
        const globalAlienY = 150 + targetPos.top; // Header + margin

        const dx = alienX - rocketX;
        const dy = globalAlienY - rocketY;

        // Calculate Angle
        // atan2(dy, dx) gives angle in radians from X axis.
        const angleRad = Math.atan2(dy, dx);
        const angleDeg = angleRad * (180 / Math.PI);

        // Calculate Distance
        const dist = Math.sqrt(dx * dx + dy * dy);

        setLaserAngle(`${angleDeg}deg`);
        setLaserFinalWidth(dist);

        laserOpacity.setValue(1);
        laserWidth.setValue(0);

        // 2. Animate Laser
        Animated.sequence([
            Animated.timing(laserWidth, {
                toValue: 1,
                duration: 300,
                useNativeDriver: false,
            }),
            Animated.delay(50),
            Animated.timing(laserOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            })
        ]).start(() => {
            // 3. Update Game State
            shootAlien();
            laserWidth.setValue(0);
        });
    };



    useEffect(() => {
        // Alien Float
        Animated.loop(
            Animated.sequence([
                Animated.timing(alienFloat, { toValue: 10, duration: 1500, useNativeDriver: true }),
                Animated.timing(alienFloat, { toValue: 0, duration: 1500, useNativeDriver: true }),
            ])
        ).start();

        // Rocket Float
        Animated.loop(
            Animated.sequence([
                Animated.timing(rocketFloat, { toValue: -10, duration: 2000, useNativeDriver: true }),
                Animated.timing(rocketFloat, { toValue: 0, duration: 2000, useNativeDriver: true }),
            ])
        ).start();

        // Star Layer 1 Animation (Deep Breathing)
        Animated.loop(
            Animated.sequence([
                Animated.timing(starsOpacity1, {
                    toValue: 1,
                    duration: 2500,
                    useNativeDriver: true,
                }),
                Animated.timing(starsOpacity1, {
                    toValue: 0.3,
                    duration: 2500,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Star Layer 2 Animation (Twinkling)
        Animated.loop(
            Animated.sequence([
                Animated.timing(starsOpacity2, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(starsOpacity2, {
                    toValue: 0.2,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Scale Animation (Subtle movement)
        Animated.loop(
            Animated.sequence([
                Animated.timing(starsScale, {
                    toValue: 1.05,
                    duration: 5000,
                    useNativeDriver: true,
                }),
                Animated.timing(starsScale, {
                    toValue: 1,
                    duration: 5000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

    }, []);

    // Alien Positions (preset for up to 3 aliens)
    const alienPositions = [
        { top: 50, left: width * 0.2 },
        { top: 90, left: width * 0.7 },
        { top: 160, left: width * 0.4 },
    ];

    return (
        <ImageBackground
            source={require('../../assets/nova/Background.png')}
            style={styles.container}
            resizeMode="cover"
        >


            {/* Animated Stars Overlay 1 (Base Layer) */}
            <Animated.Image
                source={require('../../assets/nova/stars.png')}
                style={[
                    styles.stars,
                    { opacity: starsOpacity1 }
                ]}
                resizeMode="cover"
            />

            {/* Animated Stars Overlay 2 (Twinkling Layer) */}
            <Animated.Image
                source={require('../../assets/nova/stars.png')}
                style={[
                    styles.stars,
                    {
                        opacity: starsOpacity2,
                        transform: [{ scale: starsScale }, { rotate: '180deg' }]
                    }
                ]}
                resizeMode="cover"
            />

            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.scoreContainer}>
                            <Text style={styles.scoreText}>Score : </Text>
                            <Text style={styles.scoreValue}>{score} stars</Text>
                            <Image
                                source={require('../../assets/nova/Sparkles.png')}
                                style={styles.starIcon}
                                resizeMode="contain"
                            />
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('StarHome' as any)}>
                            <Image
                                source={require('../../assets/nova/helmet.png')}
                                style={styles.helmet}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Space Area */}
                    <View style={styles.spaceArea}>

                        {/* Dynamic Aliens */}
                        {Array.from({ length: aliensAlive }).map((_, index) => (
                            <Animated.Image
                                key={index}
                                source={require('../../assets/nova/Alien.png')}
                                style={[
                                    styles.alien,
                                    {
                                        top: alienPositions[index % alienPositions.length].top,
                                        left: alienPositions[index % alienPositions.length].left,
                                        transform: [{ translateY: alienFloat }]
                                    }
                                ]}
                                resizeMode="contain"
                            />
                        ))}

                        <Image
                            source={require('../../assets/nova/planet.png')}
                            style={styles.planet}
                            resizeMode="contain"
                        />

                        {/* Laser Beam */}
                        <Animated.View
                            style={[
                                styles.laser,
                                {
                                    opacity: laserOpacity,
                                    width: laserWidth.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0, 400] // Longer beam to reach across screen
                                    }),
                                    transform: [
                                        { rotate: '-125deg' }, // Angle pointing from bottom-right to top-left
                                    ]
                                }
                            ]}
                        />
                    </View>

                </ScrollView>

                {/* Bottom Card - Fixed at the bottom */}
                <View style={styles.bottomSection}>
                    <TouchableOpacity style={styles.glassCard} onPress={() => navigation.navigate('Settings' as any)}>
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
                    </TouchableOpacity>

                    {/* Rocket (Clickable) */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleRocketPress}
                        style={[styles.rocket, { transform: [{ translateY: rocketFloat }] } as any]}
                    >
                        <Animated.Image
                            source={require('../../assets/nova/nave.png')}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>

                {/* Navigation Bar */}
                <View style={styles.navBar}>
                    <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home' as any)}>
                        <View style={styles.activeNavIconBg}>
                            <Ionicons name="home-outline" size={24} color="white" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Notifications' as any)}>
                        <Ionicons name="notifications-outline" size={24} color="#8E8E9F" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Bonus' as any)}>
                        <MaterialCommunityIcons name="seed-outline" size={24} color="#8E8E9F" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Statistics' as any)}>
                        <Feather name="pie-chart" size={22} color="#8E8E9F" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('StarHome' as any)}>
                        <Ionicons name="person-outline" size={24} color="#8E8E9F" />
                    </TouchableOpacity>
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
    gradient: {
        flex: 1,
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
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 220, // Increased space for fixed Bottom Card + Nav Bar
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
        fontFamily: 'Poppins-Regular',
    },
    scoreValue: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontFamily: 'Poppins-Bold',
    },
    starIcon: {
        width: 20,
        height: 20,
        marginLeft: 5,
    },
    helmet: {
        width: 120,
        height: 120,
        marginRight: -20, // Pull to edge
        marginTop: -10,
    },
    spaceArea: {
        height: height * 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginTop: -20,
    },
    planet: {
        width: width * 0.35, // Reduced to 35% as requested
        height: width * 0.35,
        zIndex: 1,
    },
    alien: {
        width: 40,
        height: 40,
        position: 'absolute',
        top: 40,
        left: width * 0.2,
        zIndex: 2,
        tintColor: '#FFFFFF', // Make it white-ish/pixelated style if needed
    },
    laser: {
        position: 'absolute',
        height: 4,
        backgroundColor: '#FF0055', // Laser color
        bottom: 80,
        right: 50,
        zIndex: 5,
        shadowColor: '#FF0055',
        shadowOpacity: 1,
        shadowRadius: 10,
        transformOrigin: 'right center',
    },
    bottomSection: {
        paddingHorizontal: 20,
        position: 'absolute',
        bottom: 90, // Positioned above the nav bar
        left: 0,
        right: 0,
        zIndex: 15,
    },
    glassCard: {
        backgroundColor: 'rgba(30, 30, 45, 0.4)', // Slightly clearer than image to match concept
        borderRadius: 24,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 140,
        // Glass effect (simulated)
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    textContainer: {
        flex: 1,
    },
    greetingTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
        fontFamily: 'Poppins-Bold',
    },
    greetingSubtitle: {
        fontSize: 14,
        color: '#D1D1E0',
        marginBottom: 8,
        fontFamily: 'Poppins-Medium',
    },
    greetingBody: {
        fontSize: 12,
        color: '#8E8E9F',
        fontFamily: 'Poppins-Regular',
    },
    profileContainer: {
        marginLeft: 10,
        marginBottom: 20, // Push up slightly
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    rocket: {
        position: 'absolute',
        bottom: -20, // Overhang bottom
        right: 20,
        width: 100,
        height: 100,
        zIndex: 10, // On top of card
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#1E1B2E',
        paddingVertical: 15,
        paddingHorizontal: 15,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopWidth: 0,
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
        backgroundColor: '#FF5722', // Orange Active
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default NovaHomeScreen;
