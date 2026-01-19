import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarInactiveTintColor: Colors[colorScheme].tabIconDefault,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme].surface,
          borderTopColor: Colors[colorScheme].border,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
        }}
      />
      <Tabs.Screen
        name="upgrades"
        options={{
          title: 'Upgrades',
          tabBarIcon: ({ color }) => <TabBarIcon name="wrench" color={color} />,
        }}
      />
      <Tabs.Screen
        name="attachments"
        options={{
          title: 'Attachments',
          tabBarIcon: ({ color }) => <TabBarIcon name="crosshairs" color={color} />,
        }}
      />
      <Tabs.Screen
        name="donors"
        options={{
          title: 'Donors',
          tabBarIcon: ({ color }) => <TabBarIcon name="recycle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="keys"
        options={{
          title: 'Keys',
          tabBarIcon: ({ color }) => <TabBarIcon name="key" color={color} />,
        }}
      />
    </Tabs>
  );
}
