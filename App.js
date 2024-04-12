// Navegacao.js

import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import TarefasScreen from './apptarefas';
import CalendarioScreen from './appcalendario';
import Login from './login'; // Importe o componente de login
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';


const Tab = createMaterialBottomTabNavigator();

const Navegacao = () => {
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
                <Text style={{ color, fontSize: 16 }}>login</Text>
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
                <Text style={{ color, fontSize: 16, marginRight: -30, marginLeft: -27, }}>Tarefas</Text>
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
                <Text style={{ color, fontSize: 16 }}>Calendário</Text>
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navegacao;