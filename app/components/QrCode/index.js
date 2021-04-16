import React from 'react';
import {Dimensions, View, Text} from 'react-native';
import s from './styles';
import Modal from 'react-native-modal';
import QRCode from 'react-native-qrcode-svg';
import {PRIMARY_COLOR} from '../../themes/colors';

const {width} = Dimensions.get('window');

class QrCode extends React.Component {
    render() {
        const {club} = this.props;
        return (
            <Modal
                isVisible={this.props.isVisible}
                onBackButtonPress={() => this.props.onClose()}
                onBackdropPress={() => this.props.onClose()}
                onSwipeComplete={() => this.props.onClose()}
                swipeDirection={['down']}
                style={s.modal}>
                <View style={s.modalContainer}>
                    <View style={s.modalcloseBtn} />
                    <QRCode
                        value={`zirkl://club/${club?.id}`}
                        size={width / 2}
                        color={PRIMARY_COLOR}
                        backgroundColor="white"
                    />
                    <Text style={s.title}>{club.name}</Text>
                </View>
            </Modal>
        );
    }
}

export default QrCode;
