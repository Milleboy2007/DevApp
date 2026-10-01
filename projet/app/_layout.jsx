import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

export default function RootLayout() {
  return (
    // 1. Envelopper l'application pour gérer les gestes
    <GestureHandlerRootView style={{ flex: 1 }}>
      
      {/* 2. Initialiser le Drawer avec des options globales */}
      <Drawer
        screenOptions={{
          headerStyle: { backgroundColor: '#6200ee' },
          headerTintColor: '#fff',
          drawerActiveTintColor: '#6200ee',
          drawerType: 'front', // 'front', 'back', ou 'slide'
          headerShown: false
        }}
      >
        <Drawer.Screen
            name="setting"
            options={{
                drawerLabel: 'Parametre',
                title: 'Configuration',
                drawerIcon: ({color, size}) => (
                    <Ionicons name="settings-outline" size={size} color={color}/>
                )
            }}
        />
        {/* 3. Déclarer chaque écran */}
        <Drawer.Screen
          name="animation"
          options={{
            drawerLabel: 'Animation',
          }}
        />
        <Drawer.Screen
          name="app"
          options={{
            drawerLabel: 'App',
          }}
        />
        <Drawer.Screen
          name="(separate)"
          options={{
            drawerLabel: 'Calculatrice',
          }}
        />
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'Index',
          }}
        />
        <Drawer.Screen
          name="old_anim"
          options={{
            drawerLabel: 'Old_anim',
          }}
        />
        <Drawer.Screen
          name="toDoList"
          options={{
            drawerLabel: 'ToDoList',
          }}
        />
        <Drawer.Screen
          name="touchable"
          options={{
            drawerLabel: 'Touchable',
          }}
        />
      </Drawer>

    </GestureHandlerRootView>
  );
}