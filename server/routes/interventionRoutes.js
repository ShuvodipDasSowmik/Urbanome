const express = require('express');
const router = express.Router();

// GET /api/interventions/types - Get available intervention types
router.get('/types', async (req, res) => {
  try {
    const interventionTypes = [
      {
        id: 'green-roofs',
        name: 'Green Roofs',
        category: 'vegetation',
        description: 'Installing vegetation on building rooftops to reduce heat and improve air quality',
        benefits: ['Temperature reduction', 'Energy savings', 'Stormwater management'],
        averageCost: 150000,
        unit: 'per building',
        implementationTime: '3-6 months',
        maintenanceRequired: 'Medium',
        co2Reduction: 5.2, // tons per year
        icon: 'green-roof'
      },
      {
        id: 'urban-trees',
        name: 'Urban Tree Planting',
        category: 'vegetation',
        description: 'Strategic placement of trees throughout urban areas',
        benefits: ['Air quality improvement', 'Carbon sequestration', 'Shade provision'],
        averageCost: 500,
        unit: 'per tree',
        implementationTime: '1-2 months',
        maintenanceRequired: 'Low',
        co2Reduction: 0.5, // tons per year per tree
        icon: 'tree'
      },
      {
        id: 'wetlands',
        name: 'Urban Wetlands',
        category: 'water-management',
        description: 'Creating constructed wetlands for flood control and water purification',
        benefits: ['Flood prevention', 'Water quality improvement', 'Biodiversity'],
        averageCost: 250000,
        unit: 'per hectare',
        implementationTime: '6-12 months',
        maintenanceRequired: 'Low',
        co2Reduction: 15.8, // tons per year
        icon: 'wetland'
      },
      {
        id: 'permeable-surfaces',
        name: 'Permeable Surfaces',
        category: 'infrastructure',
        description: 'Replacing impermeable surfaces with permeable alternatives',
        benefits: ['Stormwater management', 'Groundwater recharge', 'Reduced runoff'],
        averageCost: 50,
        unit: 'per square meter',
        implementationTime: '2-4 months',
        maintenanceRequired: 'Medium',
        co2Reduction: 0.1, // tons per year per m²
        icon: 'permeable'
      },
      {
        id: 'cool-roofs',
        name: 'Cool Roofs',
        category: 'infrastructure',
        description: 'High-reflectance roofing materials to reduce heat absorption',
        benefits: ['Temperature reduction', 'Energy savings', 'Urban heat mitigation'],
        averageCost: 25000,
        unit: 'per building',
        implementationTime: '2-3 months',
        maintenanceRequired: 'Low',
        co2Reduction: 3.2, // tons per year
        icon: 'cool-roof'
      },
      {
        id: 'solar-panels',
        name: 'Solar Panel Installation',
        category: 'energy',
        description: 'Renewable energy generation through solar photovoltaic systems',
        benefits: ['Clean energy generation', 'Reduced emissions', 'Energy independence'],
        averageCost: 80000,
        unit: 'per building',
        implementationTime: '2-4 months',
        maintenanceRequired: 'Low',
        co2Reduction: 12.5, // tons per year
        icon: 'solar'
      }
    ];

    res.json({
      success: true,
      data: interventionTypes,
      count: interventionTypes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get intervention types',
      error: error.message
    });
  }
});

// POST /api/interventions/calculate - Calculate intervention impact
router.post('/calculate', async (req, res) => {
  try {
    const { interventions, cityData, budget = 500000 } = req.body;

    if (!interventions || !Array.isArray(interventions)) {
      return res.status(400).json({
        success: false,
        message: 'Interventions array is required'
      });
    }

    // Mock calculation based on interventions
    const calculation = {
      totalCost: interventions.reduce((sum, int) => sum + (int.cost || int.averageCost || 100000), 0),
      totalBenefit: interventions.reduce((sum, int) => sum + (int.benefit || 200000), 0),
      impactMetrics: {
        temperatureReduction: Math.min(interventions.length * 0.8, 5.0), // Max 5°C reduction
        co2Reduction: interventions.reduce((sum, int) => sum + (int.co2Reduction || 5), 0),
        energySavings: interventions.length * 15000, // kWh per year
        waterSavings: interventions.length * 25000, // liters per year
        airQualityImprovement: Math.min(interventions.length * 12, 50), // Max 50% improvement
        greenSpaceIncrease: interventions.filter(i => i.category === 'vegetation').length * 5 // hectares
      },
      implementation: {
        phases: [
          {
            phase: 1,
            duration: '0-6 months',
            interventions: interventions.slice(0, Math.ceil(interventions.length / 3)),
            cost: budget * 0.4
          },
          {
            phase: 2,
            duration: '6-18 months',
            interventions: interventions.slice(Math.ceil(interventions.length / 3), Math.ceil(interventions.length * 2 / 3)),
            cost: budget * 0.4
          },
          {
            phase: 3,
            duration: '18-24 months',
            interventions: interventions.slice(Math.ceil(interventions.length * 2 / 3)),
            cost: budget * 0.2
          }
        ],
        totalDuration: '24 months',
        riskFactors: [
          'Weather dependencies',
          'Community acceptance',
          'Regulatory approvals'
        ]
      },
      roi: {
        paybackPeriod: 6.8, // years
        netPresentValue: 750000,
        internalRateOfReturn: 0.185 // 18.5%
      },
      calculatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: calculation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to calculate intervention impact',
      error: error.message
    });
  }
});

