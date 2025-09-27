import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiArrowRight, 
  FiGlobe, 
  FiLayers, 
  FiTrendingUp,
  FiMapPin,
  FiZap,
  FiRadio,
  FiTarget,
  FiEye,
  FiBarChart2,
  FiCloud,
  FiThermometer,
  FiActivity
} from 'react-icons/fi';

// Keyframe Animations
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-20px) rotate(2deg); }
  50% { transform: translateY(-10px) rotate(-1deg); }
  75% { transform: translateY(-15px) rotate(1deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
`;

const drift = keyframes`
  0% { transform: translateX(0px) translateY(0px); }
  25% { transform: translateX(15px) translateY(-10px); }
  50% { transform: translateX(-10px) translateY(-15px); }
  75% { transform: translateX(-15px) translateY(10px); }
  100% { transform: translateX(0px) translateY(0px); }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const ripple = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7);
  }
  70% {
    box-shadow: 0 0 0 30px rgba(102, 126, 234, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0);
  }
`;

const drawPath = keyframes`
  0% {
    stroke-dashoffset: 1000;
  }
  100% {
    stroke-dashoffset: 0;
  }
`;

// Styled Components
const HomeContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(-45deg, #0f0f23, #1a1a3e, #2d1b69, #4c1d95);
  background-size: 400% 400%;
  animation: ${gradientShift} 15s ease infinite;
  overflow-x: hidden;
  position: relative;
`;

const BackgroundSVG = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
`;

const AnimatedPath = styled.path`
  stroke: ${props => props.color || '#667eea'};
  stroke-width: 2;
  fill: none;
  stroke-dasharray: 10, 5;
  stroke-dashoffset: 1000;
  animation: ${drawPath} 8s ease-in-out infinite alternate;
  opacity: 0.6;
`;

const FloatingElement = styled(motion.div)`
  position: absolute;
  animation: ${float} ${props => props.duration || '6s'} ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
  z-index: 2;
  opacity: 0.1;
`;

const Content = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Header = styled.header`
  padding: 2rem 0;
  text-align: center;
  position: relative;
`;

const NavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Logo = styled(motion.div)`
  font-size: 1.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${gradientShift} 8s ease infinite;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NavMenu = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled.a`
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-weight: 500;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    transition: width 0.3s ease;
  }
  
  &:hover {
    text-decoration: none;
    color: white;
    text-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
    
    &::after {
      width: 100%;
    }
  }
`;

const HeroSection = styled.section`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  position: relative;
`;

const HeroContent = styled.div`
  max-width: 1300px;
  margin: 0 auto;
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(3rem, 5vw, 6rem);
  font-weight: 900;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #fff, #667eea, #f093fb, #764ba2);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${gradientShift} 10s ease infinite;
  line-height: 1.1;
  text-shadow: 0 0 30px rgba(102, 126, 234, 0.3);
`;

const HeroSubtitle = styled(motion.p)`
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 3rem;
  line-height: 1.6;
  max-width: 1300px;
  margin-left: auto;
  margin-right: auto;
`;

const CTAContainer = styled(motion.div)`
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 4rem;
`;

const PrimaryButton = styled(motion.button)`
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  padding: 1.5rem 3rem;
  border-radius: 50px;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.6s ease;
  }
  
  &:hover {
    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.5);
    filter: brightness(1.1);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    animation: ${ripple} 0.6s linear;
  }
`;

const SecondaryButton = styled(motion.button)`
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 1.5rem 3rem;
  border-radius: 50px;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.1);
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
  }
`;

const FeatureGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const FeatureCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2.5rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #667eea, transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

const FeatureIcon = styled(motion.div)`
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: linear-gradient(135deg, ${props => props.gradient || '#667eea, #764ba2'});
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 2rem;
  color: white;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 22px;
    background: linear-gradient(45deg, transparent, ${props => props.gradient || '#667eea'}, transparent);
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::after {
    opacity: 1;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  font-size: 0.95rem;
`;

const StatsSection = styled(motion.section)`
  padding: 6rem 2rem;
  text-align: center;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  margin-top: 4rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 3rem;
  max-width: 1200px;
  margin: 3rem auto 0;
`;

const StatItem = styled(motion.div)`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea, #f093fb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const GlowOrb = styled(motion.div)`
  position: absolute;
  width: ${props => props.size || '200px'};
  height: ${props => props.size || '200px'};
  border-radius: 50%;
  background: radial-gradient(circle, ${props => props.color || 'rgba(102, 126, 234, 0.3)'} 0%, transparent 70%);
  filter: blur(20px);
  animation: ${drift} ${props => props.duration || '20s'} ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
  z-index: 1;
