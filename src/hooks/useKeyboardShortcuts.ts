import { useEffect, useCallback, useRef } from "react";

export interface KeyboardShortcut {
  key: string;
  modifiers?: ("ctrl" | "alt" | "shift" | "meta")[];
  description: string;
  action: () => void;
  preventDefault?: boolean;
  ignoreInInput?: boolean;
}

export interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
  shortcuts: KeyboardShortcut[];
  onShortcutTriggered?: (shortcut: KeyboardShortcut) => void;
}

function normalizeKey(key: string): string {
  return key
    .replace(/cmd|command/gi, "meta")
    .replace(/control/gi, "ctrl")
    .toLowerCase()
    .trim();
}

function matchesShortcut(
  event: KeyboardEvent,
  shortcut: KeyboardShortcut,
): boolean {
  const normalizedKey = normalizeKey(shortcut.key);
  const eventKey = normalizeKey(event.key);
  if (eventKey !== normalizedKey) return false;
  const requiredModifiers = shortcut.modifiers || [];
  const modifierChecks = {
    ctrl: event.ctrlKey,
    alt: event.altKey,
    shift: event.shiftKey,
    meta: event.metaKey,
  };
  for (const mod of requiredModifiers) {
    if (!modifierChecks[mod]) return false;
  }
  return true;
}

export function useKeyboardShortcuts({
  enabled = true,
  shortcuts,
  onShortcutTriggered,
}: UseKeyboardShortcutsOptions) {
  const enabledRef = useRef(enabled);
  const shortcutsRef = useRef(shortcuts);

  useEffect(() => {
    enabledRef.current = enabled;
    shortcutsRef.current = shortcuts;
  }, [enabled, shortcuts]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabledRef.current) return;
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }
      for (const shortcut of shortcutsRef.current) {
        if (matchesShortcut(event, shortcut)) {
          if (shortcut.preventDefault) {
            event.preventDefault();
          }
          shortcut.action();
          onShortcutTriggered?.(shortcut);
          break;
        }
      }
    },
    [onShortcutTriggered],
  );

  useEffect(() => {
    if (enabled) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [enabled, handleKeyDown]);
}

export const DEFAULT_SHORTCUTS: KeyboardShortcut[] = [
  {
    key: "s",
    modifiers: ["ctrl"],
    description: "Save project",
    action: () => console.log("Save shortcut triggered"),
    preventDefault: true,
  },
  {
    key: "z",
    modifiers: ["ctrl"],
    description: "Undo",
    action: () => console.log("Undo shortcut triggered"),
    preventDefault: true,
  },
  {
    key: "y",
    modifiers: ["ctrl"],
    description: "Redo",
    action: () => console.log("Redo shortcut triggered"),
    preventDefault: true,
  },
  {
    key: "e",
    modifiers: ["ctrl"],
    description: "Export",
    action: () => console.log("Export shortcut triggered"),
    preventDefault: true,
  },
];

export function getShortcutDisplay(key: string, modifiers?: string[]): string {
  const parts: string[] = [];
  if (modifiers) {
    for (const mod of modifiers) {
      if (mod === "ctrl") parts.push("Ctrl");
      else if (mod === "alt") parts.push("Alt");
      else if (mod === "shift") parts.push("Shift");
      else if (mod === "meta") parts.push("Cmd");
    }
  }
  parts.push(key.toUpperCase());
  return parts.join(" + ");
}

export function getShortcutCategory(key: string): string {
  switch (key) {
    case "s":
    case "z":
    case "y":
      return "Editing";
    case "e":
    case "p":
      return "Export";
    case " ":
      return "Presentation";
    case "escape":
    case "enter":
    case "tab":
      return "Interface";
    default:
      return "General";
  }
}
