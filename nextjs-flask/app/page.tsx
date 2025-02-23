'use client';
import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { Map as LeafletMap, LatLngBoundsExpression, LatLngExpression, Control, GeoJSON } from 'leaflet';
import { Waves } from "lucide-react";
import chroma from 'chroma-js';

import 'leaflet/dist/leaflet.css';

import { getReq, getPredict } from './utils/api'


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

            // Dont touch. Thanks :)
            /*
            update(props?: any) {
              if (!this._div) return;
              this._div.innerHTML = '<h4>California WildFire Watch</h4>' +
                (props ? '<b>' + props.name + '</b><br />' + props.risk + '%' : 'Hover over a county');
            }
            */

            update(props?: any) {
              if (!this._div) return;
              this._div.innerHTML = '<h4>California Wild Fire Watch</h4>'+
           // (props ? `<b>County: ${props.name}</b><br>Fire Likelihood: ${props.risk}%` : 'Hover over a county');
              (props ? `<b>County: ${props.CountyName}</b><br>Fire Likelihood: ${props.risk}%` : 'Hover over a county');
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

          
          // New way to change counties colors 
          // Hard coding
          const countyColors: Record<string, number> = {
            "Alameda": 3,
            "Alpine": 2,
            "Amador": 1,
            "Butte": 4,
            "Calaveras": 2,
            "Colusa": 3,
            "Contra Costa": 1,
            "Del Norte": 4,
            "El Dorado": 2,
            "Fresno": 3,
            "Glenn": 1,
            "Humboldt": 4,
            "Imperial": 2,
            "Inyo": 3,
            "Kern": 4,
            "Kings": 1,
            "Lake": 2,
            "Lassen": 3,
            "Los Angeles": 4,
            "Madera": 1,
            "Marin": 2,
            "Mariposa": 3,
            "Mendocino": 4,
            "Merced": 1,
            "Modoc": 2,
            "Mono": 3,
            "Monterey": 4,
            "Napa": 1,
            "Nevada": 2,
            "Orange": 3,
            "Placer": 4,
            "Plumas": 1,
            "Riverside": 2,
            "Sacramento": 3,
            "San Benito": 4,
            "San Bernardino": 1,
            "San Diego": 2,
            "San Francisco": 3,
            "San Joaquin": 4,
            "San Luis Obispo": 1,
            "San Mateo": 2,
            "Santa Barbara": 3,
            "Santa Clara": 4,
            "Santa Cruz": 1,
            "Shasta": 2,
            "Sierra": 3,
            "Siskiyou": 4,
            "Solano": 1,
            "Sonoma": 2,
            "Stanislaus": 3,
            "Sutter": 4,
            "Tehama": 1,
            "Trinity": 2,
            "Tulare": 3,
            "Tuolumne": 4,
            "Ventura": 1,
            "Yolo": 2,
            "Yuba": 3
          };


          // Working getcolor and style
          
          const getColor = (risk: number): string => {
            return         risk > 4  ? '#8B0000' :
                           risk > 3  ? '#FF0000' :
                           risk > 2  ? '#FFA500' :
                           risk > 1  ? '#FFFF00' :
                           risk > 0  ? '#32CD32' :
                                '#006400';
          }; 

        // working style (don't touch)
          /*
          const style = (feature: GeoJSON.Feature): L.PathOptions => {
            return {
              fillColor: getColor(feature.properties?.riskfactor || 1),
              weight: 2,
              opacity: 1,
              color: 'white',
              dashArray: '3',
              fillOpacity: 0.7
            };
          };
          */
    
          // New
          const style = (feature: GeoJSON.Feature): L.PathOptions => {
            const countyName = feature.properties?.CountyName; 
            const riskLevel = countyColors[countyName] ?? feature.properties?.riskfactor ?? 1; // Use assigned risk or default
          
            return {
              fillColor: getColor(riskLevel), // Automatically sets the color
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

          // Dont touch (Least Updated but works)
          /*
          const onEachFeature = (_feature: GeoJSON.Feature, layer: GeoJSONLayer) => {
            layer.on({
              mouseover: highlightFeature,
              mouseout: resetHighlight,
              click: zoomToFeature
            });
          };
          */

          // Dont touch (One extra feature)
          /*
          const onEachFeature = (feature: GeoJSON.Feature, layer: GeoJSONLayer) => {
            layer.on({
              mouseover: (e) => {
                highlightFeature(e);
                info.update({ 
                  name: feature.properties?.name || "Unknown County", 
                  risk: feature.properties?.riskfactor || "N/A" 
                });
              },
              mouseout: (e) => {
                resetHighlight(e);
                info.update();
              },
              click: zoomToFeature
            });
          };
          */

          // Don't touch. Thanks :)
          // Latest onEachFeature 
          
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
              // old click feature
              // click: zoomToFeature

              // new 
              
              click: (e) => {
                zoomToFeature(e); // Keep zoom-in functionality
          
                // Remove previous marker if it exists
                if (mapRef.current!.pinMarker) {
                  mapRef.current!.removeLayer(mapRef.current!.pinMarker);
                }
          
                // Add a blue pin icon at the clicked location
                const pinMarker = L.marker(e.latlng, {
                  icon: L.icon({
                    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Map_marker.svg/1200px-Map_marker.svg.png',  // Blue pin icon
                    iconSize: [32, 32], 
                    iconAnchor: [16, 32], 
                  })
                }).addTo(mapRef.current!);
          
                // Store reference to remove later
                mapRef.current!.pinMarker = pinMarker;
              }
                

              
              // end
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

              div.innerHTML = '<h4>Fire Likelihood </h4><div style = background: linear-gradient(to right, #FFEDA0, #FED976, #FEB24C, #FD8D3C, #FC4E2A, #E31A1C, #BD0026, #800026); height: 15px; margin-bottom: 5px;"></div>';

              // Old Grading System
              /*
              for (let i = 0; i < grades.length; i++) {
                labels.push(
                  '<i style="background:' + getColor(grades[i]) + '"></i> ' +
                  grades[i] 
                );
              }
              */

              for (let i = 0; i < grades.length; i++) { 
                let labelText = "";

                switch (grades[i]) {
                    case 1:
                        labelText = "Safe";
                        break;
                    case 2:
                        labelText = "Caution";
                        break;
                    case 3:
                        labelText = "Warning";
                        break;
                    case 4:
                        labelText = "Danger";
                        break;
                    default:
                        labelText = "Unknown"; // In case there are unexpected values
                }

                labels.push(
                    '<i style="background:' + getColor(grades[i]) + '"></i> ' +
                    grades[i] + " - " + labelText
                );
            }


              div.innerHTML += labels.join('<br>');
              // Forecast bar
             // div.innerHTML += '<h4>Forecast</h4><div id="forecast" style="padding: 5px; background: #f8f8f8; border-radius: 5px;">Loading...</div>';
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
            var tmp = getReq(e.latlng.lat, e.latlng.lng)
            console.log(tmp)
            getPredict(tmp)
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
      <h1 className="font-bold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-blue-100 flex items-center gap-2">
        <span className="bg-gradient-to-b from-red-500 via-orange-400 to-green-500 bg-clip-text text-transparent">
          Heatmap
        </span>
        <span className="text-lg text-gray-500">by</span>
        <span className="text-light-blue-400 flex items-center gap-1">
          River <Waves className="w-8 h-8 text-blue-400" />
        </span>
      </h1>
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <DynamicMap />
      </div>
    </main>
  )}