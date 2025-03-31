import React, { useEffect, useState } from 'react';
import { View, Image, Dimensions,} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoadingProScreen = () => {
  const navigation = useNavigation();
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Home');
    }, 1900)
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative', }}>
      <Image
        source={require('../assets/images/loaderImage.png')}
        resizeMode='cover'
        style={{
          width: dimensions.width,
          height: dimensions.height,
          position: 'absolute',
          top: 0,
          zIndex: 1,
        }}
      />

      <View style={{
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        position: 'absolute',
        zIndex: 2,
        width: dimensions.width,
        height: dimensions.height,
      }}>
      </View>

      <Image
        source={require('../assets/images/onbProTextImage.png')}
        resizeMode='contain'
        style={{
          width: dimensions.width * 0.74,
          height: dimensions.height * 0.25,
          zIndex: 3,
        }}
      />
    </View>
  );
};

export default LoadingProScreen;