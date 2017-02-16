'use strict';
import React, {Component} from 'react';

import {
    Navigator,
    View,
    BackAndroid,
    Platform,
} from 'react-native';

import BarContent from './BarContent'
import NavStyles from './styles';

export default class NavigationBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            backButtonOpacity: 0,
            previousRoute: {}
        };
    }

    componentDidMount() {
        if (Platform.OS == 'android') {
            BackAndroid.addEventListener('hardwareBackPress', ()=>{
                if (this.props.currentRoute.index && this.props.currentRoute.index > 0) {
                    this.goBack();
                    return true;
                }

                return false;
            })
        }
    }

    componentWillUnmount() {
        if (Platform.OS == 'android') {
            BackAndroid.removeEventListener('hardwareBackPress');
        }
    }

    componentWillReceiveProps(newProps) {
        if (this.props && this.props.currentRoute.index !== newProps.currentRoute.index) {
            this.setState({
                previousRoute: this.props.currentRoute
            });
        }
    }

    goBack() {
        this.props.goBack(this.props.navigator);
    }

    goForward(route) {
        this.props.goForward(route, this.props.navigator);
    }

    customAction(opts) {
        this.props.customAction(opts);
    }

    render () {
        var navBarStyle;
        if (this.props.currentRoute.hideNavigationBar) {
            navBarStyle = styles.navbarContainerHidden;
        } else {
            navBarStyle = styles.navbarContainer;
        }
        let navbarContent = (
            <BarContent route={this.props.currentRoute}
                titleStyle={this.props.titleStyle}
                textStyle={this.props.textStyle}
                buttonStyle={this.props.buttonStyle}
                goBack={this.goBack.bind(this)}
                goForward={this.goForward.bind(this)}
                customAction={this.customAction.bind(this)}
            />
        );

        return (
            <View style={[navBarStyle, this.props.style]}>
                {navbarContent}
            </View>
        );
    }
}

var styles = Object.assign({}, NavStyles);
