import { GoogleGenAI, Chat } from "@google/genai";
import { GenerationConfig, GenerationModel } from "../types";

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Chat Session Storage
let chatSession: Chat | null = null;

export const sendMessageToChat = async (message: string): Promise<string> => {
  try {
    if (!chatSession) {
      chatSession = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: "You are 'Pixel OS', an advanced AI assistant integrated into a digital design platform. Your responses should be helpful, concise, and technically accurate. You are knowledgeable about design, photography, marketing, and code. Use a professional yet encouraging tone.",
        },
      });
    }

    const response = await chatSession.sendMessage({ message });
    return response.text || "";

  } catch (error: any) {
    console.error("Chat Error:", error);
    throw new Error(error.message || "فشل إرسال الرسالة.");
  }
};

export const resetChat = () => {
  chatSession = null;
};

export const generateImageFromPrompt = async (config: GenerationConfig): Promise<string> => {
  try {
    const { prompt, aspectRatio, model } = config;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          ...(model === GenerationModel.HD ? { imageSize: "1K" } : {})
        },
      },
    });

    return extractImageFromResponse(response);

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "حدث خطأ غير متوقع أثناء توليد الصورة.");
  }
};

export const editImage = async (base64Image: string, prompt: string): Promise<string> => {
  try {
    const { cleanBase64, mimeType } = parseBase64(base64Image);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    return extractImageFromResponse(response);

  } catch (error: any) {
    console.error("Gemini Edit Error:", error);
    throw new Error(error.message || "فشل تعديل الصورة.");
  }
};

export const blurFaces = async (base64Image: string): Promise<string> => {
  try {
    const { cleanBase64, mimeType } = parseBase64(base64Image);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          {
            text: "Identify all human faces in this image and apply a strong blur effect (pixelate or gaussian blur) to them to anonymize the people. Do not change anything else in the image, keep the background and body exactly the same. Output the image with blurred faces.",
          },
        ],
      },
    });

    return extractImageFromResponse(response);

  } catch (error: any) {
    console.error("Gemini Blur Error:", error);
    throw new Error(error.message || "فشل تمويه الوجوه.");
  }
};

export const replaceBackground = async (base64Image: string, backgroundPrompt: string): Promise<string> => {
  try {
    const { cleanBase64, mimeType } = parseBase64(base64Image);

    const fullPrompt = `Identify the main subject in the foreground and keep it exactly as it is. Replace the entire background with the following scene: ${backgroundPrompt}. Ensure realistic lighting and blending between the subject and the new background.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          {
            text: fullPrompt,
          },
        ],
      },
    });

    return extractImageFromResponse(response);

  } catch (error: any) {
    console.error("Background Replace Error:", error);
    throw new Error(error.message || "فشل تغيير الخلفية.");
  }
};

export const swapFaces = async (faceImage: string, targetImage: string): Promise<string> => {
  try {
    const faceImg = parseBase64(faceImage);
    const targetImg = parseBase64(targetImage);

    const fullPrompt = `
    Image 1 is the SOURCE FACE.
    Image 2 is the TARGET BODY/SCENE.
    
    Task: Replace the face of the person in Image 2 with the face from Image 1.
    
    Requirements:
    1. Maintain the exact lighting, skin tone match, angle, and expression of the target image (Image 2) so it looks natural.
    2. Keep the hair, body, clothing, and background of Image 2 exactly as they are.
    3. Only swap the facial features (eyes, nose, mouth, facial structure) from Image 1 onto Image 2.
    4. Output a photorealistic result.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: faceImg.cleanBase64,
              mimeType: faceImg.mimeType,
            },
          },
          {
            inlineData: {
              data: targetImg.cleanBase64,
              mimeType: targetImg.mimeType,
            },
          },
          {
            text: fullPrompt,
          },
        ],
      },
    });

    return extractImageFromResponse(response);

  } catch (error: any) {
    console.error("Face Swap Error:", error);
    throw new Error(error.message || "فشل تبديل الوجوه.");
  }
};

