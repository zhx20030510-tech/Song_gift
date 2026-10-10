import { initialRecommendations, initialRecommendedPlaylists, initialRequests, mockCovers, mockSongs } from "../data/mockData";
import type { ApiResult, RecommendedPlaylist, Song, SongRecommendation, SongRequest, User } from "../types";

const delay = async <T,>(data: T, ms = 160): Promise<ApiResult<T>> =>
  new Promise((resolve) => window.setTimeout(() => resolve({ ok: true, data }), ms));

const storageKeys = {
  visitorId: "visitor_id",
  sharedRequests: "song-demo:shared-requests",
  requests: "song-demo:requests",
  recommendations: "song-demo:recommendations",
  recommendedPlaylists: "song-demo:recommended-playlists",
};

const readStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeStorage = <T,>(key: string, value: T) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const readSessionStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.sessionStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeSessionStorage = <T,>(key: string, value: T) => {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(key, JSON.stringify(value));
};

let currentUser: User | null = null;
let requests: SongRequest[] = [...readSessionStorage(storageKeys.requests, []), ...initialRequests];

const initialRequestIds = new Set(initialRequests.map((request) => request.id));
const initialRecommendationIds = new Set(initialRecommendations.map((recommendation) => recommendation.id));
const myRecommendedDetailRequestIds = new Set(["preset-seaside-walk"]);

const mergeById = <T extends { id: string }>(items: T[]) =>
  items.reduce<T[]>((merged, item) => {
    if (!merged.some((existing) => existing.id === item.id)) merged.push(item);
    return merged;
  }, []);

let recommendedPlaylists: RecommendedPlaylist[] = mergeById([
  ...initialRecommendedPlaylists,
  ...readStorage<RecommendedPlaylist[]>(storageKeys.recommendedPlaylists, []),
]);

let recommendations: SongRecommendation[] = mergeById([
  ...readStorage(storageKeys.recommendations, []),
  ...readSessionStorage(storageKeys.recommendations, []),
  ...initialRecommendations,
]);

const listSharedRequests = () => {
  const localSharedRequests = readStorage<SongRequest[]>(storageKeys.sharedRequests, []);
  const sessionSharedRequests = readSessionStorage<SongRequest[]>(storageKeys.sharedRequests, []);
  const merged = [...localSharedRequests];
  sessionSharedRequests.forEach((request) => {
    if (!merged.some((item) => item.id === request.id)) merged.push(request);
  });
  return merged;
};

const saveSharedRequest = (request: SongRequest) => {
  const sharedRequests = listSharedRequests().filter((item) => item.id !== request.id);
  const nextSharedRequests = [request, ...sharedRequests];
  writeStorage(storageKeys.sharedRequests, nextSharedRequests);
  writeSessionStorage(storageKeys.sharedRequests, nextSharedRequests);
};

const saveSessionRequests = () => {
  writeSessionStorage(
    storageKeys.requests,
    requests.filter((request) => !initialRequestIds.has(request.id)),
  );
};

const saveSessionRecommendations = () => {
  const dynamicRecommendations = recommendations.filter((recommendation) => !initialRecommendationIds.has(recommendation.id));
  writeSessionStorage(storageKeys.recommendations, dynamicRecommendations);
  writeStorage(storageKeys.recommendations, dynamicRecommendations);
};

const refreshRecommendations = () => {
  recommendations = mergeById([
    ...readStorage<SongRecommendation[]>(storageKeys.recommendations, []),
    ...readSessionStorage<SongRecommendation[]>(storageKeys.recommendations, []),
    ...recommendations,
    ...initialRecommendations,
  ]);
  return recommendations;
};

const withRecommendationCounts = (items: SongRequest[]) =>
  items.map((request) => ({
    ...request,
    recommendationCount: refreshRecommendations().filter((recommendation) => recommendation.requestId === request.id).length,
  }));

const nowText = () => "刚刚";
const createId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

const initVisitor = () => {
  if (typeof window === "undefined") return null;
  const existing = window.localStorage.getItem(storageKeys.visitorId);
  if (existing) return existing;
  const visitorId = createId("visitor");
  window.localStorage.setItem(storageKeys.visitorId, visitorId);
  return visitorId;
};

export const authService = {
  async getCurrentUser() {
    return delay(currentUser);
  },
  async login(email: string, _password: string) {
    currentUser = { id: "user-demo", nickname: "咩咩是只羊", email };
    return delay(currentUser);
  },
  async register(nickname: string, email: string, _password: string) {
    currentUser = { id: "user-demo", nickname: nickname || "咩咩是只羊", email };
    return delay(currentUser);
  },
};

