import { Icon } from '@tabler/icons-react';
import { ReplyRelations } from './models/reply';
import { CommentRelations } from './models/comment';
import { PostRelations as typePostRelations } from './models/post';

export interface Team {
  name: string;
  title: string;
  image: string;
  socials: {
    icon: Icon;
    link: string;
  }[];
}

export interface Testimonial {
  content: string;
  cite: {
    person: { image: string; name: string; title: string };
    company: { image: string; name: string };
  };
}

export interface Pricing {
  title: string;
  desc: string;
  price: { monthly: number; annually: number };
  specs: string[];
  meta?: { popular: boolean };
}

export interface Discount {
  initial: number;
  current: number;
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
