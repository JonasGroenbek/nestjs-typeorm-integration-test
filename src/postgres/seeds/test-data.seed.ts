import { QueryRunner } from 'typeorm';
import { Cat } from '../cat.entity';

export const TEST_CATS: Partial<Cat>[] = [
  { name: 'Margot' },
  { name: 'Angel' },
  { name: 'Honey' },
  { name: 'Ellie' },
  { name: 'Gladis' },
  { name: 'Gigi' },
  { name: 'Sheba' },
  { name: 'Callie' },
];

export async function clearTestData(queryRunner: QueryRunner) {
  queryRunner.manager
    .getRepository(Cat)
    .createQueryBuilder()
    .delete()
    .where('1 = 1')
    .execute();
}

export async function seedTestData(queryRunner: QueryRunner): Promise<Cat[]> {
  await clearTestData(queryRunner);

  const catRepository = queryRunner.manager.getRepository(Cat);

  const cats = await catRepository.save(TEST_CATS);
  return cats;
}
