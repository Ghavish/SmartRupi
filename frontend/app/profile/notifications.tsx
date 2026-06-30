import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function NotificationsScreen() {
    const [pushEnabled, setPushEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(false);

    const handleSavePreferences = async () => {
        try {
            // TODO: Replace with backend API integration to store user preference flags
            Alert.alert('Saved', 'Notification preferences updated.');
            router.back();
        } catch (error) {
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

            <View style={styles.content}>
                <View style={styles.switchRow}>
                    <View>
                        <Text style={styles.settingTitle}>Push Notifications</Text>
                        <Text style={styles.settingDesc}>Receive instant updates on your app activity</Text>
                    </View>
                    <Switch
                        value={pushEnabled}
                        onValueChange={setPushEnabled}
                        trackColor={{ false: '#1A2235', true: '#00F0FF' }}
                        thumbColor={pushEnabled ? '#FFFFFF' : '#8892B0'}
                    />
                </View>

                <View style={styles.switchRow}>
                    <View>
                        <Text style={styles.settingTitle}>Email Alerts</Text>
                        <Text style={styles.settingDesc}>Get summaries and newsletters in your inbox</Text>
                    </View>
                    <Switch
                        value={emailEnabled}
                        onValueChange={setEmailEnabled}
                        trackColor={{ false: '#1A2235', true: '#00F0FF' }}
                        thumbColor={emailEnabled ? '#FFFFFF' : '#8892B0'}
                    />
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSavePreferences}>
                    <Text style={styles.saveButtonText}>SAVE PREFERENCES</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A0E17' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, backgroundColor: '#1A2235' },
    headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
    content: { padding: 20 },
    switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1A2235', padding: 16, borderRadius: 12, marginBottom: 16 },
    settingTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
    settingDesc: { color: '#8892B0', fontSize: 12, marginTop: 4, maxWidth: '80%' },
    saveButton: { backgroundColor: '#00F0FF', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 20 },
    saveButtonText: { color: '#0A0E17', fontSize: 16, fontWeight: 'bold' }
});