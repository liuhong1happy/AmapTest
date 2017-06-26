package com.cunyutech.hollyliu.amap;


import android.app.Activity;
import android.content.Context;
import android.net.Uri;
import android.os.Handler;
import android.util.Base64;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.model.GlideUrl;
import com.bumptech.glide.load.model.LazyHeaders;
import com.bumptech.glide.load.resource.drawable.GlideDrawable;
import com.bumptech.glide.request.RequestListener;
import com.bumptech.glide.request.animation.GlideAnimation;
import com.bumptech.glide.request.target.Target;
import com.bumptech.glide.request.target.SimpleTarget;
import com.facebook.react.views.imagehelper.ResourceDrawableIdHelper;


/**
 * Created by liuhong on 2017/6/26.
 */

public class ImageUtils {
    public static void load(Activity activity, final Context context, final String source, final SimpleTarget target ) {
        if("data:image/png;base64,".startsWith(source)) {
            activity.runOnUiThread(new Runnable() {
                public void run() {
                    ThreadUtil.assertMainThread();
                    try{
                        byte[] bSource = Base64.decode(source.replaceAll("data:image\\/.*;base64,", ""), Base64.DEFAULT);
                        Glide.with(context).load(bSource).asBitmap().toBytes().centerCrop().into(target);
                    }catch (Exception e) {
                        throw  e;
                    }
                }
            });
            return;
        }

        boolean useStorageFile = false ;
        Uri mUri = null;

        // handle bundled app resources
        try {
            mUri = Uri.parse(source);
            // Verify scheme is set, so that relative uri (used by static resources) are not handled.
            if (mUri.getScheme() == null) {
                mUri = null;
            } else if(
                    !mUri.getScheme().equals("http") &&
                            !mUri.getScheme().equals("https")
                    ){
                useStorageFile = true;
            }
        } catch (Exception e) {
            // ignore malformed uri, then attempt to extract resource ID.
        }

        if (mUri == null) {
            final Uri nullUri = ResourceDrawableIdHelper.getInstance().getResourceDrawableUri(context, source);
            activity.runOnUiThread(new Runnable() {
                public void run() {
                    ThreadUtil.assertMainThread();
                    try{
                        Glide.with(context).load(nullUri).asBitmap().toBytes().centerCrop().into(target);
                    }catch (Exception e) {
                        throw e;
                    }
                }
            });
        } else if (useStorageFile) {
            final Uri nullUri = mUri;
            activity.runOnUiThread(new Runnable() {
                public void run() {
                    ThreadUtil.assertMainThread();
                    try{
                        Glide.with(context).load(nullUri).asBitmap().toBytes().centerCrop().into(target);
                    }catch (Exception e) {
                        throw e;
                    }
                }
            });
        } else {
            // Handle an http / https address
            final LazyHeaders.Builder lazyHeaders = new LazyHeaders.Builder();
            final GlideUrl glideUrl = new GlideUrl(mUri.toString(), lazyHeaders.build());
            activity.runOnUiThread(new Runnable() {
                public void run() {
                    ThreadUtil.assertMainThread();
                    try{
                        Glide.with(context).load(glideUrl).asBitmap().toBytes().centerCrop().into(target);
                    }catch (Exception e) {
                        throw e;
                    }
                }
            });
        }
    }
}
