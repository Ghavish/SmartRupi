import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// -------------------------CONNECT THE ACTUAL AGENT FOR THE REPORT-------------------------
// Mock data generated from Raj's actual transaction history.
// Each report has a `type` that controls the icon/color, an `insight`, and a `recommendation`.
// Bold segments in `insight`/`recommendation` are marked with **double asterisks** and
// rendered as highlighted text by the renderHighlighted() helper below.
type ReportType = 'cost' | 'invest' | 'subscription';

interface AdvisorReport {
  type: ReportType;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  insight: string;
  recommendation: string;
}

const ADVISOR_REPORTS: AdvisorReport[] = [
  {
    type: 'cost',
    title: 'Cost Cutting Opportunity',
    icon: 'trending-down',
    insight: 'You spent Rs 1,640 on bubble tea and fast food (McDonalds, KFC) this month.',
    recommendation: 'Cutting late-night snack runs in half could save you **Rs 600/mo**.',
  },
  {
    type: 'invest',
    title: 'Wealth Generation',
    icon: 'trending-up',
    insight: 'You have a **Rs 5,000 surplus** this month from your salary transfer.',
    recommendation: 'Move Rs 3,000 to the Invest tab to capitalize on current fractional stock opportunities.',
  },
  {
    type: 'cost',
    title: 'Cost Cutting Opportunity',
    icon: 'trending-down',
    insight: 'You spent Rs 4,000 on Steam Games and Rs 750 on TikTok Coins this cycle.',
    recommendation: 'Setting a Rs 1,500/mo gaming cap would free up **Rs 1,250/mo** for savings.',
  },
  {
    type: 'subscription',
    title: 'Subscription Overlap',
    icon: 'alert-circle',
    insight: "You're paying for both **Netflix (Rs 599)** and **Canal+ (Rs 750)** — Rs 1,349/mo in entertainment subscriptions.",
    recommendation: 'Dropping one service could save you **Rs 599–750/mo**.',
  },
  {
    type: 'invest',
    title: 'Wealth Generation',
    icon: 'trending-up',
    insight: 'Your gym membership (Rs 800/mo) and grocery spending are stable and healthy habits.',
    recommendation: 'Your consistent Rs 5,000/mo transfers to savings show strong discipline — consider automating a **Rs 500/mo** top-up to your MCB Fixed Deposit for guaranteed 4.5% returns.',
  },
];

const TYPE_COLORS: Record<ReportType, string> = {
  cost: '#FF4545',
  invest: '#00E676',
  subscription: '#FFC107',
};

// Renders **bold** segments inside a string as highlighted inline Text nodes.
function renderHighlighted(text: string, color: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <Text key={i} style={{ color, fontWeight: 'bold' }}>{part}</Text>
    ) : (
      <Text key={i}>{part}</Text>
    )
  );
}

export default function FinancialAuditorCard() {
  const [viewState, setViewState] = useState<'idle' | 'analyzing' | 'report'>('idle');
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const [cardWidth, setCardWidth] = useState(0);

  const handleConsultAdvisor = () => {
    setViewState('analyzing');

    setTimeout(() => {
      setActiveIndex(0);
      setViewState('report');
    }, 1800);
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / cardWidth);
    if (index !== activeIndex) setActiveIndex(index);
  };

  return (
    <View style={styles.cardContainer}>

      {/* STATE 1: IDLE */}
      {viewState === 'idle' && (
        <TouchableOpacity
          style={styles.idleState}
          onPress={handleConsultAdvisor}
          activeOpacity={0.8}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="chatbubbles" size={24} color="#0A0E17" />
          </View>
          <View style={styles.idleTextContainer}>
            <Text style={styles.idleTitle}>Consult Financial Advisor</Text>
            <Text style={styles.idleSubtitle}>Tap to generate a real-time expense report</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#00F0FF" />
        </TouchableOpacity>
      )}

      {/* STATE 2: ANALYZING */}
      {viewState === 'analyzing' && (
        <View style={styles.analyzingState}>
          <ActivityIndicator size="large" color="#00F0FF" />
          <Text style={styles.analyzingText}>Agent analyzing 30-day expense patterns...</Text>
        </View>
      )}

      {/* STATE 3: THE REPORT(S) — swipe to view other analyses */}
      {viewState === 'report' && (
        <View
          style={styles.reportState}
          onLayout={(e) => setCardWidth(e.nativeEvent.layout.width)}
        >
          <View style={styles.reportHeader}>
            <Ionicons name="sparkles" size={20} color="#00F0FF" />
            <Text style={styles.reportTitle}>Advisor Report Generated</Text>
          </View>

          {cardWidth > 0 && (
            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleScroll}
              style={{ marginHorizontal: -16 }}
            >
              {ADVISOR_REPORTS.map((report, idx) => (
                <View key={idx} style={[styles.reportSlide, { width: cardWidth }]}>
                  <View style={styles.insightBox}>
                    <View style={styles.insightHeader}>
                      <Ionicons name={report.icon} size={16} color={TYPE_COLORS[report.type]} />
                      <Text style={[styles.insightTitle, { color: TYPE_COLORS[report.type] }]}>
                        {report.title}
                      </Text>
                    </View>
                    <Text style={styles.insightDetail}>
                      {renderHighlighted(report.insight, TYPE_COLORS[report.type])}
                    </Text>
                    <Text style={[styles.insightDetail, { marginTop: 8 }]}>
                      {renderHighlighted(report.recommendation, TYPE_COLORS[report.type])}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}

          {/* Page dots */}
          <View style={styles.dotsRow}>
            {ADVISOR_REPORTS.map((_, idx) => (
              <View
                key={idx}
                style={[styles.dot, idx === activeIndex && styles.dotActive]}
              />
            ))}
          </View>

          <TouchableOpacity onPress={() => setViewState('idle')} style={styles.resetButton}>
            <Text style={styles.resetText}>Dismiss Report</Text>
          </TouchableOpacity>
        </View>

      )}

    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#1A2235',
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2A3441',
    overflow: 'hidden',
  },
  // --- Idle State Styles ---
  idleState: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#161D2D',
  },
  iconCircle: {
    backgroundColor: '#00F0FF',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  idleTextContainer: {
    flex: 1,
  },
  idleTitle: {
    color: '#00F0FF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  idleSubtitle: {
    color: '#8892B0',
    fontSize: 13,
  },
  // --- Analyzing State Styles ---
  analyzingState: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyzingText: {
    color: '#00F0FF',
    marginTop: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  // --- Report State Styles ---
  reportState: {
    padding: 16,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportTitle: {
    color: '#00F0FF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  reportContent: {
    marginBottom: 16,
  },
  reportSlide: {
    paddingHorizontal: 16,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2A3441',
  },
  dotActive: {
    backgroundColor: '#00F0FF',
    width: 16,
  },
  highlightText: {
    color: '#00E676',
    fontWeight: 'bold',
  },
  // --- Insight Box Styles ---
  insightBox: {
    backgroundColor: '#0A0E17',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2A3441',
    marginBottom: 8,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  insightTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  insightDetail: {
    color: '#8892B0',
    fontSize: 13,
    lineHeight: 20,
  },
  resetButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  resetText: {
    color: '#8892B0',
    fontSize: 12,
  },
});
