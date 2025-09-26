/**
 * Service for loading and managing Dhaka boundary data
 */

class BoundaryService {
  static boundaryData = null;
  static loadPromise = null;

  /**
   * Load Dhaka boundary GeoJSON data (cached after first load)
   * @returns {Promise<Object>} GeoJSON boundary data
   */
  static async loadBoundaryData() {
    if (this.boundaryData) {
      return this.boundaryData;
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = this._fetchBoundaryData();

    try {
      this.boundaryData = await this.loadPromise;
      return this.boundaryData;
    } catch (error) {
      this.loadPromise = null; // Reset promise on error so retry is possible
      throw error;
    }
  }

  /**
   * Private method to fetch boundary data from the server
   * @private
   */
  static async _fetchBoundaryData() {
    try {
      const response = await fetch("/data/dhaka_boundary.geojson");

      if (!response.ok) {
        throw new Error(`Failed to load boundary data: ${response.statusText}`);
      }

      const geojsonData = await response.json();

      if (!geojsonData.features || geojsonData.features.length === 0) {
        throw new Error("Invalid boundary GeoJSON data");
      }

      return geojsonData;
    } catch (error) {
      console.error("Error loading Dhaka boundary:", error);
      throw error;
    }
  }

  /**
   * Get boundary style configuration for red boundary with glow effect
   * @param {string} layer - The layer type: 'glow-outer', 'glow-middle', or 'main'
   * @returns {Object} Leaflet style configuration
   */
  static getBoundaryStyle(layer = "main") {
    const styles = {
      "glow-outer": {
        color: "#FFB6C1", // Light pink glow
        weight: 3, // Thickest for outer glow
        opacity: 0.3, // Semi-transparent
        fillOpacity: 0, // No fill for glow
        lineCap: "round",
        lineJoin: "round",
      },
      "glow-middle": {
        color: "#FF6464", // Medium red glow
        weight: 2, // Medium thickness
        opacity: 0.5, // Semi-transparent
        fillOpacity: 0, // No fill for glow
        lineCap: "round",
        lineJoin: "round",
      },
      main: {
        color: "#DC143C", // Crimson red main boundary
        weight: 1, // Main border thickness (reduced from 4)
        opacity: 1, // Full opacity
        fillColor: "#DC143C", // Same color for fill
        fillOpacity: 0, // No fill - completely transparent
        dashArray: null, // Solid line
        lineCap: "round",
        lineJoin: "round",
      },
    };

    return styles[layer] || styles.main;
  }

  /**
   * Clear cached boundary data (useful for testing or if data needs to be reloaded)
   */
  static clearCache() {
    this.boundaryData = null;
    this.loadPromise = null;
  }

  /**
   * Get the bounds of the boundary for map fitting
   * @returns {Promise<Array>} Array of [[south, west], [north, east]] coordinates
   */
  static async getBounds() {
    const boundaryData = await this.loadBoundaryData();

    if (!boundaryData.features || boundaryData.features.length === 0) {
      throw new Error("No boundary features found");
    }

    // Calculate bounds from the GeoJSON
    let minLat = Infinity,
      maxLat = -Infinity;
    let minLng = Infinity,
      maxLng = -Infinity;

    boundaryData.features.forEach((feature) => {
      if (feature.geometry && feature.geometry.coordinates) {
        const coordinates = feature.geometry.coordinates[0]; // Assuming polygon
        coordinates.forEach((coord) => {
          const [lng, lat] = coord;
          minLat = Math.min(minLat, lat);
          maxLat = Math.max(maxLat, lat);
          minLng = Math.min(minLng, lng);
          maxLng = Math.max(maxLng, lng);
        });
      }
    });

    return [
      [minLat, minLng],
      [maxLat, maxLng],
    ];
  }
}

export default BoundaryService;
