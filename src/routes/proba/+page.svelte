<script lang="ts">
	import { enhance } from '$app/forms';
	let { data, form }: { data: any; form: any } = $props();

	let optimisticPosts = $state<any[]>([]);
	let allPosts = $derived([...optimisticPosts, ...data.blogPosts]);

	let searchId = $state('');
	let filteredPosts = $derived(
		searchId ? allPosts.filter((p: any) => p.id === Number(searchId)) : allPosts
	);

	// Clear optimistic posts when server data refreshes
	$effect(() => {
		data.blogPosts;
		optimisticPosts = [];
	});
</script>


<div class="container mx-auto px-4 py-8">
	<!-- Toggle form -->
	<form method="POST" action="?/toggle" use:enhance class="flex gap-2 mb-4">
		<input type="number" name="id" placeholder="Post ID to toggle" class="border rounded px-3 py-2 w-full" />
		<button type="submit" class="shrink-0 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">Toggle</button>
	</form>
	{#if form?.error}
		<p class="text-red-500 mb-4 font-medium">Error: {form.error}</p>
	{/if}
	{#if form?.success}
		<p class="text-green-500 mb-4 font-medium">Toggled successfully!</p>
	{/if}

	<!-- Search by ID -->
	<div class="flex gap-2 mb-6">
		<input type="number" bind:value={searchId} placeholder="Search by Post ID" class="border rounded px-3 py-2 w-full" />
		{#if searchId}
			<button onclick={() => searchId = ''} class="shrink-0 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors">Clear</button>
		{/if}
	</div>

	<!-- Posts List -->
	<div class="space-y-4">
		{#each filteredPosts as post (post.id)}
			<article class="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 transition-all duration-200 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800">
				<div class="flex items-start justify-between gap-4">
					<h3 class="text-xl font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{post.id}</h3>
					<div class="flex items-center gap-2">
						{#if post.czy_na_bocznicy === 1}
							<span class="shrink-0 text-xs font-semibold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900 px-2.5 py-1 rounded-full">Na bocznicy</span>
						{:else}
							<span class="shrink-0 text-xs font-semibold text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900 px-2.5 py-1 rounded-full">Poza bocznicą</span>
						{/if}
                        <span>Ostatnia zmiana:</span>
						<time class="shrink-0 text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
							{post.ostatnia_zmiana
								? new Date(post.ostatnia_zmiana).toLocaleDateString('en-US', {
										month: 'short',
										day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
									})
								: 'No date'}
						</time>
					</div>
				</div>
				{#if post.user_display_name}
					<p class="mt-1 text-sm text-indigo-500 dark:text-indigo-400">
						<svg class="w-3.5 h-3.5 inline-block mr-1 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
						{post.user_display_name}
					</p>
				{/if}
				<p class="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">{post.text}</p>
			</article>
		{:else}
			<div class="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
				<p class="text-lg font-medium text-gray-400 dark:text-gray-500">No posts found</p>
			</div>
		{/each}
	</div>
</div>  