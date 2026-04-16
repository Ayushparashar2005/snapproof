import React from 'react';
import {View, Image, StyleSheet, Dimensions} from 'react-native';
import Svg, {Rect, Text as SvgText} from 'react-native-svg';

const {width: screenWidth} = Dimensions.get('window');

const ImageOverlay = ({imageUri, tamperedRegions, imageWidth, imageHeight}) => {
  if (!tamperedRegions || tamperedRegions.length === 0) {
    return (
      <View style={styles.container}>
        <Image source={{uri: imageUri}} style={styles.image} />
      </View>
    );
  }

  const calculateOverlayDimensions = () => {
    const displayWidth = imageWidth || screenWidth - 40;
    const aspectRatio = imageHeight ? imageWidth / imageHeight : 16 / 9;
    const displayHeight = displayWidth / aspectRatio;
    
    return {width: displayWidth, height: displayHeight};
  };

  const {width: displayWidth, height: displayHeight} = calculateOverlayDimensions();

  const scaleRegionToDisplay = (region) => {
    // Scale bounding box coordinates to display dimensions
    const scaledX = (region.bbox[0] * displayWidth) / 100;
    const scaledY = (region.bbox[1] * displayHeight) / 100;
    const scaledWidth = (region.bbox[2] * displayWidth) / 100;
    const scaledHeight = (region.bbox[3] * displayHeight) / 100;

    return {
      x: scaledX,
      y: scaledY,
      width: scaledWidth,
      height: scaledHeight,
      confidence: region.confidence,
      type: region.type,
    };
  };

  const getRegionColor = (confidence) => {
    if (confidence >= 80) return '#e74c3c'; // Red for high confidence
    if (confidence >= 60) return '#f39c12'; // Orange for medium confidence
    return '#f1c40f'; // Yellow for low confidence
  };

  return (
    <View style={styles.container}>
      <Image 
        source={{uri: imageUri}} 
        style={[
          styles.image,
          {
            width: displayWidth,
            height: displayHeight,
          }
        ]} 
      />
      
      <Svg
        style={styles.overlay}
        width={displayWidth}
        height={displayHeight}>
        {tamperedRegions.map((region, index) => {
          const scaledRegion = scaleRegionToDisplay(region);
          const color = getRegionColor(region.confidence);
          
          return (
            <React.Fragment key={index}>
              <Rect
                x={scaledRegion.x}
                y={scaledRegion.y}
                width={scaledRegion.width}
                height={scaledRegion.height}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeDasharray="5,5"
                opacity="0.8"
              />
              
              <Rect
                x={scaledRegion.x}
                y={scaledRegion.y - 25}
                width={120}
                height={25}
                fill={color}
                opacity="0.9"
                rx="3"
              />
              
              <SvgText
                x={scaledRegion.x + 5}
                y={scaledRegion.y - 8}
                fill="white"
                fontSize="10"
                fontWeight="bold">
                {region.type} ({region.confidence}%)
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    marginVertical: 10,
  },
  image: {
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default ImageOverlay;
