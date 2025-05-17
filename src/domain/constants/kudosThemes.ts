import { EKudosCategory, TKudosTheme } from "../entities/Kudos.types";

export const CKudosCategoryThemes: Record<EKudosCategory, TKudosTheme> = {
  [EKudosCategory.WellDone]: {
    backgroundColor: "#F4ECFF",
    icon: "⭐",
    illustration: "🏆",
  },
  [EKudosCategory.GreatTeamwork]: {
    backgroundColor: "#ECF4FF",
    icon: "👥",
    illustration: "🤝",
  },
  [EKudosCategory.ProudOfYou]: {
    backgroundColor: "#ECFFF1",
    icon: "💚",
    illustration: "🏅",
  },
  [EKudosCategory.OutstandingAchievement]: {
    backgroundColor: "#FFECEC",
    icon: "🔥",
    illustration: "🚀",
  },
  [EKudosCategory.BrilliantIdea]: {
    backgroundColor: "#FFF8EC",
    icon: "💡",
    illustration: "✨",
  },
  [EKudosCategory.AmazingSupport]: {
    backgroundColor: "#ECFAFF",
    icon: "🛟",
    illustration: "🛠️",
  },
};