`;

const Footer = styled(motion.footer)`
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 3rem 2rem 2rem;
  text-align: center;
  position: relative;
  z-index: 10;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #667eea, #f093fb, transparent);
    opacity: 0.6;
  }
`;

const TeamName = styled(motion.div)`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea, #f093fb, #764ba2);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${gradientShift} 8s ease infinite;
  text-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
`;

const TeamDescription = styled(motion.p)`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  margin-bottom: 2rem;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const Copyright = styled(motion.div)`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 2rem;
`;

function Home() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: FiRadio,
      title: "NASA Earth Observation",
      description: "Real-time satellite data from Sentinel-2 NDVI, SRTM Elevation, and ECOSTRESS LST for comprehensive environmental monitoring",
      gradient: "#667eea, #764ba2"
    },
    {
      icon: FiGlobe,
      title: "Interactive City Mapping",
      description: "Explore Dhaka's environmental layers with intuitive polygon selection tools for targeted intervention planning",
      gradient: "#38a169, #2f855a"
    },
    {
      icon: FiTarget,
      title: "Smart Interventions",
      description: "Implement eco-friendly solutions like tree planting, water features, and green infrastructure with predictive modeling",
      gradient: "#3182ce, #2c5aa0"
    },
    {
      icon: FiTrendingUp,
      title: "ROI Analysis",
      description: "Complete financial impact assessment with environmental benefits, cost calculations, and investment returns",
      gradient: "#d69e2e, #b7791f"
    },
    {
      icon: FiEye,
      title: "Future Predictions",
      description: "Advanced 5-year environmental forecasting showing long-term impacts of urban planning decisions",
      gradient: "#805ad5, #6b46c1"
    },
    {
      icon: FiBarChart2,
      title: "Impact Assessment",
      description: "Quantitative before-and-after analysis of temperature reduction, air quality, and ecosystem health improvements",
      gradient: "#e53e3e, #c53030"
    }
  ];

  return (
    <HomeContainer>
      {/* Animated Background Elements */}
      <BackgroundSVG viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:"#667eea", stopOpacity:0.6}} />
            <stop offset="100%" style={{stopColor:"#f093fb", stopOpacity:0.3}} />
          </linearGradient>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:"#38a169", stopOpacity:0.5}} />
            <stop offset="100%" style={{stopColor:"#3182ce", stopOpacity:0.3}} />
          </linearGradient>
        </defs>
        
        {/* Dashed Curved Paths */}
        <AnimatedPath
          d="M0,400 Q300,200 600,300 T1200,250"
          color="url(#grad1)"
        />
        <AnimatedPath
          d="M0,200 Q400,50 800,150 T1200,100"
          color="url(#grad2)"
          style={{animationDelay: '2s'}}
        />
        <AnimatedPath
          d="M0,600 Q200,450 500,500 Q800,550 1200,400"
          color="#667eea"
          style={{animationDelay: '4s'}}
        />
        <AnimatedPath
          d="M200,0 Q500,300 800,100 T1200,200"
          color="#f093fb"
          style={{animationDelay: '6s'}}
        />
        
        {/* Animated Circles */}
        <circle cx="100" cy="150" r="3" fill="#667eea" opacity="0.6">
          <animate attributeName="r" values="3;8;3" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;1;0.6" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="800" cy="300" r="2" fill="#f093fb" opacity="0.5">
          <animate attributeName="r" values="2;6;2" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="1100" cy="450" r="4" fill="#38a169" opacity="0.4">
          <animate attributeName="r" values="4;10;4" dur="5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="5s" repeatCount="indefinite" />
        </circle>
      </BackgroundSVG>

      {/* Floating Glowing Orbs */}
      <GlowOrb 
        size="300px"
        color="rgba(102, 126, 234, 0.2)"
        duration="25s"
        delay="0s"
        style={{top: '10%', left: '80%'}}
      />
      <GlowOrb 
        size="200px"
        color="rgba(56, 161, 105, 0.15)"
        duration="30s"
        delay="5s"
        style={{top: '60%', left: '10%'}}
      />
      <GlowOrb 
        size="150px"
        color="rgba(240, 147, 251, 0.2)"
        duration="20s"
        delay="10s"
        style={{top: '30%', left: '50%'}}
      />

      {/* Floating Icon Elements */}
      <FloatingElement 
        duration="8s" 
        delay="0s"
        style={{top: '15%', right: '15%'}}
      >
        <FiRadio size={40} color="rgba(102, 126, 234, 0.3)" />
      </FloatingElement>
      <FloatingElement 
        duration="10s" 
        delay="2s"
        style={{top: '70%', left: '20%'}}
      >
        <FiGlobe size={35} color="rgba(56, 161, 105, 0.3)" />
      </FloatingElement>
      <FloatingElement 
        duration="12s" 
        delay="4s"
        style={{top: '40%', right: '25%'}}
      >
        <FiLayers size={30} color="rgba(240, 147, 251, 0.3)" />
      </FloatingElement>

      <Content>
        {/* Navigation */}
        <Header>
          <NavBar>
            <Logo
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <FiGlobe color='white' size={28} />
              Urbanome
            </Logo>
            <NavMenu>
              <NavItem onClick={() => navigate('/dashboard')}>Dashboard</NavItem>
              <NavItem onClick={() => navigate('/digital-twin')}>Digital Twin</NavItem>
              <NavItem onClick={() => navigate('/intervention-planner')}>Interventions</NavItem>
              {/* <NavItem onClick={() => navigate('/analysis')}>Analysis</NavItem> */}
            </NavMenu>
          </NavBar>
        </Header>

        {/* Hero Section */}
        <HeroSection>
          <HeroContent>
            <HeroTitle
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Transforming Cities with
              <br />
              <span style={{fontSize: '0.8em', fontWeight: '800'}}>NASA Earth Data</span>
            </HeroTitle>
            
            <HeroSubtitle
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              Harness the power of satellite observations to create sustainable, resilient urban environments. 
              Our platform integrates <strong>NDVI</strong>, <strong>SRTM Elevation</strong>, and <strong>ECOSTRESS LST</strong> data 
              to revolutionize city planning for Dhaka and beyond.
            </HeroSubtitle>

            <CTAContainer
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <PrimaryButton
                onClick={() => navigate('/digital-twin')}
                whileHover={{ boxShadow: "0 15px 40px rgba(102, 126, 234, 0.5)" }}
                whileTap={{ scale: 0.98 }}
              >
                Explore Digital Twin <FiArrowRight style={{marginLeft: '0.5rem'}} />
              </PrimaryButton>
              <SecondaryButton
                onClick={() => navigate('/dashboard')}
                whileHover={{ borderColor: "#667eea" }}
                whileTap={{ scale: 0.98 }}
              >
                View Dashboard
              </SecondaryButton>
            </CTAContainer>

            {/* Feature Grid */}
            <FeatureGrid
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.9 + index * 0.1 }}
                  whileHover={{ 
                    y: -5,
                    transition: { duration: 0.3 }
                  }}
                >
                  <FeatureIcon 
                    gradient={feature.gradient}
                    whileHover={{ 
                      rotateY: 180,
                      transition: { duration: 0.6 }
                    }}
                  >
                    <feature.icon />
                  </FeatureIcon>
                  <FeatureTitle>{feature.title}</FeatureTitle>
                  <FeatureDescription>{feature.description}</FeatureDescription>
                </FeatureCard>
              ))}
            </FeatureGrid>
          </HeroContent>
        </HeroSection>

        {/* Stats Section */}
        <StatsSection
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <motion.h2 
            style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #667eea, #f093fb)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.8 }}
          >
            Powered by NASA's Earth Observation Data
          </motion.h2>
          
          <StatsGrid>
            <StatItem
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2 }}
            >
              <StatNumber>4</StatNumber>
              <StatLabel>NASA Data Sources</StatLabel>
            </StatItem>
            <StatItem
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.2 }}
            >
              <StatNumber>4</StatNumber>
              <StatLabel>Intervention Types</StatLabel>
            </StatItem>
            <StatItem
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.4 }}
            >
              <StatNumber>5</StatNumber>
              <StatLabel>Years Prediction</StatLabel>
            </StatItem>
            <StatItem
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.6 }}
            >
              <StatNumber>∞</StatNumber>
              <StatLabel>Possibilities</StatLabel>
            </StatItem>
          </StatsGrid>
        </StatsSection>

        {/* Footer */}
        <Footer
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.8 }}
        >
          <TeamName
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 3 }}
          >
            Team Equinox
          </TeamName>
          
          <TeamDescription
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 3.2 }}
          >
            Pioneering sustainable urban futures through innovative NASA Earth observation technology 
            and data-driven environmental solutions for healthier cities.
          </TeamDescription>
          
          <Copyright
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 3.4 }}
          >
            © 2025 Team Equinox • NASA Space Apps Challenge • Data Pathways to Healthy Cities and Human Settlements
          </Copyright>
        </Footer>
      </Content>
    </HomeContainer>
  );
}

export default Home;
