import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiThermometer, 
  FiCloud, 
  FiLayers, 
  FiMapPin,
  FiTrendingUp,
  FiTrendingDown,
  FiAlertCircle,
  FiActivity
} from 'react-icons/fi';

import { useCityData } from '../context/CityDataContext';
import KPICard from '../components/dashboard/KPICard';
import RiskAssessment from '../components/dashboard/RiskAssessment';
import EnvironmentalTrends from '../components/dashboard/EnvironmentalTrends';
import CityOverview from '../components/dashboard/CityOverview';
import QuickActions from '../components/dashboard/QuickActions';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DashboardContainer = styled.div`
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #718096;
  margin-bottom: 1rem;
`;

const CitySelector = styled.div`
  display: inline-flex;
  align-items: center;
  background: white;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 2rem;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.8rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const AlertBanner = styled(motion.div)`
  background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
  border-left: 4px solid #e53e3e;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AlertText = styled.div`
  h4 {
    color: #c53030;
    font-weight: 600;
    margin: 0 0 0.25rem 0;
  }
  p {
    color: #9c4221;
    margin: 0;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
`;

function Dashboard() {
  const { 
    selectedCity, 
    nasaData, 
    riskAssessment, 
    loading, 
    error,
    fetchCityData 
  } = useCityData();

  const [refreshing, setRefreshing] = useState(false);

  // Refresh data function
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCityData(selectedCity);
    setRefreshing(false);
  };

  // Calculate derived metrics
  const kpiData = [
    {
      title: 'Land Surface Temperature',
      value: nasaData.temperature.current?.value || '--',
      unit: '°C',
      icon: FiThermometer,
      color: '#e53e3e',
      change: nasaData.temperature.trends?.yearly_change || 0,
      status: getRiskColor(riskAssessment.heatRisk),
      source: 'MODIS/VIIRS',
    },
    {
      title: 'Precipitation Rate',
      value: nasaData.precipitation.current?.value || '--',
      unit: 'mm/hr',
      icon: FiCloud,
      color: '#3182ce',
      change: 0, // Calculate based on historical data
      status: getRiskColor(riskAssessment.floodRisk),
      source: 'GPM IMERG',
    },
    {
      title: 'Green Coverage',
      value: nasaData.vegetation.greenCoverage?.percentage || '--',
      unit: '%',
      icon: FiLayers,
      color: '#38a169',
      change: nasaData.vegetation.greenCoverage?.change_1year || 0,
      status: nasaData.vegetation.greenCoverage?.change_1year > 0 ? '#38a169' : '#e53e3e',
      source: 'MODIS NDVI',
    },
    {
      title: 'Air Quality Index',
      value: nasaData.airQuality.current?.aqi || '--',
      unit: 'AQI',
      icon: FiActivity,
      color: '#805ad5',
      change: 0, // Calculate based on historical data
      status: getRiskColor(riskAssessment.airQualityRisk),
      source: 'TEMPO',
    },
  ];

  if (loading && !refreshing) {
    return (
      <DashboardContainer>
        <LoadingContainer>
          <LoadingSpinner size="large" message="Loading NASA Earth observation data..." />
        </LoadingContainer>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header>
        <Title>NASA Healthy Cities Dashboard</Title>
        <Subtitle>
          Real-time environmental monitoring and urban planning insights
        </Subtitle>
        <CitySelector>
          <FiMapPin style={{ marginRight: '0.5rem' }} />
          {selectedCity.name}, {selectedCity.country}
          <span style={{ 
            marginLeft: '1rem', 
            fontSize: '0.9rem', 
            color: '#718096' 
          }}>
            Pop: {(selectedCity.population / 1000000).toFixed(1)}M
          </span>
        </CitySelector>
      </Header>

      {/* High Risk Alert */}
      {riskAssessment.overallRisk === 'high' || riskAssessment.overallRisk === 'very_high' && (
        <AlertBanner
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FiAlertCircle size={24} color="#c53030" />
          <AlertText>
            <h4>High Environmental Risk Detected</h4>
            <p>
              Current conditions indicate elevated {riskAssessment.overallRisk.replace('_', ' ')} risk. 
              Consider implementing immediate intervention strategies.
            </p>
          </AlertText>
        </AlertBanner>
      )}

      {/* KPI Cards */}
      <KPIGrid>
        {kpiData.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <KPICard {...kpi} />
          </motion.div>
        ))}
      </KPIGrid>

      {/* Main Content Grid */}
      <GridContainer>
        {/* City Overview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <SectionTitle>
            <FiMapPin />
            City Overview
          </SectionTitle>
          <CityOverview 
            city={selectedCity}
            nasaData={nasaData}
            riskAssessment={riskAssessment}
          />
        </motion.div>

        {/* Risk Assessment */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <SectionTitle>
            <FiAlertCircle />
            Risk Assessment
          </SectionTitle>
          <RiskAssessment 
            risks={riskAssessment}
            nasaData={nasaData}
          />
        </motion.div>

        {/* Environmental Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{ gridColumn: 'span 2' }}
        >
          <SectionTitle>
            <FiTrendingUp />
            Environmental Trends
          </SectionTitle>
          <EnvironmentalTrends 
            temperatureData={nasaData.temperature}
            precipitationData={nasaData.precipitation}
            vegetationData={nasaData.vegetation}
            airQualityData={nasaData.airQuality}
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <SectionTitle>
            <FiActivity />
            Quick Actions
          </SectionTitle>
          <QuickActions 
            onRefresh={handleRefresh}
            refreshing={refreshing}
            cityData={{ selectedCity, nasaData, riskAssessment }}
          />
        </motion.div>
      </GridContainer>
    </DashboardContainer>
  );
}

// Helper function to get risk color
function getRiskColor(riskLevel) {
  switch (riskLevel) {
    case 'low':
      return '#38a169';
    case 'medium':
      return '#d69e2e';
    case 'high':
      return '#e53e3e';
    case 'very_high':
      return '#9c4221';
    default:
      return '#718096';
  }
}

export default Dashboard;
