"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useKioskStore } from "@/store/kioskStore";
import { Volume2, QrCode, Smartphone } from "lucide-react";

export default function LoginScreen() {
  const router = useRouter();
  const { currentPatient } = useKioskStore();
  const [mobileNumber, setMobileNumber] = useState("");
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otp, setOtp] = useState("");
  const [isQrScanning, setIsQrScanning] = useState(false);

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = e.target.value.replace(/\D/g, "").slice(0, 10);
    setMobileNumber(numeric);
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(numeric);
  };

  const handleNext = () => {
    if (!isOtpMode) {
      if (mobileNumber.length === 10) {
        setIsOtpMode(true);
      }
    } else {
      if (otp.length === 6) {
        currentPatient.mobile = `+91 ${mobileNumber}`;
        router.push("/complaint");
      }
    }
  };

  const handleSimulateQrScan = () => {
    setIsQrScanning(true);
    setTimeout(() => {
      currentPatient.name = "Priya Sharma";
      currentPatient.age = 42;
      currentPatient.gender = "F";
      currentPatient.abhaId = "91-4412-8871-3319";
      setIsQrScanning(false);
      router.push("/complaint");
    }, 1200);
  };

  const playAudio = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const text = isOtpMode 
        ? "Apne phone par aaya hua chheh ank ka O-T-P darj karein."
        : "Apna das ank ka mobile number dalein, ya ABHA card scan karein.";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center pb-28">
      {/* Progress Bar */}
      <div className="w-full max-w-[1024px] px-8 pt-6">
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-teal to-teal-bright w-[25%] transition-all duration-500 ease-out" />
        </div>
        <div className="mt-2 text-text-muted text-sm font-medium">Step 1 of 4 · Identity (पहचान)</div>
      </div>

      {/* Header Navigation */}
      <header className="w-full max-w-[1024px] px-8 flex justify-between items-center mt-6">
        <button 
          onClick={() => isOtpMode ? setIsOtpMode(false) : router.push("/language")}
          className="text-primary font-semibold text-xl flex items-center gap-2 animate-press"
        >
          <span className="text-2xl">←</span> Peeche (Back)
        </button>
        <button 
          onClick={() => router.push("/complaint")}
          className="text-text-muted hover:text-text font-semibold text-base flex items-center gap-1.5 animate-press bg-surface-card px-4 py-2 rounded-xl border border-border"
        >
          Skip (Walk-in) ⏭
        </button>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-[800px] mt-8 flex flex-col items-center px-4">
        
        {/* Prompts */}
        <div className="text-center mb-8 flex flex-col items-center gap-2">
          <h1 className="text-primary text-3xl md:text-4xl font-semibold flex items-center justify-center gap-3">
            {isOtpMode ? "OTP Darj Karein" : "Pehchan (Identity)"}
            <button 
              onClick={playAudio}
              className="text-teal bg-teal-light rounded-full p-2 animate-press hover:bg-[#E8F8F0]"
              aria-label="Listen to audio instructions"
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </h1>
          <h2 className="text-text-muted text-xl md:text-2xl">
            {isOtpMode ? "Enter the 6-digit OTP sent to your phone" : "How would you like to check in?"}
          </h2>
        </div>

        {!isOtpMode ? (
          <div className="flex flex-col md:flex-row gap-6 w-full">
            {/* ABHA QR Option */}
            <div className="flex-1 bg-surface-card border-2 border-border hover:border-primary/50 transition-all rounded-2xl p-8 flex flex-col items-center text-center shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-success text-white px-3 py-1 rounded-bl-xl font-bold text-xs">
                RECOMMENDED
              </div>
              <div className="w-20 h-20 bg-primary-light rounded-2xl mb-5 flex items-center justify-center text-primary border border-primary/20">
                <QrCode className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-text mb-1">ABHA QR Scan</h3>
              <p className="text-text-muted text-sm mb-6">Hold your Ayushman Bharat health card under the scanner</p>
              
              <button 
                onClick={handleSimulateQrScan}
                disabled={isQrScanning}
                className="w-full bg-primary text-white font-bold text-lg py-4 rounded-xl animate-press hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-60"
              >
                {isQrScanning ? "Scanning Card..." : "Scan Card Now"}
              </button>
            </div>

            {/* Mobile Number Option */}
            <div className="flex-1 bg-surface-card border-2 border-primary rounded-2xl p-8 flex flex-col items-center text-center shadow-md">
              <div className="w-20 h-20 bg-teal-light rounded-2xl mb-5 flex items-center justify-center text-teal border border-teal/20">
                <Smartphone className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-text mb-1">Mobile Number</h3>
              <p className="text-text-muted text-sm mb-4">Enter your 10-digit phone number</p>
              
              <div className="w-full relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-bold text-lg">
                  +91
                </span>
                <input 
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="98765 43210"
                  className="w-full text-center pl-12 text-2xl font-bold p-4 border-2 border-border rounded-xl focus:outline-none focus:border-primary tracking-wider"
                  value={mobileNumber}
                  onChange={handleMobileChange}
                  maxLength={10}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md bg-surface-card border-2 border-primary rounded-2xl p-8 flex flex-col items-center text-center shadow-md">
             <input 
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="• • • • • •"
                className="w-full text-center tracking-[0.6em] text-3xl font-extrabold p-4 border-2 border-border rounded-xl mb-4 focus:outline-none focus:border-primary"
                value={otp}
                onChange={handleOtpChange}
                maxLength={6}
                autoFocus
              />
              <p className="text-text-muted text-sm mb-4">Sent to +91 {mobileNumber}</p>
              <button 
                onClick={() => setOtp("582194")}
                className="text-primary font-semibold text-sm underline hover:text-primary-dark"
              >
                Auto-fill Demo OTP (582194)
              </button>
          </div>
        )}
      </main>

      {/* Big Action Button */}
      <div className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-sm p-6 flex justify-center border-t border-border">
        <button 
          onClick={handleNext}
          disabled={!isOtpMode ? mobileNumber.length !== 10 : otp.length !== 6}
          className="max-w-[800px] w-full bg-primary text-white font-bold text-lg sm:text-2xl py-4 sm:py-5 rounded-xl shadow-lg hover:bg-primary-dark animate-press transition-colors disabled:opacity-50 disabled:cursor-not-allowed leading-tight"
        >
          {isOtpMode ? "Verify & Continue (सत्यापित करें) →" : "Send OTP (ओटीपी भेजें) →"}
        </button>
      </div>
    </div>
  );
}
