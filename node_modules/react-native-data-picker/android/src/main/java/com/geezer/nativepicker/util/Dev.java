package com.geezer.nativepicker.util;

import android.content.Context;

/**
 * Created by geezer. on 2017/8/4.
 */

public class Dev {
    public static int dp2px(Context context, float dp) {
        return (int) Math.ceil(context.getResources().getDisplayMetrics().density * dp);
    }
}
