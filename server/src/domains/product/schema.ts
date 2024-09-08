import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description: string = '';

  @Column({ type: 'float', nullable: false })
  price: number = 0;

  @Column({ type: 'boolean', default: true })
  inStock: boolean = true;

  // default value as now
  @CreateDateColumn()
  createdAt!: Date | null;

  @UpdateDateColumn()
  updatedAt!: Date;
}

export type PersonData = {
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: Date;
};
