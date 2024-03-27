package com.geezer.nativepicker;


import com.geezer.nativepicker.model.GeneralData;

import java.util.List;


public interface AddressProvider {
    void provideProvinces(AddressReceiver<GeneralData> addressReceiver);
    void provideCitiesWith(String provinceId, AddressReceiver<GeneralData> addressReceiver);
    void provideCountiesWith(String cityId, AddressReceiver<GeneralData> addressReceiver);
    void provideStreetsWith(String countyId, AddressReceiver<GeneralData> addressReceiver);

    interface AddressReceiver<T> {
        void send(List<T> data);
    }
}
