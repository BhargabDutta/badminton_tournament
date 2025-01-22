import React from 'react';
import { Trophy, Shield } from 'lucide-react';
import { Match } from '../types';

interface MatchListProps {
  matches: Match[];
  onMatchClick: (match: Match) => void;
}

export default function MatchList({ matches, onMatchClick }: MatchListProps) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-center mb-8">
        <Trophy className="w-8 h-8 text-yellow-500 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">Tournament Matches</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {matches.map((match) => (
          <div
            key={match.id}
            onClick={() => onMatchClick(match)}
            className={`p-4 rounded-lg shadow-md cursor-pointer transition-all ${
              match.isComplete
                ? 'bg-green-50 hover:bg-green-100'
                : 'bg-white hover:bg-gray-50'
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-blue-500 mr-2" />
                <span className="font-semibold">
                  Match #{match.id.slice(0, 4)}
                  {match.isBestOfThree && ' (Best of 3)'}
                </span>
              </div>
              {match.isComplete && (
                <span className="text-sm text-green-600 font-medium">
                  Complete
                </span>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className={match.winner?.id === match.team1.id ? 'font-bold text-green-600' : ''}>
                  {match.team1.name}
                </span>
                <span className="font-mono">{match.isBestOfThree ? match.score1 : match.score1}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={match.winner?.id === match.team2.id ? 'font-bold text-green-600' : ''}>
                  {match.team2.name}
                </span>
                <span className="font-mono">{match.isBestOfThree ? match.score2 : match.score2}</span>
              </div>
            </div>
            {match.isBestOfThree && !match.isComplete && match.currentGame !== undefined && (
              <div className="mt-2 text-sm text-gray-600">
                Playing Game {match.currentGame + 1}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}