import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import GenericSlideRenderer from '../components/slides/GenericSlideRenderer';
import { THEMES } from '../themes';

interface PrintJob {
  deck_data: any;
  theme: string;
  is_free: boolean;
}

export default function PrintView() {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<PrintJob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {


    const fetchJob = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : `http://${window.location.hostname}:10001`);
        const res = await fetch(`${baseUrl}/api/pitchking/print-job/${jobId}`);
        if (!res.ok) throw new Error("Job not found or expired");
        const data = await res.json();
        setJob(data);
        
        // Add a small delay to ensure images/fonts load before signaling ready
        setTimeout(() => setIsReady(true), 1500);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchJob();
  }, [jobId]);

  if (error) {
    return <div className="p-8 text-red-500 font-bold">Error: {error}</div>;
  }

  if (!job) {
    return <div className="p-8 text-white">Loading...</div>;
  }

  const slides = job.deck_data?.slides || [];
  const themeData = THEMES[job.theme] || THEMES['aurora'];

  // 1920x1080 is the standard size. But GenericSlideRenderer is designed for a smaller container (like 900x500 approx in the preview).
  // We will scale the inner container to fit 1920x1080 without changing the component's internal relative layout.
  // We'll use a scale factor of 1.5, meaning the base container is 1280x720.
  
  return (
    <div 
      className={`min-h-screen ${isReady ? 'print-ready' : ''}`} 
      style={{ background: themeData.colors.background }}
    >
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <style>
        {`
          @page { size: 1920px 1080px; margin: 0; }
          body { margin: 0; padding: 0; background: ${themeData.colors.background}; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .slide-page { 
            width: 1920px; 
            height: 1080px; 
            overflow: hidden; 
            position: relative; 
            page-break-after: always;
            break-after: page;
          }
          .slide-page:last-child {
            page-break-after: auto;
            break-after: auto;
          }
          /* Override theme variables for the slide renderer */
          :root {
            --theme-bg: ${themeData.colors.background};
            --theme-text: ${themeData.colors.text};
            --theme-primary: ${themeData.colors.primary};
            --theme-secondary: ${themeData.colors.secondary};
            --theme-muted: color-mix(in srgb, ${themeData.colors.text} 60%, transparent);
            --theme-border: color-mix(in srgb, ${themeData.colors.text} 15%, transparent);
            --theme-card: color-mix(in srgb, ${themeData.colors.background} 95%, ${themeData.colors.text});
          }
        `}
      </style>
      
      {slides.map((slide: any, index: number) => (
        <div key={index} className="slide-page flex items-center justify-center">
          {/* Main Slide Content - Scaled up */}
          <div className="relative z-10 w-[1280px] h-[720px]" style={{ transform: 'scale(1.5)', transformOrigin: 'center center' }}>
            <GenericSlideRenderer slide={slide} onUpdate={() => {}} />
          </div>

          {/* Watermark for Free Users */}
          {job.is_free && (
            <div className="absolute inset-0 z-50 pointer-events-none flex flex-col items-center justify-center opacity-10 rotate-[-15deg]">
              <div className="text-[150px] font-black tracking-widest text-white uppercase drop-shadow-2xl">
                PitchKing Preview
              </div>
              <div className="text-[40px] font-bold text-white mt-4">
                Upgrade to Pro to remove watermark
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
