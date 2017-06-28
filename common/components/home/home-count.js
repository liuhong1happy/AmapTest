import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { connect } from 'react-redux';
import ToolBar from '../base/react-native-toolbar';
import { RouteHistory } from '../base/react-native-router';
import { TouchableOpacity } from '../base/react-native-components';

class HomeCountPage extends Component {
    renderItem(item) {
        return (<View style={styles.renderItem}>
            <Text style={styles.title}>{item.title + "打卡"}</Text>
            <Text>{"你已累计打卡"+item.timeCount+"次"}</Text>
            <Text>{"你已累计"+item.unhandle+item.ontimeCount+"次"}</Text>
        </View>)
    }
    handlePress(id) {
        if(id===0) {
            RouteHistory.pushRoute('/home/new');
        } else {
            RouteHistory.pushRoute('/home/new?update=1&id='+id);
        }
    }
    render() {
        const times = this.props.times;
        return (
            <View style={styles.flex}>
                <ToolBar title="打卡统计" navIcon={{title: "返回"}} onNavIconPress={()=>RouteHistory.popRoute()}/>
                <ScrollView style={styles.scrollView}>
                    <View>
                        <Text style={styles.listTitle}>打卡列表</Text>
                        <View style={styles.container}>
                            <FlatList numColumns={3} data={times.concat({ id: 0, title: "新增" })} 
                                renderItem={({item}) => 
                                    (<TouchableOpacity key={item.id} style={[styles.block, item.id===0 ? styles.bGray : {}]} onPress={()=>this.handlePress(item.id)}>
                                    <Text style={styles.blockTitle}>{item.title}</Text>
                                    </TouchableOpacity>)} />
                        </View>
                    </View>
                    <View>
                        <Text style={styles.listTitle}>打开统计</Text>
                        <View style={styles.container}>
                            <FlatList data={times} renderItem={({item}) => this.renderItem(item)} />
                        </View>
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
    block: {
        backgroundColor: '#0099ff',
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 5
    },
    blockTitle: {
        color: 'white'
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
    bGray: {
        backgroundColor: 'gray'
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
});

export default connect((state)=>{
    const data = state.data;
    const times = state.times.filter(t=>!t.del);
    return {
        times: times.map(t=>{
            const tData = data.filter(d=>d.timeId===t.id);
            const onTimeData = tData.filter(d=>!d.isOnTime);
            return {
                ...t,
                timeCount: tData.length,
                ontimeCount: onTimeData.length
            }
        }),
    }
}, undefined)(HomeCountPage);