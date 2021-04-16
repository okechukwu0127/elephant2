import * as React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    ActivityIndicator,
    FlatList,
} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {PRIMARY_COLOR} from '../../../themes/colors';
import {
    getMembership,
    createMembership,
    deleteMembership,
    updateMembership,
} from '../../../reducers/membership';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import hoistStatics from 'hoist-non-react-statics';
import BackButton from '../../../components/BackButton';

class Membership extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            header: null,
        };
    };

    constructor(props) {
        super(props);
        const club_id = props.navigation.getParam('club_id');

        this.state = {
            loading: true,
            isCreate: false,
            club_id,
            form: {
                active: 1,
                invoice_period: '1',
                invoice_interval: 'month',
            },
        };
    }
    UNSAFE_componentWillMount() {
        this.props.getMembership(this.state.club_id, () => {
            this.setState({loading: false});
        });
    }
    updateFormField(name, value) {
        const {form} = this.state;
        this.setState({
            form: {
                ...form,
                [name]: value,
            },
        });
    }
    render() {
        const {t, memberships} = this.props;
        const {loading} = this.state;

        return (
            <View style={s.container}>
                <View style={s.wrapper}>
                    <View style={s.topBar}>
                        <BackButton
                            onPress={() => {
                                this.props.navigation.goBack();
                            }}
                        />
                        <Text style={s.title}>{t('title')}</Text>
                    </View>
                    <View>
                        {loading ? (
                            <ActivityIndicator
                                style={{alignSelf: 'center', marginTop: 20}}
                                size="small"
                                color={PRIMARY_COLOR}
                            />
                        ) : (
                            <View style={s.section}>
                                <FlatList
                                    style={s.flatlist}
                                    data={[
                                        ...memberships?.filter(
                                            el =>
                                                !el.title?.includes(
                                                    'Free membership',
                                                ),
                                        ),
                                        'add-new',
                                    ]}
                                    item
                                    renderItem={({item, index}) => {
                                        return item === 'add-new' ? (
                                            <TouchableOpacity
                                                style={[s.sectionItem]}
                                                onPress={() =>
                                                    this.props.navigation.navigate(
                                                        'EditMembershipCategory',
                                                        {
                                                            club_id: this.state
                                                                .club_id,
                                                        },
                                                    )
                                                }>
                                                <Text
                                                    style={s.sectionItemLabel}>
                                                    {t('category')}
                                                </Text>
                                                <View style={s.sectionRight}>
                                                    <Icon
                                                        name="plus"
                                                        size={24}
                                                        color={PRIMARY_COLOR}
                                                        style={{
                                                            marginRight: 4,
                                                        }}
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity
                                                style={[s.sectionItem]}
                                                onPress={() => {
                                                    this.props.navigation.navigate(
                                                        'EditMembershipCategory',
                                                        {
                                                            club_id: this.state
                                                                .club_id,
                                                            ...item,
                                                        },
                                                    );
                                                }}>
                                                <Text
                                                    style={s.sectionItemLabel}>
                                                    {item.title}
                                                </Text>
                                                <View style={s.sectionRight}>
                                                    <Text
                                                        style={
                                                            s.sectionRightLabel
                                                        }>
                                                        {`CHF ${item.amount}`}
                                                    </Text>
                                                    <Icon
                                                        name="chevron-right"
                                                        size={24}
                                                        color="#C7C7CC"
                                                        style={{
                                                            marginLeft: 10,
                                                        }}
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    }}
                                    keyExtractor={(item, index) => item.id + ''}
                                />
                                <TouchableOpacity
                                    style={[
                                        s.button,
                                        {
                                            backgroundColor: PRIMARY_COLOR,
                                            marginTop: 80,
                                        },
                                    ]}
                                    onPress={() =>
                                        this.props.navigation.goBack()
                                    }>
                                    <Text style={s.btnLabel}>{t('save')}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        );
    }
}
const mapStateToProps = state => ({
    memberships: state.membership.memberships,
});

const mapDispatchToProps = {
    getMembership,
    createMembership,
    deleteMembership,
    updateMembership,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(
    hoistStatics(
        withTranslation(['clubmembership', 'common'])(Membership),
        Membership,
    ),
);
