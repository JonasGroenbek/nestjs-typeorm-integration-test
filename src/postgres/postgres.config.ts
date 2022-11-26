import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config';

export const postgresConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  schema: 'public',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  logging: false,
  synchronize: false,
  autoLoadEntities: true,
  migrations: [__dirname + '/../**/postgres/migrations/*{.ts,.js}'],
};
