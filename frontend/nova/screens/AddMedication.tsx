import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'AddMedication'>;

const AddMedication: React.FC<Props> = ({ navigation }) => {
    const [medicineName, setMedicineName] = useState('');
    const [dosage, setDosage] = useState('1');
    const [selectedCategory, setSelectedCategory] = useState('Critical');

    // Time State
    const [hour, setHour] = useState('7');
    const [minute, setMinute] = useState('00');
    const [isAm, setIsAm] = useState(true);

    const categories = ['Critical', 'Time-sensitive', 'Flexible'];

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Add Medication</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView contentContainerStyle={styles.content}>

                    {/* Medicine Name Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Medicine Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your medicine name"
                            placeholderTextColor="#666680"
                            value={medicineName}
                            onChangeText={setMedicineName}
                        />
                    </View>

                    {/* Dosage Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Dosage</Text>
                        <View style={styles.dosageContainer}>
                            <TextInput
                                style={styles.dosageInput}
                                value={dosage}
                                onChangeText={setDosage}
                                placeholder="1"
                                placeholderTextColor="#AAA"
                                keyboardType="default"
                            />
                        </View>
                    </View>

                    {/* Timer Picker */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Timer</Text>
                        <View style={styles.timerContainer}>
                            <View style={styles.timeBox}>
                                <TextInput
                                    style={styles.timeInput}
                                    value={hour}
                                    onChangeText={(text) => setHour(text.replace(/[^0-9]/g, '').slice(0, 2))}
                                    keyboardType="number-pad"
                                    placeholder="07"
                                    placeholderTextColor="#AAA"
                                />
                            </View>
                            <Text style={styles.colon}>:</Text>
                            <View style={styles.timeBox}>
                                <TextInput
                                    style={styles.timeInput}
                                    value={minute}
                                    onChangeText={(text) => setMinute(text.replace(/[^0-9]/g, '').slice(0, 2))}
                                    keyboardType="number-pad"
                                    placeholder="00"
                                    placeholderTextColor="#AAA"
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.amPmContainer}
                                onPress={() => setIsAm(!isAm)}
                            >
                                <View style={[styles.amPmOption, isAm && styles.amPmActive]}>
                                    <Text style={[styles.amPmText, isAm && styles.amPmTextActive]}>AM</Text>
                                </View>
                                <View style={[styles.amPmOption, !isAm && styles.amPmActive]}>
                                    <Text style={[styles.amPmText, !isAm && styles.amPmTextActive]}>PM</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Category Selection */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Category</Text>
                        <View style={styles.categoryContainer}>
                            {categories.map((cat) => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[
                                        styles.categoryChip,
                                        selectedCategory === cat && styles.categoryChipActive
                                    ]}
                                    onPress={() => setSelectedCategory(cat)}
                                >
                                    <Text style={[
                                        styles.categoryText,
                                        selectedCategory === cat && styles.categoryTextActive
                                    ]}>{cat}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                </ScrollView>

                {/* Save Button */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.saveButton}
                        activeOpacity={0.8}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#160F25', // Deep dark background
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
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    content: {
        paddingHorizontal: 25,
        paddingTop: 20,
    },
    inputGroup: {
        marginBottom: 25,
    },
    label: {
        fontSize: 15,
        color: '#FFFFFF',
        fontWeight: '500',
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#1F1632',
        borderRadius: 12,
        padding: 16,
        color: '#FFFFFF',
        fontSize: 15,
    },
    dosageContainer: {
        backgroundColor: '#1F1632',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dosageInput: {
        color: '#FFFFFF',
        fontSize: 16,
        flex: 1, // Take full width
        padding: 0, // Reset padding
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeBox: {
        backgroundColor: '#7A6E8A', // Muted purple/grey for time box
        borderRadius: 8,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeInput: {
        fontSize: 28,
        color: '#FFFFFF',
        fontWeight: '400',
        textAlign: 'center',
        width: '100%',
        height: '100%',
    },
    colon: {
        fontSize: 28,
        color: '#FFFFFF',
        marginHorizontal: 10,
        fontWeight: '300',
    },
    amPmContainer: {
        backgroundColor: '#D0D0D0', // Light grey container
        borderRadius: 8,
        marginLeft: 15,
        width: 50,
        height: 60,
        justifyContent: 'center',
        padding: 2,
    },
    amPmOption: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
    },
    amPmActive: {
        backgroundColor: '#FFFFFF',
    },
    amPmText: {
        fontSize: 11,
        color: '#666',
        fontWeight: '600',
    },
    amPmTextActive: {
        color: '#000',
    },
    categoryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    categoryChip: {
        backgroundColor: '#1F1632',
        paddingVertical: 12,
        paddingHorizontal: 12, // Adjusted for space
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        flex: 1,
        marginHorizontal: 4,
        alignItems: 'center',
    },
    categoryChipActive: {
        backgroundColor: '#6A5F7A', // Highlight color
    },
    categoryText: {
        color: '#CCCCCC',
        fontSize: 11,
        fontWeight: '600',
    },
    categoryTextActive: {
        color: '#FFFFFF',
    },
    footer: {
        paddingHorizontal: 25,
        paddingBottom: 30,
        marginTop: 'auto',
    },
    saveButton: {
        backgroundColor: '#EB4D28', // Orange
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        shadowColor: '#EB4D28',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AddMedication;
