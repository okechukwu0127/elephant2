import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import s from './styles';
import Modal from 'react-native-modal';
import {PRIMARY_COLOR} from '../../themes/colors';
import {withTranslation} from 'react-i18next';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';

class SelectCategory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCategory: null,
            categories: props.categories
                ? props.categories.sort((c1, c2) =>
                      c1.name.toLowerCase() > c2.name.toLowerCase() ? 1 : -1,
                  )
                : [],
            showChildrenID: null,
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.highlighted) {
            const category = nextProps.categories.find(
                c => c.id === nextProps.highlighted,
            );
            if (!category) return null;

            if (!category.parent_category)
                return this.setState({
                    showChildrenID: null,
                    selectedCategory: category,
                    updating: category.id,
                });

            this.setState({
                showChildrenID: category.parent_category.id,
                selectedCategory: null,
                updating: category.id,
            });
        }
    }

    onClose() {
        this.setState({
            selectedCategory: null,
            showChildrenID: null,
        });
        this.props.onClose();
    }

    categoryPressed = id => {
        const {selectedCategory} = this.state;
        if (selectedCategory && selectedCategory.id === id)
            return this.setState({selectedCategory: null});
        const category = this.props.categories.find(c => c.id === id);
        if (!category.sub_categories || category.sub_categories.length === 0)
            return this.setState({selectedCategory: category});

        this.setState({showChildrenID: id});
    };

    goBack = () => {
        const currentShownCategory = this.state.categories.find(
            c => c.id === this.state.showChildrenID,
        );
        if (!currentShownCategory) return;
        this.setState({
            showChildrenID: currentShownCategory.parent_category
                ? currentShownCategory.parent_category.id
                : null,
        });
    };

    render() {
        const {t} = this.props;
        const {categories, selectedCategory, showChildrenID} = this.state;

        const getCurrentCatgoriesList = () => {
            if (showChildrenID) {
                const currentShownCategory = categories.find(
                    c => c.id === showChildrenID,
                );
                if (currentShownCategory)
                    return currentShownCategory.sub_categories;
                else return [];
            }

            return categories.filter(c => !c.parent_category);
        };

        return (
            <Modal
                isVisible={this.props.isVisible}
                onBackButtonPress={() => this.onClose()}
                onBackdropPress={() => this.onClose()}
                onSwipeComplete={() => this.onClose()}
                //swipeDirection={['down']}
                style={s.modal}>
                <View style={s.modalContainer}>
                    <View style={s.modalcloseBtn} />
                    <View>
                        {showChildrenID ? (
                            <TouchableOpacity
                                style={s.header}
                                onPress={this.goBack}>
                                <Icon name="chevron-left" size={30} />
                                <Text style={s.titleCategory}>
                                    {
                                        categories.find(
                                            c => c.id === showChildrenID,
                                        ).name
                                    }
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <Text style={s.title}>{t('select-category')}</Text>
                        )}
                    </View>
                    <ScrollView style={s.scrollView}>
                        {getCurrentCatgoriesList().map(c => (
                            <TouchableOpacity
                                key={c.id + ''}
                                style={[s.pickeritem]}
                                onPress={() => this.categoryPressed(c.id)}>
                                <View style={{flex: 0.8}}>
                                    <Text style={[s.pickerLabel]}>
                                        {c.name}
                                    </Text>
                                </View>
                                <View style={s.iconView}>
                                    {c.sub_categories &&
                                    c.sub_categories.length > 0 ? (
                                        <Icon name="chevron-right" size={24} />
                                    ) : (
                                        selectedCategory &&
                                        c.id === selectedCategory.id && (
                                            <Icon
                                                name="check"
                                                size={24}
                                                color={PRIMARY_COLOR}
                                            />
                                        )
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <TouchableOpacity
                        style={[
                            s.btn,
                            !selectedCategory ? s.disabledBtn : null,
                        ]}
                        disabled={!selectedCategory}
                        onPress={() => {
                            if (selectedCategory) {
                                this.setState({selectedCategory: null});
                                this.props.onSelectCategory(
                                    selectedCategory.id,
                                    this.state.updating,
                                );
                            }
                        }}>
                        <Text style={s.btnLabel}>{t('select')}</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }
}
export default withTranslation(['select-category', 'common'])(SelectCategory);
