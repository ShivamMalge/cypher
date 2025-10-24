'use client';

import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Upload, FileText, Wind, Zap, AlertTriangle, Settings, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Wind Turbine SVG Component
const WindTurbine = () => (
  <motion.div
    className="relative w-32 h-32 mx-auto"
    animate={{ rotate: 360 }}
    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
  >
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Tower */}
      <rect x="48" y="30" width="4" height="50" fill="#4a5568" />
      {/* Nacelle */}
      <rect x="35" y="25" width="30" height="10" fill="#2d3748" rx="2" />
      {/* Hub */}
      <circle cx="50" cy="30" r="8" fill="#1a202c" />
      {/* Blades */}
      <g>
        <rect x="50" y="22" width="2" height="25" fill="#e2e8f0" transform="rotate(0 51 34.5)" />
        <rect x="50" y="22" width="2" height="25" fill="#e2e8f0" transform="rotate(120 51 34.5)" />
        <rect x="50" y="22" width="2" height="25" fill="#e2e8f0" transform="rotate(240 51 34.5)" />
      </g>
    </svg>
  </motion.div>
);

// Scenario Cards Component
const ScenarioCard = ({ title, description, icon: Icon, color, status }: {
  title: string;
  description: string;
  icon: any;
  color: string;
  status: 'normal' | 'warning' | 'critical';
}) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -5 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <Card className={`glass border-2 ${color} hover:glow transition-all duration-300`}>
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Icon className={`w-6 h-6 ${status === 'critical' ? 'text-red-400' : status === 'warning' ? 'text-yellow-400' : 'text-green-400'}`} />
          <CardTitle className="text-lg font-orbitron">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardContent>
    </Card>
  </motion.div>
);

// Parameter Input Component
const ParameterInput = ({ label, value, onChange, type = "number" }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) => (
  <div className="space-y-2">
    <Label htmlFor={label} className="text-sm font-medium text-gray-300">
      {label}
    </Label>
    <Input
      id={label}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="glass border-gray-600 focus:border-cyan-400 focus:ring-cyan-400/20 bg-transparent"
      placeholder={`Enter ${label}`}
    />
  </div>
);

