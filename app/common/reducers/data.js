import types from '../constants/ActionTypes';
import timeTypes from '../constants/TimeTypes';

const data = [
  { id: 1,  timeId: 1, createTime: new Date('2017/06/28 9:05').valueOf(), isOnTime: false, format: '2017/06/28' },
  { id: 2,  timeId: 2, createTime: new Date('2017/06/28 19:05').valueOf(), isOnTime: true, format: '2017/06/28' },
];

export default function (state = data, action) {
  const { type, payload } = action;
  switch (type) {
    default:
      return state;
  }
}