// import { nodeResolve } from '@rollup/plugin-node-resolve';
// import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	experimental: {
		externalDir: true,
	},
	// plugins: [nodeResolve()],

	// optimizeDeps: {
	// 	esbuildOptions: {
	// 		define: {
	// 			global: 'globalThis',
	// 		},
	// 		plugins: [
	// 			NodeGlobalsPolyfillPlugin({
	// 				buffer: true,
	// 			}),
	// 		],
	// 	},
	// },
};

module.exports = nextConfig;
