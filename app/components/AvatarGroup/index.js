import React from 'react';
import {Dimensions, View, Text} from 'react-native';
import s from './styles';
import {PRIMARY_COLOR} from '../../themes/colors';
import {AvatarImage} from '../';

const {width, height} = Dimensions.get('window');
const avatar_size = 60;
const avatar_offset = 10;
class AvatarGroup extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.data.length != this.props.data.length) {
            return true;
        }
        return false;
    }
    renderRows(data, center, offset_x = 0) {
        console.log('-=========data', data);
        return (
            <View>
                {data.map((item, index) => {
                    let left = center.x + Math.random() * (avatar_offset - 2);
                    let top =
                        center.y -
                        avatar_size / 2 +
                        offset_x +
                        (avatar_offset - 2);
                    if (index > 0) {
                        if ((index - 1) % 2 == 0) {
                            left -=
                                avatar_size * (parseInt((index - 1) / 2) + 1);
                        } else
                            left +=
                                avatar_size * (parseInt((index - 1) / 2) + 1);
                    }

                    return (
                        <View
                            key={index + ''}
                            style={{
                                width: avatar_size - avatar_offset,
                                height: avatar_size - avatar_offset,
                                resizeMode: 'cover',
                                borderRadius: avatar_size,
                                position: 'absolute',
                                left,
                                top,
                            }}>
                            <AvatarImage
                                user_id={item?.id}
                                user={item}
                                width={avatar_size - avatar_offset}
                            />
                        </View>
                    );
                })}
            </View>
        );
    }
    renderAvatars(data, lines, content_height) {
        const count = data.length;
        if (lines == 1) {
            const center_x = width / 2 - (count % 2 == 1 ? avatar_size / 2 : 0);
            return this.renderRows(data, {x: center_x, y: content_height / 2});
        } else if (lines == 2) {
            let center_sign = -1;
            if (count == 7) center_sign = 1;

            let center_offset = avatar_size / 2;
            if (count == 5) center_offset = 0;

            const center_x = width / 2 - center_offset;
            const node1 = parseInt(count / 2);

            return (
                <View>
                    {this.renderRows(data.slice(0, node1), {
                        x: center_x,
                        y: content_height / 4,
                    })}
                    {this.renderRows(
                        data.slice(node1, count),
                        {
                            x: center_x + (center_sign * avatar_size) / 2,
                            y: (content_height * 3) / 4,
                        },
                        -avatar_size / 7,
                    )}
                </View>
            );
        } else {
            let node1 = parseInt(count / 3);
            let node2 = parseInt((count * 2) / 3);
            if (count % 3 == 0) {
                node1 -= 1;
                node2 -= 1;
            }
            const center_x =
                width / 2 - ((node2 - node1) % 2 == 1 ? avatar_size / 2 : 0);
            return (
                <View>
                    {this.renderRows(
                        data.slice(0, node1),
                        {
                            x:
                                center_x +
                                ((node1 < node2 && (node2 - node1) % 2 == 1
                                    ? 1
                                    : -1) *
                                    avatar_size) /
                                    2,
                            y: content_height / 6,
                        },
                        avatar_size / 7,
                    )}
                    {this.renderRows(data.slice(node1, node2), {
                        x: center_x,
                        y: content_height / 2,
                    })}
                    {this.renderRows(
                        data.slice(node2, count),
                        {
                            x:
                                center_x +
                                ((node2 - node1 < count - node2 &&
                                (node2 - node1) % 2 == 1
                                    ? 1
                                    : -1) *
                                    avatar_size) /
                                    2,
                            y: (content_height * 5) / 6,
                        },
                        -avatar_size / 7,
                    )}
                </View>
            );
        }
    }
    render() {
        const {data} = this.props;
        const count = data ? data.length : 0;
        let lines = 1;
        if (count > 7) {
            lines = 3;
        } else if (count > 4) {
            lines = 2;
        }
        return (
            <View style={[s.container, {height: lines * avatar_size}]}>
                {this.renderAvatars(data, lines, lines * avatar_size)}
            </View>
        );
    }
}

export default AvatarGroup;
