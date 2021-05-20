import React from 'react';

const InputCustomSelect = ({ options, currentValue, item, isDisabled = false, onChange }) => {
    return (
        <div>
            <select
                className="custom-select"
                data-style="btn-primary"
                name={item}
                onChange={onChange}
                value={currentValue}
                disabled={isDisabled}
            >
                {options.map(option =>
                    <option key={option} value={option}>{option}</option>
                )}
            </select>
        </div>
    );
}

export default InputCustomSelect;