import React, {useState} from 'react';
import {CustomTextInput} from '..';
import {GRAY_COLOR, PRIMARY_TEXT_COLOR} from '../../themes/colors';

export default function CustomFocusInput(props) {
    const [editing, setEditing] = useState(false);
    return (
        <CustomTextInput
            {...props}
            style={[
                props.style,
                {
                    color:
                        !editing && !props.isMoney
                            ? GRAY_COLOR
                            : PRIMARY_TEXT_COLOR,
                },
            ]}
            onFocus={() => setEditing(true)}
            onBlur={() => {
                setEditing(false);
                if (props.onBlur) props.onBlur();
            }}
            value={
                !props.value
                    ? null
                    : `${props.isMoney && !editing ? 'CHF ' : ''}` +
                      (!editing && props.bluredValue
                          ? props.bluredValue
                          : props.value)
            }
        />
    );
}
