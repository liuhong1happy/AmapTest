import { Alert } from 'react-native';
import types from '../constants/ActionTypes';
import { setState } from './common';
import { RouteHistory } from '../components/base/react-native-router';

export const updateTimeAction = function (payload) {
  return { type: types.times.UPDATE_TIME, payload };
};

export const newTimeAction = function (payload) {
  return { type: types.times.ADD_TIME, payload };
};

export const updateTime = (data) => (dispatch) => {
  dispatch(setState({ savingTime: true}));
  dispatch(updateTimeAction(data));
  dispatch(setState({ savingTime: false}));
  Alert.alert("提示", "修改打卡成功", [{ text: "确定", onPress: ()=> {
      RouteHistory.popRoute();
  }}]);
};

export const newTime = (data) => (dispatch) => {
  dispatch(setState({ savingTime: true}));
  dispatch(newTimeAction(data));
  dispatch(setState({ savingTime: false}));
  Alert.alert("提示", "新增打卡成功", [{ text: "确定", onPress: ()=> {
      RouteHistory.popRoute();
  }}]);
};

export default {
  newTime,
  updateTime,
};
