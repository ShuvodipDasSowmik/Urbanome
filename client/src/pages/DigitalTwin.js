import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ImageOverlay,
  useMap,
  Circle
} from "react-leaflet";
import L from "leaflet";
import {
  FiMap,
  FiLayers,
  FiThermometer,
  FiDroplet,
  FiWind,
  FiActivity,
} from "react-icons/fi";
import { useCityData } from "../context/CityDataContext";
import LoadingSpinner from "../components/common/LoadingSpinner";
import "leaflet/dist/leaflet.css";
import VegetationLegend from "../components/VegetationLegend";
import LSTLegend from "../components/LSTLegend";
import ElevationLegend from "../components/ElevationLegend";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #2d1b69 100%);
  overflow: hidden;
`;

const Header = styled.div`
  padding: 1rem 2rem;
  flex-shrink: 0;
  height: 120px;
`;

const Title = styled.h1`
  color: white;
  font-size: 1.75rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
  background: linear-gradient(135deg, #fff, #667eea, #f093fb);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  flex: 1;
  height: 100vh
  min-height: 600px;
`;

const MapWrapper = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  position: relative;
  height: 100%;
  min-height: 500px;

  .leaflet-container {
    width: 100%;
    height: 100%;
    border-radius: 12px;
  }
`;

const ControlPanel = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  max-height: 100%;
`;

const PanelTitle = styled.h3`
  color: white;
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
  background: ${(props) => (props.active ? "rgba(102, 126, 234, 0.1)" : "rgba(255, 255, 255, 0.05)")};
  border: 1px solid ${(props) => (props.active ? "#667eea" : "rgba(255, 255, 255, 0.1)")};
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(102, 126, 234, 0.1);
    border-color: #667eea;
  }
`;

const LayerIcon = styled.div`
  margin-right: 0.75rem;
  margin-top: 0.125rem;
  color: ${(props) => (props.active ? "#667eea" : "rgba(255, 255, 255, 0.6)")};
`;

const LayerLabel = styled.div`
  flex: 1;
  color: ${(props) => (props.active ? "white" : "rgba(255, 255, 255, 0.8)")};
  font-weight: ${(props) => (props.active ? "600" : "500")};
  font-size: 0.875rem;
`;

const LayerValue = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${(props) => (props.active ? "#667eea" : "rgba(255, 255, 255, 0.7)")};
`;

const LayerDescription = styled.div`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 0.25rem;
  line-height: 1.3;
`;

const DataSource = styled.div`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  margin-top: 0.4rem;
  display: inline-block;
`;

// const ElevationLegend = styled.div`
//   background: white;
//   border-radius: 8px;
//   padding: 1rem;
//   margin-top: 1rem;
//   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
// `;

const LegendTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  color: white;
  font-size: 0.9rem;
`;

const LegendGradient = styled.div`
  height: 20px;
  background: linear-gradient(
    90deg,
    #0000ff,
    #00ffff,
    #00ff00,
    #ffff00,
    #ffa500,
    #ff0000
  );
  border-radius: 4px;
  margin-bottom: 0.5rem;
`;

const LegendLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.7);
`;

// Component to handle map sizing and view
function MapController({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);

    const timer1 = setTimeout(() => {
      map.invalidateSize();
    }, 100);

    const timer2 = setTimeout(() => {
      map.invalidateSize();
    }, 500);

    // Handle window resize
    const handleResize = () => {
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener("resize", handleResize);
    };
  }, [map, center, zoom]);

  return null;
}

// Elevation overlay
function ElevationOverlay({ isVisible }) {
  const [bounds, setBounds] = useState(null);
  const [elevationStats, setElevationStats] = useState({ min: 0, max: 0 });

  useEffect(() => {
    fetch("/data/dhaka_elevation_bounds.json")
      .then((response) => response.json())
      .then((data) => {
        setBounds([
          [data.south, data.west],
          [data.north, data.east],
        ]);
        setElevationStats({ min: 2, max: 85 });
      })
      .catch(() => {
        setBounds([
          [23.4, 90.36],
          [23.6, 90.6],
        ]);
        setElevationStats({ min: 2, max: 85 });
      });
  }, []);

  if (!isVisible || !bounds) return null;

  return (
    <ImageOverlay
      url="/data/dhaka_elevation_overlay.png"
      bounds={bounds}
      opacity={0.65}
      zIndex={500}
      attribution="NASA SRTM Elevation Data"
    />
  );
}

