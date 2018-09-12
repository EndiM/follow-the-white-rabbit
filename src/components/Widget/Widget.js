import React, { Component } from 'react';
import Star from '../Star/Star';
import CustomizationPanel from '../CustomizationPanel/CustomizationPanel';
import debounce from 'lodash/debounce';

const ratingSystemColors = {
    0: { color: '#fff' },
    1: { color: '#ff3722' },
    2: { color: '#ff8622' },
    3: { color: '#ffce00' },
    4: { color: '#73cf11' },
    5: { color: '#00b67a' }
}

// star system position related constants
const leftInterval = 15;
const leftStartingPoint = 9;
const starHeightInterval = 17.684;

class Widget extends Component {

    constructor() {
        super();
        this.state = {
            reviews: [],
            unitWidth: 350,
            numberOfGridColumns: 4,
            numberOfGridRows: 3,
            unitBorderColor: "#d79922",
            unitBodyColor: "#103252"
        }
        this._content = null;
    }

    componentDidMount() {
        //fetching reviews data from local json file
        fetch('../../../data/reviews.json')
            .then(response => response.json())
            .then(data => this.setState(() => ({
                originalReviews: [...data.reviews, ...data.reviews, ...data.reviews],
                reviews: [...data.reviews, ...data.reviews, ...data.reviews]
            })))
    }

    // determine if reviewBody can fit the widget unit/hexagon
    // if not shorten it and show Read More sign
    calculateBodyTextHeight = ({ node, index }) => {
        setTimeout(function () {
            if (node.clientHeight > this.state.unitWidth - 10) {
                let newBodyText = this.shortenReviewBodyText({
                    text: this.state.reviews[index].reviewBody,
                    currentHeight: node.clientHeight,
                    height: this.state.unitWidth,
                    addOnHeight: Array.from(node.childNodes)
                        .filter(e => e.className !== 'body')
                        .map(e => e.clientHeight)
                        .reduce((e, currentVal) => e + currentVal)
                })
                let reviews = this.state.reviews.map((review, i) => {
                    if (i !== index) {
                        return review;
                    }
                    return Object.assign({}, review, { reviewBody: newBodyText, shorten: true })
                })
                this.setState(() => ({ reviews: reviews }))
            }
        }.bind(this), 150);
    }


    saveContentRef = ({ node, index }) => {
        this._content = node;
        if (node) {
            // this is a BIG NO-NO, updating state in ref callback can be dangerous
            // and result in continuous loop but here I'm using it just for 
            // text truncating - read more is not functional!
            this.calculateBodyTextHeight({ node, index });
        }
    }

    // shorten reviewBody text
    shortenReviewBodyText = ({ text, currentHeight, height, addOnHeight }) => {
        return text.slice(0, Math.ceil((text.length - 3) / (currentHeight / height + addOnHeight / height))) + "...";
    }

    // calculating single star postion to have 5 stars at an angle that matches hexagon side
    calculateStarPosition = ({ current }) => {
        return {
            width: `${27}%`,
            position: "absolute",
            bottom: `${current * starHeightInterval}%`,
            left: `${current * leftInterval + leftStartingPoint}%`,
        }
    }

    // calculating grid size that can accomodate hexagons
    calculateGridSize = () => {
        const { numberOfGridColumns, numberOfGridRows, unitWidth } = this.state;
        return {
            'gridTemplate':
                `repeat(${numberOfGridRows}, ${unitWidth / 2}px)/repeat(${numberOfGridColumns}, 
                ${unitWidth * 7.5 / 100 + unitWidth / 4}px 
                ${unitWidth / 2}px) ${unitWidth * 7.5 / 100 + unitWidth / 4}px`
        }
    }

