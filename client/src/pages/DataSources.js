import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiDatabase, FiGlobe, FiLink, FiDownload, FiInfo, FiExternalLink } from 'react-icons/fi';

const Container = styled.div`
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #2d1b69 100%);
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: white;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #fff, #667eea, #f093fb);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.125rem;
`;

const DataSourcesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
`;

const DataSourceCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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
  color: white;
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0 0 0.25rem 0;
`;

const SourceProvider = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  font-weight: 600;
`;

const SourceDescription = styled.p`
  color: rgba(255, 255, 255, 0.9);
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
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
`;

const MetaLabel = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
`;

const MetaValue = styled.div`
  color: white;
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
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(10px);

  &:hover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.1);
    color: white;
  }

  &.primary {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border-color: #667eea;

    &:hover {
      background: linear-gradient(135deg, #5a67d8, #6b46c1);
    }
  }
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => props.status === 'active' ? 'rgba(102, 126, 234, 0.2)' : 'rgba(240, 147, 251, 0.2)'};
  color: ${props => props.status === 'active' ? '#667eea' : '#f093fb'};
  border: 1px solid ${props => props.status === 'active' ? 'rgba(102, 126, 234, 0.3)' : 'rgba(240, 147, 251, 0.3)'};
`;

const DataSources = () => {
  const [expandedCard, setExpandedCard] = useState(null);

  const dataSources = [
    {
      id: 1,
      title: "ECOSTRESS Land Surface Temperature",
      provider: "Collected by ECOsystem Spaceborne Thermal Radiometer Experiment on Space Station",
      description: "High-resolution thermal imagery for monitoring urban heat island effects and surface temperature patterns across cities.",
      icon: <FiGlobe size={24} />,
      color: "#ef4444",
      resolution: "70m",
      frequency: "April 2025 - September 2025",
      coverage: "Dhaka, Bangladesh",
      url: "https://www.earthdata.nasa.gov/data/catalog/lpcloud-eco2lste-001",
      applications: ["Heat island mapping", "Energy demand modeling", "Climate monitoring"]
    },
    {
      id: 3,
      title: "Sentinel-2 NDVI",
      provider: "European Space Agency Sentinel-2 Mission",
      description: "Normalized Difference Vegetation Index for monitoring urban green spaces, vegetation health, and land cover changes.",
      icon: <FiDatabase size={24} />,
      color: "#10b981",
      resolution: "30m",
      frequency: "16 days",
      coverage: "Dhaka, Bangladesh",
      url: "https://custom-scripts.sentinel-hub.com/custom-scripts/sentinel-2/ndvi/",
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
                style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px' }}
              >
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'white' }}>Applications:</h4>
                <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'rgba(255, 255, 255, 0.8)' }}>
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
