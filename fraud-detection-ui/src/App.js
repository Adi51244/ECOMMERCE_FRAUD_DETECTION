import React, { useState, useEffect } from "react";
import axios from "axios";
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [features, setFeatures] = useState(Array(15).fill(""));
  const [result, setResult] = useState(null);
  const [resultType, setResultType] = useState(""); // Add this state
  const [responseData, setResponseData] = useState(null);  // Add this state

  // Enhanced predefined feature sets
  const predefinedFeatures = {
    "Select Purchase Type": Array(15).fill(""),
    "Normal Online Shopping": [0.3, 0.4, 0.2, 0.3, 0.5, 0.4, 0.3, 0.2, 0.4, 0.3, 0.2, 0.4, 0.3, 0.2, 0.4],
    "High Value Electronics": [0.9, 0.8, 0.7, 0.9, 0.8, 0.7, 0.8, 0.9, 0.7, 0.8, 0.9, 0.7, 0.8, 0.9, 0.7],
    "International Transaction": [0.7, 0.8, 0.9, 0.9, 0.2, 0.1, 0.7, 0.8, 0.9, 0.7, 0.8, 0.9, 0.7, 0.8, 0.9],
    "Multiple Quick Purchases": [0.8, 0.9, 0.8, 0.9, 0.8, 0.9, 0.8, 0.9, 0.8, 0.9, 0.8, 0.9, 0.8, 0.9, 0.8],
    "Late Night Transaction": [0.6, 0.7, 0.8, 0.6, 0.7, 0.8, 0.6, 0.7, 0.8, 0.6, 0.7, 0.8, 0.6, 0.7, 0.8],
    "Suspicious Pattern": [0.95, 0.92, 0.88, 0.94, 0.91, 0.89, 0.93, 0.90, 0.87, 0.96, 0.93, 0.89, 0.92, 0.88, 0.94]
  };

  const getTransactionAmount = (features) => {
    // Simulate transaction amount based on feature values
    const baseAmount = Math.max(...features) * 1000;
    return baseAmount.toFixed(2);
  };

  const getRiskLevel = (probability) => {
    if (probability < 0.3) return { level: "Low Risk", color: "text-green-600" };
    if (probability < 0.7) return { level: "Medium Risk", color: "text-yellow-600" };
    return { level: "High Risk", color: "text-red-600" };
  };

  const handlePresetChange = (e) => {
    const selectedFeatures = predefinedFeatures[e.target.value];
    setFeatures(selectedFeatures);
  };

  const handleChange = (index, value) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const renderRiskBreakdown = (breakdown) => (
    <div className="mt-4 grid grid-cols-1 gap-4">
      {Object.entries(breakdown).map(([key, data]) => (
        <div key={key} className="border rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="font-medium capitalize">{key.replace('_', ' ')}</span>
            <span className={`font-bold ${
              data.score > 70 ? 'text-red-600' :
              data.score > 30 ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {data.score.toFixed(1)}%
            </span>
          </div>
          <div className="text-sm text-gray-600 mt-1">{data.description}</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full ${
                data.score > 70 ? 'bg-red-600' :
                data.score > 30 ? 'bg-yellow-600' : 'bg-green-600'
              }`}
              style={{ width: `${data.score}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 capitalize">{label}</h4>
          <p className="text-sm text-gray-600 mt-1">
            Score: <span className={`font-bold ${
              payload[0].value > 70 ? 'text-red-600' :
              payload[0].value > 30 ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {payload[0].value.toFixed(1)}%
            </span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {payload[0].payload.description}
          </p>
        </div>
      );
    }
    return null;
  };

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    });
  };

  const renderCharts = (breakdown) => {
    const chartData = Object.entries(breakdown).map(([key, data]) => ({
      name: key.replace('_', ' '),
      score: data.score,
      description: data.description,
      color: data.score > 70 ? '#DC2626' : data.score > 30 ? '#F59E0B' : '#10B981'
    }));

    return (
      <div className="space-y-8">
        {/* Main Risk Analysis Chart */}
        <div className="mt-8 chart-container">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Risk Factor Analysis</h3>
              <p className="text-sm text-gray-500">Comprehensive view of risk factors</p>
            </div>
            <div className="text-sm text-gray-500">
              Analysis Time: {formatTime()}
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                className="animate-fade-in"
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-20" vertical={false} />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fill: '#4B5563', fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#4B5563' }}
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  label={{
                    value: 'Risk Score (%)',
                    angle: -90,
                    position: 'insideLeft',
                    style: { fill: '#4B5563', fontSize: 12 }
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="score"
                  name="Risk Score"
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className="transition-all duration-300 hover:opacity-80"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Chart */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                <XAxis dataKey="name" tick={{ fill: '#4B5563', fontSize: 11 }} />
                <YAxis hide />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#3B82F6"
                  fill="url(#colorGradient)"
                  animationDuration={1500}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Level Indicators */}
        <div className="grid grid-cols-3 gap-4">
          {['Low Risk', 'Medium Risk', 'High Risk'].map((level, index) => (
            <div
              key={level}
              className="p-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{
                backgroundColor: index === 0 ? '#D1FAE5' :
                                index === 1 ? '#FEF3C7' : '#FEE2E2',
                color: index === 0 ? '#059669' :
                       index === 1 ? '#D97706' : '#DC2626'
              }}
            >
              <div className="text-sm font-medium mb-1">{level}</div>
              <div className="text-2xl font-bold">
                {chartData.filter(d => 
                  index === 0 ? d.score <= 30 :
                  index === 1 ? (d.score > 30 && d.score <= 70) :
                  d.score > 70
                ).length}
              </div>
              <div className="text-xs opacity-75">Risk Factors</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getScoreColor = (score) => {
    if (score > 70) return '#DC2626'; // red
    if (score > 30) return '#F59E0B'; // yellow
    return '#10B981'; // green
  };

  const renderResult = (response) => {
    if (!response || typeof response.fraud_score === 'undefined') {
      return (
        <div className="text-red-600">
          <p className="font-bold">Invalid Response:</p>
          <p>Server returned incomplete data</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Score Circle */}
        <div className="flex items-center justify-center space-x-8">
          <div className="w-40 h-40">
            <CircularProgressbar
              value={response.fraud_score}
              text={`${response.fraud_score.toFixed(1)}`}
              styles={buildStyles({
                textSize: '16px',
                pathColor: getScoreColor(response.fraud_score),
                textColor: getScoreColor(response.fraud_score),
                trailColor: '#F3F4F6'
              })}
            />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-bold mb-2">Risk Assessment</h3>
            <div className="space-y-1">
              <p className={`text-lg font-semibold ${
                response.risk_level === 'high' ? 'text-red-600' :
                response.risk_level === 'medium' ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {response.risk_level.toUpperCase()} RISK
              </p>
              <p className="text-gray-600">
                Recommended Action: <span className="font-semibold">{response.recommendation.toUpperCase()}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Risk Breakdown Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Factor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(response.risk_breakdown).map(([key, data]) => (
                <tr key={key} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 capitalize">
                      {key.replace('_', ' ')}
                    </div>
                    <div className="text-xs text-gray-500">{data.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`text-sm font-semibold ${
                        data.score > 70 ? 'text-red-600' :
                        data.score > 30 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {data.score.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      data.score > 70 ? 'bg-red-100 text-red-800' :
                      data.score > 30 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {data.score > 70 ? 'High' : data.score > 30 ? 'Medium' : 'Low'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detected Patterns */}
        {response.risk_patterns && response.risk_patterns.length > 0 && (
          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="text-yellow-800 font-medium mb-2">Detected Risk Patterns</h4>
            <div className="flex flex-wrap gap-2">
              {response.risk_patterns.map((pattern, index) => (
                <span key={index} className="px-3 py-1 rounded-full bg-yellow-200 text-yellow-800 text-sm">
                  {String(pattern).replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Add the chart after the risk breakdown */}
        {renderCharts(response.risk_breakdown)}
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult("Loading...");
    setResultType("loading");
    setResponseData(null);  // Reset response data
    try {
      const API_URL = "http://127.0.0.1:8000/predict/";
      
      // Validate features before sending
      const validFeatures = features.map(f => {
        const num = parseFloat(f);
        if (isNaN(num)) throw new Error("All features must be valid numbers");
        return num;
      });

      const response = await axios.post(API_URL, {
        features: validFeatures
      });

      console.log("API Response:", response.data);

      if (response.data && typeof response.data === 'object') {
        setResponseData(response.data);  // Store response data
        setResultType(response.data.fraud ? "fraudulent" : "legitimate");
        setResult(renderResult(response.data));
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      console.error("Detailed error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      setResultType("error");
      setResult(
        <div className="text-red-600">
          <p className="font-bold">Error Details:</p>
          <p>{error.response?.data?.detail || error.message || "Unknown error occurred"}</p>
        </div>
      );
    }
  };

  const getResultClassName = (type) => {
    switch (type) {
      case "fraudulent":
        return "bg-red-100 text-red-800";
      case "legitimate":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-50 text-red-600";
      case "loading":
        return "bg-gray-100 text-gray-800";
      default:
        return "";
    }
  };

  // Dark mode toggle effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Dark mode toggle function
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Update chart colors for dark mode
  const getChartColors = () => ({
    text: darkMode ? '#e5e5e5' : '#4B5563',
    grid: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    background: darkMode ? '#2d2d2d' : '#ffffff'
  });

  return (
    <div className="h-screen overflow-hidden bg-gray-50 dark:bg-dark-bg transition-colors duration-200">
      <div className="h-full grid grid-rows-auto-1fr">
        {/* Header with Dark Mode Toggle */}
        <div className="bg-white dark:bg-dark-card shadow-sm p-4 transition-colors duration-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">
                Fraud Detection System
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Enter transaction features to detect potential fraud
              </p>
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border
                       transition-colors duration-200"
            >
              {darkMode ? (
                <SunIcon className="h-6 w-6 text-yellow-500" />
              ) : (
                <MoonIcon className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-4 p-4 overflow-hidden">
          {/* Left Panel - Input Form */}
          <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg p-4 
                        overflow-y-auto transition-colors duration-200">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Purchase Type
                </label>
                <select 
                  onChange={handlePresetChange}
                  className="input-field bg-gray-50 dark:bg-dark-bg dark:text-dark-text
                         dark:border-dark-border"
                >
                  {Object.keys(predefinedFeatures).map(preset => (
                    <option key={preset} value={preset}>{preset}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {features.map((value, index) => (
                  <div key={index} className="feature-card dark:bg-dark-card 
                                          dark:border-dark-border">
                    <label className="block text-xs font-medium text-gray-700 
                                    dark:text-gray-300">
                      Feature {index + 1}
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={value}
                      onChange={(e) => handleChange(index, e.target.value)}
                      required
                      className="input-field text-sm dark:bg-dark-bg 
                               dark:text-dark-text dark:border-dark-border"
                      placeholder={`Value ${index + 1}`}
                    />
                  </div>
                ))}
              </div>

              <button 
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg
                         hover:bg-blue-700 focus:outline-none focus:ring-2 
                         focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Analyze Transaction
              </button>
            </form>
          </div>

          {/* Right Panel - Results */}
          <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg p-4 
                        overflow-y-auto transition-colors duration-200">
            {result ? (
              <div className={`rounded-lg ${getResultClassName(resultType)} p-4 animate-fade-in`}>
                {result}
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-8">
                Submit transaction data to see analysis results
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
