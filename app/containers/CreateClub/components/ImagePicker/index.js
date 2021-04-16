import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {PRIMARY_COLOR} from '../../../../themes/colors';
import ClearButton from '../../../../components/ClearButton';
import Icon from 'react-native-vector-icons/Feather';
import ActionSheet from 'react-native-action-sheet';
import {default as ImagePicker_} from 'react-native-image-crop-picker';
import {
    BTN_IMAGE_PICKER,
    BTN_SELECTED_IMAGE_PICKER,
} from '../../../../constants';
import {AvatarImage} from '../../../../components';

export default function ImagePicker({
    label,
    setSelectedImage,
    borderBottom,
    selectedImage,
}) {
    const btnPressed = () => {
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
                        setSelectedImage(null);
                        break;
                    }
                    case 1: {
                        ImagePicker_.openPicker({
                            width: 300,
                            height: 300,
                            cropping: true,
                            cropperCircleOverlay: true,
                            mediaType: 'photo',
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
                    case 2: {
                        ImagePicker_.openCamera({
                            width: 300,
                            height: 300,
                            cropping: true,
                            cropperCircleOverlay: true,
                            mediaType: 'photo',
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

    return (
        <View
            style={{
                flexDirection: 'row',
                borderBottomWidth: borderBottom ? 1 : 0,
                borderBottomColor: '#C8C7CC',
                paddingVertical: 12,
                height: 50,
            }}>
            {selectedImage ? (
                <>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: '100%',
                            alignItems: 'center',
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                            <AvatarImage source={selectedImage} width={40} />
                            <Text
                                numberOfLines={1}
                                style={{
                                    fontFamily: 'Rubik-Regular',
                                    fontSize: 16,
                                    marginLeft: 15,
                                    maxWidth: '75%',
                                }}>
                                {selectedImage &&
                                    selectedImage.uri &&
                                    selectedImage.uri.includes('/') &&
                                    selectedImage.uri.split('/')[
                                        selectedImage.uri.split('/').length - 1
                                    ]}
                            </Text>
                        </View>
                        <View>
                            <ClearButton
                                onPress={() => {
                                    setSelectedImage(null);
                                }}
                            />
                        </View>
                    </View>
                </>
            ) : (
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                    }}>
                    <Text
                        style={{
                            fontFamily: 'Rubik-Regular',
                            fontSize: 16,
                        }}>
                        {label}
                    </Text>
                    <TouchableOpacity onPress={btnPressed}>
                        <Icon name={'plus'} size={23} color={PRIMARY_COLOR} />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}
