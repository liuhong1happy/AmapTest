import types from '../constants/ActionTypes';
import timeTypes from '../constants/TimeTypes';

const times = [
  { id: 1, type: timeTypes.ONLY_WORK, before: true, time: '9:00', position: null, enabled: true, createTime: Date.now(),  title: "上班", unhandle: '迟到', users: null, del: false },
  { id: 2, type: timeTypes.ONLY_WORK, before: false, time: '18:00', position: null, enabled: true, createTime: Date.now(),  title: "下班", unhandle: '早退', users: null, del: false },
  { id: 3, type: timeTypes.ONLY_WORK, before: true, time: '20:00', position: null, enabled: true, createTime: Date.now(),  title: "加班", unhandle: '未加班', users: null, del: false },
];

export default function (state = times, action) {
  const { type, payload } = action;
  switch (type) {
    case types.times.ADD_TIME:
      state.push({ ...payload, del: false, id: state.length + 1, createTime: Date.now()});
      return [...state ];
    case types.times.REMOVE_TIME:
      state[payload] = { ...state[parseInt(payload.id) - 1], del: true, createTime: Date.now()}
      return [...state ];
    case types.times.UPDATE_TIME:
      state.splice(parseInt(payload.id)-1, 1, payload.data);
      return [...state ];
    default:
      return [...state ];
  }
}