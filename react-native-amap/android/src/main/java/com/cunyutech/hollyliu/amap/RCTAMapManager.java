package com.cunyutech.hollyliu.amap;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

/**
 * Created by liuhong on 2017/6/21.
 */

public class RCTAMapManager extends ViewGroupManager<RCTAMapView>
{
    @Override
    public String getName() {
        return "RCTAMapView";
    }

    @Override
    protected RCTAMapView createViewInstance(ThemedReactContext reactContext) {
        RCTAMapView map = new RCTAMapView(reactContext);
        return map;
    }
}