export const generateLogo = async (brandName: string, industry: string, style: string, colors: string): Promise<string> => {
  try {
    const prompt = `Design a professional, high-quality vector logo for a brand named "${brandName}".
    Industry/Niche: ${industry}.
    Art Style: ${style}.
    Color Palette: ${colors}.
    Requirements:
    1. The design should be clean, iconic, and memorable.
    2. Focus on a central graphic symbol or typography associated with the brand name.
    3. White or simple solid background (easy to remove later).
    4. Professional graphic design quality, suitable for business use.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    return extractImageFromResponse(response);

  } catch (error: any) {
    console.error("Logo Generation Error:", error);
    throw new Error(error.message || "فشل تصميم اللوجو.");
  }
};

export const generateBrandIdentity = async (brandName: string, description: string, theme: string, colors: string): Promise<string> => {
  try {
    const prompt = `Create a complete, professional Visual Identity Board (Brand Presentation) for a brand named "${brandName}".
    
    Brand Description: ${description}.
    Theme/Vibe: ${theme}.
    Color Palette: ${colors}.

    The image must be a flat-lay or perspective presentation board containing the following coherent elements:
    1. The Main Logo (clearly visible).
    2. Business Cards (Front and Back).
    3. Letterhead (A4 paper design).
    4. An Envelope.
    5. A realistic Mockup (e.g., a coffee mug, tote bag, or smartphone screen showing the app, depending on the industry).
    
    All elements must share the same design language, fonts, and colors. High resolution, Behance/Dribbble style presentation, professional lighting.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        }
      }
    });

    return extractImageFromResponse(response);

  } catch (error: any) {
    console.error("Brand Identity Error:", error);
    throw new Error(error.message || "فشل توليد الهوية البصرية.");
  }
};

