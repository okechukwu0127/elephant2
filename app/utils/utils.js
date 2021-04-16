import Toast from 'react-native-root-toast';
import {PRIMARY_COLOR} from '../themes/colors';
import {Linking} from 'react-native';

export const searchWithKeyword = (data, keyword, fieldname) => {
    if (keyword && keyword.length > 0) {
        const regex = new RegExp(`${keyword.trim()}`, 'i');
        return data.filter(
            item => item[fieldname] && item[fieldname].search(regex) >= 0,
        );
    }
    return data;
};
export const errorHTTP = err => {
    if (err.errors) {
        const keys = Object.keys(err.errors);
        if (keys.length > 0) {
            showMessage(
                Array.isArray(err.errors[keys[0]])
                    ? err.errors[keys[0]][0]
                    : err.errors[keys[0]],
            );
            return;
        }
    }
    if (err.message) {
        showMessage(err.message);
    }
};
export const showMessage = (msg, success) => {
    if (!msg) return;
    if (msg?.toLowerCase().includes('unauthenticated')) return;
    if (msg?.toLowerCase().includes('too many attempts')) return;
    let toast = Toast.show(msg, {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        shadow: true,
        animation: true,
        hideOnPress: true,
        backgroundColor: success ? PRIMARY_COLOR : '#FABD3B',
        delay: 0,
        opacity: 1,
    });
    setTimeout(function() {
        Toast.hide(toast);
    }, 3000);
};
export const checkBoardMember = (user_id, boadmembers) => {
    const find_obj =
        boadmembers &&
        boadmembers.find(item => item.user && item.user.id === user_id);
    return find_obj;
};
export const checkCreatorClub = (user_id, club) => {
    const creator = club && club.creator;
    return creator && creator.id == user_id ? true : false;
};
export const removeDuplicates = (arr, fieldname) => {
    return arr
        ? arr.filter(
              (thing, index, self) =>
                  index ===
                  self.findIndex(t => t[fieldname] === thing[fieldname]),
          )
        : [];
};
export const separateAddress = components => {
    let zip = null,
        street = null,
        region = null;
    if (components && components.length) {
        components.map(item => {
            if (item.types.includes('postal_code')) {
                zip = item.long_name;
            }
            if (item.types.includes('street_number')) {
                if (street) street = item.long_name + ' ' + street;
                else street = item.long_name;
            }
            if (item.types.includes('route')) {
                if (street) street = street + ' ' + item.long_name;
                else street = item.long_name;
            }
            if (item.types.includes('locality')) {
                region = item.long_name;
            }
        });
    }
    return {
        street,
        zip,
        region,
    };
};
export const getExtFromMime = mime => {
    if (mime && mime.length > 0) {
        var a = mime.split('/');
        if (a.length > 0) {
            return a[1];
        }
    }
    return 'png';
};
export const formatPhoneNumber = phone => {
    if (!phone) return null;
    return phone
        .replace(/[^\dA-Z+]/g, '')
        .replace(/(.{3})/g, '$1 ')
        .trim();
};
export const openSocialLink = (type, url) => {
    if (url && typeof url == 'string') {
        if (url.toLowerCase().startsWith('https://')) {
            // if (type === 'facebook') {
            //     const profile = url.split('/')[url.split('/').length - 1];
            //     Linking.openURL(`fb://page/${profile}`);
            //     return;
            // }
            Linking.openURL(url);
        } else {
            switch (type) {
                case 'facebook':
                    Linking.openURL(`fb://profile/${url}`);
                    break;
                case 'instagram':
                    Linking.openURL(`https://instagram.com/${url}`);
                    break;
                case 'linkedin':
                    Linking.openURL(
                        `http://www.linkedin.com/profile/view?id=${url}`,
                    );
                    break;
                case 'xing':
                    Linking.openURL(`https://xing.com/${url}`);
                    break;
                case 'twitter':
                    Linking.openURL(`https://twitter.com/${url}`);
                    break;
                case 'website':
                    Linking.openURL(`https://${url}`);
                    break;
                default:
                    alert('Invalid url');
                    break;
            }
        }
    }
};
export const getUserName = user => {
    if (user) {
        if (user.first_name || user.last_name)
            return (user.first_name || '') + ' ' + (user.last_name || '');
        else return user.email || '';
    }
    return '';
};

export const isLatitude = lat => {
    const _lat = parseFloat(lat);
    return isFinite(_lat) && Math.abs(_lat) <= 90;
};

export const isLongitude = lng => {
    const _lng = parseFloat(_lng);
    return isFinite(_lng) && Math.abs(_lng) <= 180;
};
export const getFormatAddress = address => {
    if (address) {
        address = address.replace(/,/g, ',\n');
        // address = address.replace(',\n', ',');
    }
    return address;
};

export const checkLength = (str, maxLength) => {
    if (!str) return null;
    if (str.length < maxLength) return str;
    return str.slice(0, 30) + '...';
};

export const validateEmail = email => {
    if (!email || email.length === 0) return false;
    const emailTest = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    return emailTest.test(email);
};
