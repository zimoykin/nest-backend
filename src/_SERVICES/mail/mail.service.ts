import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'
import { User } from '../../_MODEL/user.entity'

@Injectable()
export class Mail {
  constructor(private readonly mailerService: MailerService) {}

  sendMail(email: string , subject: string, body: string): Promise<string> {
    return this.mailerService
      .sendMail({
        to: email,
        from: process.env.MAIL_LOGIN,
        subject: subject,
        sender: process.env.MAIL_LOGIN,
        //TODO: html form for this
        html: '<h3>Hello! Company LLC </h3>' + '<hr>' + body
      })
  }
}
