import { useState } from 'react'
import { Check } from 'lucide-react'

interface TodoItem {
  text: string
  done?: boolean
}

interface TodoProps {
  title?: string
  items: TodoItem[] | string[]
}

export default function Todo({ title, items }: TodoProps) {
  // Normalize items to always be TodoItem[]
  const normalizedItems: TodoItem[] = items.map((item) =>
    typeof item === 'string' ? { text: item, done: false } : item
  )

  const [todos, setTodos] = useState(normalizedItems)

  const toggleTodo = (index: number) => {
    setTodos((prev) =>
      prev.map((todo, i) =>
        i === index ? { ...todo, done: !todo.done } : todo
      )
    )
  }

  const completedCount = todos.filter((t) => t.done).length
  const progress = (completedCount / todos.length) * 100

  return (
    <div className="my-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-[var(--color-text-primary)]">
            {title || 'Checklist'}
          </h4>
          <span className="text-sm text-[var(--color-text-muted)]">
            {completedCount}/{todos.length}
          </span>
        </div>
        {/* Progress bar */}
        <div className="mt-2 h-1.5 rounded-full bg-[var(--color-border)] overflow-hidden">
          <div
            className="h-full bg-[var(--color-accent-primary)] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Items */}
      <ul className="divide-y divide-[var(--color-border)]">
        {todos.map((todo, index) => (
          <li key={index}>
            <button
              onClick={() => toggleTodo(index)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--color-surface-elevated)] transition-colors"
            >
              <span
                className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  todo.done
                    ? 'bg-[var(--color-accent-primary)] border-[var(--color-accent-primary)]'
                    : 'border-[var(--color-border)]'
                }`}
              >
                {todo.done && <Check size={12} className="text-white" />}
              </span>
              <span
                className={`transition-all ${
                  todo.done
                    ? 'line-through text-[var(--color-text-muted)]'
                    : 'text-[var(--color-text-secondary)]'
                }`}
              >
                {todo.text}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
