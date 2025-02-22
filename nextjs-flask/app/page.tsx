'use client';
import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { Map as LeafletMap, LatLngBoundsExpression, LatLngExpression, Control, GeoJSON } from 'leaflet';

import 'leaflet/dist/leaflet.css';

import { getReq } from './utils/api'

// Extended interfaces for proper typing
interface CustomControl extends Control {
  _div?: HTMLElement;
  update(props?: any): void;
}

interface GeoJSONLayer extends L.Layer {
  feature?: GeoJSON.Feature;
  getBounds(): L.LatLngBounds;
}

const MapComponent = () => {
  const mapRef = useRef<LeafletMap | null>(null);
  const geojsonRef = useRef<L.GeoJSON | null>(null);
  const infoRef = useRef<CustomControl | null>(null);

  useEffect(() => {
    const loadMap = async () => {
      try {
        if (typeof window !== 'undefined' && !mapRef.current) {
          const L = (await import('leaflet')).default;

          // Create a custom control class
          class InfoControl extends L.Control {
            _div: HTMLElement | undefined;

            constructor(options?: L.ControlOptions) {
              super(options);
              this._div = undefined;
            }

            onAdd(map: L.Map) {
              this._div = L.DomUtil.create('div', 'info');
              this.update();
              return this._div;
            }

            update(props?: any) {
              if (!this._div) return;
              this._div.innerHTML = '<h4>California County Wild Fire and Temperatures Watch</h4>' +
                (props ? '<b>' + props.name + '</b><br />' + props.temperature + '°F' : 'Hover over a county');
            }
          }

          const californiaBounds: LatLngBoundsExpression = [
            [31.5, -325],
            [42.5, -60.5]
          ];

          const map = L.map('map', {
            center: [37.2, -119.5],
            zoom: 5.5,
            minZoom: 5.75,
            maxZoom: 10,
            maxBounds: californiaBounds,
            maxBoundsViscosity: 0.8
          });
          mapRef.current = map;

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            minZoom: 5,
            maxZoom: 10,
            attribution: '© OpenStreetMap',
            bounds: californiaBounds
          }).addTo(map);

          const getColor = (temp: number): string => {
            return temp > 100 ? '#800026' :
                   temp > 90  ? '#BD0026' :
                   temp > 80  ? '#E31A1C' :
                   temp > 70  ? '#FC4E2A' :
                   temp > 60  ? '#FD8D3C' :
                   temp > 50  ? '#FEB24C' :
                   temp > 40  ? '#FED976' :
                              '#FFEDA0';
          };

          const style = (feature: GeoJSON.Feature): L.PathOptions => {
            return {
              fillColor: getColor(feature.properties?.temperature || 0),
              weight: 2,
              opacity: 1,
              color: 'white',
              dashArray: '3',
              fillOpacity: 0.7
            };
          };

          // Initialize info control using the custom class
          const info = new InfoControl({ position: 'topright' });
          info.addTo(map);
          infoRef.current = info;

          const highlightFeature = (e: { target: GeoJSONLayer }) => {
            const layer = e.target;
            
            layer.setStyle({
              weight: 5,
              color: '#666',
              dashArray: '',
              fillOpacity: 0.7
            });

            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
              layer.bringToFront();
            }

            info.update(layer.feature?.properties);
          };

          const resetHighlight = (e: { target: GeoJSONLayer }) => {
            if (geojsonRef.current) {
              geojsonRef.current.resetStyle(e.target);
            }
            info.update();
          };

          const zoomToFeature = (e: { target: GeoJSONLayer }) => {
            map.fitBounds(e.target.getBounds());
          };

          const onEachFeature = (_feature: GeoJSON.Feature, layer: GeoJSONLayer) => {
            layer.on({
              mouseover: highlightFeature,
              mouseout: resetHighlight,
              click: zoomToFeature
            });
          };

          try {
            const response = await fetch('/cali-county-bounds.json');
            const data: GeoJSON.FeatureCollection = await response.json();
            const geojson = L.geoJSON(data, {
              style: style,
              onEachFeature: onEachFeature
            }).addTo(map);
            geojsonRef.current = geojson;
          } catch (error) {
            console.error('Error loading GeoJSON:', error);
          }

          // Create a custom legend control class
          class LegendControl extends L.Control {
            onAdd() {
              const div = L.DomUtil.create('div', 'info legend');
              const grades = [40, 50, 60, 70, 80, 90, 100];
              const labels = [];
              
              div.innerHTML = '<h4>Temperature (°F)</h4><div style="background: linear-gradient(to right, #FFEDA0, #FED976, #FEB24C, #FD8D3C, #FC4E2A, #E31A1C, #BD0026, #800026); height: 15px; margin-bottom: 5px;"></div>';
              
              for (let i = 0; i < grades.length; i++) {
                labels.push(
                  '<i style="background:' + getColor(grades[i]) + '"></i> ' +
                  grades[i] + (grades[i + 1] ? '–' + grades[i + 1] + '°F' : '+')
                );
              }
              
              div.innerHTML += labels.join('<br>');
              div.innerHTML += '<h4>Forecast</h4><div id="forecast" style="padding: 5px; background: #f8f8f8; border-radius: 5px;">Loading...</div>';
              return div;
            }
          }

          const legend = new LegendControl({ position: 'bottomright' });
          legend.addTo(map);

          const updateForecast = () => {
            const forecastElement = document.getElementById('forecast');
            if (forecastElement) {
              forecastElement.innerHTML = 'Tomorrow: High of 85°F, Low of 65°F';
            }
          };
          setTimeout(updateForecast, 1000);

          map.on('drag', () => {
            map.panInsideBounds(californiaBounds, { animate: true });
          });
          map.on('click', function(e) {        
            var popLocation= e.latlng;
            var popup = L.popup()
            .setLatLng(popLocation)
            .setContent('<p> Lat, Lon : ' + e.latlng.lat + ", " + e.latlng.lng + '</p>')
            .openOn(map);
            getReq(e.latlng.lat, e.latlng.lng)
        });
        }
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    loadMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  return (
    <div id="map" style={{ height: '600px', width: '100%' }}></div>
  );
};

const DynamicMap = dynamic(() => Promise.resolve(MapComponent), {
  ssr: false
});

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      <h1>Heatmap by Rivers</h1>
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <DynamicMap />
      </div>
    </main>
  );
}