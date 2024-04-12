import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function CalendarioScreen({ tasks }) {
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    mapTasksToCalendar();
  }, [tasks]);

  const mapTasksToCalendar = () => {
    const markedDatesObj = {};

    if (Array.isArray(tasks)) {
      tasks.forEach(task => {
        const taskDate = task.startDateText;
        // Verifica se a data da tarefa é válida
        if (isValidDate(taskDate)) {
          // Adiciona a data da tarefa aos markedDates com um marcador
          markedDatesObj[taskDate] = { marked: true, dotColor: '#FF5733' };
        }
      });
    }

    setMarkedDates(markedDatesObj);
  };

  const isValidDate = (dateString) => {
    const dateObj = new Date(dateString);
    // Verifica se a data é válida
    return !isNaN(dateObj.getTime());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendário</Text>
      <View style={styles.calendarContainer}>
        <Calendar
          markedDates={markedDates}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  calendarContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
  },
});
