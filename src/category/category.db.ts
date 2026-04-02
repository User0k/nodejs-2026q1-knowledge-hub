import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CategoryDto } from './category.dto';

@Injectable()
export class CategoryDatabase {
  categories: Map<string, CategoryDto>;
  constructor() {
    this.categories = new Map();
  }

  getAll() {
    return [...this.categories.values()];
  }

  getOne(id: string) {
    return this.categories.get(id);
  }

  create(props: CategoryDto) {
    const id = randomUUID();
    const { description, name } = props;
    const category = {
      id,
      description,
      name,
    };

    this.categories.set(id, category);
    return category;
  }

  update(id: string, props: CategoryDto) {
    const category = this.categories.get(id);
    if (!category) return null;

    const newCategory = {
      id,
      description: props.description,
      name: props.name,
    };

    this.categories.set(id, newCategory);
    return newCategory;
  }

  delete(id: string) {
    return this.categories.delete(id);
  }
}
