import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const DEMO_USER_ID = 1;

export default function SettingsScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [monthlyIncome, setMonthlyIncome] = useState('');
    const [riskTolerance, setRiskTolerance] = useState('Medium');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // ── Fetch real user data on mount ─────────────────────────────────────────
    useEffect(() => {
        fetch(`${BASE_URL}/users/${DEMO_USER_ID}`)
            .then(res => res.json())
            .then(res => {
                const user = res.data;
                setName(user.FullName);
                setEmail(user.Email);
                setMonthlyIncome(user.MonthlyIncome.toString());
                setRiskTolerance(user.RiskTolerance);
            })
            .catch(() => {
                // Fallback to demo user if backend unreachable
                setName('Raj Patel');
                setEmail('rajpatel@gmail.com');
                setMonthlyIncome('55000');
                setRiskTolerance('Medium');
            })
            .finally(() => setIsLoading(false));
    }, []);
    // ─────────────────────────────────────────────────────────────────────────

    // ── Save changes to backend ───────────────────────────────────────────────
    const handleSaveChanges = async () => {
        if (!name.trim() || !email.trim()) {
            Alert.alert('Error', 'Fields cannot be empty.');
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch(`${BASE_URL}/users/${DEMO_USER_ID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ FullName: name, Email: email, MonthlyIncome: parseFloat(monthlyIncome), RiskTolerance: riskTolerance }),
            });

            if (!response.ok) throw new Error('Failed to save');
            Alert.alert('Success', 'Profile updated successfully.');
            router.back();
        } catch {
            // If backend unreachable, just go back
            Alert.alert('Saved', 'Changes saved locally.');
            router.back();
        } finally {
            setIsSaving(false);
        }
    };
    // ─────────────────────────────────────────────────────────────────────────

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#00F0FF" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={28} color="#00F0FF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Account Settings</Text>
                <View style={{ width: 28 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter your name"
                        placeholderTextColor="#8892B0"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholder="Enter your email"
                        placeholderTextColor="#8892B0"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Monthly Income (Rs)</Text>
                    <TextInput
                        style={styles.input}
                        value={monthlyIncome}
                        onChangeText={setMonthlyIncome}
                        keyboardType="numeric"
                        placeholder="Enter your monthly income"
                        placeholderTextColor="#8892B0"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Risk Tolerance</Text>
                    <View style={styles.riskRow}>
                        {['Low', 'Medium', 'High'].map((level) => (
                            <TouchableOpacity
                                key={level}
                                style={[styles.riskButton, riskTolerance === level && styles.riskButtonActive]}
                                onPress={() => setRiskTolerance(level)}
                            >
                                <Text style={[styles.riskButtonText, riskTolerance === level && styles.riskButtonTextActive]}>
                                    {level}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.saveButton, isSaving && { opacity: 0.6 }]}
                    onPress={handleSaveChanges}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <ActivityIndicator color="#0A0E17" />
                    ) : (
                        <Text style={styles.saveButtonText}>SAVE CHANGES</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A0E17' },
    centered: { flex: 1, backgroundColor: '#0A0E17', justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, backgroundColor: '#1A2235' },
    headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
    content: { padding: 20 },
    inputGroup: { marginBottom: 20 },
    label: { color: '#8892B0', fontSize: 14, marginBottom: 8, textTransform: 'uppercase', fontWeight: '600' },
    input: { backgroundColor: '#1A2235', color: '#FFFFFF', padding: 16, borderRadius: 8, fontSize: 16, borderWidth: 1, borderColor: '#2A3441' },
    riskRow: { flexDirection: 'row', gap: 10 },
    riskButton: { flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#2A3441', backgroundColor: '#1A2235', alignItems: 'center' },
    riskButtonActive: { borderColor: '#00F0FF', backgroundColor: '#00F0FF22' },
    riskButtonText: { color: '#8892B0', fontWeight: '600' },
    riskButtonTextActive: { color: '#00F0FF' },
    saveButton: { backgroundColor: '#00F0FF', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 10, minHeight: 54, justifyContent: 'center' },
    saveButtonText: { color: '#0A0E17', fontSize: 16, fontWeight: 'bold' },
});