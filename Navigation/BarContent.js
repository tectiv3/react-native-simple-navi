'use strict';
import React, {Component} from 'react';

import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    Easing,
} from 'react-native';

import NavigationButton, * as NavButton from './NavigationButton'
import NavStyles from './styles';

export default class BarContent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            opacity: this.props.willDisappear ? new Animated.Value(1): new Animated.Value(0),
        };
    }

    componentDidMount() {
        this.transAnimation();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.route !== this.props.route) {
            this.state.opacity.setValue(this.props.willDisappear ? 1 : 0);
            this.transAnimation();
        } else if (newProps.route === this.props.route) {
            this.state.opacity.setValue(1);
        }
    }

    transAnimation() {
        setTimeout(()=> {
                Animated.timing(
                    this.state.opacity,
                    {
                        fromValue: this.props.willDisappear ? 1 : 0,
                        toValue: this.props.willDisappear ? 0 : 1,
                        duration: 100,
                        easing: Easing.easeOutQuad,
                        useNativeDriver: true
                    }
                ).start();
            }, 0
        );
    }

    goBack() {
        if (!this.props.willDisappear) {
            this.props.goBack();
        }
    }

    goForward(route) {
        this.props.goForward(route);
    }

    customAction(opts) {
        this.props.customAction(opts);
    }

    render () {
        var transitionStyle = {
            opacity: this.state.opacity
        };
        if (this.props.route.hideNavigationBar) {
            return (
                <Animated.View style={[styles.navbar, this.props.route.headerStyle, transitionStyle, {borderBottomWidth:0}]}>
                </Animated.View>
            );
        }
        var leftBarItem, leftBarItemContent = null;
        if (this.props.route.leftBarItem) {
            let LeftComponent = this.props.route.leftBarItem;
            leftBarItemContent = <LeftComponent goForward={this.goForward.bind(this)} customAction={this.customAction.bind(this)} textStyle={this.props.textStyle} buttonStyle={this.props.buttonStyle} {...this.props.route.leftProps}/>;
        } else if(this.props.route.index > 0) {
            leftBarItemContent = <NavigationButton barItemType={NavButton.BUTTON_IMAGE_ONLY} barItemImage={require('./icon_back.png')} onPress={()=>this.goBack()} buttonStyle={this.props.buttonStyle}/>;
        }
        leftBarItem = (
            <View style={[styles.barItem, styles.alignLeft]}>
                {leftBarItemContent}
            </View>
        );

        var rightBarItem, rightBarItemContent = null;

        if (this.props.route.rightBarItem) {
            let RightComponent = this.props.route.rightBarItem;
            rightBarItemContent = (<RightComponent goForward={this.goForward.bind(this)} customAction={this.customAction.bind(this)} textStyle={this.props.textStyle} buttonStyle={this.props.buttonStyle} {...this.props.route.rightProps}/>);
        }
        rightBarItem = (
            <View style={[styles.barItem, styles.alignRight]}>
                {rightBarItemContent}
            </View>
        );

        var titleBarItem, titleBarItemContent = null;

        if (this.props.route.titleBarItem) {
            let titleComponent = this.props.route.titleBarItem;
            titleBarItemContent = <titleComponent {...this.props.titleProps} />
        } else {
            titleBarItemContent = (
                <Text numberOfLines={1}
                      style={[styles.navbarText, this.props.titleStyle]}>
                    {this.props.route.title}
                </Text>
            );
        }

        titleBarItem = (
            <View style={{flex: 3}}>
                {titleBarItemContent}
            </View>
        );
        return (
            <Animated.View style={[styles.navbar, this.props.route.headerStyle, transitionStyle]}>
                {leftBarItem}
                {titleBarItem}
                {rightBarItem}
            </Animated.View>
        );
    }

    pop() {
        if (!this.props.willDisappear) {
            this.props.pop();
        }
    }


}

var styles = Object.assign({}, NavStyles);
