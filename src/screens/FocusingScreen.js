
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState, } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  Modal,
  TextInput,
  Pressable,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
const fontInterRegular = 'Inter18pt-Regular';

const FocusingScreen = ({ selectedScreen }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [searchText, setSearchText] = useState('');
  const [teamName, setTeamName] = useState('');
  const [sportType, setSportType] = useState('');
  const [notes, setNotes] = useState('');

  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState('');
  const [memberNotes, setMemberNotes] = useState('');

  const [proMatchTeams, setProMatchTeams] = useState([]);

  const [selectedTeam, setSelectedTeam] = useState(null);

  const [deleteTeamModalVisible, setDeleteTeamModalVisible] = useState(false);
  const [teamToDel, setTeamToDel] = useState(null);
  const [memberToDel, setMemberToDel] = useState(null);

  const [deleteMemberModalVisible, setDeleteMemberModalVisible] = useState(false);

  const [isTeamVisible, setIsTeamVisible] = useState(false);

  const [addTeamModalVisible, setAddTeamModalVisible] = useState(false);
  const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);

  const saveTeamProMatch = async () => {
    try {
      const exProMatchTeams = await AsyncStorage.getItem('proMatchTeams');
      const proMatchTeams = exProMatchTeams ? JSON.parse(exProMatchTeams) : [];
      const newProMatchTeamId = proMatchTeams.length > 0 ? Math.max(...proMatchTeams.map(task => task.id)) + 1 : 1;

      const proTask = {
        id: newProMatchTeamId,
        title: teamName,
        sportType,
        notes: notes.replace(/\s/g, '').length > 0 ? notes : 'No notes',
        members: [],
      };

      proMatchTeams.unshift(proTask);
      await AsyncStorage.setItem('proMatchTeams', JSON.stringify(proMatchTeams));
      setProMatchTeams(proMatchTeams);

      setTeamName('');
      setSportType('');
      setNotes('');
      setAddTeamModalVisible(false);
    } catch (error) {
      console.error('Error proMatchTeam saving:', error);
    }
  };

  const removeProTeam = async () => {
    try {
      const updatedProMatchTeams = proMatchTeams.filter(team =>
        !(team.id === teamToDel.id)
      );
      await AsyncStorage.setItem('proMatchTeams', JSON.stringify(updatedProMatchTeams));

      setProMatchTeams(updatedProMatchTeams);
      setDeleteTeamModalVisible(false);

    } catch (error) {
      Alert.alert('Error', 'Failed to remove team from proMatchTeams.');
    }
  };

  useEffect(() => {
    const loadProMatchTeams = async () => {
      try {
        const exProMatchTeams = await AsyncStorage.getItem('proMatchTeams');

        if (exProMatchTeams) {
          setProMatchTeams(JSON.parse(exProMatchTeams));
        }
      } catch (error) {
        console.error('Error loading proMatchTeams:', error);
      }
    };

    loadProMatchTeams();
  }, [selectedScreen]);

  const filteredTeams = proMatchTeams.filter(team =>
    team.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const saveMemberToTeam = async () => {
    if (!selectedTeam) return;

    // Get current team members, or use an empty array if none
    const currentMembers = selectedTeam.members || [];
    // Compute new id as max id among current members + 1, or 1 if none exist
    const newMemberId =
      currentMembers.length > 0 ? Math.max(...currentMembers.map(m => m.id || 0)) + 1 : 1;

    const newMember = {
      id: newMemberId,
      name: memberName,
      role: memberRole,
      notes: memberNotes.replace(/\s/g, '').length > 0 ? memberNotes : 'No notes',
    };

    const updatedTeams = proMatchTeams.map(team => {
      if (team.id === selectedTeam.id) {
        return {
          ...team,
          members: [...(team.members || []), newMember],
        };
      }
      return team;
    });

    try {
      await AsyncStorage.setItem('proMatchTeams', JSON.stringify(updatedTeams));
      setProMatchTeams(updatedTeams);

      setSelectedTeam(updatedTeams.find(team => team.id === selectedTeam.id));

      setMemberName('');
      setMemberRole('');
      setMemberNotes('');
      setAddMemberModalVisible(false);
    } catch (error) {
      console.error('Error saving member:', error);
    }
  };

  const removeMemberFromTeam = async () => {
    if (!selectedTeam || !memberToDel) return;

    const updatedMembers = selectedTeam.members.filter(member => member.id !== memberToDel.id);
    const updatedTeams = proMatchTeams.map(team => {
      if (team.id === selectedTeam.id) {
        return {
          ...team,
          members: updatedMembers,
        };
      }
      return team;
    });

    try {
      await AsyncStorage.setItem('proMatchTeams', JSON.stringify(updatedTeams));
      setProMatchTeams(updatedTeams);
      setSelectedTeam(updatedTeams.find(team => team.id === selectedTeam.id));
      setDeleteMemberModalVisible(false);
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };

  return (
    <SafeAreaView style={{
      alignItems: 'center',
      width: dimensions.width,
      position: 'relative',
      flex: 1,
      justifyContent: 'flex-start',
    }} >
      {!isTeamVisible ? (
        <>
          <Text style={{
            textAlign: 'center',
            fontFamily: fontInterRegular,
            fontWeight: 450,
            fontSize: dimensions.width * 0.08,
            alignItems: 'center',
            alignSelf: 'center',
            color: 'white',
            fontStyle: 'italic',
          }}
          >
            My Teams
          </Text>

          <View style={{
            width: dimensions.width * 0.89,
            height: dimensions.height * 0.064,
            borderRadius: dimensions.width * 0.333,
            backgroundColor: '#343434',
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'flex-start',
            flexDirection: 'row',
            marginTop: dimensions.height * 0.02,
            paddingHorizontal: dimensions.width * 0.045,
          }}>
            <Image
              source={require('../assets/images/searchImage.png')}
              style={{
                width: dimensions.width * 0.054,
                height: dimensions.width * 0.054,
                marginRight: dimensions.width * 0.03,
              }}
              resizeMode="contain"
            />

            <TextInput
              placeholder="Search..."
              placeholderTextColor="#ffffff50"
              style={{
                fontFamily: fontInterRegular,
                fontWeight: 500,
                fontSize: dimensions.width * 0.04,
                color: 'white',
                textAlign: 'left',
                maxWidth: dimensions.width * 0.7,
              }}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              setAddTeamModalVisible(true);
            }}
            style={{
              width: dimensions.width * 0.89,
              height: dimensions.height * 0.052,
              alignSelf: 'center',
              backgroundColor: '#EDE72F',
              borderRadius: dimensions.width * 0.7,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: dimensions.height * 0.03,
              marginBottom: dimensions.height * 0.02,
            }}>
            <Text style={{
              textAlign: 'center',
              fontFamily: fontInterRegular,
              fontWeight: 400,
              fontSize: dimensions.width * 0.043,
              alignItems: 'center',
              alignSelf: 'center',
              color: '#000',
            }}
            >
              Create New Team
            </Text>
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false} style={{
            alignSelf: 'center',
          }}
            contentContainerStyle={{
              paddingBottom: dimensions.height * 0.15,
            }}
          >
            {filteredTeams.map((team, index) => (
              <TouchableOpacity key={team.id}
                onLongPress={() => {
                  setTeamToDel(team);
                  setDeleteTeamModalVisible(true);
                }}
                onPress={() => {
                  setSelectedTeam(team);
                  setIsTeamVisible(true);
                }}
                style={{
                  backgroundColor: '#343434',
                  width: dimensions.width * 0.89,
                  height: dimensions.height * 0.068,
                  borderRadius: dimensions.width * 0.7,
                  paddingHorizontal: dimensions.width * 0.045,
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  alignSelf: 'center',
                  marginBottom: dimensions.height * 0.013,
                  paddingVertical: dimensions.height * 0.01,
                }}>
                <Text style={{
                  textAlign: 'left',
                  fontFamily: fontInterRegular,
                  fontWeight: 400,
                  fontSize: dimensions.width * 0.043,
                  alignSelf: 'center',
                  alignSelf: 'flex-start',
                  color: '#fff',
                }}
                >
                  {team.title} - {team.sportType}
                </Text>

                <Text style={{
                  textAlign: 'left',
                  fontFamily: fontInterRegular,
                  fontWeight: 400,
                  fontSize: dimensions.width * 0.034,
                  alignSelf: 'center',
                  alignSelf: 'flex-start',
                  color: '#A1A1A1',
                }}
                >
                  {team.notes}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      ) : (
        <>
          <View style={{
            width: dimensions.width * 0.89,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
            <TouchableOpacity onPress={() => {
              setIsTeamVisible(false);
            }}>
              <Image
                source={require('../assets/images/leftChevronImage.png')}
                style={{
                  width: dimensions.height * 0.075,
                  height: dimensions.height * 0.075,
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <View style={{
              marginLeft: dimensions.width * 0.03,
            }}>
              <Text style={{
                textAlign: 'center',
                fontFamily: fontInterRegular,
                fontWeight: 450,
                fontSize: dimensions.width * 0.08,
                alignItems: 'center',
                alignSelf: 'center',
                color: 'white',
                fontStyle: 'italic',
              }}
              >
                {selectedTeam.title}
              </Text>

              <Text style={{
                textAlign: 'center',
                fontFamily: fontInterRegular,
                fontWeight: 450,
                fontSize: dimensions.width * 0.048,
                alignItems: 'center',
                alignSelf: 'center',
                color: 'white',
              }}
              >
                {selectedTeam.sportType}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              setAddMemberModalVisible(true);
            }}
            style={{
              backgroundColor: '#EDE72F',
              marginBottom: dimensions.height * 0.02,
              height: dimensions.height * 0.052,
              alignSelf: 'center',
              borderRadius: dimensions.width * 0.7,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: dimensions.height * 0.03,
              width: dimensions.width * 0.89,
            }}>
            <Text style={{
              alignSelf: 'center',
              fontWeight: 400,
              fontSize: dimensions.width * 0.043,
              alignItems: 'center',
              textAlign: 'center',
              fontFamily: fontInterRegular,
              color: '#000',
            }}
            >
              Add Member to Team
            </Text>
          </TouchableOpacity>
 
          {selectedTeam.members.length > 0 && (
            selectedTeam.members.map((member, index) => (
              <Pressable key={member.id}
                onLongPress={() => {
                  setMemberToDel(member);
                  setDeleteMemberModalVisible(true);
                }}
                style={{
                  backgroundColor: '#343434',
                  width: dimensions.width * 0.89,
                  height: dimensions.height * 0.068,
                  borderRadius: dimensions.width * 0.7,
                  paddingHorizontal: dimensions.width * 0.045,
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  alignSelf: 'center',
                  marginBottom: dimensions.height * 0.013,
                  paddingVertical: dimensions.height * 0.01,
                }}>
                <Text style={{
                  textAlign: 'left',
                  fontFamily: fontInterRegular,
                  fontWeight: 400,
                  fontSize: dimensions.width * 0.043,
                  alignSelf: 'center',
                  alignSelf: 'flex-start',
                  color: '#fff',
                }}
                >
                  {member.name} - {member.role}
                </Text>

                <Text style={{
                  textAlign: 'left',
                  fontFamily: fontInterRegular,
                  fontWeight: 400,
                  fontSize: dimensions.width * 0.034,
                  alignSelf: 'center',
                  alignSelf: 'flex-start',
                  color: '#A1A1A1',
                }}
                >
                  {member.notes}
                </Text>
              </Pressable>
            ))

          )}
        </>
      )}


      <Modal visible={addMemberModalVisible} transparent={true} animationType="slide">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <SafeAreaView
            style={{
              paddingHorizontal: dimensions.width * 0.05,
              alignSelf: 'center',
              width: '100%',
              alignItems: 'center',
              width: dimensions.width,
              backgroundColor: '#000000',
              height: dimensions.height,
              zIndex: 1000,
            }}
          >
            <View style={{
              width: dimensions.width * 0.89,
              alignSelf: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Text style={{
                textAlign: 'center',
                fontFamily: fontInterRegular,
                fontWeight: 450,
                fontSize: dimensions.width * 0.08,
                alignItems: 'center',
                alignSelf: 'center',
                color: 'white',
                fontStyle: 'italic',
              }}
              >
                Add member
              </Text>

              <TouchableOpacity onPress={() => {
                setAddMemberModalVisible(false);
                setMemberName('');
                setMemberRole('');
                setMemberNotes('');
              }}>
                <Image
                  source={require('../assets/images/closeImage.png')}
                  style={{
                    width: dimensions.height * 0.075,
                    height: dimensions.height * 0.075,

                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            <View style={{
              width: dimensions.width * 0.9,
              alignSelf: 'center',
              marginTop: dimensions.height * 0.03,
            }}>
              <TextInput
                placeholder="Member Name"
                maxLength={30}
                placeholderTextColor="#ffffff80"
                style={{
                  fontFamily: fontInterRegular,
                  backgroundColor: '#454545',
                  borderRadius: dimensions.width * 0.07,
                  paddingHorizontal: dimensions.width * 0.042,
                  fontWeight: 400,
                  fontSize: dimensions.width * 0.04,
                  color: 'white',
                  height: dimensions.height * 0.06,
                  textAlign: 'left',
                }}
                value={memberName}
                onChangeText={setMemberName}
              />

              <TextInput
                placeholder="Role/Position"
                maxLength={30}
                placeholderTextColor="#ffffff80"
                style={{
                  fontFamily: fontInterRegular,
                  backgroundColor: '#454545',
                  borderRadius: dimensions.width * 0.07,
                  paddingHorizontal: dimensions.width * 0.042,
                  fontWeight: 400,
                  fontSize: dimensions.width * 0.04,
                  color: 'white',
                  height: dimensions.height * 0.06,
                  textAlign: 'left',
                  marginTop: dimensions.height * 0.015,
                }}
                value={memberRole}
                onChangeText={setMemberRole}
              />

              <TextInput
                placeholder="Notes (optional)"
                maxLength={100}
                placeholderTextColor="#ffffff80"
                style={{
                  fontFamily: fontInterRegular,
                  backgroundColor: '#454545',
                  borderRadius: dimensions.width * 0.07,
                  paddingHorizontal: dimensions.width * 0.042,
                  fontWeight: 400,
                  fontSize: dimensions.width * 0.04,
                  color: 'white',
                  height: dimensions.height * 0.06,
                  textAlign: 'left',
                  marginTop: dimensions.height * 0.015,
                  height: dimensions.height * 0.15,
                  textAlignVertical: 'top',
                  paddingVertical: dimensions.height * 0.015,
                }}
                value={notes}
                multiline={true}
                onChangeText={setNotes}
              />
            </View>

            <TouchableOpacity
              disabled={memberName.replace(/\s/g, '').length === 0 || memberRole.replace(/\s/g, '').length === 0}
              onPress={() => {
                saveMemberToTeam();
              }}
              style={{
                width: dimensions.width * 0.89,
                position: 'absolute',
                bottom: dimensions.height * 0.05,
                height: dimensions.height * 0.052,
                alignSelf: 'center',
                backgroundColor: memberName.replace(/\s/g, '').length === 0 || memberRole.replace(/\s/g, '').length === 0 ? '#A1A1A1' : '#EDE72F',
                borderRadius: dimensions.width * 0.7,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: dimensions.height * 0.03,
              }}>
              <Text style={{
                textAlign: 'center',
                fontFamily: fontInterRegular,
                fontWeight: 400,
                fontSize: dimensions.width * 0.043,
                alignItems: 'center',
                alignSelf: 'center',
                color: '#000',
              }}
              >
                Create
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal visible={addTeamModalVisible} transparent={true} animationType="slide">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <SafeAreaView
            style={{
              paddingHorizontal: dimensions.width * 0.05,
              alignSelf: 'center',
              width: '100%',
              alignItems: 'center',
              width: dimensions.width,
              backgroundColor: '#000000',
              height: dimensions.height,
              zIndex: 1000,
            }}
          >
            <View style={{
              width: dimensions.width * 0.89,
              alignSelf: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Text style={{
                textAlign: 'center',
                fontFamily: fontInterRegular,
                fontWeight: 450,
                fontSize: dimensions.width * 0.08,
                alignItems: 'center',
                alignSelf: 'center',
                color: 'white',
                fontStyle: 'italic',
              }}
              >
                New Teams
              </Text>

              <TouchableOpacity onPress={() => {
                setAddTeamModalVisible(false);
                setTeamName('');
                setSportType('');
                setNotes('');
              }}>
                <Image
                  source={require('../assets/images/closeImage.png')}
                  style={{
                    width: dimensions.height * 0.075,
                    height: dimensions.height * 0.075,

                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            <View style={{
              width: dimensions.width * 0.9,
              alignSelf: 'center',
              marginTop: dimensions.height * 0.03,
            }}>
              <TextInput
                placeholder="Team Name"
                maxLength={30}
                placeholderTextColor="#ffffff80"
                style={{
                  fontFamily: fontInterRegular,
                  backgroundColor: '#454545',
                  borderRadius: dimensions.width * 0.07,
                  paddingHorizontal: dimensions.width * 0.042,
                  fontWeight: 400,
                  fontSize: dimensions.width * 0.04,
                  color: 'white',
                  height: dimensions.height * 0.06,
                  textAlign: 'left',
                }}
                value={teamName}
                onChangeText={setTeamName}
              />

              <TextInput
                placeholder="Sport Type"
                maxLength={30}
                placeholderTextColor="#ffffff80"
                style={{
                  fontFamily: fontInterRegular,
                  backgroundColor: '#454545',
                  borderRadius: dimensions.width * 0.07,
                  paddingHorizontal: dimensions.width * 0.042,
                  fontWeight: 400,
                  fontSize: dimensions.width * 0.04,
                  color: 'white',
                  height: dimensions.height * 0.06,
                  textAlign: 'left',
                  marginTop: dimensions.height * 0.015,
                }}
                value={sportType}
                onChangeText={setSportType}
              />

              <TextInput
                placeholder="Notes (optional)"
                maxLength={30}
                placeholderTextColor="#ffffff80"
                style={{
                  fontFamily: fontInterRegular,
                  backgroundColor: '#454545',
                  borderRadius: dimensions.width * 0.07,
                  paddingHorizontal: dimensions.width * 0.042,
                  fontWeight: 400,
                  fontSize: dimensions.width * 0.04,
                  color: 'white',
                  height: dimensions.height * 0.06,
                  textAlign: 'left',
                  marginTop: dimensions.height * 0.015,
                }}
                value={notes}
                onChangeText={setNotes}
              />
            </View>

            <TouchableOpacity
              disabled={teamName.replace(/\s/g, '').length === 0 || sportType.replace(/\s/g, '').length === 0}
              onPress={() => {
                saveTeamProMatch();
              }}
              style={{
                width: dimensions.width * 0.89,
                position: 'absolute',
                bottom: dimensions.height * 0.05,
                height: dimensions.height * 0.052,
                alignSelf: 'center',
                backgroundColor: teamName.replace(/\s/g, '').length === 0 || sportType.replace(/\s/g, '').length === 0 ? '#A1A1A1' : '#EDE72F',
                borderRadius: dimensions.width * 0.7,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: dimensions.height * 0.03,
              }}>
              <Text style={{
                textAlign: 'center',
                fontFamily: fontInterRegular,
                fontWeight: 400,
                fontSize: dimensions.width * 0.043,
                alignItems: 'center',
                alignSelf: 'center',
                color: '#000',
              }}
              >
                Create
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteTeamModalVisible}
        onRequestClose={() => {
          setDeleteTeamModalVisible(!deleteTeamModalVisible);
        }}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <View style={{
            width: dimensions.width * 0.82,
            borderRadius: dimensions.width * 0.049,
            paddingTop: dimensions.width * 0.053,
            alignItems: 'center',
            backgroundColor: '#1f1f1f',
          }}>
            <Text style={{
              alignSelf: 'center',
              marginBottom: dimensions.height * 0.009,
              textAlign: 'center',
              fontFamily: fontInterRegular,
              paddingHorizontal: dimensions.width * 0.06,
              fontWeight: 500,
              fontSize: dimensions.width * 0.05,
              color: '#fff',
            }}>
              Delete Team
            </Text>

            <Text style={{
              paddingHorizontal: dimensions.width * 0.06,
              textAlign: 'center',
              fontFamily: fontInterRegular,
              fontSize: dimensions.width * 0.04,
              color: '#fff',
              marginBottom: dimensions.height * 0.021,
            }}>
              Are you sure you want to delete this team? All associated members will be removed.
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
                  width: '44%',
                  justifyContent: 'center',
                  paddingVertical: dimensions.height * 0.021,
                  alignSelf: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  setDeleteTeamModalVisible(false);
                }}
              >
                <Text style={{
                  fontFamily: fontInterRegular,
                  color: '#090814',
                  color: '#fff',
                  alignSelf: 'center',
                  fontWeight: 400,
                  fontSize: dimensions.width * 0.046,
                  textAlign: 'center',
                }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <View style={{
                borderLeftColor: '#414144',
                borderLeftWidth: dimensions.width * 0.003,
                paddingVertical: dimensions.height * 0.021,
                height: '100%',
              }} />
              <TouchableOpacity
                style={{
                  width: '44%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: dimensions.height * 0.021,
                }}
                onPress={() => {
                  removeProTeam();
                }}
              >
                <Text style={{
                  color: '#FF3B30',
                  fontFamily: fontInterRegular,
                  alignSelf: 'center',
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: dimensions.width * 0.05,
                }}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteMemberModalVisible}
        onRequestClose={() => {
          setDeleteMemberModalVisible(!deleteMemberModalVisible);
        }}
      >
        <View style={{
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          flex: 1,
          alignItems: 'center',
        }}>
          <View style={{
            borderRadius: dimensions.width * 0.049,
            backgroundColor: '#1f1f1f',
            paddingTop: dimensions.width * 0.053,
            alignItems: 'center',
            width: dimensions.width * 0.82,
          }}>
            <Text style={{
              paddingHorizontal: dimensions.width * 0.06,
              textAlign: 'center',
              fontFamily: fontInterRegular,
              alignSelf: 'center',
              fontWeight: 500,
              fontSize: dimensions.width * 0.05,
              color: '#fff',
              marginBottom: dimensions.height * 0.009,
            }}>
              Remove Member
            </Text>

            <Text style={{
              paddingHorizontal: dimensions.width * 0.06,
              textAlign: 'center',
              fontFamily: fontInterRegular,
              fontSize: dimensions.width * 0.04,
              color: '#fff',
              marginBottom: dimensions.height * 0.021,
            }}>
              Are you sure you want to remove this member from the team?
            </Text>
            <View style={{
              borderTopColor: '#414144',
              paddingHorizontal: dimensions.width * 0.03,
              justifyContent: 'space-between',
              borderTopWidth: dimensions.width * 0.0019,
              flexDirection: 'row',
              width: dimensions.width * 0.82,
            }}>
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: dimensions.height * 0.021,
                  width: '44%',
                  alignSelf: 'center',
                }}
                onPress={() => {
                  setDeleteMemberModalVisible(false);
                }}
              >
                <Text style={{
                  fontFamily: fontInterRegular,
                  color: '#090814',
                  textAlign: 'center',
                  alignSelf: 'center',
                  fontWeight: 400,
                  fontSize: dimensions.width * 0.046,
                  color: '#fff',
                }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <View style={{
                borderLeftColor: '#414144',
                borderLeftWidth: dimensions.width * 0.003,
                paddingVertical: dimensions.height * 0.021,
                height: '100%',
              }} />
              <TouchableOpacity
                style={{
                  width: '44%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: dimensions.height * 0.021,
                }}
                onPress={() => {
                  removeMemberFromTeam();
                }}
              >
                <Text style={{
                  color: '#FF3B30',
                  fontFamily: fontInterRegular,
                  alignSelf: 'center',
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: dimensions.width * 0.05,
                }}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default FocusingScreen;
