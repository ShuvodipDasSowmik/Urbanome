import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash2, FiMapPin } from 'react-icons/fi';

const Container = styled.div`
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
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

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
`;

const InterventionList = styled(motion.div)`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const InterventionCard = styled(motion.div)`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  background: ${props => props.selected ? '#f0fdf4' : 'white'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #10b981;
    box-shadow: 0 2px 10px rgba(16, 185, 129, 0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const InterventionType = styled.span`
  background: #10b981;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const InterventionTitle = styled.h4`
  color: #1e293b;
  font-size: 1rem;
  font-weight: 600;
  margin: 0.5rem 0;
`;

const InterventionDescription = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const InterventionMeta = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  color: #6b7280;
  font-size: 0.75rem;
`;

const PlannerPanel = styled(motion.div)`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const PanelTitle = styled.h3`
  color: #1e293b;
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

const AddButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  border: 2px dashed #10b981;
  border-radius: 10px;
  background: transparent;
  color: #10b981;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 1.5rem;

  &:hover {
    background: rgba(16, 185, 129, 0.05);
  }
`;

const InterventionTypes = styled.div`
  display: grid;
  gap: 0.75rem;
`;

const TypeButton = styled(motion.button)`
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: white;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #10b981;
    background: #f0fdf4;
  }
`;

const TypeTitle = styled.div`
  color: #1e293b;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const TypeDescription = styled.div`
  color: #64748b;
  font-size: 0.875rem;
`;

const InterventionPlanner = () => {
  const [selectedIntervention, setSelectedIntervention] = useState(null);

  const interventions = [
    {
      id: 1,
      type: "Green Roof",
      title: "Downtown Office Complex Green Roof",
      description: "Install extensive green roof system on 5,000 m² commercial building",
      location: "Central Business District",
      cost: "$250,000",
      impact: "2.5°C temperature reduction"
    },
    {
      id: 2,
      type: "Urban Forest",
      title: "Riverside Park Tree Plantation",
      description: "Plant 500 native trees along the riverfront area",
      location: "Riverside District",
      cost: "$75,000",
      impact: "15% air quality improvement"
    },
    {
      id: 3,
      type: "Wetland",
      title: "Stormwater Management Wetland",
      description: "Construct constructed wetland for flood mitigation",
      location: "Industrial Zone",
      cost: "$180,000",
      impact: "40% flood risk reduction"
    }
  ];

  const interventionTypes = [
    {
      title: "Green Roofs",
      description: "Reduce urban heat island effect and manage stormwater"
    },
    {
      title: "Urban Trees",
      description: "Improve air quality and provide shade cooling"
    },
    {
      title: "Wetlands",
      description: "Natural flood control and water filtration"
    },
    {
      title: "Cool Surfaces",
      description: "Reflective materials to reduce surface temperatures"
    },
    {
      title: "Permeable Pavements",
      description: "Reduce runoff and groundwater recharge"
    }
  ];

  return (
    <Container>
      <Header>
        <Title>Intervention Planner</Title>
        <Subtitle>Design nature-based solutions for urban challenges</Subtitle>
      </Header>

      <ContentGrid>
        <InterventionList
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PanelTitle>Current Interventions</PanelTitle>
          {interventions.map(intervention => (
            <InterventionCard
              key={intervention.id}
              selected={selectedIntervention === intervention.id}
              onClick={() => setSelectedIntervention(intervention.id)}
              whileHover={{ scale: 1.02 }}
            >
              <CardHeader>
                <InterventionType>{intervention.type}</InterventionType>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <FiEdit size={16} style={{ cursor: 'pointer', color: '#6b7280' }} />
                  <FiTrash2 size={16} style={{ cursor: 'pointer', color: '#ef4444' }} />
                </div>
              </CardHeader>
              <InterventionTitle>{intervention.title}</InterventionTitle>
              <InterventionDescription>{intervention.description}</InterventionDescription>
              <InterventionMeta>
                <span><FiMapPin size={12} /> {intervention.location}</span>
                <span>{intervention.cost}</span>
                <span>{intervention.impact}</span>
              </InterventionMeta>
            </InterventionCard>
          ))}
        </InterventionList>

        <PlannerPanel
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <PanelTitle>Add New Intervention</PanelTitle>
          
          <AddButton
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiPlus size={20} />
            Create New Intervention
          </AddButton>

          <PanelTitle>Intervention Types</PanelTitle>
          <InterventionTypes>
            {interventionTypes.map((type, index) => (
              <TypeButton
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <TypeTitle>{type.title}</TypeTitle>
                <TypeDescription>{type.description}</TypeDescription>
              </TypeButton>
            ))}
          </InterventionTypes>
        </PlannerPanel>
      </ContentGrid>
    </Container>
  );
};

export default InterventionPlanner;
