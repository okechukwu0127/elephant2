import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import Carousel, {Pagination, ParallaxImage} from 'react-native-snap-carousel';
import s, {sliderWidth, itemWidth, itemHorizontalMargin} from './styles';
import ImageSlider1 from '../../assets/Intro1.png';
import ImageSlider2 from '../../assets/Intro2.png';
import ImageSlider3 from '../../assets/Intro3.png';
import ImageSlider4 from '../../assets/Intro4.png';
import {PRIMARY_COLOR} from '../../themes/colors';
import {withTranslation} from 'react-i18next';

const SLIDER_1_FIRST_ITEM = 0;
const ENTRIES1 = [
    {
        index: 0,
        subtitle: 'intro1',
        illustration: ImageSlider1,
    },
    {
        index: 1,
        subtitle: 'intro2',
        illustration: ImageSlider2,
    },
    {
        index: 2,
        subtitle: 'intro3',
        illustration: ImageSlider3,
    },
    {
        index: 3,
        subtitle: 'intro4',
        illustration: ImageSlider4,
    },
];

class SliderEntry extends React.Component {
    get image() {
        const {
            data: {illustration},
            parallax,
            parallaxProps,
            even,
        } = this.props;

        return false ? (
            <ParallaxImage
                source={illustration}
                containerStyle={[
                    s.imageContainer,
                    even ? s.imageContainerEven : {},
                ]}
                style={s.image}
                parallaxFactor={0.35}
                showSpinner={true}
                spinnerColor={
                    even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'
                }
                {...parallaxProps}
            />
        ) : (
            <Image source={illustration} style={s.image} />
        );
    }

    render() {
        const {} = this.props;
        return (
            <TouchableOpacity activeOpacity={1} style={s.slideInnerContainer}>
                <View style={[s.imageContainer]}>{this.image}</View>
            </TouchableOpacity>
        );
    }
}
class IntroScreen extends React.Component {
    static navigationOptions = ({navigation}) => ({
        header: null,
    });
    state = {
        slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
    };
    constructor(props) {
        super(props);
        this._renderItemWithParallax = this._renderItemWithParallax.bind(this);
    }
    _renderItemWithParallax({item, index}, parallaxProps) {
        return (
            <SliderEntry
                data={item}
                even={(index + 1) % 2 === 0}
                parallax={true}
                parallaxProps={parallaxProps}
                dotCount={ENTRIES1.length}
            />
        );
    }
    render() {
        const {t, i18n} = this.props;
        return (
            <View style={s.container}>
                <View style={s.header}>
                    <View>
                        <Text style={s.headerTitle}>{t('title')}</Text>
                        <Text style={s.headerPage}>
                            {t('step')} {this.state.slider1ActiveSlide + 1}/4
                        </Text>
                        <Pagination
                            dotsLength={ENTRIES1.length}
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
                    </View>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('App')}>
                        <Text style={s.headerDismiss}>{t('skip')}</Text>
                    </TouchableOpacity>
                </View>
                <View style={s.content}>
                    <Carousel
                        ref={(c) => (this._slider5Ref = c)}
                        data={ENTRIES1}
                        renderItem={this._renderItemWithParallax}
                        sliderWidth={sliderWidth}
                        itemWidth={itemWidth}
                        hasParallaxImages={true}
                        firstItem={SLIDER_1_FIRST_ITEM}
                        inactiveSlideScale={0.97}
                        inactiveSlideOpacity={1}
                        // inactiveSlideShift={20}
                        containerCustomStyle={s.slider}
                        contentContainerCustomStyle={s.sliderContentContainer}
                        loop={false}
                        loopClonesPerSide={2}
                        autoplay={false}
                        autoplayDelay={500}
                        autoplayInterval={3000}
                        onSnapToItem={(index) =>
                            this.setState({slider1ActiveSlide: index})
                        }
                    />
                </View>
                <TouchableOpacity
                    style={s.nextBtn}
                    onPress={() => {
                        this.props.navigation.navigate('App');
                    }}>
                    <Text style={s.nextBtnLabel}>{t('next')}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default withTranslation('onboading')(IntroScreen);
