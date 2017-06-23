/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
} from 'react-native';
import AMapView, { MyLocationStyle } from 'react-native-amap';

export default class HomeIndex extends Component {
  onLayout(e) {
    console.log(e);
  }
  render() {
    const myLocationStyle = new MyLocationStyle({ showMarker: false, type: MyLocationStyle.LOCATION_TYPE_FOLLOW_NO_CENTER });
    return (
      <AMapView style={styles.container} myLocationEnabled showMyLocationButton  myLocationStyle={myLocationStyle} onLayout={(e)=>this.onLayout(e)}/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
});
