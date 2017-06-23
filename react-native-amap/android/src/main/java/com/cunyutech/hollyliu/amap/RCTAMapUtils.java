package com.cunyutech.hollyliu.amap;

import com.amap.api.maps.model.LatLng;
import com.amap.api.maps.model.MarkerOptions;
import com.amap.api.maps.model.MyLocationStyle;
import com.amap.api.maps.model.PolylineOptions;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by liuhong on 2017/6/23.
 */

public class RCTAMapUtils {

    public static PolylineOptions parsePolylineOptions(ReadableMap options) {
        float width = (float)options.getDouble("width");
        int color = options.getInt("color");
        Iterable<LatLng> latLngs = parseLatLngs(options.getArray("latLngs"));
        return new PolylineOptions().addAll(latLngs).width(width).color(color);
    }

    public static LatLng parseLatLng(ReadableMap latLng) {
        float latitude = (float) latLng.getDouble("latitude");
        float longitude = (float) latLng.getDouble("longitude");
        return new LatLng(latitude, longitude);
    }

    public static Iterable<LatLng> parseLatLngs(ReadableArray latLngs) {
        List<LatLng> points = new ArrayList<LatLng>();
        for(int i=0;i<latLngs.size();i++) {
            ReadableMap latLng = latLngs.getMap(i);
            points.add(parseLatLng(latLng));
        }
        return points;
    }

    public static MarkerOptions parseMarkerOptions(ReadableMap options) {
        String snippet = options.getString("snippet");
        String title = options.getString("title");
        LatLng latLng = parseLatLng(options.getMap("latLng"));
        return new MarkerOptions().position(latLng).title(title).snippet(snippet);
    }

    public static MyLocationStyle parseMyLocationStyle(ReadableMap options) {
        int type = options.getInt("type");
        float strokeWidth = (float)options.getDouble("strokeWidth");
        int radiusFillColor = options.getInt("fillColor");
        int strokeColor = options.getInt("strokeColor");
        ReadableMap anchor =  options.getMap("anchor");
        float u = (float)anchor.getDouble("u");
        float v = (float)anchor.getDouble("v");
        long interval = (long)options.getInt("interval");
        boolean showMyLocation = options.getBoolean("showMarker");
        return new MyLocationStyle().myLocationType(type).strokeWidth(strokeWidth).radiusFillColor(radiusFillColor)
                .anchor(u, v).showMyLocation(showMyLocation).strokeColor(strokeColor);
    }
}
