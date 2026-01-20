import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Upload, Camera, Loader2, CheckCircle, AlertTriangle, Image as ImageIcon, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useWeather } from '@/contexts/WeatherContext';
import { WeatherCondition, AIDetectionResult } from '@/lib/types';
import { getWeatherSuggestion } from '@/lib/weather-api';
import { WeatherIcon } from '@/components/weather/WeatherIcon';

const AIDetector: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AIDetectionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const { setWeatherFromAI } = useWeather();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setShowCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera access denied:', err);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        setSelectedImage(canvas.toDataURL('image/jpeg'));
        setResult(null);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis (in production, this would call Teachable Machine)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate random result for demo
    const conditions: WeatherCondition[] = ['sunny', 'cloudy', 'rainy', 'stormy', 'foggy'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const randomConfidence = Math.floor(Math.random() * 40) + 60; // 60-100%
    
    const analysisResult: AIDetectionResult = {
      label: randomCondition,
      confidence: randomConfidence,
      suggestion: getWeatherSuggestion(randomCondition),
    };
    
    setResult(analysisResult);
    setWeatherFromAI(randomCondition);
    setIsAnalyzing(false);
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Brain className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            AI Weather Detector
          </h1>
          <p className="text-muted-foreground">
            Analyze images to detect weather conditions
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="image" className="w-full">
        <TabsList className="grid w-full grid-cols-2 glass-card p-1">
          <TabsTrigger value="image" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <ImageIcon className="w-4 h-4" />
            Image Mode
          </TabsTrigger>
          <TabsTrigger value="audio" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Mic className="w-4 h-4" />
            Audio Mode
          </TabsTrigger>
        </TabsList>

        <TabsContent value="image" className="mt-6 space-y-6">
          {/* Upload Area */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            {!selectedImage && !showCamera ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                  Upload an Image
                </h3>
                <p className="text-muted-foreground mb-6">
                  Take a photo or upload an image to detect weather
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Image
                  </Button>
                  <Button
                    variant="outline"
                    onClick={startCamera}
                    className="gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Use Camera
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : showCamera ? (
              <div className="space-y-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-xl"
                />
                <div className="flex gap-3 justify-center">
                  <Button onClick={capturePhoto} className="gap-2">
                    <Camera className="w-4 h-4" />
                    Capture
                  </Button>
                  <Button variant="outline" onClick={stopCamera}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden">
                  <img
                    src={selectedImage!}
                    alt="Selected"
                    className="w-full max-h-80 object-cover rounded-xl"
                  />
                </div>
                <div className="flex gap-3 justify-center">
                  {!result && (
                    <Button
                      onClick={analyzeImage}
                      disabled={isAnalyzing}
                      className="gap-2"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4" />
                          Analyze Image
                        </>
                      )}
                    </Button>
                  )}
                  <Button variant="outline" onClick={resetAnalysis}>
                    Try Another
                  </Button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Results */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-card p-6 space-y-6"
              >
                {/* Confidence Warning */}
                {result.confidence < 60 && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    <p className="text-sm text-foreground">
                      Prediction uncertain. Please try another image.
                    </p>
                  </div>
                )}

                {/* Result Display */}
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <WeatherIcon condition={result.label} size="xl" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-foreground capitalize">
                    {result.label}
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    Detected Weather Condition
                  </p>
                </div>

                {/* Confidence Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Confidence</span>
                    <span className="font-medium text-foreground">{result.confidence}%</span>
                  </div>
                  <Progress 
                    value={result.confidence} 
                    className="h-2"
                  />
                </div>

                {/* Suggestion */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <p className="text-foreground">{result.suggestion}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="audio" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-12 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Mic className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-display font-semibold text-foreground mb-2">
              Audio Mode
            </h3>
            <p className="text-muted-foreground">
              Audio weather detection coming soon!
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              This feature will analyze environmental sounds to detect weather conditions.
            </p>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIDetector;
