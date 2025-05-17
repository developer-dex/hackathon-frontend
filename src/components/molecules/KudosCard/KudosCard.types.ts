import { IKudos } from "../../../domain/entities/Kudos.types";

export interface IKudosCardProps {
  /**
   * The kudos data to display
   */
  kudos: IKudos;
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
