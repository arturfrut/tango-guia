// =============================================
// ENUMS
// =============================================

export enum UserRole {
  TEACHER = 'teacher',
  NORMAL_QUERY = 'normal_query',
  SPECIAL_STUDENT = 'special_student',
  ADMINISTRATOR = 'administrator',
  SPECIAL_GUEST = 'special_guest'
}

export enum ConversationState {
  MENU_MAIN = 'menu_main',
  MENU_SECRET = 'menu_secret',
  AUTHENTICATING = 'authenticating',
  CREATING_USER = 'creating_user',
  CREATING_EVENT_TITLE = 'creating_event_title',
  CREATING_EVENT_TYPE = 'creating_event_type',
  CREATING_EVENT_DESCRIPTION = 'creating_event_description',
  CREATING_EVENT_SCHEDULE = 'creating_event_schedule',
  CREATING_EVENT_RECURRENCE = 'creating_event_recurrence',
  CREATING_EVENT_LEVEL = 'creating_event_level',
  CREATING_EVENT_PRICE = 'creating_event_price',
  CREATING_EVENT_ADDRESS = 'creating_event_address',
  CREATING_EVENT_IMAGES = 'creating_event_images',
  CREATING_EVENT_CONFIRMATION = 'creating_event_confirmation',
  EDITING_EVENT = 'editing_event',
  QUERYING_EVENTS = 'querying_events',
  AI_NATURAL_MODE = 'ai_natural_mode'
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  BUTTON_RESPONSE = 'button_response',
  LIST_RESPONSE = 'list_response',
  LOCATION = 'location',
  DOCUMENT = 'document',
  AUDIO = 'audio'
}

export enum MessageDirection {
  INBOUND = 'inbound',
  OUTBOUND = 'outbound'
}

export enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed'
}

export enum EventType {
  SPECIAL_EVENT = 'special_event',
  CLASS = 'class',
  SEMINAR = 'seminar',
  MILONGA = 'milonga',
  PRACTICE = 'practice'
}

export enum ClassLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  ALL_LEVELS = 'all_levels'
}

export enum RecurrencePattern {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  CUSTOM = 'custom'
}

export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday'
}

