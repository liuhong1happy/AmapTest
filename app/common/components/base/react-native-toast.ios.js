import Toast from 'react-native-root-toast';
import { Platform } from 'react-native';

const RNToast = {
  showIOS(msg, duration, position) {
    // Add a Toast on screen.
    Toast.show(msg, {duration,position,shadow: true,animation: true,hideOnPress: true,delay: 0});
  },
};

export default {
  show(msg = '', duration = Toast.durations.LONG, position = Toast.positions.BOTTOM) {
    Platform.OS === "ios" && RNToast.showIOS(msg, duration, position);
  }
};


