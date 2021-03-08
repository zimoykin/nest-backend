import { NestFactory } from '@nestjs/core';
import { exec } from 'child_process';
import { config } from '../ormconfig';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000).then ( () => {
    console.log('server started')
    exec( 'npm run migration-generate first' ,  (err, srdout, stderr) => {
      exec( 'npm run migration-run', err => {
          console.log(`migration done!` )
          config.migrations.map( val => {
            exec( `rm ${val.toString().replace('{.ts,.js}', '')}` )
          })
      })
    })
  });
}
bootstrap();
