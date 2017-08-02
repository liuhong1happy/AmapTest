import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';

class TabItem extends Component {
  render() {
    const { name, itemType, selected, selectedIcon, defaultIcon, title, textIcon, color,  selectedColor} = this.props;
    return (
      <TouchableOpacity style={styles.tabitem} onPress={()=>this.props.onPress(name)}>
        {
          itemType === "text" ? <Text style={[styles.textIcon, { color:  selected ?  selectedColor : color}]}>{textIcon}</Text> :
          <Image source={selected ? selectedIcon: defaultIcon} style={styles.image} />
        }
        <Text style={[styles.text, { color:  selected ?  selectedColor : color}]}>{title}</Text>
      </TouchableOpacity>
    );
  }
}

TabItem.propTypes = {
  itemType: PropTypes.oneOf(['text', 'icon']),
  title: PropTypes.string,
  color: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  selectedColor: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  textIcon: PropTypes.string,
  defaultIcon: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  selectedIcon: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  iconSize: PropTypes.object,
  onPress: PropTypes.func,
  name: PropTypes.string,
  selected: PropTypes.bool,
};

TabItem.defaultProps = {
  title: "导航",
  itemType: "text",
  textIcon: "图标",
  defaultIcon: null,
  selectedIcon: null,
  iconSize: { width: 30, height: 30 },
  name: "nav",
  onPress: () => {},
  color: "#bbb",
  selectedColor: '#00aaff',
  selected: false
};

class TabBar extends Component {
  render() {
    const { items, selectedName} = this.props;
    return (
      <View style={styles.tabbar}>
        {
          items.map(item=>{
            return (<TabItem key={item.name} selected={item.name===selectedName} {...item} onPress={(name)=>this.props.onPress(name)} />);
          })
        }
      </View>
    );
  }
}

TabBar.propTypes = {
  selectedName: PropTypes.string,
  items: PropTypes.array,
  onPress: PropTypes.func,
};

TabBar.defaultProps = {
  selectedName: "nav",
  items: [],
  onPress: ()=>{}
};


const styles = StyleSheet.create({
  tabbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#ddd',
    height: 54
  },
  tabitem: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1
  },
  text: {
    fontSize: 12
  },
  textIcon: {
    fontFamily: 'icomoon',
    fontSize: 24,
  }
});

export default TabBar;