import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatService } from './cat.service';
import { Cat } from './postgres/cat.entity';
import { postgresConfig } from './postgres/postgres.config';
import { seedTestData } from './postgres/seeds/test-data.seed';

describe('cat.service.ts', () => {
  let catService: CatService;
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(postgresConfig)],
      providers: [CatService],
    }).compile();

    catService = app.get<CatService>(CatService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('CatService is defined', () => {
    expect(catService).toBeDefined();
  });

  describe('getOne()', () => {
    let testCats: Cat[];
    beforeAll(async () => {
      const queryRunner =
        catService.datasource.manager.connection.createQueryRunner();
      testCats = await seedTestData(queryRunner);
      await queryRunner.release();
    });

    it('should retrieve an entity with given id', async () => {
      const subject = testCats[0];
      const queryRunner =
        catService.datasource.manager.connection.createQueryRunner();

      try {
        await queryRunner.startTransaction();

        const cat = await catService.getOne({ id: subject.id }, queryRunner);

        expect(cat).toBeDefined();
        expect(cat.name).toEqual(subject.name);
      } finally {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
    });
  });

  describe('getMany()', () => {
    let testCats: Cat[];
    beforeAll(async () => {
      const queryRunner =
        catService.datasource.manager.connection.createQueryRunner();
      testCats = await seedTestData(queryRunner);
      await queryRunner.release();
    });

    it('should retrieve full length of cats when not providing query options', async () => {
      const queryRunner =
        catService.datasource.manager.connection.createQueryRunner();

      try {
        await queryRunner.startTransaction();

        const cats = await catService.getMany({}, queryRunner);

        expect(cats).toBeDefined();
        expect(cats.length).toEqual(testCats.length);
      } finally {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
    });
  });

  describe('insertOne()', () => {
    beforeAll(async () => {
      const queryRunner =
        catService.datasource.manager.connection.createQueryRunner();
      await seedTestData(queryRunner);
      await queryRunner.release();
    });

    it('should retrieve full length of cats when not providing query options', async () => {
      const queryRunner =
        catService.datasource.manager.connection.createQueryRunner();

      try {
        await queryRunner.startTransaction();
        const options = { name: 'miauw' };

        const cat = await catService.insertOne(options);
        expect(cat).toBeDefined();
        expect(cat.name).toEqual(options.name);
      } finally {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
    });
  });
});
