'use strict'

import React, {Component} from 'react';

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet
} from 'react-native';

export const BUTTON_TEXT_ONLY = 'text';
export const BUTTON_IMAGE_ONLY = 'icon';

class NavigationButton extends Component {

    static defaultProps = {
        barItemType: 'text',
        onBarButtonPressed: Function,
    };

    render () {
        var button;
        switch (this.props.barItemType) {
            case BUTTON_TEXT_ONLY:
                button = this.renderTextOnlyBtn();
            break;
            case BUTTON_IMAGE_ONLY:
                button = this.renderImageOnlyBtn();
            break;
            default: {
                button = (
                    <View></View>
                );
            }
        }
        return (
            <TouchableOpacity onPress={() => this.onPress()} underlayColor="transparent" {...this.props}>
                {button}
            </TouchableOpacity>
        );
    }

    onPress() {
        this.props.onPress && this.props.onPress();
    }

    renderTextOnlyBtn() {
        return (
            <View>
                <Text style={[styles.navBarBtnText, this.props.textStyle]}>
                    {this.props.barItemTitle}
                </Text>
            </View>
        );
    }

    renderImageOnlyBtn() {
        return (
            <View>
                <Image style={[styles.navBarBtnImg, this.props.buttonStyle]} resizeMode='contain' source={this.props.barItemImage}/>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    navBarBtn: {
        flexDirection: 'column',
        justifyContent: 'center'
    },
    navBarBtnText: {
        fontSize: 16,
        margin: 10,
        textAlign: 'center',
        alignItems: 'center',
        color: 'black',
    },
    navBarBtnImg: {
        width: 24,
        height: 24,
        margin: 10
    }
});

export default NavigationButton;
