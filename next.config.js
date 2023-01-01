/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ['picsum.photos', 'avataaars.io'],
		dangerouslyAllowSVG: true
	},
	reactStrictMode: true,
	swcMinify: true,
	typescript: {
		ignoreBuildErrors: true
	}
};

module.exports = nextConfig;
