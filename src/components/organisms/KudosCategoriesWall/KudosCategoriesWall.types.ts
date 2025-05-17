import { ICategory } from "@/domain/entities/Kudos.types";

export interface IKudosCategoriesWallProps {
  /**
   * The list of categories to display
   */
  categories: ICategory[];

  /**
   * The title of the categories wall
   */
  title?: string;

  /**
   * Callback when a category is clicked
   */
  onCategoryClick?: (category: ICategory) => void;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Test ID for testing
   */
  "data-testid"?: string;
}
