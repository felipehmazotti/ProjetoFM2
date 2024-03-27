import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import TarefasScreen from './apptarefas';
import CalendarioScreen from './appcalendario';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Importe MaterialIcons do expo/vector-icons

const Tab = createMaterialBottomTabNavigator();

const Navegacao = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        barStyle={{ backgroundColor: 'white' }} // Define a cor da barra como branca
        activeColor="black" // Define a cor do texto como preto
        labeled={false} // Remove os subtitulos
        // Você pode ajustar a cor da borda aqui se desejar
      >
        <Tab.Screen
          name="Tarefas"
          component={TarefasScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                {/* Adicione um ícone para "Tarefas" */}
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
                {/* Aumente o tamanho do ícone do calendário */}
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
