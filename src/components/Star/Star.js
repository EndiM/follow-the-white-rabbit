import React from 'react';

const Star = ({ className, starStyle, wrapperStyle, ...rest }) => ([
    <svg key={rest.index} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 79.7 79.7" style={{ ...wrapperStyle }}  {...rest}>
        <path fill="transparent" d="M0 0h79.7v79.7H0z" />
        <path style={{ ...starStyle }} d="M39.9 53.9L52 50.7l5.1 15.7-17.2-12.5zm27.9-20.3H46.4l-6.6-20.3-6.6 20.3H11.8l17.3 12.6-6.6 20.3L39.8 54l10.7-7.8 17.3-12.6z" fill="#fff" />
    </svg>
])

export default Star;

