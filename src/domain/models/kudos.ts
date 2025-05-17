/**
 * Represents a kudos category in the system
 */
export interface ICategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  iconUrl?: string;
  color?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