export const generateConsistentCharacter = async (base64Reference: string, prompt: string): Promise<string> => {
  try {
    const { cleanBase64, mimeType } = parseBase64(base64Reference);

    const fullPrompt = `
    Reference Image: The provided image contains the MAIN CHARACTER.
    Task: Generate a NEW image of the EXACT SAME character in a different scenario.
    
    CRITICAL INSTRUCTIONS:
    1. KEEP THE FACE IDENTICAL: The facial features (eyes, nose, mouth, face shape, age, ethnicity) must match the reference image exactly.
    2. KEEP THE HAIR IDENTICAL: Match the hair color, style, and length.
    3. KEEP THE BODY TYPE IDENTICAL: Match the body build of the reference.
    4. NEW SCENARIO: ${prompt}
    
    Do not change the identity of the person. Only change the pose, expression (if requested), clothing (if requested), and background/environment. High quality, photorealistic consistency.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          {
            text: fullPrompt,
          },
        ],
      },
    });

    return extractImageFromResponse(response);

  } catch (error: any) {
    console.error("Consistent Character Error:", error);
    throw new Error(error.message || "فشل توليد الشخصية الثابتة.");
  }
};

export const mergeImages = async (base64Image1: string, base64Image2: string, prompt: string): Promise<string> => {
  try {
    const img1 = parseBase64(base64Image1);
    const img2 = parseBase64(base64Image2);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: img1.cleanBase64,
              mimeType: img1.mimeType,
            },
          },
          {
            inlineData: {
              data: img2.cleanBase64,
              mimeType: img2.mimeType,
            },
          },
          {
            text: prompt || "Combine these two images into a seamless artistic composition. Blend their features creatively.",
          },
        ],
      },
    });

    return extractImageFromResponse(response);

  } catch (error: any) {
    console.error("Gemini Merge Error:", error);
    throw new Error(error.message || "فشل دمج الصور.");
  }
};

export const generateMontage = async (images: string[], stylePrompt: string): Promise<string> => {
  try {
    const parts: any[] = [];
    
    // Process all images
    images.forEach(imgStr => {
      const img = parseBase64(imgStr);
      parts.push({
        inlineData: {
          data: img.cleanBase64,
          mimeType: img.mimeType,
        }
      });
    });

    // Add instruction
    parts.push({
      text: `Create a professional photo montage/collage using these provided images. 
      Style: ${stylePrompt}. 
      Arrangement: Balanced and artistic. 
      Output: A single cohesive image combining elements from all inputs.`
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1", 
        }
      }
    });

    return extractImageFromResponse(response);

  } catch (error: any) {
    console.error("Montage Error:", error);
    throw new Error(error.message || "فشل إنشاء المونتاج.");
  }
};

export const generateYouTubeThumbnail = async (title: string, subjectImage: string | null, bgImage: string | null): Promise<string> => {
  try {
    const parts: any[] = [];

    // Add prompt specifically for YouTube thumbnails
    let promptText = `Create a high-quality, clickbait-style YouTube thumbnail. 
    Aspect Ratio: 16:9.
    Title Text to display clearly: "${title}".
    Style: Vibrant, high contrast, exciting, 4k resolution.
    Composition: Rule of thirds, clear focus.`;

    if (subjectImage) {
      const img = parseBase64(subjectImage);
      parts.push({ inlineData: { data: img.cleanBase64, mimeType: img.mimeType } });
      promptText += " Include the person/subject from the provided image prominently on one side.";
    }

    if (bgImage) {
      const img = parseBase64(bgImage);
      parts.push({ inlineData: { data: img.cleanBase64, mimeType: img.mimeType } });
      promptText += " Use the provided image as the background environment.";
    } else {
      promptText += " Create a relevant, exciting background based on the title context.";
    }

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        }
      }
    });

    return extractImageFromResponse(response);

  } catch (error: any) {
    console.error("Thumbnail Generation Error:", error);
    throw new Error(error.message || "فشل إنشاء الصورة المصغرة.");
  }
};

export const generateAdPost = async (
  platform: string,
  productName: string, 
  description: string, 
  adType: string, 
  style: string, 
  price: string, 
  cta: string, 
  base64Image?: string
): Promise<string> => {
  try {
    const parts: any[] = [];
    
    // Determine aspect ratio based on platform
    let aspectRatio = "1:1"; // Default Square (Instagram/Facebook Feed)
    if (platform === 'Stories (9:16)') aspectRatio = "3:4"; // Approximation for portrait
    if (platform === 'LinkedIn/Twitter (16:9)') aspectRatio = "16:9";

    let promptText = `Design a high-conversion, professional Digital Advertisement for ${platform}.
    
    STRATEGY:
    - Ad Type: ${adType} (Adjust layout and urgency based on this).
    - Product/Service: "${productName}".
    - Offer/Message: "${description}".
    - Price/Deal: "${price}" (Make this visible and attractive, e.g. "50% OFF" or "$99").
    - Call to Action: "${cta}" (Include a button graphic or bold text like "SHOP NOW").
    - Aesthetic: ${style}.
    
    EXECUTION:
    1. Create a stunning, scroll-stopping graphic composition.
    2. Ensure professional typography and hierarchy (Headline > Product > Price > CTA).
    3. The image must look like a finished advertisement ready to post.
    `;

    if (base64Image) {
      const img = parseBase64(base64Image);
      parts.push({ inlineData: { data: img.cleanBase64, mimeType: img.mimeType } });
      promptText += " Use the provided product image as the central hero element of the design. Integrate it seamlessly into the background/layout.";
    } else {
      promptText += " Generate a realistic and attractive visualization of the product or service based on the description.";
    }

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio === "3:4" ? "3:4" : (aspectRatio === "16:9" ? "16:9" : "1:1"),
        }
      }
    });

    return extractImageFromResponse(response);

  } catch (error: any) {
    console.error("Ad Post Error:", error);
    throw new Error(error.message || "فشل إنشاء الإعلان.");
  }
};

export const generateInstagramPost = async (
  productName: string, 
  description: string, 
  adType: string, 
  style: string, 
  price: string, 
  cta: string, 
  base64Image?: string
): Promise<string> => {
    // Forward to generic ad generator with Instagram default
    return generateAdPost("Instagram", productName, description, adType, style, price, cta, base64Image);
};

export const applyStyle = async (base64Image: string, style: string): Promise<string> => {
  try {
    const { cleanBase64, mimeType } = parseBase64(base64Image);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          {
            text: `Transform this image into the following art style: ${style}. Maintain the main subject and composition but change the visual style/texture significantly to match the description.`,
          },
        ],
      },
    });

    return extractImageFromResponse(response);

  } catch (error: any) {
    console.error("Gemini Style Error:", error);
    throw new Error(error.message || "فشل تطبيق التأثير الفني.");
  }
};

// Helpers
const parseBase64 = (base64String: string) => {
  const cleanBase64 = base64String.split(',')[1]; 
  const mimeType = base64String.substring(base64String.indexOf(':') + 1, base64String.indexOf(';')) || 'image/png';
  return { cleanBase64, mimeType };
};

const extractImageFromResponse = (response: any): string => {
  const parts = response.candidates?.[0]?.content?.parts;
    
  if (!parts || parts.length === 0) {
    throw new Error("لم يتم استلام أي بيانات من النموذج.");
  }

  for (const part of parts) {
    if (part.inlineData && part.inlineData.data) {
      const base64Data = part.inlineData.data;
      const mimeType = part.inlineData.mimeType || 'image/png';
      return `data:${mimeType};base64,${base64Data}`;
    }
  }

  const textPart = parts.find((p: any) => p.text);
  if (textPart) {
    throw new Error(`خطأ في النموذج: ${textPart.text}`);
  }

  throw new Error("لم يتم العثور على صورة في استجابة النموذج.");
}