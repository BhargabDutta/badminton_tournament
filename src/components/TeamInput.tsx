import React, { useState } from 'react';
import { Trophy } from 'lucide-react';
import { Team } from '../types';

interface TeamInputProps {
  onTeamsSubmit: (teams: Team[], matchType: 'random' | 'sequential' | 'bestOfThree') => void;
}

export default function TeamInput({ onTeamsSubmit }: TeamInputProps) {
  const [teamNames, setTeamNames] = useState<string>('');
  const [matchType, setMatchType] = useState<'random' | 'sequential' | 'bestOfThree'>('random');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const names = teamNames
      .split('\n')
      .filter(name => name.trim())
      .map(name => ({
        id: crypto.randomUUID(),
        name: name.trim()
      }));

    if (names.length < 2) {
      alert('Please enter at least 2 teams');
      return;
    }
    
    onTeamsSubmit(names, matchType);
  };

  return (
    <div className="max-w-md mx-auto p-6 backdrop-blur-sm bg-black/30 rounded-lg shadow-lg">
      <img src="/src/images/arena.png" alt="" height={100} width={100} style={{background:"white", borderRadius:"10px", margin:"auto", position:"relative", left:"0",right:"0"}}/>
      <div className="flex items-center justify-center space-x-2 mb-6">
        <a href="https://www.beakball.com/about" target='_blank'>
      <img src="https://www.beakball.com/assets/Logo-CjjAgmgS.webp" alt="" height={50} width={50}/></a>

        <h2 className="text-2xl font-bold text-white">Enter Team Names</h2>
        <Trophy className="w-10 h-10 text-yellow-500 mr-2" />

      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-white mb-2">
            Match Type
          </label>
          <div className="space-y-2 text-yellow-500">
            <label className="flex items-center">
              <input
                type="radio"
                name="matchType"
                value="random"
                checked={matchType === 'random'}
                onChange={(e) => setMatchType(e.target.value as 'random')}
                className="mr-2"
              />
              Single Game (Random Order)
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="matchType"
                value="sequential"
                checked={matchType === 'sequential'}
                onChange={(e) => setMatchType(e.target.value as 'sequential')}
                className="mr-2"
              />
              Single Game (Sequential Order)
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="matchType"
                value="bestOfThree"
                checked={matchType === 'bestOfThree'}
                onChange={(e) => setMatchType(e.target.value as 'bestOfThree')}
                className="mr-2"
              />
              Best of Three (Sequential Order)
            </label>
          </div>
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-white mb-2">
            Team Names
          </label>
          <textarea
            className="w-full h-48 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter team names (one per line)"
            value={teamNames}
            onChange={(e) => setTeamNames(e.target.value)}
          />
        </div>
        <p className="text-sm text-yellow-500 mb-4">
          Teams will be paired in the order they are entered for sequential matches.
        </p>
        <button
          type="submit"
          className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Generate Matches
        </button>
      </form>
    </div>
  );
}