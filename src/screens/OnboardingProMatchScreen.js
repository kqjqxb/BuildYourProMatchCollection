import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, Animated, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import proOnboardingMatchData from '../components/proOnboardingMatchData';
import { useNavigation } from '@react-navigation/native';

const fontInterRegular = 'Inter18pt-Regular';

const OnboardingProMatchScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const navigation = useNavigation();
  const [currentProMatchSlideIndex, setCurrentProMatchSlideIndex] = useState(0);
  const proMatchScrollX = useRef(new Animated.Value(0)).current;
  const proSlidesMatchRef = useRef(null);

  useEffect(() => {
    const onChange = ({ window }) => {
      setDimensions(window);
    };
    const dimensionListener = Dimensions.addEventListener('change', onChange);
    return () => {
      dimensionListener.remove();
    };
  }, []);

  const viewableProMatchItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentProMatchSlideIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollToTheNextProMatchSlide = () => {
    if (currentProMatchSlideIndex < proOnboardingMatchData.length - 1) {
      proSlidesMatchRef.current.scrollToIndex({ index: currentProMatchSlideIndex + 1 });
    } else {
      navigation.replace('Home');
    }
  };

  const renderProMatchItem = ({ item }) => (
    <View style={{
      justifyContent: 'space-between',
      flex: 1,
      width: dimensions.width,
      alignItems: 'center',
    }}>
      <View style={{
        width: dimensions.width,
        height: dimensions.height * 0.5,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
      }}>
        <Image
          resizeMode="cover"
          source={item.image}
          style={{
            width: dimensions.width,
            zIndex: 0,
            position: 'absolute',
            top: 0,
            height: dimensions.height,
          }}
        />
      </View>

      <View style={{
        height: dimensions.height,
        position: 'absolute',
        zIndex: 1,
        width: dimensions.width,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
      }}>
      </View>

      <View style={{
        position: 'absolute',
        zIndex: 2,
        width: dimensions.width,
        height: dimensions.height * 0.369,
        bottom: 0,
        alignSelf: 'center',
        alignItems: 'center',
        paddingHorizontal: dimensions.width * 0.04,
        alignSelf: 'center',
      }}>
        <Text
          style={{
            marginTop: dimensions.height * 0.03,
            maxWidth: dimensions.width * 0.8,
            fontWeight: 500,
            fontSize: dimensions.width * 0.064,
            fontFamily: fontInterRegular,
            fontStyle: 'italic',
            color: 'white',
            textAlign: 'left',
            alignSelf: 'flex-start',
          }}>
          {item.title}
        </Text>
        <Text
          style={{
            fontFamily: fontInterRegular,
            color: 'white',
            alignSelf: 'flex-start',
            textAlign: 'left',
            marginTop: dimensions.height * 0.01,
            fontWeight: 400,
            fontSize: dimensions.width * 0.043,
            maxWidth: dimensions.width * 0.8,
          }}>
          {item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#121212',
        alignItems: 'center',
      }}
    >
      <View style={{ display: 'flex' }}>
        <FlatList
          bounces={false}
          data={proOnboardingMatchData}
          keyExtractor={(item) => item.id.toString()}
          ref={proSlidesMatchRef}
          viewabilityConfig={viewConfig}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          horizontal
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: proMatchScrollX } } }], {
            useNativeDriver: false,
          })}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableProMatchItemsChanged}
          renderItem={renderProMatchItem}
        />
      </View>

      <TouchableOpacity
        onPress={() => {
          if (currentProMatchSlideIndex === proOnboardingMatchData.length - 1) {
            navigation.replace('LoadingProScreen');
          } else scrollToTheNextProMatchSlide();
        }}
        style={{
          backgroundColor: '#EDE72F',
          bottom: dimensions.height * 0.1,
          height: dimensions.height * 0.055,
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: dimensions.width * 0.7,
          width: dimensions.width * 0.89,
          zIndex: 2,
        }}
      >
        <Text
          style={{
            fontSize: dimensions.width * 0.045,
            fontFamily: fontInterRegular,
            color: 'black',
            textAlign: 'center',
            fontWeight: 400,
          }}>
          {currentProMatchSlideIndex === proOnboardingMatchData.length - 1 ? 'Get Started' : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OnboardingProMatchScreen;
