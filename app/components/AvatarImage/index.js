import React from 'react';
import {Image, View, Text} from 'react-native';
import {PRIMARY_COLOR} from '../../themes/colors';
import {connect} from 'react-redux';
import AppConfig from '../../config/AppConfig';

class AvatarImage extends React.Component {
    render() {
        const {
            uri,
            width,
            user,
            backgroundColor,
            source,
            token,
            user_id,
            style,
        } = this.props;
        return (
            <View
                style={[
                    {
                        width: width,
                        height: width,
                        borderRadius: width,
                        backgroundColor: backgroundColor
                            ? backgroundColor
                            : PRIMARY_COLOR,
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                    },
                    style || {},
                ]}>
                <Text style={{fontSize: width / 2, color: 'white'}}>
                    {user &&
                        user.first_name &&
                        user.first_name.length > 0 &&
                        user.first_name.charAt(0).toUpperCase()}
                </Text>
                {uri && uri.length > 0 && (
                    <Image
                        source={{
                            uri,
                        }}
                        style={{
                            resizeMode: 'cover',
                            width: width,
                            height: width,
                            position: 'absolute',
                            backgroundColor: 'transparent',
                            left: 0,
                            top: 0,
                        }}
                    />
                )}
                {user_id && (
                    <Image
                        source={{
                            uri: `${
                                AppConfig.apiUrl
                            }/users/privacy/${user_id}/profile-picture`,
                            method: 'GET',
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }}
                        style={{
                            resizeMode: 'cover',
                            width: width,
                            height: width,
                            position: 'absolute',
                            left: 0,
                            top: 0,
                        }}
                    />
                )}
                {source && (
                    <Image
                        source={source}
                        style={{
                            resizeMode: 'cover',
                            width: width,
                            height: width,
                            position: 'absolute',
                            backgroundColor: 'transparent',
                            left: 0,
                            top: 0,
                        }}
                    />
                )}
            </View>
        );
    }
}
const mapStateToProps = state => ({
    token: state?.user?.token,
});

const mapDispatchToProps = {};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AvatarImage);
