import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, ActivityIndicator, StyleSheet, Alert
} from 'react-native';
import { getTransactions } from '../../src/api';
// 1. Import the new AI Card
import FinancialAuditorCard from '../../src/components/FinancialAuditorCard';

const DEMO_USER_ID = 1;

type Transaction = {
  TransactionID: number;
  Date: string;
  Amount: number;
  Type: string;
  Category: string;
  Merchant: string;
};

export default function FinancesScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTransactions(DEMO_USER_ID)
      .then(setTransactions)
      .catch(() => Alert.alert('Error', 'Could not load transactions'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00F0FF" />
        <Text style={styles.loadingText}>Loading finances...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Fixed Page Header */}
      <Text style={styles.header}></Text>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.TransactionID.toString()}
        showsVerticalScrollIndicator={false} // Hides the ugly scrollbar for a cleaner UI

        // 2. Inject the AI Card here! It will scroll naturally with the transactions.
        ListHeaderComponent={<FinancialAuditorCard />}

        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.merchant}>{item.Merchant}</Text>
              <Text style={[styles.amount, item.Type.toLowerCase() === 'credit' ? styles.credit : styles.debit]}>
                {item.Type.toLowerCase() === 'credit' ? '+' : '-'} Rs {item.Amount}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.category}>{item.Category}</Text>
              <Text style={styles.date}>{new Date(item.Date).toLocaleDateString()}</Text>
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
  card: { backgroundColor: '#12122A', borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#1E1E4A' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  merchant: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  amount: { fontSize: 15, fontWeight: '700' },
  credit: { color: '#30D158' },
  debit: { color: '#FF3B30' },
  category: { color: '#8E8EA0', fontSize: 12 },
  date: { color: '#8E8EA0', fontSize: 12 },
});