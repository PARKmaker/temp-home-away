/**
 * Created by tkdgu:박상현 on 2024-10-23
 */
"use client";

import { icon } from "leaflet";
import { findCountryByCode } from "@/utils/countries";
import Title from "@/components/properties/title";
import CountryFlagAndName from "@/components/card/country-flag-and-name";
import { MapContainer, Marker, TileLayer, ZoomControl } from "react-leaflet";

const iconUrl =
  "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png";

const markerIcon = icon({ iconUrl, iconSize: [20, 30] });

export default function PropertyMap({ countryCode }: { countryCode: string }) {
  const defaultLocation = [51.505, -0.09] as [number, number];
  const location = findCountryByCode(countryCode)?.location as [number, number];

  return (
    <div className="mt-4">
      <div className="mb-4">
        <Title text="Where you will be staying" />
        <CountryFlagAndName countryCode={countryCode} />
      </div>
      <MapContainer
        scrollWheelZoom={false}
        zoomControl={false}
        className="relative z-0 h-[50vh] rounded-lg"
        center={location || defaultLocation}
        zoom={7}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        <Marker position={location || defaultLocation} icon={markerIcon} />
      </MapContainer>
    </div>
  );
}
