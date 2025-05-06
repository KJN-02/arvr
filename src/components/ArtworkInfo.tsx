
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ArtworkInfoProps {
  title: string;
  artist: string;
  year: number;
  medium: string;
  description: string;
  onClose: () => void;
}

const ArtworkInfo: React.FC<ArtworkInfoProps> = ({ 
  title, 
  artist, 
  year, 
  medium, 
  description, 
  onClose 
}) => {
  return (
    <div className="fixed bottom-8 right-8 w-96 z-50 animate-fade-in">
      <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="text-sm font-medium text-muted-foreground">{artist}, {year}</p>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              ×
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-2">{medium}</p>
          <p className="text-sm">{description}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArtworkInfo;
