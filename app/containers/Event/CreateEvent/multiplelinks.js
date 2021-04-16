import * as React from 'react';
import {View, TouchableOpacity, Text, ScrollView, Platform} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {PRIMARY_TEXT_COLOR} from '../../../themes/colors';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import hoistStatics from 'hoist-non-react-statics';
import CustomFocusInput from '../../../components/CustomFocusInput/CustomFocusInput';
import ClearButton from '../../../components/ClearButton/';

class MultipleLinks extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            header: null,
        };
    };
    constructor(props) {
        super(props);
        const links = props.navigation.getParam('links');
        this.state = {
            links: links,
        };
    }
    updateLink(index, key, value) {
        const {links} = this.state;
        const new_links = JSON.parse(JSON.stringify(links));
        new_links[index] = {
            ...new_links[index],
            [key]: value,
        };
        this.setState({links: new_links});
    }
    deleteLink = index => {
        const {links} = this.state;
        this.setState({
            links: [...links.slice(0, index), ...links.slice(index + 1)],
        });
    };
    goBack() {
        const updateLinks = this.props.navigation.getParam('updateLinks');
        updateLinks(this.state.links);
        this.props.navigation.goBack();
    }
    render() {
        const {t} = this.props;
        const {links} = this.state;
        return (
            <View style={s.container}>
                <View style={s.wrapper}>
                    <ScrollView>
                        <View style={s.topBar}>
                            <TouchableOpacity onPress={() => this.goBack()}>
                                <Icon
                                    name="arrow-left"
                                    color={PRIMARY_TEXT_COLOR}
                                    size={25}
                                    style={{marginRight: 15}}
                                />
                            </TouchableOpacity>
                            <Text style={s.title}>
                                {t('multiplelinks_title')}
                            </Text>
                        </View>
                        <View>
                            {links.map((item, index) => {
                                return (
                                    <View key={index + ''}>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                paddingRight: 10,
                                                paddingVertical: 20,
                                            }}>
                                            <Text
                                                style={[
                                                    s.sectionName,
                                                    {margin: 0},
                                                ]}>
                                                {index + 1}. {t('link')}
                                            </Text>
                                            <ClearButton
                                                onPress={() => {
                                                    this.deleteLink(index);
                                                }}
                                            />
                                        </View>

                                        <View
                                            style={[
                                                s.section,
                                                {
                                                    paddingVertical: 0,
                                                    borderBottomColor:
                                                        '#E5E5E5',
                                                    borderBottomWidth: 1,
                                                },
                                            ]}>
                                            <View style={[s.sectionItem]}>
                                                <Text
                                                    style={s.sectionItemLabel}>
                                                    {t('filename')}
                                                </Text>
                                                <CustomFocusInput
                                                    style={[
                                                        s.textInput,
                                                        {textAlign: 'right'},
                                                    ]}
                                                    value={item.title}
                                                    onChangeText={value => {
                                                        this.updateLink(
                                                            index,
                                                            'title',
                                                            value,
                                                        );
                                                    }}
                                                    placeholder={t(
                                                        'filename_placeholder_title',
                                                    )}
                                                />
                                                {item.title &&
                                                item.title.length > 0 ? (
                                                    <ClearButton
                                                        onPress={() => {
                                                            this.updateLink(
                                                                index,
                                                                'title',
                                                                null,
                                                            );
                                                        }}
                                                    />
                                                ) : null}
                                            </View>
                                            <View
                                                style={[
                                                    s.sectionItem,
                                                    {borderBottomWidth: 0},
                                                ]}>
                                                <Text
                                                    style={s.sectionItemLabel}>
                                                    {t('link')}
                                                </Text>
                                                <View
                                                    style={{
                                                        flex: 1,
                                                        flexDirection: 'row',
                                                        justifyContent:
                                                            'center',
                                                        alignItems: 'center',
                                                    }}>
                                                    <CustomFocusInput
                                                        autoCapitalize="none"
                                                        keyboardType={Platform.select(
                                                            {
                                                                ios: 'url',
                                                                andoird:
                                                                    'default',
                                                            },
                                                        )}
                                                        style={[
                                                            s.textInput,
                                                            {
                                                                textAlign:
                                                                    'right',
                                                            },
                                                        ]}
                                                        value={
                                                            item.url ||
                                                            'https://'
                                                        }
                                                        onChangeText={value => {
                                                            this.updateLink(
                                                                index,
                                                                'url',
                                                                value,
                                                            );
                                                        }}
                                                        placeholder={t(
                                                            'filename_placeholder_link',
                                                        )}
                                                    />
                                                    {item.url &&
                                                    item.url.length > 0 ? (
                                                        <ClearButton
                                                            onPress={() => {
                                                                this.updateLink(
                                                                    index,
                                                                    'url',
                                                                    null,
                                                                );
                                                            }}
                                                        />
                                                    ) : null}
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                );
                            })}
                            <TouchableOpacity
                                style={s.plusbutton}
                                onPress={() => {
                                    this.setState({
                                        links: [...links, {title: '', url: ''}],
                                    });
                                }}>
                                <View style={s.plusbuttonIcon}>
                                    <Icon name="plus" size={30} color="white" />
                                </View>
                                <Text
                                    style={[
                                        s.sectionName,
                                        {
                                            marginTop: 0,
                                            marginBottom: 0,
                                            paddingHorizontal: 10,
                                        },
                                    ]}>
                                    {t('addmorelink')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}
const mapStateToProps = state => ({});

const mapDispatchToProps = {};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(
    hoistStatics(
        withTranslation(['createevent', 'common'])(MultipleLinks),
        MultipleLinks,
    ),
);
