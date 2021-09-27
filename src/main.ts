import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as dotenv from 'dotenv'
import * as express from 'express'
import { STATIC_URL } from '@/constants/file'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(`/${STATIC_URL}`, express.static('public'))
  const config = new DocumentBuilder()
    .setTitle('Easy Service API')
    .setDescription('Easy Service API description')
    .setVersion('1.0')
    .addBearerAuth({ in: 'header', type: 'http' })
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api-docs', app, document)
  await app.listen(process.env.SERVER_PORT)
}
bootstrap()
