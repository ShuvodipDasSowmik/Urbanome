import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiMap, 
  FiLayers, 
  FiDollarSign, 
  FiFileText, 
  FiDatabase, 
  FiUsers
} from 'react-icons/fi';

const SidebarContainer = styled.aside`
  width: 250px;
  background: linear-gradient(135deg, #1a1a3e 0%, #2d1b69 100%);
  padding: 2rem 1rem;
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(102, 126, 234, 0.2);
`;

const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SidebarLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  border-radius: 10px;
  transition: all 0.2s;

  &:hover {
    text-decoration: none;
    background-color: rgba(102, 126, 234, 0.2);
    color: #667eea;
  }

  &.active {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
  }
`;

const SectionTitle = styled.h3`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 2rem 0 1rem 0;
  padding-left: 1rem;
`;

const Sidebar = () => {
  return (
    <SidebarContainer>
      <SidebarNav>
        <SidebarLink to="/dashboard" end>
          <FiHome size={20} />
          Dashboard
        </SidebarLink>
        
        <SectionTitle>Planning Tools</SectionTitle>
        
        <SidebarLink to="/digital-twin">
          <FiMap size={20} />
          Digital Twin
        </SidebarLink>
        
        <SidebarLink to="/intervention-planner">
          <FiLayers size={20} />
          Intervention Planner
        </SidebarLink>
        
        {/* <SidebarLink to="/cost-benefit">
          <FiDollarSign size={20} />
          Cost-Benefit Analysis
        </SidebarLink> */}
        
        <SectionTitle>Reports & Data</SectionTitle>
        
        <SidebarLink to="/policy-brief">
          <FiFileText size={20} />
          Policy Brief
        </SidebarLink>
        
        <SidebarLink to="/data-sources">
          <FiDatabase size={20} />
          Data Sources
        </SidebarLink>

        <SectionTitle>Collaborate</SectionTitle>

        <SidebarLink to="/ngo">
          <FiUsers size={20} />
          NGOs
        </SidebarLink>

        <SidebarLink to="/govt">
          <FiHome size={20} />
          Government
        </SidebarLink>
      </SidebarNav>
    </SidebarContainer>
  );
};

export default Sidebar;
