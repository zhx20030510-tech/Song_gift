import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { figmaFile, figmaTexts, figmaTokens } from "./design/figmaSpec";
import {
  authService,
  playlistService,
  requestService,
  shareService,
  songService,
  uploadService,
} from "./services/mockServices";
import { mockCovers, mockSongs } from "./data/mockData";
import type { MoodOption, RecommendedPlaylist, Song, SongRecommendation, SongRequest, User } from "./types";
import authLoginModalImage from "./assets/figma/auth-login-modal.png";
import authRegisterModalImage from "./assets/figma/auth-register-modal.png";
import deletePlaylistDangerHeroImage from "./assets/figma/delete-playlist-danger-hero.png";
import homeBrandSloganImage from "./assets/figma/home-brand-slogan.png";
import homeHeroIllustrationImage from "./assets/figma/home-hero-illustration.png";
import invalidPlaylistHeroImage from "./assets/figma/invalid-playlist-hero.png";
import recommendSuccessHeroImage from "./assets/figma/recommend-success-hero.png";
import skipNextIcon from "./assets/figma/skip-next-filled.png";
import skipPreviousIcon from "./assets/figma/skip-previous-filled.png";
import welcomeImage from "./assets/figma/welcome.png";
import moodAloneIdle from "./assets/moods/alone-idle.png";
import moodAloneSelected from "./assets/moods/alone-selected.png";
import moodCommuteIdle from "./assets/moods/commute-idle.png";
import moodCommuteSelected from "./assets/moods/commute-selected.png";
import moodEnergizedIdle from "./assets/moods/energized-idle.png";
import moodEnergizedSelected from "./assets/moods/energized-selected.png";
import moodQuietIdle from "./assets/moods/quiet-idle.png";
import moodQuietSelected from "./assets/moods/quiet-selected.png";
import moodRelaxedIdle from "./assets/moods/relaxed-idle.png";
import moodRelaxedSelected from "./assets/moods/relaxed-selected.png";
import moodSadIdle from "./assets/moods/sad-idle.png";
import moodSadSelected from "./assets/moods/sad-selected.png";

type ToastState = { id: number; message: string } | null;
type CreateMoodOption = Exclude<MoodOption, "custom">;

const createMoodValues: CreateMoodOption[] = ["relaxed", "sad", "quiet", "energized", "commute", "alone"];
const createMoodImages: Record<CreateMoodOption, { idle: string; selected: string }> = {
  relaxed: { idle: moodRelaxedIdle, selected: moodRelaxedSelected },
  sad: { idle: moodSadIdle, selected: moodSadSelected },
  quiet: { idle: moodQuietIdle, selected: moodQuietSelected },
  energized: { idle: moodEnergizedIdle, selected: moodEnergizedSelected },
  commute: { idle: moodCommuteIdle, selected: moodCommuteSelected },
  alone: { idle: moodAloneIdle, selected: moodAloneSelected },
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    authService.getCurrentUser().then((result) => setUser(result.data ?? null));
  }, []);

  const showToast = (message: string) => {
    setToast({ id: Date.now(), message });
    window.setTimeout(() => setToast(null), 1900);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={user ? <HomePage user={user} showToast={showToast} /> : <WelcomePage setUser={setUser} />} />
        <Route path="/welcome" element={user ? <Navigate to="/" replace /> : <WelcomePage setUser={setUser} />} />
        <Route path="/create" element={<CreateRequestPage user={user} setUser={setUser} showToast={showToast} />} />
        <Route path="/publish-success/:id" element={<PublishSuccessPage showToast={showToast} />} />
        <Route path="/recommend/:id" element={<RecommendSongPage user={user} setUser={setUser} showToast={showToast} />} />
        <Route path="/playlist" element={<MyPlaylistRecordPage showToast={showToast} />} />
        <Route path="/my-recommended-songs" element={<MyRecommendedSongsPage />} />
        <Route path="/shared-playlist/:id" element={<SharedPlaylistDetailPage showToast={showToast} />} />
        <Route path="/invalid-playlist" element={<InvalidPlaylistPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {toast ? <div className="toast">{toast.message}</div> : null}
    </>
  );
}

function MobileFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <main className="app-shell" style={{ fontFamily: figmaTokens.typography.family }}>
      <section className={`mobile-frame ${className}`} data-figma-file={figmaFile.fileKey}>
        {children}
      </section>
    </main>
  );
}

function PageHeader({ title, onBack }: { title: string; onBack?: () => void }) {
  const navigate = useNavigate();
  return (
    <header className="page-header">
      <button className="icon-back" type="button" onClick={onBack ?? (() => navigate(-1))} aria-label="返回">
        ‹
      </button>
      <h1>{title}</h1>
    </header>
  );
}

function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
  disabled,
  className = "",
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button className={`figma-button ${variant} ${className}`} type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

function Switch({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <button className={`switch ${checked ? "on" : ""}`} type="button" onClick={() => onChange(!checked)} aria-pressed={checked}>
      <span />
    </button>
  );
}

