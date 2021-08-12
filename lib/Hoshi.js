import React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import BaseInput from './BaseInput';
import CountryPicker from 'react-native-country-picker-modal'
import { getProportionalFontSize } from '../../../app/utils/EDConstants';
import { EDColors } from '../../../app/utils/EDColors';

export default class Hoshi extends BaseInput {
  static propTypes = {
    borderColor: PropTypes.string,
    /*
     * this is used to set backgroundColor of label mask.
     * this should be replaced if we can find a better way to mask label animation.
     */
    maskColor: PropTypes.string,
    inputPadding: PropTypes.number,
    height: PropTypes.number,
  };

  static defaultProps = {
    borderColor: 'red',
    inputPadding: 16,
    height: 48,
    borderHeight: 3,
  };
  onCountrySelect = country => {
    this.setState({ code: country.cca2, dialCode: country.callingCode[0] })
    this.props.onCountrySelect !== undefined ?
      this.props.onCountrySelect(country) : {}
  }

  onFocus = () => {
    this.setState({ focused: true })
    this._onFocus()
  }
  onBlur = () => {
    this.setState({ focused: false })
    this._onBlur()
  }

  onInputLayout = e => {
    setTimeout(() => {
      console.log("NATIVE EVENT :::::", e.nativeEvent)
    }, 1000)
  }
  render() {
    const {
      label,
      style: containerStyle,
      inputStyle,
      labelStyle,
      maskColor,
      borderColor,
      borderHeight,
      inputPadding,
      height: inputHeight,
    } = this.props;
    const { width, focusedAnim, value, pickerVisible, code = this.props.defaultCode, dialCode = this.props.dialCode, focused = false } = this.state;
    const flatStyles = StyleSheet.flatten(containerStyle) || {};
    const containerWidth = flatStyles.width || width;

    return (
      <View
        style={[
          styles.container,
          containerStyle,

          {
            width: containerWidth,
            flexDirection: this.props.forPhonenumber ? "row" : "row",
            alignItems: "center",
            // borderColor: EDColors.themeGreen,
            // borderWidth: 1
          },
        ]}
        onLayout={this._onLayout}
      >
        {this.props.forPhonenumber ?
          <View style={{
            // position: 'absolute',
            // left: this.props.isRTL ? undefined : 5,
            // right: this.props.isRTL ? 5 : undefined,

            // alignSelf: 'center',
            // borderColor: EDColors.error,
            // borderWidth: 1

          }}>


            {dialCode !== undefined && dialCode !== null && dialCode.trim().length !== 0 && (focused || value !== "") ?

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
                    style={[{}, this.props.codeContainerStyle]}
                    onPress={() => { this.setState({ pickerVisible: true }) }}>
                    <Text
                      style={[styles.codeText, this.props.codeTextStyle,]}
                    >{dialCode.includes("+") ? dialCode : ("+" + dialCode)}</Text>
                  </TouchableOpacity>
                }}
              /> : null
            }

          </View>

          : null

        }
        <TextInput
          ref={this.input}
          // onLayout={this.onInputLayout}
          {...this.props}
          style={[
            styles.textInput,
            inputStyle,
          

          ]}
          value={value}
          onBlur={this.onBlur}
          onChange={this._onChange}
          onFocus={this.onFocus}
          underlineColorAndroid={'transparent'}
        />
        <TouchableWithoutFeedback onPress={this.focus}>
          <Animated.View
            style={[
              styles.labelContainer,
              {
                opacity: focusedAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [1, 0, 1],
                }),
                top: focusedAnim.interpolate({
                  inputRange: [0, 0.5, 0.51, 1],
                  outputRange: [16, 16, -5, -5],
                }),

              },
              this.props.isRTL ? {
                right: focusedAnim.interpolate({
                  inputRange: [0, 0.5, 0.51, 1],
                  outputRange: [inputPadding, 2 * inputPadding, 0, inputPadding],
                })
              } : {
                left: focusedAnim.interpolate({
                  inputRange: [0, 0.5, 0.51, 1],
                  outputRange: [inputPadding, 2 * inputPadding, 0, inputPadding],
                })
              }
            ]}
          >
            <Text style={[styles.label, labelStyle]}>
              {label}
            </Text>
          </Animated.View>
        </TouchableWithoutFeedback>
        <View
          style={[styles.labelMask, {
            backgroundColor: maskColor,
          }]}
        />
        <Animated.View
          style={[
            styles.border,
            {
              width: focusedAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, width],
              }),
              backgroundColor: borderColor,
              height: borderHeight,


            },
            this.props.isRTL ? {
              right: 0
            } : {
              left: 0
            }
          ]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: .5,
    borderBottomColor: '#b9c1ca',
  },
  labelContainer: {
    position: 'absolute',
    bottom: 5
  },
  label: {
    fontSize: 16,
    color: '#6a7989',
  },
  textInput: {
    // position: 'absolute',
    bottom: 0,
    padding: 0,
    color: '#6a7989',
    fontSize: 18,
    fontWeight: 'bold',
  },
  labelMask: {
    height: 24,
  },
  border: {
    position: 'absolute',
    bottom: -1,
  },
  codeText: {
    fontSize: getProportionalFontSize(16),
    color: "black",
  }
});
