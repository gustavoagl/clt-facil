import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import RescisaoScreen from './src/screens/RescisaoScreen';
import TrezeAvosScreen from './src/screens/TrezeAvosScreen';
import FeriasScreen from './src/screens/FeriasScreen';
import FGTSScreen from './src/screens/FGTSScreen';
import ResultadoScreen from './src/screens/ResultadoScreen';
import SobreScreen from './src/screens/SobreScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#FFF' },
          headerTintColor: '#111',
          headerTitleStyle: { fontWeight: '700', fontSize: 16 },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'CLT Fácil' }} />
        <Stack.Screen name="Rescisao" component={RescisaoScreen} options={{ title: 'Rescisão Contratual' }} />
        <Stack.Screen name="TrezeAvos" component={TrezeAvosScreen} options={{ title: '13º Salário' }} />
        <Stack.Screen name="Ferias" component={FeriasScreen} options={{ title: 'Férias' }} />
        <Stack.Screen name="FGTS" component={FGTSScreen} options={{ title: 'FGTS' }} />
        <Stack.Screen name="Resultado" component={ResultadoScreen} options={{ title: 'Resultado' }} />
        <Stack.Screen name="Sobre" component={SobreScreen} options={{ title: 'Sobre o App' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
