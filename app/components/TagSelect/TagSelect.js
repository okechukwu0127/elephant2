import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

import TagSelectItem from './TagSelectItem';

class TagSelect extends React.Component {
    static defaultProps = {
        value: [],

        labelAttr: 'label',
        keyAttr: 'id',

        data: [],

        max: null,

        onMaxError: null,
        onItemPress: null,

        containerStyle: {},
    };

    state = {
        value: {},
    };

    componentDidMount() {
        const value = {};
        this.props.value.forEach(val => {
            value[val[[this.props.keyAttr]] || val] = val;
        });

        this.setState({value});
    }

    /**
     * @description Return the number of items selected
     * @return {Number}
     */
    get totalSelected() {
        return Object.keys(this.state.value).length;
    }

    /**
     * @description Return the items selected
     * @return {Array}
     */
    get itemsSelected() {
        const items = [];

        Object.entries(this.state.value).forEach(([key]) => {
            items.push(this.state.value[key]);
        });

        return items;
    }

    /**
     * @description Callback after select an item
     * @param {Object} item
     * @return {Void}
     */
    handleSelectItem = item => {
        const key = item[this.props.keyAttr] || item;

        const value = {...this.state.value};
        const found = this.state.value[key];

        // Item is on array, so user is removing the selection
        if (found) {
            delete value[key];
        } else {
            // User is adding but has reached the max number permitted
            if (this.props.max && this.totalSelected >= this.props.max) {
                if (this.props.onMaxError) {
                    return this.props.onMaxError();
                }
            }

            value[key] = item;
        }

        return this.setState({value}, () => {
            if (this.props.onItemPress) {
                this.props.onItemPress(value);
            }
            if (this.props.onClickItem) {
                this.props.onClickItem(item);
            }
        });
    };

    render() {
        const {
            selectedItems,
            labelAttr,
            check_subcategory,
            selTags,
            onClickSubCategory,
        } = this.props;
        return (
            <View
                style={[
                    styles.container,
                    this.props.containerStyle,
                    this.props.data?.length === 0
                        ? {
                              justifyContent: 'center',
                          }
                        : {},
                ]}>
                {this.props.data?.length === 0 && (
                    <Text
                        style={{
                            fontFamily: 'Rubik-Regular',
                            color: '#8B8686',
                            fontSize: 14,
                            textAlign: 'center',
                            alignSelf: 'center',
                        }}>
                        Keine Daten verfügbar
                    </Text>
                )}
                {this.props.data.map(i => {
                    let selected =
                        selectedItems && selectedItems.includes(i[labelAttr]);

                    if (check_subcategory && !selected) {
                        let find_cat = null;
                        selTags.map(_parent => {
                            if (
                                find_cat == null &&
                                _parent.sub_categories &&
                                _parent.sub_categories.length > 0
                            ) {
                                find_cat = _parent.sub_categories.find(
                                    _child => _child.id == i.id,
                                );
                            }
                            return _parent;
                        });
                        if (find_cat) {
                            if (find_cat.unchecked) selected = false;
                            else selected = true;
                        } else selected = false;
                    }
                    return (
                        <TagSelectItem
                            {...this.props}
                            label={
                                i[this.props.labelAttr]
                                    ? i[this.props.labelAttr]
                                    : i
                            }
                            key={
                                i[this.props.keyAttr]
                                    ? i[this.props.keyAttr]
                                    : i
                            }
                            onPress={() => {
                                if (
                                    check_subcategory &&
                                    i.parent_category != null
                                ) {
                                    onClickSubCategory && onClickSubCategory(i);
                                } else this.handleSelectItem(i);
                            }}
                            //selected={(this.state.value[i[this.props.keyAttr]] || this.state.value[i]) && true}
                            selected={selected}
                            suffix={
                                this.props.suffix
                                    ? ` (${
                                          i.sub_categories &&
                                          i.sub_categories.length > 0
                                              ? i.sub_categories.length
                                              : 0
                                      })`
                                    : ''
                            }
                        />
                    );
                })}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    },
});

export default TagSelect;
