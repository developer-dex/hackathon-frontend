/**
 * Domain-specific error classes go here.
 *
 * Example error classes:
 *
 * export class DomainError extends Error {
 *   constructor(message: string) {
 *     super(message);
 *     this.name = this.constructor.name;
 *     Object.setPrototypeOf(this, DomainError.prototype);
 *   }
 * }
 *
 * export class ValidationError extends DomainError {
 *   constructor(message: string) {
 *     super(message);
 *     Object.setPrototypeOf(this, ValidationError.prototype);
 *   }
 * }
 *
 * export class NotFoundError extends DomainError {
 *   constructor(entity: string, id: string) {
 *     super(`${entity} with id ${id} not found`);
 *     Object.setPrototypeOf(this, NotFoundError.prototype);
 *   }
 * }
 */
