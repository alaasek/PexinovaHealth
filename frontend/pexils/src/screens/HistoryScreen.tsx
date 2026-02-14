import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react-native';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    isSameMonth,
    isSameDay,
    addDays,
    isAfter,
} from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, Calendar, Clock, User, Heart } from 'lucide-react-native';
import HistoryBackground from '../components/HistoryBackground';
import DoseIndicator from '../components/DoseIndicator';
import BottomTabs from '../components/BottomTabs';
import { COLORS, FONTS, SPACING } from '../constants/theme';

const { width } = Dimensions.get('window');

// Fully randomized data pool
const MED_NAMES = ['Advil', 'Metformin', 'Insulin Glargine', 'Lisinopril', 'Albuterol', 'Aspirin', 'Tylenol', 'Amoxicillin', 'Lipitor', 'Vicodin'];
const RDV_TITLES = ['Blood Test RDV', 'MRI Scan', 'General Checkup', 'Cardiologist RDV', 'Pharmacy Pickup', 'Dental Cleaning', 'Eye Exam'];

const GENERATE_UNIQUE_HISTORY = () => {
    const data: Record<string, any> = {};
    const baseDate = new Date(2025, 10, 1); // Nov 1, 2025

    for (let i = 0; i < 150; i++) {
        const d = addDays(baseDate, i);
        const key = format(d, 'yyyy-MM-dd');

        // Count: 0, 1, or 2-3
        const daySeed = (i * 7) % 13;
        let medCount = 0;
        if (daySeed === 0) medCount = 0;
        else if (daySeed < 7) medCount = 1;
        else medCount = (daySeed % 2) + 2;

        const medicines = [];
        for (let m = 0; m < medCount; m++) {
            const name = MED_NAMES[(i + m) % MED_NAMES.length];
            const doseCount = (i + m) % 3 + 1;
            const doses = [];
            for (let ds = 0; ds < doseCount; ds++) {
                const hour = 7 + (ds * 5) + (m % 3);
                const min = (i * 15) % 60;
                doses.push({
                    time: `${hour}:${min < 10 ? '0' + min : min}`,
                    status: (i < 100 || (i === 101 && ds === 0)) ? 'onTime' : 'upcoming'
                });
            }
            medicines.push({ name, doses });
        }

        data[key] = {
            medicines,
            appointments: medCount > 0 && i % 6 === 0 ? [{
                id: i,
                title: RDV_TITLES[i % RDV_TITLES.length],
                completed: i < 101
            }] : []
        };
    }

    return data;
};

const HISTORY_DATA = GENERATE_UNIQUE_HISTORY();

