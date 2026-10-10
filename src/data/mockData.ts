import type { RecommendedPlaylist, Song, SongRecommendation, SongRequest } from "../types";
import beginAgainCover from "../assets/albums/begin-again.png";
import blueGlassCover from "../assets/albums/blue-glass.jpg";
import firstLoveCover from "../assets/albums/first-love.png";
import hateThatIMadeYouLoveMeCover from "../assets/albums/hate-that-i-made-you-love-me.png";
import koufukuronCover from "../assets/albums/koufukuron.jpg";
import lemonadeCover from "../assets/albums/lemonade.png";
import loveAndKiwiCover from "../assets/albums/love-and-kiwi.jpg";
import magneticCover from "../assets/albums/magnetic.png";
import meihaodeCover from "../assets/albums/meihaode.webp";
import newSoulCover from "../assets/albums/new-soul.webp";
import notYetLoversCover from "../assets/albums/not-yet-lovers.jpg";
import offSeasonZooCover from "../assets/albums/off-season-zoo.jpg";
import qiyueForestCover from "../assets/albums/qiyue-forest.jpg";
import rainyDayCover from "../assets/albums/rainy-day.jpg";
import secretLoveCover from "../assets/albums/secret-love.jpg";
import theOtherSideOfParadiseCover from "../assets/albums/the-other-side-of-paradise.jpg";
import timeMachineCover from "../assets/albums/time-machine.jpg";
import ukinaCover from "../assets/albums/ukina.jpg";
import wuBaiCover from "../assets/albums/wu-bai.webp";
import zaiShengLianCover from "../assets/albums/zai-sheng-lian.webp";
import betweenTodayAndTomorrowAudio from "../assets/audio/between-today-and-tomorrow.mp3";
import blueGlassAudio from "../assets/audio/blue-glass.mp3";
import firstLoveAudio from "../assets/audio/first-love.mp3";
import hateThatIMadeYouLoveMeAudio from "../assets/audio/hate-that-i-made-you-love-me.mp3";
import koufukuronAudio from "../assets/audio/koufukuron.mp3";
import lemonadeAudio from "../assets/audio/lemonade.mp3";
import loveAndKiwiAudio from "../assets/audio/love-and-kiwi.mp3";
import magneticAudio from "../assets/audio/magnetic.mp3";
import meihaodeAudio from "../assets/audio/meihaode.mp3";
import newSoulAudio from "../assets/audio/yael-naim-new-soul.mp3";
import notYetLoversAudio from "../assets/audio/not-yet-lovers.mp3";
import offSeasonZooAudio from "../assets/audio/off-season-zoo.mp3";
import qiyueForestAudio from "../assets/audio/qiyue-forest.mp3";
import rainyDayAudio from "../assets/audio/rainy-day.mp3";
import secretLoveAudio from "../assets/audio/secret-love.mp3";
import theOtherSideOfParadiseAudio from "../assets/audio/the-other-side-of-paradise.mp3";
import timeMachineAudio from "../assets/audio/time-machine.mp3";
import wanFengAudio from "../assets/audio/wu-bai-wan-feng.mp3";
import defaultRequestCover from "../assets/figma/default-request-cover.png";

export const mockCovers = {
  default: defaultRequestCover,
  night: "linear-gradient(135deg, #1f2937 0%, #3b4254 48%, #d6b3a5 100%)",
  sunny: "linear-gradient(135deg, #ffdf8b 0%, #f7a9a8 50%, #9dd6c5 100%)",
};

