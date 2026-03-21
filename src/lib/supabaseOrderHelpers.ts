/** Flatten nested `dish(name)` / `dish: [{ name }]` from Supabase joins. */
export function extractDishName(dish: unknown): string {
	if (dish == null) return '—';
	if (Array.isArray(dish)) {
		const names = dish
			.map((d) =>
				d && typeof d === 'object' && d !== null && 'name' in d
					? String((d as { name: unknown }).name ?? '')
					: ''
			)
			.filter(Boolean);
		return names.length ? names.join(', ') : '—';
	}
	if (typeof dish === 'object' && dish !== null && 'name' in dish) {
		return String((dish as { name: unknown }).name ?? '—');
	}
	return '—';
}