function AuthModal({
  mode,
  animated = false,
  onClose,
  onSuccess,
}: {
  mode: "login" | "register";
  animated?: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}) {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [closing, setClosing] = useState(false);
  const texts = figmaTexts.welcome;

  const requestClose = () => {
    if (!animated) {
      onClose();
      return;
    }
    setClosing(true);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email || !password || (mode === "register" && !nickname)) {
      setError("请填写完整信息");
      return;
    }
    if (mode === "register" && password !== confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }
    const result =
      mode === "login" ? await authService.login(email, password) : await authService.register(nickname, email, password);
    if (result.data) onSuccess(result.data);
  };

  return (
    <div className={`overlay ${animated ? "auth-overlay-enter" : ""} ${closing ? "auth-overlay-exit" : ""}`} onClick={requestClose}>
      <form
        className={`auth-modal ${mode} ${animated ? "auth-modal-enter" : ""} ${closing ? "auth-modal-exit" : ""}`}
        onClick={(event) => event.stopPropagation()}
        onAnimationEnd={(event) => {
          if (event.animationName === "auth-card-exit") onClose();
        }}
        onSubmit={submit}
      >
        <img
          className="auth-modal-bg"
          src={mode === "login" ? authLoginModalImage : authRegisterModalImage}
          alt=""
          aria-hidden="true"
        />
        <h2>{mode === "login" ? texts.loginTitle : texts.registerTitle}</h2>
        {mode === "register" ? (
          <input value={nickname} onChange={(event) => setNickname(event.target.value)} placeholder={texts.nickname} />
        ) : null}
        <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder={texts.email} />
        <input value={password} onChange={(event) => setPassword(event.target.value)} placeholder={texts.password} type="password" />
        {mode === "register" ? (
          <input
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder={texts.confirmPassword}
            type="password"
          />
        ) : null}
        {error ? <p className="form-error">{error}</p> : null}
        <Button type="submit">{mode === "login" ? texts.login : texts.register}</Button>
      </form>
    </div>
  );
}

function WelcomePage({ setUser }: { setUser: (user: User) => void }) {
  const navigate = useNavigate();
  const [modal, setModal] = useState<"login" | "register" | null>(null);
  const texts = figmaTexts.welcome;

  return (
    <MobileFrame className="welcome-frame">
      <img className="welcome-source" src={welcomeImage} alt="" />
      <div className="welcome-actions">
        <button type="button" className="welcome-login" onClick={() => setModal("login")}>
          {texts.login}
        </button>
        <button type="button" className="welcome-register" onClick={() => setModal("register")}>
          {texts.register}
        </button>
      </div>
      {modal ? (
        <AuthModal
          mode={modal}
          animated
          onClose={() => setModal(null)}
          onSuccess={(nextUser) => {
            setUser(nextUser);
            navigate("/");
          }}
        />
      ) : null}
    </MobileFrame>
  );
}

function HomePage({ user, showToast }: { user: User | null; showToast: (message: string) => void }) {
  const navigate = useNavigate();
  const texts = figmaTexts.home;
  const guarded = (path: string) => {
    if (!user) {
      navigate("/welcome");
      return;
    }
    navigate(path);
  };
  return (
    <MobileFrame className="home-frame">
      <Hero />
      <div className="home-card-stack">
        <HomeActionCard icon="＋" title={texts.createTitle} description={texts.createDescription} onClick={() => guarded("/create")} />
        <HomeActionCard icon="♬" title={texts.playlistTitle} description={texts.playlistDescription} onClick={() => guarded("/playlist")} />
        <HomeActionCard
          icon=""
          title={texts.communityTitle}
          badge={texts.communityBadge}
          disabled
          onClick={() => showToast(texts.communityBadge)}
        />
      </div>
      <BrandMark compact />
    </MobileFrame>
  );
}

function Hero() {
  return <img className="hero-illustration" src={homeHeroIllustrationImage} alt="" aria-hidden="true" />;
}

function BrandMark({ compact = false }: { compact?: boolean }) {
  return <img className={`brand-mark ${compact ? "compact" : ""}`} src={homeBrandSloganImage} alt="" aria-hidden="true" />;
}

function HomeActionCard({
  icon,
  title,
  description,
  badge,
  disabled,
  onClick,
}: {
  icon: string;
  title: string;
  description?: string;
  badge?: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button className={`home-action-card ${disabled ? "disabled" : ""}`} type="button" onClick={onClick}>
      <span className="home-icon">{icon}</span>
      <span className="home-card-copy">
        <strong>{title}</strong>
        {description ? <small>{description}</small> : null}
      </span>
      {badge ? <em>{badge}</em> : <span className="chevron">›</span>}
    </button>
  );
}

