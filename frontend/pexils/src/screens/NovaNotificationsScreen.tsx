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
    Modal,
    Platform,
    TextInput,
    TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width, height } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

import { useGame, Medicine, MedicineStatus } from '../context/GameContext';

// ... (keep Appointment interfaces if not moved, but Medicine is in context now)

interface Appointment {
    id: number;
    name: string;
    time: string;
    checked: boolean;
}

const NovaNotificationsScreen: React.FC<Props> = ({ navigation }) => {
    const { medicines, markMedicineTaken, updateMedicineTime } = useGame(); // Use Context
    const [currentTime, setCurrentTime] = useState(new Date());

    // Time Picker State
    const [showPicker, setShowPicker] = useState(false);
    const [selectedMedId, setSelectedMedId] = useState<number | null>(null);
    const [tempDate, setTempDate] = useState(new Date());

    // Manual Time Entry State - Default to true for "Easy Modification"
    const [isManualMode, setIsManualMode] = useState(true);
    const [manualHours, setManualHours] = useState('');
    const [manualMinutes, setManualMinutes] = useState('');
    const [manualAmPm, setManualAmPm] = useState('AM');

    const syncManualFromDate = (d: Date) => {
        let h = d.getHours();
        const m = d.getMinutes();
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        h = h ? h : 12;
        setManualHours(h.toString());
        setManualMinutes(m < 10 ? `0${m}` : m.toString());
        setManualAmPm(ampm);
    };

    // Animation states...
    const [starsOpacity1] = useState(new Animated.Value(0.3));
    const [starsOpacity2] = useState(new Animated.Value(0.5));
    const [starsOpacity3] = useState(new Animated.Value(0.2));
    const [starsOpacity4] = useState(new Animated.Value(0.4));
    const [starsScale] = useState(new Animated.Value(1));

    const [appointments, setAppointments] = useState<Appointment[]>([
        { id: 4, name: 'Betablocker', time: '8:00 am', checked: false },
        { id: 5, name: 'Betablocker', time: '8:00 am', checked: true },
    ]);

    // Helper for displaying time
    const formatTimeDisplay = (date: Date) => {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutesStr} ${ampm}`;
    };

    const handleOpenPicker = (med: Medicine) => {
        setSelectedMedId(med.id);

        // Parse medicine time string to Date object
        const d = new Date();
        try {
            if (med.time) {
                const parts = med.time.split(' ');
                if (parts.length > 0) {
                    const timeParts = parts[0].split(':');
                    let h = parseInt(timeParts[0]) || 0;
                    const m = parseInt(timeParts[1]) || 0;
                    const isPm = parts[1] && parts[1].toLowerCase() === 'pm';
                    if (isPm && h < 12) h += 12;
                    if (!isPm && h === 12) h = 0;
                    d.setHours(h, m, 0, 0);
                }
            }
        } catch (e) {
            console.warn("Parsing failed", e);
        }

        setTempDate(d);
        syncManualFromDate(d);
        setShowPicker(true);
    };

    const onPickerChange = (event: any, selectedDate?: Date) => {
        if (selectedDate) {
            setTempDate(selectedDate);
            syncManualFromDate(selectedDate);
        }
    };

    const handleConfirmTime = () => {
        if (selectedMedId !== null) {
            const timeString = formatTimeDisplay(tempDate);
            updateMedicineTime(selectedMedId, timeString);
        }
        setShowPicker(false);
    };


    // --- Stars Animation (Faster & Twinkling) ---
    useEffect(() => {
        const animateStars = (anim: Animated.Value, duration: number) => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(anim, { toValue: 1, duration: duration, useNativeDriver: true }),
                    Animated.timing(anim, { toValue: 0.1, duration: duration, useNativeDriver: true }),
                ])
            ).start();
        };

        animateStars(starsOpacity1, 800);
        animateStars(starsOpacity2, 1200);
        animateStars(starsOpacity3, 600);
        animateStars(starsOpacity4, 1000);
    }, []);

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
            navigation.navigate('Success' as any);
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
                    <View
                        style={[styles.statusButton, styles.notYetButton]}
                    >
                        <Text style={styles.statusText}>not yet</Text>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                            <Ionicons name="information-outline" size={12} color="white" />
                        </View>
                    </View>
                );
        }
    };

    return (
        <ImageBackground
            source={require('../../assets/nova/Background.png')}
            style={styles.container}
            resizeMode="cover"
        >
            {/* Helper Gradient for depth - Matches HomeScreen exactly */}
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.3)']}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Animated Stars Overlay - Intensified */}
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
                <Animated.Image
                    source={require('../../assets/nova/stars.png')}
                    style={[styles.stars, { opacity: starsOpacity1 }]}
                    resizeMode="cover"
                />
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
                <Animated.Image
                    source={require('../../assets/nova/stars.png')}
                    style={[
                        styles.stars,
                        {
                            opacity: starsOpacity3,
                            transform: [{ scale: 1.2 }, { rotate: '90deg' }]
                        }
                    ]}
                    resizeMode="cover"
                />
                <Animated.Image
                    source={require('../../assets/nova/stars.png')}
                    style={[
                        styles.stars,
                        {
                            opacity: starsOpacity4,
                            transform: [{ scale: 1.5 }, { rotate: '270deg' }]
                        }
                    ]}
                    resizeMode="cover"
                />
            </View>

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
                    <View style={{ flex: 1 }} />
                </View>

                {/* Time Picker Modal */}
                <Modal
                    visible={showPicker}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowPicker(false)}
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={() => setShowPicker(false)}
                    >
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <View style={styles.pickerHeader}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            const newState = !isManualMode;
                                            setIsManualMode(newState);
                                            if (newState) syncManualFromDate(tempDate);
                                        }}
                                        style={styles.modeToggle}
                                    >
                                        <Ionicons name={isManualMode ? "time-outline" : "keypad-outline"} size={22} color="#FF8860" />
                                        <Text style={styles.modeToggleText}>{isManualMode ? "Switch to Scroll" : "Type Manually"}</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.pickerTitle}>Select Time</Text>
                                </View>

                                {isManualMode ? (
                                    <View style={styles.manualInputContainer}>
                                        <View style={styles.manualTimeRow}>
                                            <TextInput
                                                style={styles.manualInput}
                                                value={manualHours}
                                                onChangeText={(val: string) => {
                                                    const num = parseInt(val);
                                                    if (!val || (num >= 1 && num <= 12)) setManualHours(val);
                                                }}
                                                placeholder="12"
                                                placeholderTextColor="#666"
                                                keyboardType="number-pad"
                                                maxLength={2}
                                            />
                                            <Text style={styles.manualSeparator}>:</Text>
                                            <TextInput
                                                style={styles.manualInput}
                                                value={manualMinutes}
                                                onChangeText={(val: string) => {
                                                    const num = parseInt(val);
                                                    if (!val || (num >= 0 && num <= 59)) setManualMinutes(val);
                                                }}
                                                placeholder="00"
                                                placeholderTextColor="#666"
                                                keyboardType="number-pad"
                                                maxLength={2}
                                            />
                                            <TouchableOpacity
                                                style={styles.ampmButton}
                                                onPress={() => setManualAmPm(manualAmPm === 'AM' ? 'PM' : 'AM')}
                                            >
                                                <Text style={styles.ampmButtonText}>{manualAmPm}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ) : (
                                    <View style={styles.pickerWrapper}>
                                        <DateTimePicker
                                            testID="dateTimePicker"
                                            value={tempDate}
                                            mode="time"
                                            is24Hour={false}
                                            display="spinner"
                                            onChange={onPickerChange}
                                            style={styles.androidPicker}
                                        />
                                    </View>
                                )}

                                <View style={styles.modalFooter}>
                                    <TouchableOpacity
                                        style={[styles.modalButton, styles.cancelButton]}
                                        onPress={() => setShowPicker(false)}
                                    >
                                        <Text style={styles.cancelButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.modalButton, styles.confirmButtonModal]}
                                        onPress={() => {
                                            if (isManualMode) {
                                                const newDate = new Date(tempDate);
                                                let h = parseInt(manualHours) || 12;
                                                const m = parseInt(manualMinutes) || 0;
                                                if (manualAmPm === 'PM' && h < 12) h += 12;
                                                if (manualAmPm === 'AM' && h === 12) h = 0;
                                                newDate.setHours(h, m, 0, 0);
                                                // In NotificationsScreen, we call updateMedicineTime with the string
                                                const timeString = formatTimeDisplay(newDate);
                                                if (selectedMedId !== null) {
                                                    updateMedicineTime(selectedMedId, timeString);
                                                }
                                            } else {
                                                handleConfirmTime();
                                            }
                                            setShowPicker(false);
                                        }}
                                    >
                                        <Text style={styles.confirmButtonTextModal}>Confirm</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </TouchableOpacity>
                </Modal>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Medicines Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Medicines</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('AddMedication' as any)}>
                                <Ionicons name="add-circle" size={28} color="#FF8860" />
                            </TouchableOpacity>
                        </View>

                        {medicines.map((med) => (
                            <View key={med.id} style={styles.medicineCard}>
                                <TouchableOpacity
                                    style={styles.medicineInfo}
                                    onPress={() => handleOpenPicker(med)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.medicineName}>{med.name}</Text>
                                    <View style={styles.timeContainer}>
                                        <Text style={styles.medicineTime}>{med.time}</Text>
                                        <Ionicons name="pencil" size={16} color="#FF8860" style={{ marginLeft: 6 }} />
                                    </View>
                                </TouchableOpacity>
                                {renderStatusButton(med)}
                            </View>
                        ))}
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
                            source={require('../../assets/nova/Sparkles.png')}
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
                        onPress={() => navigation.navigate('Home' as any)}
                    >
                        <Ionicons name="home-outline" size={24} color="#FFFFFF" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navItem}>
                        {/* Active Indicator matches design: rounded rect/circle with lighter background */}
                        <View style={styles.activeNavIconBg}>
                            <Ionicons name="notifications" size={24} color="white" />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Bonus' as any)}>
                        <MaterialCommunityIcons name="seed-outline" size={24} color="#FFFFFF" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Statistics' as any)}>
                        <Feather name="pie-chart" size={22} color="#FFFFFF" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('StarHome' as any)}>
                        <Ionicons name="person-outline" size={24} color="#FFFFFF" />
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
        backgroundColor: 'transparent', // Transparent to show background image
        zIndex: 20,
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        fontFamily: 'Poppins-Bold',
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
        fontFamily: 'Poppins-SemiBold',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    medicineCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(35, 25, 60, 0.6)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    medicineInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    medicineName: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginLeft: 8,
    },
    medicineTime: {
        fontSize: 14,
        color: '#FF8860', // Theme orange for visibility
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
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
        fontFamily: 'Poppins-SemiBold',
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
        backgroundColor: 'rgba(35, 25, 60, 0.6)',
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
        fontFamily: 'Poppins-SemiBold',
    },
    appointmentTime: {
        fontSize: 14,
        color: '#D1D1E0',
        marginLeft: 5,
        fontWeight: '400',
        fontFamily: 'Poppins-Regular',
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
        backgroundColor: '#2A2035', // Dark brownish-purple from screenshot
        borderRadius: 20,
        padding: 24,
        paddingTop: 28, // Space for sparkle
    },
    tipText: {
        fontSize: 13,
        color: '#A88D82', // Beige/Brownish text from screenshot
        textAlign: 'center',
        lineHeight: 20,
        fontFamily: 'Poppins-Regular',
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
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#2A2035',
        borderRadius: 24,
        width: '85%',
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    pickerHeader: {
        marginBottom: 10,
        width: '100%',
        alignItems: 'center',
    },
    modeToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        marginBottom: 10,
    },
    modeToggleText: {
        color: '#FF8860',
        fontSize: 12,
        marginLeft: 5,
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
    },
    pickerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Poppins-Bold',
    },
    manualInputContainer: {
        width: '100%',
        height: 220,
        justifyContent: 'center',
        alignItems: 'center',
    },
    manualTimeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    manualInput: {
        backgroundColor: '#3C364A',
        borderRadius: 18,
        width: 85,
        height: 85,
        color: 'white',
        fontSize: 42,
        textAlign: 'center',
        fontWeight: '500',
        fontFamily: 'Poppins-Medium',
    },
    manualSeparator: {
        color: 'white',
        fontSize: 32,
        fontWeight: 'bold',
        marginHorizontal: 12,
    },
    ampmButton: {
        backgroundColor: '#4E5365',
        paddingHorizontal: 20,
        paddingVertical: 18,
        borderRadius: 18,
        marginLeft: 20,
        minWidth: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ampmButtonText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Poppins-Bold',
    },
    pickerWrapper: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 220,
    },
    androidPicker: {
        width: 320,
        height: 200,
        backgroundColor: 'transparent',
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        marginHorizontal: 8,
    },
    cancelButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    cancelButtonText: {
        color: '#E0E0E0',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
    },
    confirmButtonModal: {
        backgroundColor: '#FF8860',
    },
    confirmButtonTextModal: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Poppins-Bold',
    },
});

export default NovaNotificationsScreen;
