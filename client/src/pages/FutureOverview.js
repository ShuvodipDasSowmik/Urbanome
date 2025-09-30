// src/pages/FutureOverview.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const Container = styled.div`
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FutureReport = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 3rem 4rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
`;

const YearTitle = styled.h2`
  font-size: 1.5rem;
  color: #1e293b;
  margin-bottom: 1rem;
`;

const Select = styled.select`
  padding: 0.5rem 1rem;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  font-size: 1rem;
  margin-bottom: 2rem;
`;

const GreenspaceValue = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: #10b981;
  margin-bottom: 2rem;
`;

const DetailsButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: #2563eb;
  }
`;

const FutureOverview = () => {
  const [dataset, setDataset] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2025");

  useEffect(() => {
    // Read the txt file from public folder
    fetch("/greenspace.txt")
      .then((res) => res.text())
      .then((text) => {
        const parsed = text
          .split("\n")
          .map((line) => {
            const [year, greenspace] = line.split(",");
            return { year: year.trim(), greenspace: greenspace.trim() };
          })
          .filter((row) =>
            ["2025", "2026", "2027", "2028", "2029", "2030"].includes(row.year)
          );
        setDataset(parsed);
      })
      .catch((err) => console.error("Failed to load greenspace data:", err));
  }, []);

  const currentData = dataset.find((row) => row.year === selectedYear);

  const handleSeeDetails = () => {
    // Open the PDF in a new tab
    window.open("/Greenspace.pdf", "_blank");
  };

  return (
    <Container>
      <FutureReport
        key={selectedYear}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <YearTitle>Future Report {selectedYear}</YearTitle>

        {/* Year Selector */}
        <Select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {dataset.map((row) => (
            <option key={row.year} value={row.year}>
              {row.year}
            </option>
          ))}
        </Select>

        {/* Greenspace */}
        <GreenspaceValue>
          {currentData ? currentData.greenspace : "N/A"} Greenspace
        </GreenspaceValue>

        {/* See Details Button */}
        <DetailsButton onClick={handleSeeDetails}>
          See Details
        </DetailsButton>
      </FutureReport>
    </Container>
  );
};

export default FutureOverview;
