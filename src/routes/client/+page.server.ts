import type { PageServerLoad } from './$types';
import { extractDishName } from '$lib/supabaseOrderHelpers';

export const load: PageServerLoad = async ({ locals, depends }) => {
	depends('supabase:db');

	if (!locals.user) {
		return { activeOrders: [], activeOrdersError: null };
	}

	const { data, error } = await locals.supabase
		.from('client_order')
		.select('id, dish(name), created_at, planned_pickup, is_done, id_plate')
		.eq('id_client', locals.user.id)
		.eq('is_done', 0)
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Error loading active orders:', error.message);
		return { activeOrders: [], activeOrdersError: error.message };
	}

	const activeOrders = (data ?? []).map(
		(o: {
			id: unknown;
			dish?: unknown;
			created_at?: string | null;
			planned_pickup?: string | null;
			is_done?: unknown;
			id_plate?: unknown;
		}) => ({
			id: o.id,
			dish_name: extractDishName(o.dish),
			created_at: o.created_at ?? null,
			planned_pickup: o.planned_pickup ?? null,
			is_done: o.is_done,
			id_plate: o.id_plate
		})
	);

	return { activeOrders, activeOrdersError: null };
};
