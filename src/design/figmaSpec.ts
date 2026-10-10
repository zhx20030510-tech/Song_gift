export type FigmaTextToken = {
  id: string;
  text: string;
  x: number;
  y: number;
  w: number;
  h: number;
  fontSize: number;
  font: string;
};

export type FigmaFrameSpec = {
  id: string;
  name: string;
  route?: string;
  texts: FigmaTextToken[];
};

export const figmaFile = {
  fileKey: "R9CzSblE94PGVcVu2RptQM",
  sourceUrl:
    "https://www.figma.com/design/R9CzSblE94PGVcVu2RptQM/%E6%8E%A8%E8%8D%90%E4%B8%80%E9%A6%96%E6%AD%8C?node-id=0-1&p=f&t=IWUqTwM9CTo4tkk2-0",
  canvas: { width: 390, height: 844, radius: 28 },
};

export const figmaTokens = {
  colors: {
    page: "#fcfbfb",
    pageWarm: "#fbfafb",
    ink: "#080808",
    softInk: "#737373",
    primary: "#040404",
    panel: "#ffffff",
    mutedPanel: "#e4e4e4",
    overlay: "rgba(0, 0, 0, 0.55)",
    danger: "#e35a4f",
    accent: "#f3c5cb",
    green: "#cbe7dd",
  },
  radii: {
    frame: 28,
    card: 22,
    button: 28,
    input: 12,
    pill: 999,
  },
  shadows: {
    card: "0 8px 24px rgba(0, 0, 0, 0.10)",
    modal: "0 8px 24px rgba(0, 0, 0, 0.10)",
  },
  typography: {
    family: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    pageTitle: { fontSize: 24, fontWeight: 700 },
    largeTitle: { fontSize: 35, fontWeight: 700 },
    sectionTitle: { fontSize: 18, fontWeight: 700 },
    cardTitle: { fontSize: 20, fontWeight: 700 },
    body: { fontSize: 15, fontWeight: 400 },
    meta: { fontSize: 12, fontWeight: 400 },
    tiny: { fontSize: 10, fontWeight: 400 },
    button: { fontSize: 18, fontWeight: 500 },
  },
};

export const figmaTexts = {
  welcome: {
    login: "立即登录",
    register: "注册",
    footer: "Powered by Cleve, Bianca, Iwan",
    loginTitle: "登录你的账号",
    registerTitle: "注册你的账号",
    email: "邮箱",
    nickname: "昵称",
    password: "密码",
    confirmPassword: "确认密码",
  },
  home: {
    createTitle: "创建歌单",
    createDescription: "发起求推歌曲需求，让好友参与推荐吧～",
    playlistTitle: "推歌记录",
    playlistDescription: "查看被推的歌曲合集 / 查看参与的推歌需求",
    communityTitle: "推歌社区",
    communityBadge: "功能建设中",
  },
  create: {
    title: "发布歌单邀请",
    demandTitle: "我的歌曲需求",
    demandPlaceholder: "有没有适合下班后一个人坐地铁听的歌？",
    counter: "0 / 20",
    moodTitle: "此刻心情",
    coverTitle: "图片封面",
    uploadCover: "＋ 上传封面",
    reasonPublic: "推荐理由互相可见",
    reasonPublicHint: "开启后，其他用户能看到彼此的推荐歌曲和推荐理由",
    anonymous: "匿名发布",
    cancel: "取消",
    publish: "✦  发布",
    chooseAgain: "重新选择",
    confirm: "确定",
    moods: ["轻松", "低落", "安静", "充电", "通勤", "想独处"],
  },
  publish: {
    title: "发布成功",
    subtitle: "请分享给朋友让他们推荐歌曲吧",
    share: "分享链接给朋友",
    record: "查看推歌记录",
    meta: "来自 @咩咩是只羊",
  },
  recommend: {
    title: "送TA一首歌",
    requestTitle: "有没有适合下班后一个人坐地铁听的歌？",
    meta: "来自 @咩咩是只羊",
    songTitle: "推荐歌曲",
    searchPlaceholder: "搜索歌曲、歌手或专辑",
    reasonTitle: "推荐理由",
    reasonPlaceholder: "这首歌很有力量感",
    reasonCounter: "0 / 30",
    anonymous: "匿名推荐",
    anonymousHint: "开启后，其他用户无法看到你的身份",
    submit: "✦  提交推荐",
    selectedSong: "Sounds of Rain",
    selectedArtist: "Seonni · Midnight Album",
    successTitle: "推荐成功",
    successDescription: "你的歌曲已加入 TA 的歌单",
    successAction: "查看歌单",
  },
  playlist: {
    title: "我的音乐礼盒",
    myRequests: "我收到的歌",
    myRecommended: "我送出的歌",
    share: "分享歌单",
    requestTitle: "有没有适合下班后一个人坐地铁听的歌？",
    songCount: "共4首歌",
    time: "2小时前",
    emptyTitle: "还没有朋友推荐歌曲",
    emptyDescription: "快把歌单需求分享给朋友，让他们给你塞一首歌。",
    deleteSongTitle: "确认删除这首推荐曲？",
    deleteSongDescription: "删除后，这首歌和推荐理由将从歌单中移除",
    deletePlaylistTitle: "删除歌单",
    deletePlaylistDescription: "确定要删除此歌单吗？",
    delete: "删除",
    confirm: "确认",
    cancel: "取消",
  },
  myRecommended: {
    title: "我的音乐礼盒",
    expand: "展开",
    collapse: "收起",
  },
  invalid: {
    title: "歌单不存在或已失效",
    description: "可能已被删除、链接过期，或当前暂时无法访问。",
    action: "回到首页",
  },
};

