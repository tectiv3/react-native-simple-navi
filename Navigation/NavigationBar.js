'use strict';
import React from 'react-native'

var {
  Navigator,
    View,
  Text,
    StyleSheet,
  TouchableHighlight,
    TouchableOpacity,
    Animated,
    Easing
} = React;

import NavigationButton, * as NavButton from './NavigationButton'

class NavigationBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            backButtonOpacity: 0,
            previousRoute: {}
        };
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
      let previousNavbar = (
          <BarContent route={this.state.previousRoute}
                      leftBarItem={this.props.leftBarItem}
                      rightBarItem={this.props.rightBarItem}
                      titleBarItem={this.props.titleBarItem}
                      titleStyle={this.props.titleStyle}
                      willDisappear="true"
          />
      );
      let navbarContent = (
          <BarContent route={this.props.currentRoute}
                      rightBarItem={this.props.rightBarItem}
                      titleBarItem={this.props.titleBarItem}
                      titleStyle={this.props.titleStyle}
                      leftProps={this.props.leftProps}
                      rightProps={this.props.rightProps}
                      titleProps={this.props.titleProps}
                      goBack={this.goBack.bind(this)}
                      goForward={this.goForward.bind(this)}
                      customAction={this.customAction.bind(this)}
          />
      );

      return (
          <View style={[navBarStyle, this.props.style]}>
              {previousNavbar}
              {navbarContent}
          </View>
      );
  }
}

class BarContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            opacity: this.props.willDisappear ? new Animated.Value(1): new Animated.Value(0),
        };
    }

    componentWillReceiveProps(newProps) {
        if (newProps.route !== this.props.route) {
            this.state.opacity.setValue(this.props.willDisappear ? 1 : 0);

            setTimeout(()=> {
                    Animated.timing(
                        this.state.opacity,
                        {
                            fromValue: this.props.willDisappear ? 1 : 0,
                            toValue: this.props.willDisappear ? 0 : 1,
                            duration: 300,
                            easing: Easing.easeOutQuad
                        }
                    ).start();
                }, 0
            );
        }
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
            leftBarItemContent = <LeftComponent goForward={this.goForward.bind(this)} customAction={this.customAction.bind(this)} {...this.props.leftProps}/>;
        } else if(this.props.route.index > 0) {
            leftBarItemContent = <NavigationButton barItemType={NavButton.BUTTON_TEXT_ONLY} barItemTitle="<" onPress={()=>this.goBack()}/>;
        }
        leftBarItem = (
            <View style={[styles.barItem, styles.alignLeft]}>
                {leftBarItemContent}
            </View>
        );

        var rightBarItem, rightBarItemContent = null;

        if (this.props.route.rightBarItem) {
            let RightComponent = this.props.route.rightBarItem;
            let rightProps = this.props.route.rightProps || this.props.rightProps;
            rightBarItemContent = (<RightComponent goForward={this.goForward.bind(this)} customAction={this.customAction.bind(this)} {...rightProps}/>);
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

var styles = StyleSheet.create({
    navbarContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        backgroundColor: '#5589B7'
    },
    navbarContainerHidden: {
        position: 'absolute',
        top: -64,
        left: 0,
        right: 0,
        height: 64,
    },
    navbar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 64, // Default iOS navbar height
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingTop: 13,
        borderBottomWidth: 1,
    },
    navbarText: {
        color: 'white',
        fontSize: 17,
        margin: 10,
        marginTop: 14,
        textAlign: 'center',
        alignItems: 'center',
    },
    barItem: {
        flex: 1,
        justifyContent: 'center',
    },
    alignLeft: {
        alignItems: 'flex-start'
    },
    alignRight: {
        alignItems: 'flex-end'
    },
})

export default NavigationBar;
