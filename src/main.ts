import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { exec } from 'child_process'
import { config } from '../ormconfig'
import { AppModule } from './app.module'

async function bootstrap() {
  //npm run start:dev -- --m
  const migrate: boolean = process.argv.length == 3 && process.argv[2] == '--m'
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  //app.setGlobalPrefix('api');
  //app.useGlobalPipes(new ValidationPipe());

  const options = new DocumentBuilder()
    .setTitle('Api help')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000).then(() => {
    console.log('server started')
    if (migrate) {
      exec('npm run migration-generate first', () => {
        exec('npm run migration-run', (err) => {
          if (err) console.log(err)
          console.log(`migration done!`)
          config.migrations.map((val) => {
            exec(`rm ${val.toString().replace('{.ts,.js}', '')} -f`)
          })
        })
      })
    }
  })
}
bootstrap()