function CreateRequestPage({
  user,
  setUser,
  showToast,
}: {
  user: User | null;
  setUser: (user: User) => void;
  showToast: (message: string) => void;
}) {
  const navigate = useNavigate();
  const t = figmaTexts.create;
  const [authOpen, setAuthOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [mood, setMood] = useState<MoodOption | null>(null);
  const [coverUrl, setCoverUrl] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isReasonPublic, setReasonPublic] = useState(true);
  const [isAnonymous, setAnonymous] = useState(false);

  const publish = async () => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    const clean = title.trim();
    if (!clean) {
      showToast("请输入你的歌单需求");
      return;
    }
    if (clean.length < 5) {
      showToast("请至少输入 5 个字");
      return;
    }
    if (clean.length > 100) {
      showToast("最多输入 100 个字");
      return;
    }
    const result = await requestService.createRequest({
      title: clean,
      mood: mood ?? "commute",
      coverUrl: coverUrl || mockCovers.default,
      isReasonPublic,
      isAnonymous,
    });
    if (result.data) navigate(`/publish-success/${result.data.id}`);
  };

  return (
    <MobileFrame className="figma-background-page">
      <PageHeader title={t.title} onBack={() => navigate("/")} />
      <div className="page-scroll create-page">
        <Panel title={t.demandTitle}>
          <textarea value={title} onChange={(event) => setTitle(event.target.value)} maxLength={100} placeholder={t.demandPlaceholder} />
          <span className="counter">{title.length} / 100</span>
        </Panel>
        <Panel title={t.moodTitle}>
          <div className="mood-grid">
            {t.moods.map((label, index) => {
              const value = createMoodValues[index];
              const active = mood === value;
              const moodImage = active ? createMoodImages[value].selected : createMoodImages[value].idle;
              return (
                <button key={label} className={active ? "selected" : ""} type="button" onClick={() => setMood((current) => (current === value ? null : value))}>
                  <span className="mood-icon-frame">
                    <img src={moodImage} alt="" aria-hidden="true" />
                  </span>
                  <span className="mood-label">{label}</span>
                </button>
              );
            })}
          </div>
        </Panel>
        <Panel title={t.coverTitle}>
          <button className={`cover-upload ${coverUrl ? "uploaded" : ""}`} type="button" onClick={() => setPreviewOpen(true)}>
            {coverUrl ? (
              <span className="cover-thumb-frame">
                <span className="cover-thumb" style={{ backgroundImage: getCoverBackground(coverUrl) }} />
              </span>
            ) : (
              t.uploadCover
            )}
          </button>
        </Panel>
        <div className="settings-card">
          <SettingRow title={t.reasonPublic} description={t.reasonPublicHint} checked={isReasonPublic} onChange={setReasonPublic} />
          <SettingRow title={t.anonymous} checked={isAnonymous} onChange={setAnonymous} />
        </div>
      </div>
      <div className="bottom-actions two">
        <Button variant="secondary" onClick={() => navigate("/")}>
          {t.cancel}
        </Button>
        <Button onClick={publish}>{t.publish}</Button>
      </div>
      {previewOpen ? (
        <div className="overlay">
          <div className="image-preview-modal">
            <button className="modal-close" type="button" onClick={() => setPreviewOpen(false)}>
              ✕
            </button>
            <div className="preview-cover" style={{ backgroundImage: getCoverBackground(coverUrl || mockCovers.default) }} />
            <div className="modal-actions">
              <Button variant="secondary" onClick={() => setPreviewOpen(false)}>
                {t.chooseAgain}
              </Button>
              <Button
                onClick={async () => {
                  const result = await uploadService.uploadCover();
                  setCoverUrl(result.data?.coverUrl ?? "");
                  setPreviewOpen(false);
                }}
              >
                {t.confirm}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
      {authOpen ? (
        <AuthModal
          mode="login"
          onClose={() => setAuthOpen(false)}
          onSuccess={(nextUser) => {
            setUser(nextUser);
            setAuthOpen(false);
          }}
        />
      ) : null}
    </MobileFrame>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function SettingRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="setting-row">
      <span>
        <strong>{title}</strong>
        {description ? <small>{description}</small> : null}
      </span>
      <Switch checked={checked} onChange={onChange} />
    </div>
  );
}

function PublishSuccessPage({ showToast }: { showToast: (message: string) => void }) {
  const { id = "request-1" } = useParams();
  const navigate = useNavigate();
  const t = figmaTexts.publish;
  const [request, setRequest] = useState<SongRequest | null>(null);
  const [requestReady, setRequestReady] = useState(false);
  useEffect(() => {
    setRequestReady(false);
    setRequest(null);
    requestService.getRequest(id).then((result) => {
      if (!result.data) {
        navigate("/invalid-playlist");
        return;
      }
      setRequest(result.data);
      setRequestReady(true);
    });
  }, [id, navigate]);
  return (
    <MobileFrame>
      <PageHeader title="" onBack={() => navigate("/")} />
      <div className="success-page">
        <div className="publish-success-hero">
          <img src={recommendSuccessHeroImage} alt="" aria-hidden="true" />
        </div>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
        {requestReady && request ? <RequestCard request={request} meta={t.meta} /> : <RequestCardSkeleton />}
      </div>
      <div className="bottom-actions">
        <Button
          onClick={async () => {
            await shareService.copyShareLink(id);
            showToast("链接已复制");
          }}
        >
          {t.share}
        </Button>
        <Button variant="secondary" onClick={() => navigate("/playlist")}>
          {t.record}
        </Button>
      </div>
    </MobileFrame>
  );
}

function RecommendSongPage({
  showToast,
}: {
  user: User | null;
  setUser: (user: User) => void;
  showToast: (message: string) => void;
}) {
  const { id = "request-1" } = useParams();
  const navigate = useNavigate();
  const t = figmaTexts.recommend;
  const [request, setRequest] = useState<SongRequest | null>(null);
  const [requestReady, setRequestReady] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [reason, setReason] = useState("");
  const [isAnonymous, setAnonymous] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => {
    setRequestReady(false);
    setRequest(null);
    requestService.getRequest(id).then((result) => {
      if (!result.data) {
        navigate("/invalid-playlist");
        return;
      }
      setRequest(result.data);
      setRequestReady(true);
    });
  }, [id, navigate]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      songService.searchSongs(keyword).then((result) => setSongs(result.data ?? []));
    }, 300);
    return () => window.clearTimeout(handle);
  }, [keyword]);

  const submit = async () => {
    if (!selectedSong) {
      showToast("请选择一首歌曲");
      return;
    }
    const result = await playlistService.submitRecommendation({ requestId: id, song: selectedSong, reason, isAnonymous });
    if (result.data) {
      if (result.data.recommenderUserId) {
        await playlistService.addRecommendedPlaylist({
          id: `playlist-${result.data.id}`,
          ownerUserId: result.data.recommenderUserId,
          requestId: id,
          requestTitle: request?.title ?? t.requestTitle,
          requestCoverUrl: request?.coverUrl ?? "",
          recommendedSong: selectedSong,
          message: reason,
          updatedAt: "刚刚",
        });
      }
      setSuccessOpen(true);
    }
  };
  const selectSong = (song: Song) => {
    setSelectedSong(resolveLocalPlayableSong(song));
  };

  return (
    <MobileFrame className="figma-background-page">
      <PageHeader title={t.title} />
      <div className="page-scroll recommend-page">
        {requestReady && request ? <RequestCard request={request} meta={t.meta} /> : <RequestCardSkeleton />}
        <Panel title={t.songTitle}>
          {selectedSong ? (
            <SelectedSong song={selectedSong} onRemove={() => setSelectedSong(null)} showToast={showToast} />
          ) : (
            <>
              <input className="search-input" value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder={t.searchPlaceholder} />
              {keyword ? (
                <div className="song-dropdown">
                  {songs.length ? (
                    songs.map((song) => (
                      <button key={song.id} type="button" onClick={() => selectSong(song)}>
                        <Cover style={song.coverUrl} />
                        <span>
                          <strong>{song.name}</strong>
                          <small>{song.artist}</small>
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="song-empty">没有找到这首歌</p>
                  )}
                </div>
              ) : null}
            </>
          )}
        </Panel>
        <Panel title={t.reasonTitle}>
          <textarea value={reason} onChange={(event) => setReason(event.target.value.slice(0, 30))} maxLength={30} placeholder={t.reasonPlaceholder} />
          <span className="counter">{reason.length} / 30</span>
        </Panel>
        <div className="settings-card">
          <SettingRow title={t.anonymous} description={t.anonymousHint} checked={isAnonymous} onChange={setAnonymous} />
        </div>
      </div>
      <div className="bottom-actions">
        <Button onClick={submit}>{t.submit}</Button>
      </div>
      {successOpen ? (
        <div className="overlay">
          <div className="success-modal">
            <div className="recommend-success-hero">
              <img src={recommendSuccessHeroImage} alt="" aria-hidden="true" />
            </div>
            <h2>{t.successTitle}</h2>
            <p>{t.successDescription}</p>
            <Button onClick={() => navigate(`/shared-playlist/${id}`)}>{t.successAction}</Button>
          </div>
        </div>
      ) : null}
    </MobileFrame>
  );
}

function MyPlaylistRecordPage({ showToast }: { showToast: (message: string) => void }) {
  const navigate = useNavigate();
  const t = figmaTexts.playlist;
  const [requests, setRequests] = useState<SongRequest[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recommendations, setRecommendations] = useState<SongRecommendation[]>([]);
  const [deleteRecId, setDeleteRecId] = useState<string | null>(null);
  const [deletePlaylistOpen, setDeletePlaylistOpen] = useState(false);
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);
  const current = requests[currentIndex] ?? null;
  const currentSong = recommendations.find((item) => item.song.id === currentSongId)?.song ?? recommendations[0]?.song;

  const loadRecommendations = async (requestId: string) => {
    const recResult = await playlistService.listRecommendations(requestId);
    const nextRecommendations = recResult.data ?? [];
    setRecommendations(nextRecommendations);
    setCurrentSongId((selectedId) =>
      selectedId && nextRecommendations.some((item) => item.song.id === selectedId) ? selectedId : nextRecommendations[0]?.song.id ?? null,
    );
  };

  const reload = async () => {
    const requestResult = await requestService.listMyRequests();
    const nextRequests = requestResult.data ?? [];
    setRequests(nextRequests);
    const active = nextRequests[currentIndex] ?? nextRequests[0];
    if (active) {
      await loadRecommendations(active.id);
    }
  };

  const deleteCurrentPlaylist = async () => {
    if (!current) return;
    const deletedIndex = currentIndex;
    await requestService.deleteRequest(current.id);
    setDeletePlaylistOpen(false);
    const requestResult = await requestService.listMyRequests();
    const nextRequests = requestResult.data ?? [];
    if (!nextRequests.length) {
      navigate("/");
      return;
    }
    const nextIndex = Math.min(deletedIndex, nextRequests.length - 1);
    setRequests(nextRequests);
    setCurrentIndex(nextIndex);
    await loadRecommendations(nextRequests[nextIndex].id);
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const carouselItems = requests.length
    ? [
        { request: requests[(currentIndex - 1 + requests.length) % requests.length], position: "previous" },
        { request: requests[currentIndex], position: "active" },
        { request: requests[(currentIndex + 1) % requests.length], position: "next" },
      ]
    : [];

  return (
    <MobileFrame className="playlist-record-page">
      <PageHeader title={t.title} onBack={() => navigate("/")} />
      <div className="playlist-tabs">
        <button className="active" type="button">
          {t.myRequests}
        </button>
        <button type="button" onClick={() => navigate("/my-recommended-songs")}>
          {t.myRecommended}
        </button>
      </div>
      <div className="playlist-carousel">
        {carouselItems.map(({ request, position }) => (
          <button
            key={`${position}-${request.id}`}
            className={`playlist-request-card ${position === "active" ? "active" : ""} ${position}`}
            type="button"
            onClick={() => setCurrentIndex(Math.max(0, requests.findIndex((item) => item.id === request.id)))}
          >
            <span className="playlist-request-panel" />
            <span className="playlist-request-cover" style={{ backgroundImage: getCoverBackground(request.coverUrl) }} />
            <strong>{request.title}</strong>
            <span className="playlist-mood-tag">
              <img src={getMoodSelectedImage(request.mood)} alt="" aria-hidden="true" />
            </span>
            <small className="playlist-song-count">共{request.recommendationCount}首歌</small>
            <small className="playlist-time">{t.time}</small>
            <span
              className="playlist-delete"
              onClick={(event) => {
                event.stopPropagation();
                setDeletePlaylistOpen(true);
              }}
            >
              ✕
            </span>
          </button>
        ))}
      </div>
      <MiniPlayer
        song={currentSong}
        songs={recommendations.map((item) => item.song)}
        onSongChange={(song) => setCurrentSongId(song.id)}
        onPlaybackError={() => showToast("歌曲播放失败，请稍后重试")}
        variant="playlist"
      />
      <div className="recommendation-list">
        {recommendations.length ? (
          recommendations.map((item) => (
            <RecommendationItem
              key={item.id}
              item={item}
              active={item.song.id === currentSong?.id}
              onSelect={() => setCurrentSongId(item.song.id)}
              onMore={() => setDeleteRecId(item.id)}
            />
          ))
        ) : (
          <div className="empty-state">
            <h2>{t.emptyTitle}</h2>
            <p>{t.emptyDescription}</p>
          </div>
        )}
      </div>
      <div className="bottom-actions">
        <Button
          onClick={async () => {
            if (current) await shareService.copyShareLink(current.id);
            showToast("分享链接已复制");
          }}
        >
          {t.share}
        </Button>
      </div>
      {deleteRecId ? (
        <ConfirmModal
          title={t.deleteSongTitle}
          description={t.deleteSongDescription}
          confirmText={t.delete}
          danger
          onCancel={() => setDeleteRecId(null)}
          onConfirm={async () => {
            await playlistService.deleteRecommendation(deleteRecId);
            setDeleteRecId(null);
            reload();
          }}
        />
      ) : null}
      {deletePlaylistOpen ? (
        <ConfirmModal
          title={t.deletePlaylistTitle}
          description={t.deletePlaylistDescription}
          confirmText={t.confirm}
          danger
          hero={deletePlaylistDangerHeroImage}
          onCancel={() => setDeletePlaylistOpen(false)}
          onConfirm={deleteCurrentPlaylist}
        />
      ) : null}
    </MobileFrame>
  );
}

function MyRecommendedSongsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<RecommendedPlaylist[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  useEffect(() => {
    playlistService.listMyRecommendedPlaylists().then((result) => setItems(result.data ?? []));
  }, []);
  return (
    <MobileFrame>
      <PageHeader title={figmaTexts.myRecommended.title} />
      <div className="playlist-tabs">
        <button type="button" onClick={() => navigate("/playlist")}>
          {figmaTexts.playlist.myRequests}
        </button>
        <button className="active" type="button">
          {figmaTexts.playlist.myRecommended}
        </button>
      </div>
      <div className="recommended-cards">
        {items.map((item) => (
          <article key={item.id} className="recommended-card" onClick={() => navigate(item.isInvalid ? "/invalid-playlist" : `/shared-playlist/${item.requestId}`)}>
            <Cover style={item.requestCoverUrl} />
            <div>
              <strong>{item.requestTitle}</strong>
              <small>{item.updatedAt}</small>
              <p>我推荐的歌曲：{item.recommendedSong.name}</p>
              <p className={expandedId === item.id ? "" : "clamped"}>{item.message}</p>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setExpandedId(expandedId === item.id ? null : item.id);
                }}
              >
                {expandedId === item.id ? figmaTexts.myRecommended.collapse : figmaTexts.myRecommended.expand}
              </button>
            </div>
          </article>
        ))}
      </div>
    </MobileFrame>
  );
}

