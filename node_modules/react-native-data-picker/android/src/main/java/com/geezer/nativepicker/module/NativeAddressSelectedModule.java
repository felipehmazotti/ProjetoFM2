package com.geezer.nativepicker.module;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.geezer.nativepicker.BottomDialog;
import com.geezer.nativepicker.OnAddressSelectedListener;
import com.geezer.nativepicker.model.AllAreas;
import com.geezer.nativepicker.model.GeneralData;
import com.geezer.nativepicker.util.GsonUtils;
import com.google.gson.JsonParseException;
import com.google.gson.reflect.TypeToken;

import java.util.ArrayList;
import java.util.List;


/**
 * Created by geezer. on 2017/8/4.
 */

public class NativeAddressSelectedModule extends ReactContextBaseJavaModule {

    private static final String REACT_CLASS = "NativeDataPicker";
    private static final String ON_ADDRESS_SELECTED_LISTENER = "onPickerEvent";
    private OnAddressSelectedListener mAddressSelectedListener;
    private BottomDialog mDialog;
    private NativeAddressProvider mNativeAddressProvider;
    private List<GeneralData> mDatas;

    public NativeAddressSelectedModule(ReactApplicationContext reactContext) {
        super(reactContext);
        initAddressSelectedListener();
    }

    private void initAddressSelectedListener() {

        if (mAddressSelectedListener != null) return;

        mAddressSelectedListener = new OnAddressSelectedListener() {
            @Override
            public void onAddressSelected(GeneralData province, GeneralData city, GeneralData county, GeneralData street) {
                ArrayList<GeneralData> generalDatas = new ArrayList<>();

                if (province != null) {
                    generalDatas.add(province);
                }

                if (city != null) {
                    generalDatas.add(city);
                }

                if (county != null) {
                    generalDatas.add(county);
                }

                if (street != null) {
                    generalDatas.add(street);
                }

                getReactApplicationContext()
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit(ON_ADDRESS_SELECTED_LISTENER, GsonUtils.toJsonString(generalDatas));

                mDialog.dismiss();
            }
        };

    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactMethod
    public void init(String areas, String data) {
        try {
            initAddressProvider(areas);
            initResetAddres(data);
        } catch (JsonParseException | NullPointerException | ClassCastException e) {
            Log.e(NativeAddressSelectedModule.class.getSimpleName(), e.getMessage());
        }
        initDialog();
    }

    @ReactMethod
    public void destroy() {
        mDialog = null;
    }

    @ReactMethod
    public void show() {
        if (mDialog != null) {
            mDialog.setOnAddressSelectedListener(mAddressSelectedListener);
            mDialog.show();
        }
    }


    private void initDialog() {
        mDialog = new BottomDialog(getCurrentActivity());
        mDialog.setAddressProvider(mNativeAddressProvider);
        if (mDatas != null) {
            mDialog.resetAddres(mDatas);
        }
    }

    private void initResetAddres(String data) {
        mDatas = GsonUtils.fromJsonString(data, new TypeToken<List<GeneralData>>() {
        }.getType());
    }

    private void initAddressProvider(String areas) {
        List<AllAreas.Area> allAreas = GsonUtils.fromJsonString(areas, new TypeToken<List<AllAreas.Area>>() {
        }.getType());
        mNativeAddressProvider = new NativeAddressProvider(allAreas);
    }

}
