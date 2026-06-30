import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

interface BankAccount {
    id: string;
    bankName: string;
    accountNumber: string;
}

export default function BankAccountsScreen() {
    const [accounts, setAccounts] = useState<BankAccount[]>([
        { id: '1', bankName: 'State Bank of Mauritius (SBM)', accountNumber: '•••• •••• 4321' },
        { id: '2', bankName: 'MCB Mauritius', accountNumber: '•••• •••• 8765' }
    ]);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={28} color="#00F0FF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Bank Accounts</Text>
                <View style={{ width: 28 }} />
            </View>

            {/* Account List */}
            <FlatList
                data={accounts}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={<Text style={styles.emptyText}>No bank accounts linked yet.</Text>}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.cardLeft}>
                            <Ionicons name="card" size={32} color="#00F0FF" />
                            <View style={styles.cardTextContainer}>
                                <Text style={styles.bankName}>{item.bankName}</Text>
                                <Text style={styles.accountNumber}>{item.accountNumber}</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => setAccounts(accounts.filter(acc => acc.id !== item.id))}
                        >
                            <Ionicons name="trash-outline" size={22} color="#FF4545" />
                        </TouchableOpacity>
                    </View>
                )}
            />

            {/* Footer Button - Navigates to a new dedicated screen */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => router.push('/profile/add-bank')}
                >
                    <Ionicons name="add" size={20} color="#0A0E17" style={{ marginRight: 6 }} />
                    <Text style={styles.addButtonText}>LINK NEW ACCOUNT</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A0E17' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, backgroundColor: '#1A2235' },
    headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
    listContent: { padding: 20 },
    card: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1A2235', padding: 16, borderRadius: 12, marginBottom: 12 },
    cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    cardTextContainer: { marginLeft: 16, flex: 1 },
    bankName: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
    accountNumber: { color: '#8892B0', fontSize: 14, marginTop: 4 },
    emptyText: { color: '#8892B0', textAlign: 'center', marginTop: 40, fontSize: 16 },
    footer: { padding: 20 },
    addButton: { flexDirection: 'row', backgroundColor: '#00F0FF', padding: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    addButtonText: { color: '#0A0E17', fontSize: 16, fontWeight: 'bold' }
});