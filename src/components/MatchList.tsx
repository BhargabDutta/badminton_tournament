import React from 'react';
import { Trophy, Shield } from 'lucide-react';
import { Match } from '../types';

interface MatchListProps {
  matches: Match[];
  onMatchClick: (match: Match) => void;
}

export default function MatchList({ matches, onMatchClick }: MatchListProps) {
  return (
    <div className="max-w-4xl mx-auto p-6 backdrop-blur-sm bg-black/30">
       <img src="/src/images/arena.png" alt="" height={100} width={100} style={{background:"white", borderRadius:"10px", margin:"auto", position:"relative", left:"0",right:"0"}}/>
      <div className="flex items-center justify-center space-x-2 mb-8">
      <a href="https://www.beakball.com/about" target='_blank'>
      <img src="https://www.beakball.com/assets/Logo-CjjAgmgS.webp" alt="" height={50} width={50}/>
</a>
        
        <h2 className="text-2xl font-bold text-white">Tournament Matches</h2>
        <Trophy className="w-10 h-10 text-yellow-500 mr-2" />
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