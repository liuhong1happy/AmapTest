import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, ScrollView, FlatList, Text, Alert } from 'react-native';
import {connect} from 'react-redux';
import { AnimationUtils } from 'react-native-amap';
import ToolBar from '../base/react-native-toolbar';
import TimeTypes, { TimeTypesArray } from '../../constants/TimeTypes';
import Dimensions from '../base/react-native-dimensions';
import { TouchableOpacity } from '../base/react-native-components';
import { RouteHistory } from '../base/react-native-router';
import TabBars from '../base/tabbars';


/**
 * a 参考时间
 * b 当前时间
 */
const calTime = (a, bTime = Date.now()) => {
    const aTime = new Date(a).valueOf();
    let str = aTime<bTime ? "已过" : "还剩";
    let abs = Math.abs(aTime - bTime);
    while(abs>=1000) {
        if(abs< 1000*60) {
            str += Math.round(abs / 1000)+'秒';
            abs = abs % 1000;
        } else if(abs < 1000*3600) {
            str += Math.round(abs / 1000 / 60)+'分';
            abs = abs % (1000*60);
        } else if(abs < 1000*3600 * 24) {
            str += Math.round(abs / 1000 / 3600)+'时';
            abs = abs % (1000*3600);
        } else {
            str += Math.round(abs / 1000 / 3600 / 24)+'天';
            abs = abs % (1000*3600*24);
        }
    }
    return str;
}

class HomeIndexView extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            now: Date.now()
        }
    }
    
    componentDidMount() {
        AnimationUtils.addListener('HomeIndexView', ()=>{
            if( Date.now() - this.state.now >= 1000) {
                this.setState({
                    now: Date.now()
                })
            }
        })
    }

    componentWillUnmount() {
        AnimationUtils.removeListener('HomeIndexView');
    }
    
    
    renderItem(item, nowDate) {
       const time = new Date(item.todayFormat);
       const before = item.before;
       const flag = item.flagData.length > 0;
       if(flag) {
           const flagTime = new Date(item.flagData[0].createTime);
           const isUnhandle = (before && time>=flagTime) || (!before && time<=flagTime)
           item.flagTime = flagTime;
           item.isHandle = isUnhandle;
       }
       const { now } = this.state;
       return (<TouchableOpacity style={styles.renderItem} onPress={()=>this.handlePress('data', {id: item.id, flag })}>
            <View style={[styles.dot, flag ? item.isHandle ? styles.green : styles.red : styles.gray] }></View>
            <View style={[styles.item, styles.content]}>
                <View><Text style={styles.title}>{item.title+"打卡"}</Text></View>
                { flag ? 
                    <View><Text style={styles.black}>{'你打卡的时间' + item.flagTime.Format('yyyy/MM/dd hh:mm')}</Text></View> :  
                    <View><Text style={styles.black}>{'距离打卡时间' + calTime(time, now)}</Text></View>
                }
                { flag ? 
                    <View><Text style={styles.grayColor}>{ item.isHandle ? '恭喜你，你已经打卡完成' : '不好意思，你已经'+item.unhandle }</Text></View> :  
                    <View><Text style={styles.grayColor}>好好工作，天天打卡</Text></View>
                }
            </View>
            <View>
                <Text style={styles.time}>{item.time+' >'}</Text>
            </View>
       </TouchableOpacity>)
    }
    handlePress(name, data) {
        switch(name) {
            case 'data':
                if(data.flag) {
                    Alert.alert('提示', '你已经打过卡了', [ { text: "确定", onPress: ()=> {}}]);
                    return;
                }
                RouteHistory.pushRoute('/home/data?id='+data.id);
                break;
            default:
                break;
        }
    }

    render() {
        const { types } = this.props;
        const nowDate = Date.now();
        return (
            <View style={styles.flex}>
                <ToolBar title="打卡应用" />
                <ScrollView style={styles.scrollView}>
                    <View>
                        <Text style={styles.listTitle}>打卡类型</Text>
                        <View style={styles.container}>
                            <FlatList keyExtractor={(t)=>t.id} data={[...types]} renderItem={({item}) => this.renderItem(item, nowDate)} />
                        </View>
                    </View>
                </ScrollView>
                <TabBars name="/home/index" />
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
    scrollView: {
        position: 'absolute',
        top: Dimensions.toolBarHeight,
        bottom: 0,
        left: 0,
        right: 0
    },
    container:{
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderColor: '#d0d0d0'
    },
    listTitle: {
        marginLeft: 10,
        marginVertical: 15
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginTop: 6,
        marginHorizontal: 5
    },
    gray: {
        backgroundColor: 'gray',
    },
    green: {
        backgroundColor: 'green',
    },
    red: {
        backgroundColor: 'red',
    },
    renderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderColor: '#eee',
        paddingHorizontal: 5,
        paddingVertical: 10
    },
    item: {
        flex: 1
    },
    title: {
        fontSize: 18,
        color: '#333'
    },
    black: {
        fontSize: 16,
        color: '#555'
    },
    grayColor: {
        fontSize: 12,
        color: '#999'
    },
    time: {
        fontSize: 16,
        color: '#999',
        marginRight: 5
    }
});

export default connect((state)=>{
    const types = [];
    const nowDate = new Date();
    const times = state.times.filter(t=>!t.del);
    const format = nowDate.Format('yyyy/MM/dd');
    const day = nowDate.getDay();
    const data = state.data.filter(t=>t.format === format);
    
    times.forEach((t)=> {
        switch(t.type) {
            case TimeTypes.ONLY_ONE:
                if(new Date(t.createTime).Format('yyyy/MM/dd') === format) {
                    types.push({ ...t, todayFormat: format +' '+ t.time, flagData: data.filter(d=>d.timeId === t.id) });
                }
                break;
            case TimeTypes.EVERY_DAY:
                types.push({ ...t, todayFormat: format +' '+ t.time, flagData: data.filter(d=>d.timeId === t.id) });
                break;
            case TimeTypes.ONLY_DAYOFF:
                if(day>=6 && day<=7) {
                    types.push({ ...t, todayFormat: format +' '+ t.time, flagData: data.filter(d=>d.timeId === t.id) });
                }
                break;
            case TimeTypes.INTERVAL:
                const { startDate, intervalDays } = t;
                const startTime = new Date(startDate);
                const endTime = new Date(format);
                const dates = Math.abs((startTime - endTime))/(1000*60*60*24);   
                if(dates%intervalDays===0) {
                    types.push({ ...t, todayFormat: format +' '+ t.time, flagData: data.filter(d=>d.timeId === t.id) });
                }
                break;
            case TimeTypes.ONLY_WORK:
                if(day>=1 && day<=5) {
                    types.push({ ...t, todayFormat: format +' '+ t.time, flagData: data.filter(d=>d.timeId === t.id) });
                }
                break;
        }
    });

    return {
        types
    }
}, undefined)(HomeIndexView);