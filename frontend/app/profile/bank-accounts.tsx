import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

interface BankAccount {
    id: string;
    bankName: string;
    accountNumber: string;
}

// ── Global store so data persists across navigation ───────────────────────────
let globalAccounts: BankAccount[] = [
    { id: '1', bankName: 'State Bank of Mauritius (SBM)', accountNumber: '•••• •••• 4321' },
    { id: '2', bankName: 'MCB Mauritius', accountNumber: '•••• •••• 8765' }
];
// ─────────────────────────────────────────────────────────────────────────────

export default function BankAccountsScreen() {
    const params = useLocalSearchParams<{ newBankName?: string; newAccountNumber?: string }>();
    const [accounts, setAccounts] = useState<BankAccount[]>(globalAccounts);

    // Edit modal state
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
    const [editBankName, setEditBankName] = useState('');
    const [editAccountNumber, setEditAccountNumber] = useState('');

    // Delete modal state
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);

    const updateAccounts = (newList: BankAccount[]) => {
        globalAccounts = newList;
        setAccounts([...newList]);
    };

    // ── New account from AddBankScreen ────────────────────────────────────────
    useEffect(() => {
        if (params.newBankName && params.newAccountNumber) {
            const masked = '•••• •••• ' + params.newAccountNumber.slice(-4);
            const exists = globalAccounts.find(a => a.bankName === params.newBankName && a.accountNumber === masked);
            if (!exists) {
                updateAccounts([...globalAccounts, {
                    id: Date.now().toString(),
                    bankName: params.newBankName,
                    accountNumber: masked,
                }]);
            }
        }
    }, [params.newBankName, params.newAccountNumber]);
    // ─────────────────────────────────────────────────────────────────────────

    // ── Delete ────────────────────────────────────────────────────────────────
    const handleDelete = (id: string) => {
        setDeleteId(id);
        setConfirmDeleteVisible(true);
    };

    const confirmDelete = () => {
        if (deleteId) {
            updateAccounts(globalAccounts.filter(acc => acc.id !== deleteId));
        }
        setConfirmDeleteVisible(false);
        setDeleteId(null);
    };
    // ─────────────────────────────────────────────────────────────────────────

    // ── Edit ──────────────────────────────────────────────────────────────────
    const handleEditOpen = (account: BankAccount) => {
        setEditingAccount(account);
        setEditBankName(account.bankName);
        setEditAccountNumber('');
        setEditModalVisible(true);
    };

    const handleEditSave = () => {
        if (!editBankName.trim()) return;

        const updated = globalAccounts.map(acc => {
            if (acc.id === editingAccount?.id) {
                const masked = editAccountNumber.length >= 4
                    ? '•••• •••• ' + editAccountNumber.slice(-4)
                    : acc.accountNumber;
                return { ...acc, bankName: editBankName, accountNumber: masked };
            }
            return acc;
        });

        updateAccounts(updated);
        setEditModalVisible(false);
        setEditingAccount(null);
    };
    // ─────────────────────────────────────────────────────────────────────────

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={28} color="#00F0FF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Bank Accounts</Text>
                <View style={{ width: 28 }} />
            </View>

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
                        <View style={styles.actions}>
                            <TouchableOpacity onPress={() => handleEditOpen(item)} style={styles.actionBtn}>
                                <Ionicons name="pencil-outline" size={20} color="#00F0FF" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionBtn}>
                                <Ionicons name="trash-outline" size={20} color="#FF4545" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => router.push('/profile/add-bank')}
                >
                    <Ionicons name="add" size={20} color="#0A0E17" style={{ marginRight: 6 }} />
                    <Text style={styles.addButtonText}>LINK NEW ACCOUNT</Text>
                </TouchableOpacity>
            </View>

            {/* ── Edit Modal ───────────────────────────────────────────────────── */}
            <Modal
                visible={editModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Account</Text>

                        <Text style={styles.modalLabel}>Bank Name</Text>
                        <TextInput
                            style={styles.modalInput}
                            value={editBankName}
                            onChangeText={setEditBankName}
                            placeholderTextColor="#8892B0"
                        />

                        <Text style={styles.modalLabel}>New Account Number (optional)</Text>
                        <TextInput
                            style={styles.modalInput}
                            value={editAccountNumber}
                            onChangeText={setEditAccountNumber}
                            placeholder="Leave blank to keep existing"
                            placeholderTextColor="#8892B0"
                            keyboardType="number-pad"
                            maxLength={16}
                        />
                        <Text style={styles.modalHint}>Last 4 digits will be shown for security</Text>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.modalCancelBtn}
                                onPress={() => setEditModalVisible(false)}
                            >
                                <Text style={styles.modalCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalSaveBtn} onPress={handleEditSave}>
                                <Text style={styles.modalSaveText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* ── Delete Confirmation Modal ─────────────────────────────────────── */}
            <Modal
                visible={confirmDeleteVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setConfirmDeleteVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Remove Account</Text>
                        <Text style={styles.modalDesc}>Are you sure you want to unlink this account?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.modalCancelBtn}
                                onPress={() => setConfirmDeleteVisible(false)}
                            >
                                <Text style={styles.modalCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalSaveBtn, { backgroundColor: '#FF4545' }]}
                                onPress={confirmDelete}
                            >
                                <Text style={styles.modalSaveText}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A0E17' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, backgroundColor: '#1A2235' },
    headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
    listContent: { padding: 20 },
    card: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1A2235', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#2A3441' },
    cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    cardTextContainer: { marginLeft: 16, flex: 1 },
    bankName: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
    accountNumber: { color: '#8892B0', fontSize: 14, marginTop: 4 },
    emptyText: { color: '#8892B0', textAlign: 'center', marginTop: 40, fontSize: 16 },
    actions: { flexDirection: 'row', gap: 8 },
    actionBtn: { padding: 6 },
    footer: { padding: 20 },
    addButton: { flexDirection: 'row', backgroundColor: '#00F0FF', padding: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    addButtonText: { color: '#0A0E17', fontSize: 16, fontWeight: 'bold' },
    modalOverlay: { flex: 1, backgroundColor: '#000000AA', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#1A2235', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
    modalTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
    modalDesc: { color: '#8892B0', fontSize: 14, marginBottom: 24 },
    modalLabel: { color: '#8892B0', fontSize: 12, textTransform: 'uppercase', fontWeight: '600', marginBottom: 8 },
    modalInput: { backgroundColor: '#0A0E17', color: '#FFFFFF', padding: 14, borderRadius: 8, fontSize: 16, borderWidth: 1, borderColor: '#2A3441', marginBottom: 16 },
    modalHint: { color: '#8892B0', fontSize: 11, marginTop: -10, marginBottom: 20 },
    modalButtons: { flexDirection: 'row', gap: 12 },
    modalCancelBtn: { flex: 1, padding: 14, borderRadius: 8, borderWidth: 1, borderColor: '#2A3441', alignItems: 'center' },
    modalCancelText: { color: '#8892B0', fontWeight: '600' },
    modalSaveBtn: { flex: 1, padding: 14, borderRadius: 8, backgroundColor: '#00F0FF', alignItems: 'center' },
    modalSaveText: { color: '#0A0E17', fontWeight: 'bold' },
});