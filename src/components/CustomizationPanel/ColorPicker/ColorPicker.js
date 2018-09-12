import React, { Component } from 'react';

const ColorPicker = ({ name, value, onChange, titleVisible = true }) => {
    return <div className="color-picker-wrapper">
        <div className="color-picker">
            {titleVisible && <div className="title" >Color picker</div>}
            <input
                id={name}
                className="color"
                type="color"
                name={name}
                value={value}
                onChange={(e) => onChange({ value: e.target.value, type: name })} />
            <label htmlFor={name}>{name.toLowerCase().charAt(0).toUpperCase() + name.slice(1)}</label>
        </div>
    </div>


}

export default ColorPicker;