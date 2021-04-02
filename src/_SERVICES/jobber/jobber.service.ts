import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { BehaviorSubject } from 'rxjs'

@Injectable()
//https://github.com/nestjs/schedule/blob/master/lib/enums/cron-expression.enum.ts
export class JobberService {
  list$ = new BehaviorSubject<string[]>([])

  @Cron('0 */5 * * * *')
  //TODO EMAIL NOTIFY + '0 0-23/2 * * *'
  doSomethingEvery5minutes() {
    const date: string = new Date().getHours() + ':' + new Date().getMinutes()
    console.log(date + ' - ' + this.list$.getValue().length)
    const currentlist = this.list$.getValue()
    console.log(currentlist, {})
    currentlist.push(date)
    this.list$.next(currentlist)
  }
}
