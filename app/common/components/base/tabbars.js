import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TabBar from './react-native-tabbar';
import { RouteHistory, SceneConfigs } from './react-native-router';
import Icons from './react-native-icomoon';

class TabBars extends Component {
  handlePress(name) {
    RouteHistory.pushRoute(name, 1, SceneConfigs.FadeAndroid);
  }
  render() {
    const { name, items } = this.props;
    return (<TabBar selectedName={name} items={items} onPress={(name)=>this.handlePress(name)}/>);
  }
}

TabBars.propTypes = {
    name: PropTypes.string,
    items: PropTypes.array
};

TabBars.defaultProps = {
    name: '/home/index',
    items: [
        { name: '/home/index', title: '首页', textIcon: Icons.home2 },
        { name: '/home/count', title: '统计', textIcon: Icons["pie_chart"] },
        { name: '/home/new', title: '新增', textIcon: Icons.plus },
        { name: '/user/index', title: '我', textIcon: Icons.user },
    ]
};

export default TabBars;
