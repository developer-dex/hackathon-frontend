import React from "react";
import styles from "./KudosCard.module.css";
import { IKudosCardProps } from "./KudosCard.types";
import {
  CKudosCategoryThemes,
  defaultKudosTheme,
} from "../../../domain/constants/kudosThemes";
import { ICategory } from "@/domain/entities/Kudos.types";
import Image from "next/image";

export const KudosCard: React.FC<IKudosCardProps> = ({
  kudos,
  onClick,
  className = "",
  ...props
}) => {
  // Try to determine the theme based on category
  let theme = defaultKudosTheme;

  try {
    // If category is an object with a name property (API format)
    if (
      typeof kudos.category === "object" &&
      kudos.category !== null &&
      "name" in kudos.category
    ) {
      const categoryObj = kudos.category as ICategory;
      // Get the category name and convert to proper format for theme lookup
      const categoryName =
        typeof categoryObj.name === "string"
          ? categoryObj.name.toUpperCase().replace(/ /g, "_")
          : "";

      // Check if we have a predefined theme for this category
      if (CKudosCategoryThemes[categoryName]) {
        theme = CKudosCategoryThemes[categoryName];
      } else {
        // For categories not in our predefined themes, create a dynamic theme
        theme = {
          backgroundColor:
            categoryObj.color || defaultKudosTheme.backgroundColor,
          icon: categoryObj.icon || defaultKudosTheme.icon,
          illustration: categoryObj.icon
            ? categoryObj.icon.replace("50", "100")
            : defaultKudosTheme.illustration,
          textColor: categoryObj.color || defaultKudosTheme.textColor,
          accentColor: categoryObj.color || defaultKudosTheme.accentColor,
        };
      }
    } else if (typeof kudos.category === "string") {
      // Handle case where category might be a string
      const categoryName = kudos.category.toUpperCase().replace(/ /g, "_");

      if (CKudosCategoryThemes[categoryName]) {
        theme = CKudosCategoryThemes[categoryName];
      }
    }
  } catch (error) {
    console.error("Error determining kudos theme:", error);
    // Fallback to default theme in case of any error
  }

  // Get the display name for the category
  const displayCategoryName =
    typeof kudos.category === "object" &&
    kudos.category !== null &&
    "name" in kudos.category
      ? (kudos.category as ICategory).name
      : typeof kudos.category === "string"
      ? kudos.category
      : "Recognition";

  return (
    <div
      className={`${styles.kudosCard} ${className}`}
      style={{ backgroundColor: theme.backgroundColor }}
      onClick={onClick}
      {...props}
    >
      <div className={styles.cardHeader}>
        <div className={styles.categoryName} style={{ color: theme.textColor }}>
          <Image
            src={theme.icon}
            alt={displayCategoryName}
            className={styles.categoryIcon}
            width={20}
            height={20}
            unoptimized
          />
          {displayCategoryName}
        </div>
        <button
          className={styles.menuButton}
          style={{ color: theme.textColor }}
        >
          ⋮
        </button>
      </div>

      <div className={styles.recipientInfo}>
        <div className={styles.avatarContainer}>
          <img
            src={kudos.recipientAvatarUrl}
            alt={`${kudos.recipientName}'s avatar`}
            className={styles.avatar}
          />
        </div>
        <div className={styles.nameAndTeam}>
          <div
            className={styles.recipientName}
            style={{ color: theme.textColor }}
          >
            {kudos.recipientName}
          </div>
          <div className={styles.recipientTeam}>{kudos.recipientTeam}</div>
        </div>
      </div>

      <div className={styles.message}>{kudos.message}</div>

      <div className={styles.illustration}>
        <Image
          src={theme.illustration}
          alt={displayCategoryName}
          width={100}
          height={100}
          style={{ margin: "auto" }}
          unoptimized
        />
      </div>

      <div className={styles.sender}>
        <div className={styles.senderInfo}>
          {kudos.senderAvatarUrl && (
            <div className={styles.senderAvatar}>
              <img
                src={kudos.senderAvatarUrl}
                alt={`${kudos.senderName}'s avatar`}
                className={styles.avatar}
              />
            </div>
          )}
          <span>
            From: <span className={styles.senderName}>{kudos.senderName}</span>
          </span>
        </div>
        <div className={styles.date}>{kudos.date}</div>
      </div>
    </div>
  );
};
