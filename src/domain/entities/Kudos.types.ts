export enum EKudosCategory {
  WellDone = "Well Done",
  GreatTeamwork = "Great Teamwork",
  ProudOfYou = "Proud of You",
  OutstandingAchievement = "Outstanding Achievement",
  BrilliantIdea = "Brilliant Idea",
  AmazingSupport = "Amazing Support",
  COLLABORATION = "COLLABORATION",
}

export interface IUser {
  id: string;
  name: string;
  teamId?: string;
}

export interface ICategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface ITeam {
  id: string;
  name: string;
}

export interface IKudos {
  id: string;
  sender: IUser;
  receiver: IUser;
  category: ICategory;
  team: ITeam;
  message: string;
  createdAt: string;

  // Legacy fields for backward compatibility with existing components
  recipientName?: string;
  recipientTeam?: string;
  recipientAvatarUrl?: string;
  senderName?: string;
  senderAvatarUrl?: string;
  date?: string;
}

export type TKudosTheme = {
  backgroundColor: string;
  icon: string;
  illustration: string;
};

export interface IKudosApiResponse {
  success: boolean;
  data: IKudos[];
  message: string;
  pagination: {
    total: number;
    offset: number;
    limit: number;
  };
}
