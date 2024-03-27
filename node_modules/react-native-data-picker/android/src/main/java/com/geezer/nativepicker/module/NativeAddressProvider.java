package com.geezer.nativepicker.module;

import com.geezer.nativepicker.AddressProvider;
import com.geezer.nativepicker.model.AllAreas;
import com.geezer.nativepicker.model.GeneralData;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * Created by geezer. on 2017/8/7.
 */

public class NativeAddressProvider implements AddressProvider {

    public static final String FIRST_PID = "0";
    private HashMap<String, List<AllAreas.Area>> mAreas;

    public NativeAddressProvider(List<AllAreas.Area> allAreas) {

        generatingAreaInformation(allAreas);

    }

    private void generatingAreaInformation(List<AllAreas.Area> allAreas) {
        if (mAreas == null) {
            mAreas = new HashMap<>();
        }
        if (allAreas != null) {
            for (AllAreas.Area area : allAreas) {
                String key = area.parentId;
                List<AllAreas.Area> areaList = mAreas.get(key);
                if (null == areaList) {
                    areaList = new ArrayList<>();
                }
                areaList.add(area);
                mAreas.put(key, areaList);
            }
        }
    }


    private GeneralData generatingGeneralData(String pid, String id, String name) {
        GeneralData generalData = new GeneralData();
        generalData.pid = pid;
        generalData.id = id;
        generalData.name = name;
        return generalData;
    }

//
//    private Province generatingProvince(int parentId, int areaId, String areaName) {
//        Province province = new Province();
//        province.parentId = parentId;
//        province.id = areaId;
//        province.name = areaName;
//        return province;
//    }
//
//    private City generatingCity(int provinceId, int areaId, String areaName) {
//        City city = new City();
//        city.province_id = provinceId;
//        city.id = areaId;
//        city.name = areaName;
//        return city;
//    }
//
//    private County generatingCounty(int cityId, int areaId, String areaName) {
//        County county = new County();
//        county.city_id = cityId;
//        county.id = areaId;
//        county.name = areaName;
//        return county;
//    }
//
//    private Street generatingStreet(int countyId, int areaId, String areaName) {
//        Street street = new Street();
//        street.county_id = countyId;
//        street.id = areaId;
//        street.name = areaName;
//        return street;
//    }

    private <T> ArrayList<T> provideArea(T type, String key) {
        List<AllAreas.Area> areas = mAreas.get(key);
        ArrayList<T> provides = new ArrayList<>();
        if (areas != null) {
            for (AllAreas.Area area : areas) {
                if (area != null && area.areaName != null) {
                    T provide = generatingProvideArea(type, area);
                    provides.add(provide);
                }
            }
        }
        return provides;
    }


    @SuppressWarnings("unchecked")
    private <T> T generatingProvideArea(T type, AllAreas.Area area) {
        T provideArea;
        if (type instanceof GeneralData) {
            provideArea = (T) generatingGeneralData(area.parentId, area.areaId, area.areaName);
        } /*else if (type instanceof Province) {
            provideArea = (T) generatingProvince(area.parentId, area.areaId, area.areaName);
        } else if (type instanceof City) {
            provideArea = (T) generatingCity(area.parentId, area.areaId, area.areaName);
        } else if (type instanceof County) {
            provideArea = (T) generatingCounty(area.parentId, area.areaId, area.areaName);
        } else if (type instanceof Street) {
            provideArea = (T) generatingStreet(area.parentId, area.areaId, area.areaName);
        }*/ else {
            throw new UnsupportedOperationException("Types that are not supported");
        }
        return provideArea;
    }


    @Override
    public void provideProvinces(AddressReceiver<GeneralData> addressReceiver) {
        ArrayList<GeneralData> provinces = provideArea(new GeneralData(), FIRST_PID);
        addressReceiver.send(provinces);
    }

    @Override
    public void provideCitiesWith(String provinceId, AddressReceiver<GeneralData> addressReceiver) {
        ArrayList<GeneralData> cities = provideArea(new GeneralData(), provinceId);
        addressReceiver.send(cities);
    }

    @Override
    public void provideCountiesWith(String cityId, AddressReceiver<GeneralData> addressReceiver) {
        ArrayList<GeneralData> counties = provideArea(new GeneralData(), cityId);
        addressReceiver.send(counties);
    }

    @Override
    public void provideStreetsWith(String countyId, AddressReceiver<GeneralData> addressReceiver) {
        ArrayList<GeneralData> streets = provideArea(new GeneralData(), countyId);
        addressReceiver.send(streets);
    }

}
