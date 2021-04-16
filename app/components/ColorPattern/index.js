import React from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';
import s from './styles';
import Modal from 'react-native-modal';
import {COLOR_PATTERN} from '../../constants';
import {withTranslation} from 'react-i18next';

class ColorPattern extends React.Component {
    render() {
        const {t, isVisible, onClose, onChooseColor} = this.props;
        return (
            <Modal
                isVisible={isVisible}
                onBackButtonPress={() => onClose()}
                //onBackdropPress={() => this.props.onClose()}
                onSwipeComplete={() => onClose()}
                swipeDirection={['down']}
                style={s.modal}>
                <View style={s.modalContainer}>
                    <View style={s.modalContent}>
                        <Text style={s.colorText}>{t('title')}</Text>
                        <View style={s.colorPanel}>
                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity
                                    style={[
                                        s.colorItem,
                                        {backgroundColor: COLOR_PATTERN[0]},
                                    ]}
                                    onPress={() =>
                                        onChooseColor(COLOR_PATTERN[0])
                                    }
                                />
                                <TouchableOpacity
                                    style={[
                                        s.colorItem,
                                        {backgroundColor: COLOR_PATTERN[1]},
                                    ]}
                                    onPress={() =>
                                        onChooseColor(COLOR_PATTERN[1])
                                    }
                                />
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity
                                    style={[
                                        s.colorItem,
                                        {backgroundColor: COLOR_PATTERN[2]},
                                    ]}
                                    onPress={() =>
                                        onChooseColor(COLOR_PATTERN[2])
                                    }
                                />
                                <TouchableOpacity
                                    style={[
                                        s.colorItem,
                                        {backgroundColor: COLOR_PATTERN[3]},
                                    ]}
                                    onPress={() =>
                                        onChooseColor(COLOR_PATTERN[3])
                                    }
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

export default withTranslation('colorpattern')(ColorPattern);
