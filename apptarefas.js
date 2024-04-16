import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Modal, Button, Platform, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';

export default function TarefasScreen() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDueDateText, setTaskDueDateText] = useState('');
  const [taskDueTimeText, setTaskDueTimeText] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showAutoDateWarning, setShowAutoDateWarning] = useState(false);
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [taskDate, setTaskDate] = useState(new Date());
  const [taskTime, setTaskTime] = useState(new Date());
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [taskLocation, setTaskLocation] = useState(null);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || taskDate;
    setDatePickerVisible(Platform.OS === 'ios');
    setTaskDate(currentDate);
  };

  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || taskTime;
    setTimePickerVisible(Platform.OS === 'ios');
    setTaskTime(currentTime);
  };

  // Função para lidar com o envio de notificações
  async function sendPushNotification(expoPushToken) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Tarefa ' + taskTitle,
      body: taskDescription,
      data: { someData: 'goes here' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  }

  // Função para registrar o dispositivo para receber notificações
  useEffect(() => {
    const registerForPushNotificationsAsync = async () => {
      let token;
    
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          alert('Failed to get push token for push notification!');
          return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('Expo Push Token:', token); // Adicionando log para visualizar o token
        // Envio da notificação após obter o token
        if (token) {
          await sendPushNotification(token);
        }
      } else {
        alert('Must use physical device for Push Notifications');
      }
    
      return token;
    };
  
    const getTokenAndSendNotification = async () => {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        await sendPushNotification(token);
      }
    };
  
    getTokenAndSendNotification();
  
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });
  
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });
  
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  
  

  const isTaskValid = () => (
    taskTitle.trim() !== '' &&
    taskDescription.trim() !== ''
  );

  const handleAddTask = async () => {
    if (!isTaskValid()) {
      return;
    }
    setModalVisible(false);
    const newTask = {
      id: Date.now(),
      title: taskTitle,
      description: taskDescription,
      startDateText: taskDate.toLocaleDateString(),
      startTimeText: taskTime.toLocaleTimeString(),
      dueDateText: taskDueDateText,
      dueTimeText: taskDueTimeText,
      completed: false,
      image: image,
      location: taskLocation
    };
  
    setTasks(prevTasks => [...prevTasks, newTask]);
    resetTaskFields();
    setModalVisible(false);
    setShowAutoDateWarning(true);
  
    // Envio da notificação após adicionar a tarefa à lista
    if (expoPushToken) {
      await sendPushNotification(expoPushToken);
    }
  };

  const handleEditTask = (id) => {
    if (!isTaskValid()) {
      return;
    }
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        return {
          ...task,
          title: taskTitle,
          description: taskDescription,
          startDateText: taskDate.toLocaleDateString(),
          startTimeText: taskTime.toLocaleTimeString(),
          dueDateText: taskDueDateText,
          dueTimeText: taskDueTimeText,
          image: image,
          location: taskLocation
        };
      } else {
        return task;
      }
    });
    setTasks(updatedTasks);
    setEditingTaskId(null);
    resetTaskFields();
    setModalVisible(false);
  };

  const handleCompleteTask = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );

    setTasks(updatedTasks);
  };

  const handleDeleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    setEditingTaskId(null);
    resetTaskFields();
    setModalVisible(false);
  };

  const handleSearch = () => {
    const filteredTasks = tasks.filter((task) =>
      task.title.toLowerCase().includes(searchText.toLowerCase()) ||
      task.description.toLowerCase().includes(searchText.toLowerCase())
    );

    setFilteredTasks(filteredTasks);
  };

  useEffect(() => {
    setTasks((prevTasks) => [...prevTasks].sort((a, b) => a.title.localeCompare(b.title)));
  }, [tasks.length]);

  const displayedTasks = searchText.trim() === '' ? tasks : filteredTasks;

  const resetTaskFields = () => {
    setTaskTitle('');
    setTaskDescription('');
    setTaskDueDateText('');
    setTaskDueTimeText('');
    setImage(null);
    setTaskLocation(null);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setTaskLocation({ latitude, longitude });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Tarefas</Text>
        </View>
        <TextInput
          style={styles.inputpesuisa}
          placeholder="Pesquisar tarefas..."
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            handleSearch();
          }}
          onSubmitEditing={handleSearch}
        />
        <FlatList
          data={displayedTasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[
                styles.taskContainer,
                { borderColor: item.completed ? '#4CAF50' : '#ccc', borderWidth: 1 },
              ]}
              onPress={() => {
                setEditingTaskId(item.id);
                setTaskTitle(item.title);
                setTaskDescription(item.description);
                setTaskDueDateText(item.dueDateText);
                setTaskDueTimeText(item.dueTimeText);
                setModalVisible(true);
                setImage(item.image);
                setTaskLocation(item.location);
              }}
            >
              <Text style={styles.taskDescription}>{item.description}</Text>
              <Text style={styles.taskDateTime}>{`Início: ${item.startDateText} ${item.startTimeText}`}</Text>
              <Text style={styles.taskDateTime}>{`Conclusão: ${item.dueDateText} ${item.dueTimeText}`}</Text>
              <Image source={{ uri: item.image }} style={{ width: 50, height: 50 }} />
              <TouchableOpacity
                style={[
                  styles.completeButton,
                  { backgroundColor: item.completed ? '#F44336' : '#4CAF50' },
                ]}
                onPress={() => handleCompleteTask(item.id)}
              >
                <Text style={styles.completeButtonText}>
                  {item.completed ? 'Desfazer' : 'Feito'}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          style={styles.list}
        />
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setEditingTaskId(null);
              setModalVisible(true);
              setShowAutoDateWarning(true);
            }}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={modalVisible} animationType="slide">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                {editingTaskId ? 'Editar Tarefa' : 'Adicionar Tarefa'}
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Título da Tarefa"
                placeholderTextColor="black"
                value={taskTitle}
                onChangeText={setTaskTitle}
              />
              <TextInput
                style={styles.input}
                placeholder="Descrição da Tarefa"
                placeholderTextColor="black"
                value={taskDescription}
                onChangeText={setTaskDescription}
                multiline={true}
                numberOfLines={4}
              />

              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: taskLocation ? taskLocation.latitude : -23.55052,
                  longitude: taskLocation ? taskLocation.longitude : -46.633308,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                onPress={handleMapPress}
              >
                {taskLocation && <Marker coordinate={taskLocation} />}
              </MapView>

              <View style={styles.buttonContainer}>
                <DateTimePicker
                  testID="datePicker"
                  value={taskDate}
                  mode={'date'}
                  is24Hour={true}
                  display="default"
                  onChange={onChangeDate}
                />
                <DateTimePicker
                  testID="timePicker"
                  value={taskTime}
                  mode={'time'}
                  is24Hour={true}
                  display="default"
                  onChange={onChangeTime}
                />
              </View>

              <Image source={{ uri: image }} style={{ width: 50, height: 50 }} />
              <TouchableOpacity onPress={pickImage} style={styles.inputImage}>
                <Ionicons name="camera" size={24} color="black" />
              </TouchableOpacity>

              <View style={styles.buttonContainer}>
                {editingTaskId ? (
                  <>
                    <Button title="Salvar" onPress={() => handleEditTask(editingTaskId)} />
                    <Button title="Excluir" onPress={() => handleDeleteTask(editingTaskId)} color="red" />
                  </>
                ) : (
                  <TouchableOpacity
                    style={styles.addButton} // Alterado de styles.addButtonModal para styles.addButton
                    onPress={() => {
                      handleAddTask();
                    }}
                  >
                    <Text style={styles.addButtonText}>+</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  headerContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 33,
  },
  inputpesuisa: {
    height: 40,
    borderColor: 'black',
    borderWidth: 2,
    marginBottom: 10,
    paddingHorizontal: 10,
    marginTop: 10,
    borderRadius: 10,
  },
  list: {
    flex: 1,
  },
  taskContainer: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
  },
  taskDescription: {
    fontSize: 16,
    marginTop: 5,
  },
  taskDateTime: {
    fontSize: 14,
    marginTop: 5,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 32,
    alignItems: 'center',
    marginBottom: 6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 3,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom: 17,
  },
  input: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  map: {
    height: 200,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  inputImage: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
});
