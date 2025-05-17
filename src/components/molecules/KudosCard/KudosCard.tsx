import React from "react";
import styles from "./KudosCard.module.css";
import { IKudosCardProps } from "./KudosCard.types";
import { CKudosCategoryThemes } from "../../../domain/constants/kudosThemes";

export const KudosCard: React.FC<IKudosCardProps> = ({
  kudos,
  onClick,
  className = "",
  ...props
}) => {
  const theme = CKudosCategoryThemes[kudos.category];

  return (
    <div
      className={`${styles.kudosCard} ${className}`}
      style={{ backgroundColor: theme.backgroundColor }}
      onClick={onClick}
      {...props}
    >
      <div className={styles.cardHeader}>
        <div className={styles.categoryName}>
          <span className={styles.categoryIcon}>{theme.icon}</span>
          {kudos.category}
        </div>
        <button className={styles.menuButton}>⋮</button>
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
          <div className={styles.recipientName}>{kudos.recipientName}</div>
          <div className={styles.recipientTeam}>{kudos.recipientTeam}</div>
        </div>
      </div>

      <div className={styles.message}>{kudos.message}</div>

      <div className={styles.illustration}>{theme.illustration}</div>

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
