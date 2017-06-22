import { ToastAndroid } from 'react-native';

const RNToast = {
  showAndroid(msg, duration, position) {
    ToastAndroid.showWithGravity(msg, duration, position);
  }
};

export default {
  show(msg = '', duration = ToastAndroid.LONG, position = ToastAndroid.BOTTOM) {
    RNToast.showAndroid(msg, duration, position);
  }
};


