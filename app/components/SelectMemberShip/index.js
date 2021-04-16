import React from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import s from './styles';
import Modal from 'react-native-modal';
import {PRIMARY_COLOR} from '../../themes/colors';
import {connect} from 'react-redux';
import {getMembership} from '../../reducers/membership';
import {withTranslation} from 'react-i18next';

var INVOICE_OPTIONS = t => [
    {value: 'month', label: t('common:months'), singular: t('common:month')},
    {value: 'year', label: t('common:years'), singular: t('common:year')},
];

class SelectMemberShip extends React.Component {
    state = {
        selIndex: 0,
        loading: true,
        memberships: [],
    };
    UNSAFE_componentWillMount() {
        this.props.club_id != null &&
            this.props.getMembership(
                this.props.club_id,
                res => {
                    if (res) {
                        this.state.memberships = res;
                        if (res.length == 1) this.state.selIndex = res[0];
                    }
                    this.setState({loading: false});
                },
                true,
            );
    }
    UNSAFE_componentWillReceiveProps(nextprops) {
        if (
            this.props.club_id != nextprops.club_id &&
            nextprops.club_id != null
        ) {
            this.setState({loading: true});
            this.props.getMembership(
                nextprops.club_id,
                res => {
                    if (res) {
                        this.state.memberships = res;
                        if (res.length == 1) this.state.selIndex = res[0];
                    }
                    this.setState({loading: false});
                },
                true,
            );
        }
    }
    onClose() {
        this.setState({
            page: 'main',
            selReason: 0,
            keyword: '',
            added: null,
        });
        this.props.onClose();
    }
    render() {
        const {t, memberships} = this.props;
        const {selIndex, loading} = this.state;

        const active_memberships = memberships.filter(item => item.active);

        return (
            <Modal
                isVisible={this.props.isVisible}
                onBackButtonPress={() => this.onClose()}
                onBackdropPress={() => this.onClose()}
                onSwipeComplete={() => this.onClose()}
                //swipeDirection={['down']}
                style={s.modal}>
                <View style={s.modalContainer}>
                    <View style={s.modalcloseBtn} />
                    <Text style={s.title}>{t('categories')}</Text>
                    {/*<Text style={s.subtitle}>{'select'}</Text>*/}
                    {loading ? (
                        <ActivityIndicator
                            color={PRIMARY_COLOR}
                            style={{marginVertical: 30}}
                        />
                    ) : (
                        <View style={{width: '100%'}}>
                            <View style={{width: '100%', marginTop: 10}}>
                                {active_memberships.map(item => {
                                    const recurring = INVOICE_OPTIONS(t).find(
                                        option =>
                                            option.value ==
                                            item.invoice_interval,
                                    );
                                    return (
                                        <TouchableOpacity
                                            key={item.id + ''}
                                            style={[
                                                s.pickeritem,
                                                selIndex.id == item.id
                                                    ? {
                                                          borderBottomColor: PRIMARY_COLOR,
                                                      }
                                                    : {},
                                            ]}
                                            onPress={() =>
                                                this.setState({selIndex: item})
                                            }>
                                            <View style={{flex: 0.6}}>
                                                <Text
                                                    style={[
                                                        s.pickerLabel,
                                                        selIndex.id == item.id
                                                            ? {
                                                                  color: PRIMARY_COLOR,
                                                                  fontSize: 15,
                                                              }
                                                            : {fontSize: 15},
                                                    ]}>
                                                    {item.title ===
                                                    'Free membership'
                                                        ? 'Mitglied'
                                                        : item.title}
                                                </Text>
                                            </View>
                                            <View style={{flex: 0.5}}>
                                                <Text
                                                    style={[
                                                        s.pickerLabel,
                                                        selIndex.id == item.id
                                                            ? {
                                                                  color: PRIMARY_COLOR,
                                                                  fontSize: 11,
                                                              }
                                                            : {fontSize: 11},
                                                    ]}>{`CHF ${item.amount} ${t(
                                                    'per',
                                                )} ${
                                                    item.invoice_period
                                                } ${recurring &&
                                                    (item.invoice_period == 1
                                                        ? recurring.singular
                                                        : recurring.label)}`}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                            <TouchableOpacity
                                style={s.btn}
                                onPress={() => {
                                    if (selIndex)
                                        this.props.onAddMembership(selIndex.id);
                                }}>
                                <Text style={s.btnLabel}>
                                    {t('jointoclub')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </Modal>
        );
    }
}
const mapStateToProps = state => ({
    memberships: state.membership.memberships,
});

const mapDispatchToProps = {
    getMembership,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslation(['selectmembership', 'common'])(SelectMemberShip));
