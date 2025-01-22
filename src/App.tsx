import React, { useState } from 'react';
import { Team, Match } from './types';
import TeamInput from './components/TeamInput';
import MatchList from './components/MatchList';
import Scoreboard from './components/Scoreboard';

export default function App() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const generateMatches = (teams: Team[], matchType: 'random' | 'sequential' | 'bestOfThree') => {
    // For best of three or sequential, keep teams in original order
    // For random single games, shuffle teams
    const orderedTeams = matchType === 'random'
      ? [...teams].sort(() => Math.random() - 0.5)
      : teams;
    
    const newMatches: Match[] = [];
    for (let i = 0; i < orderedTeams.length - 1; i += 2) {
      newMatches.push({
        id: crypto.randomUUID(),
        team1: orderedTeams[i],
        team2: orderedTeams[i + 1],
        score1: 0,
        score2: 0,
        isComplete: false,
        isBestOfThree: matchType === 'bestOfThree',
        games: matchType === 'bestOfThree' ? [
          { score1: 0, score2: 0, isComplete: false },
          { score1: 0, score2: 0, isComplete: false },
          { score1: 0, score2: 0, isComplete: false }
        ] : undefined,
        currentGame: matchType === 'bestOfThree' ? 0 : undefined
      });
    }
    
    setMatches(newMatches);
  };

  const handleMatchUpdate = (updatedMatch: Match) => {
    setMatches(matches.map(match => 
      match.id === updatedMatch.id ? updatedMatch : match
    ));
    setSelectedMatch(updatedMatch);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      {!matches.length && (
        <TeamInput onTeamsSubmit={generateMatches} />
      )}
      
      {matches.length > 0 && !selectedMatch && (
        <MatchList 
          matches={matches} 
          onMatchClick={setSelectedMatch}
        />
      )}
      
      {selectedMatch && (
        <Scoreboard
          match={selectedMatch}
          onScoreUpdate={handleMatchUpdate}
          onBack={() => setSelectedMatch(null)}
        />
      )}
    </div>
  );
}