export const mockSongs: Song[] = [
  { id: "song-1", name: "晴天", artist: "周杰伦", album: "叶惠美", coverUrl: mockCovers.sunny },
  {
    id: "song-2",
    name: "New Soul",
    artist: "Yael Naim",
    album: "Yael Naim",
    coverUrl: newSoulCover,
    audioUrl: newSoulAudio,
    duration: 225,
  },
  {
    id: "song-3",
    name: "晚风",
    artist: "伍佰",
    album: "爱情的尽头",
    coverUrl: wuBaiCover,
    audioUrl: wanFengAudio,
    duration: 225,
  },
  { id: "song-4", name: "Lost Stars", artist: "Adam Levine", album: "Begin Again", coverUrl: beginAgainCover },
  { id: "song-5", name: "若把你", artist: "Kirsty刘瑾睿", album: "若把你", coverUrl: mockCovers.sunny },
  {
    id: "preset-intp-song-1",
    name: "请求迷失在七月森林",
    artist: "裴德 / 孙盛希",
    album: "离开银色荒原",
    coverUrl: qiyueForestCover,
    audioUrl: qiyueForestAudio,
  },
  {
    id: "preset-intp-song-2",
    name: "幸福论",
    artist: "椎名林檎",
    album: "幸福論",
    coverUrl: koufukuronCover,
    audioUrl: koufukuronAudio,
  },
  {
    id: "preset-intp-song-3",
    name: "the other side of paradise",
    artist: "Glass Animals",
    album: "How To Be A Human Being",
    coverUrl: theOtherSideOfParadiseCover,
    audioUrl: theOtherSideOfParadiseAudio,
  },
  {
    id: "preset-intp-song-4",
    name: "蓝玻璃",
    artist: "驼儿",
    album: "旧晴",
    coverUrl: blueGlassCover,
    audioUrl: blueGlassAudio,
  },
  {
    id: "preset-intp-song-5",
    name: "time machine (feat. aren park)",
    artist: "mj apanay / aren park",
    album: "Seen 11:23 Pm - EP",
    coverUrl: timeMachineCover,
    audioUrl: timeMachineAudio,
  },
  {
    id: "preset-crush-song-1",
    name: "恋人未满",
    artist: "S.H.E",
    album: "女生宿舍",
    coverUrl: notYetLoversCover,
    audioUrl: notYetLoversAudio,
  },
  {
    id: "preset-crush-song-2",
    name: "暗恋",
    artist: "陶喆",
    album: "69乐章",
    coverUrl: secretLoveCover,
    audioUrl: secretLoveAudio,
  },
  {
    id: "preset-crush-song-3",
    name: "爱与奇异果",
    artist: "王菀之",
    album: "王菀之首张国语创作专辑",
    coverUrl: loveAndKiwiCover,
    audioUrl: loveAndKiwiAudio,
  },
  {
    id: "preset-crush-song-4",
    name: "淡季动物园°",
    artist: "许光汉",
    album: "许光汉 Greg Han",
    coverUrl: offSeasonZooCover,
    audioUrl: offSeasonZooAudio,
  },
  {
    id: "preset-crush-song-5",
    name: "下雨天",
    artist: "南拳妈妈",
    album: "优の良曲南搞小孩",
    coverUrl: rainyDayCover,
    audioUrl: rainyDayAudio,
  },
  {
    id: "preset-subway-song-1",
    name: "hate that i made you love me",
    artist: "Ariana Grande",
    album: "Petal",
    coverUrl: hateThatIMadeYouLoveMeCover,
    audioUrl: hateThatIMadeYouLoveMeAudio,
  },
  {
    id: "preset-subway-song-2",
    name: "magnetic",
    artist: "ILLIT",
    album: "SUPER REAL ME",
    coverUrl: magneticCover,
    audioUrl: magneticAudio,
  },
  {
    id: "preset-subway-song-3",
    name: "Lemonade",
    artist: "aespa",
    album: "Armageddon",
    coverUrl: lemonadeCover,
    audioUrl: lemonadeAudio,
  },
  {
    id: "preset-subway-song-4",
    name: "First Love",
    artist: "宇多田光",
    album: "First Love",
    coverUrl: firstLoveCover,
    audioUrl: firstLoveAudio,
  },
  {
    id: "my-rec-seaside-song-meihaode",
    name: "美好的",
    artist: "许哲珮",
    album: "美好的",
    coverUrl: meihaodeCover,
    audioUrl: meihaodeAudio,
  },
  {
    id: "my-rec-seaside-song-between-today-and-tomorrow",
    name: "Between Today and Tomorrow",
    artist: "椎名林檎",
    album: "浮名",
    coverUrl: ukinaCover,
    audioUrl: betweenTodayAndTomorrowAudio,
  },
  {
    id: "my-rec-seaside-song-wan-feng",
    name: "晚风",
    artist: "伍佰",
    album: "晚风",
    coverUrl: wuBaiCover,
    audioUrl: wanFengAudio,
  },
  {
    id: "my-rec-seaside-song-new-soul",
    name: "New Soul",
    artist: "Yael Naim",
    album: "Yael Naim",
    coverUrl: newSoulCover,
    audioUrl: newSoulAudio,
  },
  {
    id: "my-rec-happy-invalid-song-zai-sheng-lian",
    name: "再生恋",
    artist: "林忆莲",
    album: "再生恋",
    coverUrl: zaiShengLianCover,
  },
];

