import React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  TextInput,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';
import CountryPicker from 'react-native-country-picker-modal'
import BaseInput from './BaseInput';
import { Icon } from 'react-native-elements';

export default class Fumi extends BaseInput {
  static propTypes = {
    /*
     * This is the icon component you are importing from react-native-vector-icons.
     * import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
     * iconClass={FontAwesomeIcon}
     */
    iconClass: PropTypes.func.isRequired,
    /*
     * Passed to react-native-vector-icons library as name prop
     */
    iconName: PropTypes.string.isRequired,
    /*
     * Passed to react-native-vector-icons library as color prop.
     * Also used as textInput color.
     */
    iconColor: PropTypes.string,
    /*
     * Passed to react-native-vector-icons library as size prop.
     */
    iconSize: PropTypes.number,

    passiveIconColor: PropTypes.string,
    height: PropTypes.number,
  };

  static defaultProps = {
    height: 48,
    iconColor: '#00aeef',
    iconSize: 20,
    iconWidth: 40,
    inputPadding: 16,
    passiveIconColor: '#a3a3a3',
    animationDuration: 300,
  };
  onCountrySelect = country => {
    this.setState({ code: country.cca2, dialCode: country.callingCode[0] })
    this.props.onCountrySelect !== undefined ?
      this.props.onCountrySelect(country) : {}
  }
  // state = {
  //   pickerVisible: false
  // }
  render() {
    console.log("PROPS ::::", this.props.countryData)
    const {
      iconClass,
      iconColor,
      iconSize,
      passiveIconColor,
      iconName,
      label,
      style: containerStyle,
      inputStyle,
      height: inputHeight,
      inputPadding,
      iconWidth,
      labelStyle,
    } = this.props;
    const { focusedAnim, value, pickerVisible, code = this.props.defaultCode || "IN", dialCode = this.props.dialCode || "91" } = this.state;
    const AnimatedIcon = Animated.createAnimatedComponent(iconClass);
    const ANIM_PATH = inputPadding + inputHeight;
    const NEGATIVE_ANIM_PATH = ANIM_PATH * -1;

    return (
      <View
        style={[styles.container, containerStyle, {
          height: ANIM_PATH,
        }]}
        onLayout={this._onLayout}
      >
        <TouchableWithoutFeedback onPress={this.focus}>
          <AnimatedIcon
            name={iconName}
            color={iconColor}
            size={iconSize}
            style={{
              position: 'absolute',
              left: inputPadding,
              bottom: focusedAnim.interpolate({
                inputRange: [0, 0.5, 0.51, 0.7, 1],
                outputRange: [
                  20,
                  ANIM_PATH,
                  NEGATIVE_ANIM_PATH,
                  NEGATIVE_ANIM_PATH,
                  20,
                ],
              }),
              color: focusedAnim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [passiveIconColor, iconColor, iconColor],
              }),
            }}
          />

        </TouchableWithoutFeedback>
        <View
          style={[
            styles.separator,
            this.props.separatorStyle,
            {
              height: inputHeight,
              left: iconWidth + 8,
            },
          ]}
        />

        {this.props.forPhonenumber ?
          <View style={{
            position: 'absolute',
            left: inputPadding + 40,
            alignSelf: 'center'
          }}>
            <CountryPicker
              countryCodes={this.props.countryPickerProps.countryCodes.map(data => data.iso)}
              withFilter
              withCountryNameButton
              withAlphaFilter
              withCallingCode
              withEmoji
              visible={pickerVisible}
              onClose={() => this.setState({ pickerVisible: false })}
              countryCode={code}
              onSelect={this.onCountrySelect}
              renderFlagButton={() => {
                return <TouchableOpacity
                  disabled={this.props.disabled}
                  style={[{ alignItems: 'center', width: dialCode.length == 4 ? 60 : 50 }, this.props.codeContainerStyle]}
                  onPress={() => { this.setState({ pickerVisible: true }) }}>
                  <Text
                    style={[styles.codeText, this.props.codeTextStyle]}
                  >+{dialCode}</Text>
                  <Icon name="caretdown" type="ant-design" size={12} color={"black"} containerStyle={{ marginHorizontal: 5 }} />
                </TouchableOpacity>
              }}
            />

          </View>

          : null

        }

        <TouchableWithoutFeedback onPress={this.focus}>
          <Animated.View
            style={{
              position: 'absolute',
              left: iconWidth + inputPadding + (this.props.forPhonenumber ? (dialCode.length == 4 ? 75 : 55) : 0),
              height: inputHeight,
              top: focusedAnim.interpolate({
                inputRange: [0, 0.5, 0.51, 0.7, 1],
                outputRange: [
                  22,
                  ANIM_PATH,
                  NEGATIVE_ANIM_PATH,
                  NEGATIVE_ANIM_PATH,
                  inputPadding / 2,
                ],
              }),

            }}
          >
            <Animated.Text
              style={[
                styles.label,
                {
                  fontSize: focusedAnim.interpolate({
                    inputRange: [0, 0.7, 0.71, 1],
                    outputRange: [16, 16, 12, 12],
                  }),
                  color: focusedAnim.interpolate({
                    inputRange: [0, 0.7],
                    outputRange: ['#696969', '#a3a3a3'],
                  }),
                },
                labelStyle,
              ]}
            >
              {label}
            </Animated.Text>
          </Animated.View>
        </TouchableWithoutFeedback>
        <TextInput
          ref={this.input}
          {...this.props}
          style={[
            styles.textInput,
            {
              marginLeft: iconWidth + inputPadding + (this.props.forPhonenumber ? (dialCode.length == 4 ? 75 : 55) : 0),
              marginRight: iconWidth + inputPadding,

              color: iconColor,
            },
            inputStyle,
          ]}
          value={value}
          onBlur={this._onBlur}
          onFocus={this._onFocus}
          onChange={this._onChange}
          underlineColorAndroid={'transparent'}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    paddingTop: 16,
    backgroundColor: 'white',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  textInput: {
    flex: 1,
    color: 'black',
    fontSize: 18,
    padding: 7,
    paddingLeft: 0,
  },
  separator: {
    position: 'absolute',
    width: 1,
    backgroundColor: '#f0f0f0',
    top: 8,
  },
  codeText: {
    fontSize: 14,
    marginRight: 0,
    color: "black",
  }
});
