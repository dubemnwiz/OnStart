import fs from 'fs';
import path from 'path';

const faqPath = path.join(process.cwd(), 'public', 'mock-data', 'company-faq.md');
const faqText = fs.readFileSync(faqPath, 'utf-8');

export default async function handler(req, res) {
    const { question } = req.body;
    const retries = 3;
    
  
    for (let i = 0; i < retries; i++) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: `You are a helpful onboarding assistant. Use the following company FAQ data to answer questions:\n\n${faqText}` },
            { role: 'user', content: question },
          ],
          temperature: 0.5,
        }),
      });
  
      if (response.status === 429 && i < retries - 1) {
        console.warn(`Rate limited. Retrying in ${i + 1}s...`);
        await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
        continue;
      }
  
      const data = await response.json();
      return res.status(response.status).json({ answer: data.choices?.[0]?.message?.content || 'No response' });
    }
  
    res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
  }
  