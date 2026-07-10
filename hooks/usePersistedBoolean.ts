"use client";

import { useCallback, useSyncExternalStore } from "react";

const listeners = new Map<string, Set<() => void>>();

function emit(key: string) {
  listeners.get(key)?.forEach((listener) => listener());
}

function subscribe(key: string) {
  return (callback: () => void) => {
    if (!listeners.has(key)) listeners.set(key, new Set());
    listeners.get(key)!.add(callback);
    return () => listeners.get(key)!.delete(callback);
  };
}

/**
 * Booleano persistido en localStorage, leído vía useSyncExternalStore para evitar
 * el antipatrón de llamar a setState dentro de un efecto. El snapshot del servidor
 * siempre usa `defaultValue`, así que el primer render en cliente coincide con el
 * del servidor y no genera errores de hidratación.
 */
export function usePersistedBoolean(key: string, defaultValue: boolean) {
  const getSnapshot = useCallback(() => {
    try {
      return window.localStorage.getItem(key) ?? String(defaultValue);
    } catch {
      return String(defaultValue);
    }
  }, [key, defaultValue]);

  const getServerSnapshot = useCallback(() => String(defaultValue), [defaultValue]);

  const stored = useSyncExternalStore(subscribe(key), getSnapshot, getServerSnapshot);
  const value = stored === "true";

  const setValue = useCallback(
    (next: boolean) => {
      try {
        window.localStorage.setItem(key, String(next));
      } catch {
        // localStorage no disponible (modo privado, etc.) — se ignora.
      }
      emit(key);
    },
    [key]
  );

  return [value, setValue] as const;
}
