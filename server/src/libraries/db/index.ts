import { DataSource } from 'typeorm';
import { Product } from '../../domains/product/schema';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'mydatabase.sqlite', // You can change the database name
  synchronize: true, // This will create the database and tables automatically
  logging: false,
  entities: [Product],
});
