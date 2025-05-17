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
}
