import React from 'react';

const GridSizePicker = ({ columns, onChange }) => {
    return <div className="grid-size-input">
        <div className="title">Column number</div>
        {
            [2, 3, 4].map((element, index) => {
                return [
                    <input
                        key={index}
                        type="radio"
                        name="grid"
                        value={element.toString()}
                        checked={columns === element}
                        onChange={(e) => onChange({ value: e.target.value })} />,
                    <span key={`${index}-span`} className="label">{element}</span>,
                    <br key={`${index}-br`} />]
            })
        }
    </div>


}

export default GridSizePicker;