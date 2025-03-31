import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, Animated, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import proOnboardingMatchData from '../components/proOnboardingMatchData';
import { useNavigation } from '@react-navigation/native';

const fontInterRegular = 'Inter18pt-Regular';

const OnboardingProMatchScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const navigation = useNavigation();
  const [currentNeshineSlideIndex, setCurrentSlideIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  useEffect(() => {
    const onChange = ({ window }) => {
      setDimensions(window);
    };
    const dimensionListener = Dimensions.addEventListener('change', onChange);
    return () => {
      dimensionListener.remove();
    };
  }, []);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentSlideIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollToTheNextNeshineSlide = () => {
    if (currentNeshineSlideIndex < proOnboardingMatchData.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentNeshineSlideIndex + 1 });
    } else {
      navigation.replace('Home');
    }
  };

  const renderNeshineItem = ({ item }) => (
    <View style={{ width: dimensions.width, flex: 1, justifyContent: 'space-between', alignItems: 'center' }} >
      <View style={{
        justifyContent: 'center',
        height: dimensions.height * 0.5,
        alignItems: 'center',
        alignSelf: 'center',
        width: dimensions.width,
      }}>
        <Image
          resizeMode="cover"
          source={item.image}
          style={{
            height: dimensions.height,
            zIndex: 0,
            position: 'absolute',
            top: 0,
            width: dimensions.width,
          }}
        />
      </View>

      <View style={{
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        position: 'absolute',
        zIndex: 1,
        width: dimensions.width,
        height: dimensions.height,
      }}>
      </View>

      <View style={{
        zIndex: 2,
        position: 'absolute',
        height: dimensions.height * 0.369,
        bottom: 0,
        alignSelf: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        paddingHorizontal: dimensions.width * 0.04,
        width: dimensions.width,
      }}>
        <Text
          style={{
            fontStyle: 'italic',
            maxWidth: dimensions.width * 0.8,
            alignSelf: 'flex-start',
            fontSize: dimensions.width * 0.064,
            fontFamily: fontInterRegular,
            fontWeight: 500,
            color: 'white',
            textAlign: 'left',
            marginTop: dimensions.height * 0.03,
          }}>
          {item.title}
        </Text>
        <Text
          style={{
            fontWeight: 400,
            color: 'white',
            alignSelf: 'flex-start',
            maxWidth: dimensions.width * 0.8,
            marginTop: dimensions.height * 0.01,
            textAlign: 'left',
            fontSize: dimensions.width * 0.043,
            fontFamily: fontInterRegular,
          }}>
          {item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <View
      style={{ justifyContent: 'space-between', flex: 1, backgroundColor: '#121212', alignItems: 'center', }}
    >
      <View style={{ display: 'flex' }}>
        <FlatList
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNeshineItem}
          data={proOnboardingMatchData}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          horizontal
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          })}
          scrollEventThrottle={32}
          viewabilityConfig={viewConfig}
          onViewableItemsChanged={viewableItemsChanged}
          ref={slidesRef}
        />
      </View>

      <TouchableOpacity
        onPress={() => {
          if (currentNeshineSlideIndex === proOnboardingMatchData.length - 1) {
            navigation.navigate('Home');
          } else scrollToTheNextNeshineSlide();
        }}
        style={{
          zIndex: 2,
          borderRadius: dimensions.width * 0.7,
          height: dimensions.height * 0.055,
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#EDE72F',
          width: dimensions.width * 0.89,
          bottom: dimensions.height * 0.1,
        }}
      >
        <Text
          style={{
            fontWeight: 400,
            fontFamily: fontInterRegular,
            color: 'black',
            textAlign: 'center',
            fontSize: dimensions.width * 0.045,
          }}>
          {currentNeshineSlideIndex === proOnboardingMatchData.length - 1 ? 'Get Started' : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OnboardingProMatchScreen;
