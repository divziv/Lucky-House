import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from '../components/common/Button';
import { JoinGameModal } from '../components/player/JoinGameModal';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { OfflineIndicator } from '../components/common/OfflineIndicator';
import {
  Trophy,
  Play,
  Smartphone,
  Volume2,
  Sparkles,
  Users,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

import tambolaHeroImage from '../assets/images/tambola_royal_theme_1790516012350.jpg';

export interface HomeProps {
  onStartSetup: () => void;
  onJoinSuccess: (code: string, playerName: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onStartSetup, onJoinSuccess }) => {
  const { hasResumeGame, resumeSavedGame, dismissResume, startNewSetup } = useGame();
  const [showJoinModal, setShowJoinModal] = useState(false);

  const handleStartPhysical = () => {
    startNewSetup('physical');
    onStartSetup();
  };

  const handleStartVirtual = () => {
    startNewSetup('virtual');
    onStartSetup();
  };

  return (
    <div className="min-h-screen theme-bg-page theme-text-primary flex flex-col justify-between transition-colors">
      {/* Top Banner Navigation */}
      <nav className="w-full border-b theme-border theme-bg-card px-6 py-3.5 sticky top-0 z-20 shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 rounded-full theme-text-accent inline-block shadow-xs bg-current" />
            <div>
              <span className="text-xl font-black theme-text-accent tracking-tight font-heading block leading-tight">
                Lucky House
              </span>
              <span className="text-[11px] font-semibold theme-text-secondary tracking-wide block">
                Tambola Time - Call. Mark. Claim. Celebrate!
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <OfflineIndicator />
            <ThemeToggle />

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowJoinModal(true)}
              className="text-xs font-semibold"
            >
              <Smartphone className="w-3.5 h-3.5" />
              Join Game
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleStartPhysical}
              className="text-xs font-bold"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Start Game ▶
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Hero Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 w-full">
        {/* Resume Banner if Previous Game Exists in LocalStorage */}
        {hasResumeGame && (
          <div className="mb-8 p-4 rounded-2xl theme-bg-card border-2 theme-border flex flex-wrap items-center justify-between gap-4 shadow-md transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl theme-bg-accent-subtle theme-text-accent flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold theme-text-primary">
                  Active Game Session Found in Storage
                </h2>
                <p className="text-xs theme-text-secondary">
                  You have an unfinished game in progress. Would you like to resume?
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={dismissResume} className="text-xs opacity-70">
                Dismiss
              </Button>
              <Button variant="primary" size="sm" onClick={resumeSavedGame} className="text-xs font-bold">
                Resume Game
              </Button>
            </div>
          </div>
        )}

        {/* Hero Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          {/* Left Text / Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full theme-bg-accent-subtle border theme-border theme-text-accent text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              Tambola Time - Call. Mark. Claim. Celebrate!
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold theme-text-primary font-heading tracking-tight leading-[1.15]">
              Welcome to <span className="theme-text-accent">Lucky House</span>
            </h1>

            <p className="theme-text-secondary text-base sm:text-lg max-w-xl leading-relaxed">
              Family-friendly Housie and Tambola caller with clear voice announcements, celebratory confetti and claps, flexible number ranges, and verified winner claims.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={handleStartPhysical}
                className="font-bold text-base shadow-md px-6 py-3"
              >
                <Play className="w-4 h-4 fill-current" />
                Start Game ▶
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={handleStartVirtual}
                className="font-semibold text-base px-6 py-3"
              >
                <Smartphone className="w-4 h-4" />
                Host Virtual Game
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowJoinModal(true)}
                className="font-semibold text-base px-6 py-3"
              >
                Join with Code
              </Button>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t theme-border text-xs theme-text-secondary">
              <div>
                <span className="block font-bold theme-text-primary text-sm">
                  3 Visual Themes
                </span>
                Black &amp; Gold, Blue, Pink
              </div>
              <div>
                <span className="block font-bold theme-text-primary text-sm">
                  Confetti &amp; Claps
                </span>
                Joyous winner celebration
              </div>
              <div>
                <span className="block font-bold theme-text-primary text-sm">
                  Flexible Range
                </span>
                1–90, 1–100, or custom
              </div>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border theme-border shadow-lg aspect-[16/10] theme-bg-card">
              <img
                src={tambolaHeroImage}
                alt="Tambola Masti game night"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#66BB6A] animate-pulse" />
                  <span className="font-bold">Family Game Night</span>
                </div>
                <span className="font-bold text-amber-300">Call &middot; Mark &middot; Claim &middot; Celebrate!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl theme-bg-card border theme-border space-y-3 shadow-xs transition-colors">
            <div className="w-12 h-12 rounded-xl theme-bg-accent-subtle theme-text-accent border theme-border flex items-center justify-center">
              <Volume2 className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold theme-text-primary font-heading">
              Voice Calling &amp; Audio
            </h2>
            <p className="text-xs theme-text-secondary leading-relaxed">
              Every draw pops up on screen with sound effects, followed by clear digit-by-digit announcements and claps.
            </p>
          </div>

          <div className="p-6 rounded-2xl theme-bg-card border theme-border space-y-3 shadow-xs transition-colors">
            <div className="w-12 h-12 rounded-xl theme-bg-accent-subtle theme-text-accent border theme-border flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold theme-text-primary font-heading">
              Dynamic Top of the House
            </h2>
            <p className="text-xs theme-text-secondary leading-relaxed">
              Whether you choose 1–90, 1–100, or a custom range, the highest number dynamically crowned Top of the House.
            </p>
          </div>

          <div className="p-6 rounded-2xl theme-bg-card border theme-border space-y-3 shadow-xs transition-colors">
            <div className="w-12 h-12 rounded-xl theme-bg-accent-subtle theme-text-accent border theme-border flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold theme-text-primary font-heading">
              Multi-Device Gameplay
            </h2>
            <p className="text-xs theme-text-secondary leading-relaxed">
              Host physical paper games or let players join digitally on their phones/tablets with real-time claims and confetti.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t theme-border py-6 px-6 theme-bg-card text-xs theme-text-secondary text-center transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Lucky House &middot; Tambola Time - Call. Mark. Claim. Celebrate!</span>
          <span>Theme System &middot; Black &amp; Gold &middot; White &amp; Blue &middot; White &amp; Pink</span>
        </div>
      </footer>

      {/* Join Game Modal */}
      <JoinGameModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onJoin={onJoinSuccess}
      />
    </div>
  );
};
