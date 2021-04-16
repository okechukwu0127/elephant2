import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import s from './styles';
import {removeDuplicates} from '../../utils/utils';
import {withTranslation} from 'react-i18next';
import AvatarImage from '../AvatarImage';

class MemberCard3 extends React.Component {
    render() {
        const {
            t,
            navigation,
            clubs,
            disableShadow,
            hideCreateClub,
        } = this.props;
        const data = removeDuplicates(clubs, 'id');
        return (
            <View style={[s.container, disableShadow ? {elevation: 1} : {}]}>
                <View style={s.header}>
                    <Text style={s.headerTitle}>{t('myclubs')}</Text>
                </View>
                <View style={s.content}>
                    {data && data.length > 0
                        ? data.map(item => {
                              return (
                                  <TouchableOpacity
                                      key={item.id + ''}
                                      style={s.cardItem}
                                      onPress={() => {
                                          if (!navigation) return;
                                          navigation.setParams({club_id: null});
                                          navigation.navigate('ClubDetail', {
                                              club_id: item.id,
                                          });
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
                                          <Text
                                              style={[
                                                  s.contactDate,
                                                  {textTransform: 'capitalize'},
                                              ]}>
                                              {item.user_role}
                                          </Text>
                                          <Text style={s.contactDate}>
                                              {item.location}
                                          </Text>
                                      </View>
                                  </TouchableOpacity>
                              );
                          })
                        : null}
                    {!hideCreateClub ? (
                        <TouchableOpacity
                            style={{padding: 10, alignSelf: 'center'}}
                            onPress={() => {
                                navigation && navigation.navigate('MainScreen');
                            }}>
                            <Text style={s.btnLabel}>{t('addclub')}</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>
        );
    }
}

export default withTranslation('membercard')(MemberCard3);
