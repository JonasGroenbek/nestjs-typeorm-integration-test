import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatService } from './cat.service';
import { postgresConfig } from './postgres/postgres.config';

@Module({
  imports: [TypeOrmModule.forRoot(postgresConfig)],
  providers: [CatService],
})
export class AppModule {}
