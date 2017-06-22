import React from 'react';
import {
    AppRegistry,
    ToastAndroid,
} from 'react-native';

import ErrorUtils from "ErrorUtils";

import MainApp from './common/main';

ErrorUtils.setGlobalHandler((e)=>{
    ToastAndroid.show('系统异常', ToastAndroid.LONG);
});

const Application = () => <MainApp />;

AppRegistry.registerComponent('AmapTest', () => Application);