export default function Home() {
  const [activeTab, setActiveTab] = useState<'upload' | 'manual'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [parameters, setParameters] = useState<Record<string, string>>({});
  const [results, setResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const inputSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const parameterFields = [
    'time_stamp', 'WindSpeed', 'StdDevWindSpeed', 'WindDirAbs', 'WindDirRel',
    'Power', 'MaxPower', 'MinPower', 'StdDevPower', 'AvgRPow', 'Pitch',
    'GenRPM', 'RotorRPM', 'EnvirTemp', 'NacelTemp', 'GearOilTemp',
    'GearBearTemp', 'GenTemp', 'GenPh1Temp', 'GenPh2Temp', 'GenPh3Temp', 'GenBearTemp'
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const handleParameterChange = (field: string, value: string) => {
    setParameters(prev => ({ ...prev, [field]: value }));
  };

  const analyzeData = async () => {
    setIsAnalyzing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock results
    setResults({
      scenario: 'Early gearbox bearing wear',
      confidence: 0.87,
      timestamp: new Date().toISOString(),
      recommendations: [
        'Schedule maintenance within 30 days',
        'Monitor gearbox temperature closely',
        'Check oil quality and viscosity'
      ]
    });
    setIsAnalyzing(false);
  };

  const scrollToInput = () => {
    inputSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen animated-bg">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <Wind className="w-8 h-8 text-cyan-400" />
              <span className="text-2xl font-orbitron font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                DriftOps
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:block"
            >
              <Button
                onClick={scrollToInput}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 glow"
              >
                Try Our Model
              </Button>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-20 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-48 h-48 bg-purple-500/10 rounded-full blur-xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.6, 0.3, 0.6],
            }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <WindTurbine />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-orbitron font-black mb-6"
          >
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
              DriftOps
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            AI-Powered Wind Turbine Health Detection
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto"
          >
            Detect operational scenarios with precision: Normal operation, Power regulation, 
            Early gearbox bearing wear, and Yaw bearing degradation using advanced AI models.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={scrollToInput}
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white text-lg px-8 py-4 glow hover:scale-105 transition-all duration-300"
            >
              Try Our Model
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black text-lg px-8 py-4 glow-cyan hover:scale-105 transition-all duration-300"
            >
              Learn More
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-16"
          >
            <ChevronDown className="w-8 h-8 text-cyan-400 mx-auto animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* Input Section */}
      <section ref={inputSectionRef} className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Analyze Your Data
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Upload your wind turbine sensor data or enter parameters manually to get AI-powered insights.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass rounded-2xl p-8 mb-8"
          >
            {/* Tab Navigation */}
            <div className="flex space-x-4 mb-8">
              <Button
                onClick={() => setActiveTab('upload')}
                className={`flex-1 ${activeTab === 'upload' 
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' 
                  : 'bg-transparent border border-gray-600 text-gray-300 hover:border-cyan-400'
                }`}
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload CSV
              </Button>
              <Button
                onClick={() => setActiveTab('manual')}
                className={`flex-1 ${activeTab === 'manual' 
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' 
                  : 'bg-transparent border border-gray-600 text-gray-300 hover:border-cyan-400'
                }`}
              >
                <FileText className="w-5 h-5 mr-2" />
                Manual Input
              </Button>
            </div>

            {/* Upload Tab */}
            {activeTab === 'upload' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-cyan-400 transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Upload Your CSV File</h3>
                  <p className="text-gray-400 mb-4">
                    Drag and drop your wind turbine sensor data CSV file here, or click to browse.
                  </p>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-block bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-lg cursor-pointer hover:from-cyan-600 hover:to-purple-600 transition-all duration-300 glow"
                  >
                    Choose File
                  </label>
                  {file && (
                    <p className="mt-4 text-cyan-400">
                      Selected: {file.name}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Manual Input Tab */}
            {activeTab === 'manual' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {parameterFields.map((field) => (
                    <ParameterInput
                      key={field}
                      label={field}
                      value={parameters[field] || ''}
                      onChange={(value) => handleParameterChange(field, value)}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Analyze Button */}
            <div className="text-center mt-8">
              <Button
                onClick={analyzeData}
                disabled={isAnalyzing || (!file && Object.keys(parameters).length === 0)}
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white text-lg px-12 py-4 glow hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Data'
                )}
              </Button>
            </div>
          </motion.div>

          {/* Results Section */}
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="glass rounded-2xl p-8"
            >
              <h3 className="text-2xl font-orbitron font-bold mb-6 text-center">
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Analysis Results
                </span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <ScenarioCard
                  title="Normal Operation"
                  description="All systems functioning within normal parameters"
                  icon={Wind}
                  color="border-green-500"
                  status="normal"
                />
                <ScenarioCard
                  title="Power Regulation"
                  description="Active power management and grid synchronization"
                  icon={Zap}
                  color="border-blue-500"
                  status="normal"
                />
                <ScenarioCard
                  title="Early Gearbox Wear"
                  description="Detected early signs of bearing degradation"
                  icon={AlertTriangle}
                  color="border-yellow-500"
                  status="warning"
                />
                <ScenarioCard
                  title="Yaw Bearing Issues"
                  description="Yaw system showing signs of wear"
                  icon={Settings}
                  color="border-red-500"
                  status="critical"
                />
              </div>

              <Card className="glass border-2 border-cyan-400 glow-cyan">
                <CardHeader>
                  <CardTitle className="text-xl font-orbitron text-cyan-400">
                    Detected Scenario: {results.scenario}
                  </CardTitle>
                  <CardDescription>
                    Confidence: {(results.confidence * 100).toFixed(1)}%
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Recommendations:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {results.recommendations.map((rec: string, index: number) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-sm text-gray-400">
                      Analysis completed at: {new Date(results.timestamp).toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center space-x-2 mb-4"
          >
            <Wind className="w-6 h-6 text-cyan-400" />
            <span className="text-xl font-orbitron font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              DriftOps
            </span>
          </motion.div>
          <p className="text-gray-400">
            AI-Powered Wind Turbine Health Detection • Hackathon 2024
          </p>
        </div>
      </footer>
    </div>
  );
}