// Land Surface Temperature overlay
function LSTOverlay({ isVisible }) {
  const [bounds, setBounds] = useState(null);

  useEffect(() => {
    if (!isVisible) return;
    fetch("/data/dhaka_elevation_bounds.json")
      .then((response) => response.json())
      .then((data) => {
        setBounds([
          [data.south, data.west],
          [data.north, data.east],
        ]);
      })
      .catch(() => {
        setBounds([
          [23.4, 90.36],
          [23.6, 90.6],
        ]);
      });
  }, [isVisible]);

  if (!isVisible || !bounds) return null;

  return (
    <ImageOverlay
      url="/data/dhaka_lst_overlay.png"
      bounds={bounds}
      opacity={0.8}
      zIndex={510}
      attribution="LST overlay (processed)"
    />
  );
}

// Vegetation (Land Cover) overlay
function VegetationOverlay({ isVisible }) {
  const [bounds, setBounds] = useState(null);

  useEffect(() => {
    if (!isVisible) return;
    fetch("/data/dhaka_elevation_bounds.json")
      .then((response) => response.json())
      .then((data) => {
        setBounds([
          [data.south, data.west],
          [data.north, data.east],
        ]);
      })
      .catch(() => {
        setBounds([
          [23.4, 90.36],
          [23.6, 90.6],
        ]);
      });
  }, [isVisible]);

  if (!isVisible || !bounds) return null;

  return (
    <ImageOverlay
      url="/data/dhaka_landcover.png"
      bounds={[
        [23.514644467623427, 89.993267809818], // SW corner
        [24.044668432420007, 90.52169954853196] // NE corner
      ]}
      opacity={0.5}
      zIndex={520}
      attribution="Dhaka Land Cover (processed)"
    />
  );
}

// Air Quality Overlay
function AirQualityOverlay({ isVisible, data, center }) {
  if (!isVisible || !data?.current?.aqi) return null;

  return (
    <Circle
      center={center}
      radius={4000}
      fillColor={
        data.current.aqi > 100 ? "#ef4444" :
          data.current.aqi > 50 ? "#f59e0b" :
            "#22c55e"
      }
      fillOpacity={0.25}
      color={
        data.current.aqi > 100 ? "#dc2626" :
          data.current.aqi > 50 ? "#d97706" :
            "#16a34a"
      }
      weight={2}
    >
      <Popup>
        <div>
          <h4>Air Quality Zone</h4>
          <p>AQI: {data.current.aqi}</p>
          <p>Level: {data.current.level}</p>
          <p>PM2.5: {data.current.pm25}</p>
          <p>PM1: {data.current.pm1}</p>
          <p>Humidity: {data.current.humidity}%</p>
        </div>
      </Popup>
    </Circle>
  );
}

