import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, TrendingUp, Award, Activity, Calendar, Check, X, Sparkles } from 'lucide-react-native';
import Svg, { Rect, Circle, G, Text as SvgText, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import HistoryBackground from '../components/HistoryBackground';
import BottomTabs from '../components/BottomTabs';
import { COLORS, FONTS, SPACING } from '../constants/theme';

const { width, height } = Dimensions.get('window');
const PAGE_PADDING = 28;
const CHART_WIDTH = width - (PAGE_PADDING * 2);

// Mock Data for Bar Chart (Yearly Overview) - Max 30 days
const BAR_DATA = [
    { label: 'jan', value: 12 },
    { label: 'feb', value: 30, highlight: true },
    { label: 'mar', value: 18 },
    { label: 'apr', value: 15 },
    { label: 'mai', value: 22 },
    { label: 'jui', value: 20 },
    { label: 'lui', value: 25 },
    { label: 'aou', value: 10 },
    { label: 'sep', value: 8 },
    { label: 'oct', value: 12 },
    { label: 'nov', value: 28 },
    { label: 'dec', value: 18 },
];

const Star = ({ size, top, left, opacity }: { size: number; top: number; left: number; opacity: number }) => (
    <View
        style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: '#FFFFFF',
            top,
            left,
            opacity,
        }}
    />
);

