import React from 'react';
import { useState } from 'react';
import { Hero } from './components/Hero';
import { WalletConnect } from './components/WalletConnect';
import { TuitionPayment } from './components/TuitionPayment';

function App() {
  const [currentStep, setCurrentStep] = useState<'hero' | 'connect' | 'dashboard'>('hero');

  const handleGetStarted = () => {
    setCurrentStep('connect');
  };

  const handleWalletConnected = () => {
    setCurrentStep('dashboard');
  };

  if (currentStep === 'hero') {
    return <Hero onGetStarted={handleGetStarted} />;
  }

  if (currentStep === 'connect') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <WalletConnect onConnected={handleWalletConnected} />
      </div>
    );
  }

  return (
    <TuitionPayment />
  );
}

export default App;
