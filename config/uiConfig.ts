import { AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";

export const statusConfig: any = {
    PENDING: {
      color: "bg-yellow-500",
      textColor: "text-yellow-500",
      borderColor: "border-yellow-500",
      icon: Clock,
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    },
    CANCELLED: {
      color: "bg-red-500",
      textColor: "text-red-500",
      borderColor: "border-red-500",
      icon: XCircle,
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
    ONGOING: {
      color: "bg-blue-500",
      textColor: "text-blue-500",
      borderColor: "border-blue-500",
      icon: AlertCircle,
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    COMPLETED: {
      color: "bg-green-500",
      textColor: "text-green-500",
      borderColor: "border-green-500",
      icon: CheckCircle2,
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
  };
  
 export const difficultyColors = {
    EASY: "text-green-500",
    MEDIUM: "text-yellow-500",
    HARD: "text-red-500",
  };
  