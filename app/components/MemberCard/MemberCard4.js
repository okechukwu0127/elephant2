import React from 'react';
import {
    TextInput,
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import s, {fab_width} from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {
    BACKGROUND_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
} from '../../themes/colors';
import {withTranslation} from 'react-i18next';
import AvatarImage from '../AvatarImage';

class MemberCard4 extends React.Component {
    render() {
        const {t, disableShadow, clubs, navigation} = this.props;
        return (
            <View style={[s.container, disableShadow ? {elevation: 1} : {}]}>
                <View style={s.header}>
                    <Text style={s.headerTitle}>{t('moreclubs')}</Text>
                    <Icon name="at-sign" size={30} color="white" />
                </View>
                <View style={s.content}>
                    {clubs && clubs.length > 0
                        ? clubs.map((item) => {
                              return (
                                  <TouchableOpacity
                                      key={item.id + ''}
                                      style={s.cardItem}
                                      onPress={() => {
                                          navigation &&
                                              navigation.navigate(
                                                  'ClubDetail',
                                                  {club: item},
                                              );
                                      }}>
                                      <View style={s.clubImage}>
                                          <AvatarImage
                                              uri={
                                                  item.photo &&
                                                  item.photo.original
                                              }
                                              width={50}
                                              user={{first_name: item.name}}
                                          />
                                      </View>
                                      <View style={{flex: 1}}>
                                          <Text style={s.contactName}>
                                              {item.name}
                                          </Text>
                                          <Text style={s.contactDate}>
                                              {item.location}
                                          </Text>
                                      </View>
                                  </TouchableOpacity>
                              );
                          })
                        : null}
                </View>
            </View>
        );
    }
}

export default withTranslation('membercard')(MemberCard4);
