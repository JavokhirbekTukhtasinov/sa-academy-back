import { Test, TestingModule } from '@nestjs/testing';
import { LecturesResolver } from './lectures.resolver';
import { LecturesService } from './lectures.service';

describe('LecturesResolver', () => {
  let resolver: LecturesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LecturesResolver, LecturesService],
    }).compile();

    resolver = module.get<LecturesResolver>(LecturesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