export const requestService = {
  async listMyRequests() {
    return delay(withRecommendationCounts(requests.filter((request) => !request.deleted && !myRecommendedDetailRequestIds.has(request.id))));
  },
  async getRequest(id: string) {
    const request =
      requests.find((item) => item.id === id && !item.deleted) ??
      listSharedRequests().find((item) => item.id === id && !item.deleted) ??
      null;
    return delay(
      request
        ? {
            ...request,
            recommendationCount: refreshRecommendations().filter((recommendation) => recommendation.requestId === request.id).length,
          }
        : null,
    );
  },
  async createRequest(input: Pick<SongRequest, "title" | "mood" | "coverUrl" | "isReasonPublic" | "isAnonymous">) {
    const request: SongRequest = {
      ...input,
      id: createId("request"),
      creatorName: input.isAnonymous ? "匿名用户" : currentUser?.nickname ?? "咩咩是只羊",
      createdAt: nowText(),
      recommendationCount: 0,
    };
    requests = [request, ...requests];
    saveSessionRequests();
    saveSharedRequest(request);
    return delay(request);
  },
  async deleteRequest(id: string) {
    requests = requests.map((request) => (request.id === id ? { ...request, deleted: true } : request));
    const sharedRequests = listSharedRequests().map((request) => (request.id === id ? { ...request, deleted: true } : request));
    writeStorage(storageKeys.sharedRequests, sharedRequests);
    writeSessionStorage(storageKeys.sharedRequests, sharedRequests);
    saveSessionRequests();
    return delay(true);
  },
};

export const songService = {
  async searchSongs(keyword: string) {
    const value = keyword.trim().toLowerCase();
    if (!value) return delay([], 220);

    const getRank = (song: Song) => {
      const name = song.name.toLowerCase();
      const artist = song.artist.toLowerCase();
      const album = (song.album ?? "").toLowerCase();

      if (name === value) return 0;
      if (name.includes(value)) return 1;
      if (artist.includes(value)) return 2;
      if (album.includes(value)) return 3;
      return -1;
    };

    const results = mockSongs
      .map((song, index) => ({ song, index, rank: getRank(song) }))
      .filter((item) => item.rank >= 0)
      .sort((a, b) => a.rank - b.rank || a.index - b.index)
      .filter((item, _index, sortedItems) => {
        const key = `${item.song.name}|${item.song.artist}|${item.song.album ?? ""}`.toLowerCase();
        return sortedItems.findIndex((candidate) => `${candidate.song.name}|${candidate.song.artist}|${candidate.song.album ?? ""}`.toLowerCase() === key) === _index;
      })
      .slice(0, 6)
      .map((item) => item.song);

    return delay(results, 220);
  },
};

export const playlistService = {
  async listRecommendations(requestId: string) {
    return delay(refreshRecommendations().filter((item) => item.requestId === requestId));
  },
  async submitRecommendation(input: { requestId: string; song: Song; reason: string; isAnonymous: boolean }) {
    const visitorId = initVisitor();
    const recommenderUserId = currentUser?.id ?? null;
    const recommendation: SongRecommendation = {
      id: createId("rec"),
      requestId: input.requestId,
      song: input.song,
      reason: input.reason,
      recommenderName: input.isAnonymous ? "匿名用户" : currentUser?.nickname ?? "匿名朋友",
      isAnonymous: input.isAnonymous,
      createdAt: nowText(),
      recommenderUserId,
      visitorId,
    };
    recommendations = [recommendation, ...recommendations];
    requests = requests.map((request) =>
      request.id === input.requestId ? { ...request, recommendationCount: request.recommendationCount + 1 } : request,
    );
    saveSessionRecommendations();
    saveSessionRequests();
    return delay(recommendation);
  },
  async deleteRecommendation(id: string) {
    recommendations = recommendations.filter((item) => item.id !== id);
    saveSessionRecommendations();
    return delay(true);
  },
  async listMyRecommendedPlaylists() {
    if (!currentUser) return delay([]);
    return delay(recommendedPlaylists.filter((item) => item.ownerUserId === currentUser?.id));
  },
  async addRecommendedPlaylist(item: RecommendedPlaylist) {
    if (!currentUser) return delay(item);
    const ownedItem = { ...item, ownerUserId: item.ownerUserId ?? currentUser.id };
    recommendedPlaylists = [ownedItem, ...recommendedPlaylists];
    writeStorage(storageKeys.recommendedPlaylists, recommendedPlaylists);
    return delay(ownedItem);
  },
};

export const uploadService = {
  async uploadCover(_file?: File) {
    return delay({ coverUrl: mockCovers.default });
  },
};

export const shareService = {
  async createShareLink(requestId: string) {
    const request =
      requests.find((item) => item.id === requestId && !item.deleted) ??
      listSharedRequests().find((item) => item.id === requestId && !item.deleted);
    if (request) saveSharedRequest(request);
    return delay(`${window.location.origin}${import.meta.env.BASE_URL}recommend/${encodeURIComponent(requestId)}`);
  },
  async copyShareLink(requestId: string) {
    const result = await this.createShareLink(requestId);
    if (result.data && navigator.clipboard) {
      await navigator.clipboard.writeText(result.data).catch(() => undefined);
    }
    return delay(result.data ?? "");
  },
};
