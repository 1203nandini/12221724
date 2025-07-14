import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Link } from '@mui/material';
import { logEvent } from '../logEvent';

function StatsPage() {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('shortUrls');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUrls(parsed);
      logEvent("frontend", "info", "component", "Stats page viewed with saved short URLs");
    } else {
      logEvent("frontend", "warn", "component", "Stats page loaded but no URLs found");
    }
  }, []);

  return (
    <Box mt={3}>
      <Typography variant="h5" gutterBottom>
        Shortened URL History
      </Typography>

      {urls.length === 0 ? (
        <Typography>No URLs found.</Typography>
      ) : (
        urls.map((url, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2 }}>
            <Typography><strong>Original URL:</strong> {url.longUrl}</Typography>
            <Typography>
              <strong>Short URL:</strong>{" "}
              <Link href={url.shortUrl} target="_blank">{url.shortUrl}</Link>
            </Typography>
            <Typography><strong>Expires At:</strong> {url.expiry}</Typography>
          </Paper>
        ))
      )}
    </Box>
  );
}

export default StatsPage;
