package com.cunyutech.hollyliu.amap;

import android.app.Activity;
import android.content.res.Resources;
import android.graphics.Color;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorListener;
import android.hardware.SensorManager;
import android.location.Location;
import android.util.Log;

import com.amap.api.maps.AMap;
import com.amap.api.maps.CameraUpdate;
import com.amap.api.maps.CameraUpdateFactory;
import com.amap.api.maps.LocationSource;
import com.amap.api.maps.MapView;
import com.amap.api.maps.model.CameraPosition;
import com.amap.api.maps.model.LatLng;
import com.amap.api.maps.model.Marker;
import com.amap.api.maps.model.MarkerOptions;
import com.amap.api.maps.model.MyLocationStyle;
import com.amap.api.maps.model.Polyline;
import com.amap.api.maps.model.PolylineOptions;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import static android.content.Context.SENSOR_SERVICE;

/**
 * Created by liuhong on 2017/6/21.
 */

public class RCTAMapView extends MapView implements AMap.OnMyLocationChangeListener, AMap.OnCameraChangeListener, SensorEventListener {

    //初始化地图控制器对象
    private AMap aMap = null;
    private Polyline polyline = null;

    private HashMap<String,Polyline> polylineHashMap = new HashMap<String,Polyline>();
    private HashMap<String,Marker> markHashMap = new HashMap<String,Marker>();

    private SensorManager mSM;
    private Sensor mSensor;

    public RCTAMapView(ThemedReactContext context) {
        super(context);
        this.onCreate(context.getCurrentActivity().getIntent().getExtras());
        this.Init();
        this.Init2(context.getCurrentActivity());
    }

    private void Init() {
        if (aMap == null) {
            aMap = this.getMap();
        }
        aMap.setMyLocationEnabled(true); // 开启定位
        aMap.animateCamera(CameraUpdateFactory.zoomTo(17));

        MyLocationStyle myLocationStyle = new MyLocationStyle();
        myLocationStyle.myLocationType(MyLocationStyle.LOCATION_TYPE_LOCATE) ;//定位一次，且将视角移动到地图中心点。
        myLocationStyle.showMyLocation(true);
        aMap.setMyLocationStyle(myLocationStyle);//设置定位蓝点的Style
        aMap.setOnMyLocationChangeListener(this); // 默认开启定位监听
        aMap.setOnCameraChangeListener(this); // 开启照相机定位监听
    }

    private void Init2 (Activity activity) {
        mSM = (SensorManager)activity.getSystemService(SENSOR_SERVICE);
        mSensor = mSM.getDefaultSensor(Sensor.TYPE_ORIENTATION);
        mSM.registerListener(this, mSensor, SensorManager.SENSOR_DELAY_UI);//注册回调函数
    }


    // 设定CameraUpdate
    public void setAnimateCamera(CameraUpdate cameraUpdate) {
        if(aMap!=null) {
            aMap.animateCamera(cameraUpdate);
        }
    }
    // 设置定位样式
    public void  setMyLocationStyle(MyLocationStyle style) {
        if(aMap!=null) {
            aMap.setMyLocationStyle(style);
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

        WritableMap event = Arguments.createMap();
        event.putDouble("latitude", location.getLatitude());
        event.putDouble("longitude", location.getLongitude());
        event.putDouble("altitude", location.getAltitude());
        event.putDouble("accuracy", location.getAccuracy());
        event.putDouble("bearing", location.getBearing());
        event.putDouble("speed", location.getSpeed());
        event.putString("provider", location.getProvider());
        event.putString("address",location.getExtras().getString("Address"));

        ReactContext reactContext = (ReactContext)getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(), "myLocationChange", event);

        Log.println(Log.INFO, "location", location.toString());


    }
    // 开启显示室内地图
    public void setShowIndoorMapEnabled(boolean flag) {
        if(aMap!=null) {
            aMap.showIndoorMap(flag);
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
    @Override
    public void onCameraChange(CameraPosition cameraPosition) {
        WritableMap target = Arguments.createMap();
        target.putDouble("latitude", cameraPosition.target.latitude);
        target.putDouble("longitude", cameraPosition.target.longitude);

        WritableMap location = Arguments.createMap();
        Location location1 = aMap.getMyLocation();
        if(location1!=null) {
            target.putDouble("latitude", location1.getLatitude());
            target.putDouble("longitude", location1.getLongitude());
        }

        WritableMap event = Arguments.createMap();
        event.putMap("target", target);
        event.putMap("location", location);
        event.putDouble("zoom", cameraPosition.zoom);
        event.putDouble("tilt", cameraPosition.tilt);
        event.putDouble("bearing", cameraPosition.bearing);
        event.putBoolean("isAbroad", cameraPosition.isAbroad);

        ReactContext reactContext = (ReactContext)getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(), "cameraChange", event);

    }
    @Override
    public void onCameraChangeFinish(CameraPosition cameraPosition) {

    }
    // 添加折线
    public String addPolyline(PolylineOptions options) {
        if(aMap!=null) {
            Polyline polyline = aMap.addPolyline(options);
            String id = polyline.getId();
            // 加入哈希列表
            polylineHashMap.put(id, polyline);
            return id;
        }
        return "";
    }
    // 更新折线
    public String setPolylineOptions(String pId, PolylineOptions options) {
        Polyline polyline = polylineHashMap.get(pId);
        if(aMap!=null && polyline!=null) {
            polyline.setOptions(options);
            return polyline.getId();
        }
        return "";
    }
    // 删除折线
    public void removePolyline(String pId) {
        Polyline polyline = polylineHashMap.get(pId);
        if(aMap!=null && polyline!=null) {
            polyline.remove();
        }
    }
    // 添加标志
    public String addMarker(MarkerOptions options) {
        if(aMap!=null) {
            Marker marker = aMap.addMarker(options);
            String id = polyline.getId();
            // 加入哈希列表
            markHashMap.put(id, marker);
            return id;
        }
        return "";
    }
    // 更新标志
    public String setMarkerOptions(String pId, MarkerOptions options) {
        Marker marker = markHashMap.get(pId);
        if(aMap!=null && marker!=null) {
            marker.setMarkerOptions(options);
            return marker.getId();
        }
        return "";
    }
    // 删除标记
    public void removeMarker(String pId) {
        Marker marker = markHashMap.get(pId);
        if(aMap!=null && marker!=null) {
            marker.remove();
        }
    }
    // 获取定位
    public Location getMyLocation() {
        if(aMap!=null)
            return aMap.getMyLocation();
        else return null;
    }

    @Override
    public void onSensorChanged(SensorEvent sensorEvent) {
        if (sensorEvent.sensor.getType() == Sensor.TYPE_ORIENTATION) {
            float degree = sensorEvent.values[0];
            float bearing = aMap.getCameraPosition().bearing;
            aMap.setMyLocationRotateAngle((-degree + bearing + 360) % 360);
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int i) {

    }
}
