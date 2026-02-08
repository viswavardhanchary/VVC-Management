import React, { useState } from 'react';

const ColorPicker = () => {
  // 10 Distinct Themes
  const themes = [
    {
      id: 1,
      name: "Modern Clean (SaaS)",
      colors: {
        bg: "#F3F4F6",         // Light Gray
        card: "#FFFFFF",       // White
        textPrimary: "#111827",// Near Black
        textSecondary: "#6B7280",// Gray
        accent: "#3B82F6",     // Royal Blue
        border: "#E5E7EB"
      },
      fontScale: "1rem"
    },
    {
      id: 2,
      name: "Midnight Developer",
      colors: {
        bg: "#0F172A",         // Deep Navy
        card: "#1E293B",       // Slate
        textPrimary: "#F8FAFC",// Off White
        textSecondary: "#94A3B8",// Blue Gray
        accent: "#38BDF8",     // Sky Blue
        border: "#334155"
      },
      fontScale: "1rem"
    },
    {
      id: 3,
      name: "Earthy Nature",
      colors: {
        bg: "#F7F5EB",         // Cream
        card: "#FFFFFF",       // White
        textPrimary: "#2C3E2D",// Dark Green
        textSecondary: "#5F6F65",// Muted Green
        accent: "#D97706",     // Amber/Soil
        border: "#E2E8F0"
      },
      fontScale: "1.05rem" // Slightly larger for readability
    },
    {
      id: 4,
      name: "Cyberpunk Neon",
      colors: {
        bg: "#050505",         // Black
        card: "#1A1A1A",       // Dark Gray
        textPrimary: "#E2E8F0",// Light Gray
        textSecondary: "#A3A3A3",// Gray
        accent: "#D946EF",     // Neon Magenta
        border: "#D946EF"      // Colored Border
      },
      fontScale: "1rem"
    },
    {
      id: 5,
      name: "Oceanic Calm",
      colors: {
        bg: "#ECFEFF",         // Light Cyan
        card: "#FFFFFF",       // White
        textPrimary: "#164E63",// Dark Teal
        textSecondary: "#0E7490",// Medium Teal
        accent: "#06B6D4",     // Cyan
        border: "#CFFAFE"
      },
      fontScale: "1rem"
    },
    {
      id: 6,
      name: "Sunset Warmth",
      colors: {
        bg: "#FFF7ED",         // Orange Tint
        card: "#FFFFFF",       // White
        textPrimary: "#7C2D12",// Rust
        textSecondary: "#9A3412",// Burnt Orange
        accent: "#EA580C",     // Bright Orange
        border: "#FFEDD5"
      },
      fontScale: "1.02rem"
    },
    {
      id: 7,
      name: "Luxury Gold",
      colors: {
        bg: "#1C1917",         // Warm Black
        card: "#292524",       // Stone
        textPrimary: "#FAFAF9",// Stone White
        textSecondary: "#A8A29E",// Stone Gray
        accent: "#D4AF37",     // Gold
        border: "#44403C"
      },
      fontScale: "0.95rem" // Elegant/Small
    },
    {
      id: 8,
      name: "Berry Pop",
      colors: {
        bg: "#FDF2F8",         // Pink Tint
        card: "#FFFFFF",       // White
        textPrimary: "#831843",// Dark Pink
        textSecondary: "#9D174D",// Medium Pink
        accent: "#DB2777",     // Hot Pink
        border: "#FBCFE8"
      },
      fontScale: "1.1rem" // Playful/Large
    },
    {
      id: 9,
      name: "Lavender Dream",
      colors: {
        bg: "#FAF5FF",         // Light Purple
        card: "#FFFFFF",       // White
        textPrimary: "#581C87",// Dark Purple
        textSecondary: "#7E22CE",// Purple
        accent: "#A855F7",     // Light Purple
        border: "#F3E8FF"
      },
      fontScale: "1rem"
    },
    {
      id: 10,
      name: "Corporate Trust",
      colors: {
        bg: "#F0F4F8",         // Cool Gray
        card: "#FFFFFF",       // White
        textPrimary: "#102A43",// Navy
        textSecondary: "#486581",// Steel Blue
        accent: "#334E68",     // Slate
        border: "#D9E2EC"
      },
      fontScale: "0.98rem"
    },
    {
      id: 11,
      name: "Solarized Light",
      colors: {
        bg: "#FDF6E3",         // Creamy Beige
        card: "#EEE8D5",       // Darker Beige
        textPrimary: "#657B83",// Grayish Blue
        textSecondary: "#93A1A1",// Lighter Grayish Blue
        accent: "#B58900",     // Yellow/Orange
        border: "#D3D7CF"
      },
      fontScale: "1.05rem" // Optimized for readability
    },
    {
      id: 12,
      name: "Dracula Dark",
      colors: {
        bg: "#282A36",         // Dark Blue/Gray
        card: "#44475A",       // Lighter Blue/Gray
        textPrimary: "#F8F8F2",// White
        textSecondary: "#6272A4",// Grayish Purple
        accent: "#FF79C6",     // Pink
        border: "#BD93F9"      // Purple
      },
      fontScale: "1rem"
    },
    {
      id: 13,
      name: "Forest Deep",
      colors: {
        bg: "#1A2F23",         // Deep Green
        card: "#2E4F3E",       // Lighter Green
        textPrimary: "#E8F5E9",// Light Green
        textSecondary: "#A5D6A7",// Pale Green
        accent: "#66BB6A",     // Bright Green
        border: "#4CAF50"
      },
      fontScale: "1rem"
    },
    {
      id: 14,
      name: "Coffee House",
      colors: {
        bg: "#3E2723",         // Dark Brown
        card: "#5D4037",       // Medium Brown
        textPrimary: "#D7CCC8",// Beige
        textSecondary: "#A1887F",// Light Brown
        accent: "#FFAB91",     // Peach/Orange
        border: "#8D6E63"
      },
      fontScale: "1.02rem"
    },
    {
      id: 15,
      name: "Nebula Space",
      colors: {
        bg: "#220033",         // Deep Purple
        card: "#3B0054",       // Lighter Purple
        textPrimary: "#E0B0FF",// Light Lilac
        textSecondary: "#D8BFD8",// Thistle
        accent: "#00FFFF",     // Cyan
        border: "#8A2BE2"      // Blue Violet
      },
      fontScale: "1rem"
    },
    {
      id: 16,
      name: "Mint Fresh",
      colors: {
        bg: "#F0FFF4",         // Very Light Mint
        card: "#FFFFFF",       // White
        textPrimary: "#22543D",// Dark Green
        textSecondary: "#48BB78",// Medium Green
        accent: "#38A169",     // Green
        border: "#C6F6D5"
      },
      fontScale: "1rem"
    },
    {
      id: 17,
      name: "Royal Velvet",
      colors: {
        bg: "#4A148C",         // Deep Purple
        card: "#6A1B9A",       // Purple
        textPrimary: "#F3E5F5",// Light Lavender
        textSecondary: "#E1BEE7",// Lavender
        accent: "#FFD700",     // Gold
        border: "#7B1FA2"
      },
      fontScale: "1.05rem" // Elegant
    },
    {
      id: 18,
      name: "Industrial Gray",
      colors: {
        bg: "#212121",         // Dark Gray
        card: "#424242",       // Gray
        textPrimary: "#E0E0E0",// Light Gray
        textSecondary: "#9E9E9E",// Medium Gray
        accent: "#FF5722",     // Deep Orange
        border: "#616161"
      },
      fontScale: "0.98rem"
    },
    {
      id: 19,
      name: "Pastel Dream",
      colors: {
        bg: "#FFF0F5",         // Lavender Blush
        card: "#FFFFFF",       // White
        textPrimary: "#708090",// Slate Gray
        textSecondary: "#A9A9A9",// Dark Gray
        accent: "#FFB6C1",     // Light Pink
        border: "#FFC0CB"
      },
      fontScale: "1rem"
    },
    {
      id: 20,
      name: "High Contrast (Accessibility)",
      colors: {
        bg: "#000000",         // Black
        card: "#FFFFFF",       // White
        textPrimary: "#000000",// Black
        textSecondary: "#000000",// Black
        accent: "#FFFF00",     // Yellow
        border: "#FFFFFF"
      },
      fontScale: "1.2rem" // Large for readability
    }
  ];

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '40px', backgroundColor: '#e5e5e5' }}>
      <h1 style={{ marginBottom: '30px', textAlign: 'center', color: '#333' }}>
        App Theme Selector
      </h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '30px' 
      }}>
        {themes.map((theme) => (
          <div key={theme.id} style={{
            backgroundColor: theme.colors.bg,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            {/* Header Area */}
            <div style={{ borderBottom: `1px solid ${theme.colors.border}`, paddingBottom: '15px' }}>
              <h2 style={{ 
                color: theme.colors.textPrimary, 
                fontSize: `calc(${theme.fontScale} * 1.5)`, 
                margin: 0 
              }}>
                {theme.name}
              </h2>
              <p style={{ 
                color: theme.colors.textSecondary, 
                fontSize: `calc(${theme.fontScale} * 0.875)`, 
                marginTop: '5px' 
              }}>
                Interface Preview
              </p>
            </div>

            {/* Card Example */}
            <div style={{
              backgroundColor: theme.colors.card,
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ 
                color: theme.colors.textPrimary, 
                fontSize: `calc(${theme.fontScale} * 1.25)`,
                marginTop: 0 
              }}>
                Card Title
              </h3>
              <p style={{ 
                color: theme.colors.textSecondary, 
                fontSize: theme.fontScale,
                lineHeight: '1.6'
              }}>
                This is how your main content will look. The contrast between the card and the background is crucial for depth.
              </p>
              
              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <button style={{
                  backgroundColor: theme.colors.accent,
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: `calc(${theme.fontScale} * 0.9)`
                }}>
                  Primary Action
                </button>
                <button style={{
                  backgroundColor: 'transparent',
                  color: theme.colors.textSecondary,
                  border: `1px solid ${theme.colors.border}`,
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: `calc(${theme.fontScale} * 0.9)`
                }}>
                  Cancel
                </button>
              </div>
            </div>

            {/* Color Palette Strip */}
            <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
              <div title="Background" style={{ width: '30px', height: '30px', borderRadius: '50%', background: theme.colors.bg, border: '1px solid #ddd' }}></div>
              <div title="Card" style={{ width: '30px', height: '30px', borderRadius: '50%', background: theme.colors.card, border: '1px solid #ddd' }}></div>
              <div title="Accent" style={{ width: '30px', height: '30px', borderRadius: '50%', background: theme.colors.accent }}></div>
              <div title="Text" style={{ width: '30px', height: '30px', borderRadius: '50%', background: theme.colors.textPrimary }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