function SharedPlaylistDetailPage({ showToast }: { showToast: (message: string) => void }) {
  const { id = "request-1" } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState<SongRequest | null>(null);
  const [recommendations, setRecommendations] = useState<SongRecommendation[]>([]);
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);
  const currentSong = recommendations.find((item) => item.song.id === currentSongId)?.song ?? recommendations[0]?.song;
  useEffect(() => {
    requestService.getRequest(id).then((result) => {
      if (!result.data) navigate("/invalid-playlist");
      setRequest(result.data ?? null);
    });
    playlistService.listRecommendations(id).then((result) => {
      const nextRecommendations = result.data ?? [];
      setRecommendations(nextRecommendations);
      setCurrentSongId((selectedId) =>
        selectedId && nextRecommendations.some((item) => item.song.id === selectedId) ? selectedId : nextRecommendations[0]?.song.id ?? null,
      );
    });
  }, [id, navigate]);
  return (
    <MobileFrame className="shared-playlist-detail-page">
      <PageHeader title={figmaTexts.recommend.title} />
      <div className="page-scroll shared-page">
        <RequestCard request={request} meta={figmaTexts.publish.meta} />
        <MiniPlayer
          song={currentSong}
          songs={recommendations.map((item) => item.song)}
          onSongChange={(song) => setCurrentSongId(song.id)}
          onPlaybackError={() => showToast("歌曲播放失败，请稍后重试")}
          variant="playlist"
        />
        <div className="recommendation-list public">
          {recommendations.map((item) => (
            <RecommendationItem
              key={item.id}
              item={item}
              active={item.song.id === currentSong?.id}
              onSelect={() => setCurrentSongId(item.song.id)}
            />
          ))}
        </div>
      </div>
      <div className="bottom-actions">
        <Button
          onClick={async () => {
            await shareService.copyShareLink(id);
            showToast("分享链接已复制");
          }}
        >
          {figmaTexts.playlist.share}
        </Button>
      </div>
    </MobileFrame>
  );
}

