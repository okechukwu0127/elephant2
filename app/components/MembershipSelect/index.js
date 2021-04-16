import React, {useState, useEffect} from 'react';
import {
    View,
    ScrollView,
    Text,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {
    PRIMARY_TEXT_COLOR,
    PRIMARY_COLOR,
    GRAY_COLOR,
} from '../../themes/colors';
import s from './styles';
import {useTranslation} from 'react-i18next';
import {useSelector, useDispatch} from 'react-redux';
import {getMembership} from '../../reducers/membership';

export default function MembershipSelect(props) {
    const {navigation} = props;

    const club_id = navigation.getParam('club_id');
    const selected = navigation.getParam('selected');
    const onSave = navigation.getParam('onSave');

    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    useEffect(() => {
        setLoading(true);
        dispatch(getMembership(club_id, () => setLoading(false)));
    }, []);
    const memberships = useSelector(state => state.membership.memberships);

    const {t} = useTranslation();
    const [checked, setChecked] = useState(selected);

    const itemClicked = value => {
        setChecked(value);
    };

    return (
        <View style={s.container}>
            <View style={s.wrapper}>
                <View style={s.topBar}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack();
                        }}>
                        <Icon
                            name="arrow-left"
                            color={PRIMARY_TEXT_COLOR}
                            size={25}
                            style={{marginRight: 15}}
                        />
                    </TouchableOpacity>
                    <Text style={s.title}>Mitglieder-Kategorien</Text>
                </View>
                {loading ? (
                    <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                ) : (
                    <ScrollView>
                        <View style={s.section}>
                            {memberships &&
                                memberships.map((membership, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={s.sectionItem}
                                        onPress={() =>
                                            itemClicked(membership.id)
                                        }>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                width: '90%',
                                            }}>
                                            <Text style={s.sectionItemLabel}>
                                                {membership.title}
                                            </Text>
                                            <Text style={s.sectionItemLabel}>
                                                {membership.amount} CHF
                                            </Text>
                                        </View>
                                        {checked === membership.id && (
                                            <Icon
                                                name="check"
                                                size={24}
                                                color={PRIMARY_COLOR}
                                            />
                                        )}
                                    </TouchableOpacity>
                                ))}
                        </View>
                        {memberships?.length > 0 && (
                            <TouchableOpacity
                                style={[
                                    s.button,
                                    !checked
                                        ? {backgroundColor: GRAY_COLOR}
                                        : {},
                                ]}
                                disabled={!checked}
                                onPress={() => {
                                    onSave(checked);
                                    navigation.goBack();
                                }}>
                                <Text style={s.buttonText}>Speichern</Text>
                            </TouchableOpacity>
                        )}
                        {memberships?.length === 0 && (
                            <Text
                                style={{
                                    fontFamily: 'Rubik-Regular',
                                    color: GRAY_COLOR,
                                    fontSize: 16,
                                    textAlign: 'center',
                                }}>
                                Keine Mitgliedschaften gefunden
                            </Text>
                        )}
                    </ScrollView>
                )}
            </View>
        </View>
    );
}
