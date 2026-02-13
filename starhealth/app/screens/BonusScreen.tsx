// app/screens/BonusScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

export default function BonusScreen() {
  const circleAnim = useRef(new Animated.Value(0)).current; // 0..100
  const sleepAnim = useRef(new Animated.Value(0)).current; // 0..1
  const [circleFill, setCircleFill] = useState(0);
  const [sleepProgress, setSleepProgress] = useState(0);
  const [heartData, setHeartData] = useState<number[]>([72, 88, 76, 95, 84, 92]);

  useEffect(() => {
    Animated.timing(circleAnim, { toValue: 80, duration: 900, useNativeDriver: false }).start();
    Animated.timing(sleepAnim, { toValue: 0.6, duration: 800, useNativeDriver: false }).start();

    const cId = circleAnim.addListener(({ value }) => setCircleFill(Math.round(value)));
    const sId = sleepAnim.addListener(({ value }) => setSleepProgress(value));

    const interval = setInterval(() => {
      setHeartData(prev => prev.slice(1).concat([70 + Math.round(Math.random() * 30)]));
    }, 700);

    return () => {
      circleAnim.removeListener(cId);
      sleepAnim.removeListener(sId);
      clearInterval(interval);
    };
  }, []);

  // SVG circular progress (works in Expo Go)
  const CircularProgress = ({ size = 96, strokeWidth = 8, progress = 80, color = '#4ADE80', label = '' }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <View style={{ alignItems: 'center', marginTop: 8 }}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            opacity={0.14}
          />
        </Svg>
        <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
          <Text style={styles.circleLabel}>{label}</Text>
        </View>
      </View>
    );
  };

  // Grid background for heartbeat chart: draws horizontal and vertical lines
  const HeartGrid = ({ w = width * 0.42, h = 80, rows = 4, cols = 6 }: { w?: number; h?: number; rows?: number; cols?: number }) => {
    const rowLines = [];
    for (let i = 0; i <= rows; i++) {
      const top = (i / rows) * h;
      rowLines.push(<View key={`r-${i}`} style={[styles.gridLineHorizontal, { top }]} />);
    }
    const colLines = [];
    for (let j = 0; j <= cols; j++) {
      const left = (j / cols) * w;
      colLines.push(<View key={`c-${j}`} style={[styles.gridLineVertical, { left, height: h }]} />);
    }
    return (
      <View style={{ width: w, height: h, position: 'absolute', left: 0, top: 0 }}>
        {rowLines}
        {colLines}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ImageBackground source={require('../../assets/images/Bonus.png')} style={styles.background}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Bonus</Text>

          <Text style={styles.message}>
            As our first Mission is help you improve your health, you will gain an additional score by having a healthy lifestyle habits
          </Text>

          <View style={styles.grid}>
            {/* Steps */}
            <View style={[styles.card, styles.cardShadow]}>
              <View style={styles.cardHeader}>
                <Icon name="walk" size={22} color="#4ADE80" />
              </View>
              <CircularProgress size={96} strokeWidth={10} progress={circleFill} color="#4ADE80" label={'8104\nSteps'} />
            </View>

            {/* Sleep */}
            <View style={[styles.card, styles.cardShadow]}>
              <View style={styles.cardHeader}>
                <Icon name="moon-waning-crescent" size={22} color="#FACC15" />
              </View>
              <Text style={styles.smallLabel}>6 Hours</Text>
              <View style={styles.barWrap}>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${Math.round(sleepProgress * 100)}%`, backgroundColor: '#FACC15' }]} />
                </View>
              </View>
            </View>

            {/* Water */}
            <View style={[styles.card, styles.cardShadow]}>
              <View style={styles.cardHeader}>
                <Icon name="cup-water" size={22} color="#38BDF8" />
              </View>
              <Text style={styles.smallLabel}>5 Glasses</Text>
              <View style={styles.waterBars}>
                <View style={[styles.waterBar, { height: 28, opacity: 1 }]} />
                <View style={[styles.waterBar, { height: 22, opacity: 0.9 }]} />
                <View style={[styles.waterBar, { height: 16, opacity: 0.75 }]} />
                <View style={[styles.waterBar, { height: 10, opacity: 0.55 }]} />
              </View>
              <TouchableOpacity style={styles.addBtn}>
                <Icon name="plus" size={16} color="#0f172a" />
              </TouchableOpacity>
            </View>

            {/* Heart with framed grid */}
            <View style={[styles.card, styles.transparentCard]}>
              <View style={styles.cardHeader}>
                <Icon name="heart" size={22} color="#F87171" />
              </View>
              <Text style={styles.smallLabel}>95 bpm</Text>

              <View style={styles.heartFrame}>
                {/* Grid background */}
                <HeartGrid w={width * 0.42} h={80} rows={4} cols={6} />

                {/* Framing border */}
                <View style={styles.heartBorder} />

                {/* Line chart sits above the grid */}
                <View style={{ position: 'absolute', left: 0, top: 0 }}>
                  <LineChart
                    data={{ labels: [], datasets: [{ data: heartData }] }}
                    width={width * 0.42}
                    height={80}
                    withDots={false}
                    withInnerLines={false}
                    withOuterLines={false}
                    withVerticalLabels={false}
                    withHorizontalLabels={false}
                    bezier
                    chartConfig={{
                      backgroundGradientFrom: 'transparent',
                      backgroundGradientTo: 'transparent',
                      backgroundGradientFromOpacity: 0,
                      backgroundGradientToOpacity: 0,
                      color: () => '#F87171',
                      strokeWidth: 2,
                      fillShadowGradient: 'transparent',
                      fillShadowGradientOpacity: 0,
                      propsForBackgroundLines: { stroke: 'transparent' },
                    }}
                    style={{ marginTop: 0, backgroundColor: 'transparent' }}
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.scoreWrap}>
            <Text style={styles.scoreLabel}>Total additional Score</Text>
            <View style={styles.scoreRow}>
              <View style={styles.starsRow}>
                <Icon name="star" size={18} color="#FFD166" style={styles.starIcon} />
                <Icon name="star" size={18} color="#FFD166" style={styles.starIcon} />
                <Icon name="star" size={18} color="#FFD166" style={styles.starIcon} />
                <Icon name="star" size={18} color="#FFD166" style={styles.starIcon} />
                <Icon name="star" size={18} color="#FFD166" style={styles.starIcon} />
              </View>
              <Text style={styles.scoreValue}>10</Text>
              <Text style={styles.scoreUnit}>Stars</Text>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#07070b' },
  background: { flex: 1, resizeMode: 'cover' },
  container: { padding: 20, alignItems: 'center', paddingBottom: 40 },
  title: { color: '#fff', fontSize: 22, fontWeight: '800', textAlign: 'center', marginTop: 8 },
  message: { color: '#cbd5e1', fontSize: 13, marginTop: 8, textAlign: 'center', lineHeight: 18, maxWidth: 520 },

  grid: { width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 18 },

  card: {
    width: '48%',
    backgroundColor: 'rgba(10,12,20,0.45)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgb(255, 255, 255)',
  },
  transparentCard: { backgroundColor: 'transparent', borderWidth: 0, shadowOpacity: 0 },
  cardHeader: { position: 'absolute', top: 10, right: 12 },
  cardShadow: { shadowColor: '#000', shadowOpacity: 0.28, shadowRadius: 8, elevation: 4 },

  circleLabel: { color: '#fff', fontSize: 13, textAlign: 'center', fontWeight: '600' },

  smallLabel: { color: '#e6eef8', fontSize: 13, marginTop: 18, marginBottom: 8, fontWeight: '600' },

  barWrap: { width: '92%', marginTop: 6 },
  progressTrack: { width: '100%', height: 8, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 6, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 6 },

  waterBars: { width: '92%', marginTop: 8, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  waterBar: { width: '22%', backgroundColor: '#38BDF8', borderRadius: 6 },

  addBtn: { marginTop: 10, backgroundColor: '#38BDF8', padding: 6, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },

  /* Heart frame & grid */
  heartFrame: {
    width: width * 0.42,
    height: 80,
    marginTop: 6,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  heartBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: width * 0.42,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
  },
  gridLineHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  gridLineVertical: {
    position: 'absolute',
    top: 0,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },

  scoreWrap: { marginTop: 18, alignItems: 'center' },
  scoreLabel: { color: '#9aa6b2', fontSize: 12, letterSpacing: 0.6, marginBottom: 6 },
  scoreRow: { flexDirection: 'row', alignItems: 'center' },
  starsRow: { flexDirection: 'row', marginRight: 10 },
  starIcon: { marginHorizontal: 1, textShadowColor: 'rgba(255,209,102,0.18)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 6 },
  scoreValue: { color: '#FFD166', fontSize: 20, fontWeight: '800', marginRight: 6, textShadowColor: 'rgba(255,209,102,0.25)', textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 8 },
  scoreUnit: { color: '#e6eef8', fontSize: 14, fontWeight: '600' },
});
