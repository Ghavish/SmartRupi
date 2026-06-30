import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FinancialAuditorCard() {
  const [viewState, setViewState] = useState<'idle' | 'analyzing' | 'report'>('idle');

  const handleConsultAdvisor = () => {
    setViewState('analyzing');
    
    setTimeout(() => {
      setViewState('report');
    }, 1800); 
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

      {/* STATE 3: THE REPORT */}
      {viewState === 'report' && (
        <View style={styles.reportState}>
          <View style={styles.reportHeader}>
            <Ionicons name="sparkles" size={20} color="#00F0FF" />
            <Text style={styles.reportTitle}>Advisor Report Generated</Text>
          </View>
          
          {/* -------------------------CONNECT THE ACTUAL AGENT FOR THE REPORT------------------------- */}
          <View style={styles.reportContent}>
            <Text style={styles.reportParagraph}>
              Analysis complete. You currently have a <Text style={styles.highlightText}>Rs 3,500 surplus</Text> this week, but I found an inefficiency in your transport spending.
            </Text>

            {/* Insight 1: Cost Cutting */}
            <View style={styles.insightBox}>
              <View style={styles.insightHeader}>
                <Ionicons name="trending-down" size={16} color="#FF4545" />
                <Text style={styles.insightTitleCost}>Cost Cutting Opportunity</Text>
              </View>
              <Text style={styles.insightDetail}>
                You spent Rs 800 on individual Metro Express tickets. Switching to a monthly student pass will save you <Text style={{color: '#FF4545', fontWeight: 'bold'}}>Rs 300/mo</Text>.
              </Text>
            </View>

            {/* Insight 2: Investing */}
            <View style={styles.insightBox}>
              <View style={styles.insightHeader}>
                <Ionicons name="trending-up" size={16} color="#00E676" />
                <Text style={styles.insightTitleInvest}>Wealth Generation</Text>
              </View>
              <Text style={styles.insightDetail}>
                Move Rs 2,000 of your surplus to the Invest tab to capitalize on current fractional stock opportunities.
              </Text>
            </View>
          </View>

          {/* INVESTMENTS VIEWED AS A GOOD OPTION DUE TO CONSIDERABLE RETURNS OVER LONG TERM*/}
          {/* Action Button */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.primaryButton} activeOpacity={0.7}>
              <Text style={styles.primaryButtonText}>Start Investing</Text>
              <Ionicons name="arrow-forward" size={16} color="#0A0E17" />
            </TouchableOpacity>
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
  reportParagraph: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },
  highlightText: {
    color: '#00E676',
    fontWeight: 'bold',
  },
  // --- New Insight Box Styles ---
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
  insightTitleCost: {
    color: '#FF4545',
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  insightTitleInvest: {
    color: '#00E676',
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
  // --- Button Layout Styles ---
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8, // Space between buttons
  },
  primaryButton: {
    backgroundColor: '#00F0FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1, // Takes up equal half of the row
    gap: 6,
  },
  primaryButtonText: {
    color: '#0A0E17',
    fontSize: 13,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#00F0FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1, // Takes up equal half of the row
    gap: 6,
  },
  secondaryButtonText: {
    color: '#00F0FF',
    fontSize: 13,
    fontWeight: 'bold',
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