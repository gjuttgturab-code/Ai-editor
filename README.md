# Video Editor MVP — Deploy Guide

## Honest note pehle
- **Vercel hosting free hai** (personal projects ke liye).
- **Google Gemini API free hai** (no credit card required) — free tier mein daily limits hain (Gemini 2.5 Flash: roughly 250 requests/day), jo testing/personal use ke liye kaafi hai. Heavy usage pe limits hit ho sakti hain, tab paid tier chahiye hoga.
- Real audio transcription (Whisper) is version mein nahi hai — abhi transcript manually paste karna padta hai. Ye agla step hai.

## Deploy karne ke steps (5-10 minutes)

1. **GitHub pe daalo**
   - github.com pe naya repo banao (e.g. `video-editor-mvp`)
   - is poore folder ka content us repo mein upload/push kar do

2. **Vercel pe account banao**
   - vercel.com pe jao, GitHub se sign in karo (free)

3. **Project import karo**
   - "Add New Project" → apna GitHub repo select karo → Import

4. **API key add karo**
   - Pehle aistudio.google.com pe jao → Google account se sign in → "Get API key" → free mein key ban jayegi (no card chahiye)
   - Vercel: Project Settings → Environment Variables
   - Name: `GEMINI_API_KEY`
   - Value: wo key jo abhi copy ki
   - Save karo

5. **Deploy dabao**
   - Vercel khud build kar k ek live URL de dega (e.g. `video-editor-mvp.vercel.app`)
   - Ye URL apne phone ke normal Chrome/Safari mein kholo — ab upload aur AI captions dono kaam karenge

## Files kya karti hain
- `index.html` — poori app (upload, trim, vertical preview, captions) — plain HTML/JS, koi build step nahi chahiye
- `api/generate-captions.js` — server-side function jo securely Gemini API call karta hai (API key browser mein kabhi expose nahi hoti)
- `package.json` — Vercel ke liye zaroori marker file

## Agla step (jab ready ho)
- Real transcription (Whisper API) jodna — audio khud-b-khud text banega
- Real video export/render (FFmpeg backend) jodna — trim/captions actual video file mein burn ho sakein
