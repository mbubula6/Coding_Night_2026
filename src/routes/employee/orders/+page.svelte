<script lang="ts">
	import { enhance } from '$app/forms';

	let { data } = $props();
	let expandedId = $state<number | null>(null);

	function toggleExpand(id: number) {
		expandedId = expandedId === id ? null : id;
	}

	function formatDateTime(value: string | null): string {
		if (!value) return '—';
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return value;
		const yyyy = date.getFullYear();
		const mm = String(date.getMonth() + 1).padStart(2, '0');
		const dd = String(date.getDate()).padStart(2, '0');
		const hh = String(date.getHours()).padStart(2, '0');
		const min = String(date.getMinutes()).padStart(2, '0');
		return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
	}
</script>

<div class="space-y-6">
	<div>
		<h1 class="text-3xl font-bold tracking-tight">Available Orders</h1>
		<p class="mt-1 text-gray-500 dark:text-gray-400">Unclaimed orders waiting for a worker. Click a row to see required products.</p>
	</div>

	{#if data.error}
		<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl text-sm">
			Failed to load orders: {data.error}
		</div>
	{/if}

	{#if data.orders.length > 0}
		<div class="space-y-3">
			{#each data.orders as order (order.id)}
				<div class="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-200 hover:shadow-md">
					<!-- Order header row -->
					<button
						type="button"
						onclick={() => toggleExpand(order.id)}
						class="w-full text-left px-5 py-4 flex items-center justify-between gap-4 cursor-pointer"
					>
						<div class="flex items-center gap-4 min-w-0">
							<div class="shrink-0 w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
								<svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
								</svg>
							</div>
							<div class="min-w-0">
								<p class="font-semibold text-gray-900 dark:text-gray-100 truncate">{order.dish_name}</p>
								<p class="text-xs text-gray-500 dark:text-gray-400">
									Order #{order.id}
									{#if order.prep_time_minutes}
										&middot; {order.prep_time_minutes} min prep
									{/if}
								</p>
							</div>
						</div>
						<div class="flex items-center gap-3 shrink-0">
							<div class="hidden sm:block text-right text-xs text-gray-500 dark:text-gray-400">
								<p>Created: {formatDateTime(order.created_at)}</p>
								{#if order.planned_pickup}
									<p>Pickup: {formatDateTime(order.planned_pickup)}</p>
								{/if}
							</div>
							<svg
								class="w-5 h-5 text-gray-400 transition-transform duration-200 {expandedId === order.id ? 'rotate-180' : ''}"
								fill="none" stroke="currentColor" viewBox="0 0 24 24"
							>
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
							</svg>
						</div>
					</button>

					<!-- Expanded details -->
					{#if expandedId === order.id}
						<div class="border-t border-gray-100 dark:border-gray-800 px-5 py-4 bg-gray-50/50 dark:bg-gray-800/30 space-y-4">
							<div class="sm:hidden text-xs text-gray-500 dark:text-gray-400 space-y-1">
								<p>Created: {formatDateTime(order.created_at)}</p>
								{#if order.planned_pickup}
									<p>Pickup: {formatDateTime(order.planned_pickup)}</p>
								{/if}
							</div>

							<div>
								<h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Required Products</h4>
								{#if order.products.length > 0}
									<div class="flex flex-wrap gap-2">
										{#each order.products as product}
											<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
												{product}
											</span>
										{/each}
									</div>
								{:else}
									<p class="text-sm text-gray-400 dark:text-gray-500">No products linked to this dish.</p>
								{/if}
							</div>

							<!-- <form method="POST" action="?/claim" use:enhance>
								<input type="hidden" name="orderId" value={order.id} />
								<button
									type="submit"
									class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow cursor-pointer"
								>
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
									</svg>
									Claim this order
								</button>
							</form> -->
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{:else if !data.error}
		<div class="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
			<svg class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7" />
			</svg>
			<p class="text-lg font-medium text-gray-400 dark:text-gray-500">All caught up!</p>
			<p class="text-sm mt-1 text-gray-300 dark:text-gray-600">No unclaimed orders right now.</p>
		</div>
	{/if}
</div>
