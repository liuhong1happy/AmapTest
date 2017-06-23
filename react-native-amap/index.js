// AMapView.js
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { requireNativeComponent, View, processColor } from 'react-native';

var MyLocationStyle = (style = {})=> {
  return {
      type: 4, // LOCATION_TYPE_LOCATION_ROTATE
      strokeWidth: 2,
      fillColor: processColor('rgba(0,0,255,0.2)'),
      strokeColor: processColor('rgba(0,0,255,0.6)'),
      anchor: {
        u: 0.5,
        v: 0.5
      },
      interval: 1000,
      showMarker: false,
      ...style
    };
}

MyLocationStyle.LOCATION_TYPE_SHOW = 0;
MyLocationStyle.LOCATION_TYPE_LOCATE = 1;
MyLocationStyle.LOCATION_TYPE_FOLLOW = 2;
MyLocationStyle.LOCATION_TYPE_MAP_ROTATE = 3;
MyLocationStyle.LOCATION_TYPE_LOCATION_ROTATE = 4;
MyLocationStyle.LOCATION_TYPE_LOCATION_ROTATE_NO_CENTER = 5;
MyLocationStyle.LOCATION_TYPE_FOLLOW_NO_CENTER = 6;
MyLocationStyle.LOCATION_TYPE_MAP_ROTATE_NO_CENTER = 7;

var iface = {
  name: 'AMapView',
  propTypes: {
    myLocationEnabled: PropTypes.bool,
    myLocationStyle: PropTypes.shape({
      type: PropTypes.number,
      strokeWidth: PropTypes.number,
      fillColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      strokeColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      anchor: PropTypes.shape({
        u: PropTypes.number,
        v: PropTypes.number,
      }),
      interval: PropTypes.number,
      showMarker: PropTypes.bool,
    }),
    showMyLocationButton: PropTypes.bool,
    showIndoorMap: PropTypes.bool,
    mapType: PropTypes.number,
    showCompass: PropTypes.bool,
    showScaleControls: PropTypes.bool,
    polylines: PropTypes.array,
    markers: PropTypes.array,
    ...View.propTypes // 包含默认的View的属性
  },
  defaultProps: {
    myLocationEnabled: false,
    myLocationStyle: new MyLocationStyle(),
    showMyLocationButton: false,
    showIndoorMap: false,
    showCompass: false,
    showScaleControls: false,
    mapType: 1,
    markers: [],
    polylines: []
  }
};


var RCTAMapView = requireNativeComponent('RCTAMapView', iface);

class AMapView extends Component {
  constructor(props, context) {
    super(props, context);
    this.loaded = false;
    this.state = {
      mapProps: {}
    }
  }
  componentWillReceiveProps(nextProps) {
    if(this.state.loaded) {
      this.setState({mapProps: nextProps})
    }
  }
  onLayout(e) {
    if(!this.loaded) this.setState({mapProps: this.props});
    this.loaded = true;
  }
  render() {
    return (<RCTAMapView {...this.state.mapProps} onLayout={(e)=>this.onLayout(e)}/>)
  }
}

module.exports = AMapView;
module.exports.MyLocationStyle = MyLocationStyle;