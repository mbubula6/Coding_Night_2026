<script lang="ts">
	import { onMount } from 'svelte';
	import type { Chart as ChartType } from 'chart.js';

	let { data } = $props();
	let canvas: HTMLCanvasElement;

	function processData(dates: string[]) {
		const counts: Record<string, number> = {};

		const now = new Date();
		let earliest = new Date();

		if (dates.length > 0) {
			earliest = new Date(dates[0]);
		} else {
			earliest.setDate(now.getDate() - 6);
		}

		const current = new Date(earliest);
		current.setHours(0, 0, 0, 0);
		const end = new Date(now);
		end.setHours(0, 0, 0, 0);

		while (current <= end) {
			counts[current.toISOString().split('T')[0]] = 0;
			current.setDate(current.getDate() + 1);
		}

		for (const date of dates) {
			if (date) {
				const day = new Date(date).toISOString().split('T')[0];
				counts[day] = (counts[day] || 0) + 1;
			}
		}

		const labels = Object.keys(counts).sort();
		const values = labels.map((l) => counts[l]);
		return { labels, values };
	}

	onMount(() => {
		let chartInstance: ChartType | null = null;

		(async () => {
			const {
				Chart,
				LineController,
				LineElement,
				PointElement,
				CategoryScale,
				LinearScale,
				Tooltip,
				Legend,
				Title,
				Filler
			} = await import('chart.js');
			Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Title, Filler);

			const { labels, values } = processData(data.orderDates);
			const isDark = document.documentElement.classList.contains('dark');

			chartInstance = new Chart(canvas, {
				type: 'line',
				data: {
					labels: labels.map((l) =>
						new Date(l + 'T00:00:00').toLocaleDateString('en-US', {
							month: 'short',
							day: 'numeric'
						})
					),
					datasets: [
						{
							label: 'Orders',
							data: values,
							backgroundColor: isDark
								? 'rgba(52, 211, 153, 0.3)'
								: 'rgba(16, 185, 129, 0.2)',
							borderColor: isDark ? 'rgb(52, 211, 153)' : 'rgb(16, 185, 129)',
							borderWidth: 2,
							pointBackgroundColor: isDark ? 'rgb(52, 211, 153)' : 'rgb(16, 185, 129)',
							pointRadius: 4,
							pointHoverRadius: 6,
							tension: 0.4,
							fill: true
						}
					]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: { display: false },
						title: { display: false },
						tooltip: {
							backgroundColor: isDark ? '#1f2937' : '#fff',
							titleColor: isDark ? '#e5e7eb' : '#111827',
							bodyColor: isDark ? '#9ca3af' : '#6b7280',
							borderColor: isDark ? '#374151' : '#e5e7eb',
							borderWidth: 1,
							cornerRadius: 12,
							padding: 12
						}
					},
					scales: {
						y: {
							beginAtZero: true,
							ticks: {
								stepSize: 1,
								color: isDark ? '#6b7280' : '#9ca3af',
								font: { size: 12 }
							},
							grid: {
								color: isDark ? 'rgba(55,65,81,0.4)' : 'rgba(243,244,246,1)'
							},
							border: { display: false }
						},
						x: {
							ticks: {
								color: isDark ? '#6b7280' : '#9ca3af',
								font: { size: 12 }
							},
							grid: { display: false },
							border: { display: false }
						}
					}
				}
			});
		})();

		return () => chartInstance?.destroy();
	});
</script>

<div class="space-y-6">
	<div>
		<h1 class="text-3xl font-bold tracking-tight">My Stats</h1>
		<p class="mt-1 text-gray-500 dark:text-gray-400">Your order performance over time</p>
	</div>

	<div class="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-lg font-semibold">Orders Per Day</h2>
			<span class="text-sm text-gray-400 dark:text-gray-500">
				{data.totalOrders} total order{data.totalOrders !== 1 ? 's' : ''}
			</span>
		</div>
		<div class="h-80">
			<canvas bind:this={canvas}></canvas>
		</div>
	</div>

	<div class="grid sm:grid-cols-3 gap-4">
		<div class="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-5">
			<p class="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
			<p class="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{data.totalOrders}</p>
		</div>
		<div class="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-5">
			<p class="text-sm text-gray-500 dark:text-gray-400">First Order</p>
			<p class="text-lg font-semibold mt-1">
				{#if data.orderDates.length > 0}
					{new Date(data.orderDates[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
				{:else}
					<span class="text-gray-300 dark:text-gray-600">—</span>
				{/if}
			</p>
		</div>
		<div class="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-5">
			<p class="text-sm text-gray-500 dark:text-gray-400">Latest Order</p>
			<p class="text-lg font-semibold mt-1">
				{#if data.orderDates.length > 0}
					{new Date(data.orderDates[data.orderDates.length - 1]).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
				{:else}
					<span class="text-gray-300 dark:text-gray-600">—</span>
				{/if}
			</p>
		</div>
	</div>
</div>
