'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import {
  BASE_GYM_IMAGE, MUSCLE_OVERLAY, MUSCLE_COLOR, MUSCLE_BORDER, exerciseImage, exerciseThumb,
} from '@/lib/exercise-media';

interface Exercise {
  id: string;
  name: string;
  slug: string;
  primary_muscle: string;
  equipment: string;
  type: string;
  instructions: string[];
  tips: string[];
  description: string;
}

const MUSCLE_GROUPS = ['Toate', 'Chest', 'Back', 'Legs', 'Shoulders', 'Biceps', 'Triceps', 'Core', 'Calves'];

export default function ExercisesPage() {
  const supabase = createClient();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [activeTab, setActiveTab] = useState('Toate');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.from('exercises').select('*').order('name');
      if (error) {
        setError('Nu am putut încărca exercițiile.');
      } else {
        setExercises(data ?? []);
      }
      setLoading(false);
    }
    getData();
  }, []);

  const filtered = activeTab === 'Toate'
    ? exercises
    : exercises.filter(ex => ex.primary_muscle === activeTab);

  return (
    <div className="min-h-screen bg-void text-white p-4 md:p-10">

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <p className="text-ember font-black text-[10px] tracking-[0.5em] uppercase mb-3 flex items-center gap-3">
          <span className="w-6 h-[3px] stripes inline-block" />
          ARSENALUL
        </p>
        <h1 className="font-display italic uppercase text-5xl md:text-6xl leading-none">
          ANTRENAMENT <span className="text-ember">TITAN</span>
        </h1>
        <div className="flex flex-wrap gap-2 mt-8">
          {MUSCLE_GROUPS.map(g => (
            <button
              key={g}
              onClick={() => setActiveTab(g)}
              className={`px-5 py-2 text-[10px] font-black tracking-[0.2em] transition-all ${
                activeTab === g
                  ? 'bg-ember text-black chamfer-sm scale-105'
                  : 'bg-zinc-950 border border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
              }`}
            >
              {g.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-zinc-950 border border-zinc-900 overflow-hidden animate-pulse">
              <div className="h-48 bg-zinc-900" />
              <div className="p-6 space-y-3">
                <div className="h-5 bg-zinc-800 w-3/4" />
                <div className="h-3 bg-zinc-900 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="max-w-7xl mx-auto p-8 bg-red-500/5 border border-red-500/20 text-center notch">
          <p className="text-red-400 font-bold text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-ember text-black font-black text-xs uppercase tracking-widest chamfer-sm"
          >
            Reîncearcă
          </button>
        </div>
      )}

      {/* Grid exerciții */}
      {!loading && !error && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filtered.map((ex, i) => {
            const thumb = exerciseImage(ex.slug) ?? exerciseThumb(ex.slug);
            return (
            <Link
              key={ex.id}
              href={`/exercises/${ex.slug}`}
              className={`group bg-zinc-950 border border-zinc-900 overflow-hidden transition-all cursor-pointer hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(0,0,0,0.55)] rise ${MUSCLE_BORDER[ex.primary_muscle] ?? ''}`}
              style={{ '--rise-delay': `${Math.min(i, 8) * 50}ms` } as React.CSSProperties}
            >
              {/* Card image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={thumb ?? BASE_GYM_IMAGE}
                  alt={ex.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Peste poza specifică, tenta de culoare e mai discretă */}
                <div className={`absolute inset-0 ${MUSCLE_OVERLAY[ex.primary_muscle] ?? 'bg-zinc-500/40'} mix-blend-multiply ${thumb ? 'opacity-50' : ''}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/95 via-transparent to-transparent" />

                <span className={`absolute bottom-3 left-4 text-[10px] font-black tracking-[0.3em] uppercase ${MUSCLE_COLOR[ex.primary_muscle] ?? 'text-orange-400'}`}>
                  {ex.primary_muscle}
                </span>

                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm border border-white/10 px-2 py-1 flex items-center gap-1 chamfer-sm">
                  <svg className="w-3 h-3 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span className="text-[10px] font-black text-white tracking-widest">VIDEO</span>
                </div>
              </div>

              <div className="p-5 relative">
                <h3 className="font-display uppercase text-lg leading-tight tracking-wide mb-1">{ex.name}</h3>
                <p className="text-zinc-500 text-xs mb-4">{ex.equipment} · {ex.type}</p>
                <div className="flex items-center text-ember text-[10px] font-black tracking-[0.25em]">
                  DESCHIDE GHIDUL
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