function InvalidPlaylistPage() {
  const navigate = useNavigate();
  return (
    <MobileFrame>
      <div className="invalid-state">
        <div className="invalid-hero">
          <img src={invalidPlaylistHeroImage} alt="" aria-hidden="true" />
        </div>
        <h1>{figmaTexts.invalid.title}</h1>
        <p>{figmaTexts.invalid.description}</p>
        <Button onClick={() => navigate("/")}>{figmaTexts.invalid.action}</Button>
      </div>
    </MobileFrame>
  );
}

function RequestCard({ request, meta }: { request: SongRequest | null; meta: string }) {
  return (
    <article className="request-card">
      <Cover style={request?.coverUrl} className="request-cover-thumb" />
      <div>
        <strong>{request?.title ?? figmaTexts.recommend.requestTitle}</strong>
        <small>{request?.isAnonymous ? "来自 匿名用户" : meta}</small>
      </div>
      <span className="request-mood-icon">
        <img src={getMoodSelectedImage(request?.mood)} alt="" aria-hidden="true" />
      </span>
    </article>
  );
}

function RequestCardSkeleton() {
  return (
    <article className="request-card request-card-skeleton" aria-hidden="true">
      <span className="cover request-cover-thumb" />
      <div>
        <span className="skeleton-line strong" />
        <span className="skeleton-line small" />
      </div>
    </article>
  );
}

