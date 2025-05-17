export enum EKudosCategory {
  WellDone = "Well Done",
  GreatTeamwork = "Great Teamwork",
  ProudOfYou = "Proud of You",
  OutstandingAchievement = "Outstanding Achievement",
  BrilliantIdea = "Brilliant Idea",
  AmazingSupport = "Amazing Support",
}

export interface IKudos {
  id: string;
  recipientName: string;
  recipientTeam: string;
  recipientAvatarUrl: string;
  category: EKudosCategory;
  message: string;
  senderName: string;
  senderAvatarUrl?: string;
  date: string;
}

export type TKudosTheme = {
  backgroundColor: string;
  icon: string;
  illustration: string;
};
