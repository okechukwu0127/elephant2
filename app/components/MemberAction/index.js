import React from 'react';
import {
    Dimensions,
    TextInput,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    Keyboard,
    Platform,
    Alert,
} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';
import {
    BACKGROUND_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
} from '../../themes/colors';
import ScrollPicker from '../ScrollPicker';
import Contacts from 'react-native-contacts';
import {withTranslation} from 'react-i18next';
import {getUserName} from '../../utils/utils';
import AvatarImage from '../AvatarImage';

const {width, height} = Dimensions.get('window');

const page_config = t => ({
    assign: {title: t('title_assign'), subtitle: t('subtitle_assign')},
    search: {title: t('title_search'), subtitle: t('subtitle_search')},
    delete: {title: t('title_delete'), subtitle: t('subtitle_delete')},
});
const REASONS = t => [
    t('death'), //Death
    t('voluntary'), //Voluntary
    t('notpaid'), //Not paid
    t('emigrated'), //Emigrated
];
class MemberAction extends React.Component {
    state = {
        page: 'main',
        selRoleID: 0,
        selReason: 0,
        keyword: null,
        added: null,
    };
    UNSAFE_componentWillReceiveProps(nextprops) {
        if (nextprops.isVisible && !this.props.isVisible) {
            const {member} = nextprops;
            if (member) {
                this.setState({keyword: member.first_name});
                //this.props.searchMembers(member.first_name)
            }
        }
    }
    renderMain() {
        const {t, hideCancel, deleteFromBoard} = this.props;
        return (
            <View>
                <View style={{flexDirection: 'row', width: '100%'}}>
                    <TouchableOpacity
                        style={{flexDirection: 'row', flex: 0.5}}
                        onPress={() => this.setState({page: 'assign'})}>
                        <Icon name="users" size={28} color={PRIMARY_COLOR} />
                        <Text style={s.optionLabel}>{t('assignrole')}</Text>
                    </TouchableOpacity>
                    {!hideCancel && (
                        <TouchableOpacity
                            style={{flexDirection: 'row', flex: 0.5}}
                            onPress={() => {
                                if (this.props.isMember && this.props.member) {
                                    Alert.alert(
                                        'Remove',
                                        'Are you sure to remove this member?',
                                        [
                                            {
                                                text: 'Cancel',
                                                onPress: () => {},
                                                style: 'cancel',
                                            },
                                            {
                                                text: 'Ok',
                                                onPress: () => {
                                                    this.onClose();
                                                    this.props.requestRemove(
                                                        this.props.member.id,
                                                    );
                                                },
                                            },
                                        ],
                                        {cancelable: true},
                                    );
                                } else this.setState({page: 'delete'});
                            }}>
                            <Icon
                                name="calendar"
                                size={28}
                                color={PRIMARY_COLOR}
                            />
                            <Text style={s.optionLabel}>
                                {t('terminatemembership')}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
                {/* {this.props.member && (
                    <TouchableOpacity
                        style={{flexDirection: 'row', marginTop: 20}}
                        onPress={() => {
                            const {member} = this.props;
                            const member_profile = member
                                ? member.profile
                                : null;

                            let newPerson = {
                                ...(member_profile && member_profile.phone
                                    ? {
                                          phoneNumbers: [
                                              {
                                                  label: 'mobile',
                                                  number: member_profile.phone,
                                              },
                                          ],
                                      }
                                    : {}),
                                emailAddresses: [
                                    {
                                        label: 'work',
                                        email:
                                            member && member.email
                                                ? member.email
                                                : '',
                                    },
                                ],
                                ...(Platform.OS == 'ios' &&
                                member &&
                                member.first_name
                                    ? {
                                          givenName:
                                              member && member.first_name,
                                      }
                                    : {
                                          displayName:
                                              member && member.first_name,
                                      }),
                            };

                            Contacts.openContactForm(newPerson, err => {
                                if (err) console.warn(err);
                                // form is open
                            });
                        }}>
                        <Icon name="save" size={28} color={PRIMARY_COLOR} />
                        <Text style={s.optionLabel}>{t('savecontact')}</Text>
                    </TouchableOpacity>
                )} */}
            </View>
        );
    }
    renderAssign() {
        const {t, roles} = this.props;
        return (
            <View>
                <View style={{flexDirection: 'row', width: '100%'}}>
                    <ScrollPicker
                        ref={sp => {
                            this.sp = sp;
                        }}
                        dataSource={roles.sort((a, b) =>
                            a?.name?.localeCompare(b?.name),
                        )}
                        selectedIndex={roles
                            .sort((a, b) => a?.name?.localeCompare(b?.name))
                            .findIndex(r => r.id === this.state.selRoleID)}
                        itemHeight={50}
                        wrapperHeight={150}
                        wrapperColor={'white'}
                        highlightColor={'#d8d8d8'}
                        renderItem={(data, index, isSelected) => {
                            return (
                                <View style={s.pickeritem}>
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
                                        {data.name}
                                    </Text>
                                </View>
                            );
                        }}
                        onValueChange={(data, selectedIndex) => {
                            this.setState({selRoleID: data?.id});
                        }}
                    />
                </View>
                <TouchableOpacity
                    style={s.btn}
                    onPress={() => {
                        this.setState({page: 'search'});
                    }}>
                    <Text style={s.btnLabel}>{t('next')}</Text>
                </TouchableOpacity>
            </View>
        );
    }
    renderSearch() {
        const {keyword, added, selRoleID} = this.state;
        const {
            t,
            club_members,
            searchMembers,
            addMemberWithRole,
            roles,
        } = this.props;
        return (
            <View>
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
                        onEndEditing={() => {
                            Keyboard.dismiss();
                            searchMembers(keyword);
                        }}
                        returnKeyType="search"
                        value={keyword}
                        onChangeText={keyword => this.setState({keyword})}
                    />
                </View>
                {club_members.length <= 0 ? (
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Icon name="x-circle" size={30} color={PRIMARY_COLOR} />
                        <Text
                            style={[
                                s.title,
                                {
                                    alignSelf: 'center',
                                    color: PRIMARY_TEXT_COLOR,
                                },
                            ]}>
                            {t('noresult')}{' '}
                        </Text>
                        <Text
                            style={[
                                s.subtitle,
                                {
                                    alignSelf: 'center',
                                    textAlign: 'center',
                                    fontSize: 12,
                                    marginBottom: 0,
                                },
                            ]}>
                            {t('didntfind')}{' '}
                            <Text style={{color: PRIMARY_COLOR}}>
                                {t('invite')}
                            </Text>
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        style={{flexGrow: 0, maxHeight: height / 2}}
                        data={club_members}
                        renderItem={({item}) => {
                            return (
                                <View style={s.sectionItem}>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            flex: 1,
                                        }}>
                                        <View style={s.sectionImage}>
                                            <AvatarImage
                                                user_id={item?.id}
                                                width={40}
                                                user={item}
                                            />
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: 'column',
                                                alignItems: 'flex-start',
                                                flex: 1,
                                            }}>
                                            <Text style={[s.memberName]}>
                                                {getUserName(item)}
                                            </Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity
                                        style={{paddingVertical: 10}}
                                        onPress={() => {
                                            this.setState({added: item.id});
                                        }}>
                                        <Icon
                                            name={
                                                added == item.id
                                                    ? 'check'
                                                    : 'plus'
                                            }
                                            size={25}
                                            color={PRIMARY_COLOR}
                                            style={{marginLeft: 10}}
                                        />
                                    </TouchableOpacity>
                                </View>
                            );
                        }}
                        keyExtractor={(item, index) => item.id + ''}
                    />
                )}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: !(
                            added != null || club_members.length <= 0
                        )
                            ? 'center'
                            : 'space-between',
                    }}>
                    {club_members.length <= 0 ? (
                        <TouchableOpacity
                            style={[
                                s.btn,
                                {
                                    paddingHorizontal: 20,
                                    backgroundColor: '#C4C4C4',
                                    marginHorizontal: 5,
                                },
                            ]}
                            onPress={() => {}}>
                            <Text
                                style={[
                                    s.btnLabel,
                                    {fontSize: 12, color: PRIMARY_TEXT_COLOR},
                                ]}>
                                {t('invite')}
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={[
                                s.btn,
                                {paddingHorizontal: 20, marginHorizontal: 5},
                            ]}
                            onPress={() => {
                                const role = roles?.find(
                                    r => r.id === selRoleID,
                                );
                                if (added != null && role) {
                                    this.onClose();
                                    addMemberWithRole(added, role.id);
                                }
                            }}>
                            <Text style={[s.btnLabel, {fontSize: 12}]}>
                                {t('add')}
                            </Text>
                        </TouchableOpacity>
                    )}
                    {(added != null || club_members.length <= 0) && (
                        <TouchableOpacity
                            style={[s.outlinebtn, {paddingHorizontal: 20}]}
                            onPress={() => {
                                this.onClose();
                            }}>
                            <Text style={[s.outlinebtnLabel, {fontSize: 12}]}>
                                {t('abort')}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    }
    renderDelete() {
        const {selReason} = this.state;
        const {t} = this.props;
        return (
            <View>
                <View style={{flexDirection: 'row', width: '100%'}}>
                    <ScrollPicker
                        ref={sp => {
                            this.sp = sp;
                        }}
                        dataSource={REASONS(t)}
                        selectedIndex={selReason}
                        itemHeight={50}
                        wrapperHeight={150}
                        wrapperColor={'white'}
                        highlightColor={'#d8d8d8'}
                        renderItem={(data, index, isSelected) => {
                            return (
                                <View style={s.pickeritem}>
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
                                        {data}
                                    </Text>
                                </View>
                            );
                        }}
                        onValueChange={(data, selectedIndex) => {
                            this.setState({selReason: selectedIndex});
                        }}
                    />
                </View>
                <TouchableOpacity
                    style={s.btn}
                    onPress={() => {
                        this.onClose();
                        this.props.requestRemove(
                            this.props.member.id,
                            REASONS(t)[selReason],
                        );
                    }}>
                    <Text style={s.btnLabel}>{t('next')}</Text>
                </TouchableOpacity>
            </View>
        );
    }
    onClose() {
        this.setState({
            page: 'main',
            selRoleID: 0,
            selReason: 0,
            keyword: '',
            added: null,
        });
        this.props.onClose();
    }
    render() {
        const {page} = this.state;
        const {t} = this.props;
        return (
            <Modal
                isVisible={this.props.isVisible}
                onBackButtonPress={() => this.onClose()}
                onBackdropPress={() => this.onClose()}
                onSwipeComplete={() => this.onClose()}
                //swipeDirection={['down']}
                style={s.modal}
                avoidKeyboard>
                <View style={s.modalContainer}>
                    <View style={s.modalcloseBtn} />
                    {page !== 'main' && (
                        <>
                            <Text style={s.title}>
                                {page_config(t)[page].title}
                            </Text>
                            <Text style={s.subtitle}>
                                {page_config(t)[page].subtitle}
                            </Text>
                        </>
                    )}
                    {page == 'main' && this.renderMain()}
                    {page == 'assign' && this.renderAssign()}
                    {page == 'search' && this.renderSearch()}
                    {page == 'delete' && this.renderDelete()}
                </View>
            </Modal>
        );
    }
}

export default withTranslation('memberaction')(MemberAction);
