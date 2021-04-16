import React from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    ScrollView,
} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';
import CheckBox from 'react-native-check-box';
import {
    BACKGROUND_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
} from '../../themes/colors';
import {connect} from 'react-redux';
import {selectClubs, getUserFeed, setFeedSettings} from '../../reducers/feed';
import {withTranslation} from 'react-i18next';
import {navigateScreen} from '../../reducers/user';

class SettingFeed extends React.Component {
    state = {
        isChecked: false,
    };
    onCheck(club_id, isSel) {
        const {clubs_user, selected_clubs} = this.props;
        if (isSel) {
            this.props.selectClubs(
                selected_clubs.filter(item => item != club_id),
            );
        } else this.props.selectClubs([...selected_clubs, club_id]);
    }
    onClose() {
        this.props.getUserFeed();
        this.props.onClose();
    }
    render() {
        const {
            t,
            myinterest,
            nearyby,
            clubs_user,
            board_of_clubs,
            selected_clubs,
        } = this.props;
        let datasource = [...clubs_user, ...board_of_clubs];

        datasource = datasource.filter(
            (thing, index, self) =>
                index === self.findIndex(t => t.id === thing.id),
        );

        let isAll =
            datasource.length > 0 && datasource.length == selected_clubs.length
                ? true
                : false;
        if (datasource.length <= 0) {
            isAll = this.state.isChecked;
        }
        return (
            <Modal
                isVisible={this.props.isVisible}
                onBackButtonPress={() => this.onClose()}
                //onBackdropPress={() => this.props.onClose()}
                onSwipeComplete={() => this.onClose()}
                //swipeDirection={['down']}
                style={s.modal}
                backdropTransitionInTiming={0}
                backdropTransitionOutTiming={0}
                animationIn="fadeIn"
                animationOut="fadeOut">
                <View style={s.modalContainer}>
                    <View style={s.modalContent}>
                        <ScrollView
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}>
                            <View style={[s.checkgroup, {paddingTop: 20}]}>
                                <Text style={s.checkgroupTitle}>
                                    {t('discover')}
                                </Text>
                                <View style={s.checkboxContainer}>
                                    <CheckBox
                                        style={{
                                            width: 160,
                                            paddingVertical: 5,
                                            marginVertical: 0,
                                        }}
                                        onClick={() => {
                                            this.props.setFeedSettings({
                                                myinterest: !myinterest,
                                            });
                                        }}
                                        isChecked={myinterest}
                                        rightText={t('interest')}
                                        checkBoxColor={PRIMARY_TEXT_COLOR}
                                        rightTextStyle={s.checkboxText}
                                    />
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.onClose();
                                            this.props.navigation.navigate(
                                                'UserClubSettingEdit',
                                                {type: 'interest'},
                                            );
                                            // if (state.routeName != 'Feed')
                                            //     this.props.navigation.navigate('Feed')
                                        }}>
                                        <Icon
                                            name="edit"
                                            size={20}
                                            color={PRIMARY_COLOR}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={s.checkboxContainer}>
                                    <CheckBox
                                        style={{
                                            width: 120,
                                            paddingVertical: 5,
                                            marginVertical: 0,
                                        }}
                                        onClick={() => {
                                            this.props.setFeedSettings({
                                                nearyby: !nearyby,
                                            });
                                        }}
                                        isChecked={nearyby}
                                        rightText={t('near')}
                                        checkBoxColor={PRIMARY_TEXT_COLOR}
                                        rightTextStyle={s.checkboxText}
                                    />
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.onClose();
                                            this.props.navigateScreen(
                                                'UserClubSettingEdit',
                                                {type: 'nearby'},
                                            );
                                            // if (state.routeName != 'SearchClub')
                                            //     this.props.navigation.navigate('SearchClub')
                                        }}>
                                        <Icon
                                            name="edit"
                                            size={20}
                                            color={PRIMARY_COLOR}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={s.checkgroup}>
                                <Text style={s.checkgroupTitle}>
                                    {t('myclubs')}
                                </Text>
                                <CheckBox
                                    style={{
                                        flex: 1,
                                        paddingVertical: 0,
                                        marginVertical: 5,
                                    }}
                                    onClick={() => {
                                        this.setState({
                                            isChecked: !this.state.isChecked,
                                        });
                                        if (!isAll) {
                                            this.props.selectClubs(
                                                datasource.map(item => item.id),
                                            );
                                        } else this.props.selectClubs([]);
                                    }}
                                    isChecked={isAll}
                                    rightText={t('all')}
                                    checkBoxColor={PRIMARY_TEXT_COLOR}
                                    rightTextStyle={s.checkboxText}
                                />
                                {datasource.map(item => {
                                    const isSel = selected_clubs.includes(
                                        item.id,
                                    );
                                    return (
                                        <CheckBox
                                            key={item.id + ''}
                                            style={{
                                                flex: 1,
                                                paddingVertical: 0,
                                                marginVertical: 5,
                                            }}
                                            onClick={() => {
                                                this.onCheck(item.id, isSel);
                                            }}
                                            isChecked={isSel}
                                            rightText={item.name}
                                            checkBoxColor={PRIMARY_TEXT_COLOR}
                                            rightTextStyle={s.checkboxText}
                                        />
                                    );
                                })}
                                <TouchableOpacity
                                    style={s.addclubBtn}
                                    onPress={() => {
                                        this.onClose();
                                        this.props.navigateScreen(
                                            'DiscoverTab',
                                        );
                                    }}>
                                    <Text style={s.addclubBtnLabel}>
                                        {t('addclub')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                    <TouchableOpacity
                        style={[
                            s.iconBtn,
                            {position: 'absolute', left: 25, bottom: 25},
                        ]}
                        onPress={() => this.onClose()}>
                        <Icon
                            name="globe"
                            size={20}
                            color="white"
                            style={s.icon}
                        />
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }
}
const mapStateToProps = state => ({
    selected_clubs: state.feed.selected_clubs,
    board_of_clubs: state.club.board_of_clubs,
    clubs_user: state.club.clubs_user,

    myinterest: state.feed.myinterest,
    nearyby: state.feed.nearyby,
});

const mapDispatchToProps = {
    selectClubs,
    getUserFeed,
    setFeedSettings,
    navigateScreen,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslation('leftnavigation')(SettingFeed));
