import {
  Controller,
  HttpException,
  HttpStatus,
  Headers,
  Post,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';

import { ValidateApiKeyService } from './validate-api-key.service';

@Controller('validate-api-key')
export class ValidateApiKeyController {
  constructor(private readonly validateApiKeyService: ValidateApiKeyService) {}

  /**
   * Validates the provided OpenAI API key.
   * @param apiKey The OpenAI API key to validate.
   * @returns A message indicating whether the API key is valid.
   */
  @Post()
  async validate(
    @Headers('openai-api-key') apiKey: string,
    @Res() res: Response,
  ) {
    const isValid = await this.validateApiKeyService.validateApiKey(apiKey);

    if (!isValid) {
      throw new HttpException(
        'Invalid OpenAI API key',
        HttpStatus.UNAUTHORIZED,
      );
    }

    res.status(HttpStatus.OK).send();
  }
}
