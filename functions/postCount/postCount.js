import fetch from 'node-fetch';

exports.handler = async function(event, context) {
    const location = event.headers.referer || event.headers.origin || '';
    
    const allowedDomains = [
        'https://seanssurfreport.netlify.app',
        'https://seanssurfreport.com',
        'http://127.0.0.1:5500/index.html'
    ];

    console.log('Check domains')

    if (allowedDomains.some(domain => location.includes(domain))) {

        console.log('IS ALLOWED')
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        try {
            const url = process.env.GOOGLE_SCRIPT_URL;
            // UPDATE COUNT
            const fetched = await fetch(url, options);
            const result = await fetched.json();

            console.log(result)
            

            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': location,
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({
                    count: result.count,
                }),
            };
        } catch (e) {
            console.error(e);
            return {
                statusCode: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': location,
                    'Access-Control-Allow-Credentials': true,
                },
            };
        }
    } else {
        return {
            statusCode: 403,
            body: 'Forbidden',
        };
    }
};
