import * as React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    TextInput,
    ScrollView,
    FlatList,
    ActivityIndicator,
    Linking,
} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {
    BACKGROUND_COLOR,
    GRAY_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
} from '../../../themes/colors';
import {connect} from 'react-redux';
import {FeedCardFinance, ToggleSwitch, CloseButton} from '../../../components';
import {
    createInitialInvoice,
    changeAmountOfMembersFromPlan,
    updateInvoiceDetails,
    confirmInvoice,
    getMemberInvoices,
    changePaymentStatusOfMember,
    updateFeeOption,
    setMembershipExclusion,
    setPaymentStatus,
} from '../../../reducers/invoices';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import {PLAN_COLORS} from '../../../constants';
import ScrollPicker from '../../../components/ScrollPicker';
import CheckBox from 'react-native-check-box';
import ActionSheet from 'react-native-action-sheet';
import {withTranslation} from 'react-i18next';
import hoistStatics from 'hoist-non-react-statics';
import {getUserName, showMessage} from '../../../utils/utils';
import {AvatarImage} from '../../../components';

const TITLES = t => ({
    main: t('titlemain'),
    preview: t('titlepreview'),
    plans: t('titleplans'),
    plandetail: t('titleplandetail'),
    history: t('titlehistory'),
    shippingmethod: t('titleshipping'),
    incoming: t('titleincoming'),
});
const INVOICE_STATUS = t => [
    {
        value: 'due',
        label: t('statusdue'),
        color: PRIMARY_TEXT_COLOR,
        paid: false,
    },
    {value: 'overdue', label: t('statusoverdue'), color: 'red', paid: false},
    //{ value: 'paid_to_provider', }
    {
        value: 'paid_to_zirkl',
        label: t('statuszirkl'),
        color: '#FF5286',
        paid: true,
    },
    {
        value: 'paid_to_club',
        label: t('statusclub'),
        color: '#6C8AF1',
        paid: true,
    },
    {
        value: 'complete',
        label: t('statuscomplete'),
        color: '#429F7E',
        paid: true,
    },
];
const SHIPPING_METHOD = t => [
    // {value: 'mail', label: t('shippingmail'), color: '#642FD0'},
    // {value: 'sms', label: t('shippingsms'), color: '#6C8AF1'},
    {value: 'app', label: t('shippingapp'), color: '#429F7E'},
];
const FEE_OPTIONS = ['add-to-membership', 'deduct-from-membership'];
class ZirklPay extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            header: null,
        };
    };
    constructor(props) {
        super(props);
        const club_id = props.navigation.getParam('club_id');
        const invoice = props.navigation.getParam('invoice');
        const isZirklpay = props.navigation.getParam('isZirklpay');
        console.log('constructor -> isZirklpay', isZirklpay);
        this.state = {
            club_id,
            error_field: '',
            isZirklpay,
            page: invoice && invoice.status !== 'draft' ? 'incoming' : 'main',
            previousPage: null,
            togglebtn: 'all',
            loading: invoice ? false : true,
            cur_invoice: invoice,
            sel_plan: null,
            openChangeAmount: false,
            plan_amount: null,
            keyword: null,
            sel_member: null,
            expand_member_history: null,
            //payable within
            sel_pickerindex: 0,
            openPickerPayalbleWithin: false,
            incomingPayments: invoice
                ? this.getIncompingPaymentList(invoice)
                : [],
        };
    }
    UNSAFE_componentWillMount() {
        if (this.state.cur_invoice == null) {
            this.props.createInitialInvoice(this.state.club_id, res => {
                this.setState({loading: false});
                if (res == null) this.props.navigation.goBack();
            });
        }
    }
    UNSAFE_componentWillReceiveProps(nextprops) {
        if (nextprops.cur_invoice != this.props.cur_invoice) {
            const newInvoice = nextprops.cur_invoice;
            console.log(
                '🚀 ~ file: index.js ~ line 130 ~ ZirklPay ~ UNSAFE_componentWillReceiveProps ~ newInvoice',
                newInvoice,
            );

            newInvoice.purpose =
                newInvoice.purpose || this.state.cur_invoice?.purpose;

            // Update the invoice and the selected plan if there is one
            this.setState(prevState => ({
                cur_invoice: nextprops.cur_invoice,
                incomingPayments: this.getIncompingPaymentList(
                    nextprops.cur_invoice,
                ),
                sel_plan: prevState.sel_plan
                    ? newInvoice.members_with_club_membership_plans?.find(
                          el => el.plan?.id === prevState.sel_plan.plan?.id,
                      )
                    : null,
            }));
        }
    }
    changeZirklFeeOption(index) {
        const {cur_invoice} = this.state;
        this.setState({
            cur_invoice: {
                ...cur_invoice,
                zirkl_fees_option: FEE_OPTIONS[index],
            },
        });
        this.props.updateFeeOption({
            invoice_id: cur_invoice.id,
            zirkl_fees_option: FEE_OPTIONS[index],
        });
    }
    getIncompingPaymentList(invoice) {
        let datasource = [];
        if (invoice) {
            const members_with_club_membership_plans = invoice
                ? invoice.members_with_club_membership_plans
                : [];
            var incomings = [];
            members_with_club_membership_plans.map(plan => {
                const subscribed_users = plan.subscribed_users;
                if (subscribed_users) {
                    incomings = [...incomings, ...subscribed_users];
                }
            });

            incomings.sort((a, b) =>
                a?.user?.last_name?.localeCompare(b?.user?.last_name),
            );

            INVOICE_STATUS(this.props.t).map(status => {
                const filtered = incomings.filter(
                    member => member.payment_status == status.value,
                );
                if (filtered.length > 0) {
                    datasource.push({
                        id: -100,
                        label: `${status.label}: ${filtered.length}/${
                            incomings.length
                        }`,
                    });
                    datasource = [...datasource, ...filtered];
                }
            });
        }
        return datasource;
    }
    updateValue(name, value) {
        const {cur_invoice} = this.state;
        if (name === 'payable_date') {
            this.setState({
                cur_invoice: {
                    ...cur_invoice,
                    payable_date: value,
                    first_reminder: moment(value, 'DD.MM.YYYY')
                        .add(10, 'days')
                        .format('DD.MM.YYYY'),
                    second_reminder: moment(value, 'DD.MM.YYYY')
                        .add(30, 'days')
                        .format('DD.MM.YYYY'),
                },
            });
            return;
        }
        this.setState({
            cur_invoice: {
                ...cur_invoice,
                [name]: value,
            },
        });
    }
    handleErrorFound(field) {
        this.setState({error_field: field});
        switch (field) {
            case 'purpose':
                showMessage('The purpose field is required!');
                break;
            case 'invoice_date':
                showMessage('The invoice date field is required!');
                break;
            case 'payable_date':
                showMessage('The payable date field is required!');
                break;
            case 'first_reminder':
                showMessage('The first reminder date field is required!');
                break;
            case 'second_reminder':
                showMessage('The second reminder date field is required!');
                break;

            default:
                break;
        }
    }
    validateForSave() {
        const {
            purpose,
            invoice_date,
            payable_date,
            first_reminder,
            second_reminder,
        } = this.state.cur_invoice;
        if (!purpose || purpose === '') {
            this.handleErrorFound('purpose');
            return false;
        }
        if (!invoice_date) {
            this.handleErrorFound('invoice_date');
            return false;
        }
        if (!payable_date) {
            this.handleErrorFound('payable_date');
            return false;
        }
        if (!first_reminder) {
            this.handleErrorFound('first_reminder');
            return false;
        }
        if (!second_reminder) {
            this.handleErrorFound('second_reminder');
            return false;
        }
        this.setState({error_field: ''});
        return true;
    }
    saveInvoiceDetails() {
        if (!this.validateForSave()) return;
        const {cur_invoice} = this.state;
        this.setState({loading: true});
        this.props.updateInvoiceDetails(
            {
                invoice_id: cur_invoice.id,
                purpose: cur_invoice.purpose,
                notice: cur_invoice.notice ? cur_invoice.notice : '',
                invoice_date: cur_invoice.invoice_date,
                payable_date: cur_invoice.payable_date,
                first_reminder: cur_invoice.first_reminder,
                second_reminder: cur_invoice.second_reminder,
            },
            res => {
                this.setState({loading: false});
                if (res && res.invoice)
                    this.setState({
                        page: 'preview',
                        previousPage: this.state.page,
                    });
            },
        );
    }
    getSectionItemStyles(field) {
        return [
            s.sectionItem,
            field === this.state.error_field ? {borderBottomColor: 'red'} : {},
        ];
    }
    renderMain() {
        const {t} = this.props;
        const {cur_invoice} = this.state;
        return (
            <View>
                <Text style={s.sectionName}>{t('paymentdetail')}</Text>
                <View style={s.section}>
                    <View style={this.getSectionItemStyles('purpose')}>
                        <Text style={s.sectionItemLabel}>{t('purpose')} *</Text>
                        <TextInput
                            style={[s.textInput, {textAlign: 'right'}]}
                            value={cur_invoice && cur_invoice.purpose}
                            onChangeText={value =>
                                this.updateValue('purpose', value)
                            }
                        />
                    </View>
                    <TouchableOpacity
                        style={s.sectionItem}
                        onPress={() =>
                            this.setState({
                                page: 'plans',
                                previousPage: this.state.page,
                            })
                        }>
                        <Text style={s.sectionItemLabel}>
                            {t('amountsetting')}
                        </Text>
                        <View style={s.sectionRight}>
                            <Text style={s.sectionRightLabel}>
                                {'Anzeigen'}
                            </Text>
                            <Icon
                                name="chevron-right"
                                size={20}
                                color="#C7C7CC"
                                style={{marginLeft: 10}}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={s.sectionItem}
                        onPress={() =>
                            this.setState({
                                page: 'shippingmethod',
                                previousPage: this.state.page,
                                keyword: null,
                            })
                        }>
                        <Text style={s.sectionItemLabel}>
                            {t('shippingmethod')}
                        </Text>
                        <View style={s.sectionRight}>
                            <Text style={s.sectionRightLabel}>
                                {'Anzeigen'}
                            </Text>
                            <Icon
                                name="chevron-right"
                                size={20}
                                color="#C7C7CC"
                                style={{marginLeft: 10}}
                            />
                        </View>
                    </TouchableOpacity>
                    <View
                        style={[
                            s.sectionItem,
                            {flexDirection: 'column', alignItems: 'flex-start'},
                        ]}>
                        <Text style={[s.sectionItemLabel, {paddingBottom: 5}]}>
                            {t('shippingnote')}
                        </Text>
                        <TextInput
                            style={[
                                s.textInput,
                                {
                                    width: '100%',
                                    marginLeft: 0,
                                    paddingVertical: 3,
                                },
                            ]}
                            multiline={true}
                            numberOfLines={2}
                            value={cur_invoice && cur_invoice.notice}
                            onChangeText={value =>
                                this.updateValue('notice', value)
                            }
                        />
                    </View>
                </View>

                <Text style={s.sectionName}>{t('data')}</Text>
                <View style={s.section}>
                    <View style={this.getSectionItemStyles('invoice_date')}>
                        <Text style={s.sectionItemLabel}>
                            {t('invoicedate')} *
                        </Text>
                        <DatePicker
                            locale="de"
                            date={cur_invoice && cur_invoice.invoice_date}
                            mode="date"
                            placeholder={t('selectdate')}
                            format="DD.MM.YYYY"
                            confirmBtnText="Bestätigen Sie"
                            cancelBtnText="Abbrechen"
                            minDate={moment().format('DD.MM.YYYY')}
                            customStyles={{
                                dateIcon: {
                                    width: 0,
                                },
                                dateInput: {
                                    borderWidth: 0,
                                },
                                dateText: {
                                    textAlign: 'right',
                                    alignSelf: 'flex-end',
                                    fontFamily: 'Rubik-Medium',
                                },
                            }}
                            onDateChange={async date => {
                                await this.updateValue('invoice_date', date);
                                await this.updateValue(
                                    'payable_date',
                                    moment(date, 'DD.MM.YYYY')
                                        .add(30, 'days')
                                        .format('DD.MM.YYYY'),
                                );
                            }}
                        />
                    </View>
                    <View style={this.getSectionItemStyles('payable_date')}>
                        <Text style={s.sectionItemLabel}>
                            {t('payabledate')} *
                        </Text>
                        <TouchableOpacity
                            style={s.sectionRight}
                            onPress={() => {
                                if (
                                    cur_invoice.invoice_date &&
                                    cur_invoice.payable_date
                                ) {
                                    const diff =
                                        moment(
                                            cur_invoice.payable_date,
                                            'DD.MM.YYYY',
                                        ).diff(
                                            moment(
                                                cur_invoice.invoice_date,
                                                'DD.MM.YYYY',
                                            ),
                                            'days',
                                        ) - 1;
                                    this.setState({
                                        openPickerPayalbleWithin: true,
                                        sel_pickerindex: diff > 0 ? diff : 0,
                                    });
                                }
                            }}>
                            <Text style={[s.sectionRightLabel]}>
                                {cur_invoice && cur_invoice.payable_date}
                            </Text>
                            <Icon
                                name="chevron-right"
                                size={20}
                                color="#C7C7CC"
                                style={{marginLeft: 10}}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={this.getSectionItemStyles('first_reminder')}>
                        <Text style={s.sectionItemLabel}>
                            {t('firstreminder')} *
                        </Text>
                        <View style={s.sectionRight}>
                            <DatePicker
                                locale="de"
                                date={cur_invoice?.first_reminder}
                                mode="date"
                                placeholder={t('selectdate')}
                                format="DD.MM.YYYY"
                                minDate={
                                    cur_invoice?.payable_date ||
                                    moment().format('DD.MM.YYYY')
                                }
                                confirmBtnText={t('btndateconfirm')}
                                cancelBtnText={t('btndatecancel')}
                                customStyles={{
                                    dateIcon: {
                                        width: 0,
                                    },
                                    dateInput: {
                                        borderWidth: 0,
                                    },
                                    dateText: {
                                        textAlign: 'right',
                                        alignSelf: 'flex-end',
                                        fontFamily: 'Rubik-Regular',
                                    },
                                }}
                                onDateChange={date => {
                                    this.updateValue('first_reminder', date);
                                }}
                            />
                            <Icon
                                name="chevron-right"
                                size={20}
                                color="#C7C7CC"
                            />
                        </View>
                    </View>
                    <View style={this.getSectionItemStyles('second_reminder')}>
                        <Text style={s.sectionItemLabel}>
                            {t('secondreminder')} *
                        </Text>
                        <View style={s.sectionRight}>
                            <DatePicker
                                locale="de"
                                date={
                                    cur_invoice && cur_invoice.second_reminder
                                }
                                mode="date"
                                placeholder={t('selectdate')}
                                format="DD.MM.YYYY"
                                minDate={
                                    cur_invoice?.first_reminder ||
                                    moment().format('DD.MM.YYYY')
                                }
                                confirmBtnText={t('btndateconfirm')}
                                cancelBtnText={t('btndatecancel')}
                                customStyles={{
                                    dateIcon: {
                                        width: 0,
                                    },
                                    dateInput: {
                                        borderWidth: 0,
                                    },
                                    dateText: {
                                        textAlign: 'right',
                                        alignSelf: 'flex-end',
                                        fontFamily: 'Rubik-Regular',
                                    },
                                }}
                                onDateChange={date => {
                                    this.updateValue('second_reminder', date);
                                }}
                            />
                            <Icon
                                name="chevron-right"
                                size={20}
                                color="#C7C7CC"
                            />
                        </View>
                    </View>
                </View>
                <TouchableOpacity
                    style={[
                        s.button,
                        {backgroundColor: PRIMARY_COLOR, marginTop: 30},
                    ]}
                    onPress={() => this.saveInvoiceDetails()}>
                    <Text style={s.btnLabel}>{t('preview')}</Text>
                </TouchableOpacity>
            </View>
        );
    }
    renderPreview() {
        const {t} = this.props;
        const {cur_invoice} = this.state;
        return (
            <View style={{marginTop: 30}}>
                <TouchableOpacity
                    style={{marginVertical: 0}}
                    onPress={() =>
                        this.setState({
                            page: 'main',
                            previousPage: this.state.page,
                        })
                    }>
                    <Icon
                        name="arrow-left"
                        size={25}
                        color={PRIMARY_COLOR}
                        style={{marginLeft: 20}}
                    />
                </TouchableOpacity>
                <FeedCardFinance preview unfold={true} invoice={cur_invoice} />
                <TouchableOpacity
                    style={[
                        s.button,
                        {backgroundColor: PRIMARY_COLOR, marginTop: 30},
                    ]}
                    onPress={() => {
                        this.setState({loading: true});
                        this.props.confirmInvoice(
                            {
                                invoice_id: cur_invoice.id,
                            },
                            res => {
                                this.setState({loading: false});
                                if (res) {
                                    this.setState({cur_invoice: res});
                                    this.props.navigation.goBack();
                                }
                            },
                        );
                    }}>
                    <Text style={s.btnLabel}>{t('publish')}</Text>
                </TouchableOpacity>
            </View>
        );
    }
    renderPlansList() {
        const {t} = this.props;
        const {isZirklpay} = this.state;
        const members_with_club_membership_plans =
            this.state.cur_invoice &&
            this.state.cur_invoice.members_with_club_membership_plans;
        var total = 0;
        if (
            members_with_club_membership_plans &&
            members_with_club_membership_plans.length > 0
        ) {
            members_with_club_membership_plans
                .filter(item => !item.excluded)
                .map(item => {
                    const {subscribed_users} = item;
                    if (subscribed_users && subscribed_users.length > 0)
                        subscribed_users.map(
                            subscribe =>
                                (total += parseFloat(subscribe.amount)),
                        );
                });
        }
        const zirkl_fees_option =
            this.state.cur_invoice.zirkl_fees_option == FEE_OPTIONS[0] ? 0 : 1;
        const {
            total_members,
            total_service_fee_with_multiplication,
            zirkl_service_fees,
        } = this.state.cur_invoice;
        return (
            <View style={{paddingBottom: 50}}>
                <TouchableOpacity
                    style={{marginVertical: 20}}
                    onPress={() =>
                        this.setState({
                            page: 'main',
                            previousPage: this.state.page,
                        })
                    }>
                    <Icon
                        name="arrow-left"
                        size={25}
                        color={PRIMARY_COLOR}
                        style={{marginLeft: 20}}
                    />
                </TouchableOpacity>
                {isZirklpay && (
                    <>
                        <Text style={[s.sectionName, {marginBottom: 0}]}>
                            {t('servicefee')}
                        </Text>
                        <View style={[s.section, {borderTopWidth: 0}]}>
                            <View
                                style={[s.sectionItem, {borderBottomWidth: 0}]}>
                                <Text
                                    style={[
                                        s.sectionItemLabel,
                                        {color: PRIMARY_COLOR},
                                    ]}>
                                    {total_members} x CHF {zirkl_service_fees}
                                </Text>
                                <Text
                                    style={[
                                        s.sectionItemLabel,
                                        {color: PRIMARY_COLOR},
                                    ]}>
                                    {total_service_fee_with_multiplication} CHF
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={[s.sectionItem, {borderBottomWidth: 0}]}
                                onPress={() => {
                                    zirkl_fees_option == 1 &&
                                        this.changeZirklFeeOption(0);
                                }}>
                                <Text
                                    style={[
                                        s.sectionItemLabel,
                                        {
                                            fontSize: 12,
                                            paddingVertical: 10,
                                            color:
                                                zirkl_fees_option == 0
                                                    ? PRIMARY_TEXT_COLOR
                                                    : '#C7C7CC',
                                        },
                                    ]}>
                                    {t('addfee')}
                                </Text>
                                <View style={s.sectionRight}>
                                    <Icon
                                        name={
                                            zirkl_fees_option == 0
                                                ? 'check-circle'
                                                : 'circle'
                                        }
                                        size={20}
                                        color={
                                            zirkl_fees_option == 0
                                                ? '#6C8AF1'
                                                : '#C7C7CC'
                                        }
                                        style={{marginLeft: 10}}
                                    />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[s.sectionItem, {borderBottomWidth: 0}]}
                                onPress={() => {
                                    zirkl_fees_option == 0 &&
                                        this.changeZirklFeeOption(1);
                                }}>
                                <Text
                                    style={[
                                        s.sectionItemLabel,
                                        {
                                            fontSize: 12,
                                            paddingVertical: 10,
                                            color:
                                                zirkl_fees_option == 1
                                                    ? PRIMARY_TEXT_COLOR
                                                    : '#C7C7CC',
                                        },
                                    ]}>
                                    {t('deductfee')}
                                </Text>
                                <View style={s.sectionRight}>
                                    <Icon
                                        name={
                                            zirkl_fees_option == 1
                                                ? 'check-circle'
                                                : 'circle'
                                        }
                                        size={20}
                                        color={
                                            zirkl_fees_option == 1
                                                ? '#6C8AF1'
                                                : '#C7C7CC'
                                        }
                                        style={{marginLeft: 10}}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                {members_with_club_membership_plans &&
                    members_with_club_membership_plans.length > 0 && (
                        <View style={[s.section, {marginTop: 20}]}>
                            {members_with_club_membership_plans.map(
                                (item, index) => {
                                    const {plan, subscribed_users} = item;
                                    const color =
                                        PLAN_COLORS.length > index
                                            ? PLAN_COLORS[index]
                                            : PLAN_COLORS[0];
                                    return (
                                        <TouchableOpacity
                                            key={plan.id + ''}
                                            style={s.sectionItem}
                                            onPress={() =>
                                                this.setState({
                                                    sel_plan: item,
                                                    page: 'plandetail',
                                                    previousPage: this.state
                                                        .page,
                                                    keyword: null,
                                                })
                                            }>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                }}>
                                                {item.excluded ? (
                                                    <Icon
                                                        name="x"
                                                        size={20}
                                                        color={color}
                                                        style={{marginRight: 5}}
                                                    />
                                                ) : (
                                                    <View
                                                        style={[
                                                            s.circleview,
                                                            {
                                                                backgroundColor: color,
                                                            },
                                                        ]}
                                                    />
                                                )}
                                                <Text
                                                    style={s.sectionItemLabel}>
                                                    {plan.title} (
                                                    {subscribed_users
                                                        ? subscribed_users.length
                                                        : 0}
                                                    )
                                                </Text>
                                            </View>
                                            <Text
                                                style={[
                                                    s.sectionItemLabel,
                                                    {color: '#6C8AF1'},
                                                ]}>
                                                {plan.amount} CHF
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                },
                            )}
                        </View>
                    )}
                <Text style={s.sectionName}>{t('estimateearning')}</Text>
                {members_with_club_membership_plans?.length > 0 && (
                    <View style={s.section}>
                        {members_with_club_membership_plans
                            ?.filter(item => !item.excluded)
                            ?.map((item, index) => {
                                const {plan, subscribed_users} = item;
                                const color =
                                    PLAN_COLORS.length > index
                                        ? PLAN_COLORS[index]
                                        : PLAN_COLORS[0];
                                var subtotal = 0;
                                if (
                                    subscribed_users &&
                                    subscribed_users.length > 0
                                ) {
                                    subscribed_users.map(
                                        subscribe =>
                                            (subtotal += parseFloat(
                                                subscribe.amount,
                                            )),
                                    );
                                }
                                if (subtotal == 0) {
                                    return <View key={plan.id + ''} />;
                                }
                                return (
                                    <View
                                        key={plan.id + ''}
                                        style={s.sectionItem}>
                                        <View
                                            style={[
                                                s.chartbar,
                                                {
                                                    flex: subtotal / total,
                                                    backgroundColor: color,
                                                    marginRight: 10,
                                                },
                                            ]}
                                        />
                                        <Text
                                            style={[
                                                s.sectionItemLabel,
                                                {
                                                    width: 100,
                                                    textAlign: 'right',
                                                },
                                            ]}>
                                            {subtotal} CHF
                                        </Text>
                                    </View>
                                );
                            })}
                    </View>
                )}
                <View style={s.sectionTotalItem}>
                    <Text style={[s.sectionItemLabel, {color: PRIMARY_COLOR}]}>
                        {t('total')}
                    </Text>
                    <Text style={[s.sectionItemLabel, {color: PRIMARY_COLOR}]}>
                        {total - total_service_fee_with_multiplication} CHF
                    </Text>
                </View>
            </View>
        );
    }
    findMembers(query, subscribed_users) {
        if (query && query.length > 0) {
            const regex = new RegExp(`${query.trim()}`, 'i');
            return subscribed_users.filter(
                item =>
                    (item.user.first_name &&
                        item.user.first_name.search(regex) >= 0) ||
                    (item.user.last_name &&
                        item.user.last_name.search(regex) >= 0),
            );
        }
        return subscribed_users;
    }
    renderPlanDetails() {
        const {t} = this.props;
        const {sel_plan, keyword, club_id, cur_invoice} = this.state;
        const plan = sel_plan && sel_plan.plan;
        console.log(
            '🚀 ~ file: index.js ~ line 908 ~ ZirklPay ~ renderPlanDetails ~ sel_plan',
            sel_plan,
        );
        console.log(
            '🚀 ~ file: index.js ~ line 908 ~ ZirklPay ~ renderPlanDetails ~ plan',
            plan,
        );
        const subscribed_users = sel_plan && sel_plan.subscribed_users;
        const members = this.findMembers(keyword, subscribed_users);
        return (
            <View style={{paddingBottom: 50}}>
                <TouchableOpacity
                    style={{marginVertical: 20}}
                    onPress={() =>
                        this.setState({
                            page: 'plans',
                            previousPage: this.state.page,
                        })
                    }>
                    <Icon
                        name="arrow-left"
                        size={25}
                        color={PRIMARY_COLOR}
                        style={{marginLeft: 20}}
                    />
                </TouchableOpacity>
                <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
                    <TouchableOpacity
                        style={s.planHeader}
                        onPress={() =>
                            !sel_plan.excluded &&
                            this.setState({
                                openChangeAmount: true,
                                plan_amount: plan && plan.amount + '',
                            })
                        }>
                        <Text style={s.amountTitle}>{'Betrag'}</Text>
                        <Text
                            style={[
                                s.amountTitle,
                                {
                                    color: sel_plan.excluded
                                        ? GRAY_COLOR
                                        : PRIMARY_COLOR,
                                },
                            ]}>
                            {plan ? plan.amount : 0} CHF
                        </Text>
                    </TouchableOpacity>
                    <View style={s.planHeader}>
                        <Text
                            style={[
                                s.sectionName,
                                {
                                    marginTop: 0,
                                    marginBottom: 0,
                                    paddingHorizontal: 0,
                                    textAlign: 'left',
                                },
                            ]}>
                            {t('activity')}
                        </Text>
                        <ToggleSwitch
                            isOn={!sel_plan.excluded}
                            onColor={PRIMARY_COLOR}
                            offColor={'gray'}
                            label={''}
                            onToggle={isOn => {
                                this.props.setMembershipExclusion(
                                    cur_invoice?.id,
                                    plan?.id,
                                    !isOn,
                                    newInvoice =>
                                        this.setState(prevState => ({
                                            cur_invoice: newInvoice,
                                            sel_plan: newInvoice.members_with_club_membership_plans?.find(
                                                el => el.plan?.id === plan?.id,
                                            ),
                                        })),
                                );
                            }}
                        />
                    </View>
                </View>
                <View style={s.inputContainer}>
                    <Icon
                        name="search"
                        size={20}
                        color={'#88919E'}
                        style={s.inputIcon}
                    />
                    <TextInput
                        style={s.input}
                        placeholder={t('search')}
                        placeholderTextColor={'#88919E'}
                        returnKeyType="search"
                        value={keyword}
                        onChangeText={value => this.setState({keyword: value})}
                    />
                </View>
                {/* <View style={s.chipgroup}>
                    {INVOICE_STATUS(t).map(item => {
                        var count = 0;
                        if (subscribed_users && subscribed_users.length) {
                            count = subscribed_users.filter(
                                subscribe =>
                                    subscribe.payment_status == item.value,
                            ).length;
                        }
                        return (
                            <TouchableOpacity
                                key={item.value}
                                style={[s.chip, {borderColor: item.color}]}>
                                <Text
                                    style={[s.chiplabel, {color: item.color}]}>
                                    {item.label} ({count})
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View> */}
                <FlatList
                    style={{width: '100%'}}
                    data={members ? members : []}
                    renderItem={({item}) => {
                        const {user} = item;
                        const profile = user && user.profile;
                        let status =
                            INVOICE_STATUS(t).find(
                                st => st.value == item.payment_status,
                            ) || INVOICE_STATUS(t)[0];

                        return (
                            <TouchableOpacity
                                style={s.member}
                                onPress={() => {
                                    this.props.getMemberInvoices(
                                        user.id,
                                        club_id,
                                    );
                                    this.setState({
                                        page: 'history',
                                        previousPage: this.state.page,
                                        sel_member: user,
                                        expand_member_history: null,
                                    });
                                }}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}>
                                    <View style={s.memberAvatar}>
                                        <AvatarImage
                                            user_id={user?.id}
                                            width={35}
                                            user={user}
                                        />
                                    </View>
                                    <View>
                                        <Text style={s.memberName}>
                                            {getUserName(user)}
                                        </Text>
                                        {/*<Text style={s.memberDescp}>{user.canton}</Text>*/}
                                    </View>
                                </View>
                                <Text
                                    style={[
                                        s.memberamount,
                                        {color: status.color},
                                    ]}>
                                    {item.amount} CHF
                                </Text>
                            </TouchableOpacity>
                        );
                    }}
                    keyExtractor={(item, index) => index + ''}
                />
            </View>
        );
    }
    renderInvoiceHistory() {
        const {t} = this.props;
        const {sel_member, expand_member_history} = this.state;
        const profile = sel_member && sel_member.profile;
        const {member_invoices} = this.props;

        return (
            <View style={{paddingVertical: 20}}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginHorizontal: 20,
                    }}>
                    <TouchableOpacity
                        onPress={() =>
                            this.setState({
                                page: this.state.previousPage,
                                previousPage: this.state.page,
                            })
                        }>
                        <Icon
                            name="arrow-left"
                            size={25}
                            color={PRIMARY_COLOR}
                        />
                    </TouchableOpacity>
                    <View style={{alignItems: 'center'}}>
                        <View style={s.memberAvatar}>
                            <AvatarImage
                                user_id={sel_member?.id}
                                width={35}
                                user={sel_member}
                            />
                        </View>
                        <Text
                            style={[s.sectionItemLabel, {paddingVertical: 5}]}>
                            {getUserName(sel_member)}
                        </Text>
                    </View>
                    <View />
                </View>
                <View>
                    {member_invoices.map(item => {
                        const {
                            subscribed_club_membership_plan,
                            invoice_details,
                        } = item;
                        console.log(
                            '🚀 ~ file: index.js ~ line 1139 ~ ZirklPay ~ renderInvoiceHistory ~ invoice_details',
                            item,
                        );
                        return (
                            <TouchableOpacity
                                key={item.id + ''}
                                style={s.invoiceItem}
                                onPress={() =>
                                    this.setState({
                                        expand_member_history: item.id,
                                    })
                                }>
                                <View style={s.invoiceItemHeader}>
                                    <Text
                                        style={[
                                            s.invoicetitle,
                                            {maxWidth: 230},
                                            item?.payment_status === 'cancelled'
                                                ? {
                                                      textDecorationLine:
                                                          'line-through',
                                                      textDecorationStyle:
                                                          'solid',
                                                  }
                                                : {},
                                        ]}
                                        numberOfLines={1}>
                                        {invoice_details?.purpose}
                                    </Text>
                                    <Text
                                        style={[
                                            s.invoiceamount,
                                            item?.payment_status === 'cancelled'
                                                ? {
                                                      textDecorationLine:
                                                          'line-through',
                                                      textDecorationStyle:
                                                          'solid',
                                                  }
                                                : {},
                                        ]}>
                                        {item?.amount} CHF
                                    </Text>
                                </View>
                                {expand_member_history == item.id && (
                                    <View>
                                        <View style={s.invoiceItemContent}>
                                            {item?.payment_status ===
                                                'cancelled' && (
                                                <View
                                                    style={[
                                                        s.invoiceItemHeader,
                                                        {marginVertical: 5},
                                                    ]}>
                                                    <Text
                                                        style={
                                                            s.invoiceContentText
                                                        }>
                                                        storniert
                                                    </Text>
                                                    <Text
                                                        style={
                                                            s.invoiceContentValue
                                                        }>
                                                        {item?.cancelled_at
                                                            ? moment(
                                                                  item.cancelled_at,
                                                              ).format(
                                                                  'DD.MM.YYYY, HH:mm',
                                                              )
                                                            : '-'}
                                                    </Text>
                                                </View>
                                            )}
                                            <View
                                                style={[
                                                    s.invoiceItemHeader,
                                                    {marginVertical: 5},
                                                ]}>
                                                <Text
                                                    style={
                                                        s.invoiceContentText
                                                    }>
                                                    bezahlt
                                                </Text>
                                                <Text
                                                    style={
                                                        s.invoiceContentValue
                                                    }>
                                                    {item?.payment_completed_at ||
                                                        '-'}
                                                </Text>
                                            </View>
                                            <View
                                                style={[
                                                    s.invoiceItemHeader,
                                                    {marginVertical: 5},
                                                ]}>
                                                <Text
                                                    style={
                                                        s.invoiceContentText
                                                    }>
                                                    pendent
                                                </Text>
                                                <Text
                                                    style={
                                                        s.invoiceContentValue
                                                    }>
                                                    {invoice_details &&
                                                        invoice_details.payable_date}
                                                </Text>
                                            </View>

                                            <Text
                                                style={[
                                                    s.sectionItemLabel,
                                                    {color: 'black'},
                                                ]}>
                                                Zusammensetzung
                                            </Text>
                                            <View style={s.barprogress}>
                                                <View
                                                    style={[
                                                        s.barBlock,
                                                        {
                                                            flex: 1,
                                                            backgroundColor:
                                                                PLAN_COLORS[0],
                                                        },
                                                    ]}>
                                                    <Text
                                                        style={{
                                                            fontSize: 10,
                                                            color: 'white',
                                                        }}>
                                                        100
                                                    </Text>
                                                </View>
                                                {/* <View
                                                    style={[
                                                        s.barBlock,
                                                        {
                                                            flex: 0.3,
                                                            backgroundColor:
                                                                PLAN_COLORS[1],
                                                        },
                                                    ]}>
                                                    <Text
                                                        style={{
                                                            fontSize: 10,
                                                            color: 'white',
                                                        }}>
                                                        20
                                                    </Text>
                                                </View>
                                                <View
                                                    style={[
                                                        s.barBlock,
                                                        {
                                                            flex: 0.2,
                                                            backgroundColor:
                                                                PLAN_COLORS[2],
                                                        },
                                                    ]}>
                                                    <Text
                                                        style={{
                                                            fontSize: 10,
                                                            color: 'white',
                                                        }}>
                                                        10
                                                    </Text>
                                                </View> */}
                                            </View>
                                            <View
                                                style={s.invoicecard_chartItem}>
                                                <View
                                                    style={[
                                                        s.circleColor,
                                                        {
                                                            backgroundColor:
                                                                PLAN_COLORS[0],
                                                        },
                                                    ]}
                                                />
                                                <Text
                                                    style={
                                                        s.invoicecard_chartlabel
                                                    }>
                                                    {invoice_details?.purpose}{' '}
                                                </Text>
                                            </View>
                                            {/* <View
                                                style={s.invoicecard_chartItem}>
                                                <View
                                                    style={[
                                                        s.circleColor,
                                                        {
                                                            backgroundColor:
                                                                PLAN_COLORS[1],
                                                        },
                                                    ]}
                                                />
                                                <Text
                                                    style={
                                                        s.invoicecard_chartlabel
                                                    }>
                                                    Sponsorbeitrag
                                                </Text>
                                            </View>
                                            <View
                                                style={s.invoicecard_chartItem}>
                                                <View
                                                    style={[
                                                        s.circleColor,
                                                        {
                                                            backgroundColor:
                                                                PLAN_COLORS[2],
                                                        },
                                                    ]}
                                                />
                                                <Text
                                                    style={
                                                        s.invoicecard_chartlabel
                                                    }>
                                                    Übertrag 2019
                                                </Text>
                                            </View> */}
                                        </View>
                                        <View style={s.invoiceItemFooter}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    console.log(
                                                        '🚀 ~ file: index.js ~ line 1242 ~ ZirklPay ~ renderInvoiceHistory ~ item?.qr_pdf',
                                                        item?.qr_pdf,
                                                    );
                                                    if (item?.qr_pdf)
                                                        Linking.openURL(
                                                            item?.qr_pdf,
                                                        );
                                                    else
                                                        showMessage(
                                                            'Invoice is unavailable',
                                                        );
                                                }}
                                                style={s.iconContainer}>
                                                <Icon
                                                    name="file-text"
                                                    size={25}
                                                    color={PRIMARY_COLOR}
                                                />
                                                <Text style={s.iconlabel}>
                                                    {t('receipt')}
                                                </Text>
                                            </TouchableOpacity>
                                            {/* <TouchableOpacity
                                                style={s.iconContainer}>
                                                <Icon
                                                    name="arrow-right"
                                                    size={25}
                                                    color={PRIMARY_COLOR}
                                                />
                                                <Text style={s.iconlabel}>
                                                    {t('transfer')}
                                                </Text>
                                            </TouchableOpacity> */}
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.props.changePaymentStatusOfMember(
                                                        {
                                                            invoice_id:
                                                                item
                                                                    .invoice_details
                                                                    ?.id,
                                                            member_id:
                                                                item.user.id,
                                                            status:
                                                                item.payment_status !=
                                                                'cancelled'
                                                                    ? 'cancelled'
                                                                    : 'due',
                                                        },
                                                        () => {
                                                            this.props.getMemberInvoices(
                                                                item.user.id,
                                                                item.club.id,
                                                            );
                                                        },
                                                    );
                                                }}
                                                style={s.iconContainer}>
                                                <Icon
                                                    name="x"
                                                    size={25}
                                                    color={PRIMARY_COLOR}
                                                />
                                                <Text style={s.iconlabel}>
                                                    {item.payment_status !=
                                                    'cancelled'
                                                        ? t('cancel')
                                                        : 'Wiederherstellen'}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        );
    }
    renderShippingMethod() {
        const {t} = this.props;
        const {cur_invoice, keyword} = this.state;
        const members_delivery_preferences =
            cur_invoice && cur_invoice.members_delivery_preferences;
        const members = this.findMembers(keyword, members_delivery_preferences);
        console.log('===members', members);
        let via_email = [],
            via_sms = [],
            via_app = [];
        members.map(item => {
            if (item.via_mail) via_email.push(item);
            else if (item.via_sms) via_sms.push(item);
            else via_app.push(item);
        });
        const datasource = [
            // {id: -100, label: 'Briefversand'},
            // ...via_email,
            // {id: -100, label: 'SMS'},
            // ...via_sms,
            {id: -100, label: 'App'},
            ...via_app,
        ];
        return (
            <View style={{paddingBottom: 50}}>
                <TouchableOpacity
                    style={{marginVertical: 20}}
                    onPress={() =>
                        this.setState({
                            page: 'main',
                            previousPage: this.state.page,
                        })
                    }>
                    <Icon
                        name="arrow-left"
                        size={25}
                        color={PRIMARY_COLOR}
                        style={{marginLeft: 20}}
                    />
                </TouchableOpacity>
                <View style={s.inputContainer}>
                    <Icon
                        name="search"
                        size={20}
                        color={'#88919E'}
                        style={s.inputIcon}
                    />
                    <TextInput
                        style={s.input}
                        placeholder={t('search')}
                        placeholderTextColor={'#88919E'}
                        returnKeyType="search"
                        value={keyword}
                        onChangeText={value => this.setState({keyword: value})}
                    />
                </View>
                <View style={s.chipgroup}>
                    {SHIPPING_METHOD(t).map(item => {
                        var count = via_email.length;
                        if (item.value == 'sms') count = via_sms.length;
                        else if (item.value == 'app') count = via_app.length;
                        return (
                            <TouchableOpacity
                                style={[s.chip, {borderColor: item.color}]}>
                                <Text
                                    style={[s.chiplabel, {color: item.color}]}>
                                    {item.label} ({count})
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                <FlatList
                    style={{width: '100%'}}
                    data={datasource ? datasource : []}
                    renderItem={({item}) => {
                        if (item.id < 0) {
                            return (
                                <Text
                                    style={[
                                        s.memberName,
                                        {
                                            marginLeft: 25,
                                            marginVertical: 5,
                                            fontSize: 14,
                                        },
                                    ]}>
                                    {item.label}
                                </Text>
                            );
                        }
                        const {user} = item;
                        const profile = user && user.profile;
                        return (
                            <TouchableOpacity
                                onPress={() =>
                                    this.setState({
                                        page: 'history',
                                        previousPage: this.state.page,
                                        sel_member: user,
                                        expand_member_history: null,
                                    })
                                }
                                style={s.member}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}>
                                    <View style={s.memberAvatar}>
                                        <AvatarImage
                                            user_id={user?.id}
                                            width={35}
                                            user={user}
                                        />
                                    </View>
                                    <View>
                                        <Text style={s.memberName}>
                                            {getUserName(user)}
                                        </Text>
                                        {/*<Text style={s.memberDescp}>{user.canton}</Text>*/}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                    keyExtractor={(item, index) => index + ''}
                />
            </View>
        );
    }
    renderIncomingPayment() {
        const {t} = this.props;
        const {
            incomingPayments,
            cur_invoice,
            isZirklpay,
            keyword,
            club_id,
        } = this.state;

        const datasource = keyword
            ? incomingPayments.filter(el =>
                  (el.user?.first_name + ' ' + el.user?.last_name)
                      .toLowerCase()
                      .includes(keyword.toLowerCase()),
              )
            : incomingPayments;

        console.log('Incoming invoices datasource', datasource);
        return (
            <View style={{paddingBottom: 50}}>
                <TouchableOpacity
                    style={{marginVertical: 20}}
                    onPress={() => {
                        this.props.navigation.goBack();
                    }}>
                    <Icon
                        name="arrow-left"
                        size={25}
                        color={PRIMARY_COLOR}
                        style={{marginLeft: 20}}
                    />
                </TouchableOpacity>
                <View style={s.chipgroup}>
                    {INVOICE_STATUS(t).map(item => {
                        let count = 0;
                        if (incomingPayments && incomingPayments.length) {
                            count = incomingPayments.filter(
                                subscribe =>
                                    subscribe.payment_status == item.value,
                            ).length;
                        }
                        if (count === 0) return;
                        return (
                            <TouchableOpacity
                                key={item.value}
                                style={[s.chip, {borderColor: item.color}]}>
                                <Text
                                    style={[s.chiplabel, {color: item.color}]}>
                                    {item.label} ({count})
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                <View style={s.inputContainer}>
                    <Icon
                        name="search"
                        size={20}
                        color={'#88919E'}
                        style={s.inputIcon}
                    />
                    <TextInput
                        style={s.input}
                        placeholder={t('search')}
                        placeholderTextColor={'#88919E'}
                        returnKeyType="search"
                        value={keyword}
                        onChangeText={value => this.setState({keyword: value})}
                    />
                </View>
                <FlatList
                    style={{width: '100%'}}
                    data={datasource}
                    renderItem={({item}) => {
                        if (item.id < 0) {
                            return (
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}>
                                    <Text
                                        style={[
                                            s.memberName,
                                            {
                                                marginLeft: 25,
                                                marginVertical: 5,
                                                fontSize: 14,
                                            },
                                        ]}>
                                        {item.label}
                                    </Text>
                                    {!isZirklpay ? (
                                        <Text
                                            style={[
                                                s.memberName,
                                                {
                                                    marginRight: 25,
                                                    marginVertical: 5,
                                                    fontSize: 12,
                                                    color: PRIMARY_COLOR,
                                                },
                                            ]}>
                                            {t('paid')}
                                        </Text>
                                    ) : null}
                                </View>
                            );
                        }
                        const {user} = item;
                        const profile = user && user.profile;
                        let status =
                            INVOICE_STATUS(t).find(
                                st => st.value == item.payment_status,
                            ) || INVOICE_STATUS(t)[0];

                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.getMemberInvoices(
                                        user.id,
                                        club_id,
                                    );
                                    this.setState({
                                        page: 'history',
                                        previousPage: this.state.page,
                                        sel_member: user,
                                        expand_member_history: null,
                                    });
                                }}
                                style={s.member}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}>
                                    <View style={s.memberAvatar}>
                                        <AvatarImage
                                            user_id={user?.id}
                                            width={35}
                                            user={user}
                                        />
                                    </View>
                                    <View>
                                        <Text style={s.memberName}>
                                            {getUserName(user)}
                                            {!isZirklpay &&
                                                ` (CHF ${item.amount || 0})`}
                                        </Text>
                                        {/*<Text style={s.memberDescp}>{user.canton}</Text>*/}
                                    </View>
                                </View>
                                {isZirklpay ? (
                                    <Text
                                        style={[
                                            s.memberamount,
                                            {color: status.color},
                                        ]}>
                                        {item.amount} CHF
                                    </Text>
                                ) : (
                                    <TouchableOpacity
                                        onPress={() => {
                                            ActionSheet.showActionSheetWithOptions(
                                                {
                                                    options: [
                                                        INVOICE_STATUS(t)[2]
                                                            .label,
                                                        INVOICE_STATUS(t)[3]
                                                            .label,
                                                        INVOICE_STATUS(t)[4]
                                                            .label,
                                                    ],
                                                    tintColor: 'black',
                                                },
                                                index => {
                                                    if (index != undefined) {
                                                        this.props.changePaymentStatusOfMember(
                                                            {
                                                                invoice_id:
                                                                    cur_invoice.id,
                                                                member_id:
                                                                    user.id,
                                                                status: INVOICE_STATUS(
                                                                    t,
                                                                )[2 + index]
                                                                    .value,
                                                                //payment_method
                                                            },
                                                            () => {},
                                                        );
                                                    }
                                                },
                                            );
                                        }}>
                                        <CheckBox
                                            style={{
                                                width: 30,
                                                paddingVertical: 5,
                                                marginVertical: 0,
                                            }}
                                            isChecked={status.paid}
                                            rightText={''}
                                            checkBoxColor={PRIMARY_TEXT_COLOR}
                                            checkedCheckBoxColor={PRIMARY_COLOR}
                                            disabled
                                        />
                                    </TouchableOpacity>
                                )}
                            </TouchableOpacity>
                        );
                    }}
                    keyExtractor={(item, index) => index + ''}
                />
            </View>
        );
    }
    renderEditAmount() {
        const {t} = this.props;
        const {cur_invoice, sel_plan, plan_amount} = this.state;
        const plan = sel_plan && sel_plan.plan;
        return (
            <View style={{paddingVertical: 20}}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginHorizontal: 20,
                    }}>
                    <TouchableOpacity
                        onPress={async () => {
                            if (
                                this.state.plan_amount &&
                                this.state.plan_amount.length > 0
                            ) {
                                const amount = parseFloat(
                                    this.state.plan_amount,
                                ).toFixed(2);
                                if (amount > 0) {
                                    this.props.changeAmountOfMembersFromPlan(
                                        {
                                            invoice_id: cur_invoice.id,
                                            membership_plan_id: plan.id,
                                            amount: parseFloat(amount),
                                        },
                                        res => {
                                            this.setState({
                                                openChangeAmount: false,
                                            });
                                        },
                                    );
                                }
                            }
                        }}>
                        <Icon
                            name="arrow-left"
                            size={25}
                            color={PRIMARY_COLOR}
                        />
                    </TouchableOpacity>
                </View>
                <View
                    style={[
                        s.planHeader,
                        {width: '100%', marginTop: 30, paddingHorizontal: 20},
                    ]}>
                    <Text style={s.amountTitle}>{t('amount')}</Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            flex: 1,
                        }}>
                        <TextInput
                            style={[
                                s.amountTitle,
                                {
                                    color: PRIMARY_COLOR,
                                    textAlign: 'right',
                                    flex: 1,
                                },
                            ]}
                            value={plan_amount}
                            keyboardType="numeric"
                            onChangeText={value => {
                                this.setState({plan_amount: value});
                            }}
                        />
                        <Text style={[s.amountTitle, {color: PRIMARY_COLOR}]}>
                            {' '}
                            CHF
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
    renderPayableDatePicker() {
        const {t} = this.props;
        const {cur_invoice} = this.state;
        const payable_date = cur_invoice && cur_invoice.payable_date;

        return (
            <View style={{paddingVertical: 20}}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginHorizontal: 20,
                    }}>
                    <TouchableOpacity
                        onPress={async () => {
                            this.setState({
                                openPickerPayalbleWithin: false,
                            });
                        }}>
                        <Icon
                            name="arrow-left"
                            size={25}
                            color={PRIMARY_COLOR}
                        />
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: 40,
                        alignItems: 'center',
                    }}>
                    <View
                        style={[
                            {
                                // flex: 0.6,
                            },
                        ]}>
                        <ScrollPicker
                            ref={sp => {
                                this.sp = sp;
                            }}
                            wrapperColor={BACKGROUND_COLOR}
                            dataSource={PAYABLE_WITHIN(t)}
                            selectedIndex={this.state.sel_pickerindex}
                            itemHeight={50}
                            wrapperHeight={150}
                            hideBorder
                            renderItem={(data, index, isSelected) => {
                                return (
                                    <View
                                        style={{
                                            backgroundColor: BACKGROUND_COLOR,
                                        }}>
                                        <Text
                                            style={[
                                                s.pickerLabel,
                                                isSelected
                                                    ? {
                                                          color: PRIMARY_COLOR,
                                                          fontSize: 18,
                                                      }
                                                    : {},
                                            ]}>
                                            {`${data} ${
                                                isSelected
                                                    ? t(
                                                          `common:day${
                                                              index > 1
                                                                  ? 's'
                                                                  : ''
                                                          }`,
                                                      )
                                                    : ''
                                            }`}
                                        </Text>
                                    </View>
                                );
                            }}
                            onValueChange={(data, selectedIndex) => {
                                this.updateValue(
                                    'payable_date',
                                    moment(
                                        cur_invoice.invoice_date,
                                        'DD.MM.YYYY',
                                    )
                                        .add(selectedIndex + 1, 'days')
                                        .format('DD.MM.YYYY'),
                                );
                            }}
                        />
                    </View>
                    <Icon name="arrow-right" size={25} color={PRIMARY_COLOR} />
                    <View
                        style={{
                            alignItems: 'center',
                            flexDirection: 'row',
                        }}>
                        <Text
                            style={[
                                s.pickerLabel,
                                {color: PRIMARY_COLOR, fontSize: 20},
                            ]}>
                            {payable_date}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
    render() {
        const {page, loading, openPickerPayalbleWithin} = this.state;
        return (
            <View style={s.container}>
                <View style={s.wrapper}>
                    <ScrollView>
                        <View style={s.topBar}>
                            <Text style={s.title}>{this.renderTitle()}</Text>
                            {['main'].includes(page) &&
                                !openPickerPayalbleWithin && (
                                    <CloseButton
                                        onPress={() =>
                                            this.props.navigation.goBack()
                                        }
                                    />
                                )}
                        </View>
                        {loading ? (
                            <ActivityIndicator
                                color={PRIMARY_COLOR}
                                style={{marginTop: 20}}
                            />
                        ) : (
                            <View>{this.renderContent()}</View>
                        )}
                    </ScrollView>
                </View>
            </View>
        );
    }

    renderContent() {
        const {openChangeAmount, page, openPickerPayalbleWithin} = this.state;
        if (openChangeAmount) return this.renderEditAmount();
        if (openPickerPayalbleWithin) return this.renderPayableDatePicker();
        switch (page) {
            case 'main':
                return this.renderMain();
            case 'plans':
                return this.renderPlansList();
            case 'preview':
                return this.renderPreview();
            case 'plandetail':
                return this.renderPlanDetails();
            case 'history':
                return this.renderInvoiceHistory();
            case 'shippingmethod':
                return this.renderShippingMethod();
            case 'incoming':
                return this.renderIncomingPayment();

            default:
                return null;
        }
    }

    renderTitle() {
        const {t} = this.props;
        const {page, openPickerPayalbleWithin, sel_plan} = this.state;
        if (openPickerPayalbleWithin) return t('payabledate');
        if (page === 'plandetail') return sel_plan?.plan?.title;
        return TITLES(t)[page];
    }
}
const mapStateToProps = state => ({
    cur_invoice: state.invoices.cur_invoice,
    member_invoices: state.invoices.member_invoices,
});

const mapDispatchToProps = {
    createInitialInvoice,
    changeAmountOfMembersFromPlan,
    updateInvoiceDetails,
    confirmInvoice,
    getMemberInvoices,
    changePaymentStatusOfMember,
    updateFeeOption,
    setMembershipExclusion,
    setPaymentStatus,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(
    hoistStatics(
        withTranslation(['zirklpaypage', 'common'])(ZirklPay),
        ZirklPay,
    ),
);

const PAYABLE_WITHIN = t => {
    const result = ['0 ', '1 '];
    for (let index = 2; index < 101; index++) {
        result.push(index + '  ');
    }
    return result;
};
