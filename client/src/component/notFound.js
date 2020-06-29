import React from 'react';
import Image from 'images/not_found.jpg';
export class NotFound extends React.Component {
    render() {
        return (
            <img src={Image} width="100%" height="100%"alt="page not found"/>
        );
    }
}