import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabs from '../components/BottomTabs';

const { width } = Dimensions.get('window');

const StarHomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  return (
    <ImageBackground
      source={require('../../assets/starhealth/Background.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greetingTitle}>Hello Star!</Text>
              <Text style={styles.greetingSubtitle}>Your health galaxy is shining 🌟</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
              <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.profileImage} />
            </TouchableOpacity>
          </View>

          <View style={styles.cardContainer}>
            <View style={styles.mainCard}>
              <Image source={require('../../assets/starhealth/Splash.png')} style={styles.cardImage} resizeMode="contain" />
              <Text style={styles.cardTitle}>Daily Health Check</Text>
              <Text style={styles.cardSubtitle}>You are doing great today!</Text>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('AddMedication')}
              >
                <Text style={styles.actionButtonText}>Add Medication</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Access</Text>
            <View style={styles.grid}>
              <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('Home')}>
                <View style={[styles.iconBg, { backgroundColor: '#7D5BA6' }]}>
                  <Ionicons name="rocket" size={24} color="#FFF" />
                </View>
                <Text style={styles.gridLabel}>Nova Galaxy</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('Bonus')}>
                <View style={[styles.iconBg, { backgroundColor: '#FF8860' }]}>
                  <Ionicons name="gift" size={24} color="#FFF" />
                </View>
                <Text style={styles.gridLabel}>Bonuses</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('Statistics')}>
                <View style={[styles.iconBg, { backgroundColor: '#404B5C' }]}>
                  <Ionicons name="stats-chart" size={24} color="#FFF" />
                </View>
                <Text style={styles.gridLabel}>Stats</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('Notifications')}>
                <View style={[styles.iconBg, { backgroundColor: '#FF5722' }]}>
                  <Ionicons name="notifications" size={24} color="#FFF" />
                </View>
                <Text style={styles.gridLabel}>Alerts</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
        <BottomTabs />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0c0618' },
  safeArea: { flex: 1 },
  scrollContainer: { flexGrow: 1, paddingBottom: 100, paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 20 },
  greetingTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF' },
  greetingSubtitle: { fontSize: 14, color: '#D1D1E0' },
  profileImage: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: '#FFFFFF' },

  cardContainer: { marginBottom: 25 },
  mainCard: { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 24, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)' },
  cardImage: { width: 150, height: 150, marginBottom: 10 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 5 },
  cardSubtitle: { fontSize: 14, color: '#D1D1E0', marginBottom: 15, textAlign: 'center' },
  actionButton: { backgroundColor: '#FF5722', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25 },
  actionButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },

  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#FFFFFF', marginBottom: 15 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 15 },
  gridItem: { width: (width - 55) / 2, backgroundColor: '#231B32', borderRadius: 16, padding: 15, alignItems: 'center', marginBottom: 10 },
  iconBg: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  gridLabel: { color: '#FFFFFF', fontWeight: '500', fontSize: 14 }
});

export default StarHomeScreen;
