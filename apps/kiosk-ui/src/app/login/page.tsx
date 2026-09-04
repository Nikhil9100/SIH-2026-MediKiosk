"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { MicIcon } from "@/components/icons";

export default function LoginScreen() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otp, setOtp] = useState("");

  const handleNext = () => {
    if (!isOtpMode) {
      setIsOtpMode(true);
    } else {
      window.location.href = '/complaint';
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center pb-24">
      {/* Progress Bar */}
      <div className="w-full max-w-[1024px] px-8 pt-6">
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-teal to-teal-bright w-[15%] transition-all duration-500 ease-out" />
        </div>
        <div className="mt-2 text-text-muted text-sm font-medium">15%</div>
      </div>

      {/* Header Navigation */}
      <header className="w-full max-w-[1024px] px-8 flex justify-between items-center mt-6">
        <button 
          onClick={() => isOtpMode ? setIsOtpMode(false) : window.location.href = '/language'}
          className="text-primary font-semibold text-xl flex items-center gap-2 animate-press"
        >
          <span className="text-2xl">←</span> Peeche (Back)
        </button>
        <button 
          onClick={() => window.location.href = '/complaint'}
          className="text-text-muted font-semibold text-xl flex items-center gap-2 animate-press"
        >
          Skip ⏭
        </button>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-[800px] mt-8 flex flex-col items-center px-4">
        
        {/* Prompts */}
        <div className="text-center mb-10 flex flex-col items-center gap-2">
          <h1 className="text-primary text-3xl md:text-4xl font-semibold flex items-center justify-center gap-3">
            {isOtpMode ? "OTP Darj Karein" : "Pehchan (Identity)"}
            <button className="text-teal bg-teal-light rounded-full p-2 animate-press">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
            </button>
          </h1>
          <h2 className="text-text-muted text-xl md:text-2xl">
            {isOtpMode ? "Enter the OTP sent to your phone" : "How would you like to link your records?"}
          </h2>
        </div>

        {!isOtpMode ? (
          <div className="flex flex-col md:flex-row gap-6 w-full">
            {/* ABHA QR Option */}
            <div className="flex-1 bg-surface-card border-2 border-border rounded-xl p-8 flex flex-col items-center text-center shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-success text-white px-3 py-1 rounded-bl-lg font-medium text-sm">
                Recommended
              </div>
              <div className="w-24 h-24 bg-primary-light rounded-2xl mb-6 flex items-center justify-center border border-primary/20">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1A5276" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <rect x="7" y="7" width="3" height="3"/>
                  <rect x="14" y="7" width="3" height="3"/>
                  <rect x="7" y="14" width="3" height="3"/>
                  <rect x="14" y="14" width="3" height="3"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-text mb-2">ABHA QR Scan</h3>
              <p className="text-text-muted text-lg mb-8">Scan your health card</p>
              <button className="w-full bg-primary text-white font-semibold text-xl py-4 rounded-lg animate-press">
                Scan Now
              </button>
            </div>

            {/* Mobile Number Option */}
            <div className="flex-1 bg-surface-card border-2 border-primary rounded-xl p-8 flex flex-col items-center text-center shadow-md">
              <div className="w-24 h-24 bg-teal-light rounded-full mb-6 flex items-center justify-center border border-teal/20">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#148F77" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                  <line x1="12" y1="18" x2="12.01" y2="18"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-text mb-2">Mobile Number</h3>
              <p className="text-text-muted text-lg mb-6">Enter phone number</p>
              
              <input 
                type="tel" 
                placeholder="10-digit number"
                className="w-full text-center text-2xl p-4 border-2 border-border rounded-lg mb-4 focus:outline-none focus:border-primary"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                maxLength={10}
              />
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md bg-surface-card border-2 border-primary rounded-xl p-8 flex flex-col items-center text-center shadow-md">
             <input 
                type="number" 
                placeholder="Enter 6-digit OTP"
                className="w-full text-center tracking-[0.5em] text-3xl p-4 border-2 border-border rounded-lg mb-4 focus:outline-none focus:border-primary"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
              />
              <p className="text-text-muted text-lg mb-4">Sent to +91 {mobileNumber}</p>
              <button className="text-primary font-medium text-lg underline">Resend OTP</button>
          </div>
        )}
      </main>

      {/* Big Action Button */}
      <div className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-sm p-6 flex justify-center border-t border-border">
        <button 
          onClick={handleNext}
          disabled={!isOtpMode ? mobileNumber.length !== 10 : otp.length !== 6}
          className="max-w-[800px] w-full bg-primary text-white font-bold text-2xl py-5 rounded-lg shadow-lg hover:bg-primary-dark animate-press transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isOtpMode ? "Verify & Continue →" : "Send OTP →"}
        </button>
      </div>
    </div>
  );
}
