import { ICategory } from "@/domain/entities/Kudos.types";

export interface IKudosCategoryCardProps {
  /**
   * Category data to display
   */
  category: ICategory;

  /**
   * Optional click handler
   */
  onClick?: () => void;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Test ID for testing
   */
  "data-testid"?: string;
}
