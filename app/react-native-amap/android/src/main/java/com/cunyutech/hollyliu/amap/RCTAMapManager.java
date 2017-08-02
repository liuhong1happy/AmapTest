package com.cunyutech.hollyliu.amap;

import android.os.Handler;

import com.amap.api.maps.AMap;
import com.amap.api.maps.CameraUpdateFactory;
import com.amap.api.maps.model.MarkerOptions;
import com.amap.api.maps.model.MyLocationStyle;
import com.amap.api.maps.model.PolygonOptions;
import com.amap.api.maps.model.PolylineOptions;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Nullable;

/**
 * Created by liuhong on 2017/6/21.
 */

public class RCTAMapManager extends ViewGroupManager<RCTAMapView>
{

    private List<String> markerIds = new ArrayList<String>();
    private List<String> polylineIds = new ArrayList<String>();
    private ThemedReactContext mReactContext = null;


    @Override
    public String getName() {
        return "RCTAMapView";
    }

    @Override
    protected RCTAMapView createViewInstance(ThemedReactContext reactContext) {
        RCTAMapView map = new RCTAMapView(reactContext);
        mReactContext = reactContext;
        return map;
    }

    @Override
    protected void addEventEmitters(final ThemedReactContext reactContext, final RCTAMapView view) {

    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .put("cameraChange", MapBuilder.of("registrationName", "onCameraChange"))
                .put("rotateChange", MapBuilder.of("registrationName", "onRotateChange"))
                .put("myLocationChange", MapBuilder.of("registrationName", "onMyLocationChange"))
                .build();
    }

    @ReactProp(name = "myLocationEnabled", defaultBoolean = true)
    public void setMyLocationEnabled(RCTAMapView view, boolean flag) {
        view.setMyLocationEnabled(flag);
    }

    @ReactProp(name = "myLocationStyle")
    public void setMyLocationStyle(RCTAMapView view, @Nullable ReadableMap style) {
        if(style!=null) {
            MyLocationStyle myLocationStyle = RCTAMapUtils.parseMyLocationStyle(style);
            view.setMyLocationStyle(myLocationStyle);
        }
    }

    @ReactProp(name = "showMyLocationButton", defaultBoolean = true)
    public void setMyLocationButtonEnabled(RCTAMapView view, boolean flag) {
        view.setMyLocationButtonEnabled(flag);
    }

    @ReactProp(name = "showIndoorMap", defaultBoolean = true)
    public void setShowIndoorMapEnabled(RCTAMapView view, boolean flag) {
        view.setShowIndoorMapEnabled(flag);
    }

    @ReactProp(name = "mapType", defaultInt = AMap.MAP_TYPE_NORMAL)
    public void setMapType(RCTAMapView view, int type) {
        view.setMapType(type);
    }

    @ReactProp(name = "showCompass", defaultBoolean = true)
    public void setCompassEnabled(RCTAMapView view, boolean flag) {
        view.setCompassEnabled(flag);
    }

    @ReactProp(name = "showScaleControls", defaultBoolean = true)
    public void setScaleControlsEnabled(RCTAMapView view, boolean flag) {
        view.setScaleControlsEnabled(flag);
    }

    @ReactProp(name = "polylines")
    public void setPolylines(RCTAMapView view, @Nullable ReadableArray polylines) {
        if(polylines!=null) {
            int count = polylines.size();
            for(int i=0;i<count;i++) {
                PolylineOptions polylineOptions = RCTAMapUtils.parsePolylineOptions(polylines.getMap(i), mReactContext);
                if(polylineIds.size()<count) {
                    polylineIds.add(i, view.addPolyline(polylineOptions));
                } else {
                    String pId = polylineIds.get(i);
                    String newPId = view.setPolylineOptions(pId, polylineOptions);
                    if(!newPId.equals(pId)) {
                        markerIds.set(i, newPId);
                    }
                }
            }
            if(polylineIds.size()>count) {
                for(int i=polylineIds.size()-1;i>count;i--) {
                    view.removePolyline(polylineIds.get(i));
                    polylineIds.remove(i);
                }
            }
        }
    }

    @ReactProp(name = "markers")
    public void setMarkers(RCTAMapView view, @Nullable ReadableArray markers) {
        if(markers!=null) {
            int count = markers.size();
            // 重置所有标记
            for(int i=0;i<count;i++) {
                MarkerOptions markerOptions = RCTAMapUtils.parseMarkerOptions(markers.getMap(i), mReactContext);
                if(markerIds.size()<count) {
                    markerIds.add(i, view.addMarker(markerOptions));
                } else {
                    String pId = markerIds.get(i);
                    String newPId = view.setMarkerOptions(pId, markerOptions);
                    if(!newPId.equals(pId)) {
                        markerIds.set(i, newPId);
                    }
                }
            }
            // 移除多余的标记
            if(markerIds.size()>count) {
                for(int i=markerIds.size()-1;i>=count;i--) {
                    view.removeMarker(markerIds.get(i));
                    markerIds.remove(i);
                }
            }
        }
    }
}
