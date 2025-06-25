import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import OpenAI from 'openai';

config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/flirt', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Missing message in request body' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'אתה יועץ חכם וקליל שעוזר לגברים לענות לשיחות עם נשים באפליקציות דייטינג. תן תגובות יצירתיות, מצחיקות או חכמות שמתאימות להודעה שקיבלו. תן כמה אפשרויות, כל אחת בשורה חדשה.',
        },
        { role: 'user', content: message },
      ],
      temperature: 0.85,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('OpenAI error:', error);
    res.status(500).json({ error: 'Something went wrong with OpenAI API' });
  }
});

app.listen(port, () => {
  console.log(`FlirtBot Server running at http://localhost:${port}`);
});
