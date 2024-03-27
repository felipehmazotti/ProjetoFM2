import {
  NativeModules,
  NativeAppEventEmitter,
  NativeEventEmitter,
  Platform
} from "react-native";
const { NativeDataPicker, EventEmitterManager } = NativeModules;

const NativeEvent = null;
if (Platform.OS == "ios") {
  NativeEvent = new NativeEventEmitter(EventEmitterManager);
} else {
  NativeEvent = NativeAppEventEmitter;
}

const ON_PICKER_EVENT = "onPickerEvent";

export default {
  /**
   *
   * @param {object} options
   * @param {string} options.pickerData : All of the picker information.
   * @param {string} options.selectedValue : Previously selected picker information.
   * @param {function} options.onPickerEvent : Select to complete the listener event
   *
   */
  init(options) {
    NativeDataPicker.init(options.pickerData, options.selectedValue);
    this.listener && this.listener.remove();
    this.listener = NativeEvent.addListener(
      ON_PICKER_EVENT,
      options.onPickerEvent
    );
  },
  show() {
    NativeDataPicker.show();
  },
  destroy() {
    NativeDataPicker.destroy();
  }
};
