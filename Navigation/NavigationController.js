'use strict';

import React from 'react';

import NavigationBar from './NavigationBar';
import NavStyles from './styles';
import NavigationButton from './NavigationButton'

import {
    StyleSheet,
    Navigator,
    View,
    Platform,
    StatusBar
} from 'react-native';

export default class NavigationController extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            route: {
                title: null,
                index: null
            },
        };
        this.routeStack = [];
    }

    componentWillMount() {
        this.state.route = this.props.initialRoute;
        this.routeStack.push(this.props.initialRoute);
    }

    componentDidMount() {
        this._navigator = this.refs["navigator"];
        this.refs["navigator"].navigationContext.addListener('willfocus', (event) => {
            const route = event.data.route;
            this.willFocus(route);
        });
    }

    componentWillReceiveProps(newProps) {
        if (this.props.initialRoute.component != newProps.initialRoute.component) {
            this.resetTo(newProps.initialRoute);
        }
    }

    willFocus(route) {
        if (route.index) {
            if (route.index >= this.routeStack.length) {
                this.routeStack.push(route);
            } else if (route.index < this.routeStack.length) {
                this.routeStack = this.routeStack.slice(0, route.index + 1);
            }
            this.setState({route: this.routeStack[route.index]});
        } else if (this.routeStack.length > 0){
            this.routeStack = [this.routeStack[0]];
            this.setState({route: this.routeStack[0]});
        } else {
            this.routeStack.push(route);
            this.setState({route: route});
        }
        if (route.scene && route.scene.willFocus) {
            route.scene.willFocus(route);
        }
    }

    onBack(navigator) {
        if (this.state.route.index > 0) {
            this.routeStack.pop();
            navigator.pop();
        }
    }
    onForward(route, navigator) {
        route.index = this.state.route.index + 1 || 1;
        this.routeStack.push(route);
        navigator.push(route);
    }

    customAction(opts) {
        this.props.customAction(opts);
    }

    setRightProps(props) {
        let route = {...this.state.route, rightProps: props};
        let currentRoute = this._navigator.getCurrentRoutes();
        currentRoute[currentRoute.length - 1].rightProps = props;
        this.routeStack[this.routeStack.length - 1].rightProps = props;
        this.setState({route});
    }

    setLeftProps(props) {
        let route = {...this.state.route, leftProps: props};
        let currentRoute = this._navigator.getCurrentRoutes();
        currentRoute[currentRoute.length - 1].leftProps = props;
        this.routeStack[this.routeStack.length - 1].leftProps = props;
        this.setState({route});
    }

    setTitleProps(props) {
        let route = {...this.state.route, titleProps: props};
        let currentRoute = this._navigator.getCurrentRoutes();
        currentRoute[currentRoute.length - 1].titleProps = props;
        this.routeStack[this.routeStack.length - 1].titleProps = props;
        this.setState({route});
    }

    setTitle(title) {
        let route = {...this.state.route, title: title};
        let currentRoute = this._navigator.getCurrentRoutes();
        currentRoute[currentRoute.length - 1].title = title;
        this.routeStack[this.routeStack.length - 1].title = title;
        this.setState({route: route});

    }

    setNavBarHidden(isHidden) {
        let route = {...this.state.route, hideNavigationBar: isHidden};
        let currentRoute = this._navigator.getCurrentRoutes();
        currentRoute[currentRoute.length - 1].hideNavigationBar = isHidden;
        this.routeStack[this.routeStack.length - 1].hideNavigationBar = isHidden;
        this.setState({route: route});
    }

    setRightBarItem(barItem) {
        let route = {...this.state.route, rightBarItem: barItem};
        this.routeStack[this.routeStack.length - 1] = route;
        this.setState({route: route});
    }

    setLeftBarItem(barItem) {
        let route = {...this.state.route, leftBarItem: barItem};
        this.routeStack[this.routeStack.length - 1] = route;
        this.setState({route: route});
    }

    setLeftBarButton(props) {
        let route = {...this.state.route, leftBarItem: NavigationButton, leftProps: props};
        let currentRoute = this._navigator.getCurrentRoutes();
        currentRoute[currentRoute.length - 1].leftBarItem = NavigationButton;
        this.routeStack[this.routeStack.length - 1].leftBarItem = NavigationButton;
        currentRoute[currentRoute.length - 1].leftProps = props;
        this.routeStack[this.routeStack.length - 1].leftProps = props;
        this.setState({route});
    }

    setRightBarButton(props) {
        let route = {...this.state.route, rightBarItem: NavigationButton, rightProps: props};
        let currentRoute = this._navigator.getCurrentRoutes();
        currentRoute[currentRoute.length - 1].rightBarItem = NavigationButton;
        this.routeStack[this.routeStack.length - 1].rightBarItem = NavigationButton;
        currentRoute[currentRoute.length - 1].rightProps = props;
        this.routeStack[this.routeStack.length - 1].rightProps = props;
        this.setState({route});
    }

    setTitleBarItem(barItem) {
        let route = {...this.state.route, titleBarItem: barItem};
        this.routeStack[this.routeStack.length - 1] = route;
        this.setState({route: route});
    }

    setRoute(route) {
        let newRoute = {...route};
        if (!newRoute.component) {
            newRoute.component = this.state.route.component;
        }
        newRoute.index = this.state.route.index;
        this.routeStack[this.routeStack.length - 1] = newRoute;
        this.setState({route: newRoute});
    }

    resetTo(route) {
        route.index = 0;
        this.routeStack = [route];
        this.refs["navigator"] && this.refs["navigator"].resetTo(route);
        this.setState({route});
    }

    configureScene(route) {
        return route.sceneConfig || Navigator.SceneConfigs.PushFromRight;
    }

    renderScene(route, navigator) {
        var goForward = function(route) {
            route.index = this.state.route.index + 1 || 1;
            navigator.push(route);
        }.bind(this);

        var goBackwards = function() {
            this.onBack(navigator);
        }.bind(this);

        var goToFirstRoute = function() {
            navigator.popToTop()
        };

        var popToRoute = function(route) {
            if (!route) {
                return;
            }
            if ((route.index === null || route.index === undefined)  && !route.component) {
                return;
            }
            let routeStack = navigator.getCurrentRoutes();
            if (routeStack.indexOf(route) == -1) {
                for (let i = routeStack.length - 1; i>=0; i--) {
                    let r = routeStack[i];
                    if (!route.component) {
                        if (r.index === route.index || (!r.index && route.index === 0)) {
                            navigator.popToRoute(r);
                            return;
                        }
                    } else {
                        if (r.component == route.component) {
                            navigator.popToRoute(r);
                            return;
                        }
                    }
                }
            } else {
                navigator.popToRoute(route);
            }
        }.bind(this);

        var customAction = function(opts) {
            this.customAction(opts);
        }.bind(this);

        var preventDefault = function(event) {
            return false;
        }

        var setRightProps = function(props) {
            this.setRightProps(props);
        }.bind(this);

        var setLeftProps = function(props) {
            this.setLeftProps(props);
        }.bind(this);

        var setTitleProps = function(props) {
            this.setTitleProps(props);
        }.bind(this);

        var setTitle = function(title) {
            let route = {...this.state.route, title: title};
            let currentRoute = navigator.getCurrentRoutes();
            currentRoute[currentRoute.length - 1].title = title;
            this.routeStack[this.routeStack.length - 1].title = title;
            this.setState({route: route});
        }.bind(this);

        var setNavBarHidden = function(isHidden) {
            let route = {...this.state.route, hideNavigationBar: isHidden};
            let currentRoute = navigator.getCurrentRoutes();
            currentRoute[currentRoute.length - 1].hideNavigationBar = isHidden;
            this.routeStack[this.routeStack.length - 1].hideNavigationBar = isHidden;
            this.setState({route: route});
        }.bind(this);

        var Content = route.component;
        var self = this;
        var extraStyling = {};
        if (this.props.hideNavigationBar || route.hideNavigationBar) {
            extraStyling.marginTop = 0;
        }

        return (
            <View style={[styles.container, this.props.itemWrapperStyle, extraStyling]}
            >
                <Content
                    ref={(component) => {route.scene = component;}}
                    name={route.title}
                    index={route.index}
                    navigator={navigator}
                    navigationController={self}
                    setRightProps={setRightProps}
                    setLeftProps={setLeftProps}
                    setTitleProps={setTitleProps}
                    setTitle={setTitle}
                    setNavBarHidden={setNavBarHidden}
                    goForward={goForward}
                    goBack={goBackwards}
                    popToTop={goToFirstRoute}
                    popToRoute={popToRoute}
                    customAction={customAction}
                    {...route.passProps}
                />
            </View>
        );
    }

    render() {
        var navigationBar;
        // Status bar color
		// var StatusBarStyle = 'black';
        // if (Platform.OS === 'ios') {
        //     if (this.props.statusBarColor === 'black') {
        //         StatusBarStyle = 'black';
        //     } else {
		// 		StatusBarStyle = 'light-content'
        //     }
        // }

        if (!this.props.hideNavigationBar) {
            navigationBar = (
                // <StatusBar
                //     barStyle={StatusBarStyle}
                //     animated={true}
                // />
                <NavigationBar navigator={navigator}
                               style={this.props.navbarStyle}
                               titleStyle={this.props.titleStyle}
                               buttonStyle={this.props.buttonStyle}
                               textStyle={this.props.textStyle}
                               currentRoute={this.state.route}
                               goForward={this.onForward.bind(this)}
                               goBack={this.onBack.bind(this)}
                               customAction={this.customAction.bind(this)}
                />
            );
        }

        return (
            <View style={{flex: 1}}>
                <Navigator initialRoute={this.props.initialRoute}
                           navigationBar={navigationBar}
                           ref="navigator"
                           renderScene={this.renderScene.bind(this)}
                           configureScene={this.configureScene}
                />
            </View>
        );
    }
}

NavigationController.propTypes = {
    initalRoute: React.PropTypes.object,
    navbarStyle: View.propTypes.style,
    itemWrapperStyle: View.propTypes.style,
};

var styles = Object.assign({}, NavStyles);