export const figmaFrames: Record<string, FigmaFrameSpec> = {
  welcome: {
    id: "3:17",
    name: "Page / WelcomePage / 起始页",
    route: "/welcome",
    texts: [
      { id: "3:20", text: figmaTexts.welcome.login, x: 77, y: 721, w: 90, h: 22, fontSize: 18, font: "Inter Medium" },
      { id: "3:22", text: figmaTexts.welcome.register, x: 226, y: 721, w: 90, h: 22, fontSize: 18, font: "Inter Medium" },
      { id: "3:23", text: figmaTexts.welcome.footer, x: 92, y: 805, w: 210, h: 15, fontSize: 12, font: "Inter Regular" },
    ],
  },
  home: {
    id: "3:91",
    name: "Page / HomePage / 首页",
    route: "/",
    texts: [
      { id: "3:102", text: figmaTexts.home.createTitle, x: 132, y: 535, w: 110, h: 24, fontSize: 20, font: "Inter Bold" },
      { id: "3:108", text: figmaTexts.home.playlistTitle, x: 132, y: 621, w: 110, h: 24, fontSize: 20, font: "Inter Bold" },
      { id: "3:113", text: figmaTexts.home.communityTitle, x: 127, y: 714, w: 110, h: 24, fontSize: 20, font: "Inter Bold" },
    ],
  },
  create: { id: "3:116", name: "Page / CreateRequestPage / 创建求推歌需求", route: "/create", texts: [] },
  publish: { id: "3:288", name: "Page / PublishSuccessPage / 发布成功", route: "/publish-success/:id", texts: [] },
  recommend: { id: "3:306", name: "Page / RecommendSongPage / 给朋友推荐歌曲页", route: "/recommend/:id", texts: [] },
  playlist: { id: "3:472", name: "Page / MyPlaylistRecordPage / 我的视角推歌记录页", route: "/playlist", texts: [] },
  shared: { id: "3:799", name: "Page / SharedPlaylistDetailPage / 他人视角歌单详情页", route: "/shared-playlist/:id", texts: [] },
  recommended: { id: "3:844", name: "Page / MyRecommendedSongsPage / 我推荐的歌曲页", route: "/my-recommended-songs", texts: [] },
  invalid: { id: "3:945", name: "Page / InvalidPlaylistPage / 歌单不存在失效页", route: "/invalid-playlist", texts: [] },
};
