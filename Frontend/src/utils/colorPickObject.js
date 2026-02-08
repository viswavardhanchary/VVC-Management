const oceanicTheme = {
  id: 5,
  name: "Oceanic Calm",
  type: "light", 
  
  colors: {
    bg: "#ECFEFF",          // Very light Cyan (Background)
    card: "#FFFFFF",        // White (Surface)
    textPrimary: "#164E63", // Dark Teal (Headings/Body)
    textSecondary: "#0E7490", // Medium Teal (Subtitles/Metadata)
    accent: "#06B6D4",      // Cyan (Primary Buttons/Links)
    border: "#CFFAFE",      // Light Cyan (Dividers)

    
    accentHover: "#0891B2", // Slightly darker cyan for button hovers
    accentActive: "#155E75", // Deep teal for active/pressed states
    textOnAccent: "#FFFFFF", // Text color when sitting ON TOP of the accent color

    success: "#10B981",     // Emerald Green (Fits better with water themes than standard green)
    error: "#EF4444",       // Red (Standard accessible alert)
    warning: "#F59E0B",     // Amber
    info: "#3B82F6",        // Royal Blue


    primaryGradient: "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)", 
    surfaceGradient: "linear-gradient(180deg, #FFFFFF 0%, #F0FDFA 100%)",
  },


  typography: {
    fontFamily: "'Inter', 'Nunito', sans-serif", // Rounded sans-serifs look best with water themes
    fontSizeBase: "1rem",
    lineHeight: "1.6",
  },

  shape: {
    borderRadius: "16px", // "Fluid" themes usually have rounder corners than "Industrial" ones
    borderRadiusSmall: "8px",
  },

  // --- Shadows (The "Secret Sauce") ---
  // A blue-tinted shadow looks much cleaner than a black shadow on a blue background
  shadows: {
    sm: "0 1px 2px 0 rgba(6, 182, 212, 0.05)",
    md: "0 4px 6px -1px rgba(6, 182, 212, 0.1), 0 2px 4px -1px rgba(6, 182, 212, 0.06)",
    lg: "0 10px 15px -3px rgba(6, 182, 212, 0.1), 0 4px 6px -2px rgba(6, 182, 212, 0.05)",
  }
};

export default oceanicTheme;