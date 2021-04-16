import React from 'react';
import {SvgXml} from 'react-native-svg';

export default function HomePlusIcon(props) {
    return <SvgXml xml={home_plus(props.color)} {...props} />;
}

const home_plus = color => `<svg width="42" height="40" viewBox="0 0 42 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M5 15L20 3.33337L35 15V33.3334C35 35.1743 33.5076 36.6667 31.6667 36.6667H8.33333C6.49238 36.6667 5 35.1743 5 33.3334V15Z" stroke="${color}" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15 36.6667V20H25V36.6667" stroke="${color}" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="35" cy="13" r="7" fill="${
    color === '#642FD0' ? '#F3F8FF' : '#642FD0'
}"/>
<path d="M35 8.91663V17.0833" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M30.917 13H39.0837" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
