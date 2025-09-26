import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiMapPin,
  FiEye,
  FiPlay,
  FiBarChart2,
} from "react-icons/fi";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import DhakaBoundary from "../components/DhakaBoundary";
import AnalysisModal from "../components/AnalysisModal";
import InterventionConfigModal from "../components/InterventionConfigModal";
import InterventionResultsModal from "../components/InterventionResultsModal";
import { interventionAnalysisService } from "../services/simpleInterventionService";
import { formatBDT, formatBDTCompact } from "../utils/currency";
import axios from "axios";

const Container = styled.div`
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
  height: 100vh;
`;

const MapWrapper = styled.div`
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const PlannerPanel = styled(motion.div)`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
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

const CurrentSituationButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  border: 2px solid ${(props) => (props.disabled ? "#e5e7eb" : "#3b82f6")};
  border-radius: 10px;
  background: ${(props) => (props.disabled ? "#f9fafb" : "#3b82f6")};
  color: ${(props) => (props.disabled ? "#9ca3af" : "white")};
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  margin-bottom: 1.5rem;

  &:hover {
    background: ${(props) => (props.disabled ? "#f9fafb" : "#2563eb")};
    border-color: ${(props) => (props.disabled ? "#e5e7eb" : "#2563eb")};
  }
`;

const InterventionCard = styled(motion.div)`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  background: ${(props) => (props.selected ? "#f0fdf4" : "white")};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #10b981;
    box-shadow: 0 2px 10px rgba(16, 185, 129, 0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
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
  flex-direction: column;
  gap: 0.25rem;
  color: #6b7280;
  font-size: 0.75rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled(motion.button)`
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid
    ${(props) => (props.variant === "primary" ? "#3b82f6" : "#e5e7eb")};
  border-radius: 6px;
  background: ${(props) => (props.variant === "primary" ? "#3b82f6" : "white")};
  color: ${(props) => (props.variant === "primary" ? "white" : "#64748b")};
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;

  &:hover {
    background: ${(props) =>
      props.variant === "primary" ? "#2563eb" : "#f9fafb"};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.625rem;
  font-weight: 600;
  background: ${(props) => {
    switch (props.status) {
      case "configured":
        return "#fef3c7";
      case "analyzed":
        return "#d1fae5";
      default:
        return "#f3f4f6";
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case "configured":
        return "#92400e";
      case "analyzed":
        return "#065f46";
      default:
        return "#374151";
    }
  }};
`;

const InterventionPlanner = () => {
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [hasDrawnShapes, setHasDrawnShapes] = useState(false);
  const [drawnCoordinates, setDrawnCoordinates] = useState([]);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [interventions, setInterventions] = useState([]);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
  const [currentResults, setCurrentResults] = useState(null);
  const [nextInterventionId, setNextInterventionId] = useState(1);

  // Calculate polygon area for intervention configuration
  const calculatePolygonArea = (coordinates) => {
    if (!coordinates || coordinates.length === 0) return 10000; // Default 1 hectare

    const firstPolygon = coordinates[0];
    if (firstPolygon?.geometry?.coordinates) {
      const coords = firstPolygon.geometry.coordinates[0];
      let area = 0;
      for (let i = 0; i < coords.length - 1; i++) {
        area +=
          coords[i][0] * coords[i + 1][1] - coords[i + 1][0] * coords[i][1];
      }
      return Math.abs(area / 2) * 111320 * 111320; // Rough calclulation
    }
    return 10000;
  };

  const handleCreated = (e) => {
    // This function will be called after the user is done with drawing
    const layer = e.layer;
    const geoJSON = layer.toGeoJSON();
    //console.log("Drawn feature:", geoJSON);

    // Enable the current situation button and store coordinates
    setHasDrawnShapes(true);
    setDrawnCoordinates((prev) => [...prev, geoJSON]);
  };

  const handleDeleted = (e) => {
    // This function will be called when shapes are deleted
    const layers = e.layers;
    console.log("Deleted features:", layers.getLayers().length);

    // Remove deleted coordinates from our state
    const deletedCount = layers.getLayers().length;
    setDrawnCoordinates((prev) => {
      const updated = prev.slice(0, -deletedCount); // Remove last 'deletedCount' items

      // If no shapes remain, disable the button
      if (updated.length === 0) {
        setHasDrawnShapes(false);
      }

      return updated;
    });
  };

  const handleCurrentSituation = async () => {
    if (drawnCoordinates.length > 0) {
      try {
        // Open modal and show loading state
        setIsAnalysisModalOpen(true);
        setIsAnalysisLoading(true);
        setAnalysisData(null);

        console.log("Sending polygon data to backend...");

        // Send polygon data to backend
        const response = await axios.post(
          "http://localhost:5000/api/analysis/current-situation",
          {
            polygonData: drawnCoordinates,
          }
        );

        console.log("Backend response:", response.data);

        // Set the analysis data and stop loading
        // Extract the actual analysis data from the response
        const analysisResult = response.data.data || response.data;
        setAnalysisData(analysisResult);
        setIsAnalysisLoading(false);

        try {
          await interventionAnalysisService.storeBaselineData(analysisResult);
          console.log("Baseline data stored for intervention analysis");
        } catch (error) {
          console.warn("Failed to store baseline data:", error);
        }

        console.log("Current Situation - Analysis completed:");
        drawnCoordinates.forEach((coord, index) => {
          console.log(`Shape ${index + 1}:`, coord);
        });
      } catch (error) {
        console.error("Error sending data to backend:", error);

        // Stop loading and show error in modal
        setIsAnalysisLoading(false);
        setAnalysisData({
          success: false,
          error: error.message,
          message: "Failed to analyze the selected area. Please try again.",
        });

        // Fallback to console logging if backend request fails
        console.log("Current Situation - Error occurred, showing coordinates:");
        drawnCoordinates.forEach((coord, index) => {
          console.log(`Shape ${index + 1}:`, coord);
        });
      }
    }
  };

  const handleAddIntervention = () => {
    //prerequisite: analysis must be done first
    if (!analysisData) {
      alert(
        "Please analyze the current situation first before adding interventions."
      );
      return;
    }
    setIsConfigModalOpen(true);
  };

  const handleApplyIntervention = (interventionConfig) => {
    const newIntervention = {
      id: nextInterventionId,
      ...interventionConfig,
      status: "configured",
      createdAt: new Date().toISOString(),
      polygonArea: calculatePolygonArea(drawnCoordinates),
    };

    setInterventions((prev) => [...prev, newIntervention]);
    setNextInterventionId((prev) => prev + 1);
    setIsConfigModalOpen(false);
  };

  const handleRunAnalysis = async (interventionId) => {
    console.log("=== Starting intervention analysis ===");
    console.log("Intervention ID:", interventionId);
    console.log("All interventions:", interventions);

    const intervention = interventions.find((i) => i.id === interventionId);
    console.log("Found intervention:", intervention);

    if (!intervention || !analysisData) {
      console.log(
        "Missing data - intervention:",
        !!intervention,
        "analysisData:",
        !!analysisData
      );
      alert(
        "Please run 'Analyze Current Situation' first to establish baseline data."
      );
      return;
    }

    try {
      // Update intervention status to show loading
      setInterventions((prev) =>
        prev.map((i) =>
          i.id === interventionId ? { ...i, status: "analyzing" } : i
        )
      );

      // Create clean intervention config
      const interventionConfig = {
        type: intervention.type,
        config: intervention.config,
        metadata: intervention.metadata,
      };

      console.log("Running analysis for:", interventionConfig);

      // Calculate polygon area from drawn coordinates
      const polygonArea = calculatePolygonArea(drawnCoordinates);

      // Run analysis with new advanced service, passing polygon area
      const result = await interventionAnalysisService.analyzeIntervention(
        interventionConfig,
        polygonArea
      );

      if (result.success) {
        // Update intervention status with results
        setInterventions((prev) =>
          prev.map((i) =>
            i.id === interventionId
              ? { ...i, status: "analyzed", results: result.data }
              : i
          )
        );

        // Show results modal
        setCurrentResults(result.data);
        setIsResultsModalOpen(true);

        console.log("Intervention analysis completed:", result.data);

        if (result.fallback) {
          console.warn("Analysis completed using client-side fallback");
        }
      } else {
        throw new Error(result.error || "Analysis failed");
      }
    } catch (error) {
      console.error("Error running intervention analysis:", error);

      // Reset intervention status
      setInterventions((prev) =>
        prev.map((i) =>
          i.id === interventionId ? { ...i, status: "configured" } : i
        )
      );

      alert(`Failed to analyze intervention: ${error.message}`);
    }
  };

  const handleViewResults = (interventionId) => {
    const intervention = interventions.find((i) => i.id === interventionId);
    if (intervention?.results) {
      setCurrentResults(intervention.results);
      setIsResultsModalOpen(true);
    }
  };

  const handleDeleteIntervention = (interventionId) => {
    if (window.confirm("Are you sure you want to delete this intervention?")) {
      setInterventions((prev) => prev.filter((i) => i.id !== interventionId));
      if (selectedIntervention === interventionId) {
        setSelectedIntervention(null);
      }
    }
  };

  const handleCombineInterventions = () => {
    console.log("=== Combining all analyzed interventions ===");

    const analyzedInterventions = interventions.filter(
      (i) => i.status === "analyzed" && i.results
    );

    if (analyzedInterventions.length < 2) {
      alert("At least 2 analyzed interventions are required for combination.");
      return;
    }

    // Combine all intervention results
    const combinedResults = combineInterventionResults(analyzedInterventions);

    // Show combined results modal
    setCurrentResults(combinedResults);
    setIsResultsModalOpen(true);

    console.log("Combined results:", combinedResults);
  };

  const combineInterventionResults = (analyzedInterventions) => {
    console.log(
      "Combining results from interventions:",
      analyzedInterventions.map((i) => i.metadata.name)
    );

    // Initialize combined structure
    const combined = {
      projections: {
        temperature: { 5: {}, 10: {}, 15: {} },
        vegetation: { 5: {}, 10: {}, 15: {} },
        carbonSequestration: { 5: {}, 10: {}, 15: {} },
        waterManagement: { 5: {}, 10: {}, 15: {} },
      },
      costs: {
        implementation: 0,
        maintenance: { 5: 0, 10: 0, 15: 0 },
        total: { 5: 0, 10: 0, 15: 0 },
      },
      benefits: {
        energySavings: { 5: 0, 10: 0, 15: 0 },
        carbonSequestration: { 5: 0, 10: 0, 15: 0 },
        waterManagement: { 5: 0, 10: 0, 15: 0 },
        airQuality: { 5: 0, 10: 0, 15: 0 },
        propertyValue: { 5: 0, 10: 0, 15: 0 },
        total: { 5: 0, 10: 0, 15: 0 },
      },
      roi: { 5: {}, 10: {}, 15: {} },
      intervention: {
        metadata: {
          name: `Combined Impact (${analyzedInterventions.length} interventions)`,
          description: `Cumulative effect of: ${analyzedInterventions
            .map((i) => i.metadata.name)
            .join(", ")}`,
          area: analyzedInterventions.reduce(
            (sum, i) => sum + (i.polygonArea || 0),
            0
          ),
        },
      },
    };

    // Sum up all the values from each intervention
    const years = [5, 10, 15];

    analyzedInterventions.forEach((intervention) => {
      const results = intervention.results;

      // Implementation costs are additive
      combined.costs.implementation += results.costs?.implementation || 0;

      years.forEach((year) => {
        // Temperature reduction - use average (not additive due to overlap)
        const tempReduction =
          results.projections?.temperature?.[year]?.reduction || 0;
        if (!combined.projections.temperature[year].reduction) {
          combined.projections.temperature[year].reduction = 0;
          combined.projections.temperature[year].count = 0;
        }
        combined.projections.temperature[year].reduction += tempReduction;
        combined.projections.temperature[year].count += 1;

        // Vegetation improvement - use average
        const vegImprovement =
          results.projections?.vegetation?.[year]?.improvement || 0;
        if (!combined.projections.vegetation[year].improvement) {
          combined.projections.vegetation[year].improvement = 0;
          combined.projections.vegetation[year].count = 0;
        }
        combined.projections.vegetation[year].improvement += vegImprovement;
        combined.projections.vegetation[year].count += 1;

        // Carbon sequestration - additive
        combined.projections.carbonSequestration[year].annualSequestration =
          (combined.projections.carbonSequestration[year].annualSequestration ||
            0) +
          (results.projections?.carbonSequestration?.[year]
            ?.annualSequestration || 0);

        // Water management - additive
        combined.projections.waterManagement[year].totalStormwaterManaged =
          (combined.projections.waterManagement[year].totalStormwaterManaged ||
            0) +
          (results.projections?.waterManagement?.[year]
            ?.totalStormwaterManaged || 0);

        // Costs - additive
        combined.costs.maintenance[year] +=
          results.costs?.maintenance?.[year] || 0;
        combined.costs.total[year] += results.costs?.total?.[year] || 0;

        // Benefits - additive
        Object.keys(combined.benefits).forEach((benefitType) => {
          if (
            benefitType !== "total" &&
            typeof combined.benefits[benefitType] === "object"
          ) {
            combined.benefits[benefitType][year] +=
              results.benefits?.[benefitType]?.[year] || 0;
          }
        });

        // Calculate total benefits
        combined.benefits.total[year] =
          combined.benefits.energySavings[year] +
          combined.benefits.carbonSequestration[year] +
          combined.benefits.waterManagement[year] +
          combined.benefits.airQuality[year] +
          combined.benefits.propertyValue[year];
      });
    });

    // Calculate averages for temperature and vegetation
    years.forEach((year) => {
      if (combined.projections.temperature[year].count > 0) {
        combined.projections.temperature[year].reduction /=
          combined.projections.temperature[year].count;
        delete combined.projections.temperature[year].count;
      }
      if (combined.projections.vegetation[year].count > 0) {
        combined.projections.vegetation[year].improvement /=
          combined.projections.vegetation[year].count;
        delete combined.projections.vegetation[year].count;
      }

      // Calculate CORRECT ROI for each year
      const initialInvestment = combined.costs.implementation;
      const totalBenefits = combined.benefits.total[year];
      const totalCosts = combined.costs.total[year];
      const averageAnnualBenefit = totalBenefits / year;
      const averageAnnualCost = (totalCosts - initialInvestment) / year; // Exclude initial investment from annual costs
      const netAnnualBenefit = averageAnnualBenefit - averageAnnualCost;

      // ROI = Annual Net Return / Initial Investment
      const roi =
        initialInvestment > 0
          ? Math.max(
              -100,
              Math.min(50, (netAnnualBenefit / initialInvestment) * 100)
            )
          : 0;

      // Simple payback period = Initial Investment / Net Annual Benefit
      const paybackPeriod =
        initialInvestment > 0 && netAnnualBenefit > 0
          ? Math.round((initialInvestment / netAnnualBenefit) * 10) / 10
          : null;

      combined.roi[year] = {
        roi: roi,
        paybackPeriod: paybackPeriod,
      };
    });

    return combined;
  };

  return (
    <Container>
      <ContentGrid>
        {/* MAP */}
        <MapWrapper>
          <MapContainer
            center={[23.8103, 90.4125]}
            zoom={10}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />

            {/* Render Dhaka boundary with red glow effect */}
            <DhakaBoundary
              showGlow={true}
              onLoad={(data) =>
                console.log(
                  "Boundary loaded:",
                  data.features?.length,
                  "features"
                )
              }
              onError={(error) => console.error("Boundary load error:", error)}
            />

            <FeatureGroup>
              <EditControl
                position="topright"
                draw={{
                  rectangle: true,
                  polygon: true,
                  circle: true,
                  polyline: false,
                  marker: false,
                }}
                edit={{ remove: true }}
                onCreated={handleCreated}
                onDeleted={handleDeleted}
              />
            </FeatureGroup>
          </MapContainer>
        </MapWrapper>

        {/* RIGHT SIDEBAR */}
        <PlannerPanel>
          <PanelTitle>Current Interventions</PanelTitle>

          {/* Current Situation Button */}
          <CurrentSituationButton
            disabled={!hasDrawnShapes}
            onClick={handleCurrentSituation}
            whileHover={!hasDrawnShapes ? {} : { scale: 1.02 }}
            whileTap={!hasDrawnShapes ? {} : { scale: 0.98 }}
          >
            <FiEye size={20} />
            Current Situation
          </CurrentSituationButton>

          <AddButton
            onClick={handleAddIntervention}
            disabled={!analysisData}
            whileHover={{ scale: analysisData ? 1.02 : 1 }}
            whileTap={{ scale: analysisData ? 0.98 : 1 }}
            style={{
              opacity: analysisData ? 1 : 0.5,
              cursor: analysisData ? "pointer" : "not-allowed",
            }}
          >
            <FiPlus size={20} />
            Add New Intervention
          </AddButton>

          {interventions.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "2rem 1rem",
                color: "#64748b",
                fontStyle: "italic",
              }}
            >
              {!analysisData
                ? "Draw a polygon and analyze the current situation to add interventions"
                : 'No interventions configured yet. Click "Add New Intervention" to get started.'}
            </div>
          )}

          {interventions.map((intervention) => (
            <InterventionCard
              key={intervention.id}
              selected={selectedIntervention === intervention.id}
              onClick={() => setSelectedIntervention(intervention.id)}
              whileHover={{ scale: 1.02 }}
            >
              <CardHeader>
                <InterventionType>
                  {intervention.metadata.name}
                </InterventionType>
                <StatusBadge status={intervention.status}>
                  {intervention.status === "configured" && "⚙️ Configured"}
                  {intervention.status === "analyzing" && "⏳ Analyzing..."}
                  {intervention.status === "analyzed" && "✅ Analyzed"}
                </StatusBadge>
              </CardHeader>
              <InterventionTitle>
                {intervention.metadata.name} Implementation
              </InterventionTitle>
              <InterventionDescription>
                {intervention.metadata.description}
              </InterventionDescription>
              <InterventionMeta>
                <span>
                  <FiMapPin size={12} /> Target Area:{" "}
                  {(intervention.polygonArea / 10000).toFixed(2)} hectares
                </span>
                <span>
                  Created:{" "}
                  {new Date(intervention.createdAt).toLocaleDateString()}
                </span>
              </InterventionMeta>

              <ActionButtons>
                {intervention.status === "configured" && (
                  <ActionButton
                    variant="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRunAnalysis(intervention.id);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiPlay size={14} />
                    Run Analysis
                  </ActionButton>
                )}

                {intervention.status === "analyzing" && (
                  <ActionButton variant="secondary" disabled>
                    <FiPlay size={14} />
                    Analyzing...
                  </ActionButton>
                )}

                {intervention.status === "analyzed" && (
                  <ActionButton
                    variant="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewResults(intervention.id);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiBarChart2 size={14} />
                    View Results
                  </ActionButton>
                )}

                <ActionButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteIntervention(intervention.id);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiTrash2 size={14} />
                  Delete
                </ActionButton>
              </ActionButtons>
            </InterventionCard>
          ))}

          {/* Combine All Interventions Button */}
          {interventions.filter((i) => i.status === "analyzed").length >= 2 && (
            <AddButton
              onClick={handleCombineInterventions}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                color: "white",
                border: "2px solid #8b5cf6",
                marginTop: "1rem",
              }}
            >
              <FiBarChart2 size={20} />
              View Combined Impact (
              {interventions.filter((i) => i.status === "analyzed").length}{" "}
              interventions)
            </AddButton>
          )}
        </PlannerPanel>
      </ContentGrid>

      {/* Analysis Modal */}
      <AnalysisModal
        isOpen={isAnalysisModalOpen}
        onClose={() => setIsAnalysisModalOpen(false)}
        isLoading={isAnalysisLoading}
        data={analysisData}
      />

      {/* Intervention Configuration Modal */}
      <InterventionConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onApply={handleApplyIntervention}
        polygonArea={calculatePolygonArea(drawnCoordinates)}
      />

      {/* Intervention Results Modal */}
      <InterventionResultsModal
        isOpen={isResultsModalOpen}
        onClose={() => setIsResultsModalOpen(false)}
        results={currentResults}
      />
    </Container>
  );
};

export default InterventionPlanner;
