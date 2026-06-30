// app/tabs/loans.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  ActivityIndicator, StyleSheet, Alert
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router'
import { getLoanOffers } from '../../src/api';

const DEMO_USER_ID = 1;

type LoanOffer = {
  OfferID: number;
  BankName: string;
  InterestRate: number;
  MaxAmount: number;
  RequiredMinimumIncome: number;
  LoanType: string;
};

export default function LoansScreen() {
  const [offers, setOffers] = useState<LoanOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLoanOffers(DEMO_USER_ID)
      .then(setOffers)
      .catch(() => Alert.alert('Error', 'Could not load loan offers'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00E5FF" />
        <Text style={styles.loadingText}>Loading loan offers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Loan Offers</Text>

      <TouchableOpacity
        style={styles.eligibilityButton}
        activeOpacity={0.8}
        onPress={() => router.push('/eligibility')}
      >
        <Ionicons name="sparkles" size={20} color="#0A0E17" />
        <Text style={styles.eligibilityButtonText}>View My Eligibility</Text>
        <Ionicons name="arrow-forward" size={18} color="#0A0E17" style={{ marginLeft: 'auto' }} />
      </TouchableOpacity>

      <FlatList
        data={offers}
        keyExtractor={(item) => item.OfferID.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.bankName}>{item.BankName}</Text>
            <Text style={styles.loanType}>{item.LoanType} Loan</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Interest Rate</Text>
              <Text style={styles.value}>{item.InterestRate}%</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Max Amount</Text>
              <Text style={styles.value}>Rs {item.MaxAmount.toLocaleString()}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Min. Income Required</Text>
              <Text style={styles.value}>Rs {item.RequiredMinimumIncome.toLocaleString()}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A1A', padding: 16 },
  centered: { flex: 1, backgroundColor: '#0A0A1A', justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 24, color: '#FFFFFF', fontWeight: '700', marginBottom: 16 },
  loadingText: { color: '#00E5FF', marginTop: 10 },
  card: { backgroundColor: '#12122A', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#1E1E4A' },
  bankName: { color: '#00E5FF', fontSize: 17, fontWeight: '700', marginBottom: 4 },
  loanType: { color: '#00E5FF', fontSize: 12, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  label: { color: '#8E8EA0', fontSize: 13 },
  value: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  eligibilityButton: { backgroundColor: '#00F0FF', flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 20, gap: 8 },
  eligibilityButtonText: { color: '#0A0E17', fontSize: 16, fontWeight: 'bold' },
});