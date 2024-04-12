import React, { useEffect, useState } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import SplashScreen from 'react-native-splash-screen';
import TarefasScreen from './apptarefas'; // Importe o componente TarefasScreen
import CalendarioScreen from './appcalendario'; // Importe o componente CalendarioScreen
import Login from './login'; // Importe o componente Login

const Tab = createMaterialBottomTabNavigator();

const Navegacao = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (SplashScreen && typeof SplashScreen.hide === 'function') {
        SplashScreen.hide();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={require('./images/logo_to-do-.png')}
          style={{ width: 200, height: 200 }}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        barStyle={{ backgroundColor: 'white' }}
        activeColor="black"
        labeled={false}
      >
        <Tab.Screen
          name="Login"
          component={Login} // Corrigido para utilizar o componente Login
          options={{
            tabBarIcon: ({ color }) => (
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <MaterialIcons name="login" size={24} color={color} />
                <Text style={{ color }}>Login</Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Tarefas"
          component={TarefasScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <MaterialIcons name="list" size={24} color={color} />
                <Text style={{ color, fontSize: 16 }}>Tarefas</Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Calendário"
          component={CalendarioScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <MaterialIcons name="date-range" size={24} color={color} />
                <Text style={{ color }}>Calendário</Text>
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navegacao;
