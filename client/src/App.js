import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import styled from 'styled-components';

// Context Providers
import { CityDataProvider } from './context/CityDataContext';
import { InterventionProvider } from './context/InterventionContext';

// Components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages
import Dashboard from './pages/Dashboard';
import DigitalTwin from './pages/DigitalTwin';
import InterventionPlanner from './pages/InterventionPlanner';
import CostBenefitAnalysis from './pages/CostBenefitAnalysis';
import PolicyBrief from './pages/PolicyBrief';
import DataSources from './pages/DataSources';

// Styles
import GlobalStyles from './styles/GlobalStyles';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const ContentArea = styled.main`
  flex: 1;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

function App() {
  return (
    <CityDataProvider>
      <InterventionProvider>
        <Router>
          <GlobalStyles />
          <AppContainer>
            <MainContent>
              <Sidebar />
              <ContentArea>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/digital-twin" element={<DigitalTwin />} />
                  <Route path="/intervention-planner" element={<InterventionPlanner />} />
                  <Route path="/cost-benefit" element={<CostBenefitAnalysis />} />
                  <Route path="/policy-brief" element={<PolicyBrief />} />
                  <Route path="/data-sources" element={<DataSources />} />
                </Routes>
              </ContentArea>
            </MainContent>
          </AppContainer>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                borderRadius: '10px',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: '500',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Router>
      </InterventionProvider>
    </CityDataProvider>
  );
}

export default App;
