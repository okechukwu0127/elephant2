import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import s, {fab_width, fab_height, fab_btnsize} from './styles';
import {PRIMARY_COLOR} from '../../themes/colors';
import Ellipse from '../../assets/fabEllipse.png';
import {SvgUri} from 'react-native-svg';

const timerInterval = 10;
const orbit_x = fab_width / 2;
const orbit_y = fab_height / 2;
const speed = 2;

class Orbit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            planets: props.planets ? props.planets : [],
            position: {
                x: 0,
                y: 0,
            },
        };
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.planets.length != this.state.planets.length) {
            this.setState({
                planets: nextProps.planets,
            });
        }
    }
    componentDidMount() {
        this.timer = setInterval(() => {
            if (!this.props.focus) return;
            const {planets} = this.state;
            if (planets && planets.length > 0) {
                const timestamp = Date.now() * 0.0001;
                const count = planets.length;
                const new_obj = planets.map((planet, index) => {
                    const offset = (index * 2 * 3.14159) / count;
                    return {
                        ...planet,
                        position: {
                            x:
                                fab_width / 2 +
                                Math.cos(timestamp * speed + offset) * orbit_x -
                                fab_btnsize / 2,
                            y:
                                fab_height / 2 +
                                Math.sin(timestamp * speed + offset) * orbit_y -
                                fab_btnsize / 2,
                        },
                    };
                });
                this.setState({
                    planets: new_obj,
                });
            }
        }, timerInterval);
    }
    componentWillUnmount() {
        this.timer && clearInterval(this.timer);
    }
    render() {
        const {planets} = this.state;
        return (
            <View style={s.fabContainer}>
                <Image source={Ellipse} style={s.background} />
                <Icon name="user" size={fab_width / 3} color={PRIMARY_COLOR} />
                {planets.map(item => {
                    if (item.position) {
                        // Showing white logo and using the black one as a fallback
                        const logo =
                            item.logo_2?.original || item.logo?.original;
                        return (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    s.fabBtn,
                                    {
                                        left: item.position.x,
                                        top: item.position.y,
                                    },
                                ]}
                                onPress={() => {
                                    this.props.onPressPlanet(item);
                                }}>
                                <SvgUri
                                    width="30"
                                    height="30"
                                    uri={logo}
                                    fill="#ffff"
                                />
                            </TouchableOpacity>
                        );
                    }
                    return null;
                })}
            </View>
        );
    }
}

export default Orbit;
