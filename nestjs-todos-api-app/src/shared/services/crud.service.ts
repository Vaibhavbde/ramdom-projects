import { Repository } from 'typeorm';
import { BaseService } from 'src/shared/services/base.service';

/**
 * Offers base CRUD functionality for any service class inherits it
 * @example class CatsService extends CrudService {}
 */
export class CrudService extends BaseService {
  protected repository: any;

  constructor(
    repository: Repository<any>,
  ) {
    super();
    this.repository = repository;
  }

  async getAll(whereConditions: any = {}): Promise<any[]> {
    const where = {
      deleted: false,
      ...whereConditions,
    };
    const collection = await this.repository.find({ where });
    return collection.map(entity => this.getSerializedEntity(entity));
  }

  async create(data: any): Promise<any> {
    const item = await this.repository.create({ ...data });
    await this.repository.save(item);
    return item;
  }

  async getOne(id: number): Promise<any> {
    return await this.repository.findOneOrFail({ where: { id, deleted: false } });
  }

  async update(id: number, data: any): Promise<any> {
    await this.repository.findOneOrFail({ where: { id, deleted: false } });
    await this.repository.update(id, data);
    return await this.repository.findOne(id);
  }

  async softDelete(id: number): Promise<any> {
    await this.repository.findOneOrFail({ where: { id } });
    await this.update(id, { deleted: true });
    return;
  }

  async destroy(id: number): Promise<any> {
    await this.repository.findOneOrFail({ where: { id } });
    await this.repository.delete(id);
    return;
  }
}
