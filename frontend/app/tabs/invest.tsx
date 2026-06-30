// app/tabs/invest.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, ActivityIndicator,
  StyleSheet, ScrollView
} from 'react-native';

const AV_KEY = process.env.EXPO_PUBLIC_ALPHA_VANTAGE_KEY;

// EDIT ACCORDINGLY
const DEMO_MONTHLY_INCOME = 40000; // Rs — matches Golden Path user
const INVEST_BUDGET = DEMO_MONTHLY_INCOME * 0.2; // recommend investing 20% of income

const STOCKS = [
  { symbol: 'AAPL', name: 'Apple' },
  { symbol: 'MSFT', name: 'Microsoft' },
  { symbol: 'GOOGL', name: 'Google' },
];

type StockData = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  recommendation: 'BUY' | 'HOLD' | 'SELL';
  reason: string;
};

function getRecommendation(change: number, price: number, budget: number): { recommendation: 'BUY' | 'HOLD' | 'SELL'; reason: string } {
  const canAfford = budget / price >= 0.01; // can afford at least a fractional share worth

  if (change > 1.5 && canAfford) {
    return { recommendation: 'BUY', reason: `Up ${change.toFixed(2)}% today — strong momentum and within your Rs ${budget} budget.` };
  } else if (change < -1.5) {
    return { recommendation: 'SELL', reason: `Down ${Math.abs(change).toFixed(2)}% today — consider reducing exposure.` };
  } else {
    return { recommendation: 'HOLD', reason: `Movement of ${change.toFixed(2)}% — no strong signal today.` };
  }
}

export default function InvestScreen() {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  // ── EVENT HANDLER: fires when user taps "Analyse My Portfolio" ────────────
  const handleAnalyse = async () => {
    setLoading(true);
    setStocks([]);

    try {
      const results: StockData[] = [];

      for (const stock of STOCKS) {
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock.symbol}&apikey=${AV_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        const quote = data['Global Quote'];

        if (!quote || !quote['05. price']) {
          throw new Error(`No data for ${stock.symbol}`);
        }

        const price = parseFloat(quote['05. price']);
        const change = parseFloat(quote['09. change']);
        const changePercent = parseFloat(quote['10. change percent'].replace('%', ''));
        const { recommendation, reason } = getRecommendation(changePercent, price, INVEST_BUDGET);

        results.push({ symbol: stock.symbol, name: stock.name, price, change, changePercent, recommendation, reason });

        // Wait 1.2s between requests — Alpha Vantage free tier rate limit
        await new Promise(res => setTimeout(res, 1200));
      }

      setStocks(results);
      setFetched(true);
    } catch (err) {
      alert('Could not fetch stock data. Check your API key or network.');
    } finally {
      setLoading(false);
    }
  };
  // ─────────────────────────────────────────────────────────────────────────  // ─────────────────────────────────────────────────────────────────────────  // ─────────────────────────────────────────────────────────────────────────

  const recColor = (rec: string) => {
    if (rec === 'BUY') return '#30D158';
    if (rec === 'SELL') return '#FF3B30';
    return '#FFD60A';
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.subheader}>Monthly budget: Rs {INVEST_BUDGET.toLocaleString()}</Text>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleAnalyse}
        disabled={loading}
      >
        {loading ? (
          <View style={styles.buttonInner}>
            <ActivityIndicator size="small" color="#0A0A1A" />
            <Text style={styles.buttonText}>  Fetching live prices...</Text>
          </View>
        ) : (
          <Text style={styles.buttonText}>
            {fetched ? 'Refresh Analysis' : 'Analyse My Portfolio'}
          </Text>
        )}
      </TouchableOpacity>

      {stocks.map((stock) => (
        <View key={stock.symbol} style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.stockName}>{stock.name}</Text>
              <Text style={styles.stockSymbol}>{stock.symbol}</Text>
            </View>
            <View style={[styles.recBadge, { backgroundColor: recColor(stock.recommendation) + '22', borderColor: recColor(stock.recommendation) }]}>
              <Text style={[styles.recText, { color: recColor(stock.recommendation) }]}>{stock.recommendation}</Text>
            </View>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>${stock.price.toFixed(2)}</Text>
            <Text style={[styles.change, { color: stock.change >= 0 ? '#30D158' : '#FF3B30' }]}>
              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
            </Text>
          </View>

          <Text style={styles.reason}>{stock.reason}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A1A', padding: 16 },
  header: { fontSize: 24, color: '#FFFFFF', fontWeight: '700', marginBottom: 4 },
  subheader: { fontSize: 13, color: '#8E8EA0', marginBottom: 24 },
  button: { backgroundColor: '#00E5FF', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 24 },
  buttonDisabled: { opacity: 0.6 },
  buttonInner: { flexDirection: 'row', alignItems: 'center' },
  buttonText: { color: '#0A0A1A', fontSize: 16, fontWeight: '700' },
  card: { backgroundColor: '#12122A', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#1E1E4A' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  stockName: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  stockSymbol: { color: '#8E8EA0', fontSize: 12, marginTop: 2 },
  recBadge: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  recText: { fontSize: 13, fontWeight: '700' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  price: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  change: { fontSize: 14, fontWeight: '600', alignSelf: 'flex-end' },
  reason: { color: '#8E8EA0', fontSize: 13, lineHeight: 20 },
});