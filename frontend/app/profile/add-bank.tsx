import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const BANKS = ['MCB', 'SBM', 'Absa', 'BCP', 'Barclays', 'AfrAsia'];

export default function AddBankScreen() {
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');

    const handleLinkSubmit = () => {
        if (!bankName.trim() || !accountNumber.trim()) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }

        if (accountNumber.length < 8) {
            Alert.alert('Error', 'Account number must be at least 8 digits.');
            return;
        }

        const masked = '•••• •••• ' + accountNumber.slice(-4);

        // Navigate back with params
        router.navigate({
            pathname: '/profile/bank-accounts',
            params: {
                newBankName: bankName,
                newAccountNumber: accountNumber,
            }
        });
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={28} color="#00F0FF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Link New Account</Text>
                <View style={{ width: 28 }} />
            </View>

            <View style={styles.content}>
                <Text style={styles.sectionLabel}>Select Bank</Text>
                <View style={styles.bankGrid}>
                    {BANKS.map((bank) => (
                        <TouchableOpacity
                            key={bank}
                            style={[styles.bankChip, bankName === bank && styles.bankChipActive]}
                            onPress={() => setBankName(bank)}
                        >
                            <Text style={[styles.bankChipText, bankName === bank && styles.bankChipTextActive]}>
                                {bank}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Or Enter Bank Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., MCB, SBM, Absa"
                        placeholderTextColor="#8892B0"
                        value={bankName}
                        onChangeText={setBankName}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Account Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter account number"
                        placeholderTextColor="#8892B0"
                        keyboardType="number-pad"
                        value={accountNumber}
                        onChangeText={setAccountNumber}
                        maxLength={16}
                    />
                    <Text style={styles.hint}>Last 4 digits will be shown for security</Text>
                </View>

                <TouchableOpacity
                    style={[styles.submitButton, (!bankName || !accountNumber) && styles.submitDisabled]}
                    onPress={handleLinkSubmit}
                    disabled={!bankName || !accountNumber}
                >
                    <Text style={styles.submitButtonText}>CONFIRM LINK</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A0E17' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, backgroundColor: '#1A2235' },
    headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
    content: { padding: 20 },
    sectionLabel: { color: '#8892B0', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginBottom: 12 },
    bankGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
    bankChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#2A3441', backgroundColor: '#1A2235' },
    bankChipActive: { borderColor: '#00F0FF', backgroundColor: '#00F0FF22' },
    bankChipText: { color: '#8892B0', fontWeight: '600' },
    bankChipTextActive: { color: '#00F0FF' },
    inputGroup: { marginBottom: 20 },
    label: { color: '#8892B0', fontSize: 14, marginBottom: 8, textTransform: 'uppercase', fontWeight: '600' },
    input: { backgroundColor: '#1A2235', color: '#FFFFFF', padding: 16, borderRadius: 8, fontSize: 16, borderWidth: 1, borderColor: '#2A3441' },
    hint: { color: '#8892B0', fontSize: 11, marginTop: 6 },
    submitButton: { backgroundColor: '#00F0FF', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    submitDisabled: { opacity: 0.4 },
    submitButtonText: { color: '#0A0E17', fontSize: 16, fontWeight: 'bold' },
});