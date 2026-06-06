/**
 * Utility methods for resource service classes
 */
export class BaseService {
  protected getSerializedEntity(entity: any) {
    return entity.serialize ? entity.serialize() : entity;
  }
}
