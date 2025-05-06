
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ControlsInfo: React.FC = () => {
  return (
    <div className="fixed left-8 bottom-8 z-50">
      <Card className="bg-gray-700/80 text-white backdrop-blur-sm shadow-xl border-gray-600">
        <CardHeader className="pb-2">
          <CardTitle>Gallery Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2">
            <p><span className="font-semibold">Movement:</span> W, A, S, D keys (slow movement)</p>
            <p><span className="font-semibold">Look around:</span> Arrow keys or mouse drag</p>
            <p><span className="font-semibold">Zoom:</span> Mouse wheel</p>
            <p><span className="font-semibold">View artwork:</span> Click on any artwork</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ControlsInfo;
