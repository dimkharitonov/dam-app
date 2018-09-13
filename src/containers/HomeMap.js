import React from 'react';
import { compose, withProps } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";

export const HomeMap = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyB6r727cEdjMmJTWw6vGETrtOoS3Uq7KuQ",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `480px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap
    defaultZoom={4}
    defaultCenter={{ lat: 58, lng: 20 }}
  >
    {props.assets &&
      props.assets
        .map(asset => {
          const coordinates = asset.coordinates && JSON.parse(asset.coordinates);
          return { lat: (coordinates && coordinates.lat) || undefined, lng: (coordinates && coordinates.lon) || undefined };
        })
        .filter( ({lat, lng }) => lat && lng )
        .map(({lat, lng }, idx) => <Marker position={ {lat, lng } } key={lat+lng+idx}/> )
      }
  </GoogleMap>
);
