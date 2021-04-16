import React from 'react';
import {TextInput, View, Text, TouchableOpacity, Platform} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {PRIMARY_COLOR} from '../../themes/colors';
import {BackButton} from '../../components';
import {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {connect} from 'react-redux';
import {getClubs} from '../../reducers/club';
import Geocoder from 'react-native-geocoding';
import AppConfig from '../../config/AppConfig';
import MapView from 'react-native-map-clustering';
import {withTranslation} from 'react-i18next';
import hoistStatics from 'hoist-non-react-statics';
import Menu, {MenuItem} from 'react-native-material-menu';
import {isLatitude, isLongitude} from '../../utils/utils';

Geocoder.init(AppConfig.google_apikey);
const initRegion = {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 100,
    longitudeDelta: 100,
};
export const REGION = t => [
    {
        value: t('zip'),
        id: 'profile.zip',
    },
    {
        value: t('region'),
        id: 'district_name',
    },
    {
        value: t('canton'),
        id: 'canton_name',
    },
    {
        value: t('street'),
        id: 'municipality_name',
    },
];

class ClubMap extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            headerLeft: <BackButton navigation={navigation} />,
            headerRight: null,
        };
    };
    constructor(props) {
        super(props);
        this.state = {
            option: REGION(props.t)[1],
            query: null,
            clubs: [],
            mapRegion: initRegion,
        };

        props.getClubs();
        this.buffer = [];
        this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this);
    }
    componentDidMount() {
        if (this.props.clubs.length > 0)
            this.getLocationFromAddress(this.props.clubs);
    }
    UNSAFE_componentWillReceiveProps(nextprops) {
        if (this.props.clubs.length != nextprops.clubs.length) {
            this.getLocationFromAddress(nextprops.clubs);
        }
    }
    getLocationFromAddress(clubs) {
        var minX = null,
            maxX = null,
            minY = null,
            maxY = null;
        const promises = clubs.map(async item => {
            if (isLatitude(item.lat) && isLongitude(item.lng)) {
                if (minX == null) minX = parseFloat(item.lat);
                if (maxX == null) maxX = parseFloat(item.lat);
                if (minY == null) minY = parseFloat(item.lng);
                if (maxY == null) maxY = parseFloat(item.lng);

                minX = Math.min(minX, parseFloat(item.lat));
                maxX = Math.max(maxX, parseFloat(item.lat));
                minY = Math.min(minY, parseFloat(item.lng));
                maxY = Math.max(maxY, parseFloat(item.lng));

                return {
                    ...item,
                    geometry: {
                        lat: parseFloat(item.lat),
                        lng: parseFloat(item.lng),
                    },
                };
            }
            if (item.location && item.location.length > 0) {
                const geometry = this.buffer.find(
                    geo => geo.address === item.location,
                );
                if (geometry) {
                    if (minX == null) minX = geometry.latlng.lat;
                    if (maxX == null) maxX = geometry.latlng.lat;
                    if (minY == null) minY = geometry.latlng.lng;
                    if (maxY == null) maxY = geometry.latlng.lng;

                    minX = Math.min(minX, geometry.latlng.lat);
                    maxX = Math.max(maxX, geometry.latlng.lat);
                    minY = Math.min(minY, geometry.latlng.lng);
                    maxY = Math.max(maxY, geometry.latlng.lng);

                    return {
                        ...item,
                        geometry: geometry.latlng,
                    };
                }
                return Geocoder.from(item.location)
                    .then(json => {
                        var location = json.results[0].geometry.location;

                        if (minX == null) minX = location.lat;
                        if (maxX == null) maxX = location.lat;
                        if (minY == null) minY = location.lng;
                        if (maxY == null) maxY = location.lng;

                        minX = Math.min(minX, location.lat);
                        maxX = Math.max(maxX, location.lat);
                        minY = Math.min(minY, location.lng);
                        maxY = Math.max(maxY, location.lng);

                        this.buffer.push({
                            address: item.location,
                            latlng: location,
                        });
                        return {
                            ...item,
                            geometry: location,
                        };
                    })
                    .catch(error => {
                        return item;
                    });
            }
            return item;
        });
        Promise.all(promises).then(values => {
            const markers = values
                .filter(item => item.geometry)
                .map(item => {
                    return {
                        latitude: item.geometry.lat,
                        longitude: item.geometry.lng,
                    };
                });
            /*
            var midX = (minX + maxX) / 2;
            var midY = (minY + maxY) / 2;
            var midPoint = [midX, midY];

            var deltaX = (maxX - minX) * 2.5;
            var deltaY = (maxY - minY) * 2.5;

            var padding = 0.1;
            */
            this.setState({
                clubs: values,
            });
            /*
            let region = (minX && minY && maxX && maxY) ? {
                latitude: midX, longitude: midY,
                latitudeDelta: deltaX + deltaX * padding, longitudeDelta: deltaY + deltaY * padding
            } : initRegion;

            self.map.animateToRegion(initRegion, 2000);
            */
            if (markers.length > 0) {
                this.map.fitToCoordinates(markers, {
                    edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
                    animated: true,
                });
            } else this.map.animateToRegion(initRegion, 1000);
        });
    }
    onRegionChangeComplete(region) {
        this.setState({mapRegion: region});
    }
    render() {
        const {clubs, option, query, mapRegion} = this.state;
        const {t} = this.props;
        return (
            <View style={s.container}>
                <Text style={s.title}>{t('title')}</Text>
                <View style={s.mapContainer}>
                    <MapView
                        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                        style={s.map}
                        showsUserLocation={true}
                        followUserLocation={true}
                        showsMyLocationButton={true}
                        initialRegion={mapRegion}
                        //onRegionChange={this.onRegionChangeComplete}
                        clusterColor={PRIMARY_COLOR}
                        mapRef={ref => {
                            if (ref) this.map = ref;
                        }}>
                        {clubs
                            .filter(item => item.geometry)
                            .map(item => {
                                return (
                                    <Marker
                                        key={item.id}
                                        title={item.name}
                                        coordinate={{
                                            latitude: item.geometry.lat,
                                            longitude: item.geometry.lng,
                                        }}
                                        onCalloutPress={() => {}}
                                    />
                                );
                            })}
                    </MapView>
                    <View style={s.inputContainer}>
                        <Icon
                            name="search"
                            size={20}
                            color={PRIMARY_COLOR}
                            style={s.inputIcon}
                        />
                        <TextInput
                            style={s.input}
                            placeholder={t('search')}
                            placeholderTextColor={'#88919E'}
                            returnKeyType="search"
                            value={query}
                            onChangeText={q => this.setState({query: q})}
                            onEndEditing={() => {
                                this.props.getClubs({
                                    [option.id]: query,
                                });
                            }}
                        />

                        <Menu
                            ref={_ref => (this._filtermenu = _ref)}
                            button={
                                <TouchableOpacity
                                    style={s.dropdownBtn}
                                    onPress={() =>
                                        this._filtermenu &&
                                        this._filtermenu.show()
                                    }>
                                    <Text style={s.dropdownLabel}>
                                        {option.value}
                                    </Text>
                                    <Icon
                                        name="chevron-down"
                                        color={PRIMARY_COLOR}
                                        size={22}
                                        style={{marginTop: 2}}
                                    />
                                </TouchableOpacity>
                            }
                            style={{top: Platform.OS == 'ios' ? 280 : 250}}>
                            {REGION(t).map(item => {
                                return (
                                    <MenuItem
                                        key={item.value}
                                        onPress={() => {
                                            this._filtermenu &&
                                                this._filtermenu.hide();
                                            this.setState(
                                                {option: item},
                                                () => {
                                                    if (
                                                        query &&
                                                        query.length > 0
                                                    )
                                                        this.props.getClubs({
                                                            [item.id]: query,
                                                        });
                                                },
                                            );
                                        }}
                                        textStyle={s.dropdownItem}>
                                        {item.value}
                                    </MenuItem>
                                );
                            })}
                        </Menu>
                    </View>
                    <TouchableOpacity
                        style={s.btn}
                        onPress={() => {
                            this.props.navigation.navigate('SearchClub', {
                                isFetched: true,
                            });
                        }}>
                        <Text style={s.btnLabel}>{t('nextbtn')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
const mapStateToProps = state => ({
    user: state.user.user,
    clubs: state.club.clubs,
});

const mapDispatchToProps = {
    getClubs,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(hoistStatics(withTranslation('clubmap')(ClubMap), ClubMap));
