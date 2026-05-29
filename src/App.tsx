import React, { useState, useRef } from 'react';
import { Conveyor } from './components/Conveyor';
import { Play, Pause, RotateCcw } from 'lucide-react';

export default function App() {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const handleScore = () => {
    setScore(s => s + 10);
    const successSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2045/2045-preview.mp3');
    successSound.play().catch(e => console.log(e));
  };

  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    if (!bgMusicRef.current) {
      bgMusicRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2653/2653-preview.mp3');
      bgMusicRef.current.loop = true;
      bgMusicRef.current.volume = 0.5;
    }
    
    if (isRunning) {
        bgMusicRef.current.play().catch(e => console.log(e));
    } else {
        bgMusicRef.current.pause();
    }
  }, [isRunning]);

  return (
    <div className="min-h-screen bg-sky-100 flex flex-col items-center">
      <header className="w-full p-6 bg-white shadow-md flex justify-between items-center text-red-600 gap-4">
        <h1 className="text-4xl font-extrabold text-red-600">Lorry Explorer!</h1>
        <div className="flex gap-2 items-center">
          <span className="font-bold text-gray-700 mr-2">Level:</span>
          {[1,2,3,4,5].map(l => (
            <button key={l} onClick={() => { setLevel(l); setIsRunning(false); }} className={`px-4 py-2 rounded-full font-bold ${level === l ? 'bg-red-500 text-white' : 'bg-gray-200'}`}>
              {l}
            </button>
          ))}
        </div>
        <div className="flex gap-4">
          <button onClick={() => setIsRunning(true)} className="p-3 bg-blue-500 text-white rounded-full">
            <Play />
          </button>
          <button onClick={() => setIsRunning(false)} className="p-3 bg-yellow-500 text-white rounded-full">
            <Pause />
          </button>
          <button onClick={() => { setScore(0); setLevel(1); setIsRunning(false); }} className="p-3 bg-gray-500 text-white rounded-full">
            <RotateCcw />
          </button>
        </div>
      </header>

      <main className="w-full max-w-7xl mt-12 px-4">
        <div className="flex justify-between text-2xl font-bold p-4 bg-white rounded-lg mb-4">
          <span>Score: {score}</span>
          <span>Level: {level}</span>
        </div>
        <Conveyor key={level} level={level} isRunning={isRunning} onScore={handleScore} />
        <p className="mt-8 text-center text-3xl font-semibold text-gray-700">Find the <span className="text-red-600 font-bold">Lorry</span> (🚚)!</p>
      </main>
    </div>
  );
}
