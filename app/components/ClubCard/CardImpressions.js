import React from 'react';
import {
    TextInput,
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import s, {fab_width} from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {
    BACKGROUND_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
} from '../../themes/colors';
import IconTV from '../../assets/icon_tv.png';
import {withTranslation} from 'react-i18next';

class CardImpressions extends React.Component {
    render() {
        const {t, onFollow, club, impressions, disableShadow} = this.props;
        const club_profile = club && club.profile;
        return (
            <View style={[s.container, disableShadow ? {elevation: 1} : {}]}>
                <View style={s.header}>
                    <Text style={s.headerTitle}>{t('impression')}</Text>
                    <Image
                        source={IconTV}
                        style={{width: 35, height: 35, resizeMode: 'contain'}}
                    />
                </View>
                <View
                    style={[
                        s.content,
                        {justifyContent: 'center', alignItems: 'center'},
                    ]}>
                    <FlatList
                        style={{flex: 1, width: '100%'}}
                        data={
                            impressions
                                ? impressions.filter(
                                      (item) =>
                                          item.media && item.media.length > 0,
                                  )
                                : []
                        }
                        renderItem={({item}) => {
                            const {media} = item;
                            return (
                                <View key={media.id} style={s.impressItem}>
                                    <View style={s.impressImgView}>
                                        {
                                            <Image
                                                source={{
                                                    uri: media[0].original,
                                                }}
                                                style={s.impressimg}
                                            />
                                        }
                                    </View>
                                </View>
                            );
                        }}
                        keyExtractor={(item, index) => item.id + ''}
                        numColumns={2}
                        extraData={this.props}
                    />
                </View>
            </View>
        );
    }
}

export default withTranslation('clubcard')(CardImpressions);
