export type MoodOption = "relaxed" | "sad" | "quiet" | "energized" | "commute" | "alone" | "custom";

export type ApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

export type User = {
  id: string;
  nickname: string;
  email: string;
  avatarUrl?: string;
};

export type SongRequest = {
  id: string;
  title: string;
  description?: string;
  creatorName: string;
  creatorAvatar?: string;
  coverUrl: string;
  mood: MoodOption;
  isReasonPublic: boolean;
  isAnonymous: boolean;
  createdAt: string;
  recommendationCount: number;
  deleted?: boolean;
};

export type Song = {
  id: string;
  provider?: "mock" | "qq-music" | "netease" | "spotify" | "apple-music";
  providerSongId?: string;
  name: string;
  artist: string;
  album?: string;
  coverUrl: string;
  audioUrl?: string;
  duration?: number;
  previewUrl?: string;
  sourceUrl?: string;
};

export type SongRecommendation = {
  id: string;
  requestId: string;
  song: Song;
  reason: string;
  recommenderName: string;
  recommenderAvatar?: string;
  isAnonymous: boolean;
  createdAt: string;
  isLiked?: boolean;
  recommenderUserId?: string | null;
  visitorId?: string | null;
};

export type RecommendedPlaylist = {
  id: string;
  ownerUserId?: string;
  requestId: string;
  requestTitle: string;
  requestCoverUrl: string;
  recommendedSong: Song;
  message: string;
  updatedAt: string;
  isInvalid?: boolean;
};