    // calculating widget style and position of an unit/hexagon in grid
    calculateWidgetStyle = ({ index }) => {
        const { unitWidth, numberOfGridColumns, unitBorderColor } = this.state;
        let column = (index + 1) % numberOfGridColumns || numberOfGridColumns;
        let row = Math.ceil((index + 1) / numberOfGridColumns);

        const gridItemProperties = {
            'gridColumnStart': `${column + column - 1}`,
            'gridColumnEnd': 'span 3',
            'gridRowStart': `${column % 2 ? (row + row - 1) : (row + row)}`,
            'gridRowEnd': 'span 2'
        }

        return {
            width: `${unitWidth}px`,
            height: `${unitWidth}px`,
            background: `${unitBorderColor}`,
            ...gridItemProperties
        }
    }

    // change width/height of unit/hexagon
    // debouncing event for better performance
    // populate reviews with an original version of the array that has unchanged reviewBody
    changeUnitSize = debounce((e) => {
        this.setState((state) => ({
            unitWidth: e.target.value,
            reviews: [...state.originalReviews]
        }))
    }, 300);

    // fill star to accoring color
    fillStar = ({ current, rating }) => {
        if (current <= parseInt(rating) && parseInt(rating) !== 0) {
            return { fill: `${ratingSystemColors[rating].color}` }
        }
        return { fill: `${ratingSystemColors[0].color}` }
    }

    // change grid size according to user input
    changeGridSize = ({ value }) => {
        this.setState(() => ({ numberOfGridColumns: parseInt(value) }));
    }

    // change unit/hexagon body and border color according to user input
    changeUnitColor = ({ value, type }) => {
        switch (type) {
            case 'body': {
                this.setState(() => ({ unitBodyColor: value }));
                break;
            }
            case 'border': {
                this.setState(() => ({ unitBorderColor: value }));
                break;
            }
            default: {
                this.setState(() => ({ unitBodyColor: value, unitBorderColor: value }));
            }
        }
    }

    render() {
        const { reviews, unitWidth, unitBodyColor, numberOfGridColumns, unitBorderColor } = this.state;

        return [
            <CustomizationPanel
                key="0"
                unitWidth={unitWidth}
                changeUnitSize={this.changeUnitSize}
                columns={numberOfGridColumns}
                changeGridSize={this.changeGridSize}
                unitBorderColor={unitBorderColor}
                unitBodyColor={unitBodyColor}
                changeUnitColor={this.changeUnitColor} />,

            <div key="1" className="widget-wrapper">
                <div className="list-wrapper" style={this.calculateGridSize()}>
                    {
                        reviews.map((review, index) => {
                            return (
                                <div key={index} className="unit-wrapper" style={this.calculateWidgetStyle({ index: index })}>
                                    <div className="unit" style={{ background: unitBodyColor }}>
                                        <div className="shape-text-before"></div>
                                        <div className="shape-text-after"></div>

                                        <div className="image-wrapper" style={{ background: unitBorderColor }}>
                                            <div className="image">
                                                <img src="./src/images/neo.gif" />
                                            </div>
                                        </div>
                                        <div className="rating-system-wrapper">
                                            {
                                                [...Array(5).keys()].map((star, index) => {
                                                    return <Star
                                                        key={star}
                                                        index={index}
                                                        className={ratingSystemColors[star + 1].className}
                                                        starStyle={this.fillStar({ current: star + 1, rating: review.starRating })}
                                                        wrapperStyle={this.calculateStarPosition({ current: star })}
                                                    />
                                                })
                                            }
                                        </div>
                                        <div className="content" ref={node => this.saveContentRef({ node, index })}>
                                            <span className="full-name">{review.fullName}</span>
                                            <span className="title">{review.reviewTitle}</span>
                                            <span className="body">
                                                <p>{review.reviewBody}</p>
                                                <span style={{ display: review.shorten ? "block" : "none" }} className="read-more">Read More</span>
                                            </span>
                                            <span className="location"><i>from</i>&nbsp;{review.location || "Unknown"}</span>

                                        </div>

                                    </div>
                                </div>

                            )
                        })
                    }
                </div>
            </div>
        ]
    }

}

export default Widget;

