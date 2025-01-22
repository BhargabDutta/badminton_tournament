import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trophy } from 'lucide-react';
import { Match, Team } from '../types';

interface ScoreboardProps {
  match: Match;
  onScoreUpdate: (updatedMatch: Match) => void;
  onBack: () => void;
}

export default function Scoreboard({ match, onScoreUpdate, onBack }: ScoreboardProps) {
  const [score1, setScore1] = useState(match.score1);
  const [score2, setScore2] = useState(match.score2);

  const isDeuce = score1 >= 20 && score2 >= 20;
  const hasWinner = isDeuce 
    ? Math.abs(score1 - score2) >= 2 // In deuce, need 2 point lead
    : score1 >= 21 || score2 >= 21;  // Normal game point

  const updateScore = (team: 1 | 2) => {
    const newScore1 = team === 1 ? score1 + 1 : score1;
    const newScore2 = team === 2 ? score2 + 1 : score2;

    // Check if this point creates a winner
    const newIsDeuce = newScore1 >= 20 && newScore2 >= 20;
    const newHasWinner = newIsDeuce 
      ? Math.abs(newScore1 - newScore2) >= 2
      : newScore1 >= 21 || newScore2 >= 21;

    if (newHasWinner) {
      const winner: Team = newScore1 > newScore2 ? match.team1 : match.team2;
      const loser: Team = newScore1 > newScore2 ? match.team2 : match.team1;
      
      onScoreUpdate({
        ...match,
        score1: newScore1,
        score2: newScore2,
        winner,
        loser,
        isComplete: true
      });
      return;
    }

    setScore1(newScore1);
    setScore2(newScore2);
    onScoreUpdate({
      ...match,
      score1: newScore1,
      score2: newScore2
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-8"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Matches
      </button>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-center mb-8">
          <Trophy className="w-8 h-8 text-yellow-500 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Scoreboard</h2>
        </div>

        {isDeuce && (
          <div className="text-center mb-6 bg-yellow-50 p-3 rounded-lg text-yellow-800">
            Deuce! Win by 2 points needed
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { team: match.team1, score: score1, updateFn: () => updateScore(1) },
            { team: match.team2, score: score2, updateFn: () => updateScore(2) },
          ].map(({ team, score, updateFn }) => (
            <div key={team.id} className="text-center">
              <h3 className="text-xl font-semibold mb-4">{team.name}</h3>
              <div className="text-4xl font-bold mb-4">{score}</div>
              <button
                onClick={updateFn}
                disabled={match.isComplete}
                className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +1 Point
              </button>
            </div>
          ))}
        </div>

        {match.isComplete && (
          <div className="mt-8 text-center">
            <div className="text-2xl font-bold text-green-600">
              {match.winner?.name} Wins!
            </div>
            <div className="text-gray-600">
              Final Score: {score1} - {score2}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}