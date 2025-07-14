export async function logEvent(stack, level, pkg, message) {
  const token = 'PASTE_YOUR_ACCESS_TOKEN_HERE'; // Replace this with your Bearer token

  try {
    const res = await fetch('http://20.244.56.144/evaluation-service/logs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ stack, level, package: pkg, message })
    });

    const data = await res.json();
    console.log('Logged:', data.message);
  } catch (err) {
    console.error('Log failed:', err);
  }
}
