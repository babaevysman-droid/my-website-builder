import {
  Award,
  BadgeCheck,
  BarChart3,
  Briefcase,
  CalendarCheck,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock,
  Code2,
  Crown,
  Dumbbell,
  Flame,
  Gem,
  Heart,
  Home,
  Laptop,
  Lightbulb,
  Mail,
  MapPin,
  MessageCircle,
  Palette,
  Phone,
  Rocket,
  Scissors,
  Shield,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
  Wand2,
  Zap,
} from 'lucide-react';

const iconMap = {
  award: Award,
  badge: BadgeCheck,
  check: CheckCircle2,
  briefcase: Briefcase,
  chart: BarChart3,
  calendar: CalendarCheck,
  camera: Camera,
  clock: Clock,
  code: Code2,
  crown: Crown,
  dumbbell: Dumbbell,
  flame: Flame,
  gem: Gem,
  heart: Heart,
  home: Home,
  laptop: Laptop,
  lightbulb: Lightbulb,
  mail: Mail,
  map: MapPin,
  message: MessageCircle,
  palette: Palette,
  phone: Phone,
  rocket: Rocket,
  scissors: Scissors,
  shield: Shield,
  sparkles: Sparkles,
  star: Star,
  target: Target,
  trophy: Trophy,
  wand: Wand2,
  zap: Zap,
};

function normalizeIconName(name?: unknown) {
  const value = String(name ?? '').toLowerCase();

  if (value.includes('scissor')) return 'scissors';
  if (value.includes('razor')) return 'scissors';
  if (value.includes('barber')) return 'scissors';
  if (value.includes('trophy')) return 'trophy';
  if (value.includes('winner')) return 'trophy';
  if (value.includes('shield')) return 'shield';
  if (value.includes('safe')) return 'shield';
  if (value.includes('rocket')) return 'rocket';
  if (value.includes('speed')) return 'zap';
  if (value.includes('zap')) return 'zap';
  if (value.includes('star')) return 'star';
  if (value.includes('premium')) return 'crown';
  if (value.includes('crown')) return 'crown';
  if (value.includes('gem')) return 'gem';
  if (value.includes('design')) return 'palette';
  if (value.includes('palette')) return 'palette';
  if (value.includes('phone')) return 'phone';
  if (value.includes('mail')) return 'mail';
  if (value.includes('message')) return 'message';
  if (value.includes('team')) return 'users';
  if (value.includes('user')) return 'users';
  if (value.includes('target')) return 'target';
  if (value.includes('calendar')) return 'calendar';
  if (value.includes('clock')) return 'clock';
  if (value.includes('home')) return 'home';
  if (value.includes('ai')) return 'wand';
  if (value.includes('magic')) return 'wand';
  if (value.includes('spark')) return 'sparkles';
  if (value.includes('fire')) return 'flame';
  if (value.includes('fitness')) return 'dumbbell';
  if (value.includes('gym')) return 'dumbbell';
  if (value.includes('code')) return 'code';
  if (value.includes('laptop')) return 'laptop';
  if (value.includes('idea')) return 'lightbulb';
  if (value.includes('chart')) return 'chart';
  if (value.includes('case')) return 'briefcase';
  if (value.includes('camera')) return 'camera';
  if (value.includes('location')) return 'map';
  if (value.includes('map')) return 'map';
  if (value.includes('award')) return 'award';
  if (value.includes('check')) return 'check';

  return 'sparkles';
}

export default function IconRenderer({
  name,
  className,
  size = 24,
}: {
  name?: unknown;
  className?: string;
  size?: number;
}) {
  const key = normalizeIconName(name) as keyof typeof iconMap;
  const Icon = iconMap[key] ?? Sparkles;

  return <Icon size={size} strokeWidth={2.2} className={className} />;
}