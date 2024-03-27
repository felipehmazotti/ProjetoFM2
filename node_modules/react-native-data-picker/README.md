# react-native-data-picker
react native data picker

### Documentation

#### Params

|Key | Description | Type | Default|
| --- | ----------- | ---- | ------ |
|pickerData            |            |array   |                   |
|selectedValue         |            |string  |                   |
|onPickerEvent         |            |function|                   |

#### Methods

|Name | Description | Type | Default|
| --- | ----------- | ---- | ------ |
|init         |init and pass parameters to picker      |     |   |
|destroy      |destroy picker                          |     |   |
|show         |show picker                             |     |   |

### Usage

#### Step 1 - install

```
	npm install react-native-data-picker --save
```

#### Step 2 - link

```
	react-native link
```

#### Step 3 - import and use in project

```javascript
    import React, { Component } from "react";
    import { StyleSheet, Text, View } from "react-native";
    import Picker from 'react-native-data-picker';

    export default class Demo extends Component {
      componentWillMount() {

        // remote

        // Api.post("user/findAllAreas", {})
        //   .then(function(response) {
        //     console.log(response);
        //     Picker.init({
        //       pickerData: JSON.stringify(response.data.data),
        //       selectedValue: '',
        //       onPickerEvent: data => console.log(data),
        //     });
        //   })
        //   .catch(function(error) {
        //     console.log(error);
        //   });

        // native

        let data = [];

        let testData1 = [
          { parentId: 0, areaId: 2, areaName: "北京市" },
          { parentId: 2, areaId: 33, areaName: "市辖区" },
          { parentId: 33, areaId: 378, areaName: "东城区" },
          { parentId: 378, areaId: 1133, areaName: "东城街" }
        ];

        let testData2 = [
          { areaId: 3, areaName: "天津市", parentId: 0 },
          { areaId: 36, areaName: "县", parentId: 3 },
          { areaId: 412, areaName: "静海县", parentId: 36 }
        ];

        let previouslySelectedValue = [
          { id: "3", name: "天津市", pid: "0" },
          { id: "36", name: "县", pid: "3" },
          { id: "412", name: "静海县", pid: "36" }
        ];

        data = data.concat(testData1).concat(testData2);

        Picker.init({
          pickerData: JSON.stringify(data),
          selectedValue: JSON.stringify(previouslySelectedValue),
          onPickerEvent: data => console.log(data)
        });
      }

      componentWillUnmount() {
        Picker.destroy();
      }

      render() {
          return (
            <View>
              <Text onPress={() => Picker.show()}>
                selectedArea
              </Text>
            </View>
          );
      }
    }


```

### Notice

#### support one modes:
```javascript

   pickerData = [
      { parentId: 0, areaId: 2, areaName: "北京市" },
      { parentId: 2, areaId: 33, areaName: "市辖区" },
      { parentId: 33, areaId: 378, areaName: "东城区" },
      { parentId: 378, areaId: 1133, areaName: "东城街" }
    ];

   selectedValue = [
      { id: "3", name: "天津市", pid: "0" },
      { id: "36", name: "县", pid: "3" },
      { id: "412", name: "静海县", pid: "36" }
    ];

```
