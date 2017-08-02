/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
} from 'react-native';
import AMapView, { MyLocationStyle, MarkerOptions, PolylineOptions } from 'react-native-amap';
import NavJPG from '../../images/nav.jpg';

export default class HomeIndex extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      centerMarker: new MarkerOptions(),
      locationMarker: new MarkerOptions(),
      startPoint: { latitude: 0, longitude: 0},
      endPoint: { latitude: 100, longitude: 100},
      myLocationStyle: new MyLocationStyle({ showMarker: false, type: MyLocationStyle.LOCATION_TYPE_FOLLOW_NO_CENTER })
    };
  }
  
  onCameraChange({nativeEvent}) {
      const centerMarker = { ...this.state.centerMarker, position:  nativeEvent.target};
      this.setState({ centerMarker, startPoint: centerMarker.position })
  }
  onMyLocationChange({nativeEvent}) {
      const { latitude, longitude } = nativeEvent;
      const target = { latitude, longitude };
      const locationMarker = { ...this.state.locationMarker, position: target};
      this.setState({ locationMarker, endPoint: locationMarker.position })
  }
  render() {
    const { myLocationStyle, centerMarker, locationMarker, startPoint, endPoint } = this.state;
    return (
      <AMapView style={styles.container} 
      myLocationEnabled  onCameraChange={(e)=>this.onCameraChange(e)}
      showMyLocationButton  onMyLocationChange={(e)=>this.onMyLocationChange(e)}
      myLocationStyle={myLocationStyle} markers={[centerMarker, locationMarker]} polylines={[new PolylineOptions({width: 10, points: [startPoint, endPoint]})]} />
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
