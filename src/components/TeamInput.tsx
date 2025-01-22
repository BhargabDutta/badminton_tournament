import React, { useState } from 'react';
import { Trophy } from 'lucide-react';
import { Team } from '../types';

interface TeamInputProps {
  onTeamsSubmit: (teams: Team[], isBestOfThree: boolean) => void;
}

export default function TeamInput({ onTeamsSubmit }: TeamInputProps) {
  const [teamNames, setTeamNames] = useState<string>('');
  const [matchType, setMatchType] = useState<'single' | 'bestOfThree'>('single');

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
    
    onTeamsSubmit(names, matchType === 'bestOfThree');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-center mb-6">
        <Trophy className="w-8 h-8 text-yellow-500 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">Enter Team Names</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Match Type
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="matchType"
                value="single"
                checked={matchType === 'single'}
                onChange={(e) => setMatchType(e.target.value as 'single')}
                className="mr-2"
              />
              Single Game
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
              Best of Three
            </label>
          </div>
        </div>
        <textarea
          className="w-full h-48 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter team names (one per line)"
          value={teamNames}
          onChange={(e) => setTeamNames(e.target.value)}
        />
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