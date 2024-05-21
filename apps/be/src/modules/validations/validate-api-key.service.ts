import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class ValidateApiKeyService {
  /**
   * Validates the provided OpenAI API key.
   * @param apiKey The OpenAI API key to validate.
   * @returns A boolean indicating whether the API key is valid.
   */
  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const openai = new OpenAI({ apiKey });

      await openai.models.list();

      return true;
    } catch (error) {
      return false;
    }
  }
}
