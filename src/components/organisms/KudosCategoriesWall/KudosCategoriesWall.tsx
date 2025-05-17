import React from "react";
import styles from "./KudosCategoriesWall.module.css";
import { IKudosCategoriesWallProps } from "./KudosCategoriesWall.types";
import { KudosCategoryCard } from "../../molecules/KudosCategoryCard/KudosCategoryCard";
import { ICategory } from "@/domain/entities/Kudos.types";

export const KudosCategoriesWall: React.FC<IKudosCategoriesWallProps> = ({
  categories,
  title = "Kudos Categories",
  onCategoryClick,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`${styles.categoriesWallContainer} ${className}`}
      {...props}
    >
      <h1 className={styles.title}>{title}</h1>

      <div className={styles.grid}>
        {categories.map((category: ICategory) => (
          <div key={category.id} className={styles.cardWrapper}>
            <KudosCategoryCard
              category={category}
              onClick={() => onCategoryClick && onCategoryClick(category)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
