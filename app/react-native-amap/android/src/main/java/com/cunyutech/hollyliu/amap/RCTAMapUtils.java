package com.cunyutech.hollyliu.amap;

import android.app.Activity;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;

import com.amap.api.maps.model.BitmapDescriptor;
import com.amap.api.maps.model.BitmapDescriptorFactory;
import com.amap.api.maps.model.LatLng;
import com.amap.api.maps.model.MarkerOptions;
import com.amap.api.maps.model.MyLocationStyle;
import com.amap.api.maps.model.PolylineOptions;
import com.bumptech.glide.request.animation.GlideAnimation;
import com.bumptech.glide.request.target.SimpleTarget;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.views.imagehelper.ResourceDrawableIdHelper;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by liuhong on 2017/6/23.
 */

public class RCTAMapUtils {

    public static PolylineOptions parsePolylineOptions(ReadableMap options, ReactContext context) {
        Activity activity = context.getCurrentActivity();
        float width = (float)options.getDouble("width");
        int color = options.getInt("color");
        Iterable<LatLng> latLngs = parseLatLngs(options.getArray("points"));
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

    public static MarkerOptions parseMarkerOptions(ReadableMap options, ReactContext context) {
        Activity activity = context.getCurrentActivity();
        String snippet = options.getString("snippet");
        String title = options.getString("title");
        LatLng latLng = parseLatLng(options.getMap("position"));
        boolean draggable = options.getBoolean("draggable");
        boolean flat = options.getBoolean("flat");
        boolean visible = options.getBoolean("visible");

        final MarkerOptions markerOptions = new MarkerOptions().position(latLng).title(title).snippet(snippet)
                .draggable(draggable).setFlat(flat).visible(visible);
        if(options.hasKey("icon")) {
            ReadableMap source = options.getMap("icon");
            String uri = source.getString("uri");
            ImageUtils.load(activity, context, uri, new SimpleTarget<byte[]>() {
                @Override
                public void onResourceReady(byte[] resource, GlideAnimation glideAnimation) {
                    Bitmap bitmap = BitmapFactory.decodeByteArray(resource, 0, resource.length);
                    BitmapDescriptor icon = BitmapDescriptorFactory.fromBitmap(bitmap);
                    markerOptions.icon(icon);
                }
            });
        }
        return markerOptions;
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
        return new MyLocationStyle().myLocationType(type).strokeWidth(strokeWidth).radiusFillColor(radiusFillColor).interval(interval)
                .anchor(u, v).showMyLocation(showMyLocation).strokeColor(strokeColor);
    }
}
