import React from "react";
import styles from "./KudosCard.module.css";
import { IKudosCardProps } from "./KudosCard.types";
import {
  CKudosCategoryThemes,
  defaultKudosTheme,
} from "../../../domain/constants/kudosThemes";
import { ICategory } from "@/domain/entities/Kudos.types";
import Image from "next/image";
import { useRouter } from "next/router";

export const KudosCard: React.FC<IKudosCardProps> = ({
  kudos,
  onClick,
  className = "",
  ...props
}) => {
  const router = useRouter();

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
      const categoryName = (kudos.category as string)
        .toUpperCase()
        .replace(/ /g, "_");

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

  // Create dynamic styles
  const headerStyle = {
    backgroundColor: `${theme.textColor}10`,
    borderBottom: `1px solid ${theme.textColor}20`,
  };

  // Handle click event to navigate to user profile
  const handleCardClick = () => {
    if (onClick) {
      // Use the provided onClick handler if available
      onClick();
    } else {
      // Look for various ID formats to use for navigation
      let targetId = null;

      // Try to get the receiver ID from the receiver object (modern format)
      if (kudos.receiver && kudos.receiver.id) {
        targetId = kudos.receiver.id;
      }
      // Fall back to using the kudos ID itself if no receiver ID is available
      else if (kudos.id) {
        targetId = kudos.id;
      }

      // If we found an ID to use, navigate to that user's profile
      if (targetId) {
        router.push(`/user/${targetId}`);
      }
    }
  };

  return (
    <div
      className={`${styles.kudosCard} ${className}`}
      style={{
        backgroundColor: theme.backgroundColor,
        cursor: "default",
      }}
      {...props}
    >
      <div
        className={styles.cardTexture}
        style={{
          backgroundImage: `linear-gradient(to bottom right, ${theme.textColor}05, ${theme.textColor}10)`,
        }}
      />

      <div className={styles.cardHeader} style={headerStyle}>
        <div className={styles.categoryName} style={{ color: theme.textColor }}>
          <div className={styles.categoryIcon}>
            <Image
              src={theme.icon}
              alt={displayCategoryName}
              width={20}
              height={20}
              unoptimized
            />
          </div>
          <span>{displayCategoryName}</span>
        </div>
        <div
          className={styles.badgeContainer}
          style={{
            backgroundColor: `${theme.textColor}20`,
            border: `1px solid ${theme.textColor}30`,
          }}
        >
          <span className={styles.badgeText} style={{ color: theme.textColor }}>
            Kudos
          </span>
        </div>
      </div>
      <div
        className={styles.recipientInfo}
        onClick={handleCardClick}
        style={{ cursor: "pointer" }}
      >
        <div className={styles.avatarContainer}>
          <Image
            src={kudos.recipientAvatarUrl || "/images/default-avatar.png"}
            alt={`${kudos.recipientName}'s avatar`}
            className={styles.avatar}
            width={40}
            height={40}
            unoptimized
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
      <div className={styles.illustration} style={{ marginBottom: "2px" }}>
        <Image
          src={theme.illustration}
          alt={displayCategoryName}
          width={90}
          height={90}
          style={{ margin: "auto" }}
          unoptimized
        />
      </div>
      <div className={styles.sender}>
        <div className={styles.senderInfo}>
          {kudos.senderAvatarUrl && (
            <div className={styles.senderAvatar}>
              <Image
                src={kudos.senderAvatarUrl}
                alt={`${kudos.senderName}'s avatar`}
                className={styles.avatar}
                width={40}
                height={40}
                unoptimized
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