function Cover({ style, className = "" }: { style?: string; className?: string }) {
  return <span className={`cover ${className}`} style={{ backgroundImage: getCoverBackground(style) }} />;
}

function getCoverBackground(style?: string) {
  if (!style) return "linear-gradient(135deg, #f7d8db, #f9f0c6, #cbe7dd)";
  return style.startsWith("linear-gradient") ? style : `url("${style}")`;
}

function getMoodLabel(mood: MoodOption) {
  const moodValues: MoodOption[] = ["relaxed", "sad", "quiet", "energized", "commute", "alone"];
  const index = moodValues.indexOf(mood);
  return figmaTexts.create.moods[index] ?? figmaTexts.create.moods[0];
}

function getMoodSelectedImage(mood?: MoodOption | null) {
  const value: CreateMoodOption = mood && mood in createMoodImages ? (mood as CreateMoodOption) : "commute";
  return createMoodImages[value].selected;
}

function resolveLocalPlayableSong(song: Song) {
  const localSong = mockSongs.find((item) => item.id === song.id || item.name === song.name);
  return localSong ? { ...song, ...localSong } : song;
}

function truncatePlayerText(value: string | undefined, maxLength = 20) {
  if (!value) return "";
  return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;
}

function SelectedSong({ song, onRemove, showToast }: { song: Song; onRemove: () => void; showToast: (message: string) => void }) {
  const [isPlaying, setPlaying] = useState(false);
  const audioRef = useMemo(() => (typeof Audio === "undefined" ? null : new Audio()), []);

  useEffect(() => {
    if (!audioRef) return undefined;
    audioRef.pause();
    audioRef.currentTime = 0;
    audioRef.src = song.audioUrl ?? "";
    setPlaying(false);

    const handlePause = () => setPlaying(false);
    const handlePlaying = () => setPlaying(true);
    const handleEnded = () => setPlaying(false);
    const handleError = () => {
      setPlaying(false);
      showToast("当前歌曲暂不可播放");
    };

    audioRef.addEventListener("pause", handlePause);
    audioRef.addEventListener("playing", handlePlaying);
    audioRef.addEventListener("ended", handleEnded);
    audioRef.addEventListener("error", handleError);

    return () => {
      audioRef.pause();
      audioRef.removeEventListener("pause", handlePause);
      audioRef.removeEventListener("playing", handlePlaying);
      audioRef.removeEventListener("ended", handleEnded);
      audioRef.removeEventListener("error", handleError);
    };
  }, [audioRef, song.id, song.audioUrl, showToast]);

  const togglePlayback = () => {
    if (!song.audioUrl || !audioRef) {
      showToast("当前歌曲暂不可播放");
      return;
    }
    if (isPlaying) {
      audioRef.pause();
      return;
    }
    audioRef.play().catch(() => {
      setPlaying(false);
      showToast("当前歌曲暂不可播放");
    });
  };

  return (
    <div className="selected-song">
      <Cover style={song.coverUrl} />
      <span>
        <strong>{song.name}</strong>
        <small>
          {song.artist}
          {song.album ? ` · ${song.album}` : ""}
        </small>
      </span>
      <button type="button" onClick={onRemove}>
        ✕
      </button>
      <button type="button" className="selected-song-play" onClick={togglePlayback} aria-label={isPlaying ? "暂停" : "播放"}>
        {isPlaying ? "Ⅱ" : "▶"}
      </button>
    </div>
  );
}

