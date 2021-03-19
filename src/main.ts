import { NestFactory } from '@nestjs/core';
import { exec } from 'child_process';
import { config } from '../ormconfig';
import { AppModule } from './app.module';


async function bootstrap() {

  //npm run start:dev -- --m
  const migrate: boolean = process.argv.length == 3 && process.argv[2] == '--m';
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  await app.listen(3000).then(() => {
    console.log('server started');
    if (migrate) {
      exec('npm run migration-generate first', (err, srdout, stderr) => {
        exec('npm run migration-run', (err) => {
          console.log(`migration done!`);
          config.migrations.map((val) => {
            exec(`rm ${val.toString().replace('{.ts,.js}', '')}`);
          });
        });
      });
    }
  });
}
bootstrap();
