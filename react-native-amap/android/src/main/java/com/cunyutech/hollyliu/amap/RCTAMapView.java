package com.cunyutech.hollyliu.amap;

import android.location.Location;
import android.util.Log;

import com.amap.api.maps.AMap;
import com.amap.api.maps.LocationSource;
import com.amap.api.maps.MapView;
import com.amap.api.maps.model.MyLocationStyle;
import com.facebook.react.uimanager.ThemedReactContext;

/**
 * Created by liuhong on 2017/6/21.
 */

public class RCTAMapView extends MapView implements AMap.OnMyLocationChangeListener {

    //初始化地图控制器对象
    private AMap aMap = null;
    private MyLocationStyle myLocationStyle = null;

    public RCTAMapView(ThemedReactContext context) {
        super(context);
        this.onCreate(context.getCurrentActivity().getIntent().getExtras());
        this.Init();
    }

    public void Init() {
        if (aMap == null) {
            aMap = this.getMap();
        }
        if (myLocationStyle == null) {
            myLocationStyle = new MyLocationStyle();
            myLocationStyle.myLocationType(MyLocationStyle.LOCATION_TYPE_LOCATE); // 定位一次，且将视角移动到地图中心点
        }
        aMap.setMyLocationStyle(myLocationStyle);
        aMap.setMyLocationEnabled(true); // 默认开启定位
        aMap.setOnMyLocationChangeListener(this); // 默认开启定位监听
        aMap.showIndoorMap(true); //默认显示室内地图
        aMap.getUiSettings().setMyLocationButtonEnabled(true); // 默认显示定位按钮
        aMap.getUiSettings().setCompassEnabled(true); // 默认显示指南针罗盘
        aMap.getUiSettings().setScaleControlsEnabled(true); // 默认显示比例尺控件
    }

    // 设置定位方式
    public void  setMyLocationStyle(int type) {
        if(myLocationStyle!=null) {
            myLocationStyle.myLocationType(type);
        }
    }
    // 设置定位间隔，单位毫秒
    public void setMyLocationStyleInterval(long interval) {
        if(myLocationStyle!=null) {
            myLocationStyle.interval(interval);
        }
    }

    // 设置定位蓝点精度圆圈的边框颜色
    public void setMyLocationStyleStrokeColor(int color) {
        if(myLocationStyle!=null) {
            myLocationStyle.strokeColor(color);
        }
    }

    // 设置定位蓝点精度圆圈的填充颜色
    public void setMyLocationStyleRadiusFillColor(int color) {
        if(myLocationStyle!=null) {
            myLocationStyle.radiusFillColor(color);
        }
    }

    // 设置定位蓝点图标的锚点
    public void setMyLocationStyleAnchor(float u, float v) {
        if(myLocationStyle!=null) {
            myLocationStyle.anchor(u, v);
        }
    }

    // 设置定位蓝点精度圈的边框宽度
    public void setMyLocationStyleStrokeWidth(float width) {
        if(myLocationStyle!=null) {
            myLocationStyle.strokeWidth(width);
        }
    }

    // 开启定位
    public void setMyLocationEnabled(boolean flag) {
        if(aMap!=null) {
            aMap.setMyLocationEnabled(flag);
        }
    }

    @Override
    public void onMyLocationChange(Location location) {
        Log.println(Log.INFO, "location", location.toString());
    }

    // 开启显示室内地图
    public void setShowIndoorMapEnabled(boolean flag) {
        if(aMap!=null) {
            aMap.showIndoorMap(flag);
        }
    }
    // 开启显示定位蓝点
    public void setShowMyLocationEnabled(boolean flag) {
        if(myLocationStyle!=null) {
            myLocationStyle.showMyLocation(flag);
        }
    }

    // 开启定位按钮
    public void setMyLocationButtonEnabled(boolean flag) {
        if(aMap!=null) {
            aMap.getUiSettings().setMyLocationButtonEnabled(flag);
        }
    }

    // 设置地图类型：白昼地图、夜景地图、卫星图、导航地图
    public void setMapType(int type) {
        if(aMap!=null) {
            aMap.setMapType(type);
        }
    }
    // 开启显示指南针罗盘
    public void setCompassEnabled(boolean flag) {
        if(aMap!=null) {
            aMap.getUiSettings().setCompassEnabled(flag);
        }
    }

    // 开启显示比例尺控件
    public void setScaleControlsEnabled(boolean flag) {
        if(aMap!=null) {
            aMap.getUiSettings().setScaleControlsEnabled(flag);
        }
    }
}
