import React, { useEffect, useState } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, Image, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import SplashScreen from 'react-native-splash-screen';
import TarefasScreen from './apptarefas'; // Importe o componente TarefasScreen
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
          component={Login}
          options={{
            tabBarIcon: ({ color }) => (
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <MaterialIcons name="login" size={24} color={color} />
                <Text style={styles.tabText}>Login</Text>
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
                <Text style={styles.tabText2}>Tarefas</Text>
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabText: {
    color: 'black',
    marginLeft: -4,
    marginRight: -12,
    fontSize: 14,
  },
  tabText2: {
    color: 'black',
    marginLeft: -4,
    marginRight: -12,
    marginTop: 3,
    fontSize: 14,
  },
});

export default Navegacao;
