import { AppDataSource } from '../config/database';
import { Customer } from '../models/Customer';
import { EntityManager } from 'typeorm';

export class CustomerRepository {
  private repository = AppDataSource.getRepository(Customer);

  /**
   * Find a customer by ID
   */
  async findById(id: string, manager?: EntityManager): Promise<Customer | null> {
    const repo = manager ? manager.getRepository(Customer) : this.repository;
    return repo.findOne({ where: { id } });
  }

  /**
   * Find a customer by email
   */
  async findByEmail(email: string, manager?: EntityManager): Promise<Customer | null> {
    const repo = manager ? manager.getRepository(Customer) : this.repository;
    return repo.findOne({ where: { email } });
  }

  /**
   * Create a new customer
   */
  async create(data: { name: string; email: string }, manager: EntityManager): Promise<Customer> {
    const customer = manager.getRepository(Customer).create(data);
    return manager.getRepository(Customer).save(customer);
  }
}
