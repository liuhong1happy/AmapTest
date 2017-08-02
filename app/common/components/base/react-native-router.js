import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import {
     Navigator  
} from 'react-native-deprecated-custom-components';

export const SceneConfigs = Navigator.SceneConfigs;
const defaultConfig = SceneConfigs.FadeAndroid;

const RouterUtils = {
  createRoute(element, parentProps) {
    var location = `${parentProps.location}/${element.props.path}`,
      components = parentProps.components.concat([element.props.component]);
    return {
      location,
      components
    };
  },
  createRoutesByPropsChildren(children, parentProps) {
    var routes = [];
    if(!(children instanceof Array)) children = [children];
    for (let i = 0; i < children.length; i++) {
      const element = children[i];
      const route = this.createRoute(element, parentProps);

      if (element.props.children instanceof Array) {
        route.routes = this.createRoutesByPropsChildren(element.props.children, route);
      } else if (element.props.children instanceof Object) {
        route.routes = this.createRoutesByPropsChildren([element.props.children], route);
      }
      routes.push(route);
    }

    return routes;
  },
  createRoutes(parentProps) {
    var parentRoute = {
      components:[parentProps.component],
      location:""
    };
    parentRoute.routes = this.createRoutesByPropsChildren(parentProps.children, parentRoute);
    return parentRoute;
  }
};

export const RouteHistory = {
  routeTable:[],
  curRoute:{ index:0, name:"/home/index", config: defaultConfig },
  navigator: null,
  prevRoute: null,
  listeners: [],
  ready(callback) {
    if (RouteHistory.navigator) {
      callback(RouteHistory.navigator);
    } else {
      RouteHistory.listeners.push(callback);
    }
  },
    // 修改当前路由，不适合后退页面，适合平行页面之间跳跃
  pushRoute(name, index, config) {
    index = index || 0;
    config = config || SceneConfigs.PushFromRight;
    const navigator = RouteHistory.navigator;
    this.routeTable = navigator ? navigator.getCurrentRoutes() : [];
    this.curRoute = { name, index, config };
    const existRoutes = this.routeTable.filter((ele, pos) => ele.name === name);

    if (navigator) {
      if (existRoutes.length > 0) {
        navigator.jumpTo(existRoutes[existRoutes.length-1]);
      } else {
        navigator.push({
          name, index, config
        });
      }
    } else {
      Alert.alert("警告", "没有navigator", [{ text: "确定", onPress: () => {} }]);
    }
  },
    // 重置route，适合首次初始化的时候
  resetToRoute(name, index, config) {
    index = index || 0;
    config = config || defaultConfig;
    this.routeTable = [];
    this.curRoute = { name, index, config };
    const navigator = RouteHistory.navigator;
    if (navigator) {
      navigator.resetTo({
        name, index, config
      });
    }
  },
    // 后退到上一级
  popRoute() {
    const navigator = RouteHistory.navigator;
    const routes = navigator.getCurrentRoutes();
    if (navigator) {
      navigator.pop();
      // 记录页面
      if(navigator.navigationContext._currentRoute) {
        const { name } = navigator.navigationContext._currentRoute;
      }
    }
    return routes;
  },
    // 后退多级
  popToRoute(name) {
    const navigator = RouteHistory.navigator;
    const routes = navigator.getCurrentRoutes();
    const existRoutes = routes.filter((ele, pos) => ele.name === name);
    if (navigator && existRoutes.length > 0) {
      navigator.popToRoute(existRoutes[0]);
      // 记录页面
      if(navigator.navigationContext._currentRoute) {
        const { name } = navigator.navigationContext._currentRoute;
      }
    }
  }
};

