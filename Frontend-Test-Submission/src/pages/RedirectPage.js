import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { logEvent } from '../logEvent';

function RedirectPage() {
  const { shortcode } = useParams();

  useEffect(() => {
    const stored = localStorage.getItem('shortUrls');
    if (stored) {
      const parsed = JSON.parse(stored);
      const match = parsed.find(item => item.shortUrl.endsWith(`/${shortcode}`));
      if (match) {
        logEvent("frontend", "info", "route", `Redirecting to ${match.longUrl}`);
        window.location.href = match.longUrl;
      } else {
        logEvent("frontend", "error", "route", `Shortcode not found: ${shortcode}`);
        alert("Shortcode not found.");
      }
    }
  }, [shortcode]);

  return <div>Redirecting...</div>;
}

export default RedirectPage;
