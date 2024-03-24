export interface Post {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: User;
  createdById: string;
}

// Necessary for Next auth
export interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string; // @db.Text
  access_token?: string; // @db.Text
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string; // @db.Text
  session_state?: string;
  user: User;
}

export interface Session {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
  user: User;
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  emailVerified?: Date;
  image?: string;
  accounts: Account[];
  sessions: Session[];
  posts: Post[];
  polls: Poll[];
  pollVotes: PollVote[];
}

export interface VerificationToken {
  identifier: string;
  token: string;
  expires: Date;
}

export interface Poll {
  id: string;
  name: string;
  options: PollOption[];
  totalVotes: number;
  expiry?: Date;
  neverExpire: boolean;
  expired: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: User;
  createdById: string;
  pollVotes: PollVote[];
}

export interface PollOption {
  id: string;
  name: string;
  votes: number;
  poll: Poll;
  pollId: string;
  pollVotes: PollVote[];
}

export interface PollVote {
  poll: Poll;
  pollId: string;
  option: PollOption;
  optionId: string;
  user: User;
  userId: string;
}
