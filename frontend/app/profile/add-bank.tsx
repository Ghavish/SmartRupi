import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function AddBankScreen() {
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');

    const handleLinkSubmit = async () => {
        if (!bankName.trim() || !accountNumber.trim()) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }

        try {
            // TODO: Connect to backend database endpoint here
            // const response = await fetch('http://<YOUR_LOCAL_IP>:5000/api/bank/link', { ... });

            Alert.alert('Success', 'Bank account linked successfully!');
            router.back(); // Redirect user back to the updated accounts list view
        } catch (error) {
            Alert.alert('Error', 'Failed to link account. Please check your connection.');
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={28} color="#00F0FF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Link New Account</Text>
                <View style={{ width: 28 }} />
            </View>

            {/* Form Content */}
            <View style={styles.content}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Bank Name</Text>
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
                    />
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleLinkSubmit}>
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
    inputGroup: { marginBottom: 20 },
    label: { color: '#8892B0', fontSize: 14, marginBottom: 8, textTransform: 'uppercase', fontWeight: '600' },
    input: { backgroundColor: '#1A2235', color: '#FFFFFF', padding: 16, borderRadius: 8, fontSize: 16, borderWidth: 1, borderColor: '#2A3441' },
    submitButton: { backgroundColor: '#00F0FF', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    submitButtonText: { color: '#0A0E17', fontSize: 16, fontWeight: 'bold' }
});