import Anthropic from '@anthropic-ai/sdk';
import type { OcrProvider, DocumentData } from './types';

const DOCUMENT_DATA_SCHEMA = {
  type: 'object',
  properties: {
    name: { anyOf: [{ type: 'string' }, { type: 'null' }] },
    curp: { anyOf: [{ type: 'string' }, { type: 'null' }] },
    rfc: { anyOf: [{ type: 'string' }, { type: 'null' }] },
    dateOfBirth: { anyOf: [{ type: 'string' }, { type: 'null' }] },
    confidence: { type: 'number' },
    economicActivities: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          order: { type: 'number' },
          activity: { type: 'string' },
          percentage: { type: 'number' },
          startDate: { type: 'string' },
          endDate: { anyOf: [{ type: 'string' }, { type: 'null' }] },
        },
        required: ['order', 'activity', 'percentage', 'startDate', 'endDate'],
        additionalProperties: false,
      },
    },
  },
  required: ['name', 'curp', 'rfc', 'dateOfBirth', 'confidence', 'economicActivities'],
  additionalProperties: false,
} as const;

const EXTRACTION_PROMPT =
  'Extract the following fields from this document image: ' +
  'full name (name), CURP (18-character Mexican ID), RFC (Mexican tax ID), ' +
  'and date of birth (dateOfBirth in ISO 8601 format). ' +
  'Respond ONLY in JSON with fields: name, curp, rfc, dateOfBirth, confidence ' +
  '(a number from 0 to 1 reflecting your certainty), and economicActivities. ' +
  'Use null for any identity field not found in the document. ' +
  'If this is a Constancia de Situación Fiscal (CSF), extract EVERY row from the ' +
  '"Actividades Económicas" table: order (order), activity name (activity), ' +
  'percentage 0–100 (percentage), start date ISO 8601 (startDate), ' +
  'end date ISO 8601 or null (endDate). Include ALL rows. ' +
  'If there is no such table, return economicActivities as an empty array.';

export class ClaudeVisionProvider implements OcrProvider {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic();
  }

  async extractData(imageBase64: string, mimeType: string): Promise<DocumentData> {
    const response = await this.client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 1024,
      thinking: { type: 'adaptive' },
      output_config: {
        format: {
          type: 'json_schema',
          schema: DOCUMENT_DATA_SCHEMA,
        },
      },
      messages: [
        {
          role: 'user',
          content: [
            mimeType === 'application/pdf'
              ? {
                  type: 'document' as const,
                  source: {
                    type: 'base64' as const,
                    media_type: 'application/pdf' as const,
                    data: imageBase64,
                  },
                }
              : {
                  type: 'image' as const,
                  source: {
                    type: 'base64' as const,
                    media_type: mimeType as Anthropic.Base64ImageSource['media_type'],
                    data: imageBase64,
                  },
                },
            { type: 'text', text: EXTRACTION_PROMPT },
          ],
        },
      ],
    });

    for (const block of response.content) {
      if (block.type === 'text') {
        return JSON.parse(block.text) as DocumentData;
      }
    }

    throw new Error('Claude Vision returned no text content');
  }
}
