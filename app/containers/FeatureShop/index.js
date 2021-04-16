import * as React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Platform,
    Image,
    FlatList,
} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {PRIMARY_COLOR, PRIMARY_TEXT_COLOR} from '../../themes/colors';
import {connect} from 'react-redux';
import IconShop from '../../assets/icon_shop.png';
import IconZirklpay from '../../assets/icon_zirklpay.png';
import {
    getFeatureshops,
    getClubFeatures,
    subscribePlan,
} from '../../reducers/featureshop';
import {showMessage, getUserName} from '../../utils/utils';
import RNIap, {
    purchaseErrorListener,
    purchaseUpdatedListener,
} from 'react-native-iap';
import Spinner from 'react-native-loading-spinner-overlay';
import {withTranslation} from 'react-i18next';
import hoistStatics from 'hoist-non-react-statics';

const TITLES = {
    main: '',
};
const itemSkus = Platform.select({
    ios: ['zirkl_pay_5', 'zirkl_pay_10'],
    android: ['android.test.purchased', 'zirkl_pay_5', 'zirkl_pay_10'],
});

class FeatureShop extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            header: null,
        };
    };
    constructor(props) {
        super(props);
        const club_id = props.navigation.getParam('club_id');

        this.state = {
            page: 'main',
            togglebtn: 'all',
            selPlan: null,
            club_id,
            processing: false,
        };
        props.getFeatureshops(club_id != null ? 'club' : 'user');
        if (club_id != null) props.getClubFeatures(club_id);
    }
    purchaseUpdateSubscription = null;
    purchaseErrorSubscription = null;
    async componentDidMount() {
        try {
            const msg = await RNIap.initConnection();
            console.log('====msg', msg);

            const products = await RNIap.getProducts(itemSkus);

            if (Platform.OS == 'android') {
                //const consumall = await RNIap.consumeAllItemsAndroid();
            } else {
                // const pendingiospurchases = await RNIap.getPendingPurchasesIOS();
            }
            this.setState({products});
        } catch (err) {
            console.warn(err); // standardized err.code and err.message available
        }
        this.purchaseUpdateSubscription = purchaseUpdatedListener(purchase => {
            const receipt = purchase.transactionReceipt;
            if (receipt && this.current_plan) {
                this.onSubscribe(purchase);
            } else {
                this.setState({processing: false});
            }
        });

        this.purchaseErrorSubscription = purchaseErrorListener(error => {
            this.setState({processing: false});
            if (error && error.code == 'E_USER_CANCELLED') return;

            showMessage(error.message ? error.message : JSON.stringify(error));
            console.warn('=======purchaseErrorListener', error);
        });
    }
    async componentWillUnmount() {
        try {
            if (Platform.OS == 'android') {
                await RNIap.endConnectionAndroid;
            } else await RNIap.endConnection;
        } catch (err) {
            console.warn(err); // standardized err.code and err.message available
        }

        if (this.purchaseUpdateSubscription) {
            this.purchaseUpdateSubscription.remove();
            this.purchaseUpdateSubscription = null;
        }
        if (this.purchaseErrorSubscription) {
            this.purchaseErrorSubscription.remove();
            this.purchaseErrorSubscription = null;
        }
    }
    requestPurchase = async (sku, plan) => {
        this.current_plan = plan;
        const availablepurchases = await RNIap.getAvailablePurchases();
        if (availablepurchases && availablepurchases.length > 0) {
            // Todo check if availablepurchases product id and plan product id are difference
            this.onSubscribe(availablepurchases[0]);
            return;
        }
        try {
            this.setState({processing: true});
            await RNIap.requestPurchase(sku, false);
        } catch (err) {
            this.setState({processing: false});
            console.warn(err.code, err.message);
        }
    };

    requestSubscription = async sku => {
        try {
            await RNIap.requestSubscription(sku);
        } catch (err) {
            console.warn(err.code, err.message);
        }
    };
    onSubscribe(purchase) {
        this.props.subscribePlan(
            {
                club_id: this.state.club_id,
                plan_id: this.current_plan && this.current_plan.id,
                mock: 'success',
                transaction: JSON.stringify(purchase),
                provider: Platform.OS == 'ios' ? 'apple' : 'google',
            },
            res => {
                if (res) {
                    if (Platform.OS === 'ios') {
                        RNIap.finishTransactionIOS(purchase.transactionId);
                    } else if (Platform.OS === 'android') {
                        // If consumable (can be purchased again)
                        RNIap.consumePurchaseAndroid(purchase.purchaseToken);
                        // If not consumable
                        RNIap.acknowledgePurchaseAndroid(
                            purchase.purchaseToken,
                        );
                    }
                    RNIap.finishTransaction(purchase, true);
                }
                this.setState({processing: false});
            },
        );
    }
    renderMain() {
        const {togglebtn, selPlan, club_id} = this.state;
        const {t, user, user_profile, features, subscribes, club} = this.props;

        var avatar =
            user_profile && user_profile.avatar && user_profile.avatar.original;
        var name = getUserName(user);
        if (club_id != null) {
            name = club.name;
            avatar = club.photo && club.photo.original;
        }
        const boughtFeatures = subscribes.map(feature => feature?.feature?.id);
        console.log('====features', features);
        return (
            <View style={s.maincontent}>
                <View style={s.avatarcontainer}>
                    <View style={s.avatar}>
                        {avatar && (
                            <Image
                                source={{uri: avatar}}
                                style={s.avatarImage}
                            />
                        )}
                    </View>
                    <Image
                        source={IconShop}
                        style={{width: 60, height: 60, resizeMode: 'contain'}}
                    />
                </View>
                <Text style={s.username}>{name}</Text>
                <Text style={s.title}>{t('title')}</Text>
                <Text style={[s.version]}>{t('description')}</Text>
                <View style={s.togglebtngroup}>
                    <TouchableOpacity
                        style={[
                            s.togglebtn,
                            {
                                backgroundColor:
                                    togglebtn == 'all'
                                        ? PRIMARY_COLOR
                                        : 'white',
                            },
                        ]}
                        onPress={() => this.setState({togglebtn: 'all'})}>
                        <Text
                            style={[
                                s.togglebtnlabel,
                                {
                                    color:
                                        togglebtn == 'all'
                                            ? 'white'
                                            : PRIMARY_COLOR,
                                },
                            ]}>
                            {t('all')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            s.togglebtn,
                            {
                                backgroundColor:
                                    togglebtn != 'all'
                                        ? PRIMARY_COLOR
                                        : 'white',
                            },
                        ]}
                        onPress={() => this.setState({togglebtn: 'active'})}>
                        <Text
                            style={[
                                s.togglebtnlabel,
                                {
                                    color:
                                        togglebtn != 'all'
                                            ? 'white'
                                            : PRIMARY_COLOR,
                                },
                            ]}>
                            {t('bought')}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', flex: 1}}>
                    {togglebtn == 'all' ? (
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            style={{width: '100%', marginVertical: 10}}
                            data={features.filter(
                                feature => !boughtFeatures.includes(feature.id),
                            )}
                            renderItem={({item}) => {
                                const {name, plans} = item.feature;
                                const subscribe = subscribes.find(
                                    subs =>
                                        subs.features &&
                                        subs.features.feature &&
                                        subs.features.feature.id == item.id,
                                );
                                return plans.map(plan => {
                                    if (!plan.active) return;
                                    const sku =
                                        Platform.OS == 'ios'
                                            ? plan.feature_id_for_apple
                                            : itemSkus[0]; //plan.feature_id_for_google
                                    return (
                                        <View
                                            key={plan.id + ''}
                                            style={{width: '100%'}}>
                                            <View style={s.contbItem}>
                                                <TouchableOpacity
                                                    style={s.contbContent}
                                                    onPress={() => {
                                                        if (
                                                            selPlan &&
                                                            selPlan.id ==
                                                                plan.id
                                                        ) {
                                                            this.setState({
                                                                selPlan: null,
                                                            });
                                                        } else
                                                            this.setState({
                                                                selPlan: plan,
                                                            });
                                                    }}>
                                                    <View
                                                        style={{
                                                            flexDirection:
                                                                'row',
                                                            alignItems:
                                                                'center',
                                                            flex: 1,
                                                        }}>
                                                        <Image
                                                            source={
                                                                IconZirklpay
                                                            }
                                                            style={
                                                                s.zirklpayimg
                                                            }
                                                        />
                                                        <View style={{flex: 1}}>
                                                            <Text
                                                                style={
                                                                    s.contbItemName
                                                                }>
                                                                {name}
                                                            </Text>
                                                            <Text
                                                                style={
                                                                    s.contbItemDesp
                                                                }>
                                                                {plan.name}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View style={s.priceview}>
                                                        <Text style={s.amount}>
                                                            {plan.price}
                                                        </Text>
                                                        <Text style={s.unit}>
                                                            {plan.currency}
                                                        </Text>
                                                        {/*<Text style={s.frequence}>pro Jahr</Text>*/}
                                                        <Icon
                                                            name="refresh-cw"
                                                            size={20}
                                                            color={
                                                                PRIMARY_COLOR
                                                            }
                                                            style={{
                                                                position:
                                                                    'absolute',
                                                                top: -10,
                                                                right: -10,
                                                            }}
                                                        />
                                                    </View>
                                                </TouchableOpacity>
                                                {selPlan &&
                                                    selPlan.id == plan.id && (
                                                        <View
                                                            style={
                                                                s.zirklpaycontent
                                                            }>
                                                            <Text
                                                                style={
                                                                    s.description
                                                                }>
                                                                Lorem ipsum
                                                                dolor sit amet,
                                                                consectetur
                                                                adipiscing elit.
                                                                Fusce mi felis,
                                                                placerat sed
                                                                risus et,
                                                                dapibus
                                                                vestibulum
                                                                lectus. Nunc sit
                                                                amet condimentum
                                                                dui. Nam blandit
                                                                erat ac augue
                                                                consectetur.
                                                            </Text>
                                                            {subscribe ==
                                                                null && (
                                                                <TouchableOpacity
                                                                    style={[
                                                                        s.button,
                                                                        {
                                                                            marginTop: 20,
                                                                        },
                                                                    ]}
                                                                    onPress={() => {
                                                                        if (sku)
                                                                            this.requestPurchase(
                                                                                sku,
                                                                                plan,
                                                                            );
                                                                        else
                                                                            alert(
                                                                                "This product wasn't found.",
                                                                            );
                                                                    }}>
                                                                    <Text
                                                                        style={
                                                                            s.btnLabel
                                                                        }>
                                                                        {t(
                                                                            'tobuy',
                                                                        )}
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            )}
                                                        </View>
                                                    )}
                                            </View>
                                        </View>
                                    );
                                });
                            }}
                            keyExtractor={(item, index) => item.id + ''}
                        />
                    ) : (
                        <FlatList
                            style={{width: '100%', marginVertical: 10}}
                            data={
                                subscribes &&
                                subscribes.filter(item => item.configuration)
                            }
                            renderItem={({item}) => {
                                const {subscribed_plan} = item.configuration;
                                return (
                                    <View style={{width: '100%'}}>
                                        <View style={s.contbItem}>
                                            <View style={s.contbContent}>
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        flex: 1,
                                                    }}>
                                                    <Image
                                                        source={IconZirklpay}
                                                        style={s.zirklpayimg}
                                                    />
                                                    <View style={{flex: 1}}>
                                                        <Text
                                                            style={
                                                                s.contbItemName
                                                            }>
                                                            {
                                                                item?.feature
                                                                    ?.name
                                                            }
                                                        </Text>
                                                        <Text
                                                            style={
                                                                s.contbItemDesp
                                                            }>
                                                            {
                                                                subscribed_plan.name
                                                            }
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={s.priceview}>
                                                    <Text style={s.amount}>
                                                        {subscribed_plan.price}
                                                    </Text>
                                                    <Text style={s.unit}>
                                                        {
                                                            subscribed_plan.currency
                                                        }
                                                    </Text>
                                                    {/*<Text style={s.frequence}>pro Jahr</Text>*/}
                                                    <Icon
                                                        name="check"
                                                        size={20}
                                                        color={PRIMARY_COLOR}
                                                        style={{
                                                            position:
                                                                'absolute',
                                                            top: -10,
                                                            right: -10,
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                );
                            }}
                            keyExtractor={(item, index) => item.id + ''}
                        />
                    )}
                </View>
            </View>
        );
    }
    render() {
        const {page} = this.state;
        return (
            <View style={s.container}>
                <View style={s.wrapper}>
                    <View style={s.topBar}>
                        <Text style={s.title}>{TITLES[page]}</Text>
                        <TouchableOpacity
                            style={{borderRadius: 30, overflow: 'hidden'}}
                            onPress={() => this.props.navigation.goBack()}>
                            <Icon
                                name="x"
                                color="white"
                                size={17}
                                style={{
                                    fontWeight: '100',
                                    backgroundColor: PRIMARY_TEXT_COLOR,
                                    width: 35,
                                    height: 35,
                                    textAlign: 'center',
                                    paddingTop: 8,
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={s.content}>
                        {page == 'main' && this.renderMain()}
                    </View>
                </View>
                <Spinner
                    visible={this.state.processing}
                    textContent={''}
                    textStyle={s.spinnerTextStyle}
                />
            </View>
        );
    }
}
const mapStateToProps = state => ({
    user: state.user.user,
    user_profile: state.user.user_profile,
    club: state.club.club,
    features: state.featureshop.features,
    subscribes: state.featureshop.subscribes,
});

const mapDispatchToProps = {
    getFeatureshops,
    getClubFeatures,
    subscribePlan,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(hoistStatics(withTranslation('featureshop')(FeatureShop), FeatureShop));
