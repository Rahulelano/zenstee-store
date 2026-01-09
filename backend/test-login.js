
async function testLogin() {
    try {
        const response = await fetch('http://localhost:6001/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'zenstee@gmail.com',
                password: 'password@123'
            })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        if (response.ok) {
            console.log('Login Successful');
            console.log('Token:', data.token ? 'Received' : 'Missing');
        } else {
            console.log('Login Failed:', data);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testLogin();
