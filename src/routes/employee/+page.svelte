<script lang="ts">
	let { data } = $props();

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

	const quickLinks = [
		{ href: '/employee/orders', label: 'Orders', description: 'Claim available orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
		{ href: '/employee/dishes', label: 'Dishes', description: 'Manage the dish catalog', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
		{ href: '/employee/products', label: 'Products', description: 'Manage product inventory', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
		{ href: '/employee/stats', label: 'Stats', description: 'Your performance graph', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
	];
</script>

<div class="space-y-8">
	<div>
		<h1 class="text-3xl font-bold tracking-tight">Staff Dashboard</h1>
		<p class="mt-1 text-gray-500 dark:text-gray-400">Welcome back. Manage your workspace below.</p>
	</div>

	<div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
		{#each quickLinks as link}
			<a
				href={link.href}
				class="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-5 transition-all duration-200 hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800"
			>
				<div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-3">
					<svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={link.icon} />
					</svg>
				</div>
				<h3 class="font-semibold group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{link.label}</h3>
				<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{link.description}</p>
			</a>
		{/each}
	</div>

	<!-- Claimed Orders -->
	<div>
		<h2 class="text-xl font-bold tracking-tight mb-4">My Claimed Orders</h2>

		{#if data.claimedOrders.length > 0}
			<div class="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
				<div class="overflow-x-auto">
					<table class="w-full text-sm text-left">
						<thead class="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase text-gray-500 dark:text-gray-400">
							<tr>
								<th class="px-4 py-3 font-medium">#</th>
								<th class="px-4 py-3 font-medium">Dish</th>
								<th class="px-4 py-3 font-medium">Prep</th>
								<th class="px-4 py-3 font-medium">Created</th>
								<th class="px-4 py-3 font-medium">Pickup</th>
								<th class="px-4 py-3 font-medium">Status</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-100 dark:divide-gray-800">
							{#each data.claimedOrders as order}
								<tr class="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
									<td class="px-4 py-3 text-gray-500 dark:text-gray-400">{order.id}</td>
									<td class="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{order.dish_name}</td>
									<td class="px-4 py-3 text-gray-600 dark:text-gray-300">
										{order.prep_time_minutes != null ? `${order.prep_time_minutes} min` : '—'}
									</td>
									<td class="px-4 py-3 text-gray-600 dark:text-gray-300">{formatDateTime(order.created_at)}</td>
									<td class="px-4 py-3 text-gray-600 dark:text-gray-300">{formatDateTime(order.planned_pickup)}</td>
									<td class="px-4 py-3">
										{#if order.is_done}
											<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">Done</span>
										{:else}
											<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">In progress</span>
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{:else}
			<div class="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
				<svg class="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
				</svg>
				<p class="text-gray-400 dark:text-gray-500">No claimed orders yet.</p>
				<a href="/employee/orders" class="inline-block mt-2 text-sm text-emerald-600 dark:text-emerald-400 hover:underline">Browse available orders &rarr;</a>
			</div>
		{/if}
	</div>
</div>
