interface AudioProps {
  src: string
  title?: string
  caption?: string
}

export default function Audio({ src, title, caption }: AudioProps) {
  return (
    <figure className="my-6">
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        {title && (
          <p className="text-sm font-medium text-[var(--color-text-primary)] mb-3">
            {title}
          </p>
        )}
        <audio
          src={src}
          controls
          className="w-full"
        >
          Your browser does not support the audio element.
        </audio>
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-[var(--color-text-muted)] italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
