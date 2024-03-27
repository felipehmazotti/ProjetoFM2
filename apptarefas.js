import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Modal, Button, Alert, Platform, Image } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import * as ImagePicker from 'expo-image-picker';


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
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
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
          <Text style={styles.autoDateText}>
            {showAutoDateWarning && 'A data de início será definida automaticamente.'}
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
          <View style={styles.dateTimeContainer}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 5 }]}
              placeholder="Data de Conclusão (dd/mm/aaaa)"
              placeholderTextColor="black"
              value={taskDueDateText}
              onChangeText={setTaskDueDateText}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Hora de Conclusão (hh:mm)"
              placeholderTextColor="black"
              value={taskDueTimeText}
              onChangeText={setTaskDueTimeText}
              keyboardType="numeric"
            />
            
            {image && (
              <View onPress={() => setopenModalImg(true)}>
                <Image style={styles.imgNovoContato} source={{ uri: image || setImage }} />
              </View>
            )}

            <TouchableOpacity onPress={pickImage}>
              <Text style={styles.inputImage}>Selecionar Imagem</Text>
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
              <Button title="Adicionar" onPress={async () => {
                handleAddTask();
                await sendPushNotification(expoPushToken);
              }} />
            )}
          </View>
        </View>
      </Modal>
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
    marginTop: 10,
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
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
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
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});
