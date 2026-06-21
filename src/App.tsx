/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Flame, Award, CheckCircle, Send, Smartphone, Mail, Bell, Settings, 
  Share2, LogOut, User, Dumbbell, Sparkles, Lock, Watch, Tv, Compass, 
  Activity, Heart, MessageSquare, Plus, Minus, ChevronRight, Info, Check, PlusCircle, Trash2, Apple, Calendar, Wrench, Globe
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, WorkoutRoutine, FoodLogItem, Achievement, LeaderboardEntry, ChatMessage, WearableDevice } from "./types";
import { INITIAL_LEADERBOARD, INITIAL_ACHIEVEMENTS, WEARABLE_TEMPLATES, generateWorkoutPlan, generateDietProfile, DEFAULT_MEAL_LOGS } from "./data";
import { MuscularLogo } from "./components/MuscularLogo";

const LOCALIZATION_DICTIONARY = {
  US: {
    welcome: "Lazy Zone",
    tagline: "Minimum effort, targeted results. Track & play.",
    dashboard: "Dashboard",
    workouts: "Workout Routine",
    diet: "Nutrition & Diet",
    doubtBot: "Grok-Trainer",
    doubtBotSub: "Chatbot for Posture & Food prep",
    greeting: "Welcome, athlete!",
    streak: "Active Streak: 3 Days 🔥",
    calories: "Calories",
    protein: "Protein",
    carbs: "Carbs",
    fat: "Fat",
    weight: "Weight",
    height: "Height",
    age: "Age",
    experienceLevel: "Training Experience",
    occupation: "What do you do in life?",
    createProfile: "Create Athlete Profile",
    launchAccount: "Launch Account",
    socialSignIn: "Social Sign-In Channels",
    countryLabel: "Country & Dialect Style",
    askPrompt: "Ask: deadlift form, healthy egg-protein prep...",
    trainerNotice: "Grok Chatbot for instant doubts clarifying. Give me anything to debug!",
    fresher: "Fresher",
    intermediate: "Intermediate",
    experienced: "Experienced",
    backtrack: "Back"
  },
  UK: {
    welcome: "Lazy Zone UK",
    tagline: "Absolute minimum faff, proper results. Splendid tracking, chap.",
    dashboard: "Tally Board",
    workouts: "Proper Sessions",
    diet: "Grub & Nourishment",
    doubtBot: "Grok-Guv'nor",
    doubtBotSub: "Chit-chat for postures & healthy bakes",
    greeting: "Smashing performance, mate!",
    streak: "Glorious Streak: 3 Off-Days 🔥",
    calories: "Kcal Burn",
    protein: "Proper Protein",
    carbs: "Carbohydrates",
    fat: "Fats & Oils",
    weight: "Mass (Stones/kg)",
    height: "Stature (cm)",
    age: "Years of Age",
    experienceLevel: "Grit Level",
    occupation: "Your Daily Graft or Trade?",
    createProfile: "Mint your Gym Profile, Chap",
    launchAccount: "Let's Crack On",
    socialSignIn: "British & Social Login Portals",
    countryLabel: "Regional Dialect & Style",
    askPrompt: "Ask: deadlift form chap, egg bake preps...",
    trainerNotice: "Grok chat box for instant doubt resolution. Put your queries, mate!",
    fresher: "Fresher",
    intermediate: "Intermediate",
    experienced: "Experienced Chaps",
    backtrack: "Retrieve"
  },
  IN: {
    welcome: "Lazy Zone India",
    tagline: "Kam mehnat, jordaar asar! Easy tracking and fun workouts.",
    dashboard: "Apna Dashboard",
    workouts: "Daily Workout Plan",
    diet: "Apna Khaana & Diet Balance",
    doubtBot: "Grok-Guru AI",
    doubtBotSub: "Posture check and easy Indian diet advice",
    greeting: "Badhiya speed hai, boss!",
    streak: "Bawaal Streak: 3 Days 🔥",
    calories: "Energy (Kcal)",
    protein: "Protein Intake",
    carbs: "Carby Carbohydrates",
    fat: "Fat & Ghee balance",
    weight: "Vajan (Weight in kg)",
    height: "Height (cm)",
    age: "Umar (Age in years)",
    experienceLevel: "Fitness Level Selector",
    occupation: "Kaam-Dhandha ya Student?",
    createProfile: "Apna Profile Create Karo Dost",
    launchAccount: "Chalo Shuru Karein",
    socialSignIn: "Quick Social Login Platforms",
    countryLabel: "Bhasha aur Desh Layout",
    askPrompt: "Pucho: deadlift form, boiled egg preps...",
    trainerNotice: "Instant doubts solution with Grok-Guru. Chinta mat karo, pucho!",
    fresher: "Fresher (Naya at Gym)",
    intermediate: "Intermediate (Theek-Thak)",
    experienced: "Experienced (Pro level)",
    backtrack: "Piche Chalo"
  },
  ES: {
    welcome: "Lazy Zone España",
    tagline: "Mínimo esfuerzo, resultados óptimos. Rápido y fácil.",
    dashboard: "Panel de Actividad",
    workouts: "Mis Entrenamientos",
    diet: "Comidas y Macros",
    doubtBot: "Instructor Grok",
    doubtBotSub: "Dudas de posturas y preparación de comida",
    greeting: "¡Hola campeón! Que gusto verte.",
    streak: "Racha Activa: 3 Días 🔥",
    calories: "Calorías",
    protein: "Proteínas",
    carbs: "Carbohidratos",
    fat: "Grasas",
    weight: "Peso (kg)",
    height: "Altura (cm)",
    age: "Edad",
    experienceLevel: "Nivel de Experiencia",
    occupation: "¿A qué te dedicas en la vida? (Profesión)",
    createProfile: "Crear Cuenta de Atleta",
    launchAccount: "Iniciar Sesión",
    socialSignIn: "Vías de Acceso Rápido",
    countryLabel: "País e Idioma del Sistema",
    askPrompt: "Pregunta: postura peso muerto, preparación sana...",
    trainerNotice: "Chatbot Grok para solución instantánea de dudas.",
    fresher: "Nuevo / Fresher",
    intermediate: "Intermedio",
    experienced: "Con Experiencia",
    backtrack: "Volver"
  },
  AU: {
    welcome: "Lazy Zone AU",
    tagline: "Fair dinkum results with zero sweat. Track ya activity.",
    dashboard: "Main Deck",
    workouts: "Hard Yakka (Exercises)",
    diet: "Daily Tucker (Diet & Grub)",
    doubtBot: "Grok-Cobber AI",
    doubtBotSub: "Doubt solver for form and cold tinnies",
    greeting: "Onya mate! Smashing it!",
    streak: "Ripper Streak: 3 Days 🔥",
    calories: "Burned Joules/Kcal",
    protein: "Tucker Muscle Protein",
    carbs: "Carbs / Spuds",
    fat: "Fats & Oils",
    weight: "Heavy-ness (kg)",
    height: "Vertical (cm)",
    age: "Age (Years)",
    experienceLevel: "Sporting Competence",
    occupation: "What's your daily graft?",
    createProfile: "Lock In New Aussie Profile",
    launchAccount: "Crack Open Account",
    socialSignIn: "Fair Shake Logins",
    countryLabel: "Dialect Context Selector",
    askPrompt: "Ask: hard deadlifts, healthy tucker...",
    trainerNotice: "Grok chatbot for instant doubts. Have a yarn with us, mate!",
    fresher: "Fresher / Green",
    intermediate: "Intermediate",
    experienced: "Experienced Bloke",
    backtrack: "Go Back"
  },
  FR: {
    welcome: "La Zone Paresseuse",
    tagline: "Minimum d'effort, résultats ciblés. Suivez & Jouez.",
    dashboard: "Tableau de Bord",
    workouts: "Séance d'Entraînement",
    diet: "Nutrition & Régime",
    doubtBot: "Grok-Entraîneur",
    doubtBotSub: "Analyse postures & repas sains",
    greeting: "Bienvenue à bord, athlète !",
    streak: "Série Active : 3 Jours 🔥",
    calories: "Calories",
    protein: "Protéines",
    carbs: "Glucides",
    fat: "Lipides",
    weight: "Poids (kg)",
    height: "Taille (cm)",
    age: "Âge",
    experienceLevel: "Expérience Sportive",
    occupation: "Quelle est votre profession ?",
    createProfile: "Créer le Profil d'Athlète",
    launchAccount: "Lancer le Compte",
    socialSignIn: "Connexions Sociales Rapides",
    countryLabel: "Paramètres de Dialecte Pays",
    askPrompt: "Demander : posture squat, œufs brouillés protéinés...",
    trainerNotice: "Assistant Grok pour clarifier toutes vos interrogations physiques !",
    fresher: "Débutant",
    intermediate: "Intermédiaire",
    experienced: "Expérimenté",
    backtrack: "Retour"
  },
  DE: {
    welcome: "Faule Zone",
    tagline: "Minimaler Aufwand, maximale Ergebnisse. Tracken & Trainieren.",
    dashboard: "Armaturenbrett",
    workouts: "Trainingsroutine",
    diet: "Ernährung & Diät",
    doubtBot: "Grok-Trainer",
    doubtBotSub: "Analyse für Postur & Kochen",
    greeting: "Willkommen, Athlet!",
    streak: "Aktuelle Serie: 3 Tage 🔥",
    calories: "Kalorien",
    protein: "Proteine",
    carbs: "Kohlenhydrate",
    fat: "Fett",
    weight: "Gewicht (kg)",
    height: "Größe (cm)",
    age: "Alter",
    experienceLevel: "Trainingserfahrung",
    occupation: "Was machen Sie beruflich?",
    createProfile: "Athletenprofil Erstellen",
    launchAccount: "Konto Starten",
    socialSignIn: "Soziale Anmeldekanäle",
    countryLabel: "Land & Dialekt-Stil",
    askPrompt: "Fragen zur Kniebeuge, gesunde Eiweiß-Rezepte...",
    trainerNotice: "Grok Chatbot für sofortige Klärung sportlicher Zweifel!",
    fresher: "Anfänger",
    intermediate: "Fortgeschritten",
    experienced: "Erfahren",
    backtrack: "Zurück"
  },
  IT: {
    welcome: "Zona Pigra",
    tagline: "Minimo sforzo, risultati mirati. Monitora & Allena.",
    dashboard: "Pannello d'Attività",
    workouts: "Programma d'Allenamento",
    diet: "Alimentazione & Dieta",
    doubtBot: "Grok-Allenatore",
    doubtBotSub: "Domande su esercizi & ricette sane",
    greeting: "Benvenuto, atleta!",
    streak: "Serie Attiva: 3 Giorni 🔥",
    calories: "Calorie",
    protein: "Proteine",
    carbs: "Carboidrati",
    fat: "Grassi",
    weight: "Peso (kg)",
    height: "Altezza (cm)",
    age: "Età",
    experienceLevel: "Livello d'Esperienza",
    occupation: "Qual è il tuo lavoro?",
    createProfile: "Crea Profilo Atleta",
    launchAccount: "Inizia Ora",
    socialSignIn: "Canali di Accesso Social",
    countryLabel: "Paese & Stile Grafico",
    askPrompt: "Chiedi: esecuzione stacco, ricette uova proteiche...",
    trainerNotice: "Chatbot Grok pronto a risolvere qualsiasi dubbio istantaneamente!",
    fresher: "Principiante",
    intermediate: "Intermedio",
    experienced: "Esperto",
    backtrack: "Indietro"
  },
  PT: {
    welcome: "Zona Preguiçosa",
    tagline: "Mínimo esforço, resultados focados. Registe & Treine.",
    dashboard: "Painel Principal",
    workouts: "Rotina de Treino",
    diet: "Nutrição & Dieta",
    doubtBot: "Grok-Instritor AI",
    doubtBotSub: "Dúvidas de postura & preparação alimentar",
    greeting: "Bem-vindo, atleta!",
    streak: "Sequência Ativa: 3 Dias 🔥",
    calories: "Calorias",
    protein: "Proteína",
    carbs: "Hidratos",
    fat: "Gorduras",
    weight: "Peso (kg)",
    height: "Altura (cm)",
    age: "Idade",
    experienceLevel: "Experiência de Treino",
    occupation: "Qual é a sua profissão?",
    createProfile: "Criar Perfil de Atleta",
    launchAccount: "Iniciar Atividade",
    socialSignIn: "Canais de Autenticação Social",
    countryLabel: "Estilo Regional & Dialeto",
    askPrompt: "Perguntar: postura peso morto, refeições fit...",
    trainerNotice: "Grok Chatbot para esclarecer todas as suas dúvidas desportivas num instante!",
    fresher: "Iniciante",
    intermediate: "Intermédio",
    experienced: "Experiente",
    backtrack: "Voltar"
  },
  JP: {
    welcome: "レイジー・ゾーン",
    tagline: "最小限の労力で、的確な結果を。記録＆プレイ。",
    dashboard: "ダッシュボード",
    workouts: "ワークアウトメニュー",
    diet: "栄養と食事의記録",
    doubtBot: "GrokトレーナーAI",
    doubtBotSub: "専門フォーム指導とヘルシー自炊提案",
    greeting: "ようこそ、アスリート！",
    streak: "アクティブ維持: 3日間 🔥",
    calories: "カロリー摂取",
    protein: "タンパク質",
    carbs: "炭水化物",
    fat: "脂質",
    weight: "体重 (kg)",
    height: "身長 (cm)",
    age: "年齢",
    experienceLevel: "トレーニング経験",
    occupation: "ご職業は何ですか？",
    createProfile: "選手登録プロファイルを新規作成",
    launchAccount: "アカウントを起動",
    socialSignIn: "ソーシャル連携連携ログイン",
    countryLabel: "選択されている国・地域の方言",
    askPrompt: "質問例: デッドリフト時の腰の角度, 卵料理プロテインレシピ...",
    trainerNotice: "Grokチャットがトレーニング姿勢や調理知識、マクロ配分の疑問を即解決！",
    fresher: "未経験・初心者",
    intermediate: "中級者",
    experienced: "上級・プロレベル",
    backtrack: "戻る"
  },
  KR: {
    welcome: "레이지 존 (Lazy Zone)",
    tagline: "최소한의 노력으로 확실한 성과를. 간편한 기록과 운동.",
    dashboard: "개인 대시보드",
    workouts: "커스텀 트레이닝 플랜",
    diet: "식단 및 영양소 관리",
    doubtBot: "Grok-트레이너 AI",
    doubtBotSub: "올바른 자세 교정 및 맞춤 식단 컨설팅",
    greeting: "환영합니다, 아슬리트님!",
    streak: "연속 활성 일수: 3일 🔥",
    calories: "칼로리 소모",
    protein: "단백질 확보",
    carbs: "탄수화물",
    fat: "지방 배율",
    weight: "체중 (kg)",
    height: "신장 (cm)",
    age: "연령",
    experienceLevel: "트레이닝 숙련도",
    occupation: "현재 참여 중인 커리어/직업?",
    createProfile: "아슬리트 신규 프로필 작성",
    launchAccount: "계정 시작하기",
    socialSignIn: "소셜 계정 빠른 연동",
    countryLabel: "시스템 지역 및 언어 배율",
    askPrompt: "데드리프트 무릎 위치, 운동 전 달걀 단백질 섭취법...",
    trainerNotice: "의문나는 즉시 자세 코치 마스터 Grok에게 편히 물어보세요!",
    fresher: "초보 인턴",
    intermediate: "중 레벨",
    experienced: "프로 스포츠맨",
    backtrack: "이전으로"
  },
  RU: {
    welcome: "Ленивая Зона",
    tagline: "Минимум усилий, максимальный фокус. Трек & Играй.",
    dashboard: "Панель активности",
    workouts: "План тренировок",
    diet: "Питание & Диета",
    doubtBot: "Grok-Тренер",
    doubtBotSub: "Помощь по технике упражнений и рецептам",
    greeting: "Добро пожаловать, атлет!",
    streak: "Активная серия: 3 дня 🔥",
    calories: "Калории",
    protein: "Белки",
    carbs: "Углеводы",
    fat: "Жиры",
    weight: "Вес (кг)",
    height: "Рост (см)",
    age: "Возраст",
    experienceLevel: "Опыт тренировок",
    occupation: "Кто вы по профессии?",
    createProfile: "Создать профиль спортсмена",
    launchAccount: "Активировать аккаунт",
    socialSignIn: "Авторизация через соцсети",
    countryLabel: "Региональный стиль и диалект",
    askPrompt: "Спросите: техника становой тяги, белковые рецепты...",
    trainerNotice: "Чат-бот Grok ответит на ваши вопросы по упражнениям и фитнес-кулинарии в реальном времени!",
    fresher: "Новичок",
    intermediate: "Любитель",
    experienced: "Профессионал",
    backtrack: "Назад"
  },
  AR: {
    welcome: "منطقة الكسول",
    tagline: "أقل مجهود، أفضل نتائج في تتبع ورعاية لياقتك.",
    dashboard: "لوحة التحكم الرئيسية",
    workouts: "برنامج تدريباتك الرياضية",
    diet: "الغذاء ووصفات المغغذيات",
    doubtBot: "خبير جروك الرياضي",
    doubtBotSub: "استفسارات الوضعيات البدنية وإعداد الوجبات",
    greeting: "أهلاً بك يا بطل!",
    streak: "سلسلة الحماس النشطة: ٣ أيام 🔥",
    calories: "السعرات الحرارية",
    protein: "البروتين",
    carbs: "الكربوهيدرات",
    fat: "الدهون الصحية",
    weight: "الوزن (كجم)",
    height: "الطول (سم)",
    age: "العمر بالسنوات",
    experienceLevel: "مستوى الخبرة الرياضية",
    occupation: "ما هو مجال عملك أو دراستك؟",
    createProfile: "إنشاء ملف بطل رياضي جديد",
    launchAccount: "بث وتشغيل الحساب",
    socialSignIn: "ممرات الدخول الاجتماعي السريع",
    countryLabel: "الدولة ولهجة لغة النظام",
    askPrompt: "اسأل عن: زوايا الرفعة المميتة، وجبات بروتين خفيفة...",
    trainerNotice: "تفقد فوري للمؤشرات والوضعيات المناسبة بصحبة مدرب الذكاء الاصطناعي الذكي جروك!",
    fresher: "مبتدئ تماماً",
    intermediate: "متوسط الخبرة الأدائية",
    experienced: "مخضرم ورياضي محترف",
    backtrack: "تراجع"
  },
  ZH: {
    welcome: "慵懒健身房",
    tagline: "极简努力，精准收效。轻松打卡与训练。",
    dashboard: "健康仪表盘",
    workouts: "每日动作规划",
    diet: "膳食纤维与营养分配",
    doubtBot: "Grok私人AI教练",
    doubtBotSub: "提供深蹲动作矫正与增肌减脂食谱",
    greeting: "欢迎加入，运动健儿！",
    streak: "连续活跃：3天 🔥",
    calories: "卡路里消耗",
    protein: "高能蛋白质",
    carbs: "复合碳水",
    fat: "必需脂肪",
    weight: "体重 (千克)",
    height: "身高 (厘米)",
    age: "年龄",
    experienceLevel: "抗阻训练经验",
    occupation: "您平时的职业/日常工作？",
    createProfile: "立即生成独家运动员档案",
    launchAccount: "开启全新智能系统",
    socialSignIn: "一键关联社交账号登录",
    countryLabel: "区域和系统语言配置",
    askPrompt: "提问：硬拉的背部发力感觉, 增肌高蛋白食谱...",
    trainerNotice: "Grok人工智能随时回答运动损伤预防、运动姿态、烹饪技巧及营养学知识！",
    fresher: "零基础萌新",
    intermediate: "进阶老手",
    experienced: "专业运动员级",
    backtrack: "返回上级"
  }
};

