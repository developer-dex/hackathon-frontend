import React from "react";
import styles from "./KudosWall.module.css";
import { IKudosWallProps } from "./KudosWall.types";
import { KudosCard } from "../../molecules/KudosCard";

export const KudosWall: React.FC<IKudosWallProps> = ({
  kudosList,
  title = "Kudos Wall",
  className = "",
  onLoadMore,
  hasMore = false,
  isLoading = false,
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

      {hasMore && (
        <div className={styles.viewMoreContainer}>
          <button
            className={styles.viewMoreButton}
            onClick={onLoadMore}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.loadingDot}></span>
                <span className={styles.loadingDot}></span>
                <span className={styles.loadingDot}></span>
                <span className={styles.loadingText}>Loading</span>
              </>
            ) : (
              "View More"
            )}
          </button>
        </div>
      )}
    </div>
  );
};
