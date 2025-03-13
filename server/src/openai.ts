import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

export const createOpenAiRequest = async (text: string) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    store: true,
    messages: [
      {"role": "user", "content": `${text}, what could be the issue? Please send me 3 issues with difference category based on the probability and format the response as a JSON`},
    ],
  });

  return completion.choices[0].message.content;
};
