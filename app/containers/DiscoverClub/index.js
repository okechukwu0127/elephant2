import React, {useState, useEffect} from 'react';
import {
    View,
    ScrollView,
    Text,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {
    PRIMARY_TEXT_COLOR,
    PRIMARY_COLOR,
    GRAY_COLOR,
} from '../../themes/colors';
import {Button} from '../../components';
import s from './styles';
import {SvgUri} from 'react-native-svg';
import {useSelector, useDispatch} from 'react-redux';
import {getAllClubCategories} from '../../reducers/category';

export default function ClubCategoryPicker(props) {
    const {navigation} = props;
    const dispatch = useDispatch();

    const options = useSelector(state => state.category.all_categories);
    const loading = useSelector(state => state.category.loadingAllCategories);
    const selected = navigation.getParam('selected');
    const notMulti = navigation.getParam('notMulti');

    const [checked, setChecked] = useState(
        selected ? (notMulti ? [selected] : selected) : [],
    );
    const [currentCategories, setCurrentCategories] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        dispatch(getAllClubCategories());
    }, []);

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

    let currentOptions =
        currentCategories && currentCategories.length > 0
            ? options?.filter(
                  cat =>
                      cat.parent_category?.id ===
                      currentCategories[currentCategories.length - 1],
              )
            : options?.filter(cat => !cat.parent_category);

    currentOptions = currentOptions.filter(category =>
        category?.name?.toLowerCase()?.includes(searchValue?.toLowerCase()),
    );

    const getReplaceValue = () => {
        if (!notMulti || !navigation.getParam('selected')) return null;
        return navigation.getParam('selected');
    };

    const onPress = () => {
        navigation.navigate('SearchClub', {club_category_id: checked});
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
                                navigation.navigate('MainScreen');
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
                    <Text style={s.title}>Vereine entdecken</Text>
                </View>
                <ScrollView style={{flex: 0.9}}>
                    {currentCategories?.length > 0 &&
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
                            ))}

                    <View style={{alignItems: 'center'}}>
                        <View style={s.inputContainer}>
                            <Icon
                                style={{flex: 0.1}}
                                name="search"
                                size={25}
                                color="#88919E"
                            />
                            <TextInput
                                style={s.input}
                                placeholder="KATEGORIE SUCHEN"
                                value={searchValue}
                                onChangeText={setSearchValue}
                            />
                            {searchValue?.length > 0 && (
                                <TouchableOpacity
                                    onPress={() => setSearchValue('')}
                                    style={{
                                        flex: 0.15,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                    <Icon
                                        name="x"
                                        size={22}
                                        color={GRAY_COLOR}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {!loading ? (
                        <View style={s.section}>
                            {currentOptions &&
                                currentOptions
                                    .sort((a, b) =>
                                        a.name.localeCompare(b.name),
                                    )
                                    .map((category, index) => (
                                        <View key={index} style={s.sectionItem}>
                                            <TouchableOpacity
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent:
                                                        'space-between',
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
                                                        style={
                                                            s.sectionItemLabel
                                                        }>
                                                        {category.name} (
                                                        {category.count_clubs ||
                                                            0}
                                                        )
                                                    </Text>
                                                </View>
                                                {checked.includes(
                                                    category.id,
                                                ) && (
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
                                                                    : [
                                                                          category.id,
                                                                      ],
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
                            {currentOptions?.length === 0 && (
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                    <Text style={s.notFound}>
                                        Keine Kategorie mit diesem Namen
                                        gefunden.
                                    </Text>
                                </View>
                            )}
                        </View>
                    ) : (
                        <ActivityIndicator
                            style={{marginTop: 20}}
                            size="large"
                            color={PRIMARY_COLOR}
                        />
                    )}
                </ScrollView>
                <View
                    style={{
                        flex: 0.13,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingHorizontal: 40,
                    }}>
                    <Button
                        text="WEITER"
                        onPress={onPress}
                        disabled={checked?.length === 0}
                        shadow
                    />
                </View>
            </View>
        </View>
    );
}
