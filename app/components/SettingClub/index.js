import React from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
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
import {setFeedOption, getUserFeed} from '../../reducers/feed';
import {withTranslation} from 'react-i18next';
import {navigateScreen} from '../../reducers/user';

class SettingClub extends React.Component {
    onClick(key) {
        const {feed_options} = this.props;
        this.props.setFeedOption({[key]: !feed_options[key]});
    }
    onClose() {
        this.props.getUserFeed();
        this.props.onClose();
    }
    render() {
        const {t, feed_options} = this.props;
        return (
            <Modal
                isVisible={this.props.isVisible}
                onBackButtonPress={() => this.onClose()}
                //onBackdropPress={() => this.props.onClose()}
                onSwipeComplete={() => this.onClose()}
                swipeDirection={['down']}
                style={s.modal}
                backdropTransitionInTiming={0}
                backdropTransitionOutTiming={0}
                animationIn="fadeIn"
                animationOut="fadeOut">
                <View style={s.modalContainer}>
                    <View style={s.modalContent}>
                        <View style={s.checkgroup}>
                            <Text style={s.checkgroupTitle}>
                                {t('content')}
                            </Text>
                            <CheckBox
                                style={{
                                    flex: 1,
                                    paddingVertical: 10,
                                    marginVertical: 5,
                                }}
                                onClick={() => {
                                    this.onClick('members');
                                }}
                                isChecked={feed_options.members}
                                leftText={t('member')}
                                checkBoxColor={'white'}
                                leftTextStyle={s.checkboxText}
                            />
                            <CheckBox
                                style={{
                                    flex: 1,
                                    paddingVertical: 10,
                                    marginVertical: 5,
                                }}
                                onClick={() => {
                                    this.onClick('event');
                                }}
                                isChecked={feed_options.event}
                                leftText={t('events')}
                                checkBoxColor={'white'}
                                leftTextStyle={s.checkboxText}
                            />
                            <CheckBox
                                style={{
                                    flex: 1,
                                    paddingVertical: 10,
                                    marginVertical: 5,
                                }}
                                onClick={() => {
                                    this.onClick('news');
                                }}
                                isChecked={feed_options.news}
                                leftText={t('news')}
                                checkBoxColor={'white'}
                                leftTextStyle={s.checkboxText}
                            />
                            <CheckBox
                                style={{
                                    flex: 1,
                                    paddingVertical: 10,
                                    marginVertical: 5,
                                }}
                                onClick={() => {
                                    this.onClick('finance');
                                }}
                                isChecked={feed_options.finance}
                                leftText={t('finance')}
                                checkBoxColor={'white'}
                                leftTextStyle={s.checkboxText}
                            />
                            <CheckBox
                                style={{
                                    flex: 1,
                                    paddingVertical: 10,
                                    marginVertical: 5,
                                }}
                                onClick={() => {
                                    this.onClick('sponsor');
                                }}
                                isChecked={feed_options.sponsor}
                                leftText={t('sponsor')}
                                checkBoxColor={'white'}
                                leftTextStyle={s.checkboxText}
                            />
                        </View>
                        <View style={s.checkgroup}>
                            <Text style={s.checkgroupTitle}>
                                {t('settings')}
                            </Text>
                            <TouchableOpacity
                                style={s.addclubBtn}
                                onPress={async () => {
                                    await this.props.navigateScreen(
                                        'UserProfile',
                                    );
                                    this.onClose();
                                }}>
                                <Text style={s.addclubBtnLabel}>
                                    {t('personalprofile')}
                                </Text>
                            </TouchableOpacity>
                            {/*about us*/}
                            <TouchableOpacity
                                style={s.addclubBtn}
                                onPress={async () => {
                                    await this.props.navigateScreen('AboutUs');
                                    this.onClose();
                                }}>
                                <Text style={s.addclubBtnLabel}>
                                    {t('aboutus')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={[
                            s.iconBtn,
                            {position: 'absolute', right: 25, bottom: 25},
                        ]}
                        onPress={() => this.onClose()}>
                        <Icon
                            name="move"
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
    feed_options: state.feed.feed_options,
});

const mapDispatchToProps = {
    setFeedOption,
    getUserFeed,
    navigateScreen,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslation('rightnavigation')(SettingClub));
