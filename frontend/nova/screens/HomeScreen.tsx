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

const HomeScreen: React.FC<Props> = ({ navigation, route }) => {
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
  // Animation for Rocket Movement (X and Y)
  const [rocketX] = useState(new Animated.Value(0));
  const [rocketY] = useState(new Animated.Value(0));

  const shootLaser = () => {
    if (aliensAlive <= 0) return;

    // Target the first available alien
    const targetIndex = 0;
    const targetPos = alienPositions[targetIndex % alienPositions.length];

    // Calculate dynamic target position for the rocket
    // Rocket is at bottom-right normally. We want it to move under the alien.
    // Rocket Original X (approx): width - 70 - 100/2 = width - 120 (taking center)
    // Alien X (approx): targetPos.left + 20

    // We need to move the rocket by (AlienX - RocketOriginalX)
    // Let's assume rocket starts at X=0 (relative to its own container)
    // Container is bottom-right aligned.
    // Let's try to animate `rocketX` which transforms `translateX`.

    // Simplification:
    // Rocket is `right: 20`. 
    // Alien `left: targetPos.left`.
    // Distance to move Left = (width - 20 - 50 (half rocket)) - (targetPos.left + 20 (half alien))
    // Roughly: move negative X to reach alien.

    const rocketStartRight = 20;
    const alienLeft = targetPos.left;

    // Calculate movement needed
    // X axis goes Right. Rocket is at `width - 120` (center approx).
    // Alien is at `alienLeft + 20`.
    // Dest X = Alien Center.
    // Current X = Rocket Center.
    // Delta = Dest - Current.

    const currentRocketCenterX = width - 70; // Approximation from styles
    const targetAlienCenterX = alienLeft + 20;
    const distanceToMoveX = targetAlienCenterX - currentRocketCenterX;

    Animated.sequence([
      // 1. Move Rocket to Alien
      Animated.timing(rocketX, {
        toValue: distanceToMoveX,
        duration: 500,
        useNativeDriver: true,
      }),

      // 2. Shoot Laser (Vertical)
      Animated.parallel([
        Animated.timing(laserWidth, {
          toValue: 400, // Height
          duration: 200,
          useNativeDriver: false, // height layout prop
        }),
        Animated.timing(laserOpacity, {
          toValue: 1,
          duration: 100,
          useNativeDriver: false,
        }),
      ]),

      // 3. Laser Disappear & Hit
      Animated.sequence([
        Animated.delay(50),
        Animated.timing(laserOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false,
        }),
      ]),

      // 4. Return Rocket
      Animated.timing(rocketX, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),

    ]).start(() => {
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
      source={require('../assets/Background.png')}
      style={styles.container}
      resizeMode="cover"
    >


      {/* Animated Stars Overlay 1 (Base Layer) */}
      <Animated.Image
        source={require('../assets/stars.png')}
        style={[
          styles.stars,
          { opacity: starsOpacity1 }
        ]}
        resizeMode="cover"
      />

      {/* Animated Stars Overlay 2 (Twinkling Layer) */}
      <Animated.Image
        source={require('../assets/stars.png')}
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
                source={require('../assets/Sparkles.png')}
                style={styles.starIcon}
                resizeMode="contain"
              />
            </View>
            <Image
              source={require('../assets/helmet.png')}
              style={styles.helmet}
              resizeMode="contain"
            />
          </View>

          {/* Space Area */}
          <View style={styles.spaceArea}>

            {/* Dynamic Aliens */}
            {Array.from({ length: aliensAlive }).map((_, index) => (
              <Animated.Image
                key={index}
                source={require('../assets/Alien.png')}
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
              source={require('../assets/planet.png')}
              style={styles.planet}
              resizeMode="contain"
            />


          </View>

          {/* Bottom Card */}
          <View style={styles.bottomSection}>
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

            {/* Laser Beam - Vertical - Moves with Rocket */}
            <Animated.View
              style={[
                styles.laser,
                {
                  opacity: laserOpacity,
                  height: laserWidth,
                  transform: [{ translateX: rocketX }]
                }
              ]}
            />

            {/* Rocket (Clickable) */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleRocketPress}
              style={[
                styles.rocket,
                { transform: [{ translateY: rocketFloat }, { translateX: rocketX }] } as any
              ]} // styling wrapper for layout
            >
              <Animated.Image
                source={require('../assets/nave.png')}
                style={{ width: '100%', height: '100%' }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

        </ScrollView>

        {/* Navigation Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.navItem}>
            <View style={styles.activeNavIconBg}>
              <Ionicons name="home-outline" size={24} color="white" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="notifications-outline" size={24} color="#8E8E9F" />
          </TouchableOpacity>
          {/* ... other nav items ... */}
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
    paddingBottom: 100, // Space for Nav Bar
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
    width: width * 0.4, // Increased to 40%
    height: width * 0.4,
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
    width: 6, // Slightly clearer
    backgroundColor: '#FF0000',
    bottom: 50, // Approx top of rocket body
    right: 67, // Aligned with rocket center (Right 20 + Width 100/2 - Laser 3)
    zIndex: 5,
    shadowColor: '#FF0000',
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 10,
  },
  bottomSection: {
    paddingHorizontal: 20,
    marginTop: -40,
    position: 'relative',
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
  },
  greetingSubtitle: {
    fontSize: 14,
    color: '#D1D1E0',
    marginBottom: 8,
  },
  greetingBody: {
    fontSize: 12,
    color: '#8E8E9F',
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

export default HomeScreen;