import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet
} from 'react-native';
import Dimensions from '../../utils/Dimensions';
import { TouchableOpacity } from './react-native-components';
import Utils from '../../utils/IcoUtils';

const { width } = Dimensions.get('window');

export const TabBar = (props) => {
  const { barColor } = props;
  return (<View style={[styles.tabbar, { backgroundColor:barColor }]}>
    {props.children}
  </View>);
};

export class Tab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      glypy: Utils.glypyMapMaker(Utils.glypy)
    };
  }
  onPress(e) {
    const name = this.props.name;
    if (this.props.onPress) {
      this.props.onPress(e, name);
    }
  }
  genIcon() {
    const { selected, icon, selectedIcon, systemIcon, defaultColor, selectedColor } = this.props;
    if (systemIcon) {
      const glypy = this.state.glypy;
      const color = selected ? selectedColor : defaultColor;
      return (<Text style={[{ color, fontFamily: Utils.from }, styles.systemIcon]}>{glypy[systemIcon]}</Text>);
    } else {
      return (<Image source={selected ? selectedIcon : icon} style={styles.icon} />);
    }
  }
  render() {
    var { title, selected, defaultColor, selectedColor } = this.props;
    var icon = this.genIcon();
    const color = selected ? selectedColor : defaultColor;
    return (<TouchableOpacity style={styles.tab} onPress={()=>this.onPress()}>
      <View style={styles.nav}>
        <View style={styles.iconRow}>
          {icon}
        </View>
        <View style={styles.labelRow}>
          <Text style={[styles.label, {color}]}>{title}</Text>
        </View>
      </View>
    </TouchableOpacity>);
  }
}

Tab.propTypes = {
  defaultColor: React.PropTypes.string,
  selectedColor: React.PropTypes.string
};

Tab.defaultProps = {
  defaultColor: "#929292",
  selectedColor: "#cb1bd0"
};

const styles = StyleSheet.create({
  nav:{
    alignItems:"center",
    height: Dimensions.tabBarHeight
  },
  tabbar:{
    position:"absolute",
    bottom:0,
    left:0,
    right:0,
    flexDirection:"row",
    justifyContent:"space-around", // 水平方向
    alignItems:"center",
    width,
    height: Dimensions.tabBarHeight,
    borderTopColor:"#ccc",
    borderTopWidth: 1,
    borderStyle: 'solid',
  },
  tab:{
    flex:1,
    height: Dimensions.tabBarHeight,
    backgroundColor: 'white',
  },
  iconRow:{
    flexDirection:"row",
    justifyContent:"center",
    height: Dimensions.getHeight(10)
  },
  systemIcon:{
    fontSize:Dimensions.getSize(8),
    textAlign:"center",
    lineHeight:Dimensions.getHeight(10),
    textAlignVertical:"center"
  },
  icon: {
    height: Dimensions.getHeight(8),
    width: Dimensions.getHeight(8),
    marginTop: Dimensions.getHeight(1),
  },
  labelRow:{
    height: Dimensions.getHeight(6)
  },
  label:{
    fontSize:Dimensions.getSize(4),
    color:"#282828",
    textAlign:"center",
    lineHeight:Dimensions.getSize(6)
  }
});

