import React, { Component } from 'react';
import { Alert, View, Text, StyleSheet, Switch, ScrollView, TimePickerAndroid, Modal, FlatList, TextInput } from 'react-native';
import { connect } from 'react-redux';
import AMapView, { MyLocationStyle, MarkerOptions, PolylineOptions } from 'react-native-amap';
import ToolBar from '../base/react-native-toolbar';
import { RouteHistory } from '../base/react-native-router';
import Dimensions from '../base/react-native-dimensions';
import { TouchableOpacity } from '../base/react-native-components';
import TimeTypes, { TimeTypesArray } from '../../constants/TimeTypes';
import TimeActions from '../../actions/times';

/**
 * a 参考时间
 * b 当前时间
 */
const calTime = (a, bTime = Date.now()) => {
    const aTime = new Date(a).valueOf();
    let str = aTime<bTime ? "已过" : "还剩";
    const abs = Math.abs(aTime - bTime);
    if(abs< 1000*60) {
        str += Math.round(abs / 1000)+'秒';
    } else if(abs < 1000*3600) {
        str += Math.round(abs / 1000 / 60)+'分';
    } else if(abs < 1000*3600 * 24) {
        str += Math.round(abs / 1000 / 3600)+'时';
    } else {
         str += Math.round(abs / 1000 / 3600 / 24)+'天';
    }
    return str;
}

class HomeNewPage extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            myLocationStyle: new MyLocationStyle({ showMarker: false, type: MyLocationStyle.LOCATION_TYPE_FOLLOW_NO_CENTER }),
            myLocationMarker: new MarkerOptions()
        };
    }
    onCameraChange({ nativeEvent }) {

    }
    onMyLocationChange({ nativeEvent : {latitude, longitude} }) {
      const myLocationMarker = { ...this.state.myLocationMarker, position:  { latitude, longitude }};
      this.setState({ 
          myLocationMarker
      })
    }

    onSubmitPress(time) {
           const flagTime = new Date();
           const timeTime = new Date().Format('yyyy/MM/dd')+' ' + time.time;
           const isUnhandle = (time.before && new Date(timeTime)<=flagTime) || (!time.before && new Date(timeTime)>=flagTime);
           if(isUnhandle) {
               // 你已经过了当前打卡时间
               const unhandleString = "你已经"+time.unhandle+"了。";
               Alert.alert('提醒', unhandleString, [ { text: "确定", onPress: ()=> {}}]);
               return;
           } else {
               Alert.alert('提醒', "打卡成功", [ { text: "确定", onPress: ()=> {}}]);
           }
    }
    render() {
        const { times, id } = this.props;
        const time = times[parseInt(id)-1];
        const timeMarker = new MarkerOptions({ position: time.position});
        const { myLocationMarker, myLocationStyle } = this.state;
        const markers = [];
        if(timeMarker.position) markers.push(timeMarker);
        if(myLocationMarker.position) markers.push(myLocationMarker);
        const format = new Date().Format('yyyy/MM/dd');
        return (
            <View style={styles.flex}>
                <ToolBar title={time.title + " " + time.time } 
                actions={[{title: '确定', name: 'ok'}]} onActionPress={()=>this.onSubmitPress(time)}
                navIcon={{title: "返回"}} onNavIconPress={()=>RouteHistory.popRoute()}/>
                <AMapView style={styles.map}  markers={markers}
                myLocationEnabled  onCameraChange={(e)=>this.onCameraChange(e)}
                showMyLocationButton  onMyLocationChange={(e)=>this.onMyLocationChange(e)} 
                myLocationStyle={myLocationStyle} />
                <View style={styles.content}>
                    <View>
                        <Text>{timeMarker.position ?  "你打卡的位置：经纬"+timeMarker.position.latitude.toFixed(6)+","+ timeMarker.position.longitude.toFixed(6) : "该打卡未设置位置" }</Text>
                    </View>
                    <View>
                        <Text>{myLocationMarker.position ?  "你当前的位置：经纬"+myLocationMarker.position.latitude.toFixed(6)+","+ myLocationMarker.position.longitude.toFixed(6) : "暂未定位" }</Text>
                    </View>
                    <View>
                        <Text>{ "距离打开时间"+ calTime(format+" "+ time.time) }</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    flex: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#f0f0f0'
    },
    map: {
        position: 'absolute',
        top: Dimensions.toolBarHeight,
        bottom: 50,
        left: 0,
        right: 0,
        backgroundColor: '#f0f0f0'
    },
    content: {
        position: 'absolute',
        // top: Dimensions.toolBarHeight,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingHorizontal: 10
    }
});

export default connect((state)=>state, TimeActions)(HomeNewPage);
