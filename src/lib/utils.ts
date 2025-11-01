type ClassValue = string | number | boolean | null | undefined | ClassDictionary | ClassArray
interface ClassDictionary {
  [id: string]: any
}
interface ClassArray extends Array<ClassValue> {}

/** Minimal clsx-like implementation to avoid external dependency */
function clsx(...inputs: ClassValue[]) {
  const classes: string[] = []

  const toClass = (input: ClassValue) => {
    if (input === null || input === undefined || input === false) return
    if (typeof input === 'string' || typeof input === 'number') {
      classes.push(String(input))
      return
    }
    if (Array.isArray(input)) {
      input.forEach(toClass)
      return
    }
    if (typeof input === 'object') {
      for (const key in input as ClassDictionary) {
        if (Object.prototype.hasOwnProperty.call(input, key) && (input as ClassDictionary)[key]) {
          classes.push(key)
        }
      }
    }
  }

  inputs.forEach(toClass)
  return classes.join(' ')
}

export function cn(...inputs: ClassValue[]) {
  return clsx(...inputs)
}

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), wait)
  }
}