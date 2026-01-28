
import { GoogleGenAI, Type } from "@google/genai";
import { ProductData, GenerationResult, ImageData, ImageGenerationResult } from "../types";

export const generateCopy = async (data: ProductData): Promise<GenerationResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    Você é um especialista sênior em copywriting para e-commerce, SEO e conversão.
    Seu objetivo é criar descrições de produto profissionais, claras, completas e otimizadas para o marketplace escolhido.
    
    Regras Gerais:
    - Gere uma descrição premium.
    - Use linguagem comercial e objetiva.
    - Destaque benefícios antes de características técnicas.
    - Utilize palavras-chave relevantes da categoria.
    - Não invente informações.
    - Estruture para fácil leitura (use parágrafos ou listas).
    - NÃO USE EMOJIS.
    
    Regras por Marketplace:
    - Mercado Livre: Foco em clareza, blocos bem definidos, descrição pode ser longa. Título curto e direto.
    - Shopee: Linguagem direta, uso de tópicos e listas, benefícios rápidos.
    - TikTok Shops: Texto curto, linguagem simples e persuasiva, foco em uso visual e diferenciais.
  `;

  const prompt = `
    Marketplace alvo: ${data.marketplace}
    Nome do produto: ${data.productName}
    Categoria: ${data.category}
    Subcategoria: ${data.subcategory}
    Ficha técnica: ${data.technicalSpecs}
    Uso indicado: ${data.indicatedUse}
    Diferenciais: ${data.differentials}
    Observações: ${data.additionalObservations}

    Gere o resultado em formato JSON com as chaves "title" e "description".
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Título otimizado do anúncio" },
            description: { type: Type.STRING, description: "Descrição completa do produto" }
          },
          required: ["title", "description"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
      title: result.title || "Título indisponível",
      description: result.description || "Descrição indisponível"
    };
  } catch (error) {
    console.error("Erro ao gerar cópia:", error);
    throw new Error("Falha na comunicação com o especialista de IA.");
  }
};

export const generateProductImage = async (data: ImageData): Promise<ImageGenerationResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let prompt = "";
  let parts: any[] = [];

  if (data.sourceImage) {
    // Mode: Background Replacement (Image-to-Image)
    // We need to be extremely explicit about discarding the original background.
    prompt = `
      INSTRUCTIONS FOR IMAGE EDITING (ENVIRONMENT SWAP):
      1. IDENTIFY the product in the center of the provided image.
      2. PRESERVE the product's exact shape, design, color, and texture. It must remain the same product.
      3. COMPLETELY REMOVE AND DISCARD the entire original background, lighting, and floor from the input image.
      4. RE-RENDER the product into a NEW, HIGH-QUALITY environment: ${data.scenario}.
      5. PRODUCT DETAILS FOR FIDELITY: ${data.visualDescription}.
      6. CATEGORY: ${data.category}.
      7. STYLE: Professional studio product photography, commercial lighting, 8k resolution, clean and sharp.
      
      CRITICAL: The final image MUST show the product in a totally different setting than the original. Do not keep any part of the original room or background.
    `;
    
    const base64Data = data.sourceImage.split(',')[1];
    const mimeType = data.sourceImage.split(',')[0].split(':')[1].split(';')[0];

    parts = [
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      },
      { text: prompt }
    ];
  } else {
    // Mode: Generation from Scratch
    prompt = `
      Professional e-commerce product photography. 
      Product: ${data.visualDescription}. 
      Category: ${data.category}. 
      Scenario: ${data.scenario}. 
      Style: High definition, balanced natural lighting, commercial quality, premium appearance, clean harmonious background. 
      Focal point is the product. No text, no logos.
    `;
    parts = [{ text: prompt }];
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return {
          imageUrl: `data:image/png;base64,${part.inlineData.data}`
        };
      }
    }
    
    throw new Error("Nenhuma imagem foi gerada.");
  } catch (error) {
    console.error("Erro ao gerar imagem:", error);
    throw new Error("Falha ao gerar a imagem do produto.");
  }
};

export const analyzeProductImage = async (imageUri: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const base64Data = imageUri.split(',')[1];
  const mimeType = imageUri.split(',')[0].split(':')[1].split(';')[0];

  const prompt = `
    Analise esta imagem de produto e extraia seu "DNA Visual Técnico" para um Master Prompt de alta fidelidade.
    
    O seu objetivo é criar um texto que descreva o produto de forma tão completa que ele possa ser "re-imaginado" pela IA em um cenário totalmente novo, mantendo a identidade do objeto original mas ignorando completamente o cenário atual.
    
    REGRAS PARA O MASTER PROMPT:
    1. Descreva o produto como um objeto ISOLADO (ignore o fundo).
    2. Identifique materiais exatos (ex: fibra de carbono real, tecido oxford 600D, plástico ABS fosco).
    3. Descreva a volumetria e silhueta (ex: curvas ergonômicas, bordas chanfradas).
    4. Detalhe a iluminação ideal que realça suas texturas.
    5. Não mencione o cenário da imagem atual.
    
    Saída: Um parágrafo único, rico em adjetivos técnicos, começando diretamente com a descrição do produto.
    Linguagem: Português (Brasil).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType: mimeType } },
          { text: prompt }
        ]
      }
    });

    return response.text || "Não foi possível analisar a imagem.";
  } catch (error) {
    console.error("Erro ao analisar imagem:", error);
    throw new Error("Falha ao analisar a imagem do produto.");
  }
};
