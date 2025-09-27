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
  FiActivity,
  FiMap,
  FiTarget,
  FiDollarSign,
  FiCalendar,
  FiRadio,
  FiEye,
  FiZap,
  FiGlobe,
  FiBarChart2
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

const HeroSection = styled(motion.div)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 3rem 2rem;
  margin-bottom: 3rem;
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
`;

const HeroSubtitle = styled.p`
  font-size: 1.3rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const HeroStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const HeroStat = styled.div`
  text-align: center;
  
  .number {
    font-size: 2.5rem;
    font-weight: bold;
    display: block;
  }
  
  .label {
    font-size: 1rem;
    opacity: 0.8;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const FeatureCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.gradient || 'linear-gradient(90deg, #667eea, #764ba2)'};
  }
`;

const FeatureHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 15px;
  background: ${props => props.bgColor || 'linear-gradient(135deg, #667eea, #764ba2)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
`;

const FeatureDescription = styled.p`
  color: #718096;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const DataSourcesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const DataSourceCard = styled(motion.div)`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${props => props.color || '#667eea'};
    transform: translateY(-5px);
  }
`;

const DataSourceIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: ${props => props.color || '#667eea'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.3rem;
`;

const WorkflowSection = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 3rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
`;

const WorkflowTitle = styled.h2`
  text-align: center;
  font-size: 2.2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 2rem;
`;

const WorkflowSteps = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  position: relative;
`;

const WorkflowStep = styled(motion.div)`
  text-align: center;
  position: relative;
  
  .step-number {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin: 0 auto 1rem;
  }
  
  .step-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 0.5rem;
  }
  
  .step-description {
    color: #718096;
    font-size: 0.9rem;
    line-height: 1.5;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`;

const MetricCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.5rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ImpactSection = styled.div`
  background: linear-gradient(135deg, #38a169 0%, #2f855a 100%);
  border-radius: 20px;
  padding: 3rem 2rem;
  color: white;
  text-align: center;
  margin-bottom: 2rem;
`;

