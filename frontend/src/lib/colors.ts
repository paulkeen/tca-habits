// Palette keys mirror the backend's VALID_COLORS. The frontend owns the actual
// values. `base` paints the filled tile, ring, and accents; `on` is the text/
// icon color drawn on top of a filled (base-colored) tile, chosen for legible
// contrast. Idle tiles derive a soft tint from `base` via color-mix at runtime,
// so they adapt to light and dark automatically.

export type ColorKey =
  | 'red' | 'orange' | 'amber' | 'green' | 'teal'
  | 'blue' | 'indigo' | 'purple' | 'pink';

interface HabitColor {
  base: string;
  on: string;
  label: string;
}

const LIGHT = '#ffffff';
const DARK = '#1c1407';

export const COLORS: Record<ColorKey, HabitColor> = {
  red:    { base: '#fb5a4b', on: LIGHT, label: 'Red' },
  orange: { base: '#fb8c2a', on: DARK,  label: 'Orange' },
  amber:  { base: '#f5b318', on: DARK,  label: 'Amber' },
  green:  { base: '#34c759', on: DARK,  label: 'Green' },
  teal:   { base: '#16c2c2', on: DARK,  label: 'Teal' },
  blue:   { base: '#3b82f6', on: LIGHT, label: 'Blue' },
  indigo: { base: '#5b6ef5', on: LIGHT, label: 'Indigo' },
  purple: { base: '#a855f7', on: LIGHT, label: 'Purple' },
  pink:   { base: '#ff5fa2', on: LIGHT, label: 'Pink' },
};

export const COLOR_KEYS = Object.keys(COLORS) as ColorKey[];

export function habitColor(key: string): HabitColor {
  return COLORS[(key as ColorKey)] ?? COLORS.blue;
}
