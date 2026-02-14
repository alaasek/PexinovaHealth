import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    Modal,
    TouchableWithoutFeedback,
    Animated,
    Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useGame } from '../context/GameContext';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width, height } = Dimensions.get('window');

// Background Image
const BACKGROUND_IMAGE = require('../../assets/nova/Background.png');

type Props = NativeStackScreenProps<RootStackParamList, 'AddMedication'>;

const NovaAddMedication: React.FC<Props> = ({ navigation }) => {
    const { addMedicine } = useGame();

    const [name, setName] = useState('');
    const [date, setDate] = useState(new Date());
    // Background Animations
    const [starsOpacity1] = useState(new Animated.Value(0.3));
    const [starsOpacity2] = useState(new Animated.Value(0.5));
    const [starsOpacity3] = useState(new Animated.Value(0.2));
    const [starsOpacity4] = useState(new Animated.Value(0.4));
    const [showPicker, setShowPicker] = useState(false);
    const [dosage, setDosage] = useState('');

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

    const handleSave = () => {
        if (!name.trim()) {
            Alert.alert("Missing Information", "Please enter at least a medicine name.");
            return;
        }

        // If in manual mode, we should sync back to 'date' before saving
        // but handleSave uses 'date', and confirm/onDateChange should handle syncing.
        // Actually, let's just use the current 'date' state.

        // Format Time
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;
        const timeString = `${hours}:${minutesStr} ${ampm}`;

        addMedicine({
            name: name,
            time: timeString,
            dosage: dosage,
            category: 'Flexible' // Default
        });

        navigation.goBack();
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        if (event.type === 'set' || Platform.OS === 'ios') {
            setDate(currentDate);
            syncManualFromDate(currentDate);
        }
        // Removed automatic closing to allow user to use "Confirm" button in Modal
    };

    const formatTimeDisplay = (date: Date) => {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutesStr} ${ampm}`;
    };

    useEffect(() => {
        // --- Intensified Stars Animation (Faster & More Dense) ---
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

    return (
        <ImageBackground
            source={BACKGROUND_IMAGE}
            style={styles.container}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    {/* Animated Stars Layers */}
                    <Animated.Image
                        source={require('../../assets/nova/stars.png')}
                        style={[styles.stars, { opacity: starsOpacity1 }]}
                        resizeMode="cover"
                    />
                    <Animated.Image
                        source={require('../../assets/nova/stars.png')}
                        style={[
                            styles.stars,
                            { opacity: starsOpacity2, transform: [{ rotate: '180deg' }] }
                        ]}
                        resizeMode="cover"
                    />
                    <Animated.Image
                        source={require('../../assets/nova/stars.png')}
                        style={[
                            styles.stars,
                            { opacity: starsOpacity3, transform: [{ scale: 1.2 }, { rotate: '90deg' }] }
                        ]}
                        resizeMode="cover"
                    />
                    <Animated.Image
                        source={require('../../assets/nova/stars.png')}
                        style={[
                            styles.stars,
                            { opacity: starsOpacity4, transform: [{ scale: 1.5 }, { rotate: '270deg' }] }
                        ]}
                        resizeMode="cover"
                    />
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Add Medication</Text>
                        <View style={{ width: 24 }} />
                    </View>

                    <ScrollView contentContainerStyle={styles.content}>
                        <View style={styles.formContainer}>

                            {/* Name Input */}
                            <Text style={styles.label}>Medicine Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Vitamin C"
                                placeholderTextColor="#666"
                                value={name}
                                onChangeText={setName}
                            />

                            {/* Time Picker */}
                            <Text style={styles.label}>Time</Text>
                            <TouchableOpacity
                                style={styles.timeButton}
                                onPress={() => setShowPicker(true)}
                            >
                                <Text style={styles.timeButtonText}>{formatTimeDisplay(date)}</Text>
                                <Ionicons name="time-outline" size={24} color="#E0E0E0" />
                            </TouchableOpacity>

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
                                                        if (newState) syncManualFromDate(date);
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
                                                            onChangeText={(val) => {
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
                                                            onChangeText={(val) => {
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
                                                        value={date}
                                                        mode="time"
                                                        is24Hour={false}
                                                        display="spinner"
                                                        onChange={onDateChange}
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
                                                            const newDate = new Date(date);
                                                            let h = parseInt(manualHours) || 12;
                                                            const m = parseInt(manualMinutes) || 0;
                                                            if (manualAmPm === 'PM' && h < 12) h += 12;
                                                            if (manualAmPm === 'AM' && h === 12) h = 0;
                                                            newDate.setHours(h, m, 0, 0);
                                                            setDate(newDate);
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

                            {/* Dosage Input */}
                            <Text style={styles.label}>Dosage (Optional)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. 1 pill"
                                placeholderTextColor="#666"
                                value={dosage}
                                onChangeText={setDosage}
                                keyboardType="numeric"
                            />

                            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                                <LinearGradient
                                    colors={['#FF8860', '#FF5722']}
                                    style={styles.gradientButton}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    <Text style={styles.saveButtonText}>Save Medicine</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                        </View >
                    </ScrollView >
                </KeyboardAvoidingView >
            </SafeAreaView >
        </ImageBackground >
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
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
        fontFamily: 'Poppins-Bold',
    },
    content: {
        padding: 24,
    },
    formContainer: {
        backgroundColor: 'rgba(30, 20, 50, 0.8)',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    label: {
        color: '#E0E0E0',
        fontSize: 16,
        marginBottom: 8,
        marginLeft: 4,
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        padding: 16,
        color: 'white',
        fontSize: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        fontFamily: 'Poppins-Regular',
    },
    timeButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    timeButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500',
        fontFamily: 'Poppins-Medium',
    },
    pickerContainer: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 12,
        marginBottom: 20,
        alignItems: 'center',
        padding: 10,
    },
    confirmButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#4A5060',
        borderRadius: 8,
    },
    confirmButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontFamily: 'Poppins-Bold',
    },
    saveButton: {
        marginTop: 10,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: "#FF5722",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    gradientButton: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Poppins-Bold',
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
    },
});

export default NovaAddMedication;
