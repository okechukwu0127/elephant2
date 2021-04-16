import * as React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    TextInput,
    ScrollView,
    Image,
    Keyboard,
} from 'react-native';
import {TabView, SceneMap} from 'react-native-tab-view';
import Animated from 'react-native-reanimated';
import s, {fab_width} from './styles';
import {
    BACKGROUND_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
} from '../../../themes/colors';
import ImagePicker from 'react-native-image-crop-picker';
import {connect} from 'react-redux';
import {createPost} from '../../../reducers/feed';
import Spinner from 'react-native-loading-spinner-overlay';
import ActionSheet from 'react-native-action-sheet';
import {Dropdown, BackButton} from '../../../components';
import {withTranslation} from 'react-i18next';
import hoistStatics from 'hoist-non-react-statics';

const RouteType = (props) => (
    <View style={s.scene} key={props.route.key}>
        <TextInput
            style={s.txtInput}
            value={props.type}
            onChangeText={(type) => props.onChangeValue('type', type)}
        />
        <Text style={s.title}>{props.t('posttype')}</Text>
        <Text style={s.description}>{props.t('typedescription')}</Text>
    </View>
);
const RouteClub = (props) => {
    return (
        <View style={s.scene} key={props.route.key}>
            <Dropdown
                value={
                    props.selClub && props.selClub.name
                        ? props.selClub.name
                        : undefined
                }
                data={props.clubs_user.map((item) => {
                    return {...item, value: item.name};
                })}
                containerStyle={{
                    backgroundColor: 'white',
                    borderWidth: 0,
                    borderRadius: 12,
                    marginTop: 70,
                    paddingTop: 10,
                }}
                onChangeText={(region, index, data) => {
                    props.onChangeValue('selClub', data[index]);
                }}
                dropdownOffset={{top: 80, left: -100}}
                dropdownMargins={{min: 20, max: 20}}
                style={{color: PRIMARY_TEXT_COLOR, fontFamily: 'Rubik-Medium'}}
                fontSize={28}
                arrowSize={45}
                arrowColor={PRIMARY_TEXT_COLOR}
                itemTextStyle={{
                    textAlign: 'left',
                    fontSize: 20,
                }}
            />
            <Text style={s.title}>{props.t('club')}</Text>
            <Text style={s.description}>{props.t('clubdescription')}</Text>
        </View>
    );
};
const RouteContent = (props) => (
    <View style={s.scene} key={props.route.key}>
        <TextInput
            style={s.txtInput}
            value={props.content}
            onChangeText={(content) => props.onChangeValue('content', content)}
            multiline={true}
        />
        <Text style={s.title}>{props.t('content')}</Text>
        <Text style={s.description}>{props.t('contentdescription')}</Text>
    </View>
);

class CreatePost extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            header: null,
        };
    };
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            routes: [
                {key: 'route_type', title: 'type'},
                {key: 'route_club', title: 'club'},
                {key: 'route_content', title: 'content'},
            ],
            type: undefined,
            selClub: null,
            content: null,
            spinner: false,
        };
        this._renderScene = this._renderScene.bind(this);
        this._renderTabBar = this._renderTabBar.bind(this);
        this.reach_step = 0;
    }
    onChangeValue(name, value) {
        this.setState({
            [name]: value,
        });
    }
    createPost() {
        const {type, content, selClub} = this.state;
        this.setState({spinner: true});
        this.props.createPost(
            {
                type,
                content,
                club_id: selClub && selClub.id,
            },
            (res) => {
                this.setState({spinner: false});
                if (res) this.props.navigation.goBack();
            },
        );
    }
    _handleIndexChange = (index) => this.setState({index});

    _renderTabBar = (props) => {
        const inputRange = props.navigationState.routes.map((x, i) => i);
        const {t} = this.props;
        return (
            <View style={s.tabBar}>
                <BackButton
                    onPress={() => {
                        if (this.state.index <= 0) {
                            this.props.navigation.goBack();
                        } else this.setState({index: this.state.index - 1});
                    }}
                    style={{paddingLeft: 0, marginBottom: 10}}></BackButton>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                    <View>
                        <Text style={s.tabTitle}>{t('title')}</Text>
                        <Text style={s.tabPage}>
                            {t('step')} {this.state.index + 1}/
                            {props.navigationState.routes.length}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={s.nextBtn}
                        onPress={() => {
                            switch (this.state.index) {
                                case 0: {
                                    if (
                                        this.state.type &&
                                        this.state.type.length > 0
                                    ) {
                                        this.reach_step = 1;
                                        this.setState({index: 1});
                                    }
                                    Keyboard.dismiss();
                                    break;
                                }
                                case 1: {
                                    if (this.state.selClub) {
                                        this.reach_step = 2;
                                        this.setState({index: 2});
                                    }
                                    Keyboard.dismiss();
                                    break;
                                }
                                case 2: {
                                    if (
                                        this.state.content &&
                                        this.state.content.length > 0
                                    ) {
                                        this.reach_step = 3;
                                        Keyboard.dismiss();
                                        this.createPost();
                                    }
                                    break;
                                }
                            }
                        }}>
                        <Text style={s.nextBtnLabel}>{t('next')}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row'}}>
                    {props.navigationState.routes.map((route, i) => {
                        return (
                            <TouchableOpacity
                                key={i + ''}
                                style={[
                                    s.paginationDot,
                                    {
                                        backgroundColor:
                                            this.state.index == i
                                                ? PRIMARY_COLOR
                                                : '#C4C4C4',
                                    },
                                ]}
                                onPress={() => {
                                    if (this.reach_step >= i) {
                                        props.jumpTo(route.key);
                                    }
                                }}
                            />
                        );
                    })}
                </View>
                <Spinner
                    visible={this.state.spinner}
                    textContent={t('creating')}
                    textStyle={s.spinnerTextStyle}
                />
            </View>
        );
    };
    _renderScene = ({route, jumpTo}) => {
        switch (route.key) {
            case 'route_type':
                return (
                    <RouteType
                        route={route}
                        jumpTo={jumpTo}
                        {...this.state}
                        onChangeValue={(name, value) =>
                            this.onChangeValue(name, value)
                        }
                        t={this.props.t}
                    />
                );
            case 'route_club':
                return (
                    <RouteClub
                        route={route}
                        jumpTo={jumpTo}
                        {...this.state}
                        clubs_user={this.props.clubs_user}
                        onChangeValue={(name, value) =>
                            this.onChangeValue(name, value)
                        }
                        t={this.props.t}
                    />
                );
            case 'route_content':
                return (
                    <RouteContent
                        route={route}
                        jumpTo={jumpTo}
                        {...this.state}
                        onChangeValue={(name, value) =>
                            this.onChangeValue(name, value)
                        }
                        t={this.props.t}
                    />
                );
        }
    };
    render() {
        return (
            <View style={{flex: 1}}>
                <TabView
                    navigationState={this.state}
                    renderScene={this._renderScene}
                    renderTabBar={this._renderTabBar}
                    onIndexChange={this._handleIndexChange}
                    swipeEnabled={false}
                />
            </View>
        );
    }
}
const mapStateToProps = (state) => ({
    clubs_user: state.club.clubs_user,
});

const mapDispatchToProps = {
    createPost,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(hoistStatics(withTranslation('createpost')(CreatePost), CreatePost));
