import React from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
    Text,
    Platform,
    TouchableOpacity,
    TextInput,
    FlatList,
} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';
import FeatherIcon from 'react-native-vector-icons/Feather';
import CheckBox from 'react-native-check-box';
import {
    BACKGROUND_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
} from '../../themes/colors';
import {searchWithKeyword} from '../../utils/utils';
import {withTranslation} from 'react-i18next';

class SelectSubCategory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            unchecked: [],
            keyword: null,
        };
    }
    onStateClose() {
        this.props.onClose();
        this.setState({unchecked: []});
    }
    UNSAFE_componentWillReceiveProps(nextprops) {
        if (nextprops.isVisible && !this.props.isVisible) {
            const {category} = nextprops;
            if (
                category &&
                category.sub_categories &&
                category.sub_categories.length > 0
            ) {
                this.setState({
                    unchecked: category.sub_categories
                        .filter((item) => item.unchecked)
                        .map((item) => item.id),
                });
            }
        }
    }
    render() {
        const {t, isVisible, category, onSave} = this.props;
        const {unchecked, keyword} = this.state;
        const sub_categories =
            category && category.sub_categories
                ? searchWithKeyword(category.sub_categories, keyword, 'name')
                : [];

        return (
            <Modal
                isVisible={isVisible}
                onBackButtonPress={() => this.onStateClose()}
                onBackdropPress={() => this.onStateClose()}
                onSwipeComplete={() => this.onStateClose()}
                swipeDirection={['down']}
                style={s.modal}
                backdropTransitionInTiming={0}
                backdropTransitionOutTiming={0}
                animationIn="fadeIn"
                animationOut="fadeOut">
                <View style={s.modalContainer}>
                    <View style={s.modalcloseBtn} />
                    <View style={s.header}>
                        <View>
                            <Text style={s.catName}>
                                {category && category.name}
                            </Text>
                            <Text style={s.subCategory}>
                                {t('subcategories')}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={s.allcheckBtn}
                            onPress={() => {
                                this.setState({unchecked: []});
                            }}>
                            <Text style={s.allcheckBtnLabel}>
                                {t('selectall')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={s.inputContainer}>
                        <FeatherIcon
                            name="search"
                            size={20}
                            color="#88919E"
                            style={s.inputIcon}
                        />
                        <TextInput
                            style={s.input}
                            placeholder={t('search')}
                            placeholderTextColor={'#88919E'}
                            returnKeyType="search"
                            value={keyword}
                            onChangeText={(keyword) => this.setState({keyword})}
                        />
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <FlatList
                            style={{flex: 1, width: '100%'}}
                            data={sub_categories}
                            renderItem={({item}) => {
                                const isChecked = !unchecked.includes(item.id);
                                return (
                                    <CheckBox
                                        style={{
                                            flex: 0.5,
                                            paddingVertical: 5,
                                            marginVertical: 0,
                                        }}
                                        onClick={() => {
                                            if (!isChecked) {
                                                this.setState({
                                                    unchecked: unchecked.filter(
                                                        (value) =>
                                                            value != item.id,
                                                    ),
                                                });
                                            } else {
                                                this.setState({
                                                    unchecked: [
                                                        ...unchecked,
                                                        item.id,
                                                    ],
                                                });
                                            }
                                        }}
                                        isChecked={isChecked}
                                        rightText={item.name}
                                        checkBoxColor={PRIMARY_TEXT_COLOR}
                                        checkedCheckBoxColor={PRIMARY_COLOR}
                                        rightTextStyle={
                                            isChecked
                                                ? s.activecheckboxText
                                                : s.checkboxText
                                        }
                                    />
                                );
                            }}
                            keyExtractor={(item, index) => item.id + ''}
                            numColumns={2}
                        />
                    </View>
                    <TouchableOpacity
                        style={s.okbtn}
                        onPress={() => {
                            onSave(
                                {
                                    ...category,
                                    sub_categories: category.sub_categories
                                        ? category.sub_categories.map(
                                              (subitem) => {
                                                  return {
                                                      ...subitem,
                                                      unchecked: unchecked.includes(
                                                          subitem.id,
                                                      ),
                                                  };
                                              },
                                          )
                                        : [],
                                },
                                category.sub_categories.length ===
                                    unchecked.length,
                            );
                            this.onStateClose();
                        }}>
                        <Text style={s.okbtnLabel}>{t('btnok')}</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }
}

export default withTranslation('selectsubcategory')(SelectSubCategory);
