import { IKudos } from "../../../domain/entities/Kudos.types";

export interface IKudosWallProps {
  /**
   * The list of kudos to display
   */
  kudosList: IKudos[];
  /**
   * The title of the kudos wall
   */
  title?: string;
  /**
   * Additional CSS class names
   */
  className?: string;
  /**
   * Test ID for testing
   */
  "data-testid"?: string;
  /**
   * Function to load more kudos
   */
  onLoadMore?: () => void;
  /**
   * Whether there are more kudos to load
   */
  hasMore?: boolean;
  /**
   * Whether kudos are currently loading
   */
  isLoading?: boolean;
  /**
   * Whether to hide the load more button
   */
  hideLoadMore?: boolean;
}
