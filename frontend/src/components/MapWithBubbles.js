import states10m from 'assets/geo-data/states-10m.json';
import states from 'assets/geo-data/us-states.json';
import { scaleLinear } from 'd3-scale';
import {geoAlbersUsa} from "d3-geo";
import React, { Component } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Markers,
  ZoomableGroup,
} from 'react-simple-maps';
import { getColor } from 'utils/colors';

class BubbleMap extends Component {
  state = {
    states,
  };

  render() {
    const secondaryColor = getColor('secondary');
    const lightColor = getColor('light');

    return (
      <ComposableMap
        projection={geoAlbersUsa}
        projectionConfig={{ scale: 1000 }}
        width={980}
        height={551}
        style={{
          width: '100%',
          height: 'auto',
        }}
      >
        <ZoomableGroup center={[ 0, 0 ]} disablePanning>
          <Geographies geography={states10m}>
            {(geographies, projection) =>
              geographies.map(
                (geography, i) =>
                  geography.id !== 'ATA' && (
                    <Geography
                      key={i}
                      geography={geography}
                      projection={projection}
                      style={{
                        default: {
                          fill: lightColor,
                          stroke: '#9EA4AA',
                          strokeWidth: 0.5,
                          outline: 'none',
                        },
                        hover: {
                          fill: '#FFB64C',
                          stroke: '#FFB64C',
                          strokeWidth: 0.75,
                          outline: 'none',
                        },
                        pressed: {
                          fill: secondaryColor,
                          stroke: secondaryColor,
                          strokeWidth: 0.75,
                          outline: 'none',
                        },
                      }}
                    />
                  ),
              )
            }
          </Geographies>
          <Markers>
          </Markers>
        </ZoomableGroup>
      </ComposableMap>
    );
  }
}

export default BubbleMap;
