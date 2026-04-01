import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as yaml from 'js-yaml';

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const yamlFile = join(process.cwd(), 'doc', 'api.yaml');
  const yamlContent = readFileSync(yamlFile, 'utf8');
  const document = yaml.load(yamlContent) as OpenAPIObject;
  SwaggerModule.setup('doc', app, document);

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
