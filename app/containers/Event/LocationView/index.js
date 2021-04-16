import React from 'react';
import LocationView from './lib';
import {View, Text, TouchableOpacity} from 'react-native';
import {PRIMARY_TEXT_COLOR} from '../../../themes/colors';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {connect} from 'react-redux';
import {setLocation} from '../../../reducers/user';
import {DEFAULT_LOCATION} from '../../../constants';

class SelectLocationView extends React.Component {
    state = {};
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            header: null,
        };
    };
    render() {
        const initposition = this.props.navigation.getParam('initposition');
        const prefer = this.props.navigation.getParam('prefer');
        const initAddress = this.props.navigation.getParam('initAddress');
        return (
            <View style={s.container}>
                <View style={s.wrapper}>
                    <View style={s.topBar}>
                        <Text style={s.title} />
                        <TouchableOpacity
                            style={{borderRadius: 30, overflow: 'hidden'}}
                            onPress={() => this.props.navigation.goBack()}>
                            <Icon
                                name="x"
                                color="white"
                                size={17}
                                style={{
                                    fontWeight: '100',
                                    backgroundColor: PRIMARY_TEXT_COLOR,
                                    width: 35,
                                    height: 35,
                                    textAlign: 'center',
                                    paddingTop: 8,
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 1}}>
                        <LocationView
                            apiKey={'AIzaSyDDf1apdqcjHNi4DixQPFe0pzv3r4xAlgI'}
                            initialLocation={
                                initposition ? initposition : DEFAULT_LOCATION
                            }
                            address={prefer === 'addr' ? initAddress : null}
                            onLocationSelect={async location => {
                                console.log('====location', location);
                                if (
                                    location.address &&
                                    location.address.length > 0
                                )
                                    await this.props.setLocation(location);
                                this.props.navigation.goBack();
                            }}
                        />
                    </View>
                </View>
            </View>
        );
    }
}
const mapStateToProps = state => ({});

const mapDispatchToProps = {
    setLocation,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SelectLocationView);
