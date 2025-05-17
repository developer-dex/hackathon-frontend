import { EKudosCategory, IKudos } from "../entities/Kudos.types";

export const CKudosMockData: IKudos[] = [
  {
    id: "1",
    recipientName: "Sarah Chen",
    recipientTeam: "Marketing Team",
    recipientAvatarUrl: "https://i.pravatar.cc/150?img=1",
    category: EKudosCategory.WellDone,
    message:
      "Outstanding work on the Q1 campaign! Your creative direction and attention to detail made all the difference. Thank you for your dedication!",
    senderName: "Michael Thompson",
    senderAvatarUrl: "https://i.pravatar.cc/150?img=11",
    date: "Mar 15, 2025",
  },
  {
    id: "2",
    recipientName: "David Kumar",
    recipientTeam: "Engineering Team",
    recipientAvatarUrl: "https://i.pravatar.cc/150?img=2",
    category: EKudosCategory.GreatTeamwork,
    message:
      "Incredible job debugging the production issue! Your quick thinking and problem-solving skills saved us hours of downtime. You're a true asset to the team!",
    senderName: "Emily Rodriguez",
    senderAvatarUrl: "https://i.pravatar.cc/150?img=12",
    date: "Mar 14, 2025",
  },
  {
    id: "3",
    recipientName: "Lisa Park",
    recipientTeam: "Sales Team",
    recipientAvatarUrl: "https://i.pravatar.cc/150?img=3",
    category: EKudosCategory.ProudOfYou,
    message:
      "Phenomenal work closing the enterprise deal! Your persistence and relationship-building skills are truly impressive. Congratulations on this huge win!",
    senderName: "James Wilson",
    senderAvatarUrl: "https://i.pravatar.cc/150?img=13",
    date: "Mar 13, 2025",
  },
  {
    id: "4",
    recipientName: "Rachel Green",
    recipientTeam: "Product Team",
    recipientAvatarUrl: "https://i.pravatar.cc/150?img=4",
    category: EKudosCategory.OutstandingAchievement,
    message:
      "Your leadership in the product launch was exceptional! The way you handled the challenges and kept the team motivated was truly inspiring.",
    senderName: "Alex Martinez",
    senderAvatarUrl: "https://i.pravatar.cc/150?img=14",
    date: "Mar 12, 2025",
  },
  {
    id: "5",
    recipientName: "Tom Anderson",
    recipientTeam: "Innovation Team",
    recipientAvatarUrl: "https://i.pravatar.cc/150?img=5",
    category: EKudosCategory.BrilliantIdea,
    message:
      "Your innovative solution to our customer onboarding process is game-changing! This will significantly improve our user experience.",
    senderName: "Chris Wong",
    senderAvatarUrl: "https://i.pravatar.cc/150?img=15",
    date: "Mar 11, 2025",
  },
  {
    id: "6",
    recipientName: "Kevin Smith",
    recipientTeam: "Support Team",
    recipientAvatarUrl: "https://i.pravatar.cc/150?img=6",
    category: EKudosCategory.AmazingSupport,
    message:
      "Thank you for going above and beyond in helping our enterprise clients. Your dedication to customer success is truly remarkable!",
    senderName: "Sarah Johnson",
    senderAvatarUrl: "https://i.pravatar.cc/150?img=16",
    date: "Mar 10, 2025",
  },
];
