import React, { useState } from 'react';
import {
  TextField, Button, Box, Typography, Grid, Paper
} from '@mui/material';
import { logEvent } from '../logEvent'; // We'll create this next

function ShortenerPage() {
  const [inputs, setInputs] = useState([{ longUrl: '', validity: '', shortcode: '' }]);
  const [results, setResults] = useState([]);

  const handleInputChange = (index, field, value) => {
    const newInputs = [...inputs];
    newInputs[index][field] = value;
    setInputs(newInputs);
  };

  const addNewField = () => {
    if (inputs.length < 5) {
      setInputs([...inputs, { longUrl: '', validity: '', shortcode: '' }]);
    }
  };

  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    const validResults = [];

    for (let i = 0; i < inputs.length; i++) {
      const item = inputs[i];
      const longUrl = item.longUrl.trim();
      const shortcode = item.shortcode.trim();
      const validity = item.validity ? parseInt(item.validity) : 30;

      if (!isValidURL(longUrl)) {
        alert(`Row ${i + 1}: Invalid URL`);
        await logEvent("frontend", "error", "component", `Invalid URL in row ${i + 1}`);
        continue;
      }

      if (item.validity && isNaN(validity)) {
        alert(`Row ${i + 1}: Validity must be a number`);
        await logEvent("frontend", "error", "component", `Invalid validity input in row ${i + 1}`);
        continue;
      }

      const shortCode = shortcode || Math.random().toString(36).substring(2, 7);
      const expiry = new Date(Date.now() + validity * 60000).toLocaleString();

      validResults.push({
        longUrl,
        shortUrl: `http://localhost:3000/${shortCode}`,
        expiry,
      });

      await logEvent("frontend", "info", "component", `Short URL created for row ${i + 1}`);
    }

    setResults(validResults);
    localStorage.setItem('shortUrls', JSON.stringify(validResults));
  };

  return (
    <Box mt={3}>
      <Typography variant="h5" gutterBottom>
        Shorten Your URLs (Up to 5)
      </Typography>

      {inputs.map((input, index) => (
        <Paper key={index} sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Long URL"
                fullWidth
                value={input.longUrl}
                onChange={(e) => handleInputChange(index, 'longUrl', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Validity (mins)"
                fullWidth
                value={input.validity}
                onChange={(e) => handleInputChange(index, 'validity', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Custom Shortcode (optional)"
                fullWidth
                value={input.shortcode}
                onChange={(e) => handleInputChange(index, 'shortcode', e.target.value)}
              />
            </Grid>
          </Grid>
        </Paper>
      ))}

      {inputs.length < 5 && (
        <Button variant="outlined" onClick={addNewField}>
          + Add More
        </Button>
      )}

      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>

      <Box mt={4}>
        <Typography variant="h6">Shortened URLs:</Typography>
        {results.map((res, idx) => (
          <Box key={idx} mt={1} p={2} sx={{ background: '#f0f0f0', borderRadius: '8px' }}>
            <Typography><strong>Original:</strong> {res.longUrl}</Typography>
            <Typography><strong>Short:</strong> <a href={res.shortUrl}>{res.shortUrl}</a></Typography>
            <Typography><strong>Expires at:</strong> {res.expiry}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default ShortenerPage;
