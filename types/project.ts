// Type definitions
export type TPROJECTSTATUS = "PENDING" | "CANCELLED" | "ONGOING" | "COMPLETED";
export type TKPIRANK =
  | "BRONZE"
  | "SILVER"
  | "GOLD"
  | "PLATINIUM"
  | "DIAMOND"
  | "CROWN"
  | "ACE"
  | "CONQUERER";
export type TDIFFICULTYLEVEL = "EASY" | "MEDIUM" | "HARD";
export type TPROJECTTYPE = "INHOUSE" | "OUTSOURCE";
export type TUPDATE_PROJECT = {
  id: number;
  title: string;
  detail: string;
  projectType: TPROJECTTYPE;
  niche: string;
  bounty: number;
  deadline: string;
  projectStatus: TPROJECTSTATUS;
  progressPercentage: number;
  isDeadlineNeedToBeExtend: boolean;
  difficultyLevel: TDIFFICULTYLEVEL;
  milestones: Milestone[];
  phone: string;
};

export type TPROJECT = TUPDATE_PROJECT & {
  clientWhoPostedThisProjectForeignId?: string;
  selectedFreelancers: string[];
  interestedFreelancers: string[];
  commentByClientAfterProjectCompletion?: string;
  starsByClientAfterProjectCompletion?: string;
};

export type Milestone = {
  createdAt: Date;
  id: number;
  deadline: Date;
  mileStoneName: string;
  description: string | null;
  progress: number;
  totalProgressPoints: number;
  projectId: number;
  priorityRank: number;
  isMilestoneCompleted: boolean;
};
