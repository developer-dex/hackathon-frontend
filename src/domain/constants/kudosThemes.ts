// Define the type for kudos themes
export type TKudosTheme = {
  backgroundColor: string;
  icon: string;
  illustration: string;
  textColor?: string;
  accentColor?: string;
};

// Modern color themes for kudos cards
export const CKudosCategoryThemes: Record<string, TKudosTheme> = {
  // Purple theme for Well Done / Excellence
  EXCELLENCE: {
    backgroundColor: "#f1ebff",
    icon: "https://img.icons8.com/ios-filled/50/6c5ce7/star.png",
    illustration: "https://img.icons8.com/ios-filled/100/6c5ce7/trophy.png",
    textColor: "#6c5ce7",
    accentColor: "#6c5ce7",
  },

  // Blue theme for Teamwork
  TEAMWORK: {
    backgroundColor: "#e8f4ff",
    icon: "https://img.icons8.com/ios-filled/50/3498db/group-task.png",
    illustration:
      "https://img.icons8.com/ios-filled/100/3498db/user-group-man-man.png",
    textColor: "#3498db",
    accentColor: "#3498db",
  },

  // Green/Mint theme for Helpfulness / Support
  HELPFULNESS: {
    backgroundColor: "#e8fff1",
    icon: "https://img.icons8.com/ios-filled/50/2ecc71/helping-hand.png",
    illustration: "https://img.icons8.com/ios-filled/100/2ecc71/lifebuoy.png",
    textColor: "#2ecc71",
    accentColor: "#2ecc71",
  },

  // Red theme for Outstanding Achievement / Leadership
  LEADERSHIP: {
    backgroundColor: "#ffebeb",
    icon: "https://img.icons8.com/ios-filled/50/e74c3c/medal.png",
    illustration: "https://img.icons8.com/ios-filled/100/e74c3c/rocket.png",
    textColor: "#e74c3c",
    accentColor: "#e74c3c",
  },

  // Amber/Yellow theme for Innovation / Brilliant Idea
  INNOVATION: {
    backgroundColor: "#fffaeb",
    icon: "https://img.icons8.com/ios-filled/50/f1c40f/idea.png",
    illustration: "https://img.icons8.com/ios-filled/100/f1c40f/light-on.png",
    textColor: "#f1c40f",
    accentColor: "#f1c40f",
  },

  // Teal theme for Mentorship
  MENTORSHIP: {
    backgroundColor: "#e8fffa",
    icon: "https://img.icons8.com/ios-filled/50/1abc9c/training.png",
    illustration:
      "https://img.icons8.com/ios-filled/100/1abc9c/graduation-cap.png",
    textColor: "#1abc9c",
    accentColor: "#1abc9c",
  },

  // Orange theme for Problem Solving
  PROBLEM_SOLVING: {
    backgroundColor: "#fff0e8",
    icon: "https://img.icons8.com/ios-filled/50/e67e22/puzzle.png",
    illustration: "https://img.icons8.com/ios-filled/100/e67e22/jigsaw.png",
    textColor: "#e67e22",
    accentColor: "#e67e22",
  },

  // Purple/Violet theme for Initiative
  INITIATIVE: {
    backgroundColor: "#f4e8ff",
    icon: "https://img.icons8.com/ios-filled/50/9b59b6/flag.png",
    illustration:
      "https://img.icons8.com/ios-filled/100/9b59b6/finish-flag.png",
    textColor: "#9b59b6",
    accentColor: "#9b59b6",
  },

  // Intense Green theme for Dedication
  DEDICATION: {
    backgroundColor: "#e8ffe8",
    icon: "https://img.icons8.com/ios-filled/50/27ae60/fire-element.png",
    illustration: "https://img.icons8.com/ios-filled/100/27ae60/target.png",
    textColor: "#27ae60",
    accentColor: "#27ae60",
  },

  // Turquoise theme for Communication
  COMMUNICATION: {
    backgroundColor: "#e8ffff",
    icon: "https://img.icons8.com/ios-filled/50/00bcd4/comments.png",
    illustration: "https://img.icons8.com/ios-filled/100/00bcd4/chat.png",
    textColor: "#00bcd4",
    accentColor: "#00bcd4",
  },
};

// Fallback theme if no matching category is found
export const defaultKudosTheme: TKudosTheme = {
  backgroundColor: "#f5f5f5",
  icon: "https://img.icons8.com/ios-filled/50/666666/star.png",
  illustration: "https://img.icons8.com/ios-filled/100/666666/star.png",
  textColor: "#666666",
  accentColor: "#666666",
};
