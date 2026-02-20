import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { Server } from '@sveltejs/kit';

export default defineConfig({ 
    plugins: [tailwindcss(), sveltekit()],
    server: {
        middlewareMode: false,
        allowedHosts: ['localhost', 'jonathan-unscribed-structurally.ngrok-free.dev']
    }
});
