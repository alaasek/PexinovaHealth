import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import BottomTabs from '../components/BottomTabs';

export default function BonusScreen() {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/nova/Background.png')}
                style={StyleSheet.absoluteFillObject}
            />
            <LinearGradient
                colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.5)']}
                style={StyleSheet.absoluteFillObject}
            />

            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={styles.title}>🎁 Bonus Rewards</Text>
                    <Text style={styles.subtitle}>Earn stars by taking your medicine on time!</Text>

                    <View style={styles.rewardCard}>
                        <Image
                            source={require('../../assets/nova/Sparkles.png')}
                            style={styles.starIcon}
                            resizeMode="contain"
                        />
                        <Text style={styles.rewardTitle}>Daily Streak Bonus</Text>
                        <Text style={styles.rewardDesc}>Take all medicines for 7 days straight</Text>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: '60%' }]} />
                        </View>
                        <Text style={styles.progressText}>4/7 days completed</Text>
                    </View>

                    <View style={styles.rewardCard}>
                        <Image
                            source={require('../../assets/nova/Sparkles.png')}
                            style={styles.starIcon}
                            resizeMode="contain"
                        />
                        <Text style={styles.rewardTitle}>Perfect Week</Text>
                        <Text style={styles.rewardDesc}>Complete all tasks this week</Text>
                        <TouchableOpacity style={styles.claimButton}>
                            <Text style={styles.claimButtonText}>Claim 50 Stars</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.rewardCard}>
                        <Image
                            source={require('../../assets/nova/Alien.png')}
                            style={styles.alienIcon}
                            resizeMode="contain"
                        />
                        <Text style={styles.rewardTitle}>Alien Hunter</Text>
                        <Text style={styles.rewardDesc}>Defeat 100 aliens in the game</Text>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: '35%' }]} />
                        </View>
                        <Text style={styles.progressText}>35/100 aliens defeated</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.shopButton}
                        onPress={() => navigation.navigate('Home')}
                    >
                        <Text style={styles.shopButtonText}>🚀 Back to Game</Text>
                    </TouchableOpacity>
                </ScrollView>
                <BottomTabs />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1E1035' },
    safeArea: { flex: 1 },
    content: { padding: 20, paddingBottom: 100 },
    title: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', marginBottom: 10 },
    subtitle: { fontSize: 16, color: '#B0B0C0', textAlign: 'center', marginBottom: 30 },
    rewardCard: {
        backgroundColor: 'rgba(30, 20, 50, 0.8)',
        borderRadius: 20,
        padding: 24,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
    },
    starIcon: { width: 60, height: 60, marginBottom: 15, tintColor: '#FFD700' },
    alienIcon: { width: 60, height: 60, marginBottom: 15 },
    rewardTitle: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', marginBottom: 8 },
    rewardDesc: { fontSize: 14, color: '#B0B0C0', textAlign: 'center', marginBottom: 20 },
    progressBar: {
        width: '100%',
        height: 10,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 10,
    },
    progressFill: { height: '100%', backgroundColor: '#FF5722', borderRadius: 5 },
    progressText: { fontSize: 12, color: '#B0B0C0' },
    claimButton: {
        backgroundColor: '#FF5722',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 25,
        shadowColor: '#FF5722',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    claimButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
    shopButton: {
        backgroundColor: 'rgba(255, 87, 34, 0.2)',
        paddingVertical: 16,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#FF5722',
        alignItems: 'center',
        marginTop: 20,
    },
    shopButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
});
