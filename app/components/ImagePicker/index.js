import React, {useState} from 'react';
import {
    View,
    ScrollView,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {PRIMARY_TEXT_COLOR, PRIMARY_COLOR} from '../../themes/colors';
import s from './styles';
import {useTranslation} from 'react-i18next';
import {BTN_IMAGE_PICKER, BTN_SELECTED_IMAGE_PICKER} from '../../constants';
import ActionSheet from 'react-native-action-sheet';
import {default as ImagePicker_} from 'react-native-image-crop-picker';

const ratios = ['16:9', '4:3', '3:4', '1:1'];
const width = Dimensions.get('screen').width;

export default function ImagePicker(props) {
    const {navigation} = props;

    const title = navigation.getParam('title');
    const selected = navigation.getParam('selected');
    const onClose = navigation.getParam('onClose');

    const {t} = useTranslation('imagepicker');
    const [selectedRatio, setSelectedRatio] = useState('1:1');
    const [selectedImage, setSelectedImage] = useState(selected);
    console.log('ImagePicker -> selectedImage', selectedImage);

    const getCurrentRatio = () =>
        Number(selectedRatio.split(':')[1]) /
        Number(selectedRatio.split(':')[0]);

    const btnPressed = () => {
        const options = selectedImage
            ? BTN_SELECTED_IMAGE_PICKER
            : BTN_IMAGE_PICKER;

        ActionSheet.showActionSheetWithOptions(
            {
                options: options.filter((el, i) => i !== 3),
                tintColor: 'black',
                cancelButtonIndex: options.length - 1,
                ...(selectedImage ? {destructiveButtonIndex: 0} : {}),
            },
            index => {
                switch (selectedImage ? index : index + 1) {
                    case 0: {
                        setSelectedImage(null);
                        break;
                    }
                    case 1: {
                        ImagePicker_.openPicker({
                            mediaType: 'photo',
                            width,
                            height: width * getCurrentRatio(),
                            cropperChooseText: 'Wählen Sie',
                            cropperCancelText: 'Abbrechen',
                        }).then(image => {
                            console.log(
                                'btnPressed -> getCurrentRatio',
                                getCurrentRatio(),
                            );
                            console.log('btnPressed -> image', image);
                            setSelectedImage({
                                uri: image.path,
                                width: image.width,
                                height: image.height,
                                mime: image.mime,
                            });
                        });
                        break;
                    }
                    case 2: {
                        ImagePicker_.openCamera({
                            mediaType: 'photo',
                            width,
                            height: width * getCurrentRatio(),
                            cropperChooseText: 'Wählen Sie',
                            cropperCancelText: 'Abbrechen',
                        }).then(image => {
                            setSelectedImage({
                                uri: image.path,
                                width: image.width,
                                height: image.height,
                                mime: image.mime,
                            });
                        });
                        break;
                    }
                }
            },
        );
    };

    const itemClicked = ratio => {
        setSelectedRatio(ratio);
    };
    return (
        <View style={s.container}>
            <View style={s.wrapper}>
                <View style={s.topBar}>
                    <TouchableOpacity
                        onPress={() => {
                            onClose(selectedImage);
                            navigation.goBack();
                        }}>
                        <Icon
                            name="arrow-left"
                            color={PRIMARY_TEXT_COLOR}
                            size={25}
                            style={{marginRight: 15}}
                        />
                    </TouchableOpacity>
                    <Text style={s.title}>{title}</Text>
                </View>
                <ScrollView>
                    {/* <Text style={s.sectionName}>{t('aspect-ratio')}</Text>
                    <View style={s.section}>
                        {ratios.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                style={s.sectionItem}
                                onPress={() => itemClicked(option)}>
                                <Text style={s.sectionItemLabel}>{option}</Text>
                                {selectedRatio === option && (
                                    <Icon
                                        name="check"
                                        size={24}
                                        color={PRIMARY_COLOR}
                                    />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View> */}

                    <Text style={s.sectionName}>{t('preview')}</Text>
                    <View style={s.section}>
                        {selectedImage && (
                            <Image
                                source={
                                    selectedImage?.original
                                        ? {uri: selectedImage?.original}
                                        : selectedImage
                                }
                                style={{
                                    resizeMode: 'contain',
                                    width: width - 50,
                                    height: (width - 50) * getCurrentRatio(),
                                    borderRadius: 12,
                                }}
                            />
                        )}

                        <TouchableOpacity
                            style={[
                                s.button,
                                {
                                    backgroundColor: PRIMARY_COLOR,
                                    marginTop: 50,
                                },
                            ]}
                            onPress={btnPressed}>
                            <Text style={s.btnLabel}>
                                {t(
                                    selectedImage
                                        ? 'change-image'
                                        : 'select-image',
                                )}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}