export class Router extends React.Component {
  constructor(props) {
    super(props);
    const defaultRoute = props.defaultRoute || "/";
    RouteHistory.curRoute.name = defaultRoute;
    this.state = {
      location:  defaultRoute,
      routes:null,
      components:null,
    };
  }
  componentWillMount() {
    const routes = RouterUtils.createRoutes(this.props);
    const components = this._parseHash(routes, this.state.location);
    this.setState({
      routes,
      components
    });
  }
  componentDidMount() {
    // 全局navigator赋值
    RouteHistory.navigator = this.refs.navigator;
    if (RouteHistory.listeners.length > 0) {
      let listener = RouteHistory.listeners.pop();
      while (listener) {
        listener(RouteHistory.navigator);
        listener = RouteHistory.listeners.pop();
      }
    }
    // Alert.alert("提示", "挂载navigator", [{ text: "确定", onPress: () => {} }]);
  }
  _matchLocation(_location, hash) {
    const locations = _location.split("/");
    const hashs = hash.split("/");
    const props = { location:hash };
    if (locations.length === hashs.length) {
      const results = locations.filter((ele, pos) => {
        const _hash = hashs[pos];
        if (_hash.indexOf("?") !== -1) {
          const _hashs = _hash.split("?");
          hashs[pos] = _hashs[0];
          const eles = _hashs[1].split("&");
          for (let i = 0; i < eles.length; i++) {
            const objs = eles[i].split("=");
            props[objs[0]] = objs[1];
          }
        }
        if (ele.indexOf(":") !== -1) {
          props[ele.split(":")[1]] = hashs[pos];
          return true;
        } else {
          return ele === hashs[pos];
        }
      });
      return results.length === locations.length ? props : null;
    }
    return null;
  }
  _parseHashByRoutes(routes, hash) {
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      const props = this._matchLocation(route.location, hash);
      if (props) {
        route.props = props;
        return route;
      }
      if (route.routes) {
        const result = this._parseHashByRoutes(route.routes, hash);
        if (result != null) return result;
      }
    }
    return null;
  }
  _parseHash(routes, hash, _route) {
    var route = this._parseHashByRoutes(routes.routes, hash);
    if (route == null) return (<Text>404</Text>);
    return this._createElementByComponents(route.components, route.props, _route);
  }
  _createElementByComponent(component, components, props, _route) {
    props.route = _route;
    if (components.length > 1) {
      const _components = components.filter((ele, pos) => pos > 0);
      const child = this._createElementByComponent(_components[0], _components, props);
      return React.createElement(component, props, child);
    } else {
      return React.createElement(component, props, null);
    }
  }
  _createElementByComponents(components, props, _route) {
    return this._createElementByComponent(components[0], components, props, _route);
  }
  _handleHashChange(_route, _navigator) {
    var hash = _route.name;
    var components = this._parseHash(this.state.routes, hash, _route);
    return components;
  }
  _handleConfigureScene(_route, _routeStack) {
      // PushFromRight FloatFromRight FloatFromLeft FloatFromBottom
      // FloatFromBottomAndroid FadeAndroid
      // HorizontalSwipeJump VerticalUpSwipeJump VerticalDownSwipeJump
    return _route.config || SceneConfigs.FadeAndroid;
  }
  handleOnLayout(e) {
    console.log(e);
  }
  render() {
    return (
      <Navigator 
        ref="navigator" initialRoute={{ name:this.props.defaultRoute, index:0 }}
        configureScene={(_route, _routeStack)=>this._handleConfigureScene(_route, _routeStack)}
        renderScene={(_route, _navigator)=>this._handleHashChange(_route, _navigator)}
        onLayout={(e)=>this.handleOnLayout(e)}
      />
    );
  }
}

Router.propTypes = {
  defaultRoute: PropTypes.string,
};

Router.defaultProps = {
  defaultRoute: "/"
};

export const Route = () => <View />;
export class Link extends React.Component {
  handlePress(e) {
    // 先 生效点击事件
    if (this.props.onPress) {
      this.props.onPress(e);
    }
    const name = this.props.name;
    const index = this.props.index || 0;
    const config = this.props.config || SceneConfigs.PushFromRight;
    RouteHistory.pushRoute(name, index, config);
  }
  render() {
    return (<TouchableOpacity onPress={this.handlePress.bind(this)}>
      <View style={this.props.style}>
        { this.props.children }
      </View>
    </TouchableOpacity>);
  }
}

/** *
Navigator.SceneConfigs.PushFromRight
Navigator.SceneConfigs.FloatFromRight(default)
Navigator.SceneConfigs.FloatFromLeft
Navigator.SceneConfigs.FloatFromBottom
Navigator.SceneConfigs.FloatFromBottomAndroid
Navigator.SceneConfigs.FadeAndroid
Navigator.SceneConfigs.HorizontalSwipeJump
Navigator.SceneConfigs.HorizontalSwipeJumpFromRight
Navigator.SceneConfigs.VerticalUpSwipeJump
Navigator.SceneConfigs.VerticalDownSwipeJump
***/

export default {
  Router,
  Route,
  Link,
  RouteHistory,
  SceneConfigs
};
