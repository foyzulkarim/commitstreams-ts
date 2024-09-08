import { Product } from './schema';
import { AppDataSource } from '../../libraries/db';

const model = 'product';

export const create = async (data: Product) => {
  try {
    const repository = AppDataSource.getRepository(Product);
    const item = repository.create(data);
    const saved = await repository.save(item);
    console.log(`create(): ${model} created`, { id: saved.id });
    return saved;
  } catch (error) {
    console.log(`create(): Failed to create ${model}`, error);
    throw new Error(`Failed to create ${model}`); // Adjust HTTP status as necessary
  }
};

export const search = async (query: { keyword: string }) => {
  try {
    const repository = AppDataSource.getRepository(Product);
    const { keyword } = query ?? {};
    let filter: any = {};
    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }
    const items = await repository.find(filter);
    console.log('search(): filter and count', { filter, count: items.length });
    return items;
  } catch (error) {
    console.log(`search(): Failed to search ${model}`, error);
    throw new Error(`Failed to search ${model}`); // Adjust HTTP status as necessary
  }
};

export const getById = async (id: number) => {
  try {
    const repository = AppDataSource.getRepository(Product);
    const item = await repository.findOne({
      where: {
        id,
      },
    });
    if (!item) {
      throw new Error(`${model} not found`);
    }
    console.log(`getById(): ${model} fetched`, { id });
    return item;
  } catch (error) {
    console.log(`getById(): Failed to get ${model}`, error);
    throw new Error(`Failed to get ${model}`); // Adjust HTTP status as necessary
  }
};
