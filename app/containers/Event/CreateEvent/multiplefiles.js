import * as React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    ScrollView,
    KeyboardAvoidingView,
} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {PRIMARY_COLOR, PRIMARY_TEXT_COLOR} from '../../../themes/colors';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import hoistStatics from 'hoist-non-react-statics';
import CustomFocusInput from '../../../components/CustomFocusInput/CustomFocusInput';
import DocumentPicker from 'react-native-document-picker';
import ClearButton from '../../../components/ClearButton/';

class MultipleFiles extends React.Component {
    constructor(props) {
        super(props);
        const extra_files = props.navigation.getParam('extra_files');
        this.state = {
            extra_files: extra_files || [],
        };
    }
    updateExtraFile(index, key, value) {
        const {extra_files} = this.state;
        const new_extra_files = JSON.parse(JSON.stringify(extra_files));
        new_extra_files[index] = {
            ...new_extra_files[index],
            [key]: value,
            id: null,
        };
        this.setState({extra_files: new_extra_files});
    }
    goBack() {
        const updateExtraFiles = this.props.navigation.getParam(
            'updateExtraFiles',
        );
        updateExtraFiles(this.state.extra_files);
        this.props.navigation.goBack();
    }

    deleteElement(index) {
        const {extra_files} = this.state;

        this.setState({
            extra_files: [
                ...extra_files?.slice(0, index),
                ...extra_files?.slice(index + 1),
            ],
        });
    }
    render() {
        const {t} = this.props;
        const {extra_files} = this.state;
        return (
            <KeyboardAvoidingView
                behavior="height"
                // keyboardVerticalOffset={100}
                style={s.container}>
                <View style={s.wrapper}>
                    <ScrollView keyboardShouldPersistTaps="handled">
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
                                {t('multiplefiles_title')}
                            </Text>
                        </View>
                        <View>
                            {extra_files.map((item, index) => {
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
                                                {index + 1}. {t('file')}
                                            </Text>
                                            <ClearButton
                                                onPress={() => {
                                                    this.deleteElement(index);
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
                                                    value={item.name}
                                                    onChangeText={value => {
                                                        this.updateExtraFile(
                                                            index,
                                                            'name',
                                                            value,
                                                        );
                                                    }}
                                                    placeholder={t(
                                                        'filename_placeholder_title',
                                                    )}
                                                />
                                                {item?.name?.length > 0 ? (
                                                    <ClearButton
                                                        onPress={() => {
                                                            this.updateExtraFile(
                                                                index,
                                                                'name',
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
                                                    {t('filepath')}
                                                </Text>
                                                {item.url ||
                                                (item.file &&
                                                    item.file.name) ? (
                                                    <View
                                                        style={{
                                                            flexDirection:
                                                                'row',
                                                            justifyContent:
                                                                'flex-end',
                                                            alignItems:
                                                                'center',
                                                            flex: 1,
                                                            paddingLeft: 20,
                                                        }}>
                                                        <Text
                                                            style={[
                                                                {
                                                                    color:
                                                                        '#88919E',
                                                                    fontSize: 14,
                                                                    marginRight: 15,
                                                                    marginLeft: 10,
                                                                },
                                                            ]}>
                                                            {item.url
                                                                ? item.url.substring(
                                                                      item.url.lastIndexOf(
                                                                          '/',
                                                                      ) + 1,
                                                                  )
                                                                : item.file
                                                                      .name}
                                                        </Text>
                                                        <ClearButton
                                                            onPress={() => {
                                                                this.updateExtraFile(
                                                                    index,
                                                                    item.url
                                                                        ? 'url'
                                                                        : 'file',
                                                                    null,
                                                                );
                                                            }}
                                                        />
                                                    </View>
                                                ) : (
                                                    <TouchableOpacity
                                                        style={{
                                                            marginBottom: 4,
                                                        }}
                                                        onPress={async () => {
                                                            try {
                                                                const res = await DocumentPicker.pick(
                                                                    {
                                                                        type: [
                                                                            DocumentPicker
                                                                                .types
                                                                                .allFiles,
                                                                        ],
                                                                        readContent: true,
                                                                        copyTo:
                                                                            'cachesDirectory',
                                                                    },
                                                                );
                                                                this.updateExtraFile(
                                                                    index,
                                                                    'file',
                                                                    {
                                                                        ...res,
                                                                        uri: res.fileCopyUri.replace(
                                                                            'file://',
                                                                            '',
                                                                        ),
                                                                    },
                                                                );
                                                            } catch (err) {
                                                                console.log(
                                                                    'pickFile -> err',
                                                                    err,
                                                                );
                                                                if (
                                                                    !DocumentPicker.isCancel(
                                                                        err,
                                                                    )
                                                                )
                                                                    throw err;
                                                            }
                                                        }}>
                                                        <Text
                                                            style={[
                                                                s.sectionItemLabel,
                                                                {
                                                                    color: PRIMARY_COLOR,
                                                                },
                                                            ]}>
                                                            {t(
                                                                'filepath_placeholder',
                                                            )}
                                                        </Text>
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                );
                            })}
                            <TouchableOpacity
                                style={s.plusbutton}
                                onPress={() => {
                                    this.setState({
                                        extra_files: [
                                            ...extra_files,
                                            {name: '', file: null},
                                        ],
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
                                    {t('addmorefile')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
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
        withTranslation(['createevent', 'common'])(MultipleFiles),
        MultipleFiles,
    ),
);
