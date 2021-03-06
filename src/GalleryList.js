import React, { Component } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  Easing,
  Animated,
} from 'react-native';

import GalleryItem from './GalleryItem';

const { width } = Dimensions.get('window');

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class GalleryList extends Component {
  constructor(props) {
    super(props);

    const { imageMargin, imagesPerRow } = props;

    this.state = {
      imageSize: width / imagesPerRow,
    };
  }

  shouldComponentUpdate(nextProps) {
    return (
      (nextProps.brokenImages !== this.props.brokenImages) ||
      (nextProps.type !== this.props.type) ||
      (nextProps.data !== this.props.data)
    );
  }

  handleOnPressImage = ({ item, index }) => (event, { isImageBroken } = {}) =>
    this.props.onPressImage({ item, index }, event, { isImageBroken });

  renderItem = (row) => {
    const { imageSize } = this.state;
    const {
      type,
      imageMargin,
      imagesPerRow,
      selectedImages,
      showListButton,
      onErrorImage,
      isImageBroken,
      onLongPressImage,
      paddingHorizontal,
    } = this.props;

    return (
      <GalleryItem
        {...row.item}
        isSelected={selectedImages.includes(row.item.id)}
        type={type}
        imageSize={imageSize}
        marginBottom={imageMargin}
        marginRight={(row.index + 1) % imagesPerRow !== 0 ? imageMargin : 0}
        isImageBroken={isImageBroken(row.item.id)}
        onPress={this.handleOnPressImage(row)}
        onLongPress={onLongPressImage}
        onErrorImage={onErrorImage}
        paddingHorizontal={paddingHorizontal}
      />
    );
  };

  render() {
    const { data, imagesPerRow, animated, horizontal, ...props } = this.props;

    const passedProps = {
      data,
      renderItem: this.renderItem,
      keyExtractor: item => item.id,
      contentContainerStyle: {
        flexDirection: horizontal ? 'row' : 'column',
      },
      horizontal,
      ...props,
    }

    if (!horizontal) {
      passedProps.numColumns = imagesPerRow
    }

    if (animated) {
      return (
        <AnimatedFlatList {...passedProps} />
      );
    }

    return (
      <FlatList {...passedProps} />
    );
  }
}

export default GalleryList;
