import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useGame, Medicine, MedicineStatus } from '../context/GameContext';

const { width, height } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;


// ... (keep Appointment interfaces if not moved, but Medicine is in context now)

interface Appointment {
  id: number;
  name: string;
  time: string;
  checked: boolean;
}

const NotificationsScreen: React.FC<Props> = ({ navigation }) => {
  const { medicines, markMedicineTaken } = useGame(); // Use Context
  const [currentTime, setCurrentTime] = useState(new Date());

  // Animation states...
  const [starsOpacity1] = useState(new Animated.Value(0.3));
  const [starsOpacity2] = useState(new Animated.Value(0.5));
  const [starsScale] = useState(new Animated.Value(1));

  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 4, name: 'Betablocker', time: '8:00 am', checked: false },
    { id: 5, name: 'Betablocker', time: '8:00 am', checked: true },
  ]);

  // ... useEffects ...

  const getCurrentMinutes = () => {
    return currentTime.getHours() * 60 + currentTime.getMinutes();
  };

  const getStatus = (med: Medicine): MedicineStatus => {
    if (med.id === 1 && !med.taken) return 'pending'; // FORCE PENDING FOR TESTING
    if (med.taken) return 'done';
    const currentMinutes = getCurrentMinutes();
    if (currentMinutes >= med.minutes) return 'pending';
    return 'not_yet';
  };

  const handleMedicineAction = (id: number) => {
    // Call context action
    markMedicineTaken(id);

    // Navigate to Success Screen
    setTimeout(() => {
      navigation.navigate('Success');
    }, 500);
  };

  const toggleAppointment = (id: number): void => {
    setAppointments(appointments.map(apt =>
      apt.id === id ? { ...apt, checked: !apt.checked } : apt
    ));
  };

  const renderStatusButton = (med: Medicine) => {
    const status = getStatus(med);

    switch (status) {
      case 'done':
        return (
          <View style={[styles.statusButton, styles.doneButton]}>
            <Text style={styles.statusText}>done</Text>
            <View style={styles.checkIconContainer}>
              <Ionicons name="checkmark" size={12} color="white" />
            </View>
          </View>
        );
      case 'pending':
        return (
          <TouchableOpacity
            style={[styles.statusButton, styles.pendingButton]}
            onPress={() => handleMedicineAction(med.id)}
          >
            <Text style={styles.statusText}>pending</Text>
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Ionicons name="time-outline" size={12} color="white" />
            </View>
          </TouchableOpacity>
        );
      case 'not_yet':
        return (
          <TouchableOpacity
            style={[styles.statusButton, styles.notYetButton]}
            activeOpacity={1}
          // Logic: Not yet cannot be modified (no onPress action)
          >
            <Text style={styles.statusText}>not yet</Text>
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Ionicons name="information-outline" size={12} color="white" />
            </View>
          </TouchableOpacity>
        );
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0c0618', '#0c0618', '#35204a', '#0c0618']}
        locations={[0, 0.25, 0.55, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Distinct Header Area */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddMedication')} style={{ padding: 5 }}>
            <Ionicons name="add-circle-outline" size={28} color="#FF8860" />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Medicines Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Medicines</Text>

            {medicines.length === 0 ? (
              <Text style={{ color: '#888', fontStyle: 'italic', marginTop: 10 }}>No medicines added yet.</Text>
            ) : (
              medicines.map((med) => (
                <View key={med.id} style={styles.medicineCard}>
                  <View style={styles.medicineInfo}>
                    <Text style={styles.medicineName}>{med.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.medicineTime}>{med.time}</Text>
                      {med.dosage && (
                        <Text style={styles.medicineSubText}> • {med.dosage}</Text>
                      )}
                      {med.category && (
                        <Text style={styles.medicineSubText}> • {med.category}</Text>
                      )}
                    </View>
                  </View>
                  {renderStatusButton(med)}
                </View>
              ))
            )}
          </View>

          {/* Appointments Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Appointment</Text>

            {appointments.map((apt) => (
              <TouchableOpacity
                key={apt.id}
                style={styles.appointmentCard}
                onPress={() => toggleAppointment(apt.id)}
              >
                <View style={styles.appointmentInfo}>
                  <Text style={styles.appointmentName}>{apt.name}</Text>
                  <Text style={styles.appointmentTime}>- {apt.time}</Text>
                </View>
                <View style={[
                  styles.checkbox,
                  apt.checked && styles.checkboxChecked
                ]}>
                  {apt.checked && <Ionicons name="checkmark" size={16} color="white" />}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Motivational Tip - Updated Design */}
          <View style={styles.tipWrapper}>
            {/* Sparkle Icon floating top-left outside/on-border */}
            <Image
              source={require('../assets/Sparkles.png')}
              style={styles.tipSparkle}
              resizeMode="contain"
            />
            <View style={styles.tipContainer}>
              <Text style={styles.tipText}>
                Try to walk at least 30 minutes a day. Even short activity breaks every hour can improve circulation, reduce stress, and boost your energy
              </Text>
            </View>
          </View>

          {/* Spacing for Nav Bar */}
          <View style={{ height: 100 }} />

        </ScrollView>

        {/* Navigation bar */}
        <View style={styles.navBar}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('Home')}
          >
            <Ionicons name="home-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            {/* Active Indicator matches design: rounded rect/circle with lighter background */}
            <View style={styles.activeNavIconBg}>
              <Ionicons name="notifications" size={24} color="white" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <MaterialCommunityIcons name="seed-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Feather name="pie-chart" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="person-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0618',
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
    backgroundColor: 'transparent', // Make transparent so ImageBackground shows through
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'transparent',
    zIndex: 20,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: '100%',
    marginBottom: 15,
  },
  section: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D1D1E0',
    marginBottom: 15,
  },
  medicineCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#231B32', // Darker, flatter purple
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  medicineInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
  },
  medicineName: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  medicineTime: {
    fontSize: 14,
    color: '#D1D1E0',
    marginLeft: 5,
    fontWeight: '400',
  },
  medicineSubText: {
    fontSize: 14,
    color: '#D1D1E0',
    fontWeight: '400',
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    minWidth: 95,
    justifyContent: 'flex-end',
  },
  doneButton: {
    backgroundColor: '#7D5BA6', // Purple matching design
  },
  pendingButton: {
    backgroundColor: '#FF8860', // Orange matching design
  },
  notYetButton: {
    backgroundColor: '#404B5C', // Dark Grey matching design
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    marginRight: 4,
  },
  checkIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appointmentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#231B32', // Darker, flatter purple
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  appointmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  appointmentName: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  appointmentTime: {
    fontSize: 14,
    color: '#D1D1E0',
    marginLeft: 5,
    fontWeight: '400',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#FF8860', // Orange
    borderColor: '#FF8860',
  },
  // New Tip Design matching screenshot
  tipWrapper: {
    marginTop: 20,
    marginHorizontal: 20,
    position: 'relative',
  },
  tipSparkle: {
    position: 'absolute',
    top: -10,
    left: 10,
    width: 24,
    height: 24,
    zIndex: 2,
    tintColor: '#C4A6EA', // Light purple
  },
  tipContainer: {
    backgroundColor: '#382838', // Dark brownish-purple
    borderRadius: 20,
    padding: 24,
    paddingTop: 32, // Space for sparkle
  },
  tipText: {
    fontSize: 13,
    color: '#BFA89E', // Beige/Brownish text
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 4,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#1E1B2E', // Darker Nav Bar
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
    backgroundColor: '#4A5060', // Greyish background for active item (Bell)
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#606070', // Subtle border for active state
  },
});

export default NotificationsScreen;
