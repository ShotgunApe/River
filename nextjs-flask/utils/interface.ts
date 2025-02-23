import { Control } from "leaflet";

export interface CustomControl extends Control {
  _div?: HTMLElement;
  update(props?: any): void;
}

export interface GeoJSONLayer extends L.Layer {
  feature?: GeoJSON.Feature;
  getBounds(): L.LatLngBounds;
}

export interface MapProps  {
  setCounty: (value: string) => void;
  setCountyProb: (value: any) => void;
}