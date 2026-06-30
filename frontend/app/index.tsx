import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    
    // Simulate a 1-second network request to your Node.js backend
    setTimeout(() => {
      setIsLoading(false);
      // router.replace completely wipes the login screen from history
      // so the user cannot swipe back to it once they are in!
      router.replace('/tabs/finances');
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {/* App Branding */}
      <View style={styles.headerContainer}>
      <Image 
        source={require('../assets/images/Logo.png')} 
        style={styles.logoImage} 
        resizeMode="contain"
      />
      <Text style={styles.logoText}>SmartRupi</Text>
      <Text style={styles.subtitle}>Bank Smarter,</Text>
      <Text style={styles.subtitle}>Live Safer</Text>
    </View>

      {/* Input Fields (Pre-filled for the Hackathon Demo) */}
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        placeholderTextColor="#8892B0"
        defaultValue="your-email@gmail.com" 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        placeholderTextColor="#8892B0"
        defaultValue="••••••••"
        secureTextEntry 
      />

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#0A0E17" />
        ) : (
          <Text style={styles.buttonText}>Log In</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E17',
    justifyContent: 'center',
    padding: 24,
  },
  headerContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#00F0FF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8892B0',
  },
  input: {
    backgroundColor: '#1A2235',
    color: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2A3441',
  },
  button: {
    backgroundColor: '#00F0FF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#0A0E17',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoImage: {
    width: 200, 
    height: 200,
    marginBottom: 16,
  },
});