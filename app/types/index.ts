import { SVGProps } from 'react';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type ClassLevel = 'beginner' | 'intermediate' | 'advanced' | 'all_levels';
export type EventType = 'class' | 'seminar' | 'milonga' | 'special_event';
export type OrganizerType = 'teacher' | 'special_user';

// Event classes
export interface EventClass {
  id: string;
  event_id: string;
  class_name?: string;
  start_time: string;
  end_time?: string;
  class_level?: ClassLevel;
  class_order: number;
  created_at: string;
}

export interface EventPractice {
  id: string;
  event_id: string;
  practice_time: string;
  practice_end_time?: string;
  created_at: string;
}

// Event organizers/teachers
export interface EventOrganizer {
  id: string;
  event_id: string;
  teacher_id?: string;
  organizer_type: OrganizerType;
  is_primary: boolean;
  is_one_time_teacher: boolean;
  one_time_teacher_name?: string;
  created_at: string;
  // Relations
  teachers?: {
    id: string;
    name?: string;
    phone_number: string;
  };
}

// Pricing options
export interface EventPricing {
  id: string;
  event_id: string;
  price_type: string;
  price: number;
  description?: string;
  created_at: string;
}

// Seminar day
export interface SeminarDay {
  id: string;
  event_id: string;
  day_number: number;
  date: string;
  theme?: string;
  created_at: string;
}

// Pre-milonga class
export interface MilongaPreClass {
  id: string;
  event_id: string;
  class_time: string;
  class_end_time?: string;
  class_level?: ClassLevel;
  milonga_start_time?: string;
  created_at: string;
}

// Seminar day classes
export interface SeminarDayClass {
  id: string;
  seminar_day_id: string;
  class_name: string;
  start_time: string;
  end_time?: string;
  class_level?: ClassLevel;
  class_order: number;
  created_at: string;
}

// Base tango event
export interface TangoEvent {
  id: string;
  title: string;
  event_type: EventType;
  description?: string;
  venue_name: string;
  address: string;
  contact_phone?: string;
  reminder_phone?: string;
  date: string;
  has_weekly_recurrence: boolean;
  avatar_image_url?: string;
  images?: string[];
  show_description?: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

// Complete event with all relations
export interface CompleteEventData extends TangoEvent {
  classes?: EventClass[];
  practice?: EventPractice[];
  organizers?: EventOrganizer[];
  pricing?: EventPricing[];
  seminar_days?: (SeminarDay & {
    classes?: SeminarDayClass[];
  })[];
  milonga_pre_class?: MilongaPreClass;
}

// API Response types
export interface EventsResponse {
  events: CompleteEventData[];
  total: number;
  has_more: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}