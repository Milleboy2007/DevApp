// _layout.jsx
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { useTabNameContext, TabNameProvider } from '../contexts/tabNameContext';
import CustomDrawerHeader from '../components/CustomDrawerHeader';
import { colorsPalette } from '../assets/colorsPalette';
import { useTheme, ThemeProvider } from '../contexts/themeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const RootLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <TabNameProvider>
          <Layout />
        </TabNameProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}

export default RootLayout;

const Layout = () => {
  const { tabName } = useTabNameContext();
  const { theme } = useTheme();
  const colors = colorsPalette[theme];

  return (
    <SafeAreaView style={{flex:1, backgroundColor: colors.background}}>
      <StatusBar style={theme === 'light'? 'dark': 'light'} />
      {/* 2. Initialiser le Drawer avec des options globales */}
      <Drawer
        screenOptions={({ navigation }) => ({
          drawerActiveTintColor: colors.primary,
          drawerInactiveTintColor: colors.text,
          drawerStyle: {
            backgroundColor: colors.background,
          },
          header: () => <CustomDrawerHeader navigation={navigation} />,
          sceneContainerStyle: {
            backgroundColor: colors.background, // S'assure que l'écran prend la bonne couleur de fond
          },
        })}
      >
        {/* 3. Déclarer chaque écran */}
        {/* <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'Accueil',
            title: 'Bienvenue',
          }}
        /> */}
        <Drawer.Screen
          name="(pokemon)"
          options={{
            drawerLabel: 'Pokemon',
            title: tabName
          }}
        />

        <Drawer.Screen
          name="Calculatrice"
          options={{
            drawerLabel: 'Calculatrice',
            title: tabName
          }}
        />

        <Drawer.Screen
          name="takePicture"
          options={{
            drawerLabel: 'takePicture',
            title: tabName
          }}
        />
      </Drawer>
    </SafeAreaView>
  );
}