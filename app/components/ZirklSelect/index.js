import React, {useEffect, useState} from 'react';
import {
    View,
    ScrollView,
    Text,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {PRIMARY_TEXT_COLOR, PRIMARY_COLOR} from '../../themes/colors';
import s from './styles';
import {useTranslation} from 'react-i18next';

export default function ZirklSelect(props) {
    const {navigation} = props;

    const title = navigation.getParam('title');
    const multi = navigation.getParam('multi');
    let initialOptions = navigation.getParam('options');
    const optionsGetter = navigation.getParam('optionsGetter');
    const selected = navigation.getParam('selected');
    const onClose = navigation.getParam('onClose');

    const {t} = useTranslation();
    const [checked, setChecked] = useState(
        selected ? (multi ? selected : [selected]) : [],
    );
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialOptions) {
            setOptions(initialOptions);
            return;
        }
        if (!initialOptions && optionsGetter) {
            setLoading(true);
            optionsGetter(res => {
                setOptions(res.map(el => ({value: el.id, label: el.title})));
                setLoading(false);
            });
        }
    }, []);

    const itemClicked = (value, label) => {
        if (checked.includes(value)) {
            const itemIndex = checked.findIndex(el => el === value);
            setChecked([
                ...checked.slice(0, itemIndex),
                ...checked.slice(itemIndex + 1),
            ]);
            return;
        }

        if (multi) setChecked([...checked, value]);
        else {
            onClose(value, label);
            navigation.goBack();
        }
    };

    const getValue = () => {
        if (multi) return checked;
        return checked.length > 0 ? checked[0] : null;
    };

    return (
        <View style={s.container}>
            <View style={s.wrapper}>
                <View style={s.topBar}>
                    <TouchableOpacity
                        onPress={() => {
                            onClose(getValue());
                            navigation.goBack();
                        }}>
                        <Icon
                            name="arrow-left"
                            color={PRIMARY_TEXT_COLOR}
                            size={25}
                            style={{marginRight: 15}}
                        />
                    </TouchableOpacity>
                    <Text style={s.title}>{title}</Text>
                </View>
                {loading ? (
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                    </View>
                ) : (
                    <ScrollView>
                        <Text style={s.sectionName}>{t('selection')}</Text>
                        <View style={s.section}>
                            {options &&
                                options.map((option, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={s.sectionItem}
                                        onPress={() =>
                                            itemClicked(
                                                option.value,
                                                option.label,
                                            )
                                        }>
                                        <Text style={s.sectionItemLabel}>
                                            {option.label}
                                        </Text>
                                        {checked.includes(option.value) && (
                                            <Icon
                                                name="check"
                                                size={24}
                                                color={PRIMARY_COLOR}
                                            />
                                        )}
                                    </TouchableOpacity>
                                ))}
                        </View>
                    </ScrollView>
                )}
            </View>
        </View>
    );
}
