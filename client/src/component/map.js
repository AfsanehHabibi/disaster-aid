import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';


export class SimpleMap extends Component {
  constructor(props) {
    super(props);
    const value = props.value || {};
    this.state = {
      value,
      latestLat: 35.697736,
      latestLng: 51.386228
      // ...
    };
  }
  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(((position) => {
        this.setState({
          center: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          },
          latestLat: position.coords.latitude,
          latestLng: position.coords.latitude
        });
        console.debug(this.state.center)
      }));
    } else {

    }
  }
  handleChange = (value) => {
    this.setState({ value });
    const { onChange } = this.props;
    if (onChange) {
      onChange({ ...this.state, ...{ value } });
    }
  }
  static defaultProps = {
    center: {
      lat: 35.697736,
      lng: 51.386228
    },
    zoom: 11
  };


  _onClick = ({ x, y, lat, lng, event }) => {
    console.debug(x, y, lat, lng)
    console.debug("clicked1")
    this.setState({
      latestLat: lat,
      latestLng: lng
    })
    this.handleChange(`{"lat":"${lat}","long":"${lng}"}`);
  }

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '40vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_MAP_API_KEY/* YOUR KEY HERE */ }}
          defaultCenter={this.props.center}
          center={this.state.center}
          defaultZoom={this.props.zoom}
          onClick={this._onClick}
          // this is a temporary fixation for a bug in google-map-react there is a ongoing
          // issue pool for this https://github.com/google-map-react/google-map-react/pull/873
          // change this part of code if package fixed issue
          distanceToMouse={() => { }}
          //
        >
          <Marker
            lat={this.state.latestLat}
            lng={this.state.latestLng}
            text='here'
          />
        </GoogleMapReact>
      </div>
    );
  }
}

class Marker extends React.Component {
  render() {
    return (
      <div>{this.props.text}</div>
    );
  }

}