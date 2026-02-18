import { all } from 'module-replacements';

export const ORDERED_IDS: string[] = Object.keys(all.replacements).sort();
export const TOTAL = ORDERED_IDS.length;

export function get_replacement(id: string) {
	return all.replacements[id as keyof typeof all.replacements];
}
