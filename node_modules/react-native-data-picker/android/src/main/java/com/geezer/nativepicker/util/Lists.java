package com.geezer.nativepicker.util;

import java.util.List;

/**
 * Created by geezer. on 2017/8/4.
 */

public class Lists {
    public static boolean isEmpty(List list) {
        return list == null || list.size() == 0;
    }

    public static boolean notEmpty(List list) {
        return list != null && list.size() > 0;
    }
}