function MiniPlayer({
  song,
  songs = [],
  onSongChange,
  onPlaybackError,
  variant = "default",
}: {
  song?: Song;
  songs?: Song[];
  onSongChange?: (song: Song) => void;
  onPlaybackError?: () => void;
  variant?: "default" | "playlist";
}) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useMemo(() => (typeof Audio === "undefined" ? null : new Audio()), []);
  const playbackAttemptedRef = useRef(false);
  const hasPlaylist = songs.length > 0;
  const currentSongIndex = song ? songs.findIndex((item) => item.id === song.id) : -1;
  const playerSongName = truncatePlayerText(song?.name) || "暂无歌曲推荐";
  const playerMetaText = song ? truncatePlayerText(`${song.artist}${song.album ? ` · ${song.album}` : ""}`) : "分享歌单后等待朋友推荐";

  const switchPlaylistSong = (direction: "previous" | "next") => {
    if (!hasPlaylist) return;
    const activeIndex = currentSongIndex >= 0 ? currentSongIndex : 0;
    const nextIndex =
      direction === "next" ? (activeIndex + 1) % songs.length : (activeIndex - 1 + songs.length) % songs.length;
    setProgress(0);
    onSongChange?.(songs[nextIndex]);
  };
  const togglePlaylistPlayback = () => {
    if (!song) return;
    if (!song.audioUrl) {
      setPlaying(false);
      onPlaybackError?.();
      return;
    }
    playbackAttemptedRef.current = true;
    setPlaying((value) => !value);
  };

  useEffect(() => {
    setProgress(0);
    playbackAttemptedRef.current = false;
    if (audioRef) {
      audioRef.pause();
      audioRef.currentTime = 0;
      if (song?.audioUrl) {
        audioRef.src = song.audioUrl;
      } else {
        audioRef.removeAttribute("src");
      }
      if (playing && song?.audioUrl) {
        playbackAttemptedRef.current = true;
        audioRef.play().catch(() => {
          setPlaying(false);
          onPlaybackError?.();
        });
      }
    }
  }, [song?.id]);

  useEffect(() => {
    if (variant !== "playlist" || !audioRef) return undefined;

    const syncProgress = () => {
      const duration = audioRef.duration || song?.duration || 0;
      setProgress(duration ? Math.min(100, (audioRef.currentTime / duration) * 100) : 0);
    };
    const handleEnded = () => {
      setProgress(0);
      switchPlaylistSong("next");
    };
    const handleError = () => {
      setPlaying(false);
      if (playbackAttemptedRef.current) onPlaybackError?.();
    };

    audioRef.addEventListener("timeupdate", syncProgress);
    audioRef.addEventListener("loadedmetadata", syncProgress);
    audioRef.addEventListener("ended", handleEnded);
    audioRef.addEventListener("error", handleError);

    return () => {
      audioRef.removeEventListener("timeupdate", syncProgress);
      audioRef.removeEventListener("loadedmetadata", syncProgress);
      audioRef.removeEventListener("ended", handleEnded);
      audioRef.removeEventListener("error", handleError);
    };
  }, [audioRef, song?.id, song?.duration, variant, currentSongIndex, songs, onPlaybackError]);

  useEffect(() => {
    if (variant !== "playlist" || !audioRef) return;
    if (!song?.audioUrl) {
      setPlaying(false);
      setProgress(0);
      return;
    }
    if (playing) {
      playbackAttemptedRef.current = true;
      audioRef.play().catch(() => {
        setPlaying(false);
        onPlaybackError?.();
      });
    } else {
      audioRef.pause();
    }
  }, [audioRef, playing, song?.audioUrl, variant, onPlaybackError]);

  useEffect(() => {
    return () => {
      audioRef?.pause();
    };
  }, [audioRef]);

  if (variant === "playlist") {
    return (
      <div className={`mini-player figma-mini-player ${song ? "" : "disabled"}`}>
        <div className="mini-player-controls">
          <button type="button" onClick={() => switchPlaylistSong("previous")} disabled={!song || !hasPlaylist} aria-label="上一首">
            <img src={skipPreviousIcon} alt="" aria-hidden="true" />
          </button>
          <button type="button" onClick={togglePlaylistPlayback} disabled={!song} aria-label={playing ? "暂停" : "播放"}>
            {playing ? "Ⅱ" : "▶"}
          </button>
          <button type="button" onClick={() => switchPlaylistSong("next")} disabled={!song || !hasPlaylist} aria-label="下一首">
            <img src={skipNextIcon} alt="" aria-hidden="true" />
          </button>
        </div>
        <span className="mini-player-thumb" style={{ backgroundImage: getCoverBackground(song?.coverUrl) }} />
        <span className="mini-player-copy">
          <strong>{playerSongName}</strong>
          <small>{playerMetaText}</small>
        </span>
        <span className="mini-player-progress" aria-hidden="true">
          <i style={{ transform: `scaleX(${progress / 100})` }} />
        </span>
      </div>
    );
  }
  return (
    <div className={`mini-player ${song ? "" : "disabled"}`}>
      <button type="button" onClick={() => setPlaying(!playing)} disabled={!song}>
        {playing ? "Ⅱ" : "▶"}
      </button>
      <Cover style={song?.coverUrl} />
      <span>
        <strong>{playerSongName}</strong>
        <small>{playerMetaText}</small>
      </span>
    </div>
  );
}