const ALL_SYSTEM_LANGUAGES = [
  { code: "US", label: "English 🇺🇸", desc: "US/Standard" },
  { code: "UK", label: "English 🇬🇧", desc: "British English" },
  { code: "ES", label: "Español 🇪🇸", desc: "Spanish" },
  { code: "IN", label: "हिन्दी 🇮🇳", desc: "Hindi (Indian Standard)" },
  { code: "FR", label: "Français 🇫🇷", desc: "French" },
  { code: "DE", label: "Deutsch 🇩🇪", desc: "German" },
  { code: "IT", label: "Italiano 🇮🇹", desc: "Italian" },
  { code: "PT", label: "Português 🇵🇹", desc: "Portuguese" },
  { code: "JP", label: "日本語 🇯🇵", desc: "Japanese" },
  { code: "KR", label: "한국어 🇰🇷", desc: "Korean" },
  { code: "RU", label: "Русский 🇷🇺", desc: "Russian" },
  { code: "AR", label: "العربية 🇸🇦", desc: "Arabic" },
  { code: "ZH", label: "中文 🇨🇳", desc: "Chinese (Mandarin)" }
];

const COMPREHENSIVE_COUNTRIES = [
  { code: "US", flag: "🇺🇸", label: "United States (US)" },
  { code: "UK", flag: "🇬🇧", label: "United Kingdom (UK)" },
  { code: "IN", flag: "🇮🇳", label: "India (IN)" },
  { code: "ES", flag: "🇪🇸", label: "Spain (ES)" },
  { code: "AU", flag: "🇦🇺", label: "Australia (AU)" },
  { code: "CA", flag: "🇨🇦", label: "Canada (CA)" },
  { code: "DE", flag: "🇩🇪", label: "Germany (DE)" },
  { code: "FR", flag: "🇫🇷", label: "France (FR)" },
  { code: "IT", flag: "🇮🇹", label: "Italy (IT)" },
  { code: "BR", flag: "🇧🇷", label: "Brazil (BR)" },
  { code: "MX", flag: "🇲🇽", label: "Mexico (MX)" },
  { code: "JP", flag: "🇯🇵", label: "Japan (JP)" },
  { code: "KR", flag: "🇰🇷", label: "South Korea (KR)" },
  { code: "NZ", flag: "🇳🇿", label: "New Zealand (NZ)" },
  { code: "SG", flag: "🇸🇬", label: "Singapore (SG)" },
  { code: "ZA", flag: "🇿🇦", label: "South Africa (ZA)" },
  { code: "AE", flag: "🇦🇪", label: "United Arab Emirates (AE)" },
  { code: "CH", flag: "🇨🇭", label: "Switzerland (CH)" },
  { code: "NL", flag: "🇳🇱", label: "Netherlands (NL)" },
  { code: "SE", flag: "🇸🇪", label: "Sweden (SE)" },
  { code: "NO", flag: "🇳🇴", label: "Norway (NO)" },
  { code: "FI", flag: "🇫🇮", label: "Finland (FI)" },
  { code: "DK", flag: "🇩🇰", label: "Denmark (DK)" },
  { code: "IE", flag: "🇮🇪", label: "Ireland (IE)" },
  { code: "AR", flag: "🇦🇷", label: "Argentina (AR)" },
  { code: "CO", flag: "🇨🇴", label: "Colombia (CO)" },
  { code: "CL", flag: "🇨🇱", label: "Chile (CL)" },
  { code: "PE", flag: "🇵🇪", label: "Peru (PE)" },
  { code: "RU", flag: "🇷🇺", label: "Russia (RU)" },
  { code: "SA", flag: "🇸🇦", label: "Saudi Arabia (SA)" },
  { code: "TR", flag: "🇹🇷", label: "Turkey (TR)" },
  { code: "EG", flag: "🇪🇬", label: "Egypt (EG)" },
  { code: "NG", flag: "🇳🇬", label: "Nigeria (NG)" },
  { code: "KE", flag: "🇰🇪", label: "Kenya (KE)" },
  { code: "ID", flag: "🇮🇩", label: "Indonesia (ID)" },
  { code: "TH", flag: "🇹🇭", label: "Thailand (TH)" },
  { code: "VN", flag: "🇻🇳", label: "Vietnam (VN)" },
  { code: "MY", flag: "🇲🇾", label: "Malaysia (MY)" },
  { code: "PH", flag: "🇵🇭", label: "Philippines (PH)" },
  { code: "CN", flag: "🇨🇳", label: "China (CN)" }
];

