import React, { useState, useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { ThemeProvider } from './context/ThemeContext';
import { Home } from './pages/Home';
import { Setup } from './pages/Setup';
import { HostGame } from './pages/HostGame';
import { PlayerGame } from './pages/PlayerGame';
import { GameResultsView } from './components/results/GameResultsView';
import { ToastContainer } from './components/common/Toast';
import { gameSessionService } from './services/gameSessionService';
import { generatePlayerCard } from './services/cardGenerator';
import { Player } from './types/tambola';

type AppView = 'home' | 'setup' | 'host' | 'player' | 'results';

const AppContent: React.FC = () => {
  const {
    gameState,
    toasts,
    dismissToast,
    startGame,
    startNewSetup,
    resetGame,
    setActivePlayerById,
    showToast,
  } = useGame();

  const [currentView, setCurrentView] = useState<AppView>('home');

  // Sync view with gameState status
  useEffect(() => {
    if (!gameState) {
      if (currentView !== 'player') {
        setCurrentView('home');
      }
      return;
    }

    if (gameState.status === 'finished') {
      setCurrentView('results');
    } else if (
      gameState.status === 'playing' ||
      gameState.status === 'firstFivePaused' ||
      gameState.status === 'allPrizesClaimed' ||
      gameState.status === 'ready'
    ) {
      if (currentView !== 'player' && currentView !== 'setup') {
        setCurrentView('host');
      }
    }
  }, [gameState?.status]);

  // Check URL query parameters for quick joining (e.g. ?code=TMB-4827)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const codeParam = params.get('code') || params.get('join');
      if (codeParam) {
        // Can open join directly
      }
    }
  }, []);

  const handleStartSetup = () => {
    setCurrentView('setup');
  };

  const handleStartGameFromSetup = (config: Parameters<typeof startGame>[0]) => {
    startGame(config);
    setCurrentView('host');
  };

  const handleCancelSetup = () => {
    setCurrentView('home');
  };

  const handleJoinSuccess = async (code: string, playerName: string) => {
    // Generate player card with room's range or default 1-90
    const currentRange = gameState?.config.numberRange || { start: 1, end: 90 };
    const card = generatePlayerCard(1, currentRange, Math.floor(Math.random() * 8));
    const newPlayer: Player = {
      id: `player-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: playerName,
      card,
      wonCategories: [],
      fullHouseEligible: true,
      connected: true,
      joinedAt: Date.now(),
    };

    const res = await gameSessionService.joinPlayer(code, newPlayer);
    if (res.success) {
      setActivePlayerById(newPlayer.id);
      setCurrentView('player');
      showToast('success', 'Joined Room', `Connected to session ${code} as ${playerName}`);
    } else {
      showToast('error', 'Join Failed', res.message || 'Could not connect to session.');
    }
  };

  const handlePlayAgain = () => {
    resetGame();
    setCurrentView('host');
  };

  const handleNewGame = () => {
    startNewSetup('physical');
    setCurrentView('setup');
  };

  const handleGoHome = () => {
    setCurrentView('home');
  };

  return (
    <div className="relative min-h-screen bg-slate-950 dark:bg-slate-950 light:bg-slate-100 font-sans antialiased text-slate-100 dark:text-slate-100 light:text-slate-900 transition-colors duration-200">
      {currentView === 'home' && (
        <Home
          onStartSetup={handleStartSetup}
          onJoinSuccess={handleJoinSuccess}
        />
      )}

      {currentView === 'setup' && (
        <Setup
          initialConfig={gameState?.config}
          onStartGame={handleStartGameFromSetup}
          onCancel={handleCancelSetup}
        />
      )}

      {currentView === 'host' && <HostGame />}

      {currentView === 'player' && (
        <PlayerGame onLeave={handleGoHome} />
      )}

      {currentView === 'results' && gameState && (
        <div className="min-h-screen bg-slate-950 dark:bg-slate-950 light:bg-slate-100 flex flex-col justify-between transition-colors duration-200">
          <GameResultsView
            state={gameState}
            onPlayAgain={handlePlayAgain}
            onNewGame={handleNewGame}
            onGoHome={handleGoHome}
          />
        </div>
      )}

      {/* Global Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </ThemeProvider>
  );
}

export default App;
