import React, {useState} from 'react';
import {View, ScrollView, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {
    PRIMARY_TEXT_COLOR,
    PRIMARY_COLOR,
    GRAY_COLOR,
} from '../../themes/colors';
import s from './styles';
import {SvgUri} from 'react-native-svg';

export default function ClubCategoryPicker(props) {
    const {navigation} = props;

    const options = navigation.getParam('options');
    const selected = navigation.getParam('selected');
    const onClose = navigation.getParam('onClose');
    const notMulti = navigation.getParam('notMulti');

    const [checked, setChecked] = useState(
        selected ? (notMulti ? [selected] : selected) : [],
    );
    const [currentCategories, setCurrentCategories] = useState([]);

    const selectCategory = id => {
        if (checked.includes(id)) {
            const itemIndex = checked.findIndex(el => el === id);
            setChecked([
                ...checked.slice(0, itemIndex),
                ...checked.slice(itemIndex + 1),
            ]);
            return;
        }
        setChecked(notMulti ? [id] : [...checked, id]);
    };

    const currentOptions =
        currentCategories && currentCategories.length > 0
            ? options?.filter(
                  cat =>
                      cat.parent_category &&
                      cat.parent_category.id ===
                          currentCategories[currentCategories.length - 1],
              )
            : options?.filter(cat => !cat.parent_category);

    const getReplaceValue = () => {
        if (!notMulti || !navigation.getParam('selected')) return null;
        return navigation.getParam('selected');
    };

    const getCategoryLogo = category => {
        if (
            category?.logo?.original &&
            category?.logo?.original?.includes('.svg')
        ) {
            return category?.logo?.original;
        }
        if (category.parent_category) {
            return getCategoryLogo(category.parent_category);
        }
        return null;
    };

    return (
        <View style={s.container}>
            <View style={s.wrapper}>
                <View style={s.topBar}>
                    <TouchableOpacity
                        onPress={() => {
                            if (
                                !currentCategories ||
                                !currentCategories.length
                            ) {
                                onClose(checked, getReplaceValue());
                                navigation.navigate(
                                    navigation.getParam('backTo')
                                        ? navigation.getParam('backTo')
                                        : 'ClubEditInfo',
                                );
                            } else {
                                if (currentCategories.length > 1)
                                    setCurrentCategories(
                                        currentCategories.slice(
                                            0,
                                            currentCategories.length - 1,
                                        ),
                                    );
                                else setCurrentCategories(currentCategories[0]);
                            }
                        }}>
                        <Icon
                            name={
                                !currentCategories || !currentCategories.length
                                    ? 'arrow-left'
                                    : 'arrow-up'
                            }
                            color={PRIMARY_TEXT_COLOR}
                            size={25}
                            style={{marginRight: 15}}
                        />
                    </TouchableOpacity>
                    <Text style={s.title}>Kategorie bestimmen</Text>
                </View>
                <ScrollView>
                    {currentCategories && currentCategories.length > 0 ? (
                        currentCategories
                            .map(el => options.find(e => e.id == el))
                            .map((currentCat, index) => (
                                <View
                                    key={index}
                                    style={{
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginBottom: 10,
                                    }}>
                                    <Text style={s.sectionName}>
                                        {currentCat?.name}
                                    </Text>
                                    {currentCategories &&
                                        checked.includes(currentCat?.id) && (
                                            <Icon
                                                name="check"
                                                size={24}
                                                color={PRIMARY_COLOR}
                                                style={{
                                                    marginRight: 10,
                                                }}
                                            />
                                        )}
                                </View>
                            ))
                    ) : (
                        <View
                            style={{
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}>
                            <Text style={s.sectionName}>Hauptkategorien</Text>
                        </View>
                    )}

                    <View style={s.section}>
                        {currentOptions &&
                            currentOptions
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((category, index) => (
                                    <View key={index} style={s.sectionItem}>
                                        <TouchableOpacity
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                flex: 1,
                                            }}
                                            onPress={() =>
                                                selectCategory(category.id)
                                            }>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                }}>
                                                <View
                                                    style={{
                                                        width: 40,
                                                        height: 40,
                                                    }}>
                                                    <SvgUri
                                                        width="40"
                                                        height="40"
                                                        uri={getCategoryLogo(
                                                            category,
                                                        )}
                                                    />
                                                </View>
                                                <Text
                                                    style={s.sectionItemLabel}>
                                                    {category.name}
                                                </Text>
                                            </View>
                                            {checked.includes(category.id) && (
                                                <Icon
                                                    name="check"
                                                    size={24}
                                                    color={PRIMARY_COLOR}
                                                />
                                            )}
                                        </TouchableOpacity>
                                        {category.sub_categories &&
                                            category.sub_categories.length >
                                                0 && (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        setCurrentCategories(
                                                            currentCategories &&
                                                                currentCategories.length >
                                                                    0
                                                                ? [
                                                                      ...currentCategories,
                                                                      category.id,
                                                                  ]
                                                                : [category.id],
                                                        )
                                                    }
                                                    style={{flex: 0.1}}>
                                                    <Icon
                                                        name="chevron-right"
                                                        size={24}
                                                        color={GRAY_COLOR}
                                                    />
                                                </TouchableOpacity>
                                            )}
                                    </View>
                                ))}
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}
