import { PostRelations as typePostRelations } from '@/types/models/post';
import { ReplyRelations } from './models/reply';
import { CommentRelations } from './models/comment';

export interface Testimonial {
  content: string;
  cite: {
    person: { image: string; name: string; title: string };
    company: { image: string; name: string };
  };
}

export interface PostCommentReply extends ReplyRelations {
  replies?: ReplyRelations[];
  _count?: { replies: number };
}

export interface PostComment extends Omit<CommentRelations, 'replies'> {
  replies?: PostCommentReply[];
}

export interface PostRelations extends Omit<typePostRelations, 'comments'> {
  comments: PostComment[];
}