const songById = (id: string) => mockSongs.find((song) => song.id === id)!;

export const initialRequests: SongRequest[] = [
  {
    id: "preset-intp-favorite",
    title: "求INTP推一首自己喜欢的歌",
    description: "想听听 INTP 会反复回到哪一首歌。",
    creatorName: "咩咩是只羊",
    coverUrl: qiyueForestCover,
    mood: "relaxed",
    isReasonPublic: true,
    isAnonymous: false,
    createdAt: "2天前",
    recommendationCount: 5,
  },
  {
    id: "preset-crush-songs",
    title: "求全是暗恋类歌曲的歌单",
    description: "想收集那些没说出口、但一听就懂的歌。",
    creatorName: "咩咩是只羊",
    coverUrl: notYetLoversCover,
    mood: "commute",
    isReasonPublic: true,
    isAnonymous: false,
    createdAt: "12小时前",
    recommendationCount: 5,
  },
  {
    id: "preset-after-work-subway",
    title: "有没有适合下班后一个人坐地铁听的歌？",
    description: "想在下班后的地铁里，给自己留一点安静的时间。",
    creatorName: "咩咩是只羊",
    coverUrl: hateThatIMadeYouLoveMeCover,
    mood: "commute",
    isReasonPublic: true,
    isAnonymous: false,
    createdAt: "1天前",
    recommendationCount: 4,
  },
  {
    id: "preset-seaside-walk",
    title: "急求一个海边散步歌单",
    description: "想要适合海边散步时慢慢听的歌。",
    creatorName: "咩咩是只羊",
    coverUrl: meihaodeCover,
    mood: "relaxed",
    isReasonPublic: true,
    isAnonymous: false,
    createdAt: "4小时前",
    recommendationCount: 4,
  },
];