const RingProgress = ({ progress = 0.71, size = 180, strokeWidth = 12 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    // 7 segments for 7 days
    const segments = 7;
    const gapDeg = 12;
    const gapLen = (gapDeg / 360) * circumference;
    const segmentLen = (circumference / segments) - gapLen;

    // Specific colors and opacities from the user's provided palette
    const dayColors = [
        '#E4421ECC', // Orange (80% opacity)
        '#E25619AB', // Rust (67% opacity)
        '#B88E8BCC', // Rose (80% opacity)
        '#7A4C75CC', // Purple (80% opacity)
        '#170E24CC', // Navy (80% opacity)
        '#FFFFFFB0', // White day left (69% opacity)
        '#FFFFFFB0', // White day left (69% opacity)
    ];

    return (
        <View style={styles.ringContainer}>
            <Svg width={size} height={size}>
                <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
                    {dayColors.map((color, i) => (
                        <React.Fragment key={i}>
                            {/* Light outer border for separation */}
                            <Circle
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                stroke="rgba(255, 255, 255, 0.15)"
                                strokeWidth={strokeWidth + 2}
                                strokeDasharray={`${segmentLen + 2} ${circumference - (segmentLen + 2)}`}
                                strokeDashoffset={-(i * (circumference / segments) - 1)}
                                strokeLinecap="round"
                                fill="none"
                            />
                            {/* Main colored segment */}
                            <Circle
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                stroke={color}
                                strokeWidth={strokeWidth}
                                strokeDasharray={`${segmentLen} ${circumference - segmentLen}`}
                                strokeDashoffset={-i * (circumference / segments)}
                                strokeLinecap="round"
                                fill="none"
                            />
                        </React.Fragment>
                    ))}
                </G>
            </Svg>
            <View style={styles.ringCenterText}>
                <Text style={styles.ringVal}>5/7</Text>
                <Text style={styles.ringSub}>days Completed</Text>
            </View>
        </View>
    );
};

const StatCard = ({ label, value, icon: Icon }: { label: string; value: string | number; icon?: any }) => (
    <View style={styles.gridCard}>
        <View style={styles.starCluster}>
            <Sparkles size={40} color="rgba(255,255,255,0.1)" style={styles.cardSparkle} />
        </View>
        {Icon && <Icon size={16} color="rgba(255,255,255,0.4)" style={styles.cardIcon} />}
        <Text style={styles.cardVal}>{value}</Text>
        <Text style={styles.cardLabel}>{label}</Text>
    </View>
);

export default function StatisticsScreen() {
    const navigation = useNavigation<any>();
    const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('week');
    const [selectedMonth, setSelectedMonth] = useState<string | null>('feb');

    const renderWeekView = () => (
        <View key="week-view" style={styles.weekViewFull}>
            <View style={styles.statsDashboard}>
                <RingProgress />

                <View style={styles.dividerBox}>
                    <View style={[styles.horizontalBar, { marginTop: 40 }]} />
                    <View style={styles.adherenceInfo}>
                        <Text style={styles.infoText}>Adherence : <Text style={styles.boldText}>71%</Text></Text>
                        <Text style={styles.infoText}>Current Streak : <Text style={styles.boldText}>4 Days</Text></Text>
                        <Text style={styles.infoText}>Missed Doses : <Text style={styles.boldText}>2</Text></Text>
                        <Text style={styles.infoText}>2 appointments</Text>
                    </View>
                    <View style={[styles.horizontalBar, { marginBottom: 30 }]} />
                </View>

                {/* Weekly Checkmarks */}
                <View style={styles.weeklyGrid}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                        <View key={day} style={styles.dayCol}>
                            <Text style={styles.dayLabel}>{day}</Text>
                            <View style={[styles.dayCircle, idx === 4 ? styles.dayX : styles.dayCheck, idx > 4 && { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
                                {idx === 4 ? <X size={14} color="#FFFFFF" /> : idx < 4 ? <Check size={14} color="#FFFFFF" /> : null}
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );

    const renderMonthView = () => (
        <View key="month-view" style={styles.weekViewFull}>
            <View style={styles.statsDashboard}>
                {/* Headline */}
                <View style={styles.headlineSection}>
                    <Text style={styles.headlineText}>You stayed consistent for 20 days!</Text>
                    <View style={styles.subheadlineContainer}>
                        <View style={styles.sideLine} />
                        <View style={styles.subheadTextWrapper}>
                            <Text style={styles.subheadMain}>You followed your treatment</Text>
                            <Text style={styles.subheadVal}>85% of the time</Text>
                        </View>
                        <View style={styles.sideLine} />
                    </View>
                </View>

                {/* Progress Bar (Statistics 3 style) */}
                <View style={[styles.planetProgressSection, { width: '100%' }]}>
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBarBg}>
                            <View style={[styles.progressBarFill, { width: '85%' }]} />
                        </View>
                    </View>
                    <View style={[styles.planetPill, { marginTop: 24 }]}>
                        <Text style={styles.planetPillText}>3 days left to unlock your planet! 🪐</Text>
                    </View>
                </View>

                {/* Grid of Stats Cards */}
                <View style={[styles.statsGrid, { width: '100%', marginTop: 20 }]}>
                    <View style={styles.gridRow}>
                        <StatCard label="DAYS COMPLETED" value="28" />
                        <StatCard label="PERFECT DAYS" value="20" />
                    </View>
                    <View style={styles.gridRow}>
                        <StatCard label="MISSED DAYS" value="5" />
                        <StatCard label="APPOINTMENTS" value="5" />
                    </View>
                    <View style={styles.longestStreakCard}>
                        <Text style={styles.streakVal}>10 days</Text>
                        <Text style={styles.streakLabel}>LONGEST STREAK</Text>
                    </View>
                </View>
            </View>
        </View>
    );

    const renderYearView = () => (
        <View key="year-view" style={styles.weekViewFull}>
            <View style={styles.statsDashboard}>
                {/* Headline for Year */}
                <View style={styles.headlineSection}>
                    <Text style={styles.headlineTextYear}>You've been incredibly consistent</Text>
                    <View style={styles.underlineDecorationMatched} />
                </View>

                {/* Grid of Icon Stats (Year) */}
                <View style={styles.iconStatsRow}>
                    <View style={styles.iconStatCard}>
                        <View style={styles.iconCircle}>
                            <Sparkles size={18} color="#D6977B" />
                        </View>
                        <Text style={styles.iconStatVal}>10</Text>
                        <Text style={styles.iconStatLabel}>PLANETES UNLOCKED</Text>
                    </View>
                    <View style={styles.iconStatCard}>
                        <View style={styles.iconCircle}>
                            <Award size={18} color="#D6977B" />
                        </View>
                        <Text style={styles.iconStatVal}>230</Text>
                        <Text style={styles.iconStatLabel}>PERFECT DAY</Text>
                    </View>
                    <View style={styles.iconStatCard}>
                        <View style={styles.iconCircle}>
                            <Activity size={18} color="#D6977B" />
                        </View>
                        <Text style={styles.iconStatVal}>78%</Text>
                        <Text style={styles.iconStatLabel}>AVERAGE ADHERENCE</Text>
                    </View>
                </View>

                {/* Yearly Overview Section (Interactive) */}
                <View style={styles.chartSection}>
                    <Text style={styles.chartTitle}>Yearly Overview</Text>
                    <View style={styles.barChartContainer}>
                        <Svg width={CHART_WIDTH} height={220}>
                            {BAR_DATA.map((item, i) => {
                                // Scale bars to be much longer (max value 30)
                                const barHeight = (item.value / 30) * 120;
                                const barWidth = 14;
                                const spacing = (CHART_WIDTH - (BAR_DATA.length * barWidth)) / (BAR_DATA.length - 1);
                                const x = i * (barWidth + spacing);
                                const y = 200 - barHeight; // Lower baseline to give more space at the top
                                const isSelected = selectedMonth === item.label;

                                return (
                                    <G key={item.label} onPress={() => setSelectedMonth(item.label)}>
                                        <Rect
                                            x={x}
                                            y={y}
                                            width={barWidth}
                                            height={barHeight}
                                            rx={7}
                                            fill={isSelected ? "#E25619" : "rgba(226, 86, 25, 0.4)"}
                                            opacity={1}
                                        />
                                        {isSelected && (
                                            <View style={{ position: 'absolute', top: y - 45, left: x - 25 }}>
                                                <View style={styles.chartTooltip}>
                                                    <Text style={styles.tooltipText}>{item.value} perfect day</Text>
                                                </View>
                                            </View>
                                        )}
                                        {/* Alternative logic if Svg doesn't support nested View tooltips easily: draw tooltip via SVG */}
                                        {isSelected && (
                                            <G>
                                                {/* Tooltip background - taller but narrower */}
                                                <Rect x={x - 30} y={y - 45} width={75} height={35} rx={8} fill="#F8F7F7" />
                                                <SvgText
                                                    x={x + 7}
                                                    y={y - 30}
                                                    fontSize="8"
                                                    fill="#000"
                                                    textAnchor="middle"
                                                    fontFamily={FONTS.medium}
                                                >
                                                    best month with
                                                </SvgText>
                                                <SvgText
                                                    x={x + 7}
                                                    y={y - 18}
                                                    fontSize="8"
                                                    fill="#000"
                                                    textAnchor="middle"
                                                    fontFamily={FONTS.bold}
                                                >
                                                    {item.value} day perfect !!!
                                                </SvgText>
                                            </G>
                                        )}
                                        <SvgText
                                            x={x + barWidth / 2}
                                            y={218}
                                            fontSize="9"
                                            fill="rgba(255,255,255,0.4)"
                                            textAnchor="middle"
                                            fontFamily={FONTS.regular}
                                        >
                                            {item.label}
                                        </SvgText>
                                    </G>
                                );
                            })}
                        </Svg>
                    </View>
                </View>

                {/* Banner Card at bottom of Year scroll (Premium Purple) */}
                <TouchableOpacity style={styles.bannerCardPremium}>
                    <View style={styles.bannerInner}>
                        <Text style={styles.bannerMain}>best month with 30 day perfect !!!</Text>
                        <Text style={styles.bannerSub}>good job keep going</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <HistoryBackground />
            <SafeAreaView style={styles.safeArea}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <ChevronLeft size={28} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Progress</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('History')} style={styles.calendarBtn}>
                        <Calendar size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Timeframe Selector */}
                    <View style={styles.tabBar}>
                        {(['week', 'month', 'year'] as const).map((t) => (
                            <TouchableOpacity
                                key={t}
                                style={[styles.tab, timeframe === t && styles.activeTab]}
                                onPress={() => setTimeframe(t)}
                            >
                                <Text style={[styles.tabText, timeframe === t && styles.activeTabText]}>{t}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {timeframe === 'week' && renderWeekView()}
                    {timeframe === 'month' && renderMonthView()}
                    {timeframe === 'year' && renderYearView()}

                    <View style={{ height: 120 }} />
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
        paddingHorizontal: PAGE_PADDING,
        paddingTop: 40,
        paddingBottom: SPACING.m,
    },
    backBtn: {
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 26,
        color: '#FFFFFF',
        fontFamily: FONTS.semiBold,
        textAlign: 'left',
        paddingLeft: 4,
    },
    calendarBtn: {
        padding: 5,
        position: 'absolute',
        right: PAGE_PADDING,
        bottom: SPACING.m,
    },
    scrollContent: {
        paddingHorizontal: PAGE_PADDING,
        paddingTop: 10,
        flexGrow: 1,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 4,
        marginBottom: SPACING.xl,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    activeTab: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    tabText: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 14,
        fontFamily: FONTS.medium,
        textTransform: 'lowercase',
    },
    activeTabText: {
        color: '#FFFFFF',
    },
    headlineSection: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    headlineText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontFamily: FONTS.medium,
        textAlign: 'center',
    },
    headlineTextYear: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: FONTS.medium,
        textAlign: 'center',
    },
    underlineDecorationMatched: {
        width: 240,
        height: 2,
        backgroundColor: 'rgba(112, 73, 136, 0.8)',
        marginTop: 6,
        alignSelf: 'center',
    },
    headlineSub: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 14,
        fontFamily: FONTS.regular,
        textAlign: 'center',
        lineHeight: 20,
    },
    dashboardContainer: {
        flex: 1,
    },
    dividerBox: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 24,
    },
    horizontalBar: {
        width: '80%',
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginVertical: 18,
    },
    weekViewFull: {
        flex: 1,
        minHeight: height * 0.7,
    },
    planetProgressSection: {
        paddingHorizontal: 10,
        marginBottom: SPACING.xl,
    },
    progressContainer: {
        width: '100%',
        marginBottom: 16,
    },
    progressBarBg: {
        width: '100%',
        height: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#E4421E',
        borderRadius: 5,
    },
    planetPill: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    subheadlineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
    },
    sideLine: {
        width: 60,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    subheadTextWrapper: {
        width: 178,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 12,
    },
    subheadMain: {
        color: '#FFFFFF',
        fontSize: 11,
        fontFamily: FONTS.regular,
        textAlign: 'center',
    },
    subheadVal: {
        color: '#B293C5',
        fontSize: 13,
        fontFamily: FONTS.bold,
        textAlign: 'center',
    },
    planetPillText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
        fontFamily: FONTS.medium,
    },
    statsGrid: {
        gap: 12,
        marginBottom: SPACING.xl,
    },
    gridRow: {
        flexDirection: 'row',
        gap: 12,
    },
    cardVal: {
        color: '#E25619',
        fontSize: 32,
        fontFamily: FONTS.bold,
        marginBottom: 4,
    },
    cardLabel: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 10,
        fontFamily: FONTS.bold,
        textTransform: 'uppercase',
    },
    cardIcon: {
        marginBottom: 8,
    },
    starCluster: {
        position: 'absolute',
        top: -10,
        right: -10,
    },
    cardSparkle: {
        opacity: 0.5,
    },
    gridCard: {
        flex: 1,
        backgroundColor: 'rgba(248, 247, 247, 0.04)',
        borderRadius: 20,
        padding: 20,
        height: 120,
        justifyContent: 'center',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6.03 },
        shadowOpacity: 0.1,
        shadowRadius: 6.03,
        elevation: 6,
    },
    longestStreakCard: {
        marginTop: 12,
        backgroundColor: 'rgba(248, 247, 247, 0.04)',
        borderRadius: 20,
        padding: 24,
        height: 100,
        justifyContent: 'center',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6.03 },
        shadowOpacity: 0.1,
        shadowRadius: 6.03,
        elevation: 6,
    },
    streakVal: {
        color: '#E25619',
        fontSize: 28,
        fontFamily: FONTS.bold,
        marginBottom: 2,
    },
    streakLabel: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 10,
        fontFamily: FONTS.bold,
        textTransform: 'uppercase',
    },
    statsDashboard: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        padding: 30,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: -PAGE_PADDING, // Edge to edge
        marginTop: 20,
        paddingBottom: 120, // Content padding
    },
    ringContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    ringCenterText: {
        position: 'absolute',
        alignItems: 'center',
    },
    ringVal: {
        color: '#E4421E',
        fontSize: 34,
        fontFamily: FONTS.bold,
    },
    ringSub: {
        color: '#E4421E',
        fontSize: 12,
        fontFamily: FONTS.medium,
        marginTop: 2,
    },
    adherenceInfo: {
        alignItems: 'center',
        gap: 8,
        marginBottom: 24,
    },
    infoText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontFamily: FONTS.regular,
        opacity: 0.8,
    },
    boldText: {
        fontFamily: FONTS.bold,
        opacity: 1,
    },
    weeklyGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        padding: 12,
    },
    dayCol: {
        alignItems: 'center',
        gap: 6,
    },
    dayLabel: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 9,
        fontFamily: FONTS.medium,
    },
    dayCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayCheck: {
        backgroundColor: '#E4421E',
    },
    dayX: {
        backgroundColor: '#1A1D2E',
    },
    chartSection: {
        marginBottom: SPACING.xl,
    },
    iconStatsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    iconStatCard: {
        flex: 1,
        backgroundColor: 'rgba(248, 247, 247, 0.04)',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        marginHorizontal: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6.03 },
        shadowOpacity: 0.1,
        shadowRadius: 6.03,
        elevation: 6,
    },
    iconStatVal: {
        color: '#FFFFFF',
        fontSize: 20,
        fontFamily: FONTS.bold,
        marginVertical: 4,
    },
    iconStatLabel: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 8,
        fontFamily: FONTS.bold,
        textAlign: 'center',
    },
    chartTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: FONTS.medium,
        marginBottom: SPACING.m,
        alignSelf: 'flex-start',
    },
    barChartContainer: {
        paddingTop: 10,
        alignItems: 'center',
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(214, 151, 123, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    underlineDecoration: {
        width: 140,
        height: 3,
        backgroundColor: 'rgba(112, 73, 136, 0.5)',
        marginTop: 4,
        alignSelf: 'center',
    },
    bannerCard: {
        marginTop: 20,
        backgroundColor: 'rgba(112, 73, 136, 0.8)',
        borderRadius: 20,
        padding: 2,
        width: '100%',
    },
    bannerInner: {
        borderRadius: 18,
        padding: 20,
        alignItems: 'center',
    },
    bannerMain: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: FONTS.bold,
        textAlign: 'center',
        marginBottom: 4,
    },
    bannerSub: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 11,
        fontFamily: FONTS.regular,
        textAlign: 'center',
    },
    bannerCardPremium: {
        marginTop: 20,
        backgroundColor: 'rgba(74, 32, 100, 0.9)', // Deep premium purple
        borderRadius: 20,
        width: '100%',
        paddingVertical: 18,
    },
    chartTooltip: {
        backgroundColor: '#F8F7F7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    tooltipText: {
        color: '#000000',
        fontSize: 8,
        fontFamily: FONTS.bold,
    },
});
