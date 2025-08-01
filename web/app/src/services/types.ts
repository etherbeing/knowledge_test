export interface CommentT {
  id?: number;
  created_at?: string;
  message: string;
  reply_to: CommentT | null;
}
export interface CategoryT {
  id?: number;
  title: string;
}
export interface TaskT {
  id?: number;
  title: string;
  description?: string | null;
  owner?: UserT; // id to the user that owns it
  category: CategoryT; // id to the category it belongs to
  comments?: Array<CommentT>;
  created_at?: string;
}
export interface UserT {
  id: number;
  last_login: string;
  is_superuser: boolean;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
  avatar: string;
  groups: Array<string>;
  user_permissions: Array<string>;
}