const DigitalTwin = () => {
  // const { selectedCity, nasaData } = useCityData();


  const { selectedCity } = useCityData();
  const [nasaData, setNasaData] = useState(null);
  const [loading, setLoading] = useState(true);

  const mapRef = useRef(null);
  const [activeLayers, setActiveLayers] = useState({
    satellite: true,
    temperature: false,
    vegetation: false,
    precipitation: false,
    airquality: false,
    elevation: false,
  });

  const toggleLayer = (layer) => {
    setActiveLayers((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }));
  };

  useEffect(() => {
    fetch('/air_quality_frontend_data.json')
      .then(res => res.json())
      .then(data => {
        // console.log('Loaded NASA data:', data);
        setNasaData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading JSON:', err);
        setLoading(false);
      });
  }, []);

  const mapCenter = selectedCity?.coordinates
    ? selectedCity.coordinates
    : [23.8103, 90.4125]; // Dhaka default

  const mapZoom = 11;

  const handleMapCreated = (mapInstance) => {
    mapRef.current = mapInstance;
    setTimeout(() => {
      mapInstance.invalidateSize();
    }, 50);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const layers = [
    // {
    //   key: 'satellite',
    //   label: 'Satellite Imagery',
    //   icon: <FiMap size={18} />,
    //   description: "High-resolution satellite imagery",
    //   source: "Carto Voyager",
    // },
    {
      key: "temperature",
      label: "Land Surface Temperature",
      icon: <FiThermometer size={18} />,
      unit: "°C",
      description: "Surface temperature from thermal infrared sensors",
      source: "ECOSTRESS [ECO_L2T_LSTE]",
    },
    {
      key: "vegetation",
      label: "Vegetation Index (NDVI)",
      icon: <FiLayers size={18} />,
      unit: "NDVI",
      description: "Vegetation health and density measurement",
      source: "Sentinel-2",
    },
    // {
    //   key: "precipitation",
    //   label: "Precipitation (IMERG)",
    //   icon: <FiDroplet size={18} />,
    //   value: nasaData?.precipitation?.current?.value || "--",
    //   unit: "mm/day",
    //   description: "Real-time precipitation measurements",
    //   source: "GPM IMERG",
    // },
    {
      key: "airquality",
      label: "Air Quality",
      icon: <FiActivity size={18} />,
      value: nasaData?.airQuality?.current?.aqi || "--",
      unit: "AQI",
      description: "Atmospheric composition and pollutant levels",
      source: "OpenAQ",
    },
    {
      key: "elevation",
      label: "Elevation Map",
      icon: <FiWind size={18} />,
      description: "SRTM elevation data for Dhaka region",
      source: "NASA SRTM",
    },
  ];


  if (loading) {
    return (
      <Container>
        <Header>
          <Title>City Digital Twin</Title>
          <Subtitle>Loading NASA Earth observation data...</Subtitle>
        </Header>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LoadingSpinner />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      {/* <Header>
        <Title>City Digital Twin</Title>
        <Subtitle>
          Interactive visualization of NASA Earth observation data
        </Subtitle>
      </Header> */}

      <ContentGrid>
        <MapWrapper
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: "100%", width: "100%" }}
            whenCreated={handleMapCreated}
            maxZoom={18}
            minZoom={3}
          >
            <MapController center={mapCenter} zoom={mapZoom} />

            {/* Basemap */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              subdomains="abcd"
              maxZoom={20}
            />

            {/* Satellite layer overlay */}
            {/* {activeLayers.satellite && (
              <TileLayer
                attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                opacity={0.7}
              />
            )} */}

            {/* City marker */}
            <Marker position={mapCenter}>
              <Popup>
                <div>
                  <h3>{selectedCity?.name || "Dhaka"}</h3>
                  <p>{selectedCity?.country || "Bangladesh"}</p>
                  <p>
                    Coordinates: {mapCenter[0].toFixed(4)}°,{" "}
                    {mapCenter[1].toFixed(4)}°
                  </p>
                </div>
              </Popup>
            </Marker>

            {/* Overlays */}
            <ElevationOverlay isVisible={activeLayers.elevation} />
            <LSTOverlay isVisible={activeLayers.temperature} />
            <VegetationOverlay isVisible={activeLayers.vegetation} />
            <VegetationLegend active={activeLayers.vegetation} />
            <LSTLegend active={activeLayers.temperature} />
            <ElevationLegend active={activeLayers.elevation} />
            <AirQualityOverlay
              isVisible={activeLayers.airquality}
              data={nasaData?.airQuality}
              center={mapCenter}
            />
          </MapContainer>
        </MapWrapper>

        <ControlPanel
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <PanelTitle>Map Layers</PanelTitle>
          <LayerControl>
            {layers.map((layer) => (
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
                  <LayerDescription>{layer.description}</LayerDescription>
                  <DataSource>Source: {layer.source}</DataSource>
                </div>
              </LayerItem>
            ))}
          </LayerControl>


        </ControlPanel>
      </ContentGrid>
    </Container>
  );
};

export default DigitalTwin;