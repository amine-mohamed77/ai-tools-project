export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  aspectRatio: string;
  createdAt: Date;
  model: string;
}

export enum AspectRatio {
  SQUARE = "1:1",
  PORTRAIT = "3:4", // approximated for 9:16 or generic portrait
  LANDSCAPE = "16:9",
  WIDE = "4:3"
}

export enum GenerationModel {
  FAST = "gemini-2.5-flash-image",
  HD = "gemini-3-pro-image-preview"
}

export interface GenerationConfig {
  prompt: string;
  aspectRatio: AspectRatio;
  model: GenerationModel;
}