// POST /api/interventions/optimize - Optimize intervention selection
router.post('/optimize', async (req, res) => {
  try {
    const { 
      availableInterventions = [], 
      budget = 500000, 
      priorities = { temperature: 1, flood: 1, air_quality: 1, cost: 1 },
      constraints = {}
    } = req.body;

    // Mock optimization algorithm
    const optimizedSelection = [
      {
        intervention: 'green-roofs',
        name: 'Green Roofs',
        quantity: 8,
        totalCost: 180000,
        priority: 1,
        score: 9.2,
        benefits: {
          temperatureReduction: 2.1,
          energySavings: 45000,
          co2Reduction: 41.6
        }
      },
      {
        intervention: 'urban-trees',
        name: 'Urban Tree Planting',
        quantity: 400,
        totalCost: 120000,
        priority: 2,
        score: 8.8,
        benefits: {
          airQualityImprovement: 25,
          temperatureReduction: 1.5,
          co2Reduction: 200
        }
      },
      {
        intervention: 'wetlands',
        name: 'Urban Wetlands',
        quantity: 0.8,
        totalCost: 200000,
        priority: 3,
        score: 8.5,
        benefits: {
          floodReduction: 35,
          waterQuality: 40,
          biodiversity: 60
        }
      }
    ];

    const optimization = {
      budget,
      usedBudget: optimizedSelection.reduce((sum, item) => sum + item.totalCost, 0),
      remainingBudget: budget - optimizedSelection.reduce((sum, item) => sum + item.totalCost, 0),
      selectedInterventions: optimizedSelection,
      projectedImpacts: {
        overallScore: 8.8,
        temperatureReduction: 3.6,
        floodReduction: 35,
        airQualityImprovement: 25,
        co2Reduction: 241.6,
        energySavings: 45000
      },
      alternatives: [
        {
          scenario: 'cost-focused',
          score: 7.2,
          budget: budget * 0.7,
          interventions: ['urban-trees', 'permeable-surfaces']
        },
        {
          scenario: 'impact-focused',
          score: 9.5,
          budget: budget * 1.2,
          interventions: ['green-roofs', 'wetlands', 'solar-panels']
        }
      ],
      optimizedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: optimization
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to optimize interventions',
      error: error.message
    });
  }
});

// GET /api/interventions/case-studies - Get intervention case studies
router.get('/case-studies', async (req, res) => {
  try {
    const caseStudies = [
      {
        id: 1,
        title: 'Singapore Green Building Program',
        location: 'Singapore',
        interventions: ['green-roofs', 'cool-roofs', 'urban-trees'],
        duration: '2008-2018',
        budget: 2500000,
        results: {
          temperatureReduction: 2.3,
          energySavings: 35,
          greenSpaceIncrease: 45,
          co2Reduction: 12000
        },
        lessons: [
          'Strong government support crucial',
          'Community engagement essential',
          'Regular monitoring improves outcomes'
        ]
      },
      {
        id: 2,
        title: 'Medellín Green Corridors',
        location: 'Medellín, Colombia',
        interventions: ['urban-trees', 'green-corridors', 'wetlands'],
        duration: '2016-2020',
        budget: 1800000,
        results: {
          temperatureReduction: 2.0,
          airQualityImprovement: 18,
          floodReduction: 42,
          biodiversityIncrease: 35
        },
        lessons: [
          'Multi-benefit approach more effective',
          'Local species selection important',
          'Maintenance planning critical'
        ]
      }
    ];

    res.json({
      success: true,
      data: caseStudies,
      count: caseStudies.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get case studies',
      error: error.message
    });
  }
});

module.exports = router;
