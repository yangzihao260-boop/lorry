import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bike, Truck, Zap } from 'lucide-react';
import { Vehicle, VehicleType } from '../types';

interface ConveyorProps {
  level: number;
  isRunning: boolean;
  onScore: () => void;
}

const VEHICLE_TYPES: VehicleType[] = ['bicycle', 'motorcycle', 'lorry'];

const VehicleIcon = ({ type }: { type: VehicleType }) => {
  switch (type) {
    case 'bicycle': return <Bike className="w-16 h-16 text-blue-500" />;
    case 'motorcycle': return <Zap className="w-16 h-16 text-yellow-500" />;
    case 'lorry': return <Truck className="w-16 h-16 text-red-600" />;
  }
};

export const Conveyor: React.FC<ConveyorProps> = (props) => {
  const { level, isRunning, onScore } = props;
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  // Difficulty formula: 1 -> low, 5 -> high
  const speed = (level * 1.5) + 0.5;
  const spawnInterval = Math.max(500, 1500 - (level * 200));

  useEffect(() => {
    setVehicles([]); // Clear when level changes
  }, [level]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const containerWidth = containerRef.current?.clientWidth || 2000;
      
      setVehicles(prev => {
        const lastVehicle = prev[prev.length - 1];
        if (!lastVehicle || (containerWidth - lastVehicle.x) > 400) {
           return [
             ...prev,
             {
               id: nextId.current++,
               type: VEHICLE_TYPES[Math.floor(Math.random() * VEHICLE_TYPES.length)],
               x: containerWidth,
             }
           ];
        }
        return prev;
      });
    }, spawnInterval);

    return () => clearInterval(interval);
  }, [isRunning, spawnInterval]);

  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!isRunning) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const moveVehicles = () => {
      setVehicles(prev => prev.map(v => ({ ...v, x: v.x - speed }))
        .filter(v => v.x > -200));
      animationFrameRef.current = requestAnimationFrame(moveVehicles);
    };

    animationFrameRef.current = requestAnimationFrame(moveVehicles);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isRunning, speed]);

  const handleVehicleClick = (vehicle: Vehicle) => {
    if (vehicle.type === 'lorry') {
      onScore();
      setVehicles(prev => prev.filter(v => v.id !== vehicle.id));
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-80 bg-stone-300 border-b-8 border-stone-500 overflow-hidden cursor-crosshair">
      {vehicles.map(v => (
        <div
          key={v.id}
          className="absolute bottom-12 cursor-pointer transition-transform hover:scale-110 z-20 p-8 flex flex-col items-center touch-none"
          style={{ left: v.x }}
          onPointerDown={(e) => {
            e.preventDefault();                
            handleVehicleClick(v);
          }}
        >
          <VehicleIcon type={v.type} />
          {v.type === 'lorry' && <span className="absolute -top-4 left-0 right-0 text-center text-red-800 font-bold bg-white/70 rounded-md">Lorry</span>}
        </div>
      ))}
    </div>
  );
};
