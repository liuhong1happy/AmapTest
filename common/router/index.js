import React from 'react';
import { View, BackHandler } from 'react-native';
import DecorView from 'react-native-decorview';
import { Route, Router, RouteHistory } from '../components/base/react-native-router';
import Dimensions from '../components/base/react-native-dimensions';
import { Platform } from '../components/base/react-native-components';
import HomePage from '../components/home';
import HomeIndexPage from '../components/home/home-index';
import HomeCountPage from '../components/home/home-count';
import HomeNewPage from '../components/home/home-new';
import HomeDataPage from '../components/home/home-data';

class MainApp extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      reloadCount: 0
    };
  }
  
  componentWillMount() {
    if (Platform.isAndroid) {
      BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
    }
  }
  componentWillUnmount() {
    if (Platform.isAndroid) {
      BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }
  onBackAndroid () {
    const routers = RouteHistory.popRoute();
    if (routers.length > 1) {
      return true;
    }
    return false;
  }
  onLayout(e) {
    if(Dimensions.contentHeight != e.nativeEvent.layout.height) {
      this.setState({
        reloadCount: this.state.reloadCount++
      });
    }
    Dimensions.contentHeight = e.nativeEvent.layout.height;
  }
  render() {
    return (
      <View style={styles.main} onLayout={(e)=>this.onLayout(e)}>
        {this.props.children}
      </View>);
  }
}

const styles = {
  main:{
    backgroundColor: '#f0f0f0',
    marginTop: Platform.isIOS ? Dimensions.statusBarHeight : 0,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }
};

const RouterApp = () =>
  <Router defaultRoute="/home/index" path="/" component={MainApp}>
    <Route path="home" component={HomePage}>
      <Route path="index" component={HomeIndexPage} />
      <Route path="count" component={HomeCountPage} />
      <Route path="new" component={HomeNewPage} />
      <Route path="data" component={HomeDataPage} />
    </Route>
  </Router>;

export default RouterApp;
