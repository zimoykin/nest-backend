import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { Mail } from './mail.service';

const { MAIL_PORT, MAIL_HOST, MAIL_LOGIN, MAIL_PASSWORD } = process.env
/**
 *
 *
 * @export
 * @class MailModule
 */
@Module({
    imports: [ MailerModule.forRoot({
        transport: {
            host: MAIL_HOST,
            port: Number(MAIL_PORT),
            secure: true,
            auth: {
                user: MAIL_LOGIN,
                pass: MAIL_PASSWORD
            }
            
        }
    })],
    providers: [Mail]
})
export class MailModule {}
