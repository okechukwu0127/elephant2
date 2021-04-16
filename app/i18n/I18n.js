import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './translations/en.json';
import de from './translations/de.json';

//import { Localization } from 'expo-localization';

// creating a language detection plugin using expo
// http://i18next.com/docs/ownplugin/#languagedetector
const languageDetector = {
    type: 'languageDetector',
    async: false, // flags below detection to be async
    detect: callback => {
        return 'de';
        //return /*'en'; */ Localization.getLocalizationAsync().then(({ locale }) => {
        //  callback(locale);
        //});
    },
    init: () => {},
    cacheUserLanguage: () => {},
};

i18n.use(languageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'de',
        resources: {en, de},
        debug: true,
        interpolation: {
            escapeValue: false, // not needed for react as it does escape per default to prevent xss!
        },
        react: {
            useSuspense: false,
        },
        //ns: ['common'],
        defaultNS: 'common',
    });

export default i18n;
