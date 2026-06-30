import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

type NotificationSetting = {
    id: string;
    title: string;
    description: string;
    icon: string;
    enabled: boolean;
};

export default function NotificationsScreen() {
    const [settings, setSettings] = useState<NotificationSetting[]>([
        { id: 'scam_alerts', title: 'Scam Alerts', description: 'Get notified instantly when a phishing email is detected', icon: 'shield-checkmark', enabled: true },
        { id: 'transaction', title: 'Transaction Alerts', description: 'Receive alerts for every debit and credit on your account', icon: 'card', enabled: true },
        { id: 'loan_updates', title: 'Loan Updates', description: 'Stay informed on new loan offers matching your income profile', icon: 'cash', enabled: true },
        { id: 'investment', title: 'Investment Signals', description: 'Get BUY/SELL/HOLD signals when market conditions change', icon: 'trending-up', enabled: false },
        { id: 'budget', title: 'Budget Warnings', description: 'Alert when your spending exceeds 80% of your monthly income', icon: 'warning', enabled: true },
        { id: 'email_summaries', title: 'Weekly Email Summary', description: 'Receive a weekly digest of your financial activity', icon: 'mail', enabled: false },
    ]);

    const toggle = (id: string) => {
        setSettings(prev =>
            prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s)
        );
    };

    const handleSave = async () => {
        try {
            // TODO: POST preferences to backend when route is ready
            // await fetch(`${BASE_URL}/users/1/notifications`, {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(settings)
            // });
            Alert.alert('Saved', 'Notification preferences updated.');
            router.back();
        } catch {
            Alert.alert('Error', 'Failed to save changes.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={28} color="#00F0FF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
                <Text style={styles.sectionLabel}>Alert Preferences</Text>

                {settings.map((item) => (
                    <View key={item.id} style={styles.row}>
                        <View style={styles.iconContainer}>
                            <Ionicons name={item.icon as any} size={22} color="#00F0FF" />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.desc}>{item.description}</Text>
                        </View>
                        <Switch
                            value={item.enabled}
                            onValueChange={() => toggle(item.id)}
                            trackColor={{ false: '#1A2235', true: '#00F0FF' }}
                            thumbColor={item.enabled ? '#FFFFFF' : '#8892B0'}
                        />
                    </View>
                ))}

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>SAVE PREFERENCES</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A0E17' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, backgroundColor: '#1A2235' },
    headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
    sectionLabel: { color: '#8892B0', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginBottom: 16 },
    row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A2235', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#2A3441' },
    iconContainer: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#00F0FF22', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    textContainer: { flex: 1, marginRight: 10 },
    title: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
    desc: { color: '#8892B0', fontSize: 12, marginTop: 3 },
    saveButton: { backgroundColor: '#00F0FF', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 20 },
    saveButtonText: { color: '#0A0E17', fontSize: 16, fontWeight: 'bold' },
});