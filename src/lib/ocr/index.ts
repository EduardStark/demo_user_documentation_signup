import type { OcrProvider } from './types';
import { ClaudeVisionProvider } from './claudeVisionProvider';
import { GeminiVisionProvider } from './geminiVisionProvider';

export function getOcrProvider(): OcrProvider {
  const provider = process.env.OCR_PROVIDER ?? 'claude';

  switch (provider) {
    case 'claude':
      return new ClaudeVisionProvider();
    case 'gemini':
      return new GeminiVisionProvider();
    default:
      throw new Error(`Unknown OCR_PROVIDER: "${provider}"`);
  }
}

export type { OcrProvider, DocumentData, EconomicActivity } from './types';
