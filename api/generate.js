import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { script, category = "geral", platform = "YouTube", languages = ["pt"] } = req.body;

  if (!script || script.trim().length < 10) {
    return res.status(400).json({ error: "Texto do vídeo é muito curto ou inválido." });
  }

  const prompt = `
Você é um especialista em criação de conteúdo para redes sociais. 
Baseado no seguinte roteiro de vídeo:
"${script}"

Gere um conjunto completo de sugestões para o conteúdo, com base nos seguintes parâmetros:
Categoria: ${category}
Plataforma: ${platform}

Para cada idioma solicitado, gere:
1. Um título cativante (máximo de 100 caracteres)
2. Uma descrição completa otimizada para SEO, com espaço ao final para links e vídeos recomendados
3. Uma lista de tags separadas por vírgula, com no máximo 500 caracteres

Idiomas solicitados: ${languages.join(", ")}

Responda no seguinte formato JSON:
{
  "pt": { "title": "...", "description": "...", "tags": "..." },
  "en": { "title": "...", "description": "...", "tags": "..." },
  "es": { "title": "...", "description": "...", "tags": "..." },
  "fr": { "title": "...", "description": "...", "tags": "..." }
}
Inclua apenas os idiomas que foram solicitados.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8
    });

    const rawResponse = completion.choices[0].message.content;

    // Tenta fazer parse seguro
    const parsedOutput = JSON.parse(rawResponse);

    return res.status(200).json(parsedOutput);
  } catch (err) {
    console.error("Erro ao gerar conteúdo:", err);
    return res.status(500).json({ error: "Erro interno ao gerar conteúdo" });
  }
}

