import { Tabs, router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {

  return (
    <Tabs screenOptions={{
      tabBarStyle: {
        backgroundColor: '#0A0E17',
        borderTopColor: '#1A2235'
      },
      tabBarActiveTintColor: '#00F0FF',
      tabBarInactiveTintColor: '#8892B0',

      // Global Top Header Styling
      headerStyle: { backgroundColor: '#0A0E17' },
      headerTintColor: '#FFFFFF',
      headerTitleStyle: { fontWeight: 'bold' },

      headerRight: () => (
        <TouchableOpacity onPress={() => router.push('/profile')} style={{ marginRight: 16 }}>
          <Ionicons name="person-circle-outline" size={28} color="#00F0FF" />
        </TouchableOpacity>
      ),

    }}>
      <Tabs.Screen
        name="finances"
        options={{
          title: 'Finances',
          tabBarIcon: ({ color }) => <Ionicons name="pie-chart" color={color} size={24} />
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Inbox',
          tabBarIcon: ({ color }) => <Ionicons name="mail" color={color} size={24} />
        }}
      />
      <Tabs.Screen
        name="invest"
        options={{
          title: 'Invest',
          tabBarIcon: ({ color }) => <Ionicons name="trending-up" color={color} size={24} />
        }}
      />
      <Tabs.Screen
        name="loans"
        options={{
          // Edit this to change or hide header
          title: 'Loans',
          tabBarIcon: ({ color }) => <Ionicons name="cash" color={color} size={24} />
        }}
      />
    </Tabs>
  );
}