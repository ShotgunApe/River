'use client';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import type { Map as LeafletMap, LatLngBoundsExpression } from 'leaflet';
import { getReq } from '@/app/utils/api';
import { countyColors, updateCountyColors } from '@/data/county';
import { MapProps, CustomControl, GeoJSONLayer } from '@/utils/interface';


const MapComponent: React.FC<MapProps> = ({ setCounty, setCountyProb }) =>{
  const mapRef = useRef<LeafletMap | null>(null);
  const geojsonRef = useRef<L.GeoJSON | null>(null);
  const infoRef = useRef<CustomControl | null>(null);
  const [loading, setLoading] = useState(true)

  var countyNameGlob = ""

  useEffect(() => {
    const loadMap = async () => {
      try {
        await updateCountyColors()
        setLoading(false);
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
              this._div.innerHTML = '<h4>California Wildfire Watch</h4>'+
              (props ? `<b>County: ${props.CountyName}</b>` : 'Hover over a county');
              countyNameGlob = props?.CountyName;
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

          const getColor = (risk: number): string => {
            return risk > 4  ? '#8B0000' :
                    risk > 3  ? '#FF0000' :
                    risk > 2  ? '#FFA500' :
                    risk > 1  ? '#FFFF00' :
                    risk > 0  ? '#32CD32' :
                    '#006400';
          }; 

          const style = (feature: any): any => {
            const countyName = feature.properties?.CountyName;
        
            // Ensure countyColors is updated
            if (Object.keys(countyColors).length === 0) {
              return {}; // Or return a default style until processing is complete
            }
        
            // Get the risk level from countyColors or fallback to the feature's riskfactor
            const riskLevel = countyColors[countyName] ?? feature.properties?.riskfactor ?? 1;
        
            return {
              fillColor: getColor(riskLevel), 
              weight: 2,
              opacity: 1,
              color: 'white',
              dashArray: '3',
              fillOpacity: 0.7
            };
          };

          const info = new InfoControl({ position: 'topright' });
          info.addTo(map);
          infoRef.current = info;

          const highlightFeature = (e: { target: any }) => {
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

          const onEachFeature = (feature: GeoJSON.Feature, layer: GeoJSONLayer) => {
            // Attach event listeners for hover effects
            layer.on({
              mouseover: (e) => {
                highlightFeature(e);
                if (feature.properties?.Name) {
                info.update({ 
               //name: feature.properties?.name || "Unknown County", 
                 name: feature.properties?.County.Name || "Unknown County",
                  risk: feature.properties?.riskfactor || "N/A" 
                });
              }
              },
              mouseout: (e) => {
                resetHighlight(e);
                info.update();
              },
              click: zoomToFeature
            });

            // Add county name as a permanent label
            if (feature.properties?.name) {
              layer.bindTooltip(feature.properties.name, { 
                permanent: true,  // Always visible
                direction: "center", // Centered inside the county
                className: "county-label", // Custom CSS for styling
              });
            }
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
              const grades = [1, 2, 3, 4];
              const labels = [];

              div.innerHTML = '<h4>Wild fire likelihood </h4><div style = background: linear-gradient(to right, #FFEDA0, #FED976, #FEB24C, #FD8D3C, #FC4E2A, #E31A1C, #BD0026, #800026); height: 15px; margin-bottom: 5px;"></div>';

              for (let i = 0; i < grades.length; i++) { 
                let labelText = "";

                switch (grades[i]) {
                    case 1:
                        labelText = "Safe: 0-30%";
                        break;
                    case 2:
                        labelText = "Caution: 30-60%";
                        break;
                    case 3:
                        labelText = "Warning: 60-85%";
                        break;
                    case 4:
                        labelText = "Danger: 85-100%";
                        break;
                    default:
                        labelText = "Unknown"; 
                }

                labels.push(
                    '<i style="background:' + getColor(grades[i]) + '"></i> ' +
                    grades[i] + " - " + labelText
                );
            }
              div.innerHTML += labels.join('<br>');
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
          //County Click
          map.on('click', async function(e) {
            var prediction = await getReq(e.latlng.lat, e.latlng.lng);
            console.log(prediction)
            setCounty(countyNameGlob)
            setCountyProb(prediction)
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
    <div>
      {loading ? (
        <div className="loading-spinner" style={{ color: 'white' }}></div>
      ) : (
        <div id="map" style={{ height: '600px', width: '100%' }}></div>
      )}
    </div>
    
  );
}

export default dynamic(() => Promise.resolve(MapComponent), { ssr: false });