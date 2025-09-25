import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { FiMap, FiLayers, FiThermometer, FiDroplet, FiWind, FiActivity } from 'react-icons/fi';
import { useCityData } from '../context/CityDataContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  overflow: hidden;
`;

const Header = styled.div`
  padding: 1rem 2rem;
  flex-shrink: 0;
`;

const Title = styled.h1`
  color: #1e293b;
  font-size: 1.75rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 1rem;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 1rem;
  flex: 1;
  padding: 0 2rem 2rem;
  min-height: 0;
`;

const MapWrapper = styled(motion.div)`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  min-height: 0;
  
  .leaflet-container {
    width: 100%;
    height: 100%;
    border-radius: 12px;
  }
`;

const MapPlaceholder = styled.div`
  text-align: center;
  color: #3b82f6;
  font-size: 1.125rem;
  font-weight: 600;
`;

const ControlPanel = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  max-height: 100%;
`;

const PanelTitle = styled.h3`
  color: #1e293b;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const LayerControl = styled.div`
  margin-bottom: 1.25rem;
`;

const LayerItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  background: ${props => props.active ? '#eff6ff' : '#f8fafc'};
  border: 1px solid ${props => props.active ? '#3b82f6' : '#e2e8f0'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #eff6ff;
    border-color: #3b82f6;
  }
`;

const LayerIcon = styled.div`
  margin-right: 0.75rem;
  margin-top: 0.125rem;
  color: ${props => props.active ? '#3b82f6' : '#64748b'};
`;

const LayerLabel = styled.div`
  flex: 1;
  color: ${props => props.active ? '#1e293b' : '#64748b'};
  font-weight: ${props => props.active ? '600' : '500'};
  font-size: 0.875rem;
`;

const LayerValue = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${props => props.active ? '#3b82f6' : '#64748b'};
`;

const LayerDescription = styled.div`
  font-size: 0.7rem;
  color: #94a3b8;
  margin-top: 0.25rem;
  line-height: 1.3;
`;

const DataSource = styled.div`
  font-size: 0.7rem;
  color: #64748b;
  background: #f1f5f9;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  margin-top: 0.4rem;
  display: inline-block;
