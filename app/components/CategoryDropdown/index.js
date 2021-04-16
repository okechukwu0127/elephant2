import React from 'react';
import {
    TextInput,
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import s, {fab_width} from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {
    BACKGROUND_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
} from '../../themes/colors';
import Overlay from 'react-native-modal-overlay';
import styles from './styles';
import {connect} from 'react-redux';
import {createCategoriesForNewsEvent} from '../../reducers/category';

const {width, height} = Dimensions.get('window');

class CategoryDropdown extends React.Component {
    state = {
        newDropValue: '',
        loading: false,
    };
    onClose() {
        this.setState({newDropValue: ''});
        this.props.onClose();
    }
    render() {
        const {visible, club_id, data, onSelectCategory} = this.props;
        const {loading} = this.state;
        return (
            <Overlay
                visible={visible}
                closeOnTouchOutside
                animationType="zoomIn"
                containerStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 0,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                childrenWrapperStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    padding: 0,
                    justifyContent: 'center',
                }}
                onClose={() => this.onClose()}
                supportedOrientations={['portrait', 'landscape']}>
                <View
                    style={{
                        backgroundColor: 'white',
                        width: width - 80,
                        padding: 10,
                    }}>
                    <View style={styles.addContent}>
                        <TextInput
                            placeholder="Kategorie erfassen"
                            style={styles.addInput}
                            numberOfLines={1}
                            onChangeText={newDropValue =>
                                this.setState({newDropValue})
                            }
                            value={this.state.newDropValue}
                            onEndEditing={() => {
                                if (this.state.newDropValue) {
                                    this.setState({loading: true});
                                    this.props.createCategoriesForNewsEvent(
                                        club_id,
                                        this.state.newDropValue,
                                        res => {
                                            if (res)
                                                this.setState({
                                                    loading: false,
                                                    newDropValue: '',
                                                });
                                            else
                                                this.setState({loading: false});
                                        },
                                    );
                                }
                            }}
                        />
                        {loading ? (
                            <ActivityIndicator color={PRIMARY_COLOR} />
                        ) : (
                            <Icon
                                name="plus"
                                type="font-awesome"
                                color={PRIMARY_COLOR}
                                size={20}
                                onPress={() => {
                                    if (this.state.newDropValue) {
                                        this.setState({loading: true});
                                        this.props.createCategoriesForNewsEvent(
                                            club_id,
                                            this.state.newDropValue,
                                            res => {
                                                if (res)
                                                    this.setState({
                                                        loading: false,
                                                        newDropValue: '',
                                                    });
                                                else
                                                    this.setState({
                                                        loading: false,
                                                    });
                                            },
                                        );
                                    }
                                }}
                            />
                        )}
                    </View>
                    <FlatList
                        keyExtractor={(item, index) => item.id + ''}
                        data={
                            data
                                ? data.sort((a, b) =>
                                      a.name.localeCompare(b.name),
                                  )
                                : []
                        }
                        ListEmptyComponent={() => (
                            <Text style={s.noData}>
                                Noch keine Kategorie definiert
                            </Text>
                        )}
                        renderItem={({item}) => {
                            return (
                                <TouchableOpacity
                                    style={styles.dropItem}
                                    onPress={() => {
                                        onSelectCategory(item);
                                    }}>
                                    <Text style={styles.dropText}>
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>
            </Overlay>
        );
    }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {
    createCategoriesForNewsEvent,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(CategoryDropdown);
