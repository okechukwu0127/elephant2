import React, {useState} from 'react';
import {View, TouchableOpacity, Text, TextInput, Alert} from 'react-native';
import {PRIMARY_COLOR, PRIMARY_TEXT_COLOR} from '../../themes/colors';
import s from './styles';
import {BackButton} from '../';
import {useDispatch} from 'react-redux';
import {showMessage} from '../../utils/utils';
import {
    createMembership,
    updateMembership,
    deleteMembership,
} from '../../reducers/membership';
import {useTranslation} from 'react-i18next';

export default function EditMembershipCategory({navigation}) {
    const [title, setTitle] = useState(navigation.getParam('title'));
    const [amount, setAmount] = useState(navigation.getParam('amount'));
    const editingID = navigation.getParam('id');
    const club_id = navigation.getParam('club_id');
    const {t} = useTranslation();

    const dispatch = useDispatch();
    const onClickCreateBtn = (isUpdate = false) => {
        if (title == null || title.length === 0)
            return showMessage(t('invalidtitle'));
        if (amount == null) return showMessage(t('invalidamount'));

        if (isUpdate) {
            dispatch(
                updateMembership(
                    club_id,
                    {id: editingID, title, amount},
                    res => {
                        if (res) {
                            showMessage(t('successupdate'), true);
                            navigation.navigate('Membership', {
                                club_id,
                            });
                        }
                    },
                ),
            );
        } else {
            dispatch(
                createMembership(club_id, {title, amount}, res => {
                    if (res) showMessage(t('successcreate'), true);
                    navigation.navigate('Membership', {
                        club_id,
                    });
                }),
            );
        }
    };

    return (
        <View style={s.container}>
            <View style={s.wrapper}>
                <View style={s.topBar}>
                    <BackButton
                        onPress={() => {
                            navigation.navigate('Membership', {
                                club_id,
                            });
                        }}
                    />
                    <Text style={s.title}>{t('edit-category')}</Text>
                </View>
                <View style={{marginTop: 10}}>
                    <View style={s.sectionItem}>
                        <Text style={s.sectionItemLabel}>{t('name')}</Text>
                        <TextInput
                            style={s.textInput}
                            value={title}
                            onChangeText={_title => {
                                setTitle(_title);
                            }}
                        />
                    </View>
                    <View style={s.sectionItem}>
                        <Text style={s.sectionItemLabel}>{t('amount')}</Text>
                        <TextInput
                            keyboardType="number-pad"
                            style={s.textInput}
                            value={amount != null ? amount + '' : ''}
                            placeholder={'CHF'}
                            onChangeText={_amount => {
                                setAmount(_amount);
                            }}
                        />
                    </View>
                    {editingID ? (
                        <View
                            style={{
                                marginTop: 80,
                                paddingHorizontal: 60,
                            }}>
                            <TouchableOpacity
                                style={[
                                    s.updateBtn,
                                    {
                                        backgroundColor: PRIMARY_COLOR,
                                        marginBottom: 10,
                                    },
                                ]}
                                onPress={() => onClickCreateBtn(true)}>
                                <Text style={s.btnLabel}>{t('btnupdate')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    s.updateBtn,
                                    {backgroundColor: PRIMARY_TEXT_COLOR},
                                ]}
                                onPress={() => {
                                    Alert.alert(
                                        t('delete'),
                                        t('deletemsg'),
                                        [
                                            {
                                                text: t('cancel'),
                                                onPress: () => {},
                                                style: 'cancel',
                                            },
                                            {
                                                text: t('ok'),
                                                onPress: () => {
                                                    dispatch(
                                                        deleteMembership(
                                                            navigation.getParam(
                                                                'club_id',
                                                            ),
                                                            editingID,
                                                            () =>
                                                                navigation.goBack(),
                                                        ),
                                                    );
                                                },
                                            },
                                        ],
                                        {cancelable: true},
                                    );
                                }}>
                                <Text style={s.btnLabel}>{t('btndelete')}</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View
                            style={{
                                marginTop: 80,
                                paddingHorizontal: 60,
                            }}>
                            <TouchableOpacity
                                style={[
                                    s.button,
                                    {
                                        backgroundColor: PRIMARY_COLOR,
                                    },
                                ]}
                                onPress={() => onClickCreateBtn()}>
                                <Text style={s.btnLabel}>{t('btncreate')}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}
