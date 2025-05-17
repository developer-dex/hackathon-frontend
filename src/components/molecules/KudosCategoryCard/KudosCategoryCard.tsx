import React from "react";
import styles from "./KudosCategoryCard.module.css";
import { IKudosCategoryCardProps } from "./KudosCategoryCard.types";

export const KudosCategoryCard: React.FC<IKudosCategoryCardProps> = ({
  category,
  onClick,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`${styles.categoryCard} ${className}`}
      style={{ backgroundColor: category.color }}
      onClick={onClick}
      data-testid="kudos-category-card"
      {...props}
    >
      <div className={styles.cardContent}>
        <div className={styles.iconContainer}>
          <span className={styles.icon}>{category.icon}</span>
        </div>
        <h3 className={styles.categoryName}>{category.name}</h3>
      </div>
    </div>
  );
};
