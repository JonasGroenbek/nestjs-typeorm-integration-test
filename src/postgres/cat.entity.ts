import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'cat' })
export class Cat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;
}
