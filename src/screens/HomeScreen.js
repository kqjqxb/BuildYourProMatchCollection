import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';


import FocusingScreen from './FocusingScreen';
import ProjectDetailsScreen from './ProjectDetailsScreen';
import SettingsScreen from './SettingsScreen';

import AnalysisScreen from './AnalysisScreen';


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
  const [selectedProject, setSelectedProject] = useState(null);

  const [isAddindTaskVisible, setAddindTaskVisible] = useState(false);
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [today, setToday] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('');

  const [projects, setProjects] = useState([]);

  const [isProMatchNotific, setIsProMatchNotific] = useState(true);

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


  const removeProject = async (projectToRemove) => {
    try {
      const updatedProjects = projects.filter(proj =>
        !(proj.id === projectToRemove.id)
      );
      await AsyncStorage.setItem('projects', JSON.stringify(updatedProjects));
      setProjects(updatedProjects);
    } catch (error) {
      Alert.alert('Error', 'Failed to remove project from projects.');
    }
  };

  const saveProject = async () => {
    try {
      const existingProjects = await AsyncStorage.getItem('projects');
      const projects = existingProjects ? JSON.parse(existingProjects) : [];
      const newId = projects.length > 0 ? Math.max(...projects.map(project => project.id)) + 1 : 1;

      const project = {
        id: newId,
        title,
        description,
        deadline,
        status,
        complexity,
        executors,
      };

      projects.push(project);
      await AsyncStorage.setItem('projects', JSON.stringify(projects));
      setProjects(projects);
      setTitle('');
      setDescription('');
      setDeadline('');
      setStatus('Choose');
      setComplexity('');
      setExecutors([]);
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const existingProjects = await AsyncStorage.getItem('projects');
        if (existingProjects) {
          setProjects(JSON.parse(existingProjects));
        }
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    };

    loadProjects();
  }, [selectedScreen]);

  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const msUntilMidnight = tomorrow - now;
    const timer = setTimeout(() => {
      setToday(new Date());
    }, msUntilMidnight);
    return () => clearTimeout(timer);
  }, [today]);

  // Compute the days from "today" (stays constant until midnight)
  const dayOffsets = [-2, -1, 0, 1, 2];
  const daysToRender = dayOffsets.map((offset) => {
    const d = new Date(today);
    d.setDate(d.getDate() + offset);
    return d;
  });

  const handleProMatchDateChange = (event, selectedProDate) => {
    if (selectedProDate && selectedProDate >= new Date().setHours(0, 0, 0, 0)) {
      setSelectedDate(selectedProDate);
      setCalendarVisible(false);
      setAddindTaskVisible(true);
    }
  };

  const handleTimeChange = (input) => {
    // Remove non-digit characters
    let digits = input.replace(/[^0-9]/g, '');
    // Limit to 4 digits maximum (HHMM)
    if (digits.length > 4) {
      digits = digits.slice(0, 4);
    }
    // Automatically add colon after two digits (if applicable)
    if (digits.length > 2) {
      digits = digits.slice(0, 2) + ':' + digits.slice(2);
    }
    setTime(digits);
  };

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
            justifyContent: 'space-between',
            flexDirection: 'row',
            width: dimensions.width * 0.93,
            alignSelf: 'center',
            marginTop: dimensions.height * 0.021,
          }}>
            {['Schedule', 'To-Do List',].map((category) => (
              <TouchableOpacity
                key={category}
                style={{
                  paddingVertical: dimensions.height * 0.016,
                  width: dimensions.width * 0.4444,
                  alignItems: 'center',
                  borderRadius: dimensions.width * 0.4,
                  backgroundColor: selectedProjectCategory === category ? '#EDE72F' : '#343434',
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
            fontFamily: fontInterRegular,
            fontWeight: 450,
            fontSize: dimensions.width * 0.08,
            alignItems: 'center',
            alignSelf: 'center',
            color: 'white',
            fontStyle: 'italic',
            marginTop: dimensions.height * 0.04,
          }}
          >
            Schedule
          </Text>

          <View style={{
            width: dimensions.width * 0.89,
            alignSelf: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: dimensions.height * 0.03,
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
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
                textAlign: 'center',
                fontFamily: fontInterRegular,
                fontWeight: 500,
                fontSize: dimensions.width * 0.05,
                alignItems: 'center',
                alignSelf: 'center',
                color: 'white',
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
                source={require('../assets/images/editImage.png')}
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
              width: dimensions.width * 0.89,
              alignSelf: 'center',
              marginTop: dimensions.height * 0.02,
              backgroundColor: '#343434',
              borderRadius: dimensions.width * 0.0444,
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
            width: dimensions.width * 0.89,
            alignSelf: 'center',
            marginTop: dimensions.height * 0.02,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            {daysToRender.map((day, index) => {
              const isProMatchSelected = day.getDate() === selectedDate.getDate() &&
                day.getMonth() === selectedDate.getMonth() &&
                day.getFullYear() === selectedDate.getFullYear();
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedDate(day)}
                  style={{
                    width: dimensions.width * 0.16,
                    height: dimensions.width * 0.16,
                    borderRadius: dimensions.width * 0.7,
                    backgroundColor: isProMatchSelected ? '#EDE72F' : '#343434',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{
                    textAlign: 'center',
                    fontFamily: fontInterRegular,
                    fontWeight: '500',
                    fontSize: dimensions.width * 0.04,
                    color: isProMatchSelected ? 'black' : 'white',
                  }}>
                    {day.getDate()}
                  </Text>
                  <Text style={{
                    textAlign: 'center',
                    fontFamily: fontInterRegular,
                    fontWeight: '500',
                    fontSize: dimensions.width * 0.03,
                    marginTop: dimensions.height * 0.003,
                    color: isProMatchSelected ? 'black' : 'white',
                  }}>
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {isAddindTaskVisible && (
            <View style={{
              width: dimensions.width * 0.89,
              alignSelf: 'center',
              marginTop: dimensions.height * 0.03,
              backgroundColor: '#343434',
              borderRadius: dimensions.width * 0.0444,
              paddingHorizontal: dimensions.width * 0.03,
              paddingVertical: dimensions.height * 0.022,
            }}>
              <TextInput
                placeholder="Task Title"
                placeholderTextColor="#ffffff50"
                style={{
                  fontFamily: fontInterRegular,
                  backgroundColor: '#454545',
                  borderRadius: dimensions.width * 0.07,
                  paddingHorizontal: dimensions.width * 0.042,
                  fontWeight: 500,
                  fontSize: dimensions.width * 0.04,
                  color: 'white',
                  height: dimensions.height * 0.06,
                  textAlign: 'left',
                }}
                value={title}
                onChangeText={setTitle}
              />

              <View style={{
                marginTop: dimensions.height * 0.02,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: dimensions.width * 0.042,
                height: dimensions.height * 0.06,
                backgroundColor: '#454545',
                borderRadius: dimensions.width * 0.07,
              }}>
                <TextInput
                  placeholder="Time"
                  placeholderTextColor="#ffffff50"
                  style={{
                    fontFamily: fontInterRegular,
                    backgroundColor: 'transparent',
                    fontWeight: 500,
                    fontSize: dimensions.width * 0.04,
                    color: 'white',
                    height: dimensions.height * 0.055,
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'left',
                    maxWidth: dimensions.width * 0.66,
                  }}
                  value={time}
                  onChangeText={handleTimeChange}
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
                marginTop: dimensions.height * 0.02,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: dimensions.width * 0.042,
                height: dimensions.height * 0.06,
                backgroundColor: '#454545',
                borderRadius: dimensions.width * 0.07,
              }}>
                <TextInput
                  keyboardType='numeric'
                  maxLength={3}
                  placeholder="Duration"
                  placeholderTextColor="#ffffff50"
                  style={{
                    fontFamily: fontInterRegular,
                    backgroundColor: 'transparent',
                    fontWeight: 500,
                    fontSize: dimensions.width * 0.04,
                    color: 'white',
                    height: dimensions.height * 0.055,
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'left',
                    maxWidth: dimensions.width * 0.63,
                  }}
                  value={duration}
                  onChangeText={setDuration}
                />

                <Text style={{
                  textAlign: 'center',
                  fontFamily: fontInterRegular,
                  fontWeight: 500,
                  fontSize: dimensions.width * 0.045,
                  alignItems: 'center',
                  alignSelf: 'center',
                  color: 'white',
                }}
                >
                  min
                </Text>
              </View>

              <TouchableOpacity
                disabled={title === '' || time === '' || duration === ''}
                onPress={() => {
                  saveProject();
                  setAddindTaskVisible(false);
                }}
                style={{
                  width: dimensions.width * 0.83,
                  height: dimensions.height * 0.054,
                  alignSelf: 'center',
                  backgroundColor: title === '' || time === '' || duration === '' ? '#A1A1A1' : '#EDE72F',
                  borderRadius: dimensions.width * 0.7,
                  alignItems: 'center',
                  justifyContent: 'center',
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
        </SafeAreaView>
      ) : selectedScreen === 'Settings' ? (
        <SettingsScreen setSelectedScreen={setSelectedScreen} isProMatchNotific={isProMatchNotific} setIsProMatchNotific={setIsProMatchNotific}
        />
      ) : selectedScreen === 'ProjectDetails' ? (
        <ProjectDetailsScreen setSelectedScreen={setSelectedScreen} selectedScreen={selectedScreen}
          selectedProject={selectedProject} setSelectedProject={setSelectedProject}
        />
      ) : selectedScreen === 'Focusing' ? (
        <FocusingScreen setSelectedScreen={setSelectedScreen} selectedScreen={selectedScreen} />
      ) : selectedScreen === 'Analysis' ? (
        <AnalysisScreen setSelectedScreen={setSelectedScreen} selectedScreen={selectedScreen} />
      ) : null}

      {selectedScreen !== 'ProjectDetails' && (
        <View
          style={{
            position: 'absolute',
            bottom: dimensions.height * 0.037,
            paddingHorizontal: dimensions.width * 0.01,
            backgroundColor: '#343434',
            shadowRadius: dimensions.width * 0.03,
            width: dimensions.width * 0.73,
            height: dimensions.height * 0.073,
            paddingVertical: dimensions.height * 0.03,
            borderRadius: dimensions.width * 0.5,

            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            alignSelf: 'center',
            zIndex: 5000

          }}
        >
          {homePagesButtons.map((buttn, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedScreen(buttn.screen)}
              style={{
                borderRadius: dimensions.width * 0.5,
                alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: dimensions.width * 0.001,
                backgroundColor: selectedScreen === buttn.screen ? 'white' : 'transparent',
                borderRadius: dimensions.width * 0.5,
                width: dimensions.height * 0.07,
                height: dimensions.height * 0.07,
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
    </View>
  );
};

export default HomeScreen;
