import React from "react";
import styles from "./KudosWall.module.css";
import { IKudosWallProps } from "./KudosWall.types";
import { KudosCard } from "../../molecules/KudosCard";

export const KudosWall: React.FC<IKudosWallProps> = ({
  kudosList,
  title = "Kudos Wall",
  className = "",
  ...props
}) => {
  return (
    <div className={`${styles.kudosWallContainer} ${className}`} {...props}>
      <h1 className={styles.title}>{title}</h1>

      <div className={styles.grid}>
        {kudosList.map((kudos) => (
          <div key={kudos.id} className={styles.cardWrapper}>
            <KudosCard kudos={kudos} />
          </div>
        ))}
      </div>
    </div>
  );
};
