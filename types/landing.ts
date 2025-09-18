import { LucideIcon } from "lucide-react";

export interface LandingProps {
  onGetStarted: () => void;
}

export interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface HeroSectionProps {
  onGetStarted: () => void;
  isConnected: boolean;
}

export interface FeatureSectionProps {
  features: FeatureCardProps[];
}

export interface CtaSectionProps {
  onGetStarted: () => void;
  isConnected: boolean;
}
