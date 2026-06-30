import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function SettingsScreen() {
    const [name, setName] = useState('Ghavish Subratty');
    const [email, setEmail] = useState('ghavish@umail.uom.ac.mu');
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveChanges = async () => {
        if (!name.trim() || !email.trim()) {
            Alert.alert('Error', 'Fields cannot be empty.');
            return;
        }

        setIsSaving(true);
        try {
            // TODO: Replace with your actual backend endpoint
            // const response = await fetch('http://<YOUR_LOCAL_IP>:5000/api/profile/update', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ name, email })
            // });

            // Simulate backend network latency
            await new Promise((resolve) => setTimeout(resolve, 1000));

            Alert.alert('Success', 'Profile updated successfully.');
            router.back();
        } catch (error) {
            Alert.alert('Connection Error', 'Could not connect to the server.');
        } finally {
            setIsSaving(false);
        }
    };

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

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSaveChanges}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <ActivityIndicator color="#FFFFFF" />
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
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, backgroundColor: '#1A2235' },
    headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
    content: { padding: 20 },
    inputGroup: { marginBottom: 20 },
    label: { color: '#8892B0', fontSize: 14, marginBottom: 8, textTransform: 'uppercase', fontWeight: '600' },
    input: { backgroundColor: '#1A2235', color: '#FFFFFF', padding: 16, borderRadius: 8, fontSize: 16, borderWidth: 1, borderColor: '#2A3441' },
    saveButton: { backgroundColor: '#00F0FF', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 10, minHeight: 54, justifyContent: 'center' },
    saveButtonText: { color: '#0A0E17', fontSize: 16, fontWeight: 'bold' }
});