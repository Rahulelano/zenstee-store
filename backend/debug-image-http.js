import http from 'http';

const filename = 'image-1767934248690.png';
const backendPort = 6001;
const frontendPort = 8080;

function checkUrl(port, path, name) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: port,
            path: path,
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            console.log(`${name} (${port}) Status: ${res.statusCode}`);
            if (res.statusCode === 200) {
                console.log(`${name} Content-Type: ${res.headers['content-type']}`);
                console.log(`${name} OK!`);
            } else {
                console.log(`${name} Failed!`);
            }
            resolve();
        });

        req.on('error', (e) => {
            console.log(`${name} Error: ${e.message}`);
            resolve();
        });

        req.end();
    });
}

async function run() {
    await checkUrl(backendPort, `/uploads/${filename}`, 'Backend');
    await checkUrl(frontendPort, `/uploads/${filename}`, 'Frontend Proxy');
}

run();