export enum NotificationType {
  EVENT_REMINDER = 'event_reminder',
  EVENT_CANCELLED = 'event_cancelled',
  EVENT_MODIFIED = 'event_modified',
  MASS_MESSAGE = 'mass_message'
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

// =============================================
// DATABASE TYPES
// =============================================

export interface User {
  id: string;
  phone_number: string;
  role: UserRole;
  name?: string;
  password_hash?: string;
  details?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface SpecialStudent {
  id: string;
  user_id: string;
  birthday?: string;
  occupation?: string;
  is_student: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserSession {
  id: string;
  phone_number: string;
  display_name?: string;
  current_state: ConversationState;
  temp_data: Record<string, any>;
  ai_context: Record<string, any>;
  last_interaction: string;
  session_expires_at: string;
  created_at: string;
}

export interface Message {
  id: string;
  phone_number: string;
  direction: MessageDirection;
  message_type: MessageType;
  content?: string;
  meta_message_id?: string;
  meta_media_id?: string;
  button_id?: string;
  list_id?: string;
  status: MessageStatus;
  ai_processed: boolean;
  ai_intent?: string;
  ai_extracted_data?: Record<string, any>;
  timestamp: string;
  created_at: string;
}

export interface AIConversation {
  id: string;
  phone_number: string;
  conversation_summary?: string;
  detected_intents?: string[];
  extracted_entities: Record<string, any>;
  confidence_score?: number;
  last_updated: string;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  event_type: EventType;
  description?: string;
  class_level?: ClassLevel;
  price?: number;
  address?: string;
  has_limited_capacity: boolean;
  max_capacity?: number;
  current_attendees: number;
  attendance_tracking: boolean;
  thumbnail_image_url?: string;
  thumbnail_meta_id?: string;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface EventSchedule {
  id: string;
  event_id: string;
  start_date: string;
  end_date?: string;
  start_time: string;
  end_time?: string;
  timezone: string;
  recurrence_pattern: RecurrencePattern;
  recurrence_rule?: Record<string, any>;
  days_of_week?: DayOfWeek[];
  ends_at?: string;
  created_at: string;
}

export interface EventImage {
  id: string;
  event_id: string;
  image_url: string;
  meta_media_id?: string;
  caption?: string;
  display_order: number;
  created_at: string;
}

export interface EventTeacher {
  id: string;
  event_id: string;
  teacher_id: string;
  is_primary_teacher: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  notification_type: NotificationType;
  event_id?: string;
  recipient_phone?: string;
  recipient_role?: UserRole;
  message_template: string;
  scheduled_for: string;
  status: NotificationStatus;
  sent_at?: string;
  error_message?: string;
  created_by?: string;
  created_at: string;
}

export interface AppConfig {
  id: string;
  config_key: string;
  config_value?: string;
  description?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

// =============================================
// EXTENDED TYPES WITH RELATIONS
// =============================================

export interface UserWithSpecialStudent extends User {
  special_student?: SpecialStudent;
}

export interface EventWithDetails extends Event {
  event_images: any;
  event_teachers: any;
  event_schedules: any;
  schedules?: EventSchedule[];
  images?: EventImage[];
  teachers?: (EventTeacher & { teacher: User })[];
}

export interface EventWithSchedules extends Event {
  event_schedules: EventSchedule[];
}

export interface MessageWithUser extends Message {
  user?: User;
}

// =============================================
// API REQUEST/RESPONSE TYPES
// =============================================

export interface CreateUserRequest {
  phone_number: string;
  role: UserRole;
  name?: string;
  password?: string;
  details?: string;
}

export interface CreateEventRequest {
  title: string;
  event_type: EventType;
  description?: string;
  class_level?: ClassLevel;
  price?: number;
  address?: string;
  has_limited_capacity?: boolean;
  max_capacity?: number;
  attendance_tracking?: boolean;
  schedules: CreateEventScheduleRequest[];
  teacher_ids: string[];
}

export interface CreateEventScheduleRequest {
  start_date: string;
  end_date?: string;
  start_time: string;
  end_time?: string;
  recurrence_pattern?: RecurrencePattern;
  recurrence_rule?: Record<string, any>;
  days_of_week?: DayOfWeek[];
  ends_at?: string;
}

export interface UpdateSessionRequest {
  current_state: ConversationState;
  temp_data?: Record<string, any>;
  ai_context?: Record<string, any>;
}

export interface QueryEventsRequest {
  event_type?: EventType;
  start_date?: string;
  end_date?: string;
  teacher_id?: string;
  is_active?: boolean;
  limit?: number;
  offset?: number;
}

export interface EventsResponse {
  events: EventWithDetails[];
  total: number;
  has_more: boolean;
}

// =============================================
// WHATSAPP API TYPES
// =============================================

export interface WhatsAppMessage {
  messaging_product: 'whatsapp';
  to: string;
  type: 'text' | 'interactive' | 'image' | 'document';
  text?: {
    body: string;
  };
  interactive?: {
    type: 'button' | 'list';
    body: {
      text: string;
    };
    action: {
      buttons?: Array<{
        type: 'reply';
        reply: {
          id: string;
          title: string;
        };
      }>;
      sections?: Array<{
        title: string;
        rows: Array<{
          id: string;
          title: string;
          description?: string;
        }>;
      }>;
    };
  };
  image?: {
    id?: string;
    link?: string;
    caption?: string;
  };
}

export interface WhatsAppWebhookMessage {
  from: string;
  id: string;
  timestamp: string;
  type: MessageType;
  text?: {
    body: string;
  };
  interactive?: {
    type: 'button_reply' | 'list_reply';
    button_reply?: {
      id: string;
      title: string;
    };
    list_reply?: {
      id: string;
      title: string;
      description?: string;
    };
  };
  image?: {
    id: string;
    mime_type: string;
    sha256: string;
    caption?: string;
  };
}

// =============================================
// UTILITY TYPES
// =============================================

export type CreateTables = 
  | 'users'
  | 'special_students'
  | 'user_sessions'
  | 'messages'
  | 'ai_conversations'
  | 'events'
  | 'event_schedules'
  | 'event_images'
  | 'event_teachers'
  | 'notifications'
  | 'app_config';

export type DatabaseError = {
  code: string;
  message: string;
  details?: string;
};

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: DatabaseError;
  message?: string;
};

// =============================================
// CONVERSATION TEMP DATA TYPES
// =============================================

export interface CreateEventTempData {
  title?: string;
  event_type?: EventType;
  description?: string;
  class_level?: ClassLevel;
  price?: number;
  address?: string;
  has_limited_capacity?: boolean;
  max_capacity?: number;
  attendance_tracking?: boolean;
  current_schedule?: Partial<CreateEventScheduleRequest>;
  schedules?: CreateEventScheduleRequest[];
  teacher_ids?: string[];
  images?: Array<{
    url: string;
    meta_id: string;
    caption?: string;
  }>;
  current_image_count?: number;
}

export interface AuthenticationTempData {
  attempted_password?: string;
  registration_step?: 'password' | 'name' | 'role' | 'details';
  new_user_data?: Partial<CreateUserRequest>;
}

export interface QueryTempData {
  query_type?: 'events_today' | 'events_tomorrow' | 'events_by_date' | 'events_by_teacher';
  selected_date?: string;
  selected_teacher_id?: string;
  filters?: Partial<QueryEventsRequest>;
}