function RecommendationItem({
  item,
  onMore,
  onSelect,
  active,
}: {
  item: SongRecommendation;
  onMore?: () => void;
  onSelect?: () => void;
  active?: boolean;
}) {
  return (
    <article className={`recommendation-item ${active ? "active" : ""}`} onClick={onSelect}>
      <Cover style={item.song.coverUrl} />
      <div>
        <strong>{item.song.name}</strong>
        <small>
          {item.song.artist}
          {item.song.album ? ` · ${item.song.album}` : ""}
        </small>
        <p>
          @{item.isAnonymous ? "匿名用户" : item.recommenderName}：{item.reason || "TA 没有填写推荐理由"}
        </p>
      </div>
      {onMore ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onMore();
          }}
        >
          ⋯
        </button>
      ) : null}
    </article>
  );
}

function ConfirmModal({
  title,
  description,
  confirmText,
  danger,
  hero,
  onCancel,
  onConfirm,
}: {
  title: string;
  description: string;
  confirmText: string;
  danger?: boolean;
  hero?: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="overlay">
      <div className="confirm-modal">
        {hero ? (
          <div className="danger-hero">
            <img src={hero} alt="" aria-hidden="true" />
          </div>
        ) : null}
        <h2>{title}</h2>
        <p>{description}</p>
        <Button variant={danger ? "danger" : "primary"} onClick={onConfirm}>
          {confirmText}
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          {figmaTexts.playlist.cancel}
        </Button>
      </div>
    </div>
  );
}

export default App;
