import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { script } = req.body;

  if (!script || script.trim().length < 10) {
    return res.status(400).json({ error: "Texto do vídeo é muito curto ou inválido." });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Você é um assistente especializado em YouTube. Gere um título atrativo, uma descrição otimizada para SEO e uma lista de tags com base no script do vídeo fornecido. O idioma deve corresponder ao idioma do script. O resultado deve ser um JSON com as chaves: title, description, tags (lista separada por vírgula).",
        },
        {
          role: "user",
          content: script,
        }
      ],
      temperature: 0.7,
      max_tokens: 600,
    });

    const responseText = completion.data.choices[0].message.content;
    const [title, description, tags] = responseText.split("###");

    res.status(200).json({
      title: title?.trim() || "Título não gerado",
      description: description?.trim() || "Descrição não gerada",
      tags: tags?.trim() || "tags não geradas",
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao gerar conteúdo", detail: error.message });
  }
}