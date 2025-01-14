/* eslint-disable */
/**
 * Environment Variables Setup:
 * 
 * 1. For Local Development:
 *    - Create a .dev.vars file in project root with:
 *      HEADER_PSK=value
 *      CLOUDINARY_CLOUD_NAME=value
 *      CLOUDINARY_API_KEY=value
 *      CLOUDINARY_API_SECRET=value
 * 
 * 2. For Production:
 *    - Set secrets once using wrangler CLI:
 *      $ wrangler secret put HEADER_PSK
 *      $ wrangler secret put CLOUDINARY_CLOUD_NAME
 *      $ wrangler secret put CLOUDINARY_API_KEY
 *      $ wrangler secret put CLOUDINARY_API_SECRET
 * 
 * 3. Access in code:
 *    - All variables are available via the env parameter:
 *      env.HEADER_PSK, env.CLOUDINARY_CLOUD_NAME, etc.
 * 
 * Note: Secrets persist across deployments once set.
 * View/manage them in Cloudflare Dashboard: Workers & Pages → Worker → Settings → Variables
 */

interface ImageSizes {
	xs: number;
	sm: number;
	md: number;
	lg: number;
}

const IMAGE_SIZES: ImageSizes = {
	xs: 320,
	sm: 640,
	md: 1024,
	lg: 1920
};

interface QualitySettings {
	slow: number;
	medium: number;
	fast: number;
}

const QUALITY_SETTINGS: QualitySettings = {
	slow: 60,    // Lower quality for slow connections
	medium: 75,  // Medium quality for 3G/4G
	fast: 90     // High quality for fast connections
};

export interface Env {
	surfreport: KVNamespace;
	PICTURE_BUCKET: R2Bucket;
	HEADER_PSK: string;
	CLOUDINARY_CLOUD_NAME: string;
	CLOUDINARY_API_KEY: string;
	CLOUDINARY_API_SECRET: string;
	CLOUDINARY_UPLOAD_URL: string; // Format: https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		const key = url.pathname.slice(1);

		const AUTH_HEADER_KEY = "X-Custom-PSK";
		const AUTH_HEADER_VALUE = `${env.HEADER_PSK}`;
		const psk = request.headers.get(AUTH_HEADER_KEY);
		const allowedKeys = (await env.surfreport?.get('allowedKeys'))?.split(',').map(ky => ky.trim());

		// check if key is allowed
		if (!allowedKeys || !allowedKeys.includes(key)) return new Response("Not Allowed", { status: 403 });

		// cors headers	
		const headers = new Headers();
		headers.set('Access-Control-Allow-Origin', '*');
		headers.set('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
		headers.set('Access-Control-Allow-Credentials', 'true');

		function stationIsDown(uploadedDate: Date, expiryMinutes: number) {
			const uploadedTime = uploadedDate.getTime();
			const currentTime = Date.now();
			const timeDifferenceInMilliseconds = currentTime - uploadedTime;
			const timeDifferenceInMinutes = timeDifferenceInMilliseconds / (1000 * 60); // Convert milliseconds to minutes

			return timeDifferenceInMinutes > expiryMinutes
		}

		// Simplified upload function
		async function uploadToCloudinary(buffer: ArrayBuffer, env: Env) {
			const formData = new FormData();
			formData.append('file', new Blob([buffer]));
			formData.append('upload_preset', 'YOUR_UPLOAD_PRESET'); // Set this up in Cloudinary

			const response = await fetch(env.CLOUDINARY_UPLOAD_URL, {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error(`Cloudinary upload failed: ${await response.text()}`);
			}

			return await response.json();
		}

		switch (request.method) {
			case 'OPTIONS':
				return new Response('OK', { headers });
			case 'PUT':
				if (psk !== AUTH_HEADER_VALUE) return new Response("Authentication failed", { status: 403 });
				try {
					const imageData = await request.arrayBuffer();

					// Get the public_id from KV
					const publicId = await env.surfreport.get(`cloudinary_public_id_${key}`);
					if (!publicId) {
						return new Response(`No Cloudinary public_id found for station ${key}`, { status: 400 });
					}

					const timestamp = Math.round(Date.now() / 1000).toString();

					// Generate signature string
					const signatureStr = `overwrite=true&public_id=${publicId}&timestamp=${timestamp}${env.CLOUDINARY_API_SECRET}`;

					// Generate SHA-1 signature
					const signatureBuffer = await crypto.subtle.digest(
						'SHA-1',
						new TextEncoder().encode(signatureStr)
					);

					// Convert to hex string
					const signature = Array.from(new Uint8Array(signatureBuffer))
						.map(b => b.toString(16).padStart(2, '0'))
						.join('');

					const formData = new FormData();
					formData.append('file', new Blob([imageData]));
					formData.append('api_key', env.CLOUDINARY_API_KEY);
					formData.append('timestamp', timestamp);
					formData.append('public_id', publicId);
					formData.append('overwrite', 'true');
					formData.append('signature', signature);

					const uploadResponse = await fetch(
						`https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`,
						{
							method: 'POST',
							body: formData
						}
					);

					if (!uploadResponse.ok) {
						const errorText = await uploadResponse.text();
						throw new Error(`Cloudinary upload failed: ${errorText}`);
					}

					const result = await uploadResponse.json() as { version: string };
					await env.surfreport.put(`cloudinary_version_${key}`, String(result.version));

					// Store in R2 as backup
					await env.PICTURE_BUCKET.put(key, imageData, {
						httpMetadata: { contentType: 'image/jpeg' }
					});

					return new Response(`Put ${key} successfully!`);

				} catch (error) {
					return new Response(`Error uploading ${key}: ${error}`, { status: 500 });
				}
			case 'GET':
				const isPageCount = key === 'pageCount';
				// fetching the page count
				if (isPageCount) {
					const currentCount = (await env.surfreport?.get('pageCount')) || 1;
					const newCount = Number(currentCount) + 1;
					await env.surfreport.put('pageCount', `${newCount}`);
					headers.set('Content-Type', 'application/json');
					return new Response(JSON.stringify({ count: newCount }), { headers });
				}

				const size = url.searchParams.get('size') as keyof ImageSizes;
				const publicId = await env.surfreport.get(`cloudinary_public_id_${key}`);
				const version = await env.surfreport.get(`cloudinary_version_${key}`);

				if (publicId && version) {
					let cloudinaryUrl = `https://res.cloudinary.com/${env.CLOUDINARY_CLOUD_NAME}/image/upload`;

					// Get network speed from query param
					const speed = url.searchParams.get('speed') || 'medium';
					const quality = QUALITY_SETTINGS[speed as keyof QualitySettings];

					// Add transformations based on size and network speed
					if (size) {
						const width = IMAGE_SIZES[size];
						cloudinaryUrl += `/w_${width},q_${quality},f_auto`;
					}

					cloudinaryUrl += `/v${version}/${publicId}`;
					return Response.redirect(cloudinaryUrl, 302);
				}

				// Fallback to R2 if no Cloudinary details found
				let object = await env.PICTURE_BUCKET.get(key);

				if (object && stationIsDown(object.uploaded, 30)) {
					const fallbackKey = 'stationDown';
					object = await env.PICTURE_BUCKET.get(fallbackKey);
				}

				if (object === null) {
					return new Response('No image found', { status: 404 });
				}

				object.writeHttpMetadata(headers);
				headers.set('etag', object.httpEtag);
				return new Response(object.body, { headers });


			default:
				return new Response('Method Not Allowed', {
					status: 405,
					headers: {
						Allow: 'PUT, GET',
					},
				});
		}

	},
};

