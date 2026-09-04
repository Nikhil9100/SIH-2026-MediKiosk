import React from "react";
import { cn } from "@/lib/utils";

export type IconProps = React.SVGProps<SVGSVGElement>;

// Custom Medical Icons designed for MediKiosk
// Colors used: primary (#1A5276), teal (#148F77), amber (#E67E22), coral (#E74C3C)

export function HeadacheIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)} {...props}>
      {/* Face profile in primary blue */}
      <path d="M12 3C8.5 3 6.5 5.5 6 9C5.5 12.5 6 15 6 15L7 16L7.5 19H11.5L12 17C14 17 15 15.5 15.5 14C16 12.5 16 10 15 7C14.5 5 13.5 3 12 3Z" fill="#EBF5FB" stroke="#1A5276" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Pain circles at temple in coral */}
      <circle cx="10" cy="8" r="1.5" fill="#E74C3C" opacity="0.8" />
      <circle cx="10" cy="8" r="3" stroke="#E74C3C" strokeWidth="1" opacity="0.6" strokeDasharray="1 1" />
      <circle cx="10" cy="8" r="4.5" stroke="#E74C3C" strokeWidth="1" opacity="0.4" strokeDasharray="1 1" />
    </svg>
  );
}

export function ChestPainIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)} {...props}>
      <path d="M5 21V14C5 10.5 7.5 7 12 7C16.5 7 19 10.5 19 14V21" fill="#EBF5FB" stroke="#1A5276" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 7V3" stroke="#1A5276" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Heart area pain */}
      <path d="M13 14C13 12.5 11 11 9 11C7 11 7 13.5 9 15C10 15.5 12 17 12 17C12 17 13.5 15.5 14 15C14.5 14.5 15 13.5 15 12.5C15 11.5 14 10.5 13 10.5" fill="#E74C3C" opacity="0.8" />
      {/* Hand over heart */}
      <path d="M7 16L10 13M10 13L11 12M10 13L12 14M12 14L13 13.5M12 14L10 17" stroke="#1A5276" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function FeverIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)} {...props}>
      <circle cx="12" cy="11" r="7" fill="#EBF5FB" stroke="#1A5276" strokeWidth="1.5" />
      {/* Thermometer */}
      <path d="M16 11L20 7C20.5523 6.44772 20.5523 5.55228 20 5C19.4477 4.44772 18.5523 4.44772 18 5L14 9" stroke="#1A5276" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="14" cy="9" r="1.5" fill="#E74C3C" />
      <path d="M19 6L16 9" stroke="#E74C3C" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Heat waves */}
      <path d="M8 3C9 2 10 2 10 3" stroke="#E67E22" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 1C13 0 14 0 14 1" stroke="#E67E22" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function StomachPainIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)} {...props}>
      <path d="M6 10C6 7 8 5 12 5C16 5 18 7 18 10V18C18 19.5 16.5 21 15 21H9C7.5 21 6 19.5 6 18V10Z" fill="#EBF5FB" stroke="#1A5276" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 13.5C9 12 11 11 13 12C15 13 16 14.5 14 16C12 17.5 10 16 9 15" fill="#E67E22" opacity="0.6"/>
      {/* Hands holding stomach */}
      <path d="M4 14L8 15L10 17" stroke="#1A5276" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 14L16 15L14 17" stroke="#1A5276" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function MicIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)} {...props}>
      <rect x="9" y="3" width="6" height="11" rx="3" fill="#148F77" stroke="#1A5276" strokeWidth="1.5" />
      <path d="M5 11V12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12V11" stroke="#1A5276" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 19V22" stroke="#1A5276" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9 22H15" stroke="#1A5276" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
