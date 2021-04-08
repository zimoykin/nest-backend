import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'
import { User } from '../../_MODEL/user.entity'

@Injectable()
export class Mail {
  constructor(private readonly mailerService: MailerService) {}

  sendMail(user: User, subject: string, body: string) {
    this.mailerService
      .sendMail({
        to: user.email,
        from: process.env.MAIL_LOGIN,
        subject: subject,
        sender: process.env.MAIL_LOGIN,
        //TODO: html form for this
        html: '<h3>Hello! Company LLC </h3>' + '<hr>' + body
      })
      .then(() => {
        console.log('success')
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
