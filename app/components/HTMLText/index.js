import React, {useState, useEffect} from 'react';
import {
    View,
    ScrollView,
    Text,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {PRIMARY_TEXT_COLOR, PRIMARY_COLOR} from '../../themes/colors';
import s from './styles';
import HTML from 'react-native-render-html';

export default function HTMLText(props) {
    const {navigation} = props;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const title = navigation.getParam('title');
    const getData = navigation.getParam('getData');

    useEffect(() => {
        if (getData) {
            getData(res => {
                setData(res?.value);
                setLoading(false);
            });
        }
    }, [getData]);

    return (
        <View style={s.container}>
            <View style={s.wrapper}>
                <View style={s.topBar}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack();
                        }}>
                        <Icon
                            name="arrow-left"
                            color={PRIMARY_TEXT_COLOR}
                            size={25}
                            style={{marginRight: 15}}
                        />
                    </TouchableOpacity>
                    <Text style={s.title}>{title}</Text>
                </View>
                <ScrollView style={{paddingHorizontal: 30}}>
                    {loading ? (
                        <ActivityIndicator color={PRIMARY_COLOR} size="large" />
                    ) : (
                        data && <HTML html={data} />
                    )}
                </ScrollView>
            </View>
        </View>
    );
}
