
import { Suspense } from 'react';
import Gallery from '../components/Gallery';

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen bg-slate-100">
    <div className="text-center">
      <h2 className="text-xl font-semibold mb-2">Loading Virtual Art Gallery...</h2>
      <p className="text-gray-600">Please wait while the 3D environment loads</p>
    </div>
  </div>
);

const Index = () => {
  return (
    <div className="w-full h-screen overflow-hidden">
      <Suspense fallback={<LoadingFallback />}>
        <Gallery />
      </Suspense>
    </div>
  );
};

export default Index;
