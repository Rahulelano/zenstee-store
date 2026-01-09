import fetch from 'node-fetch';

const filename = 'image-1767934248690.png';
const backendUrl = `http://localhost:6000/uploads/${filename}`;
const frontendUrl = `http://localhost:8080/uploads/${filename}`;

async function checkUrl(url, name) {
    try {
        console.log(`Checking ${name}: ${url}`);
        const res = await fetch(url);
        console.log(`${name} Status:`, res.status);
        if (res.ok) {
            console.log(`${name} Content-Type:`, res.headers.get('content-type'));
            console.log(`${name} OK!`);
        } else {
            console.log(`${name} Failed!`);
        }
    } catch (err) {
        console.log(`${name} Error:`, err.message);
    }
}

async function run() {
    await checkUrl(backendUrl, 'Backend');
    await checkUrl(frontendUrl, 'Frontend Proxy');
}

run();
