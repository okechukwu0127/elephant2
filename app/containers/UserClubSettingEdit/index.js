import React from 'react';
import {
    TextInput,
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {TagSelect, Orbit, SelectSubCategory} from '../../components';
import {
    BACKGROUND_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
} from '../../themes/colors';
import {connect} from 'react-redux';
import {searchClubCategories} from '../../reducers/category';
import Carousel, {Pagination, ParallaxImage} from 'react-native-snap-carousel';
import s, {sliderWidth, itemWidth, itemHorizontalMargin} from './styles';
import {setFeedSettings, getUserFeed} from '../../reducers/feed';
import {withTranslation} from 'react-i18next';
import hoistStatics from 'hoist-non-react-statics';

const SLIDER_1_FIRST_ITEM = 0;

class SliderEntry extends React.Component {
    render() {
        const {index, selTags, onPressTag, dump_categories} = this.props;
        const data = dump_categories[index + 1 + ''];
        if (data) {
            return (
                <TagSelect
                    key={index + ''}
                    data={data ? data : []}
                    selectedItems={selTags.map((item) => item.name)}
                    labelAttr="name"
                    keyAttr="id"
                    suffix={true}
                    itemStyle={s.tagitem}
                    itemLabelStyle={s.taglabel}
                    itemStyleSelected={s.tagitemSelected}
                    itemLabelStyleSelected={s.taglabelSelected}
                    onClickItem={(selTag) => {
                        onPressTag(selTag);
                    }}
                />
            );
        } else {
            return (
                <View>
                    <ActivityIndicator color={PRIMARY_COLOR} />
                </View>
            );
        }
    }
}

class UserClubSettingEdit extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            headerLeft: null,
            headerRight: (
                <TouchableOpacity
                    style={{
                        borderRadius: 30,
                        overflow: 'hidden',
                        marginRight: 20,
                    }}
                    onPress={() => navigation.goBack()}>
                    <Icon
                        name="check"
                        color="white"
                        size={17}
                        style={{
                            fontWeight: '100',
                            backgroundColor: PRIMARY_COLOR,
                            width: 35,
                            height: 35,
                            textAlign: 'center',
                            paddingTop: 8,
                        }}
                    />
                </TouchableOpacity>
            ),
        };
    };
    constructor(props) {
        super(props);
        const type = props.navigation.getParam('type');

        const currentpage =
            props.meta && props.meta.current_page != null
                ? props.meta.current_page
                : 1;
        const init_cats = props.categories; //.filter(item => item.parent_category == null || item.parent_category.length <= 0)
        let dump_categories = {};
        dump_categories = {
            [currentpage]: init_cats,
        };
        const {selected_categories} = props;
        let init_sels = [];
        init_cats.map(
            (item) =>
                selected_categories.includes(item.id) && init_sels.push(item),
        );

        this.state = {
            selTags: {[currentpage - 1 + '']: init_sels},
            open_subcat: false,
            selCategory: null,
            keyword: null,
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
            dump_categories,
            type,
        };
        props.searchClubCategories();
        this._renderItemWithParallax = this._renderItemWithParallax.bind(this);
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.meta != nextProps.meta) {
            const currentpage =
                nextProps.meta.current_page != null
                    ? nextProps.meta.current_page
                    : 1;
            const new_cats = nextProps.categories; //.filter(item => item.parent_category == null || item.parent_category.length <= 0);
            let dump_categories = this.state.dump_categories;
            dump_categories = {
                ...dump_categories,
                [currentpage + '']: new_cats,
            };

            const {selected_categories} = nextProps;
            let init_sels = [];
            new_cats.map(
                (item) =>
                    selected_categories.includes(item.id) &&
                    init_sels.push(item),
            );
            const selTags = {
                ...this.state.selTags,
                [currentpage - 1 + '']: init_sels,
            };
            this.setState({
                dump_categories,
                selTags,
            });
        }
    }
    _renderItemWithParallax({item, index}, parallaxProps) {
        const {selTags, dump_categories} = this.state;
        const {links, meta, selected_categories} = this.props;
        const pageCount = meta && meta.last_page ? meta.last_page : 1;
        const subSelTags = selTags[index + ''];
        return (
            <View style={{paddingHorizontal: 30}}>
                <SliderEntry
                    parallax={true}
                    index={index}
                    parallaxProps={parallaxProps}
                    dotCount={pageCount}
                    dump_categories={dump_categories}
                    selTags={subSelTags ? subSelTags : []}
                    onPressTag={(selTag) => {
                        var prev_tags = selTags[index + ''];
                        const find_obj =
                            prev_tags &&
                            prev_tags.find((g) => g.id == selTag.id);
                        if (find_obj) {
                            prev_tags = prev_tags.filter(
                                (g) => g.id !== selTag.id,
                            );
                        } else prev_tags.push(selTag);
                        const new_tags = {
                            ...selTags,
                            [index + '']: prev_tags,
                        };
                        let allplanets = [];
                        Object.keys(new_tags).map((key) => {
                            allplanets = [...allplanets, ...new_tags[key]];
                            return key;
                        });
                        this.props.setFeedSettings({
                            selected_categories: allplanets.map(
                                (item) => item.id,
                            ),
                        });
                        this.setState({
                            selTags: new_tags,
                        });
                    }}
                />
            </View>
        );
    }
    componentWillUnmount() {
        this.props.getUserFeed();
    }
    snapToIndex(index) {
        const {dump_categories, keyword} = this.state;
        const data = dump_categories[index + 1 + ''];
        if (data == null) {
            this.props.searchClubCategories(keyword, index + 1);
        }
        this.setState({slider1ActiveSlide: index});
    }
    render() {
        const {type, keyword, selTags, open_subcat, selCategory} = this.state;

        const {t, meta, region, city, zip} = this.props;

        const pageCount = meta && meta.last_page ? meta.last_page : 1;

        return (
            <View style={s.screen}>
                <ScrollView contentContainerStyle={s.container}>
                    <Text style={s.title}>
                        {type == 'interest' ? t('myinterest') : t('near')}
                    </Text>
                    {type === 'interest' && (
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <View style={s.inputContainer}>
                                <Icon
                                    name="search"
                                    size={20}
                                    color="#88919E"
                                    style={s.inputIcon}
                                />
                                <TextInput
                                    style={s.input}
                                    placeholder={t('search')}
                                    placeholderTextColor={'#88919E'}
                                    returnKeyType="search"
                                    value={keyword}
                                    onChangeText={(keyword) =>
                                        this.setState({keyword})
                                    }
                                    onEndEditing={() => {
                                        this.props.searchClubCategories(
                                            keyword,
                                        );
                                    }}
                                />
                            </View>
                            <Carousel
                                ref={(c) => (this._slider5Ref = c)}
                                data={[...Array(pageCount)].map(
                                    (_, i) => i + 1,
                                )}
                                renderItem={this._renderItemWithParallax}
                                sliderWidth={sliderWidth}
                                itemWidth={itemWidth}
                                hasParallaxImages={true}
                                firstItem={SLIDER_1_FIRST_ITEM}
                                inactiveSlideScale={0.97}
                                inactiveSlideOpacity={1}
                                // inactiveSlideShift={20}
                                containerCustomStyle={s.slider}
                                contentContainerCustomStyle={
                                    s.sliderContentContainer
                                }
                                loop={false}
                                loopClonesPerSide={2}
                                autoplay={false}
                                autoplayDelay={500}
                                autoplayInterval={3000}
                                onSnapToItem={(index) =>
                                    this.snapToIndex(index)
                                }
                            />
                            <Pagination
                                dotsLength={pageCount}
                                activeDotIndex={this.state.slider1ActiveSlide}
                                containerStyle={s.paginationContainer}
                                dotColor={PRIMARY_COLOR}
                                dotStyle={s.paginationDot}
                                inactiveDotColor={'#C4C4C4'}
                                inactiveDotOpacity={1}
                                inactiveDotScale={1}
                                carouselRef={this._slider5Ref}
                                tappableDots={!!this._slider5Ref}
                            />

                            <SelectSubCategory
                                category={selCategory}
                                isVisible={open_subcat}
                                onClose={() =>
                                    this.setState({open_subcat: false})
                                }
                                onSave={(new_data) => {
                                    this.setState({
                                        selTags: selTags.map((item) =>
                                            item.id == new_data.id
                                                ? new_data
                                                : item,
                                        ),
                                    });
                                }}
                            />
                        </View>
                    )}
                    {type !== 'interest' && (
                        <View
                            style={{
                                marginTop: 30,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <View style={[s.addressContainer]}>
                                <Text style={s.addressLabel}>
                                    {t('region')}
                                </Text>
                                <TextInput
                                    style={[s.address]}
                                    placeholder=""
                                    value={region}
                                    onChangeText={(region) =>
                                        this.props.setFeedSettings({region})
                                    }
                                />
                            </View>
                            <View style={[s.addressContainer]}>
                                <Text style={s.addressLabel}>{t('city')}</Text>
                                <TextInput
                                    style={[s.address]}
                                    placeholder=""
                                    value={city}
                                    onChangeText={(city) =>
                                        this.props.setFeedSettings({city})
                                    }
                                />
                            </View>
                            <View style={[s.addressContainer]}>
                                <Text style={s.addressLabel}>{t('zip')}</Text>
                                <TextInput
                                    style={[s.address]}
                                    placeholder=""
                                    value={zip}
                                    onChangeText={(zip) =>
                                        this.props.setFeedSettings({zip})
                                    }
                                />
                            </View>
                        </View>
                    )}
                </ScrollView>
            </View>
        );
    }
}
const mapStateToProps = (state) => ({
    categories: state.category.categories,
    links: state.category.links,
    meta: state.category.meta,

    selected_categories: state.feed.selected_categories,
    region: state.feed.region,
    city: state.feed.city,
    zip: state.feed.zip,
});

const mapDispatchToProps = {
    searchClubCategories,
    setFeedSettings,
    getUserFeed,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(
    hoistStatics(
        withTranslation('userclubsetting')(UserClubSettingEdit),
        UserClubSettingEdit,
    ),
);
