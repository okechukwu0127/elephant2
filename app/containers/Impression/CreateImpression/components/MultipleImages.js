import * as React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Platform,
    Image,
    Dimensions,
} from 'react-native';
import s from '../styles';
import Icon from 'react-native-vector-icons/Feather';
import {PRIMARY_COLOR, PRIMARY_TEXT_COLOR} from '../../../../themes/colors';
import {
    BTN_IMAGE_PICKER,
    BTN_SELECTED_IMAGE_PICKER,
} from '../../../../constants';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import hoistStatics from 'hoist-non-react-statics';
import CustomFocusInput from '../../../../components/CustomFocusInput/CustomFocusInput';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-action-sheet';
import ClearButton from '../../../../components/ClearButton/';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const {width} = Dimensions.get('screen');

class MultipleImages extends React.Component {
    constructor(props) {
        super(props);
        const photos = props.navigation.getParam('photos');
        this.state = {
            photos,
        };
    }
    updatePhoto(index, key, value) {
        const {photos} = this.state;
        const new_photos = JSON.parse(JSON.stringify(photos));
        new_photos[index] = {
            ...new_photos[index],
            [key]: value,
            id: null,
        };
        console.log('MultipleImages -> updatePhoto -> new_photos', new_photos);
        this.setState({photos: new_photos});
    }
    goBack() {
        const updatePhotos = this.props.navigation.getParam('updatePhotos');
        updatePhotos(
            this.state.photos?.filter(photo => photo.file || photo.url),
        );
        this.props.navigation.goBack();
    }

    deleteElement(index) {
        const {photos} = this.state;

        this.setState({
            photos: [...photos?.slice(0, index), ...photos?.slice(index + 1)],
        });
    }

    setPhoto = async index_ => {
        const {photos} = this.state;
        let selectedImage = photos[index_]?.file;
        const options = selectedImage
            ? BTN_SELECTED_IMAGE_PICKER
            : BTN_IMAGE_PICKER;

        ActionSheet.showActionSheetWithOptions(
            {
                options,
                tintColor: 'black',
                cancelButtonIndex: options.length - 1,
                ...(selectedImage ? {destructiveButtonIndex: 0} : {}),
            },
            index => {
                switch (selectedImage ? index : index + 1) {
                    case 0: {
                        this.updatePhoto(index_, 'file', null);
                        break;
                    }
                    case 1: {
                        ImagePicker.openPicker({
                            mediaType: 'photo',
                            cropperChooseText: 'Wählen Sie',
                            cropperCancelText: 'Abbrechen',
                        }).then(image => {
                            console.log('btnPressed -> image', image);
                            selectedImage = {
                                uri: image.path,
                                width: image.width,
                                height: image.height,
                                mime: image.mime,
                            };
                            this.updatePhoto(index_, 'file', selectedImage);
                        });
                        break;
                    }
                    case 2: {
                        ImagePicker.openCamera({
                            mediaType: 'photo',
                            cropperChooseText: 'Wählen Sie',
                            cropperCancelText: 'Abbrechen',
                        }).then(image => {
                            selectedImage = {
                                uri: image.path,
                                width: image.width,
                                height: image.height,
                                mime: image.mime,
                            };
                            this.updatePhoto(index_, 'file', selectedImage);
                        });
                        break;
                    }
                }
            },
        );
    };
    render() {
        const {t} = this.props;
        const {photos} = this.state;
        return (
            <View style={s.container}>
                <View style={s.wrapper}>
                    <KeyboardAwareScrollView
                        enableOnAndroid
                        extraScrollHeight={Platform.select({
                            ios: 0,
                            android: 200,
                        })}>
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
                                {t('multipleimages_title')}
                            </Text>
                        </View>
                        <View>
                            {photos.map((item, index) => (
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
                                            {index + 1}. {t('image')}
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
                                                borderBottomColor: '#E5E5E5',
                                                borderBottomWidth: 1,
                                            },
                                        ]}>
                                        <View style={[s.sectionItem]}>
                                            <Text style={s.sectionItemLabel}>
                                                {t('filename')}
                                            </Text>
                                            <CustomFocusInput
                                                style={[
                                                    s.textInput,
                                                    {
                                                        textAlign: 'right',
                                                        marginRight: 10,
                                                    },
                                                ]}
                                                value={item.name}
                                                onChangeText={value => {
                                                    this.updatePhoto(
                                                        index,
                                                        'name',
                                                        value,
                                                    );
                                                }}
                                                placeholder={t(
                                                    'filename_placeholder_title',
                                                )}
                                            />
                                            {item?.name?.length > 0 && (
                                                <ClearButton
                                                    onPress={() => {
                                                        this.updatePhoto(
                                                            index,
                                                            'name',
                                                            null,
                                                        );
                                                    }}
                                                />
                                            )}
                                        </View>
                                        <View
                                            style={[
                                                s.sectionItem,
                                                {borderBottomWidth: 0},
                                            ]}>
                                            <Text style={s.sectionItemLabel}>
                                                {t('filepath')}
                                            </Text>
                                            {item?.file?.uri || item?.url ? (
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        justifyContent:
                                                            'flex-end',
                                                        alignItems: 'center',
                                                        flex: 1,
                                                        marginLeft: 20,
                                                    }}>
                                                    <Text
                                                        numberOfLines={1}
                                                        style={[
                                                            {
                                                                color:
                                                                    '#88919E',
                                                                fontSize: 14,
                                                                marginRight: 5,
                                                                maxWidth: 200,
                                                            },
                                                        ]}>
                                                        {item.file?.uri?.substring(
                                                            item.file?.uri.lastIndexOf(
                                                                '/',
                                                            ) + 1,
                                                        )}
                                                    </Text>
                                                    <ClearButton
                                                        onPress={() => {
                                                            this.updatePhoto(
                                                                index,
                                                                'file',
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
                                                    onPress={() =>
                                                        this.setPhoto(index)
                                                    }>
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
                                        {(item?.file?.uri || item?.url) && (
                                            <Image
                                                source={{
                                                    uri:
                                                        item.url ||
                                                        item.file?.uri,
                                                }}
                                                style={{
                                                    width: width - 50,
                                                    height: width - 50,
                                                    borderRadius: 10,
                                                    marginBottom: 10,
                                                }}
                                            />
                                        )}
                                    </View>
                                </View>
                            ))}
                            <TouchableOpacity
                                style={s.plusbutton}
                                onPress={() => {
                                    this.setState({
                                        photos: [
                                            ...photos,
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
                    </KeyboardAwareScrollView>
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
        withTranslation(['createimpression', 'common'])(MultipleImages),
        MultipleImages,
    ),
);
