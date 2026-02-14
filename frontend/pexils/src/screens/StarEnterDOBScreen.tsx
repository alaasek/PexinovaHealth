import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, Alert, View, Platform, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';

export default function StarEnterDOBScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { email, password, name } = route.params || {};

    const [dob, setDob] = useState(new Date(2000, 0, 1));
    const [showPicker, setShowPicker] = useState(false);

    const handleNext = () => {
        const formattedDob = dob.toISOString().split("T")[0];
        navigation.navigate('EnterDisease', { email, password, name, dob: formattedDob });
    };

    const onChange = (event: any, selectedDate?: Date) => {
        // On Android, the picker closes itself. On iOS, we might want to keep it open or close it manually.
        // For simplicity, we just set the date.
        if (Platform.OS === 'android') {
            setShowPicker(false);
        }
        if (selectedDate) {
            setDob(selectedDate);
        }
    };

    return (
        <ScreenWrapper>
            <Text style={styles.title}>Enter your date of birth</Text>

            {/* Date Display / Trigger */}
            <TouchableOpacity style={styles.inputTrigger} onPress={() => setShowPicker(true)}>
                <Text style={styles.dateText}>{dob.toDateString()}</Text>
            </TouchableOpacity>

            {/* Picker Logic */}
            {showPicker && (
                Platform.OS === 'ios' ? (
                    <Modal transparent={true} animationType="fade" visible={showPicker} onRequestClose={() => setShowPicker(false)}>
                        <View style={styles.modalOverlay}>
                            <View style={styles.iosPickerContainer}>
                                <DateTimePicker
                                    value={dob}
                                    mode="date"
                                    display="spinner"
                                    themeVariant="dark" // darker theme for iOS picker
                                    onChange={onChange}
                                    style={{ height: 200 }}
                                />
                                <TouchableOpacity style={styles.closeButton} onPress={() => setShowPicker(false)}>
                                    <Text style={styles.closeButtonText}>Done</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                ) : (
                    <DateTimePicker
                        value={dob}
                        mode="date"
                        display="default"
                        onChange={onChange}
                    />
                )
            )}

            <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
                <Text style={styles.primaryButtonText}>Next</Text>
            </TouchableOpacity>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    title: { fontSize: 22, fontWeight: "700", color: "#fff", textAlign: "center", marginBottom: 10, fontFamily: 'Poppins-Bold' },
    inputTrigger: {
        backgroundColor: "rgba(28,28,60,0.8)",
        padding: 14,
        borderRadius: 10,
        marginBottom: 30,
        width: "100%",
        alignItems: 'center'
    },
    dateText: { color: "#fff", fontSize: 16, fontFamily: 'Poppins-Regular' },
    primaryButton: { backgroundColor: "#d45425", paddingVertical: 16, borderRadius: 12, alignItems: "center", width: "100%" },
    primaryButtonText: { color: "#fff", fontSize: 16, fontWeight: "600", fontFamily: 'Poppins-SemiBold' },

    // iOS Picker Modal Styles
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    iosPickerContainer: {
        backgroundColor: '#2A2035',
        borderRadius: 20,
        padding: 20,
        width: '90%',
        alignItems: 'center'
    },
    closeButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#d45425',
        borderRadius: 10,
        width: '100%',
        alignItems: 'center'
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold'
    }
});
