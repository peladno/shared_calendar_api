
const http = require('http');

// Configuration
const API_URL = 'http://localhost:4000/api';
const EMAIL = 'test@example.com';
const PASSWORD = 'password123';

async function request(method, path, body = null, token = null) {
    return new Promise((resolve, reject) => {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(`${API_URL}${path}`, options, (res) => {
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({ status: res.statusCode, body: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, body: data });
                }
            });
        });

        req.on('error', reject);

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function login() {
    console.log('Logging in...');
    try {
        // Register first to ensure user exists
        await request('POST', '/auth/register', {
            email: EMAIL,
            password: PASSWORD,
            username: 'testuser_' + Date.now(),
            fullName: 'Test User'
        });
    } catch (e) { }

    const res = await request('POST', '/auth/login', {
        email: EMAIL,
        password: PASSWORD,
    });

    if (res.status !== 200) {
        throw new Error(`Login failed (${res.status}): ${JSON.stringify(res.body)}`);
    }
    return res.body.data.token;
}

async function main() {
    try {
        const token = await login();
        console.log('Login successful');

        // 1. Create a calendar
        console.log('Creating calendar...');
        const calRes = await request('POST', '/calendars', {
            name: 'Event Test Calendar',
            color: '#FF0000'
        }, token);

        if (calRes.status !== 201) throw new Error('Failed to create calendar');
        const calendarId = calRes.body.data.id;
        console.log('Calendar created:', calendarId);

        // 2. Create an event
        console.log('Creating event...');
        const eventRes = await request('POST', '/events', {
            title: 'Test Event',
            startTime: new Date().toISOString(),
            endTime: new Date(Date.now() + 3600000).toISOString(), // +1 hour
            calendarId: calendarId,
            description: 'This is a test event',
            isAllDay: false
        }, token);

        if (eventRes.status !== 201) {
            console.error('Create event failed:', eventRes.body);
            throw new Error('Failed to create event');
        }
        const eventId = eventRes.body.data.id;
        console.log('Event created:', eventId);

        // 3. Get all events for calendar
        console.log('Listing events...');
        const listRes = await request('GET', `/events?calendarId=${calendarId}`, null, token);
        console.log('Events found:', listRes.body.data.length);

        // 4. Get one event
        console.log('Getting event details...');
        const getRes = await request('GET', `/events/${eventId}`, null, token);
        if (getRes.body.data.title !== 'Test Event') throw new Error('Event details mismatch');

        // 5. Update event
        console.log('Updating event...');
        const updateRes = await request('PUT', `/events/${eventId}`, {
            title: 'Updated Test Event'
        }, token);
        if (updateRes.body.data.title !== 'Updated Test Event') throw new Error('Update failed');
        console.log('Event updated');

        // 6. Delete event
        console.log('Deleting event...');
        const deleteRes = await request('DELETE', `/events/${eventId}`, null, token);
        if (deleteRes.status !== 200) throw new Error('Delete failed');
        console.log('Event deleted');

        console.log('ALL TESTS PASSED');

    } catch (e) {
        console.error('Test failed:', e);
        process.exit(1);
    }
}

main();
