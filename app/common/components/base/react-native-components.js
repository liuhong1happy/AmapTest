import React, { PropTypes } from 'react';
import {
  View,
  Text,
  Switch,
  Picker,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  Image,
  Platform
} from 'react-native';

import Dimensions from './react-native-dimensions';

// TouchableHighlight ...props
const NewTouchableHighlight = props => <TouchableHighlight {...props} />;

NewTouchableHighlight.propTypes = {
  delayLongPress: PropTypes.number,
  delayPressIn: PropTypes.number,
  delayPressOut: PropTypes.number,
  activeOpacity: PropTypes.number,
  underlayColor: PropTypes.string
};

NewTouchableHighlight.defaultProps = {
  delayLongPress: 0,
  delayPressIn: 0,
  delayPressOut: 0,
  activeOpacity: 0.5,
  underlayColor: "#d8d8d8"
};

const NewTouchableOpacity = props => <TouchableOpacity {...props} />;

NewTouchableOpacity.propTypes = {
  delayLongPress: PropTypes.number,
  delayPressIn: PropTypes.number,
  delayPressOut: PropTypes.number,
  activeOpacity: PropTypes.number,
  underlayColor: PropTypes.string
};

NewTouchableOpacity.defaultProps = {
  delayLongPress: 0,
  delayPressIn: 0,
  delayPressOut: 0,
  activeOpacity: 0.5,
  underlayColor: "#d8d8d8"
};


// props
// {name:xxx,icon:xxx,title:xxx,style:{},onPress:function(){} }
class Button extends React.Component {
  onPress(e) {
    if (this.props.onPress) {
      this.props.onPress(e, this.props.name);
    }
  }
  genImage() {
    const { iconHeight, iconWidth, iconStyle, icon } = this.props;

    if (this.props.icon) {
      return (<View style={{ height: iconHeight, width: iconWidth }}>
        <Image resizeMode="stretch" source={icon} style={[styles.buttonImg, { height: iconHeight, width: iconWidth }, iconStyle]} />
      </View>);
    } else {
      return (<View style={{ height:0, width:0 }} />);
    }
  }
  render() {
    const { width, height, title, titleStyle, style, containerStyle, textAlign, underlayColor } = this.props;
    const img = this.genImage();

    return (<NewTouchableOpacity style={[{ width, height }, containerStyle]} underlayColor={underlayColor} onPress={this.onPress.bind(this)}>
      <View style={[{ width, height }, styles.buttonContainer, style]} >
        {img}
        <View style={[styles.buttonTextContainer, { justifyContent: textAlign }]}>
          <Text style={[styles.buttonText, titleStyle]}>{ title }</Text>
        </View>
      </View>
    </NewTouchableOpacity>);
  }
}

Button.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  title: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  titleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  iconStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  iconHeight: PropTypes.number,
  iconWidth: PropTypes.number,
  textAlign: PropTypes.string,
  underlayColor: PropTypes.string,
  onPress: PropTypes.func
};

Button.defaultProps = {
  width: Dimensions.screenWidth,
  height: 36,
  title: "",
  iconHeight: 0,
  iconWidth: 0,
  textAlign: "flex-start",
  underlayColor: "#d8d8d8",
  onPress: (name) => {}
};


class ToggleButton extends React.Component {
  onPress(e, name) {
    const toggle = this.props.toggle;
    if (this.props.onPress) {
      this.props.onPress(e, this.props.name, !toggle);
    }
  }
  render() {
    const { toggle, toggleTitle, title, toggleIcon, icon } = this.props;
    const others = {
      ...this.props,
      title: toggle ? toggleTitle : title,
      icon: toggle ? toggleIcon : icon,
      onPress: this.onPress.bind(this)
    };
    return (<Button {...others} />);
  }
}

// like TextInput
const TextArea = (props) => {
  const others = { ...props, multiline:true };
  return (<NewTextIntput {...others} />);
};

// DatePicker
// DateTimePicker
// CheckBox / CheckGroup
// RadioBox / RadioGroup
// NewTextIntput
class NewTextIntput extends React.Component {
  handleChangeText(text) {
    if (this.props.onChangeText) {
      this.props.onChangeText(this.props.name, text);
    }
  }
  render() {
    const others = {
      ...this.props,
      onChangeText: this.handleChangeText.bind(this),
      underlineColorAndroid: "transparent",
      autoCapitalize: "none"
    };
    return (<TextInput {...others} />);
  }
}

class RadioSelect extends React.Component {
  handleClick() {
    if (this.props.onPress) {
      this.props.onPress(this.props.option, this.props.selectedId);
    }
  }
  render() {
    const { style, option, selected } = this.props;
    return (
      <TouchableOpacity onPress={this.handleClick.bind(this)} style={style}>
        <View style={styles.raido}>
          <View style={[styles.raidoInset, option === selected ? styles.raidoSelect : ""]} />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  raido:{
    width: 30,
    height: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#0D0D0D",
    borderRadius: 15
  },
  raidoInset:{
    width: 24,
    height: 24,
    borderRadius: 12
  },
  raidoSelect:{
    backgroundColor: "#74C93C"
  },
  buttonContainer:{
    backgroundColor: "transparent"
  },
  buttonImg:{
    width: 36,
    height: 36
  },
  buttonTextContainer:{
    flexDirection:"row"
  },
  buttonText:{
    color:"#fff",
    fontSize: 15,
    lineHeight: 30,
    height: 36
  }
});

const NewPlatform = {
  OS:Platform.OS,
  isIOS:Platform.OS === 'ios',
  isAndroid:Platform.OS === 'android',
  Version:Platform.Version
};

module.exports.Button = Button;
module.exports.ToggleButton = ToggleButton;
module.exports.TextInput = NewTextIntput;
module.exports.TextArea = TextArea;
module.exports.Picker = Picker;
module.exports.Switch = Switch;
module.exports.TouchableHighlight = NewTouchableHighlight;
module.exports.TouchableOpacity = NewTouchableOpacity;
module.exports.RadioSelect = RadioSelect;
module.exports.Platform = NewPlatform;
