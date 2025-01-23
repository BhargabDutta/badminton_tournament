import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trophy } from 'lucide-react';
import { Match, Team, Game } from '../types';

interface ScoreboardProps {
  match: Match;
  onScoreUpdate: (updatedMatch: Match) => void;
  onBack: () => void;
}

export default function Scoreboard({ match, onScoreUpdate, onBack }: ScoreboardProps) {
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);

  // Update local scores when current game changes
  useEffect(() => {
    if (match.isBestOfThree && match.games && match.currentGame !== undefined) {
      const currentGameScores = match.games[match.currentGame];
      setScore1(currentGameScores.score1);
      setScore2(currentGameScores.score2);
    } else {
      setScore1(match.score1);
      setScore2(match.score2);
    }
  }, [match.currentGame, match.games, match.isBestOfThree, match.score1, match.score2]);

  const isDeuce = score1 >= 20 && score2 >= 20;
  const hasWinner = isDeuce
    ? Math.abs(score1 - score2) >= 2
    : score1 >= 21 || score2 >= 21;

  const updateScore = (team: 1 | 2) => {
    if (match.isComplete) return;

    const newScore1 = team === 1 ? score1 + 1 : score1;
    const newScore2 = team === 2 ? score2 + 1 : score2;

    const newIsDeuce = newScore1 >= 20 && newScore2 >= 20;
    const newHasWinner = newIsDeuce
      ? Math.abs(newScore1 - newScore2) >= 2
      : newScore1 >= 21 || newScore2 >= 21;

    if (match.isBestOfThree && match.games && match.currentGame !== undefined) {
      // Update the current game
      const updatedGames = [...match.games];
      updatedGames[match.currentGame] = {
        score1: newScore1,
        score2: newScore2,
        isComplete: newHasWinner,
        winner: newHasWinner ? (newScore1 > newScore2 ? match.team1 : match.team2) : undefined,
        loser: newHasWinner ? (newScore1 > newScore2 ? match.team2 : match.team1) : undefined
      };

      // Calculate match winner if this game creates one
      const gamesWonByTeam1 = updatedGames.filter(g => g.winner?.id === match.team1.id).length;
      const gamesWonByTeam2 = updatedGames.filter(g => g.winner?.id === match.team2.id).length;
      const matchWinner = gamesWonByTeam1 >= 2 ? match.team1 : gamesWonByTeam2 >= 2 ? match.team2 : undefined;
      const matchLoser = matchWinner ? (matchWinner.id === match.team1.id ? match.team2 : match.team1) : undefined;

      // Move to next game if needed
      let nextGame = match.currentGame;
      if (newHasWinner && !matchWinner) {
        nextGame = match.currentGame + 1;
      }

      onScoreUpdate({
        ...match,
        games: updatedGames,
        currentGame: nextGame,
        winner: matchWinner,
        loser: matchLoser,
        isComplete: !!matchWinner,
        score1: gamesWonByTeam1,
        score2: gamesWonByTeam2
      });
    } else {
      // Single game match
      setScore1(newScore1);
      setScore2(newScore2);

      if (newHasWinner) {
        const winner = newScore1 > newScore2 ? match.team1 : match.team2;
        const loser = newScore1 > newScore2 ? match.team2 : match.team1;

        onScoreUpdate({
          ...match,
          score1: newScore1,
          score2: newScore2,
          winner,
          loser,
          isComplete: true
        });
      } else {
        onScoreUpdate({
          ...match,
          score1: newScore1,
          score2: newScore2
        });
      }
    }
  };

  const currentGame = match.isBestOfThree && match.games && match.currentGame !== undefined
    ? match.games[match.currentGame]
    : null;

  return (
    <div className="max-w-2xl mx-auto p-10">
      <button
        onClick={onBack}
        className="flex items-center text-white hover:text-gray-50 mb-12"
      >
        <ArrowLeft className="w-7 h-7 mr-4" />
        Back to Matches
      </button>
      <img src="/src/images/arena.png" alt="" height={100} width={100} style={{background:"white", borderRadius:"10px", margin:"auto", position:"relative", left:"0",right:"0", bottom:"10px"}}/>

      <div className="backdrop-blur-sm bg-white rounded-lg shadow-lg p-12 w-full h-auto">
        <div className="flex items-center justify-center space-x-4 mb-12">
          <a href="https://www.beakball.com/about" target='_blank'>
            <img src="https://www.beakball.com/assets/Logo-CjjAgmgS.webp" alt="" height={70} width={70} />
          </a>

          <h2 className="text-4xl font-bold text-black">
            {match.isBestOfThree ? 'Best of Three' : 'Single Game'} Match
          </h2>
        </div>

        {match.isBestOfThree && (
          <div className="text-center mb-10">
            <div className="text-2xl font-semibold mb-5">Match Score</div>
            <div className="flex justify-center items-center gap-6 text-3xl">
              <span>{match.team1.name}</span>
              <span className="font-mono">{match.score1} - {match.score2}</span>
              <span>{match.team2.name}</span>
            </div>
            <div className="mt-4 text-gray-600">
              Game {(match.currentGame || 0) + 1} of 3
            </div>
          </div>
        )}

        {isDeuce && (
          <div className="text-center mb-10 bg-yellow-50 p-5 rounded-lg text-yellow-800">
            Deuce! Win by 2 points needed
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[
            { team: match.team1, score: score1, updateFn: () => updateScore(1) },
            { team: match.team2, score: score2, updateFn: () => updateScore(2) },
          ].map(({ team, score, updateFn }) => (
            <div key={team.id} className="text-center">
              <h3 className="text-2xl font-semibold mb-6">{team.name}</h3>
              <div className="text-6xl font-bold mb-6">{score}</div>
              <button
                onClick={updateFn}
                disabled={match.isComplete}
                className="bg-blue-600 text-white py-5 px-10 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +1 Point
              </button>
            </div>
          ))}
        </div>

        {match.isComplete && (
          <div className="mt-12 text-center">
            <div className="text-4xl font-bold text-green-600">
              {match.winner?.name} Wins{match.isBestOfThree ? ' the Match!' : '!'}
            </div>
            {match.isBestOfThree ? (
              <div className="text-gray-600">
                Final Score: {match.score1} - {match.score2}
              </div>
            ) : (
              <div className="text-gray-600">
                Final Score: {score1} - {score2}
              </div>
            )}
          </div>
        )}

        {match.isBestOfThree && match.games && (
          <div className="mt-12 border-t pt-6">
            <h3 className="text-2xl font-semibold mb-5 text-center">Game History</h3>
            <div className="space-y-4">
              {match.games.map((game, index) => (
                <div key={index} className="flex justify-between items-center px-8 py-4 bg-gray-50 rounded">
                  <span className="font-medium">Game {index + 1}</span>
                  <span className="font-mono">
                    {game.score1} - {game.score2}
                    {game.winner && ` (${game.winner.name})`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
