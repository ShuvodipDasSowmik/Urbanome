import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiDatabase, FiGlobe, FiLink, FiDownload, FiInfo, FiExternalLink } from 'react-icons/fi';

const Container = styled.div`
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #1e293b;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 1.125rem;
`;

const DataSourcesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
`;

const DataSourceCard = styled(motion.div)`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const SourceIcon = styled.div`
  padding: 1rem;
  border-radius: 12px;
  background: ${props => props.color};
  color: white;
`;

const SourceInfo = styled.div`
  flex: 1;
`;

const SourceTitle = styled.h3`
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0 0 0.25rem 0;
`;

const SourceProvider = styled.div`
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 600;
`;

const SourceDescription = styled.p`
  color: #374151;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const SourceMeta = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const MetaItem = styled.div`
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
`;

const MetaLabel = styled.div`
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
`;

const MetaValue = styled.div`
  color: #1e293b;
  font-weight: 600;
`;

const SourceActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
    background: #f3f4f6;
  }

  &.primary {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;

    &:hover {
      background: #2563eb;
    }
  }
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => props.status === 'active' ? '#dcfce7' : '#fef3c7'};
  color: ${props => props.status === 'active' ? '#166534' : '#92400e'};
`;

const DataSources = () => {
  const [expandedCard, setExpandedCard] = useState(null);

  const dataSources = [
    {
      id: 1,
      title: "MODIS Land Surface Temperature",
      provider: "NASA Terra/Aqua Satellites",
      description: "High-resolution thermal imagery for monitoring urban heat island effects and surface temperature patterns across cities.",
      icon: <FiGlobe size={24} />,
      color: "#ef4444",
      resolution: "1km",
      frequency: "Daily",
      coverage: "Global",
      status: "active",
      url: "https://lpdaac.usgs.gov/products/mod11a1v006/",
      applications: ["Heat island mapping", "Energy demand modeling", "Climate monitoring"]
    },
    {
      id: 2,
      title: "GPM IMERG Precipitation",
      provider: "NASA Global Precipitation Measurement",
      description: "Real-time precipitation data for flood risk assessment and stormwater management planning in urban areas.",
      icon: <FiDatabase size={24} />,
      color: "#3b82f6",
      resolution: "0.1°",
      frequency: "30 minutes",
      coverage: "60°N-60°S",
      status: "active",
      url: "https://gpm.nasa.gov/data/imerg",
      applications: ["Flood modeling", "Drainage planning", "Climate adaptation"]
    },
    {
      id: 3,
      title: "Landsat NDVI",
      provider: "USGS/NASA Landsat Program",
      description: "Normalized Difference Vegetation Index for monitoring urban green spaces, vegetation health, and land cover changes.",
      icon: <FiDatabase size={24} />,
      color: "#10b981",
      resolution: "30m",
      frequency: "16 days",
      coverage: "Global",
      status: "active",
      url: "https://landsat.gsfc.nasa.gov/",
      applications: ["Green space monitoring", "Urban planning", "Ecosystem health"]
    },
    {
      id: 4,
      title: "SRTM Elevation Data",
      provider: "NASA Shuttle Radar Topography Mission",
      description: "Digital elevation models for topographic analysis, flood risk modeling, and infrastructure planning.",
      icon: <FiGlobe size={24} />,
      color: "#8b5cf6",
      resolution: "30m",
      frequency: "Static",
      coverage: "60°N-56°S",
      status: "archived",
      url: "https://lpdaac.usgs.gov/products/srtmgl1v003/",
      applications: ["Topographic analysis", "Watershed modeling", "Infrastructure planning"]
    },
    {
      id: 5,
      title: "TEMPO Air Quality",
      provider: "NASA TEMPO Mission",
      description: "High-resolution air quality monitoring for North American cities, tracking pollutants and atmospheric conditions.",
      icon: <FiDatabase size={24} />,
      color: "#f59e0b",
      resolution: "2.1km x 4.4km",
      frequency: "Hourly",
      coverage: "North America",
      status: "active",
      url: "https://tempo.si.edu/",
      applications: ["Air quality assessment", "Health impact studies", "Pollution source tracking"]
    },
    {
      id: 6,
      title: "VIIRS Nighttime Lights",
      provider: "NOAA/NASA Suomi NPP",
      description: "Nighttime imagery for monitoring urban development, energy usage patterns, and socioeconomic indicators.",
      icon: <FiGlobe size={24} />,
      color: "#6366f1",
      resolution: "500m",
      frequency: "Daily",
      coverage: "Global",
      status: "active",
      url: "https://www.ngdc.noaa.gov/eog/viirs/",
      applications: ["Urban development tracking", "Energy consumption analysis", "Economic activity monitoring"]
    }
  ];

  return (
    <Container>
      <Header>
        <Title>NASA Earth Observation Data Sources</Title>
        <Subtitle>Satellite datasets powering urban sustainability analysis</Subtitle>
      </Header>

      <DataSourcesGrid>
        {dataSources.map((source, index) => (
          <DataSourceCard
            key={source.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <CardHeader>
              <SourceIcon color={source.color}>
                {source.icon}
              </SourceIcon>
              <SourceInfo>
                <SourceTitle>{source.title}</SourceTitle>
                <SourceProvider>{source.provider}</SourceProvider>
              </SourceInfo>
              <StatusBadge status={source.status}>{source.status}</StatusBadge>
            </CardHeader>

            <SourceDescription>{source.description}</SourceDescription>

            <SourceMeta>
              <MetaItem>
                <MetaLabel>Resolution</MetaLabel>
                <MetaValue>{source.resolution}</MetaValue>
              </MetaItem>
              <MetaItem>
                <MetaLabel>Frequency</MetaLabel>
                <MetaValue>{source.frequency}</MetaValue>
              </MetaItem>
              <MetaItem>
                <MetaLabel>Coverage</MetaLabel>
                <MetaValue>{source.coverage}</MetaValue>
              </MetaItem>
              <MetaItem>
                <MetaLabel>Applications</MetaLabel>
                <MetaValue>{source.applications.length} use cases</MetaValue>
              </MetaItem>
            </SourceMeta>

            <SourceActions>
              <ActionButton
                className="primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open(source.url, '_blank')}
              >
                <FiExternalLink size={16} />
                Access Data
              </ActionButton>
              <ActionButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiDownload size={16} />
                Download
              </ActionButton>
              <ActionButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setExpandedCard(expandedCard === source.id ? null : source.id)}
              >
                <FiInfo size={16} />
                Details
              </ActionButton>
            </SourceActions>

            {expandedCard === source.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ marginTop: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}
              >
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>Applications:</h4>
                <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#374151' }}>
                  {source.applications.map((app, i) => (
                    <li key={i}>{app}</li>
                  ))}
                </ul>
              </motion.div>
            )}
          </DataSourceCard>
        ))}
      </DataSourcesGrid>
    </Container>
  );
};

export default DataSources;
