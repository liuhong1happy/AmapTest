import { Dimensions, StatusBar, Platform } from 'react-native';

export const { width, scale, height } = Dimensions.get("window");
export const isIOS = Platform.OS === "ios";
export const statusBarHeight = isIOS ? 20 : StatusBar.currentHeight;

const NewDimensions = {
  get:Dimensions.get,
  screenWidth:width,
  screenHeight:height,
  width,
  height,
  scale,
  statusBarHeight, // 状态栏高度
  toolBarHeight: 48, // 工具条高度
  tabBarHeight: 54, // 导航条高度
  contentHeight:height - statusBarHeight, // 内容高度
};

export default NewDimensions;
