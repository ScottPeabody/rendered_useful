interface VideoProps {
  src?: string
  youtube?: string
  title?: string
  caption?: string
}

export default function Video({ src, youtube, title = 'Video', caption }: VideoProps) {
  // YouTube embed
  if (youtube) {
    // Extract video ID from various YouTube URL formats
    const videoId = youtube.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    )?.[1] || youtube

    return (
      <figure className="my-8">
        <div className="relative aspect-video rounded-xl overflow-hidden border border-[var(--color-border)] shadow-lg">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
        {caption && (
          <figcaption className="mt-3 text-center text-sm text-[var(--color-text-muted)] italic">
            {caption}
          </figcaption>
        )}
      </figure>
    )
  }

  // Native video
  if (src) {
    return (
      <figure className="my-8">
        <video
          src={src}
          controls
          className="w-full rounded-xl border border-[var(--color-border)] shadow-lg"
        >
          Your browser does not support the video element.
        </video>
        {caption && (
          <figcaption className="mt-3 text-center text-sm text-[var(--color-text-muted)] italic">
            {caption}
          </figcaption>
        )}
      </figure>
    )
  }

  return null
}
