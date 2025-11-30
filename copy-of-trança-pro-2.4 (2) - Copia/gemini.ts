
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

const getAiClient = () => {
  if (!apiKey || apiKey === '') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// Mock responses enhanced for context and personality
const getMockResponse = (type: 'text' | 'image', prompt: string) => {
    const isFormal = prompt.includes("linguagem formal");
    const isMentor = prompt.includes("mentora sábia");
    const lowerPrompt = prompt.toLowerCase();

    if (type === 'image') {
        if (prompt.includes("Box Braids")) {
             return isFormal 
             ? "**Análise Técnica Profissional:**\n\n1. **Divisão (Parting):** As divisões apresentam simetria adequada, o que é fundamental para a distribuição de peso.\n2. **Tensão:** A tensão na raiz parece controlada, evitando alopecia por tração.\n3. **Acabamento:** O 'tucking' (esconder o cabelo natural) foi bem executado.\n\n**Recomendação:** Atenção à quantidade de pomada para evitar resíduos futuros."
             : "**Análise da Zuri:**\n\n1. **Divisão:** Tá bem limpinha, gata! Esses quadradinhos estão show.\n2. **Tensão:** Parece confortável, nada de puxar o cérebro da cliente, hein?\n3. **Acabamento:** O baby hair tá um charme.\n\n**Dica:** Cuidado só com o excesso de gel pra não esbranquiçar depois!";
        }
        return "**Análise Geral:**\n\nA iluminação da foto está ótima para portfólio. As divisões parecem limpas. Para uma análise mais específica, certifique-se de selecionar o tipo de trança no menu anterior.";
    }
    
    // Text Responses
    if (lowerPrompt.includes("preço") || lowerPrompt.includes("cobrar")) {
        if (isFormal) return "Para a precificação correta, recomendo utilizar a fórmula: (Custo Fixo + Custo Variável + Mão de Obra) / Margem de Lucro. No aplicativo, utilize a aba 'Calculadora' para obter um valor exato baseado na sua região.";
        if (isMentor) return "Cobrar o valor justo é um ato de amor próprio, minha querida. Lembre-se de quanto tempo você estudou. Não tenha medo de valorizar sua arte. Use nossa calculadora para ter segurança.";
        return "Mana, precificação é sério! Não chuta valor não. Pega o custo do jumbo, seu tempo e bota seu lucro. Corre na nossa Calculadora que ela faz a conta certinha pra você não pagar pra trabalhar!";
    }

    if (lowerPrompt.includes("instagram") || lowerPrompt.includes("post") || lowerPrompt.includes("marketing")) {
        return "Dica de ouro: Poste fotos do processo (bastidores) nos stories e o resultado final no feed. Use hashtags locais como #trancista[SuaCidade]. A constância é o segredo!";
    }

    if (lowerPrompt.includes("agenda") || lowerPrompt.includes("organizar")) {
        return "Utilize a aba Agenda aqui do app. Manter tudo centralizado evita furos e passa muito mais profissionalismo para a cliente.";
    }

    // Default Greeting/Fallback
    if (isFormal) return "Compreendo sua solicitação. Como assistente virtual especializada em gestão para trancistas, estou à disposição para auxiliar em estratégias de negócio, técnicas ou dúvidas operacionais. Como posso prosseguir?";
    if (isMentor) return "Estou aqui para segurar sua mão nessa jornada. O empreendedorismo é desafiador, mas você tem um dom incrível. Respire fundo e me diga: o que está tirando seu sono hoje?";
    return "E aí, maravilhosa! Tô pronta. Manda sua dúvida sobre tranças, perrengues com cliente ou o que postar hoje. Sou toda ouvidos!";
};

export const generateText = async (prompt: string, modelName: string = 'gemini-2.5-flash'): Promise<string> => {
  const ai = getAiClient();
  
  // Simulate delay for realism
  await new Promise(resolve => setTimeout(resolve, 1500));

  if (!ai) {
    return getMockResponse('text', prompt);
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });
    return response.text || "Não foi possível gerar uma resposta.";
  } catch (error) {
    console.error("Gemini Error:", error);
    // Fallback to mock if API fails
    return getMockResponse('text', prompt);
  }
};

export const analyzeImage = async (base64Image: string, prompt: string): Promise<string> => {
    const ai = getAiClient();
    
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (!ai) {
       return getMockResponse('image', prompt);
    }
  
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
                { text: prompt }
            ]
        }
      });
      return response.text || "Não foi possível analisar a imagem.";
    } catch (error) {
      console.error("Gemini Vision Error:", error);
      return getMockResponse('image', prompt);
    }
};
