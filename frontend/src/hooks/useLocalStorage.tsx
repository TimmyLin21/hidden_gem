import { useState, useCallback, useEffect } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') return initialValue

        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error)
            return initialValue
        }
    })

    const setValue = useCallback((value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value

            setStoredValue(valueToStore)

            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore))
                window.dispatchEvent(new Event("local-storage"))
            }
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error)
            throw error
        }
    }, [key, storedValue])

    useEffect(() => {
        const handleStorageChange = () => {
            try {
                const item = window.localStorage.getItem(key)
                if (item) setStoredValue(JSON.parse(item))
            } catch (e) {
                console.error(e)
            }
        }

        window.addEventListener("storage", handleStorageChange)
        window.addEventListener("local-storage", handleStorageChange)

        return () => {
            window.removeEventListener("storage", handleStorageChange)
            window.removeEventListener("local-storage", handleStorageChange)
        }
    }, [key])

    return [storedValue, setValue] as const
}