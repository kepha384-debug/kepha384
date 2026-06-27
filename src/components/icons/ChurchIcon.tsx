
import React from 'react';

export const ChurchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {/* Cross on top of the roof - Lengthened and elevated */}
    <line x1="12" y1="0" x2="12" y2="6" />
    <line x1="9" y1="2.5" x2="15" y2="2.5" />
    
    {/* House structure - Shifted down slightly to make room for the cross */}
    <path d="M3 13l9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 16 15 16 15 22" />
  </svg>
);
