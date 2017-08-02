import React from 'react';
import { View, StyleSheet } from 'react-native';

const HomeView = props =>
  <View style={styles.flex}>
    {
        props.children
    }
  </View>;

  const styles = StyleSheet.create({
      flex: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      }
  });

export default HomeView;