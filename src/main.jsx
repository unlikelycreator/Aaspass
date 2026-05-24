import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// src/renderer.jsx - ADD THESE LINES FIRST, before any imports or ReactDOM
window.ZoomChartsLicense = "ZCP-h97p064d4: 30 day ZoomCharts Trial licence (valid for testing only)";
window.ZoomChartsLicenseKey = "a46c59ec25f8108a2f5129c8ce40e048002dd658930ee9822c" +
  "b5a7564b4116fe2acbe0e34bde974010c09bab128f8343cfea5a72b0fa0d96ea8b4405eb63678" +
  "848b1a80543e701a8256ad2057080953002fbdd02534dea519e2ade965e7e44381f8e4f184c06" +
  "71c1cc70a46e7d577441ef064501687b9e6ba0f4075087da8bb0831ef21270ef6cda16a4c1d7a" +
  "a369815ea6a7307df38f4722182febce9db7742f49b1a2a968afffe97bb6eb04580b1f6766f0a" +
  "c4b7f3a95ea31ed5295e715ad2f38b5f7e6436f5d89d4da0ff4bbeaa63724b4cfc431f7b0326b" +
  "1a64b031635fd1763d44569ff633bd36dea596d639b620e3761e920c95b7cc8d8ff0c5ff7b076";

window.ZoomChartsAssetsBase = "/assets/zoomcharts/";   
createRoot(document.getElementById('root')).render(<App />);