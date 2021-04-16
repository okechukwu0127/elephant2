import React from 'react';
import {
    TextInput,
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import s, {fab_width} from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {
    BACKGROUND_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
} from '../../themes/colors';
import IconCoins from '../../assets/icon_coins.png';
import Modal from 'react-native-modal';
import moment from 'moment';
import {withTranslation} from 'react-i18next';
import {getUserName} from '../../utils/utils';
import AvatarImage from '../AvatarImage';

class FeedCardAddedFeature extends React.Component {
    state = {
        showReceipt: false,
    };
    render() {
        const {t, unfold, data, openCard} = this.props;
        const content = data && data.content;
        const club = content && content.club;
        const feature = content && content.feature;
        const user = content && content.user;
        const subscribed_plan = content && content.subscribed_plan;

        return (
            <View style={s.container}>
                <TouchableOpacity
                    style={[s.header, {paddingRight: 12}]}
                    onPress={() => {
                        openCard && openCard(data.id);
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <View style={s.avatar}>
                            <AvatarImage
                                uri={club && club.photo && club.photo.original}
                                width={32}
                                user={{first_name: club && club.name}}
                                backgroundColor={'rgba(255,255,255,0.5)'}
                            />
                        </View>
                        <View>
                            <Text style={s.headerTitle}>
                                {(club && club.name) || t('clubname')}
                            </Text>
                            <Text style={s.headerSubTitle}>
                                {t('confirmpurchase')}{' '}
                            </Text>
                        </View>
                    </View>
                    <Image
                        source={IconCoins}
                        style={{width: 40, height: 35, resizeMode: 'contain'}}
                    />
                </TouchableOpacity>
                {unfold && (
                    <View style={s.content}>
                        <View style={s.contentHeader}></View>
                        <View
                            style={[
                                s.body,
                                {
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                },
                            ]}>
                            <Text
                                style={[
                                    s.priceTxt,
                                    {color: '#6C8AF1', marginBottom: 10},
                                ]}>
                                {t('zirklpay')}
                            </Text>
                            <Text
                                style={[
                                    s.priceDescription,
                                    {textAlign: 'center'},
                                ]}>
                                {t('zirklpaycreatedby', {
                                    username: getUserName(user),
                                })}
                                <Text
                                    style={[
                                        s.priceDescription,
                                        {
                                            textAlign: 'center',
                                            color: 'black',
                                            fontFamily: 'Rubik-Bold',
                                        },
                                    ]}>
                                    {feature && feature.name}
                                </Text>{' '}
                                {t('unlocked')}
                            </Text>
                        </View>
                        <View style={s.contentFooter}>
                            <TouchableOpacity
                                onPress={() =>
                                    this.setState({showReceipt: true})
                                }>
                                <View style={s.iconContainer}>
                                    <Icon
                                        name="file"
                                        size={27}
                                        color={PRIMARY_COLOR}
                                    />
                                    <Text style={s.iconlabel}>
                                        {t('receipt')}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <View style={[s.iconContainer, {opacity: 0}]}>
                                <Icon
                                    name="bookmark"
                                    size={27}
                                    color={PRIMARY_COLOR}
                                />
                                <Text style={s.iconlabel}>Vormerken</Text>
                            </View>
                            <View style={[s.iconContainer, {opacity: 0}]}>
                                <Icon
                                    name="bookmark"
                                    size={27}
                                    color={PRIMARY_COLOR}
                                />
                                <Text style={s.iconlabel}>Vormerken</Text>
                            </View>
                            <View style={[s.iconContainer, {opacity: 0}]}>
                                <Icon
                                    name="bookmark"
                                    size={27}
                                    color={PRIMARY_COLOR}
                                />
                                <Text style={s.iconlabel}>Vormerken</Text>
                            </View>
                        </View>
                    </View>
                )}
                {this.state.showReceipt && (
                    <Modal
                        isVisible={this.state.showReceipt}
                        onBackButtonPress={() =>
                            this.setState({showReceipt: false})
                        }
                        onBackdropPress={() =>
                            this.setState({showReceipt: false})
                        }
                        onSwipeComplete={() =>
                            this.setState({showReceipt: false})
                        }
                        swipeDirection={['down']}
                        style={s.modal}
                        avoidKeyboard>
                        <View style={s.modalContainer}>
                            <Text style={s.priceTxt}>
                                {feature && feature.name}
                            </Text>
                            <View style={{flexDirection: 'row', marginTop: 20}}>
                                <View style={{flex: 0.5}}>
                                    <Text
                                        style={[
                                            s.priceTxt,
                                            {color: PRIMARY_COLOR},
                                        ]}>{`${content.currency} ${content.price}`}</Text>
                                </View>
                                <View style={{flex: 0.5}}>
                                    <Text
                                        style={
                                            s.priceDescription
                                        }>{`${subscribed_plan.name}`}</Text>
                                    <Text style={s.priceDescription}>
                                        {getUserName(user)}
                                    </Text>
                                    <Text
                                        style={[
                                            s.priceDescription,
                                            {marginTop: 10, color: 'black'},
                                        ]}>{`${moment(data.created_at).format(
                                        'MMM DD YYYY h:mm a',
                                    )}`}</Text>
                                </View>
                            </View>
                        </View>
                    </Modal>
                )}
            </View>
        );
    }
}

export default withTranslation('feedcard')(FeedCardAddedFeature);
