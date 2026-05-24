// src/pages/Landing.tsx   (or .jsx)

import React from 'react';

import {
  PieChart,
  TimeChart,
  NetChart,
  GeoChart,
  FacetChart,
} from '@dvsl/react-zoomcharts';

import '@dvsl/react-zoomcharts/zc.css';
// import '@dvsl/react-zoomcharts/leaflet.css';  // ← only if GeoChart needs better map styling

export default function Landing() {
  return (
    <div style={{ 
      padding: '24px', 
      maxWidth: '1600px', 
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        marginBottom: '40px',
        color: '#1e293b'
      }}>
        ZoomCharts – All Main Chart Types (Fixed for React Wrapper)
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
        gap: '32px',
      }}>

        {/* PieChart – hierarchical data via settings.data */}
        <div style={{ 
          border: '1px solid #e2e8f0', 
          borderRadius: '12px', 
          padding: '20px',
          background: '#ffffff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <h2 style={{ marginTop: 0, fontSize: '1.4rem' }}>PieChart (Hierarchical)</h2>
          <div style={{ width: '100%', height: '360px' }}>
            <PieChart
              settings={{
                data: [{
                  preloaded: {
                    subvalues: [
                      { id: 'asia', name: 'Asia', value: 59 },
                      { id: 'africa', name: 'Africa', value: 17 },
                      { id: 'europe', name: 'Europe', value: 9 },
                      { id: 'americas', name: 'Americas', value: 13,
                        subvalues: [
                          { id: 'na', name: 'North America', value: 8 },
                          { id: 'sa', name: 'South America', value: 5 }
                        ]
                      },
                      { id: 'oceania', name: 'Oceania', value: 2 }
                    ]
                  }
                }]
              }}
            />
          </div>
        </div>

        {/* TimeChart */}
        <div style={{ 
          border: '1px solid #e2e8f0', 
          borderRadius: '12px', 
          padding: '20px',
          background: '#ffffff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <h2 style={{ marginTop: 0, fontSize: '1.4rem' }}>TimeChart (Time Series)</h2>
          <div style={{ width: '100%', height: '360px' }}>
            <TimeChart
              settings={{
                data: [
                  {
                    id: 'users',
                    name: 'Active Users',
                    color: '#3b82f6',
                    points: [
                      { x: '2025-10-01', y: 12400 },
                      { x: '2025-11-01', y: 15800 },
                      { x: '2025-12-01', y: 19200 },
                      { x: '2026-01-01', y: 23100 },
                      { x: '2026-02-01', y: 24800 }
                    ]
                  },
                  {
                    id: 'revenue',
                    name: 'Revenue (k$)',
                    color: '#10b981',
                    points: [
                      { x: '2025-10-01', y: 84 },
                      { x: '2025-11-01', y: 112 },
                      { x: '2025-12-01', y: 145 },
                      { x: '2026-01-01', y: 178 },
                      { x: '2026-02-01', y: 195 }
                    ]
                  }
                ]
              }}
              toolbar={{ enabled: true }}
            />
          </div>
        </div>

        {/* NetChart */}
        <div style={{ 
          border: '1px solid #e2e8f0', 
          borderRadius: '12px', 
          padding: '20px',
          background: '#ffffff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          gridColumn: '1 / -1'
        }}>
          <h2 style={{ marginTop: 0, fontSize: '1.4rem' }}>NetChart (Network Graph)</h2>
          <div style={{ width: '100%', height: '500px' }}>
            <NetChart
              settings={{
                data: {
                  nodes: [
                    { id: '1', name: 'Founder', fillColor: '#ef4444', size: 40 },
                    { id: '2', name: 'CEO', fillColor: '#f97316', size: 32 },
                    { id: '3', name: 'CTO', fillColor: '#3b82f6', size: 32 },
                    { id: '4', name: 'CFO', fillColor: '#8b5cf6', size: 28 },
                    { id: '5', name: 'Lead Dev', fillColor: '#06b6d4' },
                    { id: '6', name: 'Dev 1', fillColor: '#06b6d4' },
                    { id: '7', name: 'Dev 2', fillColor: '#06b6d4' },
                    { id: '8', name: 'Marketing', fillColor: '#ec4899' }
                  ],
                  links: [
                    { from: '1', to: '2' },
                    { from: '2', to: '3' },
                    { from: '2', to: '4' },
                    { from: '3', to: '5' },
                    { from: '5', to: '6' },
                    { from: '5', to: '7' },
                    { from: '2', to: '8' }
                  ]
                }
              }}
            />
          </div>
        </div>

        {/* GeoChart – basic choropleth; may need more config for tiles/map */}
        <div style={{ 
          border: '1px solid #e2e8f0', 
          borderRadius: '12px', 
          padding: '20px',
          background: '#ffffff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <h2 style={{ marginTop: 0, fontSize: '1.4rem' }}>GeoChart (Choropleth)</h2>
          <div style={{ width: '100%', height: '360px' }}>
            <GeoChart
              settings={{
                data: [
                  { id: 'IN', value: 1420, name: 'India' },
                  { id: 'CN', value: 1410, name: 'China' },
                  { id: 'US', value: 340, name: 'United States' },
                  { id: 'ID', value: 280, name: 'Indonesia' },
                  { id: 'PK', value: 240, name: 'Pakistan' },
                  { id: 'BR', value: 216, name: 'Brazil' }
                ],
                // Add these for better map display (optional but recommended):
                // map: "world",
                // tileLayer: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              }}
            />
          </div>
        </div>

        {/* FacetChart */}
        <div style={{ 
          border: '1px solid #e2e8f0', 
          borderRadius: '12px', 
          padding: '20px',
          background: '#ffffff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <h2 style={{ marginTop: 0, fontSize: '1.4rem' }}>FacetChart (Multi-series)</h2>
          <div style={{ width: '100%', height: '360px' }}>
            <FacetChart
              settings={{
                data: [
                  {
                    id: 'sales',
                    name: 'Sales',
                    color: '#6366f1',
                    points: [
                      { x: 'Q1 2025', y: 240 },
                      { x: 'Q2 2025', y: 380 },
                      { x: 'Q3 2025', y: 310 },
                      { x: 'Q4 2025', y: 450 }
                    ]
                  },
                  {
                    id: 'profit',
                    name: 'Profit',
                    color: '#f59e0b',
                    points: [
                      { x: 'Q1 2025', y: 92 },
                      { x: 'Q2 2025', y: 145 },
                      { x: 'Q3 2025', y: 118 },
                      { x: 'Q4 2025', y: 172 }
                    ]
                  }
                ]
              }}
            />
          </div>
        </div>

      </div>

      <div style={{ 
        marginTop: '60px', 
        textAlign: 'center', 
        color: '#64748b',
        fontSize: '0.95rem'
      }}>
        <p>Interactive: zoom, pan, drill-down, tooltips, etc. work now.</p>
        <p>
          Docs: <a href="https://zoomcharts.com/en/javascript-charts-library/integration/react" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>
            React Integration
          </a>
        </p>
        <p style={{ marginTop: '12px', fontSize: '0.9rem' }}>
          Note: Remove watermark / unlock features with a license key via <code>window.ZoomChartsLicense</code>.
        </p>
      </div>
    </div>
  );
}