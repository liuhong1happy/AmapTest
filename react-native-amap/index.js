// AMapView.js

import { PropTypes } from 'prop-types';
import { requireNativeComponent, View } from 'react-native';

var iface = {
  name: 'AMapView',
  propTypes: {
    ...View.propTypes // 包含默认的View的属性
  },
};

module.exports = requireNativeComponent('RCTAMapView', iface);