export default function App() {
  // --- AUTH STATE ---
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const logged = localStorage.getItem("lazy_zone_logged") === "true";
    const savedProfile = localStorage.getItem("lazy_zone_profile");
    if (!logged || !savedProfile) {
      localStorage.removeItem("lazy_zone_logged");
      return false;
    }
    try {
      const profile = JSON.parse(savedProfile);
      const hasRequiredFields = !!profile?.email && !!profile?.name;
      if (!hasRequiredFields) {
        localStorage.removeItem("lazy_zone_logged");
      }
      return logged && hasRequiredFields;
    } catch {
      localStorage.removeItem("lazy_zone_logged");
      return false;
    }
  });
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [authEmail, setAuthEmail] = useState<string>("");
  const [authPhone, setAuthPhone] = useState<string>("");
  const [authName, setAuthName] = useState<string>("");
  const [authPassword, setAuthPassword] = useState<string>("");
  const [recoverySent, setRecoverySent] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");

  // --- APP STATE ---
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("lazy_zone_profile");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.language) parsed.language = "US";
      if (!parsed.lastLoginDate) parsed.lastLoginDate = new Date().toISOString().split("T")[0];
      return parsed;
    }
    return {
      id: "user-current",
      name: "Mouni (Manager)",
      email: "mouni123on@gmail.com",
      phone: "+91 98765 43210",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      onboarded: false,
      weight: 70,
      height: 170,
      age: 25,
      gender: "Male",
      goal: "build_muscle",
      dietPreference: "high_protein",
      activityLevel: "moderately_active",
      experienceLevel: "fresher",
      equipment: ["gym", "dumbbells"],
      dailyCaloriesTarget: 2200,
      dailyProteinTarget: 140,
      dailyCarbsTarget: 210,
      dailyFatTarget: 60,
      remindersEnabled: true,
      reminderChannel: "both",
      reminderTimeMeal: "08:30",
      reminderTimeWorkout: "17:30",
      occupation: "Software Engineer",
      countryStyle: "US",
      language: "US",
      lastLoginDate: new Date().toISOString().split("T")[0],
      lastRoutineCompletionDate: undefined
    };
  });

  // --- MANAGER CONTROL STATE OVERRIDES ---
  const [customAppName, setCustomAppName] = useState<string>(() => {
    return localStorage.getItem("lazy_zone_custom_app_name") || "";
  });
  const [logoColorTheme, setLogoColorTheme] = useState<string>(() => {
    return localStorage.getItem("lazy_zone_logo_color_theme") || "lime";
  });
  const [globalBanner, setGlobalBanner] = useState<string>(() => {
    return localStorage.getItem("lazy_zone_global_banner") || "Manager Mouni is live! Invite team contacts or push production updates.";
  });
  const [isManagerModalOpen, setIsManagerModalOpen] = useState<boolean>(false);
  const [managerUpdatesLog, setManagerUpdatesLog] = useState<string[]>(() => {
    return ["Sys start: Live synchronization enabled.", "Manager authorization checks passed."];
  });
  const [newCompetitorName, setNewCompetitorName] = useState<string>("");
  const [newCompetitorPoints, setNewCompetitorPoints] = useState<number>(1200);
  const [newCompetitorStreak, setNewCompetitorStreak] = useState<number>(4);
  const [newCompetitorCountry, setNewCompetitorCountry] = useState<string>("US");
  const [langSearch, setLangSearch] = useState<string>("");
  const [countrySearch, setCountrySearch] = useState<string>("");

  // Manager Custom Badge addition inputs
  const [newBadgeTitle, setNewBadgeTitle] = useState<string>("");
  const [newBadgeDesc, setNewBadgeDesc] = useState<string>("");
  const [newBadgeTarget, setNewBadgeTarget] = useState<number>(5);

  // Custom device link & pairing inputs
  const [isAddingDevice, setIsAddingDevice] = useState<boolean>(false);
  const [newDevName, setNewDevName] = useState<string>("");
  const [newDevType, setNewDevType] = useState<'Watch' | 'Smartphone' | 'Compass'>('Watch');

  const [activeTab, setActiveTab] = useState<'dashboard' | 'workouts' | 'diet' | 'social'>('dashboard');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const t = (LOCALIZATION_DICTIONARY as any)[profile.language || "US"] || LOCALIZATION_DICTIONARY.US;
  const [routines, setRoutines] = useState<WorkoutRoutine[]>([]);
  const [mealLogs, setMealLogs] = useState<FoodLogItem[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [wearables, setWearables] = useState<WearableDevice[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState<string>("");
  const [userKey, setUserKey] = useState<string>("");
  const [isGrokTyping, setIsGrokTyping] = useState<boolean>(false);
  
  // Custom dialogs/toasts states
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: 'success' | 'info' | 'alert' } | null>(null);
  const [showShareModal, setShowShareModal] = useState<WorkoutRoutine | null>(null);
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [isSyncingWearable, setIsSyncingWearable] = useState<string | null>(null);
  const [notificationsHistory, setNotificationsHistory] = useState<any[]>([]);

  // Form states for manual additions
  const [newMealName, setNewMealName] = useState<string>("");
  const [newMealCals, setNewMealCals] = useState<string>("");
  const [newMealProtein, setNewMealProtein] = useState<string>("");
  const [newMealCarbs, setNewMealCarbs] = useState<string>("");
  const [newMealFat, setNewMealFat] = useState<string>("");
  const [newMealType, setNewMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>("snack");

  const [newExerciseName, setNewExerciseName] = useState<string>("");
  const [newExerciseSets, setNewExerciseSets] = useState<string>("3");
  const [newExerciseReps, setNewExerciseReps] = useState<string>("10");
  const [newExerciseWeight, setNewExerciseWeight] = useState<string>("");
  const [targetRoutineId, setTargetRoutineId] = useState<string>("");

  const [waterDrunk, setWaterDrunk] = useState<number>(3); // Cups
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- OFFLINE PERSISTENCE MANAGEMENT ---
  useEffect(() => {
    // 1. Load meals
    const savedMeals = localStorage.getItem("lazy_zone_meals");
    if (savedMeals) {
      setMealLogs(JSON.parse(savedMeals));
    } else {
      setMealLogs(DEFAULT_MEAL_LOGS);
    }

    // 2. Load routines
    const savedRoutines = localStorage.getItem("lazy_zone_routines");
    if (savedRoutines) {
      setRoutines(JSON.parse(savedRoutines));
    } else {
      setRoutines(generateWorkoutPlan(profile.experienceLevel, profile.equipment, profile.goal));
    }
  }, []);

  // Save changes to local state storage automatically
  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem("lazy_zone_profile", JSON.stringify(profile));
    }
  }, [profile, isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem("lazy_zone_meals", JSON.stringify(mealLogs));
    }
  }, [mealLogs, isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem("lazy_zone_routines", JSON.stringify(routines));
    }
  }, [routines, isLoggedIn]);

  // Handle local state onboarding updates
  useEffect(() => {
    if (isLoggedIn && profile.onboarded) {
      const generatedRoutines = generateWorkoutPlan(profile.experienceLevel, profile.equipment, profile.goal);
      const diet = generateDietProfile(profile.goal, profile.dietPreference, profile.weight);
      
      const updatedProfile = {
        ...profile,
        dailyCaloriesTarget: diet.calories,
        dailyProteinTarget: diet.macros.protein,
        dailyCarbsTarget: diet.macros.carbs,
        dailyFatTarget: diet.macros.fat
      };
      
      setRoutines(generatedRoutines);
      setProfile(updatedProfile);
    }
  }, [profile.onboarded, profile.goal, profile.dietPreference, profile.experienceLevel, profile.weight, isLoggedIn]);

  // Load secondary indicators (achievements, leaderboard, etc) from localStorage
  useEffect(() => {
    const savedAchievements = localStorage.getItem("lazy_zone_achievements");
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    } else {
      setAchievements(INITIAL_ACHIEVEMENTS);
    }

    const savedLeaderboard = localStorage.getItem("lazy_zone_leaderboard");
    if (savedLeaderboard) {
      setLeaderboard(JSON.parse(savedLeaderboard));
    } else {
      setLeaderboard(INITIAL_LEADERBOARD);
    }

    const savedWearables = localStorage.getItem("lazy_zone_wearables");
    if (savedWearables) {
      setWearables(JSON.parse(savedWearables));
    } else {
      setWearables(WEARABLE_TEMPLATES);
    }

    const savedChat = localStorage.getItem("lazy_zone_chat");
    if (savedChat) {
      setChatMessages(JSON.parse(savedChat));
    } else {
      setChatMessages([
        { id: "wel-grok", sender: "assistant", content: "Hey! I am **Grok-Trainer**, your direct health doubts clarification sentinel. Ask me anything about physical exercise postures (like Deadlifts/Squats), food preparations, or macro allocations instantly. Have a secure xAI key? Input it in settings above!", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }

    fetchNotificationLogs();
  }, []);

  // Sync state helpers
  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem("lazy_zone_achievements", JSON.stringify(achievements));
    }
  }, [achievements, isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem("lazy_zone_leaderboard", JSON.stringify(leaderboard));
    }
  }, [leaderboard, isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem("lazy_zone_wearables", JSON.stringify(wearables));
    }
  }, [wearables, isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem("lazy_zone_chat", JSON.stringify(chatMessages));
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isLoggedIn]);

  const getIsoDate = (date: Date) => date.toISOString().split("T")[0];
  const parseIsoDate = (isoDate?: string) => {
    if (!isoDate) return undefined;
    const [year, month, day] = isoDate.split("-").map(Number);
    return new Date(year, month - 1, day);
  };
  const diffDaysBetween = (fromIso?: string, toIso?: string) => {
    const from = parseIsoDate(fromIso);
    const to = parseIsoDate(toIso);
    if (!from || !to) return null;
    const diff = Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const [loginReminderSentForDate, setLoginReminderSentForDate] = useState<string>(() => {
    return localStorage.getItem("lazy_zone_login_reminder_sent_for") || "";
  });

  const sendAutoLoginReminder = async () => {
    if (!profile.remindersEnabled) return;
    const recipientEmail = profile.email;
    const recipientPhone = profile.phone;
    const channels = profile.reminderChannel === "both" ? ["email", "phone"] : [profile.reminderChannel];
    const message = `We miss you at Lazy Zone! Log in now to keep your streak alive and continue earning points.`;

    for (const channel of channels) {
      const recipient = channel === "phone" ? recipientPhone : recipientEmail;
      if (!recipient) continue;
      try {
        const res = await fetch("/api/send-reminder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipient,
            channel,
            type: "loginReminder",
            message,
          })
        });
        if (res.ok) {
          fetchNotificationLogs();
        }
      } catch (err) {
        console.error("Auto login reminder failed:", err);
      }
    }
  };

  useEffect(() => {
    const reminderDate = profile.lastLoginDate;
    const today = getIsoDate(new Date());
    const daysOff = diffDaysBetween(reminderDate, today);

    if (!isLoggedIn && profile.remindersEnabled && reminderDate && daysOff !== null && daysOff >= 1 && loginReminderSentForDate !== reminderDate) {
      sendAutoLoginReminder();
      setLoginReminderSentForDate(reminderDate);
      localStorage.setItem("lazy_zone_login_reminder_sent_for", reminderDate);
    }
  }, [isLoggedIn, profile.lastLoginDate, profile.remindersEnabled, loginReminderSentForDate]);

  const triggerToast = (title: string, desc: string, type: 'success' | 'info' | 'alert' = 'success') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => setToastMessage(null), 5000);
  };

  const fetchNotificationLogs = async () => {
    try {
      const res = await fetch("/api/notifications/logs");
      if (res.ok) {
        const data = await res.json();
        setNotificationsHistory(data);
      }
    } catch (err) {
      console.error("Error reading notifications history logs:", err);
    }
  };

  // --- ACTIONS ---
  
  // Offline Auth integration
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.includes("@") || authPassword.length < 5) {
      setAuthError("Please provide a valid email structure and password of at least 5 characters.");
      return;
    }
    setAuthError("");
    setIsLoggedIn(true);
    localStorage.setItem("lazy_zone_logged", "true");
    const today = new Date().toISOString().split("T")[0];
    
    // Save last user info and login date
    const updated = {
      ...profile,
      email: authEmail,
      phone: authPhone || profile.phone || "+91 98765 43210",
      name: authName || profile.name || "Mouni (Manager)",
      lastLoginDate: today
    };
    setProfile(updated);
    localStorage.setItem("lazy_zone_profile", JSON.stringify(updated));
    triggerToast("Authentication Approved", `Welcome back, ${updated.name}!`, "success");
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.includes("@") || authPassword.length < 5) {
      setAuthError("Email must be valid and password at least 5 indices.");
      return;
    }
    setAuthError("");
    const today = new Date().toISOString().split("T")[0];
    
    const newProfile: UserProfile = {
      ...profile,
      id: "user-current",
      email: authEmail,
      phone: authPhone,
      name: authName || "Athlete",
      onboarded: false, // Force onboarding diagnostics collection
      lastLoginDate: today,
      lastRoutineCompletionDate: undefined
    };

    setProfile(newProfile);
    localStorage.setItem("lazy_zone_profile", JSON.stringify(newProfile));
    setIsLoggedIn(true);
    localStorage.setItem("lazy_zone_logged", "true");
    triggerToast("Account Spawned!", "Let's complete your athlete diagnostic survey next.", "info");
  };

  const handleRecover = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoverySent(true);
    triggerToast("Link Dispatched", `A recovery secure link has been generated for ${authEmail}. Check your inbox!`, "info");
  };

  const handleSocialLogin = (provider: string) => {
    triggerToast(`${provider} Link Init`, `Connecting to your secure ${provider} profile...`, "info");
    setTimeout(() => {
      const isGoogle = provider === "Google";
      const isApple = provider === "Apple";
      
      const newAvatarUrl = isGoogle 
        ? "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80"
        : isApple 
          ? "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80"
          : "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80";

      const today = new Date().toISOString().split("T")[0];
      const updated = {
        ...profile,
        name: isGoogle ? "Google Athlete" : isApple ? "Apple Athlete" : "Strava Rider",
        email: isGoogle ? "google.athlete@gmail.com" : isApple ? "apple.athlete@icloud.com" : "strava.rider@strava.com",
        avatarUrl: newAvatarUrl,
        onboarded: true,
        lastLoginDate: today
      };
      setProfile(updated);
      localStorage.setItem("lazy_zone_profile", JSON.stringify(updated));
      setIsLoggedIn(true);
      localStorage.setItem("lazy_zone_logged", "true");
      triggerToast("Social Sync Success", `Logged in securely with your ${provider} account!`, "success");
    }, 1200);
  };

  const handleLogOut = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("lazy_zone_logged");
    triggerToast("Logged Out Successfully", "Your session parameters have been cleared safely.", "info");
  };

  const handleLocalPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate that it is an image
    if (!file.type.startsWith("image/")) {
      triggerToast("Invalid File Type", "Please choose a valid image file from your gallery.", "alert");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result as string;
      const updated = { ...profile, avatarUrl: b64 };
      setProfile(updated);
      localStorage.setItem("lazy_zone_profile", JSON.stringify(updated));
      triggerToast("Photo Set", "Your custom local photo has been successfully loaded from your gallery!", "success");
    };
    reader.onerror = () => {
      triggerToast("Upload Failed", "Could not read the selected image file.", "alert");
    };
    reader.readAsDataURL(file);
  };

  // Submit onboarding diagnostics
  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...profile,
      onboarded: true
    };
    setProfile(updated);
    localStorage.setItem("lazy_zone_profile", JSON.stringify(updated));
    triggerToast("Custom Plan Compiled!", "Exercises, calories, and macros successfully personalized.", "success");
  };

  // Log physical exercise completions (Increments scores, triggers gamified milestones)
  const toggleExerciseComplete = (routineId: string, exerciseId: string) => {
    let completedCountChange = 0;
    
    // Check if the current routine was already completed before this toggle
    const currentRoutineBefore = routines.find(r => r.id === routineId);
    const wasAlreadyCompleted = currentRoutineBefore 
      ? currentRoutineBefore.exercises.length > 0 && currentRoutineBefore.exercises.every(e => e.completed)
      : false;

    const updatedRoutines = routines.map(r => {
      if (r.id === routineId) {
        return {
          ...r,
          exercises: r.exercises.map(ex => {
            if (ex.id === exerciseId) {
              const prev = ex.completed;
              completedCountChange = prev ? -1 : 1;
              return { ...ex, completed: !prev };
            }
            return ex;
          })
        };
      }
      return r;
    });

    setRoutines(updatedRoutines);
    
    if (completedCountChange > 0) {
      // Award points per completed rep
      updateUserLeaderboardPoints(15);
      triggerToast("Rep Completed! 🏋️", "Earned 15 ranking points to your weekly leaderboard score.", "success");
      
      // Check if routine/plan is now completely finished
      const currentRoutineAfter = updatedRoutines.find(r => r.id === routineId);
      const isNowCompleted = currentRoutineAfter 
        ? currentRoutineAfter.exercises.length > 0 && currentRoutineAfter.exercises.every(e => e.completed)
        : false;

      if (isNowCompleted && !wasAlreadyCompleted) {
        const today = getIsoDate(new Date());
        const lastDate = profile.lastRoutineCompletionDate;
        const daysSinceLast = diffDaysBetween(lastDate, today);
        const currentStreak = leaderboard.find(l => l.isCurrentUser)?.streak || 0;
        const nextStreak = lastDate && daysSinceLast === 1 ? currentStreak + 1 : 1;

        setLeaderboard(prev => prev.map(l => {
          if (!l.isCurrentUser) return l;
          const nextPt = l.points + 100;
          const updated = {
            ...l,
            points: nextPt,
            streak: nextStreak,
            workoutsThisWeek: l.workoutsThisWeek + 1
          };
          return updated;
        }));

        const updatedProfile = { ...profile, lastRoutineCompletionDate: today };
        setProfile(updatedProfile);
        localStorage.setItem("lazy_zone_profile", JSON.stringify(updatedProfile));

        const streakMessage = lastDate && daysSinceLast === 1
          ? "Nice! You kept your streak alive with a fresh workout today."
          : lastDate && daysSinceLast !== 1
            ? "Your streak has been reset, but your progress is back on track!"
            : "Great first streak day! Keep going tomorrow to build momentum.";

        triggerToast("Plan Routine Complete! 🎉🏆", `${streakMessage} +100 bonus XP!`, "success");

        if (nextStreak >= 3) {
          stepAchievementProgress("ach-streak-1", 3);
        }
        if (nextStreak >= 5) {
          stepAchievementProgress("ach-streak-5", 5);
        }
      }

      // Update achievements
      stepAchievementProgress("ach-work-1", 1);
      stepAchievementProgress("ach-work-10", 1);
    }
  };

  const updateUserLeaderboardPoints = (pt: number) => {
    const updated = leaderboard.map(l => {
      if (l.isCurrentUser) {
        const nextPt = l.points + pt;
        return { ...l, points: nextPt };
      }
      return l;
    });
    setLeaderboard(updated);
  };

  // Unlock achievements iteratively
  const stepAchievementProgress = (id: string, amount: number) => {
    setAchievements(prev => 
      prev.map(ach => {
        if (ach.id === id && !ach.unlocked) {
          const nextProg = Math.min(ach.target, ach.progress + amount);
          const nowUnlocked = nextProg >= ach.target;
          if (nowUnlocked) {
            triggerToast(`Milestone Unlocked: ${ach.title}! 🏆`, ach.description, "success");
          }
          return {
            ...ach,
            progress: nextProg,
            unlocked: nowUnlocked,
            unlockedAt: nowUnlocked ? new Date().toLocaleDateString() : undefined
          };
        }
        return ach;
      })
    );
  };

  // Add customized recipes or meals manually
  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMealName || !newMealCals) return;

    const newItem: FoodLogItem = {
      id: Math.random().toString(36).substring(7),
      name: newMealName,
      calories: parseInt(newMealCals) || 0,
      protein: parseInt(newMealProtein) || 0,
      carbs: parseInt(newMealCarbs) || 0,
      fat: parseInt(newMealFat) || 0,
      mealType: newMealType,
      date: new Date().toISOString().split("T")[0]
    };

    setMealLogs([newItem, ...mealLogs]);
    updateUserLeaderboardPoints(10);
    triggerToast("Meal Logged 🍳", `Successfully added ${newMealName} to your logs. +10 XP!`);
    
    // Clear form inputs
    setNewMealName("");
    setNewMealCals("");
    setNewMealProtein("");
    setNewMealCarbs("");
    setNewMealFat("");

    // Check achievement progress for exact calorie matches or diet completeness
    stepAchievementProgress("ach-diet-1", 1);
  };

  const handleDeleteMeal = (id: string) => {
    setMealLogs(mealLogs.filter(m => m.id !== id));
    triggerToast("Meal Deleted", "Removed from daily intake timeline.", "info");
  };

  // Add custom manual exercises to routine
  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExerciseName || !targetRoutineId) return;

    const newEx = {
      id: Math.random().toString(36).substring(7),
      name: newExerciseName,
      sets: parseInt(newExerciseSets) || 3,
      reps: parseInt(newExerciseReps) || 10,
      weight: newExerciseWeight ? parseFloat(newExerciseWeight) : undefined,
      completed: false,
      category: "custom"
    };

    setRoutines(prev => 
      prev.map(r => {
        if (r.id === targetRoutineId) {
          return { ...r, exercises: [...r.exercises, newEx] };
        }
        return r;
      })
    );

    triggerToast("Exercise Appended", `Added ${newExerciseName} into routine.`, "success");
    setNewExerciseName("");
    setNewExerciseWeight("");
  };

  // Device sync animation & updates
  const connectAndSyncDevice = (deviceId: string) => {
    setIsSyncingWearable(deviceId);
    triggerToast("Accessing wearable sensors", "Initializing communication channels secure handshake...", "info");

    setTimeout(() => {
      setWearables(prev => 
        prev.map(dev => {
          if (dev.id === deviceId) {
            return {
              ...dev,
              connected: !dev.connected,
              lastSync: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
          }
          return dev;
        })
      );
      
      const targetDev = wearables.find(w => w.id === deviceId);
      const isConnecting = !targetDev?.connected;

      setIsSyncingWearable(null);
      
      if (isConnecting) {
        triggerToast("Sync Successful ⌚", `Pulled live calorie, heart rate, and steps data from device!`, "success");
        // Step cyborg status achievement
        stepAchievementProgress("ach-wearable", 1);
        updateUserLeaderboardPoints(30);
      } else {
        triggerToast("Device Severed", "Unlinked sensor connection safely.", "info");
      }
    }, 2000);
  };

  const handleLinkCustomDevice = () => {
    if (!newDevName.trim()) {
      triggerToast("Input Required", "Please specify a device name (e.g., Apple Watch Series 10).", "alert");
      return;
    }

    const randomSteps = Math.floor(Math.random() * 8000) + 4000;
    const randomBurn = Math.floor(Math.random() * 400) + 200;
    const randomHeart = Math.floor(Math.random() * 40) + 65;

    const newDevice: WearableDevice = {
      id: `dev-${Date.now()}`,
      name: newDevName.trim(),
      icon: newDevType,
      connected: true,
      data: {
        steps: randomSteps,
        caloriesBurned: randomBurn,
        heartRate: randomHeart,
        sleepMinutes: 480
      },
      lastSync: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedWearables = [...wearables, newDevice];
    setWearables(updatedWearables);
    localStorage.setItem("lazy_zone_wearables", JSON.stringify(updatedWearables));

    triggerToast("Device Linked 🎉", `Successfully paired "${newDevice.name}" to Lazy Zone tracker networks!`, "success");

    // Award bonus XP metrics!
    stepAchievementProgress("ach-wearable", 1);
    updateUserLeaderboardPoints(50);

    // Reset fields
    setNewDevName("");
    setIsAddingDevice(false);
  };

  // Simulated Alert reminder notifications sent through proxy server
  const sendSimulatedReminder = async (type: 'food' | 'exercise') => {
    const msg = type === "food" 
      ? `Time to refuel, ${profile.name}! Your customizable high-protein preference mandates 40g protein intake block now.`
      : `Rise and grind, ${profile.name}! Grab your ${profile.equipment.join(" or ") || "bodyweight"} and execute your customized ${profile.experienceLevel} routine.`;

    try {
      const res = await fetch("/api/send-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: profile.reminderChannel === "phone" ? profile.phone : profile.email,
          channel: profile.reminderChannel,
          type,
          message: msg
        })
      });

      if (res.ok) {
        const data = await res.json();
        // Trigger instant screen toast mimicking the phone alert
        triggerToast(
          `Alert Sent to ${profile.reminderChannel === 'phone' ? 'Phone' : 'Email'}!`,
          `"${msg.substring(0, 50)}..."`,
          "success"
        );
        fetchNotificationLogs();
      }
    } catch (err) {
      console.error("Failed simulated notification dispatch:", err);
      triggerToast("Alert Failed", "Express server offline or unable to record trigger.", "alert");
    }
  };

  // Grok Chatbot core flow (Calls our server route proxy)
  const sendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      sender: "user",
      content: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsGrokTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg],
          userProfile: profile,
          userKey: userKey
        })
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMsg: ChatMessage = {
          id: Math.random().toString(36).substring(7),
          sender: "assistant",
          content: data.response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setIsGrokTyping(false);
        setChatMessages(prev => [...prev, assistantMsg]);
        triggerToast("Grok-Trainer Replied", `Powered by ${data.engine || 'AI Engine'}`, "success");
      } else {
        throw new Error("Chat response returned bad status");
      }
    } catch (err) {
      setIsGrokTyping(false);
      // Fallback response with beautiful markdown content
      const errorMsg: ChatMessage = {
        id: "err-msg",
        sender: "assistant",
        content: "### Connection Loss alert!\nI couldn't reach the server engine. Let's practice squats in the meantime:\n- Bend knees deeply\n- Neutral spine core braced\n- Knees out!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, errorMsg]);
    }
  };

  // Share customized routines visual simulation
  const shareRoutine = (routine: WorkoutRoutine) => {
    setShowShareModal(routine);
    // Add friend interaction points
    updateUserLeaderboardPoints(25);
    stepAchievementProgress("ach-share", 1);
  };

  // --- CALCULATION LOGICS ---
  const totals = mealLogs.reduce((acc, current) => {
    return {
      cals: acc.cals + current.calories,
      p: acc.p + current.protein,
      c: acc.c + current.carbs,
      f: acc.f + current.fat
    };
  }, { cals: 0, p: 0, c: 0, f: 0 });

  const activeWearableStats = wearables.filter(w => w.connected).reduce((acc, curr) => {
    return {
      steps: acc.steps + curr.data.steps,
      cals: acc.cals + curr.data.caloriesBurned,
      heartRate: Math.max(acc.heartRate, curr.data.heartRate)
    };
  }, { steps: 0, cals: 0, heartRate: 0 });


  // --- MAIN RENDER ROUTER ---
  if (!isLoggedIn) {
    const loginT = (LOCALIZATION_DICTIONARY as any)[profile.language || "US"] || LOCALIZATION_DICTIONARY.US;

    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-4 selection:bg-lime-200">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-10 pb-6 text-center bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-lime-100 text-lime-700 mb-4 shadow-sm">
              <MuscularLogo className="w-10 h-10 text-lime-700" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">lazy zone</h1>
            <p className="text-slate-500 font-medium text-sm mt-1">
              {loginT.tagline}
            </p>
          </div>

          <div className="p-8">
            {authError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-semibold flex items-center gap-2">
                <Info className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* Explicit System Language Selector with Search */}
            <div className="mb-4 p-4 bg-slate-50 rounded-2xl border border-slate-105 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  🌐 Select System Language Choice ({ALL_SYSTEM_LANGUAGES.length} Available)
                </label>
                {langSearch && (
                  <button onClick={() => setLangSearch("")} className="text-[9px] text-lime-600 font-bold hover:underline">
                    Clear
                  </button>
                )}
              </div>
              
              <input
                type="text"
                value={langSearch}
                onChange={e => setLangSearch(e.target.value)}
                placeholder="Search language (e.g. French, German...)"
                className="w-full mb-2.5 px-3 py-1.5 bg-white border border-slate-200 focus:border-slate-400 rounded-xl text-xs outline-none transition-all"
              />

              <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                {ALL_SYSTEM_LANGUAGES.filter(lang => 
                  lang.label.toLowerCase().includes(langSearch.toLowerCase()) || 
                  lang.desc.toLowerCase().includes(langSearch.toLowerCase()) ||
                  lang.code.toLowerCase().includes(langSearch.toLowerCase())
                ).map(lang => {
                  const isSelected = (profile.language || "US") === lang.code;
                  return (
                    <button
                      type="button"
                      key={lang.code}
                      onClick={() => {
                        const updated = { ...profile, language: lang.code };
                        setProfile(updated);
                        localStorage.setItem("lazy_zone_profile", JSON.stringify(updated));
                      }}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-left flex flex-col justify-center cursor-pointer ${
                        isSelected 
                          ? "bg-slate-900 text-white border-slate-950 shadow-sm" 
                          : "bg-white border-slate-150 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <span className="text-xs font-extrabold">{lang.label}</span>
                      <span className={`text-[9.5px] font-normal mt-0.5 ${isSelected ? "text-slate-300" : "text-slate-400"}`}>
                        {lang.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Region / Dialect Country style picker with Search */}
            <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100/80 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  📍 {loginT.countryLabel} ({COMPREHENSIVE_COUNTRIES.length} Available)
                </label>
                {countrySearch && (
                  <button onClick={() => setCountrySearch("")} className="text-[9px] text-lime-600 font-bold hover:underline">
                    Clear
                  </button>
                )}
              </div>

              <input
                type="text"
                value={countrySearch}
                onChange={e => setCountrySearch(e.target.value)}
                placeholder="Search country (e.g. Canada, Germany, Japan...)"
                className="w-full mb-2.5 px-3 py-1.5 bg-white border border-slate-200 focus:border-slate-400 rounded-xl text-xs outline-none transition-all"
              />

              <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
                {COMPREHENSIVE_COUNTRIES.filter(c =>
                  c.label.toLowerCase().includes(countrySearch.toLowerCase()) ||
                  c.code.toLowerCase().includes(countrySearch.toLowerCase())
                ).map(item => {
                  const isSelected = profile.countryStyle === item.code;
                  return (
                    <button
                      type="button"
                      key={item.code}
                      onClick={() => setProfile(prev => ({ ...prev, countryStyle: item.code }))}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-left flex items-center gap-2 ${
                        isSelected 
                          ? "bg-lime-500 text-slate-950 border-lime-600 shadow-sm font-extrabold" 
                          : "bg-white border-slate-150 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <span className="text-sm flex-shrink-0">{item.flag}</span>
                      <span className="text-[10px] truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {authMode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Profile Email</label>
                  <input 
                    type="email" 
                    value={authEmail} 
                    onChange={e => setAuthEmail(e.target.value)}
                    required
                    placeholder="email@domain.com"
                    className="w-full px-4 py-3 bg-slate-50 focus:bg-white border border-slate-200 focus:border-lime-500 rounded-xl text-sm transition-all outline-none"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Security Code</label>
                    <button type="button" onClick={() => setAuthMode('forgot')} className="text-xs text-lime-600 hover:underline font-semibold">Forgot code?</button>
                  </div>
                  <input 
                    type="password" 
                    value={authPassword} 
                    onChange={e => setAuthPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-slate-50 focus:bg-white border border-slate-200 focus:border-lime-500 rounded-xl text-sm transition-all outline-none"
                  />
                </div>
                
                <button type="submit" className="w-full py-3 bg-lime-600 hover:bg-lime-700 active:scale-95 text-white font-bold rounded-xl transition-all shadow-md shadow-lime-100 mt-2">
                  {loginT.launchAccount}
                </button>
              </form>
            )}

            {authMode === 'signup' && (
              <form onSubmit={handleSignup} className="space-y-4">
                {/* SELECT AVATAR OPTION / PRESETS OR LOCAL GALLERY */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-3.5 shadow-xs">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 text-center">
                      Choose Profile Theme (Preset Avatar)
                    </label>
                    <div className="flex justify-around items-center gap-2">
                      {[
                        { id: "default", label: "Athlete", url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" },
                        { id: "google", label: "Google G", url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80" },
                        { id: "apple", label: "Apple ID", url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80" },
                        { id: "beast", label: "Beast Torso", url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80" }
                      ].map(av => {
                        const isSelected = profile.avatarUrl === av.url;
                        return (
                          <button
                            type="button"
                            key={av.id}
                            onClick={() => setProfile(prev => ({ ...prev, avatarUrl: av.url }))}
                            className="flex flex-col items-center gap-1.5 transition-all text-center focus:outline-none"
                          >
                            <div className={`relative p-1 rounded-full text-center ${
                              isSelected ? "ring-2 ring-lime-500 bg-lime-100" : "hover:scale-105"
                            }`}>
                              <img 
                                src={av.url} 
                                alt={av.label} 
                                className="w-10 h-10 rounded-full object-cover shadow-sm bg-white border border-slate-200" 
                              />
                              {isSelected && (
                                <span className="absolute -bottom-1 -right-1 bg-lime-500 text-white rounded-full p-0.5 text-[8px] font-bold">
                                  ✓
                                </span>
                              )}
                            </div>
                            <span className={`text-[10px] font-bold ${
                              isSelected ? "text-lime-700" : "text-slate-500"
                            }`}>
                              {av.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t border-slate-200/50 pt-2.5">
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-2 text-center">
                      📸 OR CHOOSE FROM GALLERY
                    </label>
                    <div className="flex items-center justify-center">
                      <label className="w-full flex items-center justify-center py-2.5 px-4 bg-white hover:bg-slate-100/80 border border-dashed border-slate-200 hover:border-lime-500 rounded-xl cursor-pointer transition-all text-slate-600">
                        <div className="flex items-center gap-2">
                          <Plus className="w-3.5 h-3.5 text-lime-600" />
                          <span className="text-[10.5px] font-bold uppercase tracking-wide text-slate-500">Pick from Local Device Gallery</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLocalPhotoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">User Handle</label>
                  <input 
                    type="text" 
                    value={authName} 
                    onChange={e => setAuthName(e.target.value)}
                    required
                    placeholder="e.g. John Doe"
                    className="w-full px-4 py-3 bg-slate-50 focus:bg-white border border-slate-200 focus:border-lime-500 rounded-xl text-sm transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">E-Mail Address</label>
                  <input 
                    type="email" 
                    value={authEmail} 
                    onChange={e => setAuthEmail(e.target.value)}
                    required
                    placeholder="yourname@example.com"
                    className="w-full px-4 py-3 bg-slate-50 focus:bg-white border border-slate-200 focus:border-lime-500 rounded-xl text-sm transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Mobile Phone No.</label>
                  <input 
                    type="tel" 
                    value={authPhone} 
                    onChange={e => setAuthPhone(e.target.value)}
                    required
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-3 bg-slate-50 focus:bg-white border border-slate-200 focus:border-lime-500 rounded-xl text-sm transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Security Code</label>
                  <input 
                    type="password" 
                    value={authPassword} 
                    onChange={e => setAuthPassword(e.target.value)}
                    required
                    placeholder="Generate 6+ digit pass"
                    className="w-full px-4 py-3 bg-slate-50 focus:bg-white border border-slate-200 focus:border-lime-500 rounded-xl text-sm transition-all outline-none"
                  />
                </div>

                <button type="submit" className="w-full py-3 bg-lime-600 hover:bg-lime-700 active:scale-95 text-white font-bold rounded-xl transition-all shadow-md shadow-lime-100 mt-2">
                  {loginT.createProfile}
                </button>
              </form>
            )}

            {authMode === 'forgot' && (
              <form onSubmit={handleRecover} className="space-y-4">
                <p className="text-sm text-slate-500 leading-relaxed">
                  Enter your registered email below. We'll simulate transmitting a secure pass recovery token instantly.
                </p>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">E-Mail Address</label>
                  <input 
                    type="email" 
                    value={authEmail} 
                    onChange={e => setAuthEmail(e.target.value)}
                    required
                    placeholder="yourname@example.com"
                    className="w-full px-4 py-3 bg-slate-50 focus:bg-white border border-slate-200 focus:border-lime-500 rounded-xl text-sm transition-all outline-none"
                  />
                </div>

                <button type="submit" className="w-full py-3 bg-lime-600 hover:bg-lime-700 active:scale-95 text-white font-bold rounded-xl transition-all shadow-md shadow-lime-100 mt-2">
                  Dispatch Recovery Key
                </button>

                <div className="text-center mt-3">
                  <button type="button" onClick={() => setAuthMode('login')} className="text-xs text-slate-500 underline font-semibold">Back to Login</button>
                </div>
              </form>
            )}

            {/* Social Authentication divider */}
            <div className="relative my-6 text-center">
              <span className="absolute inset-x-0 top-1/2 b-1 border-b border-slate-100"></span>
              <span className="relative bg-white px-3 text-xs uppercase font-extrabold text-slate-400">Social Sign-In Channels</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => handleSocialLogin("Google")} className="py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-all flex flex-col items-center justify-center gap-1 border border-slate-200/60">
                <Apple className="w-4 h-4 text-red-500" />
                <span>Google</span>
              </button>
              <button onClick={() => handleSocialLogin("Apple")} className="py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-all flex flex-col items-center justify-center gap-1 border border-slate-200/60">
                <Lock className="w-4 h-4 text-slate-900" />
                <span>Apple ID</span>
              </button>
              <button onClick={() => handleSocialLogin("Strava")} className="py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-all flex flex-col items-center justify-center gap-1 border border-slate-200/60">
                <Share2 className="w-4 h-4 text-orange-500" />
                <span>Strava</span>
              </button>
            </div>

            {/* Switch view trigger */}
            <div className="text-center mt-8 pt-4 border-t border-slate-100">
              {authMode === 'login' ? (
                <p className="text-sm text-slate-500">
                  New around the facility?{" "}
                  <button onClick={() => setAuthMode('signup')} className="text-lime-600 hover:underline font-bold">Sign Up Free</button>
                </p>
              ) : (
                <p className="text-sm text-slate-500">
                  Already have an active plan?{" "}
                  <button onClick={() => setAuthMode('login')} className="text-lime-600 hover:underline font-bold">Log In</button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- SHOW DIAGNOSTIC ONBOARDING IF BRAND NEW ---
  if (!profile.onboarded) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-10 rounded-xl bg-lime-100 text-lime-700 flex items-center justify-center">
                <Sparkles className="w-5 h-5 font-bold" />
              </span>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Lazy Zone Planner</h1>
                <p className="text-xs text-slate-400">Let's compile your workout strategy & micro preferences</p>
              </div>
            </div>

            <form onSubmit={handleOnboardingSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Weight (kg)</label>
                  <input 
                    type="number" 
                    value={profile.weight}
                    onChange={e => setProfile({ ...profile, weight: parseInt(e.target.value) || 70 })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Height (cm)</label>
                  <input 
                    type="number" 
                    value={profile.height}
                    onChange={e => setProfile({ ...profile, height: parseInt(e.target.value) || 170 })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Age</label>
                  <input 
                    type="number" 
                    value={profile.age}
                    onChange={e => setProfile({ ...profile, age: parseInt(e.target.value) || 25 })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Primary Fitness Goal</label>
                  <select 
                    value={profile.goal}
                    onChange={e => setProfile({ ...profile, goal: e.target.value as any })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-705 outline-none"
                  >
                    <option value="lose_fat">Lose Body Fat / Lean Up</option>
                    <option value="build_muscle">Build Muscle / Hypertrophy</option>
                    <option value="endurance">Increase Stamina & Endurance</option>
                    <option value="maintain">General Health Maintenance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Dietary / Nutrition Preference</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { id: "high_protein", label: "High Protein" },
                    { id: "keto", label: "Keto (High Fat)" },
                    { id: "vegan", label: "Vegan Diet" },
                    { id: "balanced", label: "Standard Balanced" }
                  ].map(pref => (
                    <button 
                      type="button"
                      key={pref.id}
                      onClick={() => setProfile({ ...profile, dietPreference: pref.id as any })}
                      className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all ${
                        profile.dietPreference === pref.id 
                          ? "bg-lime-50 text-lime-700 border-lime-500 shadow-sm" 
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {pref.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Available Equipment</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { id: "gym", label: "Commercial Gym" },
                    { id: "dumbbells", label: "Dumbbells Only" },
                    { id: "resistance_bands", label: "Resistance Bands" },
                    { id: "bodyweight", label: "Bodyweight Only" }
                  ].map(equip => {
                    const selected = profile.equipment.includes(equip.id);
                    return (
                      <button 
                        type="button"
                        key={equip.id}
                        onClick={() => {
                          const next = selected 
                            ? profile.equipment.filter(e => e !== equip.id)
                            : [...profile.equipment, equip.id];
                          setProfile({ ...profile, equipment: next });
                        }}
                        className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all ${
                          selected 
                            ? "bg-lime-50 text-lime-700 border-lime-500 shadow-sm" 
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {equip.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">What do you do in life? (Occupation, Job, or Student)</label>
                <input 
                  type="text" 
                  value={profile.occupation || ""}
                  onChange={e => setProfile({ ...profile, occupation: e.target.value })}
                  placeholder="e.g. Software Engineer, Student, Athlete, Sales, Tech support..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:border-lime-500 outline-none transition-all placeholder:text-slate-400"
                  required
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {["Student", "Software Engineer", "Healthcare", "Desk Job", "Active Field Work", "Entrepreneur"].map(tag => (
                    <button 
                      type="button"
                      key={tag}
                      onClick={() => setProfile({ ...profile, occupation: tag })}
                      className={`text-[10px] px-2.5 py-1 rounded-full border font-semibold transition-all ${
                        profile.occupation === tag 
                          ? "bg-lime-100 border-lime-300 text-lime-800"
                          : "bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Training Experience Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "fresher", label: "Fresher" },
                    { id: "intermediate", label: "Intermediate" },
                    { id: "experienced", label: "Experienced" }
                  ].map(lvl => (
                    <button 
                      type="button"
                      key={lvl.id}
                      onClick={() => setProfile({ ...profile, experienceLevel: lvl.id as any })}
                      className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all ${
                        profile.experienceLevel === lvl.id 
                          ? "bg-lime-50 text-lime-700 border-lime-500 shadow-sm" 
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button type="button" onClick={handleLogOut} className="text-xs text-slate-400 font-bold hover:text-slate-600">
                  Cancel & Go Back
                </button>
                <button type="submit" className="px-8 py-3 bg-lime-600 hover:bg-lime-700 text-white font-bold rounded-xl shadow-md shadow-lime-100 transition-all">
                  Compile My Routine Plans
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // --- CORE SYSTEM DASHBOARD (ONBOARDED AND LOGGED IN) ---
  const isManager = profile.email.toLowerCase() === "mouni123on@gmail.com";
  
  const LOGO_COLOR_MAP = {
    lime: {
      bg: "bg-lime-500 text-slate-950 shadow-lime-200/50",
      textClass: "text-lime-600",
      buttonPrimary: "bg-lime-600 hover:bg-lime-700 shadow-lime-100",
      borderActive: "border-lime-500",
      accentGlow: "shadow-lime-300",
      accentColor: "lime"
    },
    cyan: {
      bg: "bg-cyan-400 text-slate-950 shadow-cyan-200/50",
      textClass: "text-cyan-600",
      buttonPrimary: "bg-cyan-600 hover:bg-cyan-700 shadow-cyan-100",
      borderActive: "border-cyan-450",
      accentGlow: "shadow-cyan-300",
      accentColor: "cyan"
    },
    ruby: {
      bg: "bg-rose-500 text-white shadow-rose-200/50",
      textClass: "text-rose-600",
      buttonPrimary: "bg-rose-600 hover:bg-rose-700 shadow-rose-100",
      borderActive: "border-rose-500",
      accentGlow: "shadow-rose-300",
      accentColor: "rose"
    },
    indigo: {
      bg: "bg-indigo-600 text-white shadow-indigo-200/50",
      textClass: "text-indigo-600",
      buttonPrimary: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100",
      borderActive: "border-indigo-500",
      accentGlow: "shadow-indigo-300",
      accentColor: "indigo"
    },
    amber: {
      bg: "bg-amber-500 text-slate-950 shadow-amber-200/50",
      textClass: "text-amber-500",
      buttonPrimary: "bg-amber-600 hover:bg-amber-700 shadow-amber-105",
      borderActive: "border-amber-500",
      accentGlow: "shadow-amber-300",
      accentColor: "amber"
    }
  };

  const brandTheme = LOGO_COLOR_MAP[logoColorTheme as keyof typeof LOGO_COLOR_MAP] || LOGO_COLOR_MAP.lime;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-lime-200 flex flex-col pb-16">
      
      {/* GLOBAL MANAGER SYSTEM BANNER */}
      {globalBanner && (
        <div className="bg-slate-900 border-b border-slate-800 text-white py-2 px-4 shadow-sm relative overflow-hidden">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs font-medium">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="flex-shrink-0 bg-lime-500 text-slate-950 px-1.5 py-0.5 rounded text-[9px] font-mono tracking-wider font-extrabold uppercase animate-pulse">
                LIVE UPDATE
              </span>
              <span className="font-mono text-[11px] text-slate-300 truncate">{globalBanner}</span>
            </div>
            {isManager && (
              <span className="text-[10px] text-lime-400 font-mono flex-shrink-0 animate-pulse hidden sm:inline">
                ● Connected as Admin (mouni123on@gmail.com)
              </span>
            )}
          </div>
        </div>
      )}

      {/* MANAGER PRIVILEGES DOCK RAIL */}
      {isManager && (
        <div className="bg-gradient-to-r from-slate-950 to-slate-900 text-white border-b border-lime-500/30 text-xs px-4 py-2.5 flex justify-between items-center z-50 sticky top-0">
          <div className="flex items-center gap-2 font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-lime-500 animate-ping"></span>
            <span className="text-lime-400 font-bold uppercase tracking-widest text-[10px]">Manager Level Mode Authorized</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-[10px] hidden md:inline">Logged in as {profile.email}</span>
            <button 
              onClick={() => setIsManagerModalOpen(true)}
              className="px-3 py-1 bg-lime-500 hover:bg-lime-400 active:scale-95 text-slate-950 font-extrabold rounded-lg flex items-center gap-1.5 transition-all text-[11px] cursor-pointer shadow-sm"
              id="open-manager-modal"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Manager Settings Panel</span>
            </button>
          </div>
        </div>
      )}

      {/* Toast Alert Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className={`fixed top-4 right-4 left-4 md:left-auto md:w-96 z-50 p-4 rounded-2xl shadow-xl flex gap-3 border ${
              toastMessage.type === 'success' 
                ? "bg-emerald-900 text-emerald-50 border-emerald-850" 
                : toastMessage.type === 'alert'
                  ? "bg-rose-900 text-rose-50 border-rose-850"
                  : "bg-slate-900 text-slate-50 border-slate-800"
            }`}
          >
            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-white/10 mt-0.5">
              <Check className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm">{toastMessage.title}</h4>
               <p className="text-xs opacity-90 mt-0.5 leading-relaxed">{toastMessage.desc}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER BAR */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-md transition-all ${brandTheme.bg}`}>
              <MuscularLogo className="w-6 h-6" />
            </span>
            <div>
              <span className={`font-mono text-[10px] font-bold tracking-wider uppercase ${brandTheme.textClass}`}>Enthusiast Core</span>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-[-2px]">{customAppName || t.welcome}</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick stats on top */}
            <div className="hidden md:flex items-center gap-6 bg-slate-50 py-1.5 px-4 rounded-2xl border border-slate-100 font-mono text-xs">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <div>
                  <span className="text-slate-400">Streak: </span>
                  <span className="font-bold text-slate-800">3 Days</span>
                </div>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-500" />
                <div>
                  <span className="text-slate-400">XP: </span>
                  <span className="font-bold text-slate-800">1420 pts</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <label className="relative group cursor-pointer" title="Upload custom photo from gallery">
                <img src={profile.avatarUrl} alt="avatar" className="w-10 h-10 rounded-full border border-slate-200 shadow-inner group-hover:opacity-75 transition-all" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 rounded-full transition-all text-white text-[9px] font-bold">
                  Edit
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLocalPhotoUpload}
                  className="hidden"
                />
              </label>
              <div className="hidden sm:block text-left">
                <h4 className="text-sm font-bold text-slate-800">{profile.name || "Lazy Athlete"}</h4>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  {profile.experienceLevel} {profile.occupation ? `• ${profile.occupation}` : ""}
                </p>
              </div>
            </div>

            <button onClick={handleLogOut} className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-xl transition-all">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* PRIMARY MODULE NAVIGATION TABS */}
      <div className="bg-white border-b border-slate-200/50 sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-start space-x-8">
            {[
              { id: "dashboard", label: t.dashboard },
              { id: "workouts", label: t.workouts },
              { id: "diet", label: t.diet },
              { id: "social", label: "Competitions" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-bold text-sm transition-all relative ${
                  activeTab === tab.id 
                    ? "border-lime-500 text-slate-900" 
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="activeUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-lime-500" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* CORE WORKSPACE */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        
        {/* TAB 1: DASHBOARD & WEARABLES */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT / CENTER: PRIMARY PERFORMANCE COUNTER */}
            <div className="lg:col-span-2 space-y-8">
              {/* Daily Streak Highlight */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-850 text-white rounded-3xl p-6 relative overflow-hidden shadow-xl">
                <div className="absolute right-4 bottom-[-20%] opacity-10">
                  <Flame className="w-48 h-48" />
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                  <div>
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="px-3 py-1 bg-lime-500 text-slate-950 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider">Passive Multiplier Active</span>
                      <span className="px-3 py-1 bg-slate-800 text-lime-400 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider border border-slate-700">Accumulated: {leaderboard.find(l => l.isCurrentUser)?.points || 0} XP 🏆</span>
                    </div>
                    <h2 className="text-2xl font-bold mt-2">Active Streak: {leaderboard.find(l => l.isCurrentUser)?.streak || 0} Days 🔥</h2>
                    <p className="text-slate-300 text-sm mt-1 max-w-md">
                      Log meals or exercises daily to defend your milestone. Your profile generates target macros automatically.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => sendSimulatedReminder("food")}
                      className="py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      Test Meal Alert
                    </button>
                    <button 
                      onClick={() => sendSimulatedReminder("exercise")}
                      className="py-2.5 px-4 bg-lime-500 hover:bg-lime-600 text-slate-900 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      Test Gym SMS
                    </button>
                  </div>
                </div>
              </div>



              {/* Goal Targets and progress blocks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* CALORIES OVERVIEW */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">Nutritional Intake</h3>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-3xl font-mono font-bold text-slate-800">{totals.cals}</span>
                      <span className="text-slate-400 text-xs">/ {profile.dailyCaloriesTarget} kcal tgt</span>
                    </div>
                    {/* Visual Meter */}
                    <div className="w-full h-2.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
                      <div 
                        style={{ width: `${Math.min(100, (totals.cals / profile.dailyCaloriesTarget) * 100)}%` }}
                        className="h-full bg-lime-500 rounded-full transition-all"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-4 leading-relaxed font-semibold">
                    {totals.cals < profile.dailyCaloriesTarget 
                      ? `🍳 Add ${profile.dailyCaloriesTarget - totals.cals} cal more to satisfy your customized daily energy goal.`
                      : "🔥 Calorie target exceeded or satisfied! Great work fueling your routines."}
                  </p>
                </div>

                {/* WATER TRACKER */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm justify-between flex flex-col">
                  <div>
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">Water Hydration</h3>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-3xl font-mono font-bold text-sky-600">{waterDrunk}</span>
                      <span className="text-slate-400 text-xs">/ 8 Cups</span>
                    </div>
                    {/* Cup icons */}
                    <div className="flex gap-1.5 mt-4">
                      {Array.from({ length: 8 }).map((_, idx) => (
                        <button 
                          key={idx}
                          onClick={() => {
                            const val = idx < waterDrunk ? idx : idx + 1;
                            setWaterDrunk(val);
                            triggerToast("Hydration Tuned", `Logged ${val} cups of water.`);
                          }}
                          className={`w-full h-8 rounded-lg cursor-pointer border transition-all flex items-center justify-center ${
                            idx < waterDrunk 
                              ? "bg-sky-50 border-sky-350 text-sky-600 shadow-inner" 
                              : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-300"
                          }`}
                        >
                          💧
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <button 
                      onClick={() => setWaterDrunk(prev => Math.max(0, prev - 1))}
                      className="p-1 px-3 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200"
                    >
                      - Cup
                    </button>
                    <button 
                      onClick={() => {
                        setWaterDrunk(prev => Math.min(12, prev + 1));
                        stepAchievementProgress("ach-diet-1", 1);
                      }}
                      className="p-1 px-3 bg-sky-600 text-white rounded-lg text-xs font-bold hover:bg-sky-700"
                    >
                      + Cup
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT COLUMN: NOTIFICATION TELEMETRY LOGS */}
            <div className="space-y-8">
              {/* Notification Sentinel Logger Box */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col">
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="w-8 h-8 bg-lime-100 text-lime-700 rounded-xl flex items-center justify-center">
                    <Bell className="w-4 h-4 font-bold" />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">System Notification Log</h3>
                    <p className="text-[10px] text-slate-400 font-mono">Simulated Reminders Triggers Logs</p>
                  </div>
                </div>

                <div className="space-y-3 mt-4 max-h-72 overflow-y-auto pr-1">
                  {notificationsHistory.length === 0 ? (
                    <div className="p-4 border border-dashed border-slate-200 text-center rounded-2xl text-xs text-slate-400">
                      No alerts triggered yet. Click "Test Gym SMS" above!
                    </div>
                  ) : (
                    notificationsHistory.map(log => (
                      <div key={log.id} className="p-3 bg-slate-50 border border-slate-200/50 rounded-xl space-y-1 font-mono text-[10px] text-slate-600">
                        <div className="flex justify-between font-bold text-slate-800 text-[11px]">
                          <span>{log.type === "email" ? "📧 EMAIL Sent" : "💬 SMS Sent"}</span>
                          <span className="text-slate-400">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-slate-500">Dest: {log.recipient}</p>
                        <p className="text-slate-700 bg-white p-1.5 rounded border border-slate-100 leading-relaxed font-sans">{log.body}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700 mb-2">Set Schedule preferences:</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Meal Reminder</span>
                      <input 
                        type="time" 
                        value={profile.reminderTimeMeal} 
                        onChange={e => setProfile({ ...profile, reminderTimeMeal: e.target.value })}
                        className="w-full bg-white p-1.5 border border-slate-200 rounded-lg text-slate-700 mt-1"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Workout Alert</span>
                      <input 
                        type="time" 
                        value={profile.reminderTimeWorkout} 
                        onChange={e => setProfile({ ...profile, reminderTimeWorkout: e.target.value })}
                        className="w-full bg-white p-1.5 border border-slate-200 rounded-lg text-slate-700 mt-1"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Channel preference</span>
                    <div className="flex gap-1.5 mt-1">
                      {['email', 'phone', 'both'].map(ch => (
                        <button
                          key={ch}
                          onClick={() => setProfile({ ...profile, reminderChannel: ch as any })}
                          className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                            profile.reminderChannel === ch 
                              ? "bg-slate-900 border-slate-900 text-white" 
                              : "bg-white border-slate-200 text-slate-500"
                          }`}
                        >
                          {ch.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio Stats card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <h3 className="font-extrabold text-slate-800 text-sm mb-4">Diagnostics Physical Blueprint</h3>
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-slate-400">Weight:</span>
                    <p className="text-lg font-bold text-slate-800">{profile.weight} kg</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-slate-400">Height:</span>
                    <p className="text-lg font-bold text-slate-800">{profile.height} cm</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 col-span-2">
                    <span className="text-slate-400">Active Gear:</span>
                    <p className="text-xs font-sans font-bold text-slate-700 mt-1 capitalize">
                      {profile.equipment.join(", ") || "Bodyweight only"}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setProfile({ ...profile, onboarded: false })}
                  className="w-full mt-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1"
                >
                  <User className="w-3.5 h-3.5" />
                  Edit Diagnostic Questionnaire
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: WORKOUT PLANNER */}
        {activeTab === "workouts" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            
            {/* WORKOUT LISTINGS */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Customized Routine Calendar</h2>
                  <p className="text-xs text-slate-400">Generated according to equipment: <span className="font-bold text-lime-600 capitalize">{profile.equipment.join(", ")}</span></p>
                </div>
              </div>

              {routines.map(routine => {
                const totalFinished = routine.exercises.filter(e => e.completed).length;
                const progressPct = routine.exercises.length ? (totalFinished / routine.exercises.length) * 100 : 0;
                
                return (
                  <div key={routine.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 bg-gradient-to-b from-slate-50 to-white border-b border-slate-105">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex gap-2 items-center">
                            <span className="px-2 py-0.5 bg-lime-100 text-lime-700 text-[10px] font-extrabold uppercase tracking-wider rounded">
                              {routine.difficulty.toUpperCase()}
                            </span>
                            {routine.sharedBy && (
                              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded flex items-center gap-1">
                                <Share2 className="w-2.5 h-2.5" /> From {routine.sharedBy}
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 mt-2">{routine.title}</h3>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{routine.description}</p>
                        </div>

                        <div className="flex gap-2">
                          <button 
                            onClick={() => shareRoutine(routine)}
                            className="p-2.5 bg-white hover:bg-slate-50 text-slate-600 hover:text-lime-600 rounded-xl border border-slate-200 transition-all flex items-center gap-1 text-xs font-semibold"
                            title="Share with Friends"
                          >
                            <Share2 className="w-4 h-4" />
                            <span>Share</span>
                          </button>
                        </div>
                      </div>

                      {/* Overall routine meter */}
                      <div className="mt-4 flex items-center gap-3">
                        <div className="flex-grow h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div style={{ width: `${progressPct}%` }} className="h-full bg-lime-500 rounded-full transition-all" />
                        </div>
                        <span className="font-mono text-xs font-bold text-slate-600">{totalFinished}/{routine.exercises.length}</span>
                      </div>
                    </div>

                    {/* Exercise items list */}
                    <div className="divide-y divide-slate-100">
                      {routine.exercises.map(ex => (
                        <div key={ex.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-all gap-4">
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => toggleExerciseComplete(routine.id, ex.id)}
                              className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                                ex.completed 
                                  ? "bg-lime-500 border-lime-500 text-white" 
                                  : "bg-white border-slate-300 text-transparent hover:border-lime-500"
                              }`}
                            >
                              <Check className="w-4 h-4 text-white font-extrabold" />
                            </button>
                            <div>
                              <h4 className={`text-sm font-bold ${ex.completed ? "line-through text-slate-400" : "text-slate-800"}`}>{ex.name}</h4>
                              <p className="text-xs text-slate-400 font-mono mt-0.5">
                                {ex.sets} Sets × {ex.reps} Reps {ex.weight ? `| ${ex.weight} kg` : ''} 
                              </p>
                            </div>
                          </div>

                          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-mono text-[10px] capitalize">
                            {ex.category}
                          </span>
                        </div>
                      ))}

                      {/* Inline form to append custom manual exercises dynamically */}
                      <div className="p-4 bg-slate-50 border-t border-slate-100">
                        <button 
                          onClick={() => setTargetRoutineId(targetRoutineId === routine.id ? "" : routine.id)}
                          className="text-xs text-lime-600 font-extrabold flex items-center gap-1 hover:underline"
                        >
                          <PlusCircle className="w-4 h-4" />
                          <span>Append Custom Rep to this Schedule</span>
                        </button>

                        <AnimatePresence>
                          {targetRoutineId === routine.id && (
                            <motion.form 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              onSubmit={handleAddExercise}
                              className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs"
                            >
                              <div className="col-span-2 sm:col-span-1">
                                <label className="text-[10px] text-slate-400 uppercase font-bold">Movement Name</label>
                                <input 
                                  type="text" 
                                  placeholder="e.g. Incline Bench" 
                                  value={newExerciseName}
                                  onChange={e => setNewExerciseName(e.target.value)}
                                  className="w-full bg-white p-2 border border-slate-200 rounded-lg mt-1"
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-400 uppercase font-bold">Sets</label>
                                <input 
                                  type="number" 
                                  value={newExerciseSets}
                                  onChange={e => setNewExerciseSets(e.target.value)}
                                  className="w-full bg-white p-2 border border-slate-200 rounded-lg mt-1"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-400 uppercase font-bold">Reps count</label>
                                <input 
                                  type="number" 
                                  value={newExerciseReps}
                                  onChange={e => setNewExerciseReps(e.target.value)}
                                  className="w-full bg-white p-2 border border-slate-200 rounded-lg mt-1"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-400 uppercase font-bold">Weight (kg, optional)</label>
                                <div className="flex gap-1.5 mt-1">
                                  <input 
                                    type="number" 
                                    placeholder="20" 
                                    value={newExerciseWeight}
                                    onChange={e => setNewExerciseWeight(e.target.value)}
                                    className="w-full bg-white p-2 border border-slate-200 rounded-lg"
                                  />
                                  <button type="submit" className="p-2 bg-lime-600 text-white font-bold rounded-lg hover:bg-lime-700">
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </motion.form>
                          )}
                        </AnimatePresence>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* SIDEBAR: WORKOUT TUTORIAL TIPS */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">💡</span>
                  <h3 className="font-bold text-slate-900 text-sm">Correct Physical Postures Form</h3>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Avoid injury. Use these checkpoints or ask our floating **Grok AI Bot** for detailed descriptions (e.g. squat, split stance deadlifts, or pushup guidelines).
                </p>

                <div className="space-y-4 mt-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <h5 className="font-bold text-slate-800">Deadlift Positioning checkpoints:</h5>
                    <ul className="list-disc pl-4 text-[11px] text-slate-500 space-y-1">
                      <li>Feet hip-width apart under raw barbell bar</li>
                      <li>Flat back spine alignment before lifting</li>
                      <li>Drive flat heels down, hinging through glutes</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <h5 className="font-bold text-slate-800">Squat positioning checkpoints:</h5>
                    <ul className="list-disc pl-4 text-[11px] text-slate-500 space-y-1">
                      <li>Stance wider than shoulders, toes out 15°</li>
                      <li>Lower hips until fold breaches knee parallel</li>
                      <li>Brace torso core to suppress spine shear</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Share custom workout code block */}
              <div className="bg-gradient-to-br from-lime-600 to-lime-700 text-white rounded-3xl p-6 shadow-md shadow-lime-100">
                <Share2 className="w-8 h-8 opacity-75 mb-3" />
                <h3 className="font-bold text-lg">Export Workout Routines</h3>
                <p className="text-xs text-lime-100 mt-1 leading-relaxed">
                  Instantly broadcast your customizable exercises and schedules to your social leaderboard contacts to compare completions and raise motivation.
                </p>
                
                <div className="mt-4 bg-lime-800/30 p-2 text-xs rounded-xl border border-white/10 font-mono text-center flex justify-between items-center">
                  <span>Code: LZY-ZNE-4822</span>
                  <button 
                    onClick={() => {
                      triggerToast("Copied to Clipboard", "Routine export configuration code copied.");
                      updateUserLeaderboardPoints(10);
                    }} 
                    className="p-1 px-2.5 bg-white text-lime-700 rounded-lg font-bold hover:bg-lime-50"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: DIET & MACRO TRACKER */}
        {activeTab === "diet" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT / CENTER: MACRO TRACKER & LOGS */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Daily Macro Breakdown Dial bars */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-6">Customized Diet Ratios Allocation</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Protein */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150">
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                      <span>Protein (Muscle repair)</span>
                      <span className="font-mono text-slate-800">{totals.p}g / {profile.dailyProteinTarget}g</span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${Math.min(100, (totals.p / profile.dailyProteinTarget) * 105)}%` }} 
                        className="h-full bg-lime-500 transition-all rounded-full"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono mt-2">Target value tailored to target body goal</p>
                  </div>

                  {/* Carbs */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150">
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                      <span>Carbohydrates (Energy)</span>
                      <span className="font-mono text-slate-800">{totals.c}g / {profile.dailyCarbsTarget}g</span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${Math.min(100, (totals.c / profile.dailyCarbsTarget) * 100)}%` }} 
                        className="h-full bg-cyan-500 transition-all rounded-full"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono mt-2">Satisfies stamina & energy expenditure</p>
                  </div>

                  {/* Fats */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150">
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                      <span>Fats (Hormone support)</span>
                      <span className="font-mono text-slate-800">{totals.f}g / {profile.dailyFatTarget}g</span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${Math.min(100, (totals.f / profile.dailyFatTarget) * 100)}%` }} 
                        className="h-full bg-orange-500 transition-all rounded-full"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono mt-2">Guarantees vital baseline health</p>
                  </div>
                </div>
              </div>

              {/* Log current customized meals */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-900 text-lg mb-4">Meal Intake Timeline (Today)</h3>
                
                <form onSubmit={handleAddMeal} className="bg-slate-50 p-4 rounded-2xl border border-slate-150/60 mb-6 grid grid-cols-2 md:grid-cols-6 gap-3 text-xs">
                  <div className="col-span-2">
                    <label className="text-[10px] text-slate-400 uppercase font-bold">Food Description</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Sirloin Steak & Spud" 
                      value={newMealName}
                      onChange={e => setNewMealName(e.target.value)}
                      className="w-full bg-white p-2 border border-slate-200 rounded-lg mt-1 font-semibold text-slate-700 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-bold">Calories</label>
                    <input 
                      type="number" 
                      placeholder="350" 
                      value={newMealCals}
                      onChange={e => setNewMealCals(e.target.value)}
                      className="w-full bg-white p-2 border border-slate-200 rounded-lg mt-1 font-semibold text-slate-700 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-bold">Protein (g)</label>
                    <input 
                      type="number" 
                      placeholder="30" 
                      value={newMealProtein}
                      onChange={e => setNewMealProtein(e.target.value)}
                      className="w-full bg-white p-2 border border-slate-200 rounded-lg mt-1 font-semibold text-slate-700 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-bold">Carbs (g)</label>
                    <input 
                      type="number" 
                      placeholder="25" 
                      value={newMealCarbs}
                      onChange={e => setNewMealCarbs(e.target.value)}
                      className="w-full bg-white p-2 border border-slate-200 rounded-lg mt-1 font-semibold text-slate-700 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-bold">Fats (g)</label>
                    <div className="flex gap-2 mt-1">
                      <input 
                        type="number" 
                        placeholder="8" 
                        value={newMealFat}
                        onChange={e => setNewMealFat(e.target.value)}
                        className="w-full bg-white p-2 border border-slate-200 rounded-lg font-semibold text-slate-700 outline-none"
                      />
                      <button type="submit" className="p-2 bg-lime-600 hover:bg-lime-700 text-white rounded-lg font-bold flex items-center justify-center flex-shrink-0 relative">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </form>

                {/* Timeline meals list */}
                <div className="space-y-3">
                  {mealLogs.length === 0 ? (
                    <div className="p-8 border border-dashed border-slate-200 text-slate-400 text-sm rounded-3xl text-center">
                      No foods logged yet. Complete diagnostics and feed your intake statistics today!
                    </div>
                  ) : (
                    mealLogs.map(meal => (
                      <div key={meal.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="w-10 h-10 bg-lime-100 text-lime-700 rounded-xl flex items-center justify-center font-bold text-lg">
                            {meal.mealType === "breakfast" ? "🍳" : meal.mealType === "lunch" ? "🥗" : meal.mealType === "dinner" ? "🥩" : "🍌"}
                          </span>
                          <div>
                            <h4 className="text-sm font-bold text-slate-800">{meal.name}</h4>
                            <div className="flex gap-4 text-xs font-mono text-slate-400 mt-1">
                              <span>Protein: {meal.protein}g</span>
                              <span>Carbs: {meal.carbs}g</span>
                              <span>Fat: {meal.fat}g</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="font-mono text-sm font-bold text-slate-700">{meal.calories} kcal</span>
                          <button onClick={() => handleDeleteMeal(meal.id)} className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* SIDEBAR: RECIPE SUGGESTIONS */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="p-2 bg-lime-50 text-lime-600 rounded-xl font-bold">💡</span>
                  <h3 className="font-bold text-slate-900 text-sm">Gourmet Nutrition Plan</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  These meal ratios are scientifically calibrated specifically for your goal to <span className="font-bold text-lime-600 uppercase">{profile.goal.replace("_", " ")}</span>:
                </p>

                <div className="space-y-4 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider mb-2">Breakfast Suggestions</h4>
                    {generateDietProfile(profile.goal, profile.dietPreference, profile.weight).breakfastSuggestions.map((item, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-2 space-y-1">
                        <p className="font-bold text-slate-705 leading-tight">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {item.cal} cal | P: {item.p}g | C: {item.c}g | F: {item.f}g
                        </p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider mb-2">Lunch Suggestions</h4>
                    {generateDietProfile(profile.goal, profile.dietPreference, profile.weight).lunchSuggestions.map((item, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-2 space-y-1">
                        <p className="font-bold text-slate-705 leading-tight">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {item.cal} cal | P: {item.p}g | C: {item.c}g | F: {item.f}g
                        </p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider mb-2">Dinner Suggestions</h4>
                    {generateDietProfile(profile.goal, profile.dietPreference, profile.weight).dinnerSuggestions.map((item, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-2 space-y-1">
                        <p className="font-bold text-slate-705 leading-tight">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {item.cal} cal | P: {item.p}g | C: {item.c}g | F: {item.f}g
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: SOCIAL LEADERBOARD & ACHIEVEMENTS */}
        {activeTab === "social" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEADERBOARD LIST */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                       🏆 <span>National Active Competitions</span>
                    </h2>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">Custom private bracket list. Only real authorized competitors display here.</p>
                  </div>
                  
                  {/* COUNTRY SELECTION dropdown filter / set country */}
                  <div className="bg-slate-50 p-2 rounded-2xl border border-slate-100 flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider pl-1.5">Your Active Region:</span>
                    <select
                      value={profile.countryStyle}
                      onChange={(e) => {
                        const newC = e.target.value as any;
                        const updated = { ...profile, countryStyle: newC };
                        setProfile(updated);
                        localStorage.setItem("lazy_zone_profile", JSON.stringify(updated));
                        triggerToast("Region Switched", `Competition region updated to ${newC} successfully. Current language remains fixed!`, "success");
                      }}
                      className="px-2.5 py-1 text-xs font-bold bg-white rounded-xl border border-slate-200 text-slate-700 outline-none focus:border-lime-500 cursor-pointer"
                    >
                      {COMPREHENSIVE_COUNTRIES.map(item => (
                        <option key={item.code} value={item.code}>
                          {item.flag} {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  {leaderboard
                    .filter(user => {
                      // Hide hardcoded default mock users & their default info
                      const defaultIds = ["leader-1", "leader-2", "leader-3", "leader-5", "leader-6"];
                      return !defaultIds.includes(user.id);
                    })
                    .sort((a,b) => b.points - a.points)
                    .map((user, index) => {
                      const isCurrentUser = user.isCurrentUser;
                      const displayName = isCurrentUser ? (profile.name || "Lazy Athlete") : user.name;
                      const displayAvatar = isCurrentUser ? (profile.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80") : user.avatar;
                      const displayCountry = isCurrentUser ? profile.countryStyle : ((user as any).country || "US");
                      
                      const flagsMap: Record<string, string> = { US: "🇺🇸", UK: "🇬🇧", IN: "🇮🇳", ES: "🇪🇸", AU: "🇦🇺" };
                      const flagEmoji = flagsMap[displayCountry] || "🇺🇸";

                      return (
                        <div 
                          key={user.id} 
                          className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                            isCurrentUser 
                              ? "bg-lime-50/50 border-lime-300/80 shadow-xs" 
                              : "bg-white border-slate-100 hover:border-slate-200"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs font-mono ${
                              index === 0 ? "bg-yellow-100 text-yellow-850" : index === 1 ? "bg-slate-100 text-slate-700" : index === 2 ? "bg-amber-100 text-amber-900" : "bg-slate-50 text-slate-400"
                            }`}>
                              #{index + 1}
                            </span>
                            
                            <div className="relative">
                              <img src={displayAvatar} alt="avatar" className="w-10 h-10 rounded-full border border-slate-250 object-cover" />
                              <span className="absolute -bottom-1 -right-1 text-sm bg-white rounded-full p-0.5 leading-none shadow-xs">
                                {flagEmoji}
                              </span>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                                {displayName}
                                {isCurrentUser && <span className="text-[9px] bg-lime-600 text-white font-mono uppercase px-1.5 py-0.5 rounded-full font-bold">You (Manager)</span>}
                              </h4>
                              <p className="text-xs text-slate-400 font-mono mt-0.5">
                                Weekly streak: <span className="text-orange-500 font-bold">{user.streak} days 🔥</span> | Workouts: {user.workoutsThisWeek} logged
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="font-mono text-sm font-black text-slate-850">{user.points} pts</span>
                            {!isCurrentUser && (
                              <button 
                                onClick={() => {
                                  triggerToast("Cheer Broadcasted!", `You shared an encouragement poke to ${displayName}!`, "success");
                                  stepAchievementProgress("ach-share", 1);
                                }}
                                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-xl transition-all border border-slate-200 cursor-pointer"
                              >
                                Cheer
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}

                  {leaderboard.filter(user => {
                    const defaultIds = ["leader-1", "leader-2", "leader-3", "leader-5", "leader-6"];
                    return !defaultIds.includes(user.id);
                  }).length === 0 && (
                    <div className="p-8 border border-dashed border-slate-200 rounded-3xl text-center text-slate-400 text-xs">
                      No active competitors. Tap below to invite or add your custom teammates!
                    </div>
                  )}
                </div>
              </div>

              {/* INVITE AND ADD COMPETITOR BLOCK */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest">Add Private bracket Competitor</h3>
                  <p className="text-xs text-slate-400 mt-1">Formulate custom active players manually choosing their home countryStyle.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">Competitor Handle</label>
                    <input 
                      type="text"
                      placeholder="e.g. Rachel Flex"
                      value={newCompetitorName}
                      onChange={e => setNewCompetitorName(e.target.value)}
                      className="w-full mt-1.5 p-2 bg-slate-50 hover:bg-slate-105/50 border border-slate-200 rounded-xl text-xs focus:bg-white outline-none font-semibold text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">Starting Raw Points</label>
                    <input 
                      type="number"
                      placeholder="e.g. 1500"
                      value={newCompetitorPoints}
                      onChange={e => setNewCompetitorPoints(Number(e.target.value))}
                      className="w-full mt-1.5 p-2 bg-slate-50 hover:bg-slate-105/50 border border-slate-200 rounded-xl text-xs focus:bg-white outline-none font-semibold text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 font-sans">Home Country/Flag</label>
                    <select
                      value={newCompetitorCountry}
                      onChange={e => setNewCompetitorCountry(e.target.value as any)}
                      className="w-full mt-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none font-semibold text-slate-700 cursor-pointer"
                    >
                      <option value="US">🇺🇸 US English</option>
                      <option value="UK">🇬🇧 UK English</option>
                      <option value="IN">🇮🇳 IN India</option>
                      <option value="ES">🇪🇸 ES Spain</option>
                      <option value="AU">🇦🇺 AU Australia</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 gap-4">
                  <div className="text-[10px] text-slate-400 font-mono">
                    Country Styles will automatically customize the system language when simulated!
                  </div>
                  <button
                    onClick={() => {
                      if (!newCompetitorName.trim()) {
                        triggerToast("Invalid Handle", "Please fill in a competitor handle.", "alert");
                        return;
                      }
                      
                      const newComp: LeaderboardEntry = {
                        id: `competitor-${Date.now()}`,
                        name: newCompetitorName,
                        avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 900000)}?auto=format&fit=crop&w=150&q=80`,
                        points: newCompetitorPoints || 100,
                        streak: newCompetitorStreak || 1,
                        workoutsThisWeek: Math.floor(Math.random() * 4) + 1,
                        isCurrentUser: false
                      };
                      // Hack to save country custom attribute
                      (newComp as any).country = newCompetitorCountry;

                      const updatedList = [...leaderboard, newComp];
                      setLeaderboard(updatedList);
                      localStorage.setItem("lazy_zone_leaderboard", JSON.stringify(updatedList));

                      setNewCompetitorName("");
                      triggerToast("Competitor Invited!", `${newCompetitorName} was created with an official score bracket.`, "success");
                    }}
                    className={`px-4 py-2 text-xs font-bold text-white rounded-xl bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer`}
                  >
                    + Invite Friend
                  </button>
                </div>
              </div>
            </div>

            {/* MILESTONE ACHIEVEMENTS DRAWER */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <h3 className="font-extrabold text-slate-900 text-lg mb-2">Gamified Achievement Badges</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">Earn badges under target guidelines to gain exclusive avatar flairs.</p>

                <div className="space-y-4">
                  {achievements.map(ach => (
                    <div 
                      key={ach.id}
                      className={`p-4 rounded-2xl border transition-all flex gap-3 ${
                        ach.unlocked 
                          ? "bg-slate-50 border-slate-200/60" 
                          : "bg-slate-102 border-slate-100 opacity-60"
                      }`}
                    >
                      <span className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl shadow-xs ${
                        ach.unlocked ? "bg-lime-500 text-white" : "bg-slate-200 text-slate-400"
                      }`}>
                        🏆
                      </span>

                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-bold text-slate-805 truncate">{ach.title}</h4>
                          {ach.unlocked ? (
                            <span className="text-[10px] text-emerald-600 font-mono font-bold flex items-center gap-1">
                              <Check className="w-3 h-3" /> Unlocked
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-mono">In Progress</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 leading-tight mt-0.5 mt-1">{ach.description}</p>
                        
                        {/* Progress Meter */}
                        {!ach.unlocked && (
                          <div className="mt-2.5 flex items-center gap-2">
                            <div className="flex-grow h-1.5 bg-slate-105 rounded-full overflow-hidden">
                              <div style={{ width: `${(ach.progress / ach.target) * 100}%` }} className="h-full bg-lime-500 rounded-full" />
                            </div>
                            <span className="text-[9px] font-mono text-slate-500 font-bold">{ach.progress}/{ach.target}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* CHATBOT AI WIDGET COMPONENT */}
      <AnimatePresence>
        {!isChatOpen ? (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="fixed bottom-6 right-6 z-40 font-sans flex items-center gap-3"
          >
            <div className="bg-slate-900/90 text-white px-3 py-1.5 rounded-2xl text-[11px] font-bold shadow-xl border border-slate-700 hidden sm:block backdrop-blur-xs">
              {t.doubtBot} is online!
            </div>
            <button 
              onClick={() => setIsChatOpen(true)}
              className="w-14 h-14 rounded-full bg-slate-900 border-2 border-lime-400 text-white flex items-center justify-center shadow-2xl relative hover:scale-110 active:scale-95 transition-all group cursor-pointer"
              id="chat-collapsed-trigger"
            >
              <Sparkles className="w-6 h-6 text-lime-400 group-hover:rotate-12 transition-transform animate-pulse" />
              <span className="absolute -top-1 -right-1 bg-lime-500 text-slate-950 font-black text-[9px] w-5 h-5 flex items-center justify-center rounded-full shadow-lg border border-white">
                1
              </span>
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ y: 80, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed bottom-6 right-6 z-40 max-w-sm w-full font-sans shadow-2xl rounded-3xl overflow-hidden border border-slate-200 bg-white"
          >
            <div className="bg-slate-900 text-white flex flex-col">
              
              {/* AI Header */}
              <div className="p-4 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-lime-500 text-slate-950 flex items-center justify-center animate-pulse">
                    <Sparkles className="w-4 h-4 font-black" />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold">{t.doubtBot}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">{t.doubtBotSub}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="p-1 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold font-mono transition-all"
                  title="Minimize Chat"
                >
                  ✕ {t.backtrack}
                </button>
              </div>

              {/* Trainer Advice Notice badge */}
              <div className="px-4 py-1.5 bg-slate-850 border-b border-slate-800 text-[10px] text-lime-400/90 font-medium flex gap-1.5 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-ping"></span>
                <span>{t.trainerNotice}</span>
              </div>
            </div>

            {/* AI Message Stream viewport */}
            <div className="overflow-y-auto p-4 space-y-4 max-h-72 min-h-64 bg-slate-50/50">
              {chatMessages.map(msg => (
                <div 
                  key={msg.id}
                  className={`flex gap-2 text-xs ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender !== "user" && (
                    <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">🤖</span>
                  )}
                  <div 
                    className={`p-3 max-w-[85%] rounded-2xl whitespace-pre-line leading-relaxed ${
                      msg.sender === "user" 
                        ? "bg-slate-900 text-white rounded-tr-none text-right" 
                        : "bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-xs text-left"
                    }`}
                  >
                    {/* Basic parsing helper for headers */}
                    {msg.content.includes("###") ? (
                      <div>
                        {msg.content.split("\n").map((line, lidx) => {
                          if (line.startsWith("###")) {
                            return <h4 key={lidx} className="font-extrabold text-sm text-slate-900 mt-2 mb-1">{line.replace("###", "")}</h4>;
                          }
                          if (line.startsWith("-") || line.startsWith("*")) {
                            return <li key={lidx} className="ml-3 list-disc mt-0.5">{line.substring(2)}</li>;
                          }
                          if (line.match(/^\d+\./)) {
                            return <div key={lidx} className="ml-3 mt-1 font-semibold">{line}</div>;
                          }
                          return <p key={lidx} className="mt-1">{line}</p>;
                        })}
                      </div>
                    ) : msg.content}
                    <span className="block text-[8px] opacity-60 text-right mt-1 font-mono">{msg.timestamp}</span>
                  </div>
                </div>
              ))}
              {isGrokTyping && (
                <div className="flex justify-start items-center gap-2 text-xs text-slate-400">
                  <span>🤖 {t.doubtBot} is compiling...</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-ping"></span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input dialogue */}
            <form onSubmit={sendChatMessage} className="p-3 border-t border-slate-105 bg-white flex gap-2">
              <input 
                type="text" 
                placeholder={t.askPrompt} 
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                className="flex-grow px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-lime-500 font-medium"
              />
              <button type="submit" className="p-2 bg-lime-600 text-white rounded-xl hover:bg-lime-700 transition-all flex-shrink-0 cursor-pointer">
                <Send className="w-4 h-4" />
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>



      {/* SHARE MODAL SIMULATION */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-101 shadow-2xl text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-lime-100 text-lime-700 mb-3">
              <Share2 className="w-6 h-6 animate-pulse" />
            </div>
            
            <h3 className="font-bold text-lg text-slate-900">Broadcast Custom Routine</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              You are about to share your custom plan <strong>"{showShareModal.title}"</strong> with your global leaderboard friends!
            </p>

            <div className="mt-5 space-y-2">
              <button 
                onClick={() => {
                  setShowShareModal(null);
                  triggerToast("Broadcasting successful", "All friends have been notified with your training stats! +25 Points.");
                }}
                className="w-full py-2.5 bg-lime-600 text-white font-bold rounded-xl text-xs hover:bg-lime-700"
              >
                Broadcast to Leaderboard Contacts
              </button>
              <button 
                onClick={() => setShowShareModal(null)}
                className="w-full py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MANAGER REAL-TIME LIVE UPDATE MODAL --- */}
      {isManager && isManagerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto selection:bg-lime-300">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden my-8"
          >
            {/* Header */}
            <div className="bg-slate-900 text-white p-6 flex justify-between items-center border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-lime-500 text-slate-950 flex items-center justify-center font-bold">
                  <Wrench className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-extrabold text-base tracking-tight">Manager Production Core Panel</h3>
                  <p className="text-[10px] text-slate-400 font-mono">LIVE CONTROLLERS • MOUNI123ON@GMAIL.COM</p>
                </div>
              </div>
              <button 
                onClick={() => setIsManagerModalOpen(false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Close Control Panel
              </button>
            </div>

            {/* Config Modules Tabbed Wrapper */}
            <div className="p-6 space-y-6">
              
              {/* Box 1: Custom App Name & Branding Styles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 font-mono block">Website Public Name</label>
                    <p className="text-[9px] text-slate-400 mt-0.5 mb-2">Updates layout title immediately on live visitors headers.</p>
                    <input 
                      type="text"
                      value={customAppName}
                      onChange={(e) => {
                        setCustomAppName(e.target.value);
                        localStorage.setItem("lazy_zone_custom_app_name", e.target.value);
                      }}
                      placeholder="e.g. Mouni Lazy Athlete Zone"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-lime-500"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 font-mono block">Website Color Theme</label>
                    <p className="text-[9px] text-slate-400 mt-0.5 mb-2">Pick brand look. Instant CSS-variables dynamic inject.</p>
                    <div className="grid grid-cols-5 gap-1.5 pt-1">
                      {Object.keys(LOGO_COLOR_MAP).map((col) => {
                        const theme = LOGO_COLOR_MAP[col as keyof typeof LOGO_COLOR_MAP];
                        const isSelected = logoColorTheme === col;
                        return (
                          <button
                            key={col}
                            onClick={() => {
                              setLogoColorTheme(col);
                              localStorage.setItem("lazy_zone_logo_color_theme", col);
                              triggerToast("Branded Theme Applied", `Website accent style switched to '${col}' successfully.`, "success");
                            }}
                            className={`h-10 rounded-xl text-[10px] font-extrabold flex items-center justify-center border capitalize transition-all cursor-pointer ${theme.bg} ${
                              isSelected ? "ring-2 ring-slate-900 border-white scale-105" : "opacity-75 hover:opacity-100"
                            }`}
                          >
                            {col === "lime" ? "✓" : col[0]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Box 2: Announcement marquee banner */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 font-mono block">Live Notification Announcement crawler</label>
                  <p className="text-[9px] text-slate-400 mt-0.5 mb-2">Crawling ticker bar visible to all visitors. Empty to hide entirely.</p>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="e.g. Server maintenance scheduled tonight at 12:00."
                      value={globalBanner}
                      onChange={(e) => {
                        setGlobalBanner(e.target.value);
                        localStorage.setItem("lazy_zone_global_banner", e.target.value);
                      }}
                      className="flex-grow p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-lime-500"
                    />
                    {globalBanner && (
                      <button 
                        onClick={() => {
                          setGlobalBanner("");
                          localStorage.setItem("lazy_zone_global_banner", "");
                        }}
                        className="px-3 bg-rose-500 text-white rounded-xl text-xs font-bold hover:bg-rose-600 transition-all cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Box 3: Manage badges / Milestones */}
              <div className="p-4 bg-lime-50/40 rounded-2xl border border-lime-100 space-y-3">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">Introduce Custom Achievement Badge</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 mb-3">Add private custom badge milestones that show up instantly in the gamified milestones drawer for motivation.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <input 
                      type="text" 
                      placeholder="Badge Title (e.g. Water God)"
                      value={newBadgeTitle}
                      onChange={e => setNewBadgeTitle(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none"
                    />
                  </div>
                  <div>
                    <input 
                      type="text" 
                      placeholder="Goal description (e.g. Log 10 meals)"
                      value={newBadgeDesc}
                      onChange={e => setNewBadgeDesc(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none"
                    />
                  </div>
                  <div>
                    <input 
                      type="number" 
                      placeholder="Required target (e.g. 5)"
                      value={newBadgeTarget}
                      onChange={e => setNewBadgeTarget(Number(e.target.value) || 5)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-700 outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1.5">
                  <span className="text-[9px] text-slate-400 font-mono">Custom badges track dynamic user parameters.</span>
                  <button
                    onClick={() => {
                      if (!newBadgeTitle.trim() || !newBadgeDesc.trim()) {
                        triggerToast("Empty Fields", "Please supply Title and target description to append the gamified matrix.", "alert");
                        return;
                      }

                      const newAch: Achievement = {
                        id: `cust-${Date.now()}`,
                        title: newBadgeTitle,
                        description: newBadgeDesc,
                        icon: "Award",
                        unlocked: false,
                        progress: 0,
                        target: newBadgeTarget || 5,
                        category: "social"
                      };

                      const nextAchievements = [...achievements, newAch];
                      setAchievements(nextAchievements);
                      localStorage.setItem("lazy_zone_achievements", JSON.stringify(nextAchievements));

                      setNewBadgeTitle("");
                      setNewBadgeDesc("");
                      setNewBadgeTarget(5);

                      // Log system update live trace
                      const logMsg = `Modified milestones matrix: added "${newBadgeTitle}" badge.`;
                      setManagerUpdatesLog(prev => [logMsg, ...prev]);

                      triggerToast("Badge Matrix updated!", `"${newBadgeTitle}" badge is now live for all tracking participants!`, "success");
                    }}
                    className="px-3.5 py-1.5 bg-slate-900 text-white hover:bg-slate-850 rounded-xl text-xs font-extrabold transition-all cursor-pointer"
                  >
                    + Deploy Active Badge
                  </button>
                </div>
              </div>

              {/* Box 4: Manager Live Push trace logs */}
              <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] uppercase font-bold text-lime-400 font-mono block">Real-time Website Update Monitor Log</label>
                  <span className="text-[9px] bg-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded">AUTO-SYNC IN CONTAINER</span>
                </div>
                
                <div className="bg-slate-950 p-3 rounded-xl max-h-32 overflow-y-auto font-mono text-[10px] text-slate-350 space-y-1.5 leading-relaxed">
                  {managerUpdatesLog.map((log, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="text-lime-500 flex-shrink-0">›</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-end">
                  <button 
                    onClick={() => {
                      const demoLogs = [
                        `Applied live production layout update at ${new Date().toLocaleTimeString()}`,
                        `Hot reloading custom language translations dictionary...`,
                        `Persisted newly formulated active region dropdown selection.`
                      ];
                      setManagerUpdatesLog(prev => [...demoLogs, ...prev]);
                      triggerToast("Website Live Deployment Complete", "Synchronized dynamic updates in active deployment container successfully.", "success");
                    }}
                    className="px-3.5 py-1.5 bg-lime-500 hover:bg-lime-400 text-slate-950 text-xs font-black rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Push Live Layout Updates</span>
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
