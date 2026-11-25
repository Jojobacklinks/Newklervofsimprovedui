import { CirclePlay } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog';

const jobsVideo = { id: 'N-GyDxXzT9M', title: 'Klervo · Jobs' };
const overview = { id: 'TPs-r53J_rI', title: 'Klervo overview' };
const tutorials: Partial<Record<string, typeof overview>> = {
  'All Jobs': jobsVideo,
  'Job Details': jobsVideo,
  Settings: { id: 'yurx4Q2hRWo', title: 'Klervo · Settings' },
};

export function TutorialVideoButton({ pageTitle }: { pageTitle: string }) {
  const video = tutorials[pageTitle] ?? overview;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={`Watch Tutorial: ${video.title}`}
          className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full px-2 text-sm font-medium text-[#9473ff] hover:bg-purple-50 focus-visible:outline-2 focus-visible:outline-[#6242c5]"
        >
          <CirclePlay size={28.8} aria-hidden="true" />
          <span className="text-inherit">Watch Tutorial</span>
        </button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined} className="bg-white p-4 text-[#051046] sm:max-w-3xl sm:p-6">
        <DialogTitle className="pr-8">{video.title}</DialogTitle>
        <iframe
          className="aspect-video w-full rounded-lg bg-black"
          src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1`}
          title={video.title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
        <a className="w-fit text-sm font-medium text-[#6242c5] hover:underline"
          href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer">
          Open on YouTube
        </a>
      </DialogContent>
    </Dialog>
  );
}
