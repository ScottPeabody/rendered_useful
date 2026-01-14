/**
 * Time utilities for rendered_useful
 * 
 * All dates are stored in UTC (ISO 8601 format) and rendered in the user's local timezone.
 * This ensures consistency across the platform while providing a localized experience.
 */

export type DateFormat = 'full' | 'long' | 'medium' | 'short' | 'relative' | 'monthYear' | 'monthDay'

interface FormatOptions {
  format?: DateFormat
  includeTime?: boolean
}

/**
 * Parse a date string into a UTC Date object
 * Handles both date-only strings (YYYY-MM-DD) and full ISO strings
 */
export function parseUTCDate(dateString: string): Date {
  // If it's just a date (YYYY-MM-DD), treat it as UTC midnight
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return new Date(dateString + 'T00:00:00Z')
  }
  // If it already has time/timezone info, parse as-is
  return new Date(dateString)
}

/**
 * Format a date for display in the user's local timezone
 */
export function formatDate(dateString: string, options: FormatOptions = {}): string {
  const { format = 'long', includeTime = false } = options
  const date = parseUTCDate(dateString)
  
  // Handle invalid dates
  if (isNaN(date.getTime())) {
    console.warn(`Invalid date string: ${dateString}`)
    return dateString
  }

  const formatOptions: Intl.DateTimeFormatOptions = {}
  
  switch (format) {
    case 'full':
      // "Monday, January 13, 2026"
      formatOptions.weekday = 'long'
      formatOptions.year = 'numeric'
      formatOptions.month = 'long'
      formatOptions.day = 'numeric'
      break
    case 'long':
      // "January 13, 2026"
      formatOptions.year = 'numeric'
      formatOptions.month = 'long'
      formatOptions.day = 'numeric'
      break
    case 'medium':
      // "Jan 13, 2026"
      formatOptions.year = 'numeric'
      formatOptions.month = 'short'
      formatOptions.day = 'numeric'
      break
    case 'short':
      // "1/13/26"
      formatOptions.year = '2-digit'
      formatOptions.month = 'numeric'
      formatOptions.day = 'numeric'
      break
    case 'monthYear':
      // "January 2026"
      formatOptions.year = 'numeric'
      formatOptions.month = 'long'
      break
    case 'monthDay':
      // "Jan 13"
      formatOptions.month = 'short'
      formatOptions.day = 'numeric'
      break
    case 'relative':
      return formatRelativeTime(date)
  }

  if (includeTime) {
    formatOptions.hour = 'numeric'
    formatOptions.minute = '2-digit'
  }

  return date.toLocaleDateString(undefined, formatOptions)
}

/**
 * Format a date as relative time ("2 days ago", "in 3 hours", etc.)
 */
export function formatRelativeTime(date: Date | string): string {
  const targetDate = typeof date === 'string' ? parseUTCDate(date) : date
  const now = new Date()
  const diffMs = targetDate.getTime() - now.getTime()
  const diffSecs = Math.round(diffMs / 1000)
  const diffMins = Math.round(diffSecs / 60)
  const diffHours = Math.round(diffMins / 60)
  const diffDays = Math.round(diffHours / 24)
  const diffWeeks = Math.round(diffDays / 7)
  const diffMonths = Math.round(diffDays / 30)
  const diffYears = Math.round(diffDays / 365)

  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })

  if (Math.abs(diffSecs) < 60) {
    return rtf.format(diffSecs, 'second')
  } else if (Math.abs(diffMins) < 60) {
    return rtf.format(diffMins, 'minute')
  } else if (Math.abs(diffHours) < 24) {
    return rtf.format(diffHours, 'hour')
  } else if (Math.abs(diffDays) < 7) {
    return rtf.format(diffDays, 'day')
  } else if (Math.abs(diffWeeks) < 4) {
    return rtf.format(diffWeeks, 'week')
  } else if (Math.abs(diffMonths) < 12) {
    return rtf.format(diffMonths, 'month')
  } else {
    return rtf.format(diffYears, 'year')
  }
}

/**
 * Get the current date in UTC ISO format (for storing new content)
 */
export function getCurrentUTCDate(): string {
  return new Date().toISOString()
}

/**
 * Get just the date portion in YYYY-MM-DD format (UTC)
 */
export function getUTCDateString(date: Date = new Date()): string {
  return date.toISOString().split('T')[0]
}

/**
 * Compare two date strings for sorting (descending by default)
 */
export function compareDates(a: string, b: string, ascending = false): number {
  const dateA = parseUTCDate(a).getTime()
  const dateB = parseUTCDate(b).getTime()
  return ascending ? dateA - dateB : dateB - dateA
}

/**
 * Check if a date is in the past
 */
export function isPast(dateString: string): boolean {
  return parseUTCDate(dateString).getTime() < Date.now()
}

/**
 * Check if a date is in the future
 */
export function isFuture(dateString: string): boolean {
  return parseUTCDate(dateString).getTime() > Date.now()
}

/**
 * Check if a date is today (in the user's local timezone)
 */
export function isToday(dateString: string): boolean {
  const date = parseUTCDate(dateString)
  const today = new Date()
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  )
}

/**
 * Check if a date falls within a range
 */
export function isWithinRange(dateString: string, startDate: string, endDate: string): boolean {
  const date = parseUTCDate(dateString).getTime()
  const start = parseUTCDate(startDate).getTime()
  const end = parseUTCDate(endDate).getTime()
  return date >= start && date <= end
}

/**
 * Get the user's timezone name
 */
export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

/**
 * Get the status of an event based on its dates
 */
export function getEventStatus(startDate: string, endDate: string): 'upcoming' | 'active' | 'ended' {
  const now = Date.now()
  const start = parseUTCDate(startDate).getTime()
  // Add a full day to end date to include the entire last day
  const end = parseUTCDate(endDate).getTime() + (24 * 60 * 60 * 1000 - 1)
  
  if (now < start) return 'upcoming'
  if (now > end) return 'ended'
  return 'active'
}

/**
 * Format a date range for display
 */
export function formatDateRange(startDate: string, endDate: string): string {
  const start = parseUTCDate(startDate)
  const end = parseUTCDate(endDate)
  
  // Same month and year: "Jan 15-22, 2026"
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    const month = start.toLocaleDateString(undefined, { month: 'short' })
    const year = start.getFullYear()
    return `${month} ${start.getDate()}-${end.getDate()}, ${year}`
  }
  
  // Different months, same year: "Jan 28 - Feb 4, 2026"
  if (start.getFullYear() === end.getFullYear()) {
    const startStr = start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    const endStr = end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    return `${startStr} - ${endStr}, ${start.getFullYear()}`
  }
  
  // Different years: "Dec 28, 2025 - Jan 4, 2026"
  const startStr = formatDate(startDate, { format: 'medium' })
  const endStr = formatDate(endDate, { format: 'medium' })
  return `${startStr} - ${endStr}`
}
