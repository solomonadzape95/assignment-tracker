"use client";

import {
  MdArrowBack,
  MdPerson,
  MdSchool,
  MdNotifications,
  MdSwapVert,
  MdInfo,
  MdSchedule,
  MdCalendarToday,
  MdPriorityHigh,
  MdCheckCircle,
  MdMoreHoriz,
  MdHome,
  MdAdd,
  MdBarChart,
  MdSettings,
  MdCalendarMonth,
  MdMenuBook,
  MdPlayCircle,
  MdCheck,
  MdSearch,
  MdAutoStories,
  MdChevronRight,
  MdChevronLeft,
  MdDescription,
  MdDashboard,
  MdAssignment,
  MdDelete,
  MdLightMode,
  MdDarkMode,
  MdEdit,
  MdTrackChanges,
  MdAlarm,
  MdInsights,
  MdVisibility,
  MdClose,
  MdSave,
  MdLogout,
  MdTaskAlt,
  MdNotificationsActive,
  MdEmail,
  MdAdminPanelSettings,
  MdPublish,
} from "react-icons/md";
import type { IconType } from "react-icons";

const iconMap: Record<string, IconType> = {
  arrow_back: MdArrowBack,
  person: MdPerson,
  school: MdSchool,
  notifications: MdNotifications,
  swap_vert: MdSwapVert,
  info: MdInfo,
  schedule: MdSchedule,
  calendar_today: MdCalendarToday,
  priority_high: MdPriorityHigh,
  check_circle: MdCheckCircle,
  more_horiz: MdMoreHoriz,
  home: MdHome,
  add: MdAdd,
  bar_chart: MdBarChart,
  settings: MdSettings,
  calendar_month: MdCalendarMonth,
  menu_book: MdMenuBook,
  book: MdMenuBook,
  play_circle: MdPlayCircle,
  check: MdCheck,
  search: MdSearch,
  auto_stories: MdAutoStories,
  chevron_right: MdChevronRight,
  chevron_left: MdChevronLeft,
  description: MdDescription,
  dashboard: MdDashboard,
  assignment: MdAssignment,
  delete: MdDelete,
  sun: MdLightMode,
  moon: MdDarkMode,
  edit: MdEdit,
  track_changes: MdTrackChanges,
  alarm: MdAlarm,
  insight: MdInsights,
  insights: MdInsights,
  visibility: MdVisibility,
  close: MdClose,
  save: MdSave,
  logout: MdLogout,
  task_alt: MdTaskAlt,
  notifications_active: MdNotificationsActive,
  email: MdEmail,
  admin_panel_settings: MdAdminPanelSettings,
  publish: MdPublish,
};

export type IconName = keyof typeof iconMap;

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  "aria-label"?: string;
}

export function Icon({ name, size = 24, className = "", "aria-label": ariaLabel }: IconProps) {
  const IconComponent = iconMap[name];
  if (!IconComponent) return null;
  return (
    <IconComponent
      size={size}
      className={className}
      aria-hidden={!ariaLabel}
      aria-label={ariaLabel}
    />
  );
}