`;

const DigitalTwin = () => {
  // const { selectedCity, nasaData, loading } = useCityData();
  const [activeLayers, setActiveLayers] = useState({
    satellite: true,
    temperature: false,
    vegetation: false,
    precipitation: false,
    airquality: false
  });

  const toggleLayer = (layer) => {
    setActiveLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };
  const { selectedCity } = useCityData();
  const [nasaData, setNasaData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/air_quality_frontend_data.json')
      .then(res => res.json())
      .then(data => {
        setNasaData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading JSON:', err);
        setLoading(false);
      });
  }, []);

  // const mapCenter = selectedCity?.coordinates ?
  //   [selectedCity.coordinates[0], selectedCity.coordinates[1]] :
  //   [23.8103, 90.4125];


  const mapCenter = nasaData?.airQuality?.location
    ? [nasaData.airQuality.location.latitude, nasaData.airQuality.location.longitude]
    : [23.8103, 90.4125];

  const mapZoom = 11;

  // Custom marker for temperature visualization
  const createTemperatureMarker = (temp) => {
    const color = temp > 25 ? '#ef4444' : temp > 15 ? '#f59e0b' : '#3b82f6';
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  const layers = [
    {
      key: 'satellite',
      label: 'Satellite Imagery',
      icon: <FiMap size={18} />,
      description: 'High-resolution satellite imagery',
      source: 'Landsat/Sentinel'
    },
    {
      key: 'temperature',
      label: 'Land Surface Temperature',
      icon: <FiThermometer size={18} />,
      value: nasaData?.temperature?.current?.value,
      unit: '°C',
      description: 'Surface temperature from thermal infrared sensors',
      source: 'NASA MODIS/VIIRS'
    },
    {
      key: 'vegetation',
      label: 'Vegetation Index (NDVI)',
      icon: <FiLayers size={18} />,
      value: nasaData?.vegetation?.ndvi?.current,
      unit: 'NDVI',
      description: 'Vegetation health and density measurement',
      source: 'MODIS/Landsat'
    },
    {
      key: 'precipitation',
      label: 'Precipitation (IMERG)',
      icon: <FiDroplet size={18} />,
      value: nasaData?.precipitation?.current?.value,
      unit: 'mm/day',
      description: 'Real-time precipitation measurements',
      source: 'GPM IMERG'
    },
    {
      key: 'airquality',
      label: 'Air Quality',
      icon: <FiActivity size={18} />,
      value: nasaData?.airQuality?.current?.aqi,
      unit: 'AQI',
      description: nasaData?.airQuality?.current?.level,
      source: nasaData?.airQuality?.current?.provider || 'TEMPO'
    }
  ];


  if (loading) {
    return (
      <Container>
        <Header>
          <Title>City Digital Twin</Title>
          <Subtitle>Loading NASA Earth observation data...</Subtitle>
        </Header>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LoadingSpinner />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>City Digital Twin</Title>
        <Subtitle>Interactive visualization of NASA Earth observation data</Subtitle>
      </Header>

      <ContentGrid>
        <MapWrapper
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
            scrollWheelZoom={true}
          >
            {/* Base layer - OpenStreetMap */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Satellite layer overlay */}
            {activeLayers.satellite && (
              <TileLayer
                attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                opacity={0.7}
              />
            )}

            {/* City marker */}
            <Marker position={mapCenter}>
              <Popup>
                <div>
                  <h3>{selectedCity?.name || 'Selected Location'}</h3>
                  <p>{selectedCity?.country || 'Unknown Country'}</p>
                  <p>Coordinates: {mapCenter[0].toFixed(4)}°, {mapCenter[1].toFixed(4)}°</p>
                </div>
              </Popup>
            </Marker>

            {/* Temperature visualization */}
            {activeLayers.temperature && nasaData.temperature.current?.value && (
              <>
                <Circle
                  center={mapCenter}
                  radius={5000}
                  fillColor="#ef4444"
                  fillOpacity={0.3}
                  color="#ef4444"
                  weight={2}
                >
                  <Popup>
                    <div>
                      <h4>Temperature Zone</h4>
                      <p>Surface Temperature: {nasaData.temperature.current.value}°C</p>
                      <p>Source: NASA MODIS/VIIRS</p>
                    </div>
                  </Popup>
                </Circle>
              </>
            )}

            {/* Vegetation visualization */}
            {activeLayers.vegetation && nasaData.vegetation.ndvi?.current && (
              <Circle
                center={mapCenter}
                radius={3000}
                fillColor="#22c55e"
                fillOpacity={0.4}
                color="#16a34a"
                weight={2}
              >
                <Popup>
                  <div>
                    <h4>Vegetation Index</h4>
                    <p>NDVI: {nasaData.vegetation.ndvi.current}</p>
                    <p>Vegetation Health: {parseFloat(nasaData.vegetation.ndvi.current) > 0.5 ? 'Good' : 'Moderate'}</p>
                  </div>
                </Popup>
              </Circle>
            )}

            {/* Precipitation visualization */}
            {activeLayers.precipitation && nasaData.precipitation.current?.value && (
              <Circle
                center={mapCenter}
                radius={7000}
                fillColor="#3b82f6"
                fillOpacity={0.2}
                color="#2563eb"
                weight={2}
                dashArray="5, 5"
              >
                <Popup>
                  <div>
                    <h4>Precipitation Zone</h4>
                    <p>Daily Precipitation: {nasaData.precipitation.current.value} mm/day</p>
                    <p>Source: GPM IMERG</p>
                  </div>
                </Popup>
              </Circle>
            )}

            {/* Air Quality visualization */}
            {activeLayers.airquality && nasaData?.airQuality?.current?.aqi && (
              <Circle
                center={mapCenter}
                radius={4000}
                fillColor={
                  nasaData.airQuality.current.aqi > 100 ? "#ef4444" :
                    nasaData.airQuality.current.aqi > 50 ? "#f59e0b" :
                      "#22c55e"
                }
                fillOpacity={0.25}
                color={
                  nasaData.airQuality.current.aqi > 100 ? "#dc2626" :
                    nasaData.airQuality.current.aqi > 50 ? "#d97706" :
                      "#16a34a"
                }
                weight={2}
              >
                <Popup>
                  <div>
                    <h4>Air Quality Zone</h4>
                    <p>AQI: {nasaData.airQuality.current?.aqi}</p>
                    <p>Level: {nasaData.airQuality.current?.level}</p>
                    <p>PM2.5: {nasaData.airQuality.current?.pm25}</p>
                    <p>PM1: {nasaData.airQuality.current?.pm1}</p>
                    <p>Humidity: {nasaData.airQuality.current?.humidity}%</p>
                    <p>Provider: {nasaData.airQuality.current?.provider || 'TEMPO'}</p>
                  </div>
                </Popup>
              </Circle>
            )}


          </MapContainer>
        </MapWrapper>

        <ControlPanel
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <PanelTitle>Map Layers</PanelTitle>
          <LayerControl>
            {layers.map(layer => (
              <LayerItem
                key={layer.key}
                active={activeLayers[layer.key]}
                onClick={() => toggleLayer(layer.key)}
              >
                <LayerIcon active={activeLayers[layer.key]}>
                  {layer.icon}
                </LayerIcon>
                <div style={{ flex: 1 }}>
                  <LayerLabel active={activeLayers[layer.key]}>
                    {layer.label}
                  </LayerLabel>
                  {layer.value && (
                    <LayerValue active={activeLayers[layer.key]}>
                      {layer.value} {layer.unit}
                    </LayerValue>
                  )}
                  <LayerDescription>
                    {layer.description}
                  </LayerDescription>
                  <DataSource>
                    Source: {layer.source}
                  </DataSource>
                </div>
              </LayerItem>
            ))}
          </LayerControl>

          <PanelTitle>Real-time Data Status</PanelTitle>
          <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1.4' }}>
            <div style={{ marginBottom: '0.4rem' }}>
              📡 <strong>{selectedCity?.name || 'Default Location'}</strong> - {selectedCity?.country || 'Unknown'}
            </div>
            <div style={{ marginBottom: '0.4rem' }}>
              📍 Coordinates: {mapCenter[0].toFixed(4)}°, {mapCenter[1].toFixed(4)}°
            </div>
            <div style={{ marginBottom: '0.4rem' }}>
              ⏰ Last Updated: {new Date().toLocaleTimeString()}
            </div>
            <div>
              🛰️ Data Sources: NASA POWER, GPM, MODIS, TEMPO
            </div>
          </div>
        </ControlPanel>
      </ContentGrid>
    </Container>
  );
};

export default DigitalTwin;