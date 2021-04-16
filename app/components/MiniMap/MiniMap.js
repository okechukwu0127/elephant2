import React, {useRef, useState, useEffect} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import axios from 'axios';
import Geolocation from '@react-native-community/geolocation';
import {PRIMARY_COLOR} from '../../themes/colors';
import {DEFAULT_LOCATION} from '../../constants';

const DEFAULT_DELTA = {latitudeDelta: 0.0025, longitudeDelta: 0.005};
const API_KEY = 'AIzaSyDDf1apdqcjHNi4DixQPFe0pzv3r4xAlgI';
const REVRSE_GEO_CODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const GEO_CODE_URL =
    'https://maps.googleapis.com/maps/api/geocode/json?key=' + API_KEY;

export default function MiniMap(props) {
    const _map = useRef(null);
    const [currentRegion, setCurrentRegion] = useState();
    const [address, setAddress] = useState(props.address);
    const [mapReady, setMapReady] = useState(false);
    const [isGesture, setIsGesture] = useState(false);
    const [gestureTimeout, setGestureTimeout] = useState(null);

    useEffect(() => {
        if (props.address && mapReady) {
            onAddressChange(props.address);
            return;
        }
        _getCurrentLocation();
    }, [props.address, mapReady]);

    useEffect(() => {
        if (!props.readOnly) props.addressChanged(address);
    }, [address]);

    const _onMapRegionChangeComplete = Region => {
        if (props.readOnly || !Region || !Region.latitude || !Region.longitude)
            return;
        setRegion(Region);
        let {latitude, longitude} = Region;
        axios
            .get(
                `${REVRSE_GEO_CODE_URL}?key=${API_KEY}&latlng=${latitude},${longitude}`,
            )
            .then(({data}) => {
                let {results} = data;
                if (results.length > 0) {
                    let {formatted_address, address_components} = results[0];
                    if (props.cityChange)
                        for (const component of address_components) {
                            if (component?.types?.includes('locality'))
                                props.cityChange(component?.long_name);
                        }
                    if (isGesture) setAddress(formatted_address);
                }
            });
    };

    const onAddressChange = (Address, initial = false) => {
        axios.get(`${GEO_CODE_URL}&address=${Address}`).then(({data}) => {
            const {results} = data;
            if (!results || !results[0]) return;
            const {location} = results[0].geometry;
            setRegion({
                ...DEFAULT_DELTA,
                latitude: location.lat,
                longitude: location.lng,
            });
            if (_map.current && mapReady)
                _map.current.animateToRegion({
                    ...DEFAULT_DELTA,
                    latitude: location.lat,
                    longitude: location.lng,
                });
        });
    };

    const _getCurrentLocation = () => {
        const {timeout, maximumAge, enableHighAccuracy} = props;
        Geolocation.getCurrentPosition(
            position => {
                const {latitude, longitude} = position.coords;
                setRegion({latitude, longitude, ...DEFAULT_DELTA});
            },
            error => {
                setRegion({...currentRegion, ...DEFAULT_LOCATION});
            },
            {
                enableHighAccuracy,
                timeout,
                maximumAge,
            },
        );
    };

    const setRegion = region => {
        setCurrentRegion(region);
    };

    return (
        <View style={styles.container}>
            {currentRegion && (
                <>
                    <MapView
                        onMapReady={() => setMapReady(true)}
                        initialCamera={{
                            zoom: 20,
                            center: currentRegion,
                            pitch: 1,
                            heading: 1,
                            altitude: 200,
                        }}
                        mapType="satellite"
                        ref={_map}
                        style={[
                            styles.mapView,
                            {
                                width: props.fullWidth ? '100%' : '90%',
                            },
                        ]}
                        onRegionChange={() => {
                            setIsGesture(true);
                            if (gestureTimeout) clearTimeout(gestureTimeout);
                            const timeout = setTimeout(() => {
                                setIsGesture(false);
                            }, 1000);
                            setGestureTimeout(timeout);
                        }}
                        showsMyLocationButton={false}
                        showsUserLocation={false}
                        pitchEnabled
                        rotateEnabled
                        scrollEnabled
                        zoomEnabled
                        onRegionChangeComplete={_onMapRegionChangeComplete}>
                        {props.readOnly && (
                            <Marker
                                coordinate={currentRegion}
                                pinColor={PRIMARY_COLOR}>
                                <Image
                                    source={require('../../assets/marker.png')}
                                    style={{height: 35, width: 35}}
                                />
                            </Marker>
                        )}
                    </MapView>
                    {!props.readOnly && (
                        <View
                            style={{
                                ...StyleSheet.absoluteFillObject,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            <Image
                                source={require('../../assets/marker.png')}
                                style={{height: 35, width: 35}}
                            />
                        </View>
                    )}
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingTop: 10,
    },
    mapView: {
        height: 300,
    },
});
