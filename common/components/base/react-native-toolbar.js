import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    StatusBar
} from 'react-native';
import Dimensions from './react-native-dimensions';
import { TouchableOpacity, Platform } from './react-native-components';

const { width } = Dimensions.get('window');
// navIcon,logo,title,titleColor,subtitle,subtitleColor,actions
// name title icon show showWithText
class ActionButton extends React.Component {
  onPress(e) {
    if (this.props.onPress) {
      this.props.onPress(e, this.props.name);
    }
  }
  genImage() {
    if (this.props.icon) {
      return (<Image source={this.props.icon} style={styles.actionImg} />);
    } else {
      return (<Text />);
    }
  }
  render() {
    const img = this.genImage();
    return (<TouchableOpacity onPress={this.onPress.bind(this)} style={[styles.button, { width:this.props.width, marginLeft:this.props.marginLeft }]}>
      {img}
      <Text style={{ color: this.props.titleColor || "#1c2429", fontSize: 18 }}>{this.props.title}</Text>
    </TouchableOpacity>);
  }
}
class ToolBar extends React.Component {
  constructor(props) {
    super(props);
    const { navIcon, logo, title, subtitle, actions } = props;
    this.state = {
      navIcon,
      logo,
      title,
      subtitle,
      actions
    };
  }
  onNavIconPress(e) {
    if (this.props.onNavIconPress) {
      this.props.onNavIconPress(e);
    }
  }
  onLogoPress(e) {
    if (this.props.onLogoPress) {
      this.props.onLogoPress(e);
    }
  }
  onActionPress(e, name) {
    if (this.props.onActionPress) {
      this.props.onActionPress(e, name);
    }
  }
  setNavIcon(navIcon) {
    this.setState({
      navIcon
    });
  }
  setLogo(logo) {
    this.setState({
      logo
    });
  }
  setTitle(title) {
    this.setState({
      title
    });
  }
  setSubtitle(subtitle) {
    this.setState({
      subtitle
    });
  }
  genTitle(title) {
    if (title) {
      return (<View><Text style={styles.title}>{title}</Text></View>);
    } else {
      return (<View />);
    }
  }
  genSubtitle(subtitle) {
    if (subtitle) {
      return (<View><Text style={styles.subtitle}>{subtitle}</Text></View>);
    } else {
      return (<View />);
    }
  }
  render() {
    const title = this.genTitle(this.props.title);
    const actions = this.props.actions || [];
    const navIcon = this.props.navIcon || {};
    const logo = this.props.logo || {};
    return (<View style={[styles.toolbar]}>
      <StatusBar hidden={false} barStyle={Platform.isIOS  ? "dark-content" : "light-content"} />
      <View style={[styles.item, styles.actions, { justifyContent:"flex-start", marginLeft:12 }]}>
        <ActionButton icon={navIcon.icon} title={navIcon.title} name={navIcon.name} width={navIcon.width} onPress={(e, name)=>this.onNavIconPress(e, name)} />
        <ActionButton icon={logo.icon} title={logo.title} name={logo.name} width={navIcon.width} onPress={(e, name)=>this.onLogoPress(e, name)} />
      </View>
      <View style={[styles.item, styles.titles]}>
        { title }
      </View>
      <View style={[styles.item, styles.actions, { justifyContent:"flex-end", marginRight:12 }]}>
        {
            actions.map((action, pos) => React.createElement(ActionButton, 
            {...action,key: pos, marginLeft: 18, onPress: (e, name)=>this.onActionPress(e, name)}, null))
        }
      </View>
    </View>);
  }
}

const styles = StyleSheet.create({
  toolbar:{
    flexDirection:"row", // 子项目从左向有对齐
    justifyContent:"space-around", // 水平方向
    alignItems:"center", // 垂直方向
    width,
    borderBottomColor:"#ccc",
    borderBottomWidth:0.5,
    borderStyle:"solid",
    backgroundColor:"white",
    height:Dimensions.toolBarHeight,
  },
  item:{
    flex:1
  },
  titles:{
    flexDirection:"column",
    justifyContent:"space-around",
    marginTop: 8,
    marginBottom:6,
    alignItems:"center"
  },
  title:{
    flex:1,
    color:"#1c2429",
    fontSize: 20,
    textAlign:"center"
  },
  actions:{
    flexDirection:"row",
    alignItems:"center",
  },
  button:{
    flexDirection:"row",
    justifyContent:"space-around", // 水平方向
    alignItems:"center",
    flex:0
  },
  actionImg:{
    width: 18,
    height:24
  }
});
export default ToolBar;
