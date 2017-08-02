// AMapView.js
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { requireNativeComponent, View, processColor, ViewPropTypes, Alert, Image, NativeModules } from 'react-native';

var AnimationUtils = {
  addCallback: (data, callback) => {
    AnimationUtils.data = data;
    AnimationUtils.callback = callback;
  },
  addListener: (key, callback) => {
    const index = AnimationUtils.listeners.findIndex(l=>l.key===key);
    if(index!==-1) {
      AnimationUtils.listeners[index] = {
        key,
        callback
      };
    } else {
      AnimationUtils.listeners.push({
        key,
        callback
      })
    }
  },
  removeListener: (key) => {
    const index = AnimationUtils.listeners.findIndex(l=>l.key===key);
    if(index!==-1) AnimationUtils.listeners.splice(index);
  },
  data: null,
  callback: null,
  listeners: []
}

var now;
var then = Date.now();
const animate = ()=> {
  window.requestAnimationFrame(animate);
  if(AnimationUtils.callback && AnimationUtils.data) {
      AnimationUtils.callback(AnimationUtils.data);
      AnimationUtils.data = null;
      AnimationUtils.callback = null;
  }
  AnimationUtils.listeners.forEach(({key, callback}) => {
    callback && callback();
  })
}
animate();


var MyLocationStyle = (style = {})=> {
  if(style.fillColor) options.fillColor = processColor(options.fillColor);
  if(style.strokeColor) options.strokeColor = processColor(options.strokeColor);
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

var MarkerOptions = (options = {})=> {
  if(options.icon) options.icon = Image.resolveAssetSource(options.icon);
  return {
    flat: true,
    draggable: true,
    visible: true,
    onlyPosition: false,
    position: {
      latitude: 0,
      longitude: 0,
    },
    title: "标记",
    snippet: "标记",
    period: 1,
    ...options
  }
}

var PolylineOptions = (options = {})=> {
  if(options.color) options.color = processColor(options.color);
  return {
    width: 1,
    color: processColor('rgba(0,0,255,0.6)'),
    points: [{latitude: 0,longitude: 0}, {latitude: 100,longitude: 100}],
    ...options
  }
}

MyLocationStyle.LOCATION_TYPE_SHOW = 0;
MyLocationStyle.LOCATION_TYPE_LOCATE = 1;
MyLocationStyle.LOCATION_TYPE_FOLLOW = 2;
MyLocationStyle.LOCATION_TYPE_MAP_ROTATE = 3;
MyLocationStyle.LOCATION_TYPE_LOCATION_ROTATE = 4;
MyLocationStyle.LOCATION_TYPE_LOCATION_ROTATE_NO_CENTER = 5;
MyLocationStyle.LOCATION_TYPE_FOLLOW_NO_CENTER = 6;
MyLocationStyle.LOCATION_TYPE_MAP_ROTATE_NO_CENTER = 7;

class AMapView extends Component {
  constructor(props, context) {
    super(props, context);
    this.loaded = false;
    this.state = {
      mapProps: {}
    }
  }
  componentWillReceiveProps(nextProps) {
    if(this.loaded) {
      this.setState({mapProps: {...nextProps}})
    }
  }
  onLayout(e) {
    if(!this.loaded) this.setState({mapProps: {...this.props}});
    this.loaded = true;
    this.props.onLayout && this.props.onLayout(e);
  }
  render() {
    return (<RCTAMapView {...this.state.mapProps} onLayout={(e)=>this.onLayout(e)} />)
  }
}

AMapView.propTypes = {
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
    onMyLocationChange: PropTypes.func,
    onCameraChange: PropTypes.func,
    onRotateChange: PropTypes.func,
    ...ViewPropTypes // 包含默认的View的属性
}

AMapView.defaultProps = {
    myLocationEnabled: false,
    myLocationStyle: new MyLocationStyle(),
    showMyLocationButton: false,
    showIndoorMap: false,
    showCompass: false,
    showScaleControls: false,
    mapType: 1,
    markers: [],
    polylines: [],
    onMyLocationChange: ()=> {},
    onCameraChange: ()=> {},
    onRotateChange: ()=> {}
}

var RCTAMapView = requireNativeComponent(`RCTAMapView`, AMapView, {
  nativeOnly: {onChange: true}
});

module.exports = AMapView;
module.exports.MyLocationStyle = MyLocationStyle;
module.exports.MarkerOptions = MarkerOptions;
module.exports.PolylineOptions = PolylineOptions;
module.exports.AMapUtils = NativeModules.AMapUtils;
module.exports.AnimationUtils = AnimationUtils;