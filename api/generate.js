export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { script } = req.body;

  if (!script || script.trim().length < 10) {
    return res.status(400).json({ error: "Texto do vídeo é muito curto ou inválido." });
  }

  const output = {
    title: "Capivaras em Foco: Explorando com Drone",
    description: `Neste vídeo, acompanhamos uma família de capivaras em seu habitat natural usando drones. Exploramos seu comportamento, deslocamento e como vivem em harmonia com o ambiente.\n\nLinks úteis e vídeos recomendados:\n#fauna #drones #documentário #capivaras\n`,
    tags: "capivaras, drone, natureza, vida selvagem, fauna brasileira, vídeos de animais"
  };

  res.status(200).json(output);
}
