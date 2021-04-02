import { Test, TestingModule } from '@nestjs/testing';
import { JobberService } from './jobber.service';

describe('JobberService', () => {
  let service: JobberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobberService],
    }).compile();

    service = module.get<JobberService>(JobberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
