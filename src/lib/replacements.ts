import { all } from 'module-replacements';

export const ORDERED_IDS: string[] = Object.keys(all.replacements).sort();
export const TOTAL = ORDERED_IDS.length;

export function get_replacement(id: string) {
	return all.replacements[id as keyof typeof all.replacements];
}

/** Returns all npm package names from mappings that list the given replacement id */
export function get_mappings_for(id: string): string[] {
	return Object.values(all.mappings)
		.filter((m) => m.replacements.includes(id))
		.map((m) => m.moduleName);
}
