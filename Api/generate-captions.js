module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { transcript, duration } = req.body || {};
  if (!transcript || !duration) {
    res.status(400).json({ error: 'transcript and duration are required' });
    return;
  }

  if (!process.env.GEMINI_API_KEY) {
    res.status(500).json({ error: 'GEMINI_API_KEY not set on the server' });
    return;
  }

  const systemPrompt =
    'You convert a raw transcript into short-form caption segments for a vertical video, in the style of CapCut/Descript auto-captions: punchy, 3-7 words per segment, split at natural speech pauses for retention. Given the transcript and total video duration in seconds, return ONLY valid JSON (no markdown fences, no explanation) as an array of objects: [{"text": "...", "start": 0.0, "end": 1.8}, ...] where start/end are seconds spanning the full duration evenly based on segment length, covering 0 to the given duration with no gaps.';

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [
            {
              parts: [
                { text: `Transcript: ${transcript}\nTotal duration seconds: ${duration}` },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const text =
      (data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts.map((p) => p.text || '').join('\n')) ||
      '';
    const clean = text.replace(/```json|```/g, '').trim();
    const captions = JSON.parse(clean);

    res.status(200).json({ captions });
  } catch (err) {
    res.status(500).json({ error: 'Caption generation failed' });
  }
};
