import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  DataSource,
  DeepPartial,
  InsertQueryBuilder,
  QueryRunner,
  SelectQueryBuilder,
} from 'typeorm';
import { SelectQuery } from 'typeorm/query-builder/SelectQuery';
import { Cat } from './postgres/cat.entity';

interface SelectQueryOptions {
  id?: number;
  name?: string;
  limit?: number;
  offset?: number;
}

type InsertQueryOptions = Omit<Cat, 'id'>;

@Injectable()
export class CatService {
  constructor(@InjectDataSource() public readonly datasource: DataSource) {}

  async getOne(
    options: Omit<SelectQueryOptions, 'limit' | 'offest'>,
    queryRunner?: QueryRunner,
  ) {
    const selectQuery = this.getSelectQuery(options, queryRunner);
    const cat = await selectQuery.getOne();
    return cat;
  }

  async getMany(
    options: Omit<SelectQueryOptions, 'id'>,
    queryRunner?: QueryRunner,
  ) {
    const selectQuery = this.getSelectQuery(options, queryRunner);
    const cats = await selectQuery.getMany();
    return cats;
  }

  async insertOne(options: InsertQueryOptions, queryRunner?: QueryRunner) {
    const insertQuery = this.getInsertQuery(options, queryRunner);
    const result = await insertQuery.execute();
    const cat = this.datasource.manager
      .getRepository(Cat)
      .create(result.raw[0] as DeepPartial<Cat>);

    return cat;
  }

  getInsertQuery(
    options: InsertQueryOptions,
    queryRunner?: QueryRunner,
  ): InsertQueryBuilder<Cat> {
    let insertQueryBuilder: InsertQueryBuilder<Cat>;

    if (queryRunner) {
      insertQueryBuilder = queryRunner.manager
        .getRepository(Cat)
        .createQueryBuilder('cat')
        .insert();
    } else {
      insertQueryBuilder = this.datasource.manager
        .getRepository(Cat)
        .createQueryBuilder('cat')
        .insert();
    }

    insertQueryBuilder.values(options);

    insertQueryBuilder.returning('*');

    return insertQueryBuilder;
  }

  getSelectQuery(
    options: SelectQueryOptions,
    queryRunner?: QueryRunner,
  ): SelectQueryBuilder<Cat> {
    let selectQueryBuilder: SelectQueryBuilder<Cat>;

    if (queryRunner) {
      selectQueryBuilder = queryRunner.manager
        .getRepository(Cat)
        .createQueryBuilder('cat')
        .select();
    } else {
      selectQueryBuilder = this.datasource.manager
        .getRepository(Cat)
        .createQueryBuilder('cat')
        .select();
    }

    if (options.id) {
      selectQueryBuilder.where('cat.id = :id', { id: options.id });
    }

    if (options.name) {
      selectQueryBuilder.andWhere('cat.name = :name', { name: options.name });
    }

    if (options.offset) {
      selectQueryBuilder.skip(options.offset);
    }

    if (options.limit) {
      selectQueryBuilder.take(options.limit);
    }

    return selectQueryBuilder;
  }
}
