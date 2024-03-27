package com.geezer.nativepicker;


import com.geezer.nativepicker.model.GeneralData;

public class DefaultAddressProvider implements AddressProvider {

    @Override
    public void provideProvinces(AddressReceiver<GeneralData> addressReceiver) {

    }

    @Override
    public void provideCitiesWith(String provinceId, AddressReceiver<GeneralData> addressReceiver) {

    }

    @Override
    public void provideCountiesWith(String cityId, AddressReceiver<GeneralData> addressReceiver) {

    }

    @Override
    public void provideStreetsWith(String countyId, AddressReceiver<GeneralData> addressReceiver) {

    }
}