const HighlightText = styled.span`
  -webkit-background-clip: text;
  background-clip: text;
  font-weight: 700;
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
      {/* Hero Section */}
      <HeroSection
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <HeroTitle>🛰️ Urbanome Dashboard</HeroTitle>
        <HeroSubtitle>
          Transforming Dhaka into a sustainable smart city through <HighlightText>NASA Earth Observation Data</HighlightText> and intelligent urban planning
        </HeroSubtitle>
        
        <HeroStats>
          <HeroStat>
            <span className="number">3</span>
            <span className="label">NASA Data Sources</span>
          </HeroStat>
          <HeroStat>
            <span className="number">5+</span>
            <span className="label">Intervention Types</span>
          </HeroStat>
          <HeroStat>
            <span className="number">5</span>
            <span className="label">Years Prediction</span>
          </HeroStat>
          <HeroStat>
            <span className="number">ROI</span>
            <span className="label">Analysis Included</span>
          </HeroStat>
        </HeroStats>
      </HeroSection>

      {/* Key Features Grid */}
      <SectionTitle>
        <FiGlobe />
        Our Solution: Data Pathways to Healthy Cities
      </SectionTitle>
      
      <FeatureGrid>
        <FeatureCard
          gradient="linear-gradient(135deg, #667eea, #764ba2)"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <FeatureHeader>
            <FeatureIcon bgColor="linear-gradient(135deg, #38a169, #2f855a)">
              <FiRadio />
            </FeatureIcon>
            <FeatureTitle>Real-time Earth Observation</FeatureTitle>
          </FeatureHeader>
          <FeatureDescription>
            Integrated NASA satellite data including <strong>NDVI from Sentinel-2</strong>, 
            <strong> SRTM Elevation Data</strong>, and <strong>ECOSTRESS LST</strong> to monitor 
            Dhaka's environmental conditions in real-time.
          </FeatureDescription>
          <MetricsGrid>
            <MetricCard>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#38a169' }}>NDVI</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Vegetation Health</div>
            </MetricCard>
            <MetricCard>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#3182ce' }}>SRTM</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Elevation Data</div>
            </MetricCard>
            <MetricCard>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#e53e3e' }}>LST</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Temperature</div>
            </MetricCard>
          </MetricsGrid>
        </FeatureCard>

        <FeatureCard
          gradient="linear-gradient(135deg, #3182ce, #2c5aa0)"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <FeatureHeader>
            <FeatureIcon bgColor="linear-gradient(135deg, #3182ce, #2c5aa0)">
              <FiMap />
            </FeatureIcon>
            <FeatureTitle>Interactive City Mapping</FeatureTitle>
          </FeatureHeader>
          <FeatureDescription>
            Users can explore Dhaka's current environmental situation through an interactive map interface, 
            visualizing vegetation coverage, temperature patterns, and elevation data.
          </FeatureDescription>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <span style={{ background: 'rgba(56, 161, 105, 0.2)', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem' }}>
              🗺️ Interactive Maps
            </span>
            <span style={{ background: 'rgba(49, 130, 206, 0.2)', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem' }}>
              📍 Polygon Selection
            </span>
          </div>
        </FeatureCard>

        <FeatureCard
          gradient="linear-gradient(135deg, #38a169, #2f855a)"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <FeatureHeader>
            <FeatureIcon bgColor="linear-gradient(135deg, #38a169, #2f855a)">
              <FiTarget />
            </FeatureIcon>
            <FeatureTitle>Smart Interventions</FeatureTitle>
          </FeatureHeader>
          <FeatureDescription>
            Select areas and apply various urban interventions like tree planting, water field creation, 
            and green infrastructure to see immediate environmental impact predictions.
          </FeatureDescription>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '1rem' }}>
            <div style={{ background: 'rgba(56, 161, 105, 0.1)', padding: '0.5rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.8rem' }}>
              🌳 Tree Planting
            </div>
            <div style={{ background: 'rgba(49, 130, 206, 0.1)', padding: '0.5rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.8rem' }}>
              💧 Water Fields
            </div>
            <div style={{ background: 'rgba(128, 90, 213, 0.1)', padding: '0.5rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.8rem' }}>
              🏢 Green Buildings
            </div>
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '0.5rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.8rem' }}>
              🌿 Green Corridors
            </div>
          </div>
        </FeatureCard>

        <FeatureCard
          gradient="linear-gradient(135deg, #d69e2e, #b7791f)"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <FeatureHeader>
            <FeatureIcon bgColor="linear-gradient(135deg, #d69e2e, #b7791f)">
              <FiDollarSign />
            </FeatureIcon>
            <FeatureTitle>ROI & Cost-Benefit Analysis</FeatureTitle>
          </FeatureHeader>
          <FeatureDescription>
            Comprehensive financial analysis showing Return on Investment for each intervention, 
            including environmental benefits, health improvements, and economic impacts.
          </FeatureDescription>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '1rem', padding: '1rem 0' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#38a169' }}>↗️</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>ROI Analysis</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3182ce' }}>💰</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Cost Estimation</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#805ad5' }}>📊</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Impact Metrics</div>
            </div>
          </div>
        </FeatureCard>

        <FeatureCard
          gradient="linear-gradient(135deg, #805ad5, #6b46c1)"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <FeatureHeader>
            <FeatureIcon bgColor="linear-gradient(135deg, #805ad5, #6b46c1)">
              <FiCalendar />
            </FeatureIcon>
            <FeatureTitle>Future Prediction (5 Years)</FeatureTitle>
          </FeatureHeader>
          <FeatureDescription>
            Advanced modeling to predict environmental conditions 5 years into the future, 
            showing how interventions will impact the urban ecosystem over time.
          </FeatureDescription>
          <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(128, 90, 213, 0.1)', borderRadius: '10px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#805ad5' }}>Prediction Models:</div>
            <div style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
              • Temperature reduction trends<br/>
              • Vegetation growth patterns<br/>
              • Air quality improvements<br/>
              • Urban heat island mitigation
            </div>
          </div>
        </FeatureCard>

        <FeatureCard
          gradient="linear-gradient(135d, #e53e3e, #c53030)"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <FeatureHeader>
            <FeatureIcon bgColor="linear-gradient(135deg, #e53e3e, #c53030)">
              <FiBarChart2 />
            </FeatureIcon>
            <FeatureTitle>Environmental Impact Assessment</FeatureTitle>
          </FeatureHeader>
          <FeatureDescription>
            Real-time assessment of environmental changes before and after interventions, 
            providing quantitative data on temperature reduction, air quality improvement, and ecosystem health.
          </FeatureDescription>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(229, 62, 62, 0.1)', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#e53e3e' }}>-2°C</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Temperature Drop</div>
            </div>
            <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(56, 161, 105, 0.1)', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#38a169' }}>+15%</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Green Coverage</div>
            </div>
          </div>
        </FeatureCard>
      </FeatureGrid>

      {/* NASA Data Sources */}
      <SectionTitle>
        <FiRadio />
        NASA Earth Observation Data Sources
      </SectionTitle>
      
      <DataSourcesGrid>
        <DataSourceCard
          color="#38a169"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.05 }}
        >
          <DataSourceIcon color="#38a169">
            <FiLayers />
          </DataSourceIcon>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#2d3748' }}>Sentinel-2 NDVI</h4>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#718096' }}>
            Vegetation health and green coverage monitoring with 10m resolution
          </p>
        </DataSourceCard>

        <DataSourceCard
          color="#3182ce"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
        >
          <DataSourceIcon color="#3182ce">
            <FiTrendingUp />
          </DataSourceIcon>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#2d3748' }}>SRTM Elevation</h4>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#718096' }}>
            High-resolution digital elevation model for topographic analysis
          </p>
        </DataSourceCard>

        <DataSourceCard
          color="#e53e3e"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
        >
          <DataSourceIcon color="#e53e3e">
            <FiThermometer />
          </DataSourceIcon>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#2d3748' }}>ECOSTRESS LST</h4>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#718096' }}>
            Land Surface Temperature data for urban heat island analysis
          </p>
        </DataSourceCard>
      </DataSourcesGrid>

      {/* User Workflow */}
      <WorkflowSection>
        <WorkflowTitle>How Our Solution Works</WorkflowTitle>
        <WorkflowSteps>
          <WorkflowStep
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="step-number">1</div>
            <div className="step-title">Explore Current Situation</div>
            <div className="step-description">
              View real-time environmental data of Dhaka city including temperature, vegetation, and elevation maps
            </div>
          </WorkflowStep>

          <WorkflowStep
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="step-number">2</div>
            <div className="step-title">Select Target Area</div>
            <div className="step-description">
              Draw polygons on the interactive map to select specific areas for intervention planning
            </div>
          </WorkflowStep>

          <WorkflowStep
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="step-number">3</div>
            <div className="step-title">Choose Interventions</div>
            <div className="step-description">
              Select from various green infrastructure options like tree planting, water features, and sustainable buildings
            </div>
          </WorkflowStep>

          <WorkflowStep
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="step-number">4</div>
            <div className="step-title">View Impact & ROI</div>
            <div className="step-description">
              See immediate environmental improvements and comprehensive cost-benefit analysis with ROI calculations
            </div>
          </WorkflowStep>

          <WorkflowStep
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="step-number">5</div>
            <div className="step-title">Future Predictions</div>
            <div className="step-description">
              Explore how the selected area will evolve over the next 5 years with predictive modeling
            </div>
          </WorkflowStep>
        </WorkflowSteps>
      </WorkflowSection>     
      

      {/* Impact Section */}
      <ImpactSection
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <h2 style={{ fontSize: '2.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          🌍 Building Sustainable Cities with NASA Data
        </h2>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>
          Our solution empowers urban planners and policymakers to make data-driven decisions 
          for creating healthier, more sustainable cities using cutting-edge Earth observation technology.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>100%</div>
            <div>Data-Driven Decisions</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Real-time</div>
            <div>Environmental Monitoring</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>5-Year</div>
            <div>Future Predictions</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Smart</div>
            <div>Urban Planning</div>
          </div>
        </div>
      </ImpactSection>

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
