/* eslint-disable */
/**
 * - Run `wranger dev` in your terminal to start a development server
 * - Run `npm run deploy` to publish your worker
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

export interface Env {
	surfreport: KVNamespace;
	PICTURE_BUCKET: R2Bucket;
	HEADER_PSK: string;
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

		switch (request.method) {
			case 'OPTIONS':
				return new Response('OK', { headers });
			case 'PUT':
				if (psk !== AUTH_HEADER_VALUE) return new Response("Authentication failed", { status: 403 });
				try {
					const imageData = await request.arrayBuffer();
					const contentType = 'image/jpeg';

					// Store original
					await env.PICTURE_BUCKET.put(key, imageData, {
						httpMetadata: { contentType }
					});

					// Create all sizes in parallel
					await Promise.all(
						Object.entries(IMAGE_SIZES).map(async ([size, width]) => {
							const resizedImage = await fetch('https://api.cloudflare.com/client/v4/image/resize', {
								method: 'POST',
								headers: {
									'Content-Type': contentType,
									'Accept': 'image/webp,image/*'
								},
								body: imageData,
								cf: {
									image: {
										width,
										fit: 'scale-down',
										quality: 80,
										format: 'webp',
									}
								}
							});

							if (resizedImage.ok) {
								const resizedBuffer = await resizedImage.arrayBuffer();
								await env.PICTURE_BUCKET.put(`${key}_${size}`, resizedBuffer, {
									httpMetadata: { contentType: 'image/webp' }
								});
							}
						})
					);

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
				const imageKey = size ? `${key}_${size}` : key;

				let object = await env.PICTURE_BUCKET.get(imageKey);

				if (object && stationIsDown(object.uploaded, 30)) {
					const fallbackKey = size ? `stationDown_${size}` : 'stationDown';
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

