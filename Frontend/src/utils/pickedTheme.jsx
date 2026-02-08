import React, { useState } from 'react';

const PickedTheme = () => {
  // --- The Enhanced Theme Object ---
  const theme = {
    colors: {
      bg: "#ECFEFF",          
      card: "#FFFFFF",        
      textPrimary: "#164E63", 
      textSecondary: "#0E7490", 
      accent: "#06B6D4",      
      accentHover: "#0891B2",
      border: "#CFFAFE",      
      success: "#10B981",     
      error: "#EF4444",       
      gradient: "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)",
      shadowSm: "0 1px 2px 0 rgba(6, 182, 212, 0.05)",
      shadowMd: "0 4px 6px -1px rgba(6, 182, 212, 0.1), 0 2px 4px -1px rgba(6, 182, 212, 0.06)",
      shadowLg: "0 10px 15px -3px rgba(6, 182, 212, 0.15), 0 4px 6px -2px rgba(6, 182, 212, 0.1)",
      shadowHover: "0 20px 25px -5px rgba(6, 182, 212, 0.2), 0 10px 10px -5px rgba(6, 182, 212, 0.1)"
    }
  };

  // State for simple interaction demo
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="oceanic-wrapper">
      {/* INJECTED STYLES 
         (This ensures animations work without an external CSS file)
      */}
      <style>{`
        .oceanic-wrapper {
          font-family: 'Segoe UI', 'Inter', sans-serif;
          background-color: ${theme.colors.bg};
          min-height: 100vh;
          padding: 40px;
          color: ${theme.colors.textPrimary};
          transition: background-color 0.3s ease;
        }

        /* Card Animation */
        .oceanic-card {
          background: ${theme.colors.card};
          border-radius: 16px;
          border: 1px solid ${theme.colors.border};
          box-shadow: ${theme.colors.shadowMd};
          padding: 24px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: floatIn 0.6s ease-out forwards;
        }

        .oceanic-card:hover {
          transform: translateY(-4px);
          box-shadow: ${theme.colors.shadowHover};
          border-color: ${theme.colors.accent};
        }

        /* Buttons */
        .btn-primary {
          background: ${theme.colors.gradient};
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: ${theme.colors.shadowSm};
          transition: all 0.2s ease;
        }
        
        .btn-primary:hover {
          transform: scale(1.02);
          box-shadow: ${theme.colors.shadowLg};
        }
        
        .btn-primary:active {
          transform: scale(0.98);
        }

        .btn-secondary {
          background: transparent;
          color: ${theme.colors.textSecondary};
          border: 2px solid ${theme.colors.border};
          padding: 10px 22px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-secondary:hover {
          border-color: ${theme.colors.accent};
          color: ${theme.colors.accentHover};
          background: rgba(6, 182, 212, 0.05);
        }

        /* Inputs */
        .oceanic-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          border: 2px solid ${theme.colors.border};
          background: #F8FEFF;
          color: ${theme.colors.textPrimary};
          outline: none;
          transition: all 0.2s ease;
          box-sizing: border-box; /* Important for padding */
        }

        .oceanic-input:focus {
          border-color: ${theme.colors.accent};
          box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.15);
          background: white;
        }

        /* Badges/Tags */
        .badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-right: 8px;
        }
        .badge-accent { background: rgba(6, 182, 212, 0.1); color: ${theme.colors.accentHover}; }
        .badge-success { background: rgba(16, 185, 129, 0.1); color: ${theme.colors.success}; }

        /* Keyframe Animation */
        @keyframes floatIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Color Circle Utility */
        .color-circle {
          width: 40px; 
          height: 40px; 
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: ${theme.colors.shadowMd};
          cursor: pointer;
          transition: transform 0.2s;
        }
        .color-circle:hover { transform: scale(1.1); }
      `}</style>

      {/* --- CONTENT AREA --- */}

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Oceanic Calm</h1>
          <p style={{ color: theme.colors.textSecondary, fontSize: '1.1rem' }}>
            A UI kit optimized for focus, clarity, and reduced eye strain.
          </p>
        </div>

        {/* 1. INTERACTIVE CARDS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          
          {/* Card 1: Form Elements */}
          <div className="oceanic-card">
            <h3 style={{ marginTop: 0 }}>Login Example</h3>
            <p style={{ color: theme.colors.textSecondary, fontSize: '0.9rem', marginBottom: '20px' }}>
              Interact with the inputs to see the focus rings.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: theme.colors.textSecondary }}>Email Address</label>
                <input className="oceanic-input" type="email" placeholder="user@oceanic.app" />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: theme.colors.textSecondary }}>Password</label>
                <input className="oceanic-input" type="password" placeholder="••••••••" />
              </div>

              <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                <button className="btn-primary" style={{ flex: 1 }}>Sign In</button>
                <button className="btn-secondary">Cancel</button>
              </div>
            </div>
          </div>

          {/* Card 2: Data Display / Dashboard */}
          <div className="oceanic-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0 }}>Project Status</h3>
              <span className="badge badge-success">Active</span>
            </div>
            
            <p style={{ color: theme.colors.textSecondary, lineHeight: '1.6' }}>
              The Oceanic theme uses tinted shadows to create depth. Hover over this card to see the 
              lift effect and border highlight.
            </p>

            <div style={{ marginTop: '20px', padding: '15px', background: '#F8FEFF', borderRadius: '12px', border: `1px solid ${theme.colors.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: theme.colors.accent }}></div>
                <strong style={{ fontSize: '0.9rem' }}>System Operational</strong>
              </div>
              <div style={{ width: '100%', height: '6px', background: theme.colors.border, borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '75%', height: '100%', background: theme.colors.gradient }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '0.8rem', color: theme.colors.textSecondary }}>
                <span>Storage</span>
                <span>75% Used</span>
              </div>
            </div>
          </div>

        </div>

        {/* 2. COLOR PALETTE STRIP */}
        <div style={{ marginTop: '50px', padding: '30px', background: 'white', borderRadius: '16px', boxShadow: theme.colors.shadowSm }}>
          <h4 style={{ margin: '0 0 20px 0' }}>Theme Palette</h4>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            
            <div style={{ textAlign: 'center' }}>
              <div className="color-circle" style={{ background: theme.colors.textPrimary }}></div>
              <span style={{ fontSize: '0.8rem', display: 'block', marginTop: '8px', color: theme.colors.textSecondary }}>Primary</span>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div className="color-circle" style={{ background: theme.colors.accent }}></div>
              <span style={{ fontSize: '0.8rem', display: 'block', marginTop: '8px', color: theme.colors.textSecondary }}>Accent</span>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div className="color-circle" style={{ background: theme.colors.success }}></div>
              <span style={{ fontSize: '0.8rem', display: 'block', marginTop: '8px', color: theme.colors.textSecondary }}>Success</span>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div className="color-circle" style={{ background: theme.colors.bg, border: '1px solid #ddd' }}></div>
              <span style={{ fontSize: '0.8rem', display: 'block', marginTop: '8px', color: theme.colors.textSecondary }}>Background</span>
            </div>

             <div style={{ textAlign: 'center' }}>
              <div className="color-circle" style={{ background: theme.colors.gradient }}></div>
              <span style={{ fontSize: '0.8rem', display: 'block', marginTop: '8px', color: theme.colors.textSecondary }}>Gradient</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default PickedTheme;