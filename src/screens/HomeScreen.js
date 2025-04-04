import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';


import ProTeamsScreen from './ProTeamsScreen';
import SettingsScreen from './SettingsScreen';


const homePagesButtons = [
  { screen: 'Home', iconImage: require('../assets/icons/whiteMatchCollectionsIcons/homeMCollectIcon.png'), selectedIconImage: require('../assets/icons/blackMatchCollectionsIcons/homeMCollectIcon.png') },
  { screen: 'Focusing', iconImage: require('../assets/icons/whiteMatchCollectionsIcons/peopleMCollectIcon.png'), selectedIconImage: require('../assets/icons/blackMatchCollectionsIcons/peopleMCollectIcon.png') },
  { screen: 'Settings', iconImage: require('../assets/icons/whiteMatchCollectionsIcons/settingsMCollectIcon.png'), selectedIconImage: require('../assets/icons/blackMatchCollectionsIcons/settingsMCollectIcon.png') },
];

const fontInterRegular = 'Inter18pt-Regular';

const HomeScreen = () => {

  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedScreen, setSelectedScreen] = useState('Home');

  const [selectedProjectCategory, setSelectedProjectCategory] = useState('Schedule');

  const [isAddindTaskVisible, setAddindTaskVisible] = useState(false);
  const [isToDoVisible, setToDoVisible] = useState(false);
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [today, setToday] = useState(new Date());
  const [selectedProMatchDate, setSelectedProMatchDate] = useState(new Date());

  const [title, setTitle] = useState('');
  const [toDoTaskTitle, setToDoTaskTitle] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('');

  const [proMatchTasks, setProMatchTasks] = useState([]);
  const [proMatchToDoTasks, setProMatchToDoTasks] = useState([]);

  const [proMatchTaskToDel, setProMatchTaskToDel] = useState(null);

  const [deleteProTaskModalVisible, setDeleteProTaskModalVisible] = useState(false);

  const [isProMatchNotific, setIsProMatchNotific] = useState(true);

  const [typeOfDeliting, setTypeOfDeliting] = useState('');

  const loadProMatchNotifications = async () => {
    try {
      const notificationProMatchVal = await AsyncStorage.getItem('isProMatchNotific');

      if (notificationProMatchVal !== null) setIsProMatchNotific(JSON.parse(notificationProMatchVal));
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  useEffect(() => {
    loadProMatchNotifications();
  }, [isProMatchNotific, selectedScreen]);

  const removeProMatchTask = async (taskToRemove) => {
    try {
      const updatedProTasks = proMatchTasks.filter(task =>
        !(task.id === taskToRemove.id)
      );
      await AsyncStorage.setItem('proMatchTasks', JSON.stringify(updatedProTasks));
      setProMatchTasks(updatedProTasks);
      setDeleteProTaskModalVisible(false);
      setTypeOfDeliting('');
    } catch (error) {
      Alert.alert('Error', 'Failed to remove project from proMatchTasks.');
    }
  };

  const removeToDoTask = async (toDoTaskToRemove) => {
    try {
      const updatedToDoTask = proMatchToDoTasks.filter(task =>
        !(task.id === toDoTaskToRemove.id)
      );
      await AsyncStorage.setItem('proMatchToDoTasks', JSON.stringify(updatedToDoTask));
      setProMatchToDoTasks(updatedToDoTask);
      setDeleteProTaskModalVisible(false);
      setTypeOfDeliting('');
    } catch (error) {
      Alert.alert('Error', 'Failed to remove toDoTask from proMatchToDoTasks.');
    }
  };


  const saveProMatchTask = async () => {
    try {
      const exProMatchTask = await AsyncStorage.getItem('proMatchTasks');
      const proMatchTasks = exProMatchTask ? JSON.parse(exProMatchTask) : [];
      const newProMatchId = proMatchTasks.length > 0 ? Math.max(...proMatchTasks.map(task => task.id)) + 1 : 1;

      const proTask = {
        id: newProMatchId,
        title,
        time,
        duration,
        date: selectedProMatchDate,
        status: 'pending',
      };

      proMatchTasks.unshift(proTask);
      await AsyncStorage.setItem('proMatchTasks', JSON.stringify(proMatchTasks));
      setProMatchTasks(proMatchTasks);
      setTitle('');
      setDuration('');
      setAddindTaskVisible(false);
      setTime('');
    } catch (error) {
      console.error('Error proMatchTask saving:', error);
    }
  };

  const saveToDoProMatchTask = async () => {
    try {
      const exProMatchToDo = await AsyncStorage.getItem('proMatchToDoTasks');
      const proMatchToDoTasks = exProMatchToDo ? JSON.parse(exProMatchToDo) : [];
      const newProMatchToDoId = proMatchToDoTasks.length > 0 ? Math.max(...proMatchToDoTasks.map(toDo => toDo.id)) + 1 : 1;

      const toDoTask = {
        id: newProMatchToDoId,
        title: toDoTaskTitle,
        status: 'pending',
        date: new Date(),
      };

      proMatchToDoTasks.unshift(toDoTask);
      await AsyncStorage.setItem('proMatchToDoTasks', JSON.stringify(proMatchToDoTasks));
      setProMatchToDoTasks(proMatchToDoTasks);

      setToDoTaskTitle('');
      setToDoVisible(false);

    } catch (error) {
      console.error('Error proMatchTask saving:', error);
    }
  };

  useEffect(() => {
    const loadProMatchTasks = async () => {
      try {
        const exProMatchTask = await AsyncStorage.getItem('proMatchTasks');
        const exToDoProMatchTasks = await AsyncStorage.getItem('proMatchToDoTasks');

        if (exToDoProMatchTasks) {
          setProMatchToDoTasks(JSON.parse(exToDoProMatchTasks));
        }

        if (exProMatchTask) {
          setProMatchTasks(JSON.parse(exProMatchTask));
        }
      } catch (error) {
        console.error('Error loading proMatchTasks:', error);
      }
    };

    loadProMatchTasks();
  }, [selectedScreen]);

  useEffect(() => {
    const proMatchNow = new Date();
    const proMatchTomorrow = new Date(proMatchNow.getFullYear(), proMatchNow.getMonth(), proMatchNow.getDate() + 1);
    const proMatchMsUntilMidnight = proMatchTomorrow - proMatchNow;
    const timer = setTimeout(() => {
      setToday(new Date());
    }, proMatchMsUntilMidnight);
    return () => clearTimeout(timer);
  }, [today]);

  const proMatchDayOffsets = [-2, -1, 0, 1, 2];
  const proMatchDaysToRender = proMatchDayOffsets.map((offset) => {
    const d = new Date(today);
    d.setDate(d.getDate() + offset);
    return d;
  });

  const handleProMatchDateChange = (event, selectedProDate) => {
    if (selectedProDate && selectedProDate >= new Date().setHours(0, 0, 0, 0)) {
      setSelectedProMatchDate(selectedProDate);
      setCalendarVisible(false);
      setAddindTaskVisible(true);
    }
  };

  const handleProMatchTimeChange = (input) => {
    let proMatchDigits = input.replace(/[^0-9]/g, '');
    if (proMatchDigits.length > 4) {
      proMatchDigits = proMatchDigits.slice(0, 4);
    }
    if (proMatchDigits.length > 2) {
      proMatchDigits = proMatchDigits.slice(0, 2) + ':' + proMatchDigits.slice(2);
    }
    setTime(proMatchDigits);
  };

  const computeProMatchEndTime = (startTime, duration) => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const proMatchTotalMinutes = startHour * 60 + startMinute + parseInt(duration, 10);
    const proMatchEndHour = Math.floor(proMatchTotalMinutes / 60) % 24;
    const endMinute = proMatchTotalMinutes % 60;
    return `${proMatchEndHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
  };

  const filteredSortedTasks = proMatchTasks
    .filter((task) => {
      const taskDate = new Date(task.date);
      return taskDate.toDateString() === selectedProMatchDate.toDateString();
    })
    .sort((a, b) => {
      if (a.status === b.status) return 0;
      return a.status === 'pending' ? -1 : 1;
    });

  const groupedToDoTasks = proMatchToDoTasks.reduce((groups, task) => {
    const taskDate = new Date(task.date);
    const formattedDate = `${taskDate.getDate()} ${taskDate.toLocaleString('default', { month: 'short' })}`;
    if (!groups[formattedDate]) {
      groups[formattedDate] = [];
    }
    groups[formattedDate].push(task);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedToDoTasks).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateB - dateA;
  });

  return (
    <View style={{
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#000000',
      width: dimensions.width
    }}>
      {selectedScreen === 'Home' ? (
        <SafeAreaView style={{
          width: dimensions.width,
          height: dimensions.height * 0.9,
        }}>
          <View style={{
            marginTop: dimensions.height * 0.021,
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignSelf: 'center',
            width: dimensions.width * 0.93,
          }}>
            {['Schedule', 'To-Do List',].map((category) => (
              <TouchableOpacity
                key={category}
                style={{
                  backgroundColor: selectedProjectCategory === category ? '#EDE72F' : '#343434',
                  width: dimensions.width * 0.4444,
                  borderRadius: dimensions.width * 0.4,
                  alignItems: 'center',
                  paddingVertical: dimensions.height * 0.016,
                }}
                onPress={() => {
                  setSelectedProjectCategory(`${category}`);
                }}
              >
                <Text
                  style={{
                    fontFamily: fontInterRegular,
                    fontSize: dimensions.width * 0.037,
                    color: selectedProjectCategory === category ? 'black' : 'white',
                    fontWeight: 500
                  }}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={{
            textAlign: 'center',
            marginTop: dimensions.height * 0.04,
            alignSelf: 'center',
            fontFamily: fontInterRegular,
            fontSize: dimensions.width * 0.08,
            alignItems: 'center',
            fontWeight: 450,
            color: 'white',
            fontStyle: 'italic',
          }}
          >
            {selectedProjectCategory === 'Schedule' ? 'Schedule' : 'Tasks'}
          </Text>

          {selectedProjectCategory !== 'Schedule' ? (
            <ScrollView showsVerticalScrollIndicator={false} style={{
              alignSelf: 'center',
            }}
              contentContainerStyle={{
                paddingBottom: dimensions.height * 0.15,
              }}
            >
              <View style={{
                marginTop: dimensions.height * 0.03,
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: dimensions.width * 0.89,
                alignItems: 'center',
              }}>
                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Text style={{
                    color: 'white',
                    alignSelf: 'flex-start',
                    fontWeight: 300,
                    fontFamily: fontInterRegular,
                    textAlign: 'left',
                    fontSize: dimensions.width * 0.04,
                  }}
                  >
                    Today
                  </Text>
                  <Text style={{
                    alignSelf: 'flex-start',
                    fontWeight: 500,
                    fontSize: dimensions.width * 0.05,
                    color: 'white',
                    textAlign: 'left',
                    fontFamily: fontInterRegular,
                    marginTop: dimensions.height * 0.003,
                  }}
                  >
                    {`${today.getDate()} ${today.toLocaleString('default', { month: 'short' })}`}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    setToDoVisible((prev) => !prev);
                  }}
                >
                  <Image
                    source={isToDoVisible
                      ? require('../assets/images/closeEditingImage.png')
                      : require('../assets/images/editImage.png')
                    }
                    style={{
                      width: dimensions.height * 0.059,
                      height: dimensions.height * 0.059,
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>

              {isToDoVisible && (
                <View style={{
                  paddingVertical: dimensions.height * 0.022,
                  alignSelf: 'center',
                  paddingHorizontal: dimensions.width * 0.03,
                  marginTop: dimensions.height * 0.03,
                  backgroundColor: '#343434',
                  borderRadius: dimensions.width * 0.0444,
                  width: dimensions.width * 0.89,
                }}>
                  <TextInput
                    placeholder="Task title"
                    placeholderTextColor="#ffffff50"
                    style={{
                      textAlign: 'left',
                      backgroundColor: '#454545',
                      fontSize: dimensions.width * 0.04,
                      paddingHorizontal: dimensions.width * 0.042,
                      fontWeight: 500,
                      fontFamily: fontInterRegular,
                      color: 'white',
                      height: dimensions.height * 0.06,
                      borderRadius: dimensions.width * 0.07,
                    }}
                    value={toDoTaskTitle}
                    onChangeText={setToDoTaskTitle}
                  />

                  <TouchableOpacity
                    disabled={toDoTaskTitle === ''}
                    onPress={() => {
                      saveToDoProMatchTask();
                      setToDoTaskTitle(false);
                    }}
                    style={{
                      marginTop: dimensions.height * 0.02,
                      height: dimensions.height * 0.054,
                      alignItems: 'center',
                      backgroundColor: toDoTaskTitle.length === 0 ? '#A1A1A1' : '#EDE72F',
                      borderRadius: dimensions.width * 0.7,
                      width: dimensions.width * 0.83,
                      justifyContent: 'center',
                      alignSelf: 'center',
                    }}>
                    <Text style={{
                      textAlign: 'center',
                      alignSelf: 'center',
                      fontFamily: fontInterRegular,
                      fontWeight: 400,
                      fontSize: dimensions.width * 0.045,
                      alignItems: 'center',
                      color: '#000',
                    }}
                    >
                      Set
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {!isToDoVisible && (
                <View style={{
                  width: dimensions.width * 0.89,
                  alignSelf: 'center',
                  marginTop: dimensions.height * 0.02,
                }}>
                  {sortedDates.map(dateKey => (
                    <View key={dateKey}>
                      <Text style={{
                        marginTop: dimensions.height * 0.03,
                        fontFamily: fontInterRegular,
                        fontWeight: 500,
                        fontSize: dimensions.width * 0.05,
                        color: 'white',
                        marginBottom: dimensions.height * 0.01,
                        textAlign: 'left',
                      }}>
                        {dateKey}
                      </Text>
                      {groupedToDoTasks[dateKey].map((task, index) => (
                        <Pressable key={task.id} onLongPress={() => {
                          setProMatchTaskToDel(task);
                          setDeleteProTaskModalVisible(true);
                          setTypeOfDeliting('toDo');
                        }}
                          style={{
                            flexDirection: 'row',
                            width: dimensions.width * 0.89,
                            height: dimensions.height * 0.068,
                            justifyContent: 'flex-start',
                            paddingHorizontal: dimensions.width * 0.045,
                            alignItems: 'center',
                            backgroundColor: '#343434',
                            alignSelf: 'center',
                            marginBottom: dimensions.height * 0.013,
                            borderRadius: dimensions.width * 0.7,
                          }}>
                          <TouchableOpacity onPress={() => {
                            const updatedTasks = proMatchToDoTasks.map((t) => {
                              if (t.id === task.id) {
                                return { ...t, status: t.status === 'pending' ? 'done' : 'pending' };
                              }
                              return t;
                            });
                            setProMatchToDoTasks(updatedTasks);
                            AsyncStorage.setItem('proMatchToDoTasks', JSON.stringify(updatedTasks));
                          }}>
                            <Image
                              source={task.status === 'pending'
                                ? require('../assets/icons/whiteRatio.png')
                                : require('../assets/icons/yellowRatio.png')
                              }
                              style={{
                                width: dimensions.width * 0.065,
                                height: dimensions.width * 0.065,
                              }}
                              resizeMode="contain"
                            />
                          </TouchableOpacity>

                          <Text style={{
                            fontFamily: fontInterRegular,
                            maxWidth: dimensions.width * 0.78,
                            fontWeight: 400,
                            textDecorationLine: task.status === 'done' ? 'line-through' : 'none',
                            fontSize: dimensions.width * 0.047,
                            flex: 1,
                            textAlign: 'left',
                            marginLeft: dimensions.width * 0.03,
                            color: task.status === 'pending' ? 'white' : '#EDE72F',
                          }}
                            numberOfLines={1}
                            ellipsizeMode='tail'
                          >
                            {task.title}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} style={{
              alignSelf: 'center',
              height: dimensions.height * 0.7,
            }}
              contentContainerStyle={{
                paddingBottom: dimensions.height * 0.15,
              }}
            >
              <View style={{
                marginTop: dimensions.height * 0.03,
                alignSelf: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                width: dimensions.width * 0.89,
                alignItems: 'center',
              }}>
                <View style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                  <TouchableOpacity
                    onPress={() => {
                      setCalendarVisible((prev) => !prev);
                    }}
                  >
                    <Image
                      source={require('../assets/images/calendarImage.png')}
                      style={{
                        width: dimensions.width * 0.066,
                        height: dimensions.width * 0.066,
                        marginRight: dimensions.width * 0.03,
                      }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>

                  <Text style={{
                    color: 'white',
                    fontWeight: 500,
                    fontSize: dimensions.width * 0.05,
                    alignItems: 'center',
                    fontFamily: fontInterRegular,
                    alignSelf: 'center',
                    textAlign: 'center',
                  }}
                  >
                    Today
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    setAddindTaskVisible((prev) => !prev);
                  }}
                >
                  <Image
                    source={isAddindTaskVisible
                      ? require('../assets/images/closeEditingImage.png')
                      : require('../assets/images/editImage.png')
                    }
                    style={{
                      width: dimensions.height * 0.059,
                      height: dimensions.height * 0.059,
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>

              {isCalendarVisible && (
                <View style={{
                  borderRadius: dimensions.width * 0.0444,
                  alignSelf: 'center',
                  backgroundColor: '#343434',
                  marginTop: dimensions.height * 0.02,
                  width: dimensions.width * 0.89,
                }}>
                  <DateTimePicker
                    value={date || new Date()}
                    mode="date"
                    display="inline"
                    minimumDate={new Date()}
                    onChange={(event, selectedProDate) => {
                      handleProMatchDateChange(event, selectedProDate);
                    }}
                    textColor='white'
                    zIndex={500}
                    dateColor='white'
                    style={{
                      width: dimensions.width * 0.9,
                      fontSize: dimensions.width * 0.03,
                      alignSelf: 'center',
                      fontFamily: fontInterRegular,
                    }}
                    accentColor='#EDE72F'
                    themeVariant='dark'
                  />
                </View>
              )}

              <View style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                alignSelf: 'center',
                marginTop: dimensions.height * 0.02,
                flexDirection: 'row',
                width: dimensions.width * 0.89,
              }}>
                {proMatchDaysToRender.map((day, index) => {
                  const isProMatchSelected = day.getDate() === selectedProMatchDate.getDate() &&
                    day.getMonth() === selectedProMatchDate.getMonth() &&
                    day.getFullYear() === selectedProMatchDate.getFullYear();
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        setSelectedProMatchDate(day);
                        setCalendarVisible(false);
                        setAddindTaskVisible(false);
                      }}
                      style={{
                        backgroundColor: isProMatchSelected ? '#EDE72F' : '#343434',
                        height: dimensions.width * 0.16,
                        justifyContent: 'center',
                        borderRadius: dimensions.width * 0.7,
                        alignItems: 'center',
                        width: dimensions.width * 0.16,
                      }}>
                      <Text style={{
                        textAlign: 'center',
                        color: isProMatchSelected ? 'black' : 'white',
                        fontWeight: '500',
                        fontSize: dimensions.width * 0.04,
                        fontFamily: fontInterRegular,
                      }}>
                        {day.getDate()}
                      </Text>
                      <Text style={{
                        marginTop: dimensions.height * 0.003,
                        fontFamily: fontInterRegular,
                        fontWeight: '500',
                        textAlign: 'center',
                        color: isProMatchSelected ? 'black' : 'white',
                        fontSize: dimensions.width * 0.03,
                      }}>
                        {day.toLocaleDateString('en-US', { weekday: 'short' })}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {!isAddindTaskVisible && !isCalendarVisible && (
                <View style={{
                  width: dimensions.width,
                  alignSelf: 'center',
                  marginTop: dimensions.height * 0.024,
                }}>
                  {filteredSortedTasks.map((task, index) => (
                    <Pressable key={task.id} onLongPress={() => {
                      setProMatchTaskToDel(task);
                      setDeleteProTaskModalVisible(true);
                      setTypeOfDeliting('task');
                    }}
                      style={{
                        paddingVertical: dimensions.height * 0.015,
                        width: dimensions.width * 0.89,
                        marginBottom: dimensions.height * 0.013,
                        height: dimensions.height * 0.08,
                        borderRadius: dimensions.width * 0.7,
                        paddingHorizontal: dimensions.width * 0.045,
                        alignSelf: 'center',
                        backgroundColor: '#343434',
                      }}>
                      <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                        <View style={{
                          flexDirection: 'row',
                          alignItems: 'flex-start',
                          justifyContent: 'center',
                        }}>
                          <TouchableOpacity onPress={() => {
                            const updatedTasks = proMatchTasks.map((t) => {
                              if (t.id === task.id) {
                                return { ...t, status: t.status === 'pending' ? 'done' : 'pending' };
                              }
                              return t;
                            });
                            setProMatchTasks(updatedTasks);
                            AsyncStorage.setItem('proMatchTasks', JSON.stringify(updatedTasks));
                          }}>
                            <Image
                              source={task.status === 'pending'
                                ? require('../assets/icons/whiteRatio.png')
                                : require('../assets/icons/yellowRatio.png')
                              }
                              style={{
                                width: dimensions.width * 0.065,
                                height: dimensions.width * 0.065,
                              }}
                              resizeMode="contain"
                            />
                          </TouchableOpacity>

                          <View style={{ flex: 1, marginLeft: dimensions.width * 0.018 }}>
                            <View style={{
                              alignSelf: 'flex-start',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              flexDirection: 'row',
                            }}>
                              <Text style={{
                                textAlign: 'left',
                                fontFamily: fontInterRegular,
                                fontWeight: 400,
                                fontSize: dimensions.width * 0.047,
                                color: task.status === 'pending' ? 'white' : '#EDE72F',
                                maxWidth: dimensions.width * 0.43,
                                textDecorationLine: task.status === 'done' ? 'line-through' : 'none',
                                flex: 1,
                              }}
                                numberOfLines={1}
                                ellipsizeMode='tail'
                              >
                                {task.title}
                              </Text>

                              <Text style={{
                                textAlign: 'right',
                                textDecorationLine: task.status === 'done' ? 'line-through' : 'none',
                                fontWeight: 400,
                                fontSize: dimensions.width * 0.04,
                                color: task.status === 'pending' ? 'white' : '#EDE72F',
                                fontFamily: fontInterRegular,
                                maxWidth: dimensions.width * 0.5,
                                flex: 1,
                              }}>
                                {task.time} - {computeProMatchEndTime(task.time, task.duration)}
                              </Text>
                            </View>

                            <Text style={{
                              textAlign: 'left',
                              fontFamily: fontInterRegular,
                              fontWeight: 400,
                              fontSize: dimensions.width * 0.04,
                              marginTop: dimensions.height * 0.005,
                              color: '#A1A1A1',
                            }}>
                              {task.duration} min
                            </Text>
                          </View>
                        </View>

                      </View>
                    </Pressable>
                  ))}
                </View>
              )}

              {isAddindTaskVisible && (
                <View style={{
                  paddingHorizontal: dimensions.width * 0.03,
                  alignSelf: 'center',
                  marginTop: dimensions.height * 0.03,
                  paddingVertical: dimensions.height * 0.022,
                  backgroundColor: '#343434',
                  borderRadius: dimensions.width * 0.0444,
                  width: dimensions.width * 0.89,
                }}>
                  <TextInput
                    placeholder="Task Title"
                    placeholderTextColor="#ffffff50"
                    style={{
                      color: 'white',
                      backgroundColor: '#454545',
                      borderRadius: dimensions.width * 0.07,
                      paddingHorizontal: dimensions.width * 0.042,
                      height: dimensions.height * 0.06,
                      fontWeight: 500,
                      fontSize: dimensions.width * 0.04,
                      fontFamily: fontInterRegular,
                      textAlign: 'left',
                    }}
                    value={title}
                    onChangeText={setTitle}
                  />

                  <View style={{
                    borderRadius: dimensions.width * 0.07,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: dimensions.width * 0.042,
                    height: dimensions.height * 0.06,
                    backgroundColor: '#454545',
                    marginTop: dimensions.height * 0.02,
                  }}>
                    <TextInput
                      placeholder="Time (hh:mm)"
                      placeholderTextColor="#ffffff50"
                      keyboardType='numeric'
                      style={{
                        textAlign: 'left',
                        backgroundColor: 'transparent',
                        fontWeight: 500,
                        fontSize: dimensions.width * 0.04,
                        color: 'white',
                        height: dimensions.height * 0.055,
                        alignItems: 'center',
                        fontFamily: fontInterRegular,
                        justifyContent: 'center',
                        maxWidth: dimensions.width * 0.66,
                      }}
                      value={time}
                      onChangeText={handleProMatchTimeChange}
                    />

                    <Image
                      source={require('../assets/images/timeImage.png')}
                      style={{
                        width: dimensions.width * 0.066,
                        height: dimensions.width * 0.066,
                      }}
                      resizeMode="contain"
                    />
                  </View>

                  <View style={{
                    borderRadius: dimensions.width * 0.07,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: dimensions.height * 0.06,
                    
                    paddingHorizontal: dimensions.width * 0.042,
                    marginTop: dimensions.height * 0.02,
                    backgroundColor: '#454545',
                  }}>
                    <TextInput
                      placeholderTextColor="#ffffff50"
                      keyboardType='numeric'
                      maxLength={3}
                      placeholder="Duration"
                      style={{
                        maxWidth: dimensions.width * 0.63,
                        textAlign: 'left',
                        color: 'white',
                        backgroundColor: 'transparent',
                        fontSize: dimensions.width * 0.04,
                        fontWeight: 500,
                        height: dimensions.height * 0.055,
                        fontFamily: fontInterRegular,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      value={duration}
                      onChangeText={setDuration}
                    />

                    <Text style={{
                      color: 'white',
                      fontFamily: fontInterRegular,
                      fontWeight: 500,
                      fontSize: dimensions.width * 0.045,
                      alignItems: 'center',
                      textAlign: 'center',
                      alignSelf: 'center',
                    }}
                    >
                      min
                    </Text>
                  </View>

                  <TouchableOpacity
                    disabled={title === '' || time === '' || duration === '' || time.length < 5}
                    onPress={() => {
                      saveProMatchTask();
                      setAddindTaskVisible(false);
                    }}
                    style={{
                      justifyContent: 'center',
                      height: dimensions.height * 0.054,
                      alignSelf: 'center',
                      width: dimensions.width * 0.83,
                      borderRadius: dimensions.width * 0.7,
                      alignItems: 'center',
                      backgroundColor: title === '' || time === '' || duration === '' || time.length < 5 ? '#A1A1A1' : '#EDE72F',
                      marginTop: dimensions.height * 0.02,
                    }}>
                    <Text style={{
                      textAlign: 'center',
                      fontFamily: fontInterRegular,
                      fontWeight: 400,
                      fontSize: dimensions.width * 0.045,
                      alignItems: 'center',
                      alignSelf: 'center',
                      color: '#000',
                    }}
                    >
                      Set
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          )}
        </SafeAreaView>

      ) : selectedScreen === 'Settings' ? (
        <SettingsScreen setSelectedScreen={setSelectedScreen} isProMatchNotific={isProMatchNotific} setIsProMatchNotific={setIsProMatchNotific}
        />
      ) : selectedScreen === 'Focusing' ? (
        <ProTeamsScreen setSelectedScreen={setSelectedScreen} selectedScreen={selectedScreen} />
      ) : null}

      {selectedScreen !== 'ProjectDetails' && (
        <View
          style={{
            height: dimensions.height * 0.073,
            bottom: dimensions.height * 0.037,
            paddingHorizontal: dimensions.width * 0.01,
            backgroundColor: '#343434',
            alignSelf: 'center',
            width: dimensions.width * 0.73,
            shadowRadius: dimensions.width * 0.03,
            paddingVertical: dimensions.height * 0.03,
            borderRadius: dimensions.width * 0.5,
            
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'absolute',
            zIndex: 5000

          }}
        >
          {homePagesButtons.map((buttn, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedScreen(buttn.screen)}
              style={{
                width: dimensions.height * 0.07,
                alignItems: 'center',
                height: dimensions.height * 0.07,
                justifyContent: 'center',
                marginHorizontal: dimensions.width * 0.001,
                backgroundColor: selectedScreen === buttn.screen ? 'white' : 'transparent',
                borderRadius: dimensions.width * 0.5,
                borderRadius: dimensions.width * 0.5,
              }}
            >
              <Image
                source={selectedScreen === buttn.screen ? buttn.selectedIconImage : buttn.iconImage}
                style={{
                  width: dimensions.height * 0.025,
                  height: dimensions.height * 0.025,
                  textAlign: 'center',
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteProTaskModalVisible}
        onRequestClose={() => {
          setDeleteProTaskModalVisible(!deleteProTaskModalVisible);
        }}
      >
        <View style={{
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          flex: 1,
          alignItems: 'center',
        }}>
          <View style={{
            width: dimensions.width * 0.82,
            paddingTop: dimensions.width * 0.053,
            backgroundColor: '#1f1f1f',
            alignItems: 'center',
            borderRadius: dimensions.width * 0.049,
          }}>
            <Text style={{
              fontWeight: 500,
              marginBottom: dimensions.height * 0.009,
              fontFamily: fontInterRegular,
              paddingHorizontal: dimensions.width * 0.06,
              alignSelf: 'center',
              fontSize: dimensions.width * 0.05,
              color: '#fff',
              textAlign: 'center',
            }}>
              Delete Task
            </Text>

            <Text style={{
              paddingHorizontal: dimensions.width * 0.06,
              color: '#fff',
              marginBottom: dimensions.height * 0.021,
              fontFamily: fontInterRegular,
              fontSize: dimensions.width * 0.04,
              textAlign: 'center',
            }}>
              Are you sure you want to delete this task? This action cannot be undone
            </Text>
            <View style={{
              paddingHorizontal: dimensions.width * 0.03,
              width: dimensions.width * 0.82,
              borderTopWidth: dimensions.width * 0.0019,
              flexDirection: 'row',
              borderTopColor: '#414144',
              justifyContent: 'space-between',
            }}>
              <TouchableOpacity
                style={{
                  paddingVertical: dimensions.height * 0.021,
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  width: '44%',
                }}
                onPress={() => {
                  setDeleteProTaskModalVisible(false);
                }}
              >
                <Text style={{
                  textAlign: 'center',
                  color: '#090814',
                  fontFamily: fontInterRegular,
                  alignSelf: 'center',
                  fontWeight: 400,
                  color: '#fff',
                  fontSize: dimensions.width * 0.046,
                }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <View style={{
                height: '100%',
                borderLeftWidth: dimensions.width * 0.003,
                paddingVertical: dimensions.height * 0.021,
                borderLeftColor: '#414144',
              }} />
              <TouchableOpacity
                style={{
                  paddingVertical: dimensions.height * 0.021,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '44%',
                }}
                onPress={() => {
                  if (typeOfDeliting === 'toDo') {
                    removeToDoTask(proMatchTaskToDel);
                  } else {
                    removeProMatchTask(proMatchTaskToDel);
                  }
                }}
              >
                <Text style={{
                  fontSize: dimensions.width * 0.05,
                  textAlign: 'center',
                  fontFamily: fontInterRegular,
                  alignSelf: 'center',
                  fontWeight: 600,
                  color: '#FF3B30',
                }}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;
