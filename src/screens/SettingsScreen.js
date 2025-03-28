import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    SafeAreaView,
    Linking,
    Switch,
    Share,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const promatchLink = 'https://google.com';

const fontInterRegular = 'Inter18pt-Regular';


const privAndTerBttns = [
    {
        id: 2,
        title: 'Privacy Policy',
        link: 'https://www.termsfeed.com/live/c0dabc43-7705-4704-98bb-d14b6ec4be2a',
    },
    {
        id: 1,
        title: 'Terms of Use',
        link: 'https://www.termsfeed.com/live/8c6b9844-037b-45c7-8508-1cabd5f8aa9e',
    },


]

const SettingsScreen = ({ isProMatchNotific, setIsProMatchNotific }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));

    const toggleProMatchNotiSwitch = () => {
        const newNotiVal = !isProMatchNotific;
        setIsProMatchNotific(newNotiVal);
        saveProMatchNotifi('isProMatchNotific', newNotiVal);
    };
    const saveProMatchNotifi = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("Error promatch notific saving:", error);
        }
    };

    const shareProMatchAppTo = async () => {
        try {
            await Share.share({
                message: `Download Build Your ProMatch Collection! \n${promatchLink}`,
            });
        } catch (error) {
            console.error('Error share ProMatch app:', error);
        }
    };

    return (
        <SafeAreaView style={{
            flex: 1,
            width: dimensions.width,
        }} >
            <Text style={{
                fontStyle: 'italic',
                fontFamily: fontInterRegular,
                color: 'white',
                fontWeight: 450,
                fontSize: dimensions.width * 0.08,
                alignItems: 'center',
                alignSelf: 'center',
                textAlign: 'center',

            }}
            >
                Settings
            </Text>

            <TouchableOpacity
                onPress={() => {
                }}
                style={{
                    backgroundColor: '#343434',
                    width: dimensions.width * 0.89,
                    height: dimensions.height * 0.064,
                    borderRadius: dimensions.width * 0.3,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    paddingHorizontal: dimensions.width * 0.045,
                    marginTop: dimensions.height * 0.013,
                    alignSelf: 'center',
                }}
            >
                <Text style={{
                    fontWeight: 400,
                    fontFamily: fontInterRegular,
                    color: '#fff',
                    fontSize: dimensions.width * 0.042,
                    textAlign: 'left',
                }}>
                    Notifications
                </Text>

                <Switch
                    trackColor={{ false: '#948ea0', true: '#EDE72F' }}
                    thumbColor={'#fff'}
                    ios_backgroundColor="#353535"
                    onValueChange={toggleProMatchNotiSwitch}
                    value={isProMatchNotific}
                />

            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    shareProMatchAppTo();
                }}
                style={{
                    backgroundColor: '#343434',
                    width: dimensions.width * 0.89,
                    height: dimensions.height * 0.064,
                    borderRadius: dimensions.width * 0.3,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    paddingHorizontal: dimensions.width * 0.045,
                    marginTop: dimensions.height * 0.013,
                    alignSelf: 'center',
                }}
            >
                <Text style={{
                    fontWeight: 400,
                    fontFamily: fontInterRegular,
                    color: '#fff',
                    fontSize: dimensions.width * 0.042,
                    textAlign: 'left',
                }}>
                    Share the app
                </Text>

                <Image
                    source={require('../assets/icons/shareMatchIcon.png')}
                    style={{
                        width: dimensions.width * 0.06,
                        height: dimensions.width * 0.06,
                    }}
                    resizeMode='contain'
                />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    Linking.openURL(promatchLink);
                }}
                style={{
                    backgroundColor: '#343434',
                    width: dimensions.width * 0.89,
                    height: dimensions.height * 0.064,
                    borderRadius: dimensions.width * 0.3,
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    paddingHorizontal: dimensions.width * 0.045,
                    marginTop: dimensions.height * 0.013,
                    alignSelf: 'center',
                }}
            >
                <Text style={{
                    fontWeight: 400,
                    fontFamily: fontInterRegular,
                    color: '#fff',
                    fontSize: dimensions.width * 0.042,
                    textAlign: 'left',
                }}>
                    Rate the app
                </Text>
            </TouchableOpacity>

            <View style={{
                width: dimensions.width * 0.89,
                alignSelf: 'center',
            }}>
                {privAndTerBttns.map((button) => (
                    <TouchableOpacity
                        key={button.id}
                        onPress={() => {
                            Linking.openURL(button.link);
                        }}
                        style={{
                            backgroundColor: '#343434',
                            width: dimensions.width * 0.89,
                            height: dimensions.height * 0.064,
                            borderRadius: dimensions.width * 0.3,
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            paddingHorizontal: dimensions.width * 0.045,
                            marginTop: dimensions.height * 0.013,
                        }}
                    >
                        <Text style={{
                            fontWeight: 400,
                            fontFamily: fontInterRegular,
                            color: '#fff',
                            fontSize: dimensions.width * 0.042,
                            textAlign: 'left',
                        }}>
                            {button.title}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </SafeAreaView>
    );
};

export default SettingsScreen;
