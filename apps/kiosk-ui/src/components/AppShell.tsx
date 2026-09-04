"use client";

import React from "react";
import TopBar from "./TopBar";
import PhysicianConsole from "./PhysicianConsole";
import { useKioskStore } from "@/store/kioskStore";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { activeView } = useKioskStore();

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <TopBar />
      <div className="flex-1 flex flex-col">
        {activeView === 'physician' ? <PhysicianConsole /> : children}
      </div>
    </div>
  );
}
