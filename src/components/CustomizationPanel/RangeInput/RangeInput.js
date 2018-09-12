import React from 'react';

const RangeInput = ({ unitWidth, onChange ,min, max }) => {
    return <div className="range-input">
        <div className="title">Unit width</div>
        <span className="min">{min}</span>
        <input
            className="range"
            key="0"
            type="range"
            min={min}
            max={max}
            onChange={(e) => (e.persist(), onChange(e))}
            onMouseDown={(e) => e.stopPropagation()}
            defaultValue={unitWidth} />
        <span className="max">{max}</span>
    </div>


}

export default RangeInput;