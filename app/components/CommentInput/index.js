import React from 'react';
import {
    Dimensions,
    TextInput,
    View,
    Text,
    Platform,
    TouchableOpacity,
} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';
import {
    BACKGROUND_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
} from '../../themes/colors';
import {withTranslation} from 'react-i18next';

class CommentInput extends React.Component {
    state = {
        comment: undefined,
    };
    onClose() {
        this.setState({comment: undefined});
        this.props.onClose();
    }
    render() {
        const {t, onSubmit} = this.props;
        return (
            <Modal
                isVisible={this.props.isVisible}
                onBackButtonPress={() => this.onClose()}
                onBackdropPress={() => this.onClose()}
                onSwipeComplete={() => this.onClose()}
                swipeDirection={['down']}
                style={s.modal}
                avoidKeyboard>
                <View style={s.modalContainer}>
                    <Text style={s.title}>{t('title')}</Text>
                    <TextInput
                        style={s.textarea}
                        multiline
                        value={this.state.comment}
                        onChangeText={(comment) => this.setState({comment})}
                    />
                    <TouchableOpacity
                        style={s.confirmBtn}
                        onPress={async () => {
                            const {comment} = this.state;
                            if (
                                comment &&
                                comment.length > 0 &&
                                comment.trim().length > 0
                            ) {
                                onSubmit(comment);
                                this.onClose();
                            }
                        }}>
                        <Text style={s.confirmBtnLabel}>{t('submit')}</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }
}
export default withTranslation('commentform')(CommentInput);
