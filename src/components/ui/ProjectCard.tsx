import type { Project } from '../../types';
import PlayIcon from './PlayIcon';

interface ProjectCardProps {
  project: Project;
  idx: number;
}

export default function ProjectCard({ project, idx }: ProjectCardProps) {
  return (
    <div className="project relative cursor-pointer group">
      <div
        className="project-cover relative overflow-hidden border"
        style={{
          aspectRatio: '1 / 1',
          background: 'var(--color-bg-2)',
          borderColor: 'var(--color-line)',
          transition: 'transform 0.5s ease',
        }}
      >
        <span
          className="absolute top-3 left-3.5 z-[2] text-[10px] tracking-[0.2em] px-2 py-1 backdrop-blur-sm"
          style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-ink)',
            background: 'rgba(11,9,7,0.6)',
          }}
        >
          {String(idx + 1).padStart(2, '0')}
        </span>

        <img
          src={project.cover}
          alt={`${project.title} by ${project.artist}`}
          className="w-full h-full object-cover"
        />

        <button
          className="play-btn absolute bottom-4 right-4 z-[2] w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: 'var(--color-gold)',
            color: 'var(--color-bg)',
            opacity: 0,
            transform: 'scale(0.85)',
            transition: 'all 0.35s ease',
          }}
        >
          <PlayIcon />
        </button>
      </div>

      <div className="pt-4 flex justify-between items-baseline gap-3">
        <h4
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 400,
            fontSize: '22px',
            letterSpacing: '-0.005em',
          }}
        >
          {project.title}
        </h4>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--color-muted)',
            whiteSpace: 'nowrap',
          }}
        >
          {project.year}
        </span>
      </div>
      <div
        className="mt-1"
        style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--color-muted)' }}
      >
        {project.artist}
      </div>
    </div>
  );
}
