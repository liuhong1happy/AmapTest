import { Alert } from 'react-native';
import {
     Navigator  
} from 'react-native-deprecated-custom-components';
import { RouteHistory } from '../components/base/react-native-router';
import Toast from '../components/base/react-native-toast';
import types from '../constants/ActionTypes';

export const fetchMsgAction = function (msg) {
  Toast.show(msg);
  return { type: types.common.FETCH_MSG, msg };
};

export const confirmAction = function (msg, callback) {
  Alert.alert("提示", msg, [{ text: '确定', onPress: callback }, { text: '取消', onPress: () => {} }]);
  return { type: types.common.COMFIRM_MSG, msg };
};

export const fetchRedirectAction = function (payload) {
  payload.type = payload.type || "pushRoute";
  payload.name = payload.name || "/home/index";
  payload.index = payload.index || 0;
  payload.config = payload.config;
  RouteHistory.ready(() => {
    RouteHistory[payload.type](payload.name, payload.index, payload.config);
  });
  return { type: types.common.FETCH_REDIRECT, payload };
};

export const setState = function (state) {
  return { type: types.common.SET_STATE, state };
};

export default {
  fetchRedirectAction,
  fetchMsgAction,
  confirmAction,
  setState
};
