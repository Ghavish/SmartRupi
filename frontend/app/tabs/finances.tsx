import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, ActivityIndicator, StyleSheet, Alert, TextInput, TouchableOpacity,
} from 'react-native';
import { getTransactions } from '../../src/api';
// 1. Import the new AI Card
import FinancialAuditorCard from '../../src/components/FinancialAuditorCard';

const DEMO_USER_ID = 1;

const marketplaceDeals = [
  {
    DealID: 1,
    Item: "AirPods Pro 2nd Gen",
    StoreName: "Courts Mammouth Online",
    Price: 14200,
    OriginalPrice: 18500,
    DiscountPercent: 23,
    IsBestDeal: 1,
  },
  {
    DealID: 2,
    Item: "AirPods Pro 2nd Gen",
    StoreName: "Galaxy Mauritius",
    Price: 16500,
    OriginalPrice: 18500,
    DiscountPercent: 11,
    IsBestDeal: 0,
  },
  {
    DealID: 3,
    Item: "AirPods Pro 2nd Gen",
    StoreName: "361 Degree",
    Price: 17800,
    OriginalPrice: 18500,
    DiscountPercent: 4,
    IsBestDeal: 0,
  },
  {
    DealID: 4,
    Item: "Samsung Galaxy Watch 6",
    StoreName: "Galaxy Mauritius",
    Price: 9500,
    OriginalPrice: 12000,
    DiscountPercent: 21,
    IsBestDeal: 1,
  },
  {
    DealID: 5,
    Item: "Samsung Galaxy Watch 6",
    StoreName: "Jumbo Score",
    Price: 10800,
    OriginalPrice: 12000,
    DiscountPercent: 10,
    IsBestDeal: 0,
  },
  {
    DealID: 6,
    Item: "Samsung Galaxy Watch 6",
    StoreName: "Amazon.mu",
    Price: 11200,
    OriginalPrice: 12000,
    DiscountPercent: 7,
    IsBestDeal: 0,
  },
  {
    DealID: 7,
    Item: "PS5 Controller (DualSense)",
    StoreName: "361 Degree",
    Price: 3999,
    OriginalPrice: 5500,
    DiscountPercent: 27,
    IsBestDeal: 1,
  },
  {
    DealID: 8,
    Item: "PS5 Controller (DualSense)",
    StoreName: "Courts Mammouth",
    Price: 4800,
    OriginalPrice: 5500,
    DiscountPercent: 13,
    IsBestDeal: 0,
  },
  {
    DealID: 9,
    Item: "PS5 Controller (DualSense)",
    StoreName: "Galaxy Mauritius",
    Price: 5200,
    OriginalPrice: 5500,
    DiscountPercent: 5,
    IsBestDeal: 0,
  },
  {
    DealID: 10,
    Item: "Logitech MX Master 3 Mouse",
    StoreName: "Jumbo Score",
    Price: 4800,
    OriginalPrice: 6200,
    DiscountPercent: 23,
    IsBestDeal: 1,
  },
  {
    DealID: 11,
    Item: "Logitech MX Master 3 Mouse",
    StoreName: "Amazon.mu",
    Price: 5400,
    OriginalPrice: 6200,
    DiscountPercent: 13,
    IsBestDeal: 0,
  },
  {
    DealID: 12,
    Item: "Logitech MX Master 3 Mouse",
    StoreName: "Courts Mammouth",
    Price: 5900,
    OriginalPrice: 6200,
    DiscountPercent: 5,
    IsBestDeal: 0,
  },
  {
    DealID: 13,
    Item: "JBL Flip 6 Bluetooth Speaker",
    StoreName: "Amazon.mu",
    Price: 5350,
    OriginalPrice: 7000,
    DiscountPercent: 24,
    IsBestDeal: 1,
  },
  {
    DealID: 14,
    Item: "JBL Flip 6 Bluetooth Speaker",
    StoreName: "361 Degree",
    Price: 6100,
    OriginalPrice: 7000,
    DiscountPercent: 13,
    IsBestDeal: 0,
  },
  {
    DealID: 15,
    Item: "JBL Flip 6 Bluetooth Speaker",
    StoreName: "Galaxy Mauritius",
    Price: 6500,
    OriginalPrice: 7000,
    DiscountPercent: 7,
    IsBestDeal: 0,
  },
  {
    DealID: 16,
    Item: "Laptop - Dell Inspiron 15",
    StoreName: "Courts Mammouth",
    Price: 22500,
    OriginalPrice: 28000,
    DiscountPercent: 20,
    IsBestDeal: 1,
  },
  {
    DealID: 17,
    Item: "Laptop - Dell Inspiron 15",
    StoreName: "Galaxy Mauritius",
    Price: 25200,
    OriginalPrice: 28000,
    DiscountPercent: 10,
    IsBestDeal: 0,
  },
  {
    DealID: 18,
    Item: "Laptop - Dell Inspiron 15",
    StoreName: "Jumbo Score",
    Price: 26800,
    OriginalPrice: 28000,
    DiscountPercent: 4,
    IsBestDeal: 0,
  },
  {
    DealID: 19,
    Item: "PlayStation 5",
    StoreName: "361 Degree",
    Price: 16500,
    OriginalPrice: 19500,
    DiscountPercent: 15,
    IsBestDeal: 1,
  },
  {
    DealID: 20,
    Item: "PlayStation 5",
    StoreName: "Courts Mammouth",
    Price: 17800,
    OriginalPrice: 19500,
    DiscountPercent: 9,
    IsBestDeal: 0,
  },
  {
    DealID: 21,
    Item: "PlayStation 5",
    StoreName: "Galaxy Mauritius",
    Price: 18900,
    OriginalPrice: 19500,
    DiscountPercent: 3,
    IsBestDeal: 0,
  },
];

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

  const [showMarketplace, setShowMarketplace] = useState(false);
  const [search, setSearch] = useState('');
  const [marketResults, setMarketResults] = useState<any[]>([]);

  const handleMarketplaceSearch = () => {
  const results = marketplaceDeals.filter((deal) =>
    deal.Item.toLowerCase().includes(search.toLowerCase())
  );

  if (results.length === 0) {
    Alert.alert("No Results", "No matching products found.");
    setMarketResults([]);
    return;
  }

  setMarketResults(results);
};

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
      
      <Text style={styles.header}>Balances</Text>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.TransactionID.toString()}
        showsVerticalScrollIndicator={false} // Hides the ugly scrollbar for a cleaner UI

        // 2. Inject the AI Card here! It will scroll naturally with the transactions.
        //ListHeaderComponent={<FinancialAuditorCard />}
        ListHeaderComponent={
          <>
            <FinancialAuditorCard />

            <TouchableOpacity
          style={styles.marketButton}
          onPress={() => {
            if (showMarketplace) {
              // Closing marketplace
              setShowMarketplace(false);
              setSearch('');
              setMarketResults([]);
            } else {
              // Opening marketplace
              setShowMarketplace(true);
            }
          }}
        >
          <Text style={styles.marketButtonText}>
            Search Marketplace
          </Text>
        </TouchableOpacity>

        {showMarketplace && (
          <>
            <TextInput
              style={styles.search}
              placeholder="Search product (AirPods, PS5, Dell...)"
              placeholderTextColor="#888"
              value={search}
              onChangeText={setSearch}
            />

            <TouchableOpacity
              style={styles.marketButton}
              onPress={handleMarketplaceSearch}
                >
                  <Text style={styles.marketButtonText}>
                    Compare Deals
                  </Text>
                </TouchableOpacity>

                {marketResults.map((item) => (
                  <View
                    key={item.DealID}
                    style={styles.marketCard}
                  >
                    <Text style={styles.marketTitle}>
                      {item.Item}
                    </Text>

                    <Text style={styles.marketStore}>
                      {item.StoreName}
                    </Text>

                    <Text style={styles.marketPrice}>
                      Rs {item.Price.toLocaleString()}
                    </Text>

                    <Text style={styles.marketDiscount}>
                      {item.DiscountPercent}% OFF
                    </Text>

                    {item.IsBestDeal === 1 && (
                      <View style={styles.aiBox}>
                        <Text style={styles.aiTitle}>
                           AI Recommendation
                        </Text>

                        <Text style={styles.aiText}>
                          Best marketplace deal. Lowest available price with the highest discount.
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </>
            )}
          </>
        }
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
  marketButton: {
  backgroundColor: '#00E5FF',
  padding: 15,
  borderRadius: 12,
  alignItems: 'center',
  marginBottom: 15,
},

marketButtonText: {
  color: '#0A0A1A',
  fontWeight: '700',
  fontSize: 16,
},

search: {
  backgroundColor: '#12122A',
  color: '#FFFFFF',
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#1E1E4A',
  padding: 14,
  marginBottom: 15,
},

marketCard: {
  backgroundColor: '#12122A',
  borderRadius: 12,
  padding: 16,
  marginBottom: 15,
  borderWidth: 1,
  borderColor: '#1E1E4A',
},

marketTitle: {
  color: '#FFFFFF',
  fontSize: 16,
  fontWeight: '700',
},

marketStore: {
  color: '#8E8EA0',
  marginTop: 5,
},

marketPrice: {
  color: '#30D158',
  fontWeight: '700',
  fontSize: 18,
  marginTop: 10,
},

marketDiscount: {
  color: '#FFD60A',
  marginTop: 5,
},

aiBox: {
  marginTop: 12,
  backgroundColor: '#123524',
  padding: 12,
  borderRadius: 10,
},

aiTitle: {
  color: '#30D158',
  fontWeight: '700',
  marginBottom: 5,
},

aiText: {
  color: '#FFFFFF',
},
});