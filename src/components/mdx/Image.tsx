interface ImageProps {
  src: string
  alt: string
  caption?: string
  size?: 'sm' | 'md' | 'lg' | 'full'
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  full: 'w-full',
}

export default function Image({ src, alt, caption, size = 'full' }: ImageProps) {
  return (
    <figure className={`my-8 ${sizeClasses[size]} mx-auto`}>
      <img
        src={src}
        alt={alt}
        className="rounded-xl border border-[var(--color-border)] shadow-lg w-full"
        loading="lazy"
      />
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-[var(--color-text-muted)] italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
