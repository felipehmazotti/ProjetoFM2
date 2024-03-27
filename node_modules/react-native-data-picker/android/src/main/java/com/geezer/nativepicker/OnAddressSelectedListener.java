package com.geezer.nativepicker;


import com.geezer.nativepicker.model.GeneralData;

public interface OnAddressSelectedListener {
    void onAddressSelected(GeneralData province, GeneralData city, GeneralData county, GeneralData street);
}
