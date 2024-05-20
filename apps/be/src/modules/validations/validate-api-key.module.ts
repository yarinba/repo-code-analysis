import { Module } from '@nestjs/common';
import { ValidateApiKeyController } from './validate-api-key.controller';
import { ValidateApiKeyService } from './validate-api-key.service';

@Module({
  controllers: [ValidateApiKeyController],
  providers: [ValidateApiKeyService],
})
export class ValidateApiKeyModule {}
