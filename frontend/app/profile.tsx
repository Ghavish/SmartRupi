import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function ProfileScreen() {
  
  const handleLogout = () => {
    router.replace('/');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#00F0FF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.avatarContainer}>
        <Ionicons name="person-circle" size={100} color="#00F0FF" />
        <Text style={styles.name}>Ghavish Subratty</Text>
        <Text style={styles.email}>ghavish@umail.uom.ac.mu</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.infoCard}>
          <Ionicons name="school" size={24} color="#8892B0" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Institution</Text>
            <Text style={styles.infoValue}>University of Mauritius (UoM)</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="people" size={24} color="#8892B0" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Role</Text>
            <Text style={styles.infoValue}>Hackathon Team Lead</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Account Settings</Text>
          <Ionicons name="chevron-forward" size={20} color="#8892B0" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Notification Preferences</Text>
          <Ionicons name="chevron-forward" size={20} color="#8892B0" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Linked Bank Accounts</Text>
          <Ionicons name="chevron-forward" size={20} color="#8892B0" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>LOG OUT</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E17',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#1A2235',
    borderBottomWidth: 1,
    borderBottomColor: '#2A3441',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  name: {
    color: '#00F0FF',
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 10,
  },
  email: {
    color: '#8892B0',
    fontSize: 16,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A2235',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  infoTextContainer: {
    marginLeft: 16,
  },
  infoLabel: {
    color: '#8892B0',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A2235',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  menuText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#FF4545',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});