export const initialRecommendations: SongRecommendation[] = [
  {
    id: "preset-intp-rec-1",
    requestId: "preset-intp-favorite",
    song: mockSongs[5],
    reason: "适合一个人安静听，很有画面感。",
    recommenderName: "小熊汽水",
    isAnonymous: false,
    createdAt: "2天前",
  },
  {
    id: "preset-intp-rec-2",
    requestId: "preset-intp-favorite",
    song: mockSongs[6],
    reason: "旋律和情绪都很特别，适合慢慢听。",
    recommenderName: "晚风邮差",
    isAnonymous: false,
    createdAt: "2天前",
  },
  {
    id: "preset-intp-rec-3",
    requestId: "preset-intp-favorite",
    song: mockSongs[7],
    reason: "节奏很抓人，适合在情绪复杂的时候听。",
    recommenderName: "蓝色热带鱼",
    isAnonymous: false,
    createdAt: "2天前",
  },
  {
    id: "preset-intp-rec-4",
    requestId: "preset-intp-favorite",
    song: mockSongs[8],
    reason: "声音很轻，适合安静、低饱和的心情。",
    recommenderName: "旧日放映机",
    isAnonymous: false,
    createdAt: "2天前",
  },
  {
    id: "preset-intp-rec-5",
    requestId: "preset-intp-favorite",
    song: mockSongs[9],
    reason: "像把人拉回某个旧时刻，适合怀旧的时候听。",
    recommenderName: "凌晨两点半",
    isAnonymous: false,
    createdAt: "2天前",
  },
  {
    id: "preset-crush-rec-1",
    requestId: "preset-crush-songs",
    song: mockSongs[10],
    reason: "那种暧昧又没说出口的感觉，很适合这个歌单。",
    recommenderName: "柠檬海盐",
    isAnonymous: false,
    createdAt: "12小时前",
  },
  {
    id: "preset-crush-rec-2",
    requestId: "preset-crush-songs",
    song: mockSongs[11],
    reason: "很适合放在暗恋主题里，情绪细腻但不直白。",
    recommenderName: "月亮迟到",
    isAnonymous: false,
    createdAt: "12小时前",
  },
  {
    id: "preset-crush-rec-3",
    requestId: "preset-crush-songs",
    song: mockSongs[12],
    reason: "有一点轻盈，也有一点奇怪的浪漫感。",
    recommenderName: "芒果乌龙",
    isAnonymous: false,
    createdAt: "12小时前",
  },
  {
    id: "preset-crush-rec-4",
    requestId: "preset-crush-songs",
    song: mockSongs[13],
    reason: "很适合一个人发呆，情绪松弛但有余味。",
    recommenderName: "薄荷云朵",
    isAnonymous: false,
    createdAt: "12小时前",
  },
  {
    id: "preset-crush-rec-5",
    requestId: "preset-crush-songs",
    song: mockSongs[14],
    reason: "下雨天必备，旋律一出来就很有代入感。",
    recommenderName: "雨季限定",
    isAnonymous: false,
    createdAt: "12小时前",
  },
  {
    id: "preset-subway-rec-1",
    requestId: "preset-after-work-subway",
    song: mockSongs[15],
    reason: "有点心碎但很抓耳，适合反复想起一个人的时候听。",
    recommenderName: "月亮迟到",
    isAnonymous: false,
    createdAt: "1天前",
  },
  {
    id: "preset-subway-rec-2",
    requestId: "preset-after-work-subway",
    song: mockSongs[16],
    reason: "旋律很轻快，像突然被喜欢的人吸过去一样。",
    recommenderName: "草莓气泡水",
    isAnonymous: false,
    createdAt: "1天前",
  },
  {
    id: "preset-subway-rec-3",
    requestId: "preset-after-work-subway",
    song: mockSongs[17],
    reason: "力量感很强，适合需要给自己充电的时候听。",
    recommenderName: "咩咩是只羊",
    isAnonymous: false,
    createdAt: "1天前",
  },
  {
    id: "preset-subway-rec-4",
    requestId: "preset-after-work-subway",
    song: mockSongs[18],
    reason: "经典到不用解释，很适合回想某段很久以前的关系。",
    recommenderName: "旧日放映机",
    isAnonymous: false,
    createdAt: "1天前",
  },
  {
    id: "my-rec-seaside-rec-1",
    requestId: "preset-seaside-walk",
    song: songById("my-rec-seaside-song-meihaode"),
    reason: "旋律很柔软，适合一个人慢慢整理心情的时候听。",
    recommenderName: "薄荷云朵",
    isAnonymous: false,
    createdAt: "4小时前",
  },
  {
    id: "my-rec-seaside-rec-2",
    requestId: "preset-seaside-walk",
    song: songById("my-rec-seaside-song-between-today-and-tomorrow"),
    reason: "有一种介于今天和明天之间的漂浮感，很适合夜晚听。",
    recommenderName: "旧日放映机",
    isAnonymous: false,
    createdAt: "4小时前",
  },
  {
    id: "my-rec-seaside-rec-3",
    requestId: "preset-seaside-walk",
    song: songById("my-rec-seaside-song-wan-feng"),
    reason: "像傍晚吹到一点点甜的风，很适合慢慢走回家。",
    recommenderName: "小熊汽水",
    isAnonymous: false,
    createdAt: "2小时前",
  },
  {
    id: "my-rec-seaside-rec-4",
    requestId: "preset-seaside-walk",
    song: songById("my-rec-seaside-song-new-soul"),
    reason: "轻快、干净，适合给通勤路上换一个新的心情。",
    recommenderName: "柠檬海盐",
    isAnonymous: false,
    createdAt: "4小时前",
  },
];

export const initialRecommendedPlaylists: RecommendedPlaylist[] = [
  {
    id: "my-rec-seaside-walk",
    ownerUserId: "user-demo",
    requestId: "preset-seaside-walk",
    requestTitle: "急求一个海边散步歌单",
    requestCoverUrl: meihaodeCover,
    recommendedSong: songById("my-rec-seaside-song-meihaode"),
    message: "旋律很柔软，适合一个人慢慢整理心情的时候听。",
    updatedAt: "4小时前",
  },
  {
    id: "my-rec-happy-invalid",
    ownerUserId: "user-demo",
    requestId: "invalid-happy-mood",
    requestTitle: "有没有让人一听就心情变好的歌",
    requestCoverUrl: zaiShengLianCover,
    recommendedSong: songById("my-rec-happy-invalid-song-zai-sheng-lian"),
    message: "有一种隔世重逢的宿命感，适合放在暧昧、旧情和命中注定的歌单里。",
    updatedAt: "2小时前",
    isInvalid: true,
  },
];
