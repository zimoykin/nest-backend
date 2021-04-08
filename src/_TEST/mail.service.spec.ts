import { Test, TestingModule } from '@nestjs/testing';
import { Mail } from '../_SERVICES/mail/mail.service';

describe('MailService', () => {
  let service: Mail;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Mail],
    }).compile();

    service = module.get<Mail>(Mail);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