export default function HistoryScreen() {
    const navigation = useNavigation<any>();
    const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1)); // Feb 2026
    const [selectedDate, setSelectedDate] = useState(new Date(2026, 1, 10));
    const today = new Date(2026, 1, 10);

    const calendarDays = useMemo(() => {
        const monthStart = startOfMonth(currentDate);
        const startDate = startOfWeek(monthStart);
        const days = [];
        for (let i = 0; i < 35; i++) {
            days.push(addDays(startDate, i));
        }
        return days;
    }, [currentDate]);

    const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const formattedSelected = format(selectedDate, 'yyyy-MM-dd');
    const isFuture = isAfter(selectedDate, today);
    const activeData = HISTORY_DATA[formattedSelected] || { medicines: [], appointments: [] };

    return (
        <View style={styles.container}>
            <HistoryBackground />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate('Statistics')} style={styles.backBtn}>
                        <ChevronLeft size={28} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>History</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.monthSelector}>
                        <TouchableOpacity onPress={handlePrevMonth}>
                            <ChevronLeft size={20} color="rgba(255,255,255,0.4)" />
                        </TouchableOpacity>
                        <Text style={styles.monthLabel}>{format(currentDate, 'MMMM')}</Text>
                        <TouchableOpacity onPress={handleNextMonth}>
                            <ChevronRight size={20} color="rgba(255,255,255,0.4)" />
                        </TouchableOpacity>
                    </View>

                    <LinearGradient
                        colors={['transparent', 'rgba(255,255,255,0.1)', 'transparent']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradientDivider}
                    />

                    <View style={styles.weekLabelsContainer}>
                        <View style={styles.weekLabels}>
                            {dayNames.map(day => (
                                <Text key={day} style={styles.weekText}>{day}</Text>
                            ))}
                        </View>
                    </View>

                    <View style={styles.calendarContainer}>
                        <View style={styles.gridBox}>
                            {calendarDays.map((day, idx) => {
                                const isSelected = isSameDay(day, selectedDate);
                                const isToday = isSameDay(day, today);
                                const isCurrentMonth = isSameMonth(day, currentDate);

                                let bgColor = COLORS.neutralGrey;
                                let textColor = '#2A0E2E';

                                if (!isCurrentMonth) {
                                    bgColor = 'rgba(216, 203, 202, 0.25)';
                                    textColor = 'rgba(42, 14, 46, 0.3)';
                                }

                                if (isSelected) {
                                    bgColor = COLORS.selectedPurple;
                                    textColor = '#FFFFFF';
                                } else if (isToday) {
                                    bgColor = COLORS.todayRed;
                                    textColor = '#FFFFFF';
                                }

                                return (
                                    <View key={idx} style={styles.daySlot}>
                                        <TouchableOpacity
                                            style={[styles.dayInnerCircle, { backgroundColor: bgColor }]}
                                            onPress={() => isCurrentMonth && setSelectedDate(day)}
                                            disabled={!isCurrentMonth}
                                        >
                                            <Text style={[styles.dayNum, { color: textColor }]}>
                                                {format(day, 'd')}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                        </View>
                    </View>

                    <LinearGradient
                        colors={['transparent', 'rgba(255,255,255,0.1)', 'transparent']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.gradientDivider, { marginTop: SPACING.l }]}
                    />

                    <View style={styles.contentWrap}>
                        <View style={styles.bannerRow}>
                            <Text style={styles.dateBanner}>{format(selectedDate, 'd MMMM yyyy').toLowerCase()}</Text>
                        </View>

                        {isFuture ? (
                            <View style={styles.futureState}>
                                <Text style={styles.futureHint}>See you soon</Text>
                            </View>
                        ) : (
                            <>
                                <Text style={styles.sectionHeader}>Medicines</Text>
                                {activeData.medicines.length > 0 ? (
                                    <View style={styles.nestedContainer}>
                                        {activeData.medicines.map((med: any, idx: number) => (
                                            <View key={idx} style={styles.contentCard}>
                                                <Text style={styles.cardTitle}>{med.name}</Text>
                                                <DoseIndicator doses={med.doses} />
                                            </View>
                                        ))}
                                    </View>
                                ) : (
                                    <Text style={styles.emptyMsg}>No history recorded</Text>
                                )}

                                {activeData.appointments.length > 0 && (
                                    <>
                                        <Text style={[styles.sectionHeader, { marginTop: SPACING.xl }]}>Appointment</Text>
                                        <View style={styles.nestedContainer}>
                                            {activeData.appointments.map((app: any, idx: number) => (
                                                <View key={app.id} style={styles.contentCard}>
                                                    <Text style={styles.cardTitle}>{app.title}</Text>
                                                    <View style={styles.chkBoxBg}>
                                                        <View style={[styles.chkBoxIn, app.completed && styles.chkDone]}>
                                                            {app.completed && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                                                        </View>
                                                    </View>
                                                </View>
                                            ))}
                                        </View>
                                    </>
                                )}
                            </>
                        )}
                    </View>

                    <View style={{ height: 100 }} />
                </ScrollView>
            </SafeAreaView>
            <BottomTabs />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#080610',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 28, // Increased margin
        paddingTop: 40, // Shifted down
        paddingBottom: SPACING.s,
    },
    backBtn: {
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 26,
        color: '#FFFFFF',
        fontFamily: FONTS.semiBold,
    },
    scrollContent: {
        paddingHorizontal: 28,
        paddingTop: 15, // Extra space from header
    },
    monthSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.xl,
        marginTop: SPACING.m,
        marginBottom: SPACING.s,
    },
    monthLabel: {
        fontSize: 17,
        color: 'rgba(255,255,255,0.4)',
        fontFamily: FONTS.medium,
        letterSpacing: 1.2,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.15)', // More visible
        width: '100%',
        marginVertical: SPACING.s,
    },
    gradientDivider: {
        height: 1,
        width: '100%',
        marginVertical: SPACING.s,
    },
    weekLabelsContainer: {
        alignItems: 'center',
        width: '100%',
    },
    weekLabels: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: SPACING.m,
        width: '85%', // Tighten to match Grid
    },
    weekText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: FONTS.bold,
        width: 36,
        textAlign: 'center',
    },
    calendarContainer: {
        alignItems: 'center',
        width: '100%',
        marginTop: 10, // More space between month and grid
    },
    gridBox: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '85%',
    },
    daySlot: {
        width: '14.28%',
        alignItems: 'center',
        marginBottom: 8,
    },
    dayInnerCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayNum: {
        fontSize: 12,
        fontFamily: FONTS.bold,
    },
    contentWrap: {
        marginTop: 20,
    },
    bannerRow: {
        alignItems: 'center',
        width: '100%',
    },
    dateBanner: {
        color: '#FFFFFF',
        fontSize: 13,
        textAlign: 'right',
        width: '85%', // Align with end of grid
        marginBottom: SPACING.m,
        opacity: 0.6,
        fontFamily: FONTS.regular,
    },
    sectionHeader: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: FONTS.semiBold, // Updated to SemiBold as requested
        marginBottom: SPACING.m,
        paddingLeft: width * (1 - 0.85) / 2, // Align with grid rail
    },
    nestedContainer: {
        backgroundColor: 'rgba(28, 12, 38, 0.16)',
        borderRadius: 24,
        padding: 12,
        shadowColor: '#C8C8C8',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 14,
        elevation: 6,
        gap: 12,
        width: '85%', // Shrink to match grid
        alignSelf: 'center',
    },
    contentCard: {
        backgroundColor: 'rgba(217, 217, 217, 0.12)', // Decreased opacity
        borderRadius: 9, // Radius 9 as requested
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTitle: {
        color: '#FFFFFF',
        fontSize: 16, // Smaller card text
        fontFamily: FONTS.medium,
        opacity: 0.9,
    },
    futureState: {
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    futureHint: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 18,
        fontFamily: FONTS.medium,
        fontStyle: 'italic',
    },
    emptyMsg: {
        color: 'rgba(255,255,255,0.2)',
        textAlign: 'center',
        marginVertical: 10,
        fontSize: 13,
        fontFamily: FONTS.regular,
    },
    chkBoxBg: {
        width: 24,
        height: 24,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chkBoxIn: {
        width: 18,
        height: 18,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: COLORS.selectedPurple,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chkDone: {
        backgroundColor: COLORS.selectedPurple,
    },
});
