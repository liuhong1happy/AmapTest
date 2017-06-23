package com.cunyutech.hollyliu.amap;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

/**
 * Created by liuhong on 2017/6/21.
 */

public class RCTAMapModule extends ReactContextBaseJavaModule {
    public RCTAMapModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "RCTAMapViewManager";
    }
}
