export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-[var(--color-border)] border-t-[var(--color-accent-primary)] animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-[var(--color-border)] border-b-[var(--color-accent-secondary)] animate-spin animation-delay-150" />
        </div>
      </div>
    </div>
  )
}
