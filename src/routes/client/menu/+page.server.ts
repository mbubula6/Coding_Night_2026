import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, depends }) => {
    depends('supabase:db');
    const { data, error } = await locals.supabase
        .from('dish')
        .select('id, name')
        .order('id', { ascending: true });

    if (error) {
        console.error('Error loading menu:', error.message);
        return { items: [], error: error.message };
    }

    return { items: data ?? [], error: null };
};
