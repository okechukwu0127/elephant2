import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {
    BACKGROUND_COLOR,
    PRIMARY_COLOR,
    GRAY_COLOR,
} from '../../../../themes/colors';
import Icon from 'react-native-vector-icons/Feather';
import s from './styles';
export default function ReachPicker({
    countries,
    cantons,
    districts,
    municipalities,
    getCountries,
    getCantons,
    getDistricts,
    getMunicipalitiesOfCities,
    t,
    onClose,
    currentReach,
}) {
    const [selectedCountries, setSelectedCountries] = useState(
        currentReach ? currentReach.countries : [],
    );
    const [selectedCantons, setSelectedCantons] = useState(
        currentReach ? currentReach.cantons : [],
    );
    const [selectedDistricts, setSelectedDistricts] = useState(
        currentReach ? currentReach.districts : [],
    );
    const [selectedMunicipalities, setSelectedMunicipalities] = useState(
        currentReach ? currentReach.municipalities : [],
    );

    const [currentEntity, setCurrentEntity] = useState(null);

    const entityTypes = ['country', 'canton', 'district', 'municipality'];

    useEffect(() => {
        // if (!countries || countries.length === 0) getCountries();
    }, []);

    useEffect(() => {
        console.log('currentEntity', currentEntity);
        if (currentEntity && currentEntity.type === 'country') getCantons();
        else if (currentEntity && currentEntity.type === 'canton')
            getDistricts(currentEntity.id);
        else if (currentEntity && currentEntity.type === 'district')
            getMunicipalitiesOfCities([currentEntity.id]);
    }, [currentEntity]);

    const getValueAndSetter = type => {
        let values, setter;
        switch (type) {
            case 'country':
                values = selectedCountries;
                setter = setSelectedCountries;
                break;
            case 'canton':
                values = selectedCantons;
                setter = setSelectedCantons;
                break;
            case 'district':
                values = selectedDistricts;
                setter = setSelectedDistricts;
                break;
            case 'municipality':
                values = selectedMunicipalities;
                setter = setSelectedMunicipalities;
                break;

            default:
                values = [];
                setter = () => {};
                break;
        }

        return {values, setter};
    };

    const select = (id, type) => {
        let {values, setter} = getValueAndSetter(type);
        if (values.includes(id)) {
            const itemIndex = values.findIndex(el => el === id);
            setter([
                ...values.slice(0, itemIndex),
                ...values.slice(itemIndex + 1),
            ]);
            return;
        }
        setter([...values, id]);
        if (type === 'country') {
            setSelectedCantons([]);
            setSelectedDistricts([]);
            setSelectedMunicipalities([]);
        }
    };

    const getCurrentOptions = () => {
        if (!currentEntity)
            return [
                {
                    id: 1,
                    name: 'Schweiz',
                    type: 'country',
                    child_count: 20,
                },
            ];
        let result;
        switch (currentEntity.type) {
            case 'country':
                result = cantons.map(option => ({
                    id: option.id,
                    name: option.name,
                    child_count: option.child_count,
                    type: 'canton',
                }));
                break;
            case 'canton':
                result = districts;
                break;
            case 'district':
                result = municipalities;
                break;

            default:
                result = cantons;
                break;
        }
        return result.map(option => ({
            id: option.id,
            name: option.name,
            child_count: option.child_count,
            type:
                entityTypes[
                    entityTypes.findIndex(el => el === currentEntity.type) + 1
                ],
        }));
    };

    const onSave = () => {
        onClose({
            countries: selectedCountries,
            cantons: selectedCantons,
            districts: selectedDistricts,
            municipalities: selectedMunicipalities,
        });
    };

    const allCurrentEntities = () => {
        const result = [];
        let cursor = currentEntity;
        while (cursor) {
            result.push(cursor);
            cursor = cursor.parentEntity;
        }
        return result.reverse();
    };

    const currentOptions = getCurrentOptions();

    const disableButton =
        selectedCountries?.length === 0 &&
        selectedCantons?.length === 0 &&
        selectedDistricts?.length === 0 &&
        selectedMunicipalities?.length === 0;

    return (
        <View style={{backgroundColor: BACKGROUND_COLOR, flex: 1}}>
            <View
                style={{
                    marginTop: 20,
                    paddingHorizontal: 30,
                    backgroundColor: BACKGROUND_COLOR,
                }}>
                <TouchableOpacity
                    onPress={() => setCurrentEntity(null)}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                    <Text style={{fontSize: 18, fontFamily: 'Rubik-Regular'}}>
                        Europa
                    </Text>
                    {!currentEntity && (
                        <Text
                            style={{fontSize: 16, fontFamily: 'Rubik-Regular'}}>
                            1 Land
                        </Text>
                    )}
                </TouchableOpacity>
                {allCurrentEntities().map((entity, i) => (
                    <TouchableOpacity
                        onPress={() => setCurrentEntity(entity)}
                        key={i}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                        <Text
                            style={{fontSize: 18, fontFamily: 'Rubik-Regular'}}>
                            {entity.name}
                        </Text>
                        {currentEntity.id === entity.id &&
                            currentEntity.type === entity.type && (
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontFamily: 'Rubik-Regular',
                                    }}>
                                    {currentOptions &&
                                        currentOptions.length &&
                                        `${currentOptions.length} ${t(
                                            entityTypes[
                                                entityTypes.findIndex(
                                                    el =>
                                                        el ===
                                                        currentEntity.type,
                                                ) + 1
                                            ],
                                        )}`}
                                </Text>
                            )}
                    </TouchableOpacity>
                ))}
            </View>
            <ScrollView style={s.section}>
                {currentOptions.map((entity, index) => (
                    <View key={index} style={s.sectionItem}>
                        <TouchableOpacity
                            style={s.itemTouch}
                            onPress={() => {
                                select(entity.id, entity.type);
                            }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                <Text style={s.sectionItemLabel}>
                                    {entity.name}
                                </Text>
                            </View>
                            {getValueAndSetter(entity.type).values.includes(
                                entity.id,
                            ) ? (
                                <Icon
                                    name="check"
                                    size={24}
                                    color={PRIMARY_COLOR}
                                />
                            ) : entity.type !== entityTypes[3] &&
                              entity.child_count > 0 ? (
                                <TouchableOpacity
                                    onPress={() => {
                                        setCurrentEntity({
                                            type: entity.type,
                                            id: entity.id,
                                            name: entity.name,
                                            parentEntity: currentEntity,
                                        });
                                    }}>
                                    <Icon
                                        name="chevron-right"
                                        size={24}
                                        color={GRAY_COLOR}
                                    />
                                </TouchableOpacity>
                            ) : null}
                        </TouchableOpacity>
                    </View>
                ))}
                {currentOptions?.length === 0 && (
                    <Text
                        style={{
                            fontFamily: 'Rubik-Regular',
                            fontSize: 14,
                            color: GRAY_COLOR,
                            textAlign: 'center',
                            marginTop: 10,
                        }}>
                        Keine Ergebnisse gefunden
                    </Text>
                )}
            </ScrollView>
            <View
                style={{
                    flex: 0.1,
                    justifyContent: 'center',
                    backgroundColor: BACKGROUND_COLOR,
                    paddingHorizontal: 15,
                    paddingBottom: 10,
                }}>
                <TouchableOpacity
                    disabled={disableButton}
                    style={s.nextBtn}
                    onPress={onSave}>
                    <Text
                        style={[
                            s.nextBtnLabel,
                            disableButton
                                ? {
                                      color: GRAY_COLOR,
                                  }
                                : {},
                        ]}>
                        {t('save_reach')}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
