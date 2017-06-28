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

class HomeNewPage extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            myLocationStyle: new MyLocationStyle({ showMarker: false, type: MyLocationStyle.LOCATION_TYPE_FOLLOW_NO_CENTER }),
            centerMarker: new MarkerOptions(),
            formData: {},
            listModalVisible: false,
            modalSelectedValue: 0
        };
    }
    onCameraChange({ nativeEvent }) {
      const centerMarker = { ...this.state.centerMarker, position:  nativeEvent.target};
      this.setState({ 
          centerMarker
      })
    }
    onMyLocationChange(e) {

    }
    onValueChange(name, value) {
        const { formData } = this.state;
        formData[name] = value;
        this.setState({
            formData
        })
    }

    handlePress (name, value) {
        switch(name) {
            case 'time':
                const params = value.split(':');
                TimePickerAndroid.open({
                    hour: parseInt(params[0]),
                    minute: parseInt(params[1]),
                    is24Hour: true, // 会显示为'2 PM'
                }).then(({action, hour, minute})=>{
                    if (action !== TimePickerAndroid.dismissedAction) {
                        // 这里开始可以处理用户选好的时分两个参数：hour (0-23), minute (0-59)
                        this.onValueChange('time', hour+":"+ minute)
                    }
                }).catch(({code, message}) => {
                    console.warn('Cannot open time picker', message);
                })
            break;
        }
    }
    renderModalItem(item, selected) {
        return (<TouchableOpacity key={item.value} style={styles.modalItem} onPress={()=>this.setState({ modalSelectedValue: item.value })}>
            <View style={[styles.dot, selected ? styles.blue : {}]}></View>
            <Text style={styles.title}>{item.title}</Text>
        </TouchableOpacity>)
    }
    renderListModal() {
        const {
            listModalVisible,
            modalSelectedValue,
            formData
        } = this.state;
        return (<Modal
            animationType={"slide"}
            transparent={false}
            visible={listModalVisible}
            onRequestClose={() => this.setState({ listModalVisible : false})}
          >
            <ToolBar title="选择频率" 
            actions={[{title: '确定', name: 'ok'}]} onActionPress={()=>{
                formData["type"] = modalSelectedValue;
                this.setState({ listModalVisible : false, formData })}
            }
            navIcon={{title: "返回"}} onNavIconPress={()=> this.setState({ listModalVisible : false})}/>
            <ScrollView style={styles.typeModalContainer}>
                <FlatList keyExtractor={(t)=>t.value} data={[...TimeTypesArray]} renderItem={({item}) => this.renderModalItem(item, item.value === modalSelectedValue)} />
            </ScrollView>
        </Modal>)
    }

    openModal(value) {
        this.setState({
            listModalVisible: true,
            modalSelectedValue: value
        })
    }
    onSubmitPress() {
        const { update, times, id, newTime, updateTime } = this.props;
        const { formData, centerMarker } = this.state;
        const time = update ? times[parseInt(id)-1] : { time: new Date().Format('hh:mm') };
        const data = {...time, ...formData, position: centerMarker.position};
        // 数据校验
        if(!data.title || !data.unhandle) {
            Alert.alert('提示', '请填写好名称和标记', [{text:"确定", onPress:()=>{}}]);
            return;
        }
        // 提交数据
        if(update) {
            updateTime({
                id,
                data
            })
        } else {    
            newTime(data);
        }
    }
    render() {
        const { update, times, id } = this.props;
        const time = update ? times[parseInt(id)-1] : { time: new Date().Format('hh:mm') };
        const { myLocationStyle, centerMarker, formData } = this.state;
        const { latitude, longitude } = centerMarker.position;

        const fEnabled = formData.enabled!==undefined ? formData.enabled : time.enabled;
        const fTime = (formData.time!==undefined ? formData.time : time.time);
        const fType = (formData.type!==undefined ? formData.type : time.type) || 0;
        const fBefore = formData.before!==undefined ? formData.before : time.before;
        const fTitle = formData.title!==undefined ? formData.title : time.title;
        const fUnhandle = formData.unhandle!==undefined ? formData.unhandle : time.unhandle;
        return (
            <View style={styles.flex}>
                {
                    this.renderListModal()
                }
                <ToolBar title={ update ? "修改打卡" : "新增打卡"} 
                    actions={[{title: '确定', name: 'ok'}]} onActionPress={()=>this.onSubmitPress()}
                    navIcon={{title: "返回"}} onNavIconPress={()=>RouteHistory.popRoute()}/>
                <AMapView style={styles.map}  markers={[centerMarker]}
                myLocationEnabled  onCameraChange={(e)=>this.onCameraChange(e)}
                showMyLocationButton  onMyLocationChange={(e)=>this.onMyLocationChange(e)} 
                myLocationStyle={myLocationStyle} />
                <ScrollView style={styles.scrollView}>
                    <View>
                        <Text>{centerMarker.position ?  "你选择的位置：经纬"+latitude.toFixed(6)+","+ longitude.toFixed(6) : "请在上方地图选择打卡位置" }</Text>
                    </View>
                    <View style={styles.block}>
                        <Text>启用</Text>
                        <Switch value={fEnabled} onValueChange={(value)=>this.onValueChange('enabled', value)}/>
                    </View>
                    <View style={styles.block}>
                        <Text>提前</Text>
                        <Switch value={fBefore} onValueChange={(value)=>this.onValueChange('before', value)}/>
                    </View>
                    <TouchableOpacity style={styles.block} onPress={()=>this.handlePress('time', fTime)}>
                        <Text>时间</Text>
                        <Text>{ fTime + " >"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.block} onPress={()=>this.openModal(fType)}>
                        <Text>频率</Text>
                        <Text>{ TimeTypesArray[fType || 0].title }</Text>
                    </TouchableOpacity>
                    <View style={styles.block} onPress={()=>this.openModal(fType)}>
                        <Text>名称</Text>
                        <TextInput style={styles.textinput} value={fTitle} placeholder="请填写打卡名称" underlineColorAndroid="transparent" onChangeText={(value)=>this.onValueChange('title', value)} />
                    </View>
                     <View style={styles.block} onPress={()=>this.openModal(fType)}>
                        <Text>标记</Text>
                        <TextInput style={styles.textinput} value={fUnhandle} placeholder="请填写标记" underlineColorAndroid="transparent" onChangeText={(value)=>this.onValueChange('unhandle', value)} />
                    </View>
                </ScrollView>
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
        width: Dimensions.screenWidth,
        height: Dimensions.screenWidth / 2
    },
    block: {
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#ddd'
    },
    modalItem: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottomWidth:1 ,
        borderColor: '#ddd'
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginHorizontal: 10
    },
    blue: {
        backgroundColor: 'blue'
    },
    typeModalContainer: {
        backgroundColor: '#f0f0f0'
    },
    title: {
        color: '#333',
        fontSize: 20,
        paddingVertical: 10,
    },
    textinput: {
        borderWidth: 0,
        paddingHorizontal: 0,
        paddingVertical: 0,
        flex: 1,
        textAlign: 'left',
        marginLeft: 10
    }
});

export default connect((state)=>state, TimeActions)(HomeNewPage);