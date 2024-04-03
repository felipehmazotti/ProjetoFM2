import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Modal, Button, Alert, Platform, Image, } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker'; //seletor de data
import { Ionicons } from '@expo/vector-icons';


import { Entypo } from '@expo/vector-icons'; //pacote de icones

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
  const [taskDate, setTaskDate] = useState(new Date()); //armazena a data das tarefas
  const [taskTime, setTaskTime] = useState(new Date()); //armazena a hora das tarefas
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [taskLocation, setTaskLocation] = useState('');
  

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

  //mensagem
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });


  // Can use this function below or use Expo's Push Notification Tool from: https://expo.dev/notifications
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

  async function registerForPushNotificationsAsync() {
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
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      });
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }

    return token.data;
  }

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

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



  const isTaskValid = () => {
    return (
      taskTitle.trim() !== '' &&
      taskDescription.trim() !== '' &&
      taskDueDateText.trim() !== '' &&
      taskDueTimeText.trim() !== ''
    );
  };

  const handleAddTask = () => {
    if (!isTaskValid()) {
    }

    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    const formattedTime = `${currentDate.getHours()}:${currentDate.getMinutes()}`;

    const newTask = {
      id: Date.now(),
      title: taskTitle,
      description: taskDescription,
      startDateText: formattedDate,
      startTimeText: formattedTime,
      dueDateText: taskDueDateText,
      dueTimeText: taskDueTimeText,
      completed: false,
      image: image
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    resetTaskFields();
    setModalVisible(false);
    setShowAutoDateWarning(true);


  };

  const handleEditTask = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? {
          ...task,
          title: taskTitle,
          description: taskDescription,
          dueDateText: taskDueDateText,
          dueTimeText: taskDueTimeText,
          image: image,
        }
        : task
    );

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
  };


  //image picker
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };



  return (
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
            }}
          >
            <Text style={styles.taskDescription}>{item.description}</Text>
            <Text style={styles.taskDateTime}>{`Início: ${item.startDateText} ${item.startTimeText}`}</Text>
            <Text style={styles.taskDateTime}>{`Conclusão: ${item.dueDateText} ${item.dueTimeText}`}</Text>
            <Image source={{ uri: image }} style={{ width: 50, height: 50 }} />
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
          <View style={styles.buttonContainer}>




            <DateTimePicker
              testID="datePicker"
              value={taskDate}
              mode={'date'}
              is24Hour={true}
              display="default"
              onChange={onChangeDate}
            />



            <DateTimePicker style={styles.dateTimeContainer2}
              testID="timePicker"
              value={taskTime}
              mode={'time'}
              is24Hour={true}
              display="default"
              onChange={onChangeTime}
            />

          </View>

          {image && (
            <View onPress={() => setopenModalImg(true)}>
              <Image style={styles.imgNovoContato} source={{ uri: image || setImage }} />
            </View>
          )}

<TouchableOpacity onPress={pickImage} style={styles.inputImage}>
  <Ionicons name="camera" size={24} color="black" />
</TouchableOpacity>

          <Image source={{ uri: image }} style={{ width: 50, height: 50 }} />
        </View>
        <View style={styles.buttonContainer}>
          {editingTaskId ? (
            <>
              <Button title="Salvar" onPress={() => handleEditTask(editingTaskId)} />
              <Button title="Excluir" onPress={() => handleDeleteTask(editingTaskId)} color="red" />
              <Button title="Cancelar" onPress={() => { setModalVisible(false); setShowAutoDateWarning(false); }} />
            </>
          ) : (
            <TouchableOpacity
  style={styles.addButton2}
  onPress={async () => {
    handleAddTask();
    await sendPushNotification(expoPushToken);
  }}
>
  <Text style={styles.buttonText2}>+</Text>
</TouchableOpacity>

          )}
        </View></Modal>
    </View>
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
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskDescription: {
    fontSize: 16,
    marginTop: 5,
  },
  taskDateTime: {
    fontSize: 14,
    marginTop: 5,
  },
  autoDateText: {
    fontSize: 14,
    color: 'red',
    marginBottom: 10,
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
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 3.5,
    marginLeft: -10,
    marginTop: 15,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateTimeContainer2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
    marginRight: 150,
  },
  inputImage: {
    marginLeft: 270,
    marginRight: 20,
    marginTop: -35,
    alignItems: "center",
    backgroundColor: '#ebebed',
    borderRadius: 10,
    padding: 5, // Espaçamento interno
  },
  addButton2: {
    width: 50, // Largura do botão
    height: 50, // Altura do botão
    marginLeft: 190,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    marginTop: -580, // Espaçamento acima do botão
  },
  buttonText2: {
    color: '#fff', // Cor do texto
    fontSize: 20, // Tamanho do texto
    fontWeight: 'bold', // Negrito
  },

});
