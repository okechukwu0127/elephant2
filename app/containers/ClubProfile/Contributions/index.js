import * as React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    ScrollView,
    Dimensions,
    Alert,
    FlatList,
} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {PRIMARY_COLOR, PRIMARY_TEXT_COLOR} from '../../../themes/colors';
import {connect} from 'react-redux';
import * as Progress from 'react-native-progress';
import {getInvoices, deleteInvoice} from '../../../reducers/invoices';
import {withTranslation} from 'react-i18next';
import hoistStatics from 'hoist-non-react-statics';
import {getUserName, showMessage} from '../../../utils/utils';
import {AvatarImage} from '../../../components/';

const {width} = Dimensions.get('window');

const TITLES = {
    main: '',
};
class Contributions extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            header: null,
        };
    };
    constructor(props) {
        super(props);
        const club_id = props.navigation.getParam('club_id');
        const isZirklpay = props.navigation.getParam('isZirklpay');
        this.state = {
            club_id,
            page: 'main',
            togglebtn: 'active',
            isZirklpay,
        };
        props.getInvoices(club_id);
    }
    componentDidMount() {
        this.unsubsribe = this.props.navigation.addListener('willFocus', () => {
            const club_id = this.props.navigation.getParam('club_id');
            this.props.getInvoices(club_id);
            console.log('Refreshing invoices..');
        });
    }
    componentWillUnmount() {
        if (this.unsubsribe && typeof this.unsubsribe === 'function') {
            this.unsubsribe();
        }
    }
    deleteDraft = id => {
        Alert.alert(
            'Confirm',
            'Are sure you want to delete this draft?',
            [
                {
                    text: 'Abbrechen',
                    onPress: () => {},
                    style: 'cancel',
                },
                {
                    text: 'Löschen',
                    onPress: () => {
                        this.props.deleteInvoice(id, success => {
                            if (!success) {
                                return showMessage(
                                    'Failed to delete the invoice',
                                );
                            }
                            this.props.getInvoices(this.state.club_id);
                            showMessage('Invoice deleted successfully!', true);
                        });
                    },
                },
            ],
            {cancelable: true},
        );
    };
    renderMain() {
        const {togglebtn, club_id, isZirklpay} = this.state;
        const {t, invoices_club} = this.props;
        const datasource =
            togglebtn == 'all'
                ? invoices_club
                : invoices_club.filter(item => item.status != 'draft');
        return (
            <View style={s.maincontent}>
                <Text
                    style={[s.title, {textAlign: 'center', marginBottom: 10}]}>
                    {isZirklpay ? t('zirklpay') : t('zirklpaywithout')}
                </Text>
                <View style={s.togglebtngroup}>
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
                            {t('active')}
                        </Text>
                    </TouchableOpacity>
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
                </View>
                <TouchableOpacity
                    style={[s.button, {marginTop: 20}]}
                    onPress={() => {
                        this.props.navigation.navigate('ZirklPay', {
                            club_id: club_id,
                            isZirklpay: isZirklpay,
                        });
                    }}>
                    <Text style={[s.btnLabel, {textTransform: 'uppercase'}]}>
                        {t('create')}
                    </Text>
                </TouchableOpacity>
                <FlatList
                    data={datasource.map(item => {
                        const amount_statistics =
                            item && item.amount_statistics;
                        const progress =
                            amount_statistics && amount_statistics.progress;
                        var rate = 0;
                        if (progress) {
                            rate =
                                progress.total / amount_statistics.gross_total;
                        }

                        return {...item, rate};
                    })}
                    renderItem={({item}) => {
                        const {user, rate} = item;
                        return (
                            <TouchableOpacity
                                key={item.id + ''}
                                style={s.contbItem}
                                onPress={() => {
                                    this.props.navigation.navigate('ZirklPay', {
                                        club_id: club_id,
                                        invoice: item,
                                        isZirklpay: isZirklpay,
                                    });
                                }}>
                                <View style={s.contbContent}>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}>
                                        <AvatarImage
                                            user_id={user?.id}
                                            user={user}
                                            width={35}
                                            style={{marginRight: 10}}
                                        />
                                        <View>
                                            <Text style={s.contbItemName}>
                                                {getUserName(user)}
                                            </Text>
                                            <Text style={s.contbItemDesp}>
                                                {item.purpose || '-'}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{alignItems: 'flex-end'}}>
                                        <Text
                                            style={[
                                                s.contbItemStatus,
                                                {textTransform: 'capitalize'},
                                                item.status == 'draft'
                                                    ? {color: 'red'}
                                                    : {},
                                            ]}>
                                            {item.status}
                                        </Text>
                                        {item?.status === 'draft' && (
                                            <TouchableOpacity
                                                onPress={() =>
                                                    this.deleteDraft(item?.id)
                                                }
                                                style={{marginTop: 10}}>
                                                <Icon
                                                    name="trash"
                                                    color="red"
                                                    size={25}
                                                />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                                {item.status != 'draft' && !isNaN(rate) ? (
                                    <Progress.Bar
                                        progress={rate}
                                        width={width - 80}
                                        height={8}
                                        color={PRIMARY_COLOR}
                                        unfilledColor={'#C4C4C4'}
                                    />
                                ) : (
                                    <View style={{width: width - 80}} />
                                )}
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
        );
    }
    render() {
        const {page} = this.state;
        return (
            <View style={s.container}>
                <View style={s.wrapper}>
                    <ScrollView>
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
                    </ScrollView>
                </View>
            </View>
        );
    }
}
const mapStateToProps = state => ({
    invoices_club: state.invoices.invoices_club,
});

const mapDispatchToProps = {
    getInvoices,
    deleteInvoice,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(
    hoistStatics(
        withTranslation(['contributions'])(Contributions),
        Contributions,
    ),
);
