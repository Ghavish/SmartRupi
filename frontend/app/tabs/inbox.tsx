import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  ActivityIndicator, StyleSheet, Alert
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { getEmails, dispatchToAgent } from '../../src/api';

const DEMO_USER_ID = 1;

type Email = {
  EmailID: number;
  SenderAddress: string;
  Subject: string;
  BodyText: string;
  IsVerified: boolean;
};

export default function InboxScreen() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [results, setResults] = useState<Record<number, any>>({});

  useEffect(() => {
    getEmails(DEMO_USER_ID)
      .then(setEmails)
      .catch(() => Alert.alert('Error', 'Could not load inbox'));
  }, []);

  // EVENT HANDLER 
  const handleEmailTap = async (email: Email) => {

    console.log(`\n--- NEW TAP DETECTED: ${email.EmailID} ---`);

    if (loadingId !== null) return;

    setLoadingId(email.EmailID);
    try {
      console.log("🚀 Firing dispatchToAgent...");
      const result = await dispatchToAgent('scam_analyst', email.BodyText);
      console.log('✅ UI Received:', result);

      // Update your state to handle the simple string result
      setResults(prev => ({
        ...prev,
        [email.EmailID]: {
          isScam: result.includes("Scam"), // Determine boolean from the string
          confidence: 0, // Not available in the filtered string
          reason: result // The string itself acts as the reason
        }
      }));

      if (result.includes("Scam")) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      } catch (error) {
      console.error("❌ UI Catch Block Hit:", error);
      Alert.alert('Analysis Failed', 'Could not reach Scam Analyst.');
    } finally {
      console.log("🔓 Releasing lock for next scan.");
      setLoadingId(null);
    }
  };

  const renderEmail = ({ item }: { item: Email }) => {
    const result = results[item.EmailID];
    const isLoading = loadingId === item.EmailID;

    return (
      <TouchableOpacity
        style={styles.emailCard}
        onPress={() => handleEmailTap(item)}
        disabled={isLoading}
      >
        <Text style={styles.sender}>{item.SenderAddress}</Text>
        <Text style={styles.subject}>{item.Subject}</Text>

        {isLoading && (
          <View style={styles.scanningRow}>
            <ActivityIndicator size="small" color="#00E5FF" />
            <Text style={styles.scanningText}>Scam Analyst Scanning...</Text>
          </View>
        )}

        {/* {result && !isLoading && (
          <View style={[styles.resultBanner, result.isScam ? styles.scam : styles.safe]}>
            <Text style={styles.resultText}>
              {result.isScam
                ? `⚠ SCAM DETECTED — ${result.confidence}% confidence`
                : `✓ Safe — ${result.reason}`}
            </Text>
          </View>
        )} */}
        {result && !isLoading && (
          <View style={[styles.resultBanner, result.isScam ? styles.scam : styles.safe]}>
            <Text style={styles.resultText}>
              {result.isScam
                ? `⚠ SCAM DETECTED`
                : `✓ Safe — ${result.reason}`}
            </Text>
          </View>
        )}
        
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={emails}
        keyExtractor={(item) => item.EmailID.toString()}
        renderItem={renderEmail}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A1A', padding: 16 },
  header: { fontSize: 24, color: '#FFFFFF', fontWeight: '700', marginBottom: 16 },
  emailCard: { backgroundColor: '#12122A', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#1E1E4A' },
  sender: { color: '#00E5FF', fontSize: 12, marginBottom: 4 },
  subject: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  scanningRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 8 },
  scanningText: { color: '#00E5FF', fontSize: 13 },
  resultBanner: { marginTop: 10, padding: 10, borderRadius: 8 },
  scam: { backgroundColor: '#3A0A0A', borderWidth: 1, borderColor: '#FF3B30' },
  safe: { backgroundColor: '#0A2A1A', borderWidth: 1, borderColor: '#30D158' },
  resultText: { color: '#FFFFFF', fontSize: 13 },
});