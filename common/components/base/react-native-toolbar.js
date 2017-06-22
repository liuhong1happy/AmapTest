import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    StatusBar
} from 'react-native';
import Dimensions from '../../utils/Dimensions';
import { TouchableOpacity } from './react-native-form';
import Platform from './react-native-platform';

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
      <Text style={{ color: this.props.titleColor || "#1c2429", fontSize:Dimensions.getSize(6) }}>{this.props.title}</Text>
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
      <View style={[styles.item, styles.actions, { justifyContent:"flex-start", marginLeft:Dimensions.getSize(4) }]}>
        <ActionButton icon={navIcon.icon} title={navIcon.title} name={navIcon.name} width={navIcon.width} onPress={(e, name)=>this.onNavIconPress(e, name)} />
        <ActionButton icon={logo.icon} title={logo.title} name={logo.name} width={navIcon.width} onPress={(e, name)=>this.onLogoPress(e, name)} />
      </View>
      <View style={[styles.item, styles.titles]}>
        { title }
      </View>
      <View style={[styles.item, styles.actions, { justifyContent:"flex-end", marginRight:Dimensions.getSize(4) }]}>
        {
            actions.map((action, pos) => React.createElement(ActionButton, 
            {...action,key: pos, marginLeft: Dimensions.getSize(6), onPress: (e, name)=>this.onActionPress(e, name)}, null))
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
    marginTop: Dimensions.getSize(3),
    marginBottom:Dimensions.getSize(2),
    alignItems:"center"
  },
  title:{
    flex:1,
    color:"#1c2429",
    fontSize:Dimensions.getSize(7),
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
    width:Dimensions.getSize(6),
    height:Dimensions.getSize(8)
  }
});
export default ToolBar;
