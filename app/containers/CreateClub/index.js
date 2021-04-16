import React from 'react';
import {View, TouchableOpacity, Text, ScrollView} from 'react-native';

import {TabView} from 'react-native-tab-view';
import s from './styles';
import {
    BACKGROUND_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
} from '../../themes/colors';
import {connect} from 'react-redux';
import {
    createClub,
    getClubProfile,
    getClub,
    getContinents,
    getCountriesByContinent,
    getCantons,
    getDistricts,
    getMunicipalitiesOfCities,
} from '../../reducers/club';
import Spinner from 'react-native-loading-spinner-overlay';
import hoistStatics from 'hoist-non-react-statics';
import {withTranslation} from 'react-i18next';
import {CloseButton} from '../../components';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {getExtFromMime, showMessage} from '../../utils/utils';
import Field from './components/Field';
import ImagePicker from './components/ImagePicker';
import ReachPicker from './components/ReachPicker';
import HomePlusIcon from '../../components/HomePlusIcon';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

const Container = props => {
    return (
        <KeyboardAwareScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
                flex: 1,
                backgroundColor: BACKGROUND_COLOR,
            }}>
            <View style={{flex: 1, backgroundColor: BACKGROUND_COLOR}}>
                <View
                    style={
                        props.fullHeight
                            ? {flex: 1, backgroundColor: BACKGROUND_COLOR}
                            : {backgroundColor: BACKGROUND_COLOR}
                    }>
                    {props.children}
                </View>
                {!props.showReachPicker && (
                    <View
                        style={[
                            {
                                justifyContent: 'center',
                                backgroundColor: BACKGROUND_COLOR,
                                paddingHorizontal: 15,
                                paddingVertical: 10,
                                marginTop: 20,
                            },
                            props.fullHeight ? {flex: 0.1} : {},
                        ]}>
                        <TouchableOpacity
                            style={s.nextBtn}
                            onPress={props.onNext}>
                            <Text style={s.nextBtnLabel}>
                                {props.isLast
                                    ? props.t('create-club')
                                    : props.t('next')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </KeyboardAwareScrollView>
    );
};

const RouteClubName = props => {
    return (
        <View style={s.scene} key={props.route.key}>
            <Text style={s.sceneTitle}>Basisinformation</Text>
            <View style={s.sceneFields}>
                <Field
                    label="Offizieller Name *"
                    onChange={clubName => {
                        props.changeClubInfo('clubName', clubName);
                    }}
                    value={props.clubName}
                    borderBottom
                />
                <Field
                    label="Abkürzung"
                    onChange={abbr => {
                        props.changeClubInfo('abbr', abbr);
                    }}
                    value={props.abbr}
                    borderBottom
                />
                <ImagePicker
                    label="Vereinslogo"
                    selectedImage={props.clubImage}
                    setSelectedImage={props.setSelectedImage}
                />
            </View>
        </View>
    );
};

const RouteClubDesc = props => {
    return (
        <View style={s.scene} key={props.route.key}>
            <Text style={s.sceneTitle}>Kurzbeschreibung</Text>
            <View style={s.sceneFields}>
                <Field
                    multiline
                    label=""
                    onChange={clubDesc => {
                        props.changeClubInfo('clubDesc', clubDesc);
                    }}
                    value={props.clubDesc}
                />
            </View>
        </View>
    );
};

const RouteClubContact = props => {
    return (
        <View style={s.scene} key={props.route.key}>
            <Text style={s.sceneTitle}>Kontakt</Text>
            <View style={s.sceneFields}>
                <Field
                    label="E-Mail *"
                    onChange={mail => {
                        props.changeClubInfo('mail', mail);
                    }}
                    value={props.email}
                    borderBottom
                    noCaps
                    inputType="email-address"
                />
                <Field
                    label="Webseite"
                    onChange={val => {
                        props.changeClubInfo('website', val);
                    }}
                    value={props.website}
                    borderBottom
                    noCaps
                    inputType="url"
                />
                <Field
                    label="Sitz/Ort *"
                    onChange={val => {
                        props.changeClubInfo('ort', val);
                    }}
                    value={props.city}
                />
            </View>
        </View>
    );
};

const RouteClubCategories = props => {
    return (
        <ScrollView style={s.scene} key={props.route.key}>
            <Text
                style={{
                    fontFamily: 'Rubik-Regular',
                    fontSize: 14,
                    color: PRIMARY_TEXT_COLOR,
                    paddingHorizontal: 25,
                    marginBottom: 10,
                }}>
                Kategorien helfen den Nutzern, nach Vereinen mit ihren
                Interessen zu suchen. Mehrere Kategorien sind möglich, z.B.
                “Spanischer Fussballverein”: Bevölkerungsgruppe: Spanien und
                Sport: Fussball.
            </Text>
            <Text style={s.sceneTitle}>Kategorien</Text>
            <View style={s.sceneFields}>
                {props.selectedCategories
                    ?.filter(
                        id => !!props.categories.find(cat => cat.id === id),
                    )
                    ?.map(id => props.categories.find(cat => cat.id === id))
                    .map((category, index) => (
                        <Field
                            key={index}
                            label={category?.name}
                            categoryField
                            closeButton
                            onPress={() => props.removeCategory(index)}
                            onEdit={() =>
                                props.openCategoriesSheet(category.id)
                            }
                        />
                    ))}
                <Field
                    label={`Kategorie ${
                        !props.selectedCategories ||
                        !props.selectedCategories.length
                            ? '*'
                            : ''
                    }`}
                    categoryField
                    onPress={() => props.openCategoriesSheet()}
                />
            </View>
        </ScrollView>
    );
};

const RouteClubReach = props => {
    const getReachLabel = reach => {
        let result = '';

        if (reach.countries?.length > 0)
            result += `${reach.countries?.length +
                (reach.countries?.length < 2 ? ' Land' : ' Länder')}`;

        if (reach.cantons?.length > 0)
            result += ` ${reach.cantons?.length + ' ' + props.t('canton')}`;

        if (reach.districts?.length > 0)
            result += ` ${reach.districts?.length + ' ' + props.t('district')}`;

        if (reach.municipalities?.length > 0)
            result += ` ${reach.municipalities?.length +
                ' ' +
                props.t('municipality')}`;

        return result;
    };
    return (
        <View style={s.scene} key={props.route.key}>
            <Text
                style={{
                    fontFamily: 'Rubik-Regular',
                    fontSize: 14,
                    color: PRIMARY_TEXT_COLOR,
                    paddingHorizontal: 25,
                    marginBottom: 10,
                }}>
                Die Reichweite zeigt, welches das primäre Rekrutierungsgebiet
                ist. Der Musikverein Aarau sucht Mitglieder aus Aarau. Der TCS
                sucht Mitglieder aus der ganzen Schweiz.
            </Text>
            <Text
                style={[
                    s.sceneTitle,
                    {
                        marginTop: 25,
                    },
                ]}>
                Reichweite
            </Text>
            <View style={s.sceneFields}>
                {props.reachs?.map((reach, index) => (
                    <Field
                        key={index}
                        label={getReachLabel(reach)}
                        categoryField
                        closeButton
                        onPress={() => props.clearReachs()}
                        onEdit={() => props.editReach(index)}
                    />
                ))}
                {props.reachs?.length === 0 && (
                    <Field
                        label="Gebiet"
                        categoryField
                        onPress={() => props.showReachPicker()}
                    />
                )}
            </View>
        </View>
    );
};
class CreateClub extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            header: null,
        };
    };
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            routes: [
                {key: 'clubname', title: 'clubname'},
                {key: 'clubdesc', title: 'clubdesc'},
                {key: 'clubcontact', title: 'clubcontact'},
                {key: 'clubcategories', title: 'clubcategories'},
                {key: 'clubreach', title: 'clubreach'},
            ],
            //clubname
            clubName: undefined,

            //abbr
            abbr: undefined,

            clubDesc: undefined,

            //clubcontact
            mail: null,
            website: 'https://',
            ort: null,

            //clubinfo
            founded: props.user && props.user.first_name,
            phone: undefined,
            categories: [],

            reachs: [],
            currentReach: null,

            //clubimage
            clubImage: null,
            color: null,

            spinner: false,
            myPosition: null,
        };
        this._renderScene = this._renderScene.bind(this);
        this.reach_step = 0;
    }

    changeClubInfo(key, value) {
        const {continent, country, canton} = this.state;

        if (key == 'continent' && value) {
            this.setState({
                [key]: value,
                ...(continent == null || continent.id != value.id
                    ? {
                          country: null,
                          canton: null,
                          district: [],
                          municipality: [],
                      }
                    : {}),
            });
            this.props.getCountriesByContinent(value.id);
            return;
        } else if (key == 'country' && continent && value) {
            this.setState({
                [key]: value,
                ...(country == null || country.id != value.id
                    ? {
                          canton: null,
                          district: [],
                          municipality: [],
                      }
                    : {}),
            });
            this.props.getCantons(continent.id, value.id);
            return;
        } else if (key == 'canton' && continent && country && value) {
            this.setState({
                [key]: value,
                ...(canton == null || canton.id != value.id
                    ? {
                          district: [],
                          municipality: [],
                      }
                    : {}),
            });
            this.props.getDistricts(continent.id, country.id, value.id);
            return;
        } else if (key == 'district' && value && value.length > 0) {
            this.setState({
                [key]: value,
                municipality: [],
            });
            this.props.getMunicipalitiesOfCities(value);
            return;
        }
        this.setState({[key]: value});
    }
    createClub() {
        const {
            clubName,
            abbr,
            clubImage,
            categories,
            myPosition,
            color,
            founded,
            phone,
            mail,
            website,
            reachs,
            clubDesc,
        } = this.state;
        this.setState({spinner: true});
        const param = {
            name: clubName,
            abbreviation: abbr,
            photo: clubImage && {
                uri: clubImage.uri,
                name: `photo.${getExtFromMime(clubImage.mime)}`,
                filename: `imageName.${getExtFromMime(clubImage.mime)}`,
                type: clubImage.mime,
            },
            //location: `${street || ''} ${zip || ''},${region || ''}`,
            'categories[]': categories,
            lat: myPosition && myPosition.latitude,
            lng: myPosition && myPosition.longitude,
            color,
            founded,
            street: null,
            zip: null,
            region: null,
            active: 1,
            website: website === 'https://' ? null : website,

            is_global: 0,
            continent_id: null,
            country_id: null,
            ...(reachs.length > 0
                ? {
                      'countries[]': reachs[0].countries,
                      'cantons[]':
                          reachs[0].countries?.length > 0
                              ? []
                              : reachs[0].cantons,
                      'districts[]':
                          reachs[0].countries?.length > 0
                              ? []
                              : reachs[0].districts,
                      'municipalities[]':
                          reachs[0].countries?.length > 0
                              ? []
                              : reachs[0].municipalities,
                  }
                : {}),
        };
        this.props.createClub(param, res => {
            if (res)
                setTimeout(async () => {
                    await this.props.getClub(res.id);
                    await this.props.getClubProfile(res.id, {
                        phone,
                        email: mail,
                        active: 1,
                        short_description: clubDesc,
                        website: website === 'https://' ? null : website,
                    });
                    this.setState({spinner: false});
                    await this.props.navigation.goBack();
                    await this.props.navigation.navigate('ClubDetail', {
                        club_id: res.id,
                    });
                }, 100);
            else this.setState({spinner: false});
        });
    }
    openCategoriesSheet = id => {
        this.setState({showSelectCategory: true, highlighted: id ? id : null});
        this.props.navigation.navigate('ClubCategoryPicker', {
            notMulti: true,
            options: this.props.categories,
            selected: id ? id : null,
            backTo: 'CreateClub',
            onClose: (ids, old) => {
                console.log('ids, old', ids, old);
                if (!ids || ids.length === 0) return;
                let {categories} = this.state;
                const ID = ids[0];
                if (categories.includes(ID)) return;
                if (old) {
                    const index = categories.findIndex(c => c === old);
                    categories[index] = ID;
                } else {
                    categories.push(ID);
                }
                this.setState({
                    categories,
                });
            },
        });
    };
    removeCategory = index => {
        this.setState({
            categories: [
                ...this.state.categories.slice(0, index),
                ...this.state.categories.slice(index + 1),
            ],
        });
    };
    _handleIndexChange = index => this.setState({index});
    onNext = () => {
        const {clubName, mail, categories, reachs, ort} = this.state;
        switch (this.state.index) {
            case 0: {
                if (clubName && clubName.length > 0) {
                    this.reach_step = 1;
                    this.setState({index: this.state.index + 1});
                } else {
                    showMessage('Offizieller Name ist erforderlich');
                }
                break;
            }
            case 1: {
                this.reach_step = 2;
                this.setState({index: this.state.index + 1});
                break;
            }
            case 2: {
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!re.test(mail)) {
                    return alert('Ungültiges E-Mail-Format');
                }
                if (!ort || !ort.length) {
                    return alert('Das Feld "Sitz/Ort" ist obligatorisch.');
                }
                this.reach_step = 2;
                this.setState({index: this.state.index + 1});
                break;
            }
            case 3: {
                if (!categories || categories.length === 0) {
                    return alert('Ungültige Kategorie');
                }
                this.reach_step = 3;
                this.setState({index: this.state.index + 1});
                break;
            }
            case 4: {
                if (!reachs || reachs.length === 0) {
                    return alert(
                        'Bitte geben Sie eine Erreichbarkeit für Ihren Club an.',
                    );
                }
                this.createClub();
                break;
            }
        }
    };
    _renderTabBar = props => {
        const {t} = this.props;
        return (
            <View style={s.tabBar}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                    <View style={{flexDirection: 'row', paddingTop: 30}}>
                        <View style={{marginRight: 20}}>
                            <HomePlusIcon
                                height={50}
                                width={50}
                                color={PRIMARY_COLOR}
                            />
                        </View>
                        <View>
                            <Text style={s.tabTitle}>{t('title')}</Text>
                            <Text style={s.tabPage}>
                                {t('step')} {this.state.index + 1}/
                                {props.navigationState.routes.length}
                            </Text>
                            <View style={{flexDirection: 'row'}}>
                                {props.navigationState.routes.map(
                                    (route, i) => {
                                        return (
                                            <TouchableOpacity
                                                key={i + ''}
                                                style={[
                                                    s.paginationDot,
                                                    {
                                                        backgroundColor:
                                                            this.state.index ==
                                                            i
                                                                ? PRIMARY_COLOR
                                                                : '#C4C4C4',
                                                    },
                                                ]}
                                                onPress={() => {
                                                    if (this.reach_step >= i) {
                                                        props.jumpTo(route.key);
                                                        if (route.key != 4)
                                                            this.setState({
                                                                showReachPicker: false,
                                                            });
                                                    }
                                                }}
                                            />
                                        );
                                    },
                                )}
                            </View>
                        </View>
                    </View>
                    <CloseButton
                        onPress={() => {
                            if (this.state.index === 0) {
                                this.props.navigation.goBack();
                            } else
                                this.setState({
                                    index: this.state.index - 1,
                                    showReachPicker: false,
                                });
                        }}
                    />
                </View>
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Creating...'}
                    textStyle={s.spinnerTextStyle}
                />
            </View>
        );
    };

    addReach = reach => {
        console.log('Reach:', reach);
        this.setState({
            reachs: [reach],
            showReachPicker: false,
        });
    };

    _renderScene = ({route, jumpTo}) => {
        const {
            clubName,
            abbr,
            clubImage,
            clubDesc,
            mail,
            website,
            ort,
            reachs,
            categories: selectedCategories,
        } = this.state;
        const {categories} = this.props;
        switch (route.key) {
            case 'clubname':
                return (
                    <Container
                        showReachPicker={this.state.showReachPicker}
                        onNext={this.onNext}
                        t={this.props.t}>
                        <RouteClubName
                            route={route}
                            jumpTo={jumpTo}
                            clubName={clubName}
                            abbr={abbr}
                            clubImage={clubImage}
                            changeClubInfo={(key, value) =>
                                this.changeClubInfo(key, value)
                            }
                            setSelectedImage={this.setImage}
                            t={this.props.t}
                        />
                    </Container>
                );
            case 'clubdesc':
                return (
                    <Container
                        showReachPicker={this.state.showReachPicker}
                        onNext={this.onNext}
                        t={this.props.t}>
                        <RouteClubDesc
                            route={route}
                            jumpTo={jumpTo}
                            clubDesc={clubDesc}
                            changeClubInfo={(key, value) =>
                                this.changeClubInfo(key, value)
                            }
                            t={this.props.t}
                        />
                    </Container>
                );
            case 'clubcontact':
                return (
                    <Container
                        showReachPicker={this.state.showReachPicker}
                        onNext={this.onNext}
                        t={this.props.t}>
                        <RouteClubContact
                            route={route}
                            jumpTo={jumpTo}
                            email={mail}
                            website={website}
                            city={ort}
                            changeClubInfo={(key, value) =>
                                this.changeClubInfo(key, value)
                            }
                            t={this.props.t}
                        />
                    </Container>
                );
            case 'clubcategories':
                return (
                    <Container
                        showReachPicker={this.state.showReachPicker}
                        onNext={this.onNext}
                        fullHeight
                        t={this.props.t}>
                        <RouteClubCategories
                            route={route}
                            jumpTo={jumpTo}
                            categories={categories}
                            removeCategory={this.removeCategory}
                            selectedCategories={selectedCategories}
                            openCategoriesSheet={this.openCategoriesSheet}
                            t={this.props.t}
                        />
                    </Container>
                );
            case 'clubreach':
                return this.state.showReachPicker ? (
                    <Container
                        showReachPicker={this.state.showReachPicker}
                        onNext={this.onNext}
                        fullHeight
                        isLast
                        t={this.props.t}>
                        <ReachPicker
                            municipalities={this.props.municipalities}
                            districts={this.props.districts}
                            cantons={this.props.cantons}
                            countries={this.props.countries}
                            getCantons={this.props.getCantons}
                            getMunicipalitiesOfCities={
                                this.props.getMunicipalitiesOfCities
                            }
                            getDistricts={this.props.getDistricts}
                            getCountries={this.props.getCountriesByContinent}
                            t={this.props.t}
                            onClose={this.addReach}
                            currentReach={this.state.currentReach}
                        />
                    </Container>
                ) : (
                    <Container
                        showReachPicker={this.state.showReachPicker}
                        onNext={this.onNext}
                        t={this.props.t}
                        fullHeight
                        isLast>
                        <RouteClubReach
                            route={route}
                            jumpTo={jumpTo}
                            {...this.state}
                            showReachPicker={() =>
                                this.setState({showReachPicker: true})
                            }
                            clearReachs={() => this.setState({reachs: []})}
                            reachs={reachs}
                            t={this.props.t}
                            editReach={index =>
                                this.setState({
                                    showReachPicker: true,
                                    currentReach: reachs[index],
                                })
                            }
                        />
                    </Container>
                );
        }
    };

    setImage = clubImage => {
        this.setState({clubImage});
    };

    onSwipe = gestureName => {
        const {index} = this.state;
        const {SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
        switch (gestureName) {
            case SWIPE_LEFT:
                this.onNext();
                break;
            case SWIPE_RIGHT:
                if (index > 0) this.setState({index: index - 1});
                break;
        }
    };
    render() {
        return this.state.showReachPicker ? (
            <View style={{flex: 1, backgroundColor: BACKGROUND_COLOR}}>
                <TabView
                    navigationState={this.state}
                    renderScene={this._renderScene}
                    renderTabBar={this._renderTabBar}
                    onIndexChange={this._handleIndexChange}
                    swipeEnabled={false}
                />
            </View>
        ) : (
            <GestureRecognizer
                onSwipe={(direction, state) => this.onSwipe(direction, state)}
                config={{
                    velocityThreshold: 0.1,
                    directionalOffsetThreshold: 200,
                }}
                style={{flex: 1}}>
                <View style={{flex: 1}}>
                    <TabView
                        navigationState={this.state}
                        renderScene={this._renderScene}
                        renderTabBar={this._renderTabBar}
                        onIndexChange={this._handleIndexChange}
                        swipeEnabled={false}
                    />
                </View>
            </GestureRecognizer>
        );
    }
}
const mapStateToProps = state => ({
    categories: state.category.all_categories,
    user: state.user.user,
    continents: state.club.continents,
    countries: state.club.countries,
    cantons: state.club.cantons,
    districts: state.club.districts,
    municipalities: state.club.municipalities,
});

const mapDispatchToProps = {
    createClub,
    getClubProfile,
    getClub,
    getContinents,
    getCountriesByContinent,
    getCantons,
    getDistricts,
    getMunicipalitiesOfCities,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(
    hoistStatics(
        withTranslation(['createclub', 'common'])(CreateClub),
        CreateClub,
    ),
);
