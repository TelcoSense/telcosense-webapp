import { ReactNode } from '@tanstack/react-router'
import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import 'leaflet/dist/leaflet.css'

type MapProps = {
  children?: ReactNode
}

const Map = ({ children }: MapProps) => {
  return (
    <MapContainer
      center={[49.8037633, 15.4749126]}
      zoom={8}
      minZoom={3}
      className="h-[96vh] z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  )
}

export default Map
