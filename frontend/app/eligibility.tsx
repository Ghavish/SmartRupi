import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { dispatchToAgent } from '../src/api'; 

export default function EligibilityScreen() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loanReport, setLoanReport] = useState<any>(null);

  const handleRunAssessment = async () => {
    setIsAnalyzing(true);
    
    try {
      // Dispatch the assessment task to the loan_officer agent
      const result = await dispatchToAgent('loan_officer', JSON.stringify({
        monthlyIncome: 35000,
        currentSurplus: 3500,
        requestType: 'ELIGIBILITY_ASSESSMENT'
      }));

      if (!result) throw new Error("No data received from Loan Officer");

      setLoanReport(result);
      Alert.alert("Assessment Complete", "Your Loan Officer Agent has evaluated your profile.");
    } catch (error) {
      console.error("DEBUG ERROR:", error);
      Alert.alert('Assessment Failed', 'Could not reach the Loan Officer Agent.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#00F0FF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Loan Eligibility</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.agentCard}>
          <View style={styles.iconCircle}>
            <Ionicons name="briefcase" size={32} color="#0A0E17" />
          </View>
          <Text style={styles.agentTitle}>Loan Officer Agent</Text>
          <Text style={styles.agentDescription}>
            Cross-referencing your financial history with live market offers.
          </Text>
          
          <TouchableOpacity 
            style={[styles.actionButton, isAnalyzing && { opacity: 0.6 }]} 
            onPress={handleRunAssessment}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <ActivityIndicator color="#0A0E17" />
            ) : (
              <>
                <Text style={styles.actionButtonText}>Run Full Assessment</Text>
                <Ionicons name="analytics" size={18} color="#0A0E17" />
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Dynamic Report Section */}
        {loanReport && (
          <View style={styles.reportBox}>
            <Text style={styles.sectionTitle}>Agent Report</Text>
            <Text style={styles.value}>{loanReport.summary || "Assessment finalized."}</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Your Profile Summary</Text>
        <View style={styles.infoBox}>
          <View style={styles.row}>
            <Text style={styles.label}>Est. Monthly Income</Text>
            <Text style={styles.value}>Rs 35 000</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>Current Surplus</Text>
            <Text style={styles.valuePositive}>Rs 3 500 /mo</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E17' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 20, backgroundColor: '#1A2235', borderBottomWidth: 1, borderBottomColor: '#2A3441' },
  backButton: { padding: 4 },
  headerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  scrollContent: { padding: 16 },
  agentCard: { backgroundColor: '#161D2D', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#00F0FF' },
  iconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#00F0FF', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  agentTitle: { color: '#00F0FF', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  agentDescription: { color: '#8892B0', fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  actionButton: { backgroundColor: '#00F0FF', flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 8, gap: 8, width: '100%', justifyContent: 'center' },
  actionButtonText: { color: '#0A0E17', fontSize: 16, fontWeight: 'bold' },
  sectionTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  infoBox: { backgroundColor: '#1A2235', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#2A3441' },
  reportBox: { backgroundColor: '#1A2235', borderRadius: 12, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#00F0FF' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  divider: { height: 1, backgroundColor: '#2A3441', marginVertical: 8 },
  label: { color: '#8892B0', fontSize: 14 },
  value: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  valuePositive: { color: '#00E676', fontSize: 14, fontWeight: 'bold' },
});