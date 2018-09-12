import React, { Component } from 'react';
import RangeInput from './RangeInput/RangeInput';
import GridSizePicker from './GridSizePicker/GridSizePicker';
import ColorPicker from './ColorPicker/ColorPicker';

class CustomizationPanel extends Component {
    constructor() {
        super();
        this._panel = null;
        this.state = {
            currentPosition: { x: 50, y: 50 },
            offset: { x: 0, y: 0 },
            dragging: false
        }
    }

    saveRef = (node) => {
        this._panel = node;
    }

    onMouseMove = (e) => {
        const { dragging } = this.state;
        if (!dragging) return;
        this.setState((state) => ({
            currentPosition: {
                x: e.clientX - state.offset.x,
                y: e.clientY - state.offset.y
            }
        }))
    }
    onMouseDown = (e) => {
        let relativePosition = this._panel.getBoundingClientRect();
        let position = { x: e.clientX, y: e.clientY };
        this.setState(() => ({
            dragging: true,
            offset: {
                x: position.x - relativePosition.left,
                y: position.y - relativePosition.top
            }
        }));
    }
    onMouseUp = () => {
        this.setState(() => ({
            dragging: false
        }));
    }

    componentDidUpdate(props, state) {
        const { dragging } = this.state;
        if (dragging && !state.dragging) {
            document.addEventListener('mousemove', this.onMouseMove)
            document.addEventListener('mouseup', this.onMouseUp)
        } else if (!dragging && state.dragging) {
            document.removeEventListener('mousemove', this.onMouseMove)
            document.removeEventListener('mouseup', this.onMouseUp)
        }
    }
    render() {
        const { unitWidth, changeUnitSize, changeGridSize, columns, unitBorderColor, unitBodyColor, changeUnitColor } = this.props;
        const { currentPosition } = this.state;
        return (
            <div className="customization-panel"
                ref={this.saveRef}
                style={{ left: currentPosition.x, top: currentPosition.y }}
                onMouseDown={this.onMouseDown}
                onMouseUp={this.onMouseUp}>
                <span className="hint">If I'm in the way, drag me.</span>
                <RangeInput unitWidth={unitWidth} onChange={changeUnitSize} min={300} max={450} />
                <GridSizePicker columns={columns} onChange={changeGridSize} />
                <ColorPicker name="border" value={unitBorderColor} onChange={changeUnitColor} />
                <ColorPicker name="body" value={unitBodyColor} onChange={changeUnitColor} titleVisible={false} />
            </div>
        )
    }
}
export default CustomizationPanel;