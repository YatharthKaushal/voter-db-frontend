import React, { useState } from 'react';
import { Users, FileText } from 'lucide-react';
import { GenderMale, GenderFemale } from 'phosphor-react';

const StatsSection = ({ voters }) => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const stats = [
    {
      name: 'Total Voters',
      value: voters.length,
      icon: Users,
      variant: 'primary',
      bgPattern: 'dots'
    },
    {
      name: 'Male Voters',
      value: voters.filter(v => v.gender === 'Male').length,
      icon: GenderMale,
      variant: 'light',
      bgPattern: 'waves'
    },
    {
      name: 'Female Voters',
      value: voters.filter(v => v.gender === 'Female').length,
      icon: GenderFemale,
      variant: 'light',
      bgPattern: 'grid'
    },
    {
      name: 'Average Age',
      value: Math.round(voters.reduce((sum, v) => sum + v.age, 0) / voters.length) || 0,
      icon: FileText,
      variant: 'accent',
      bgPattern: 'radial'
    }
  ];

  const getVariantStyles = (variant) => {
    const variants = {
      primary: {
        bg: 'bg-gradient-to-br from-emerald-600 to-emerald-700',
        text: 'text-white',
        subText: 'text-emerald-100',
        iconBg: 'bg-white/20',
        iconText: 'text-white',
        border: 'border-emerald-500/30',
        glow: 'shadow-emerald-500/20',
        accent: 'bg-white/10'
      },
      light: {
        bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
        text: 'text-emerald-900',
        subText: 'text-emerald-600',
        iconBg: 'bg-emerald-500',
        iconText: 'text-white',
        border: 'border-emerald-200',
        glow: 'shadow-emerald-200/40',
        accent: 'bg-emerald-200/50'
      },
      medium: {
        bg: 'bg-gradient-to-br from-emerald-400 to-emerald-500',
        text: 'text-white',
        subText: 'text-emerald-50',
        iconBg: 'bg-white/20',
        iconText: 'text-white',
        border: 'border-emerald-300/50',
        glow: 'shadow-emerald-400/25',
        accent: 'bg-white/15'
      },
      accent: {
        bg: 'bg-gradient-to-br from-emerald-200 to-emerald-300',
        text: 'text-emerald-900',
        subText: 'text-emerald-700',
        iconBg: 'bg-emerald-600',
        iconText: 'text-white',
        border: 'border-emerald-300',
        glow: 'shadow-emerald-300/30',
        accent: 'bg-emerald-400/30'
      }
    };
    return variants[variant];
  };

  const BackgroundPattern = ({ pattern, variant }) => {
    const baseColor = variant === 'primary' || variant === 'medium' ? 'white' : 'emerald-600';
    const opacity = variant === 'primary' || variant === 'medium' ? 'opacity-5' : 'opacity-10';

    return (
      <div className="absolute inset-0 overflow-hidden">
        {pattern === 'dots' && (
          <>
            <div className={`absolute top-4 right-4 w-2 h-2 bg-${baseColor} ${opacity} rounded-full`} />
            <div className={`absolute top-8 right-8 w-1 h-1 bg-${baseColor} ${opacity} rounded-full`} />
            <div className={`absolute bottom-8 left-6 w-1.5 h-1.5 bg-${baseColor} ${opacity} rounded-full`} />
          </>
        )}
        {pattern === 'waves' && (
          <div className={`absolute -bottom-2 -right-4 w-16 h-16 bg-${baseColor} ${opacity} rounded-full blur-2xl`} />
        )}
        {pattern === 'grid' && (
          <div className={`absolute top-2 right-2 w-6 h-6 border border-${baseColor} ${opacity} opacity-30`} />
        )}
        {pattern === 'radial' && (
          <div className={`absolute top-2 right-2 w-12 h-12 bg-gradient-radial from-${baseColor}/10 to-transparent rounded-full`} />
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const isHovered = hoveredCard === index;
        const styles = getVariantStyles(stat.variant);

        return (
          <div
            key={stat.name}
            className="relative group cursor-pointer"
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className={`absolute inset-0 rounded-2xl border-2 transition-all duration-300 ${isHovered ? 'border-emerald-400 scale-102' : 'border-transparent'}`} />
            <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${isHovered ? `shadow-xl ${styles.glow}` : 'shadow-md'}`} />

            <div className={`${styles.bg} relative rounded-2xl p-6 border border-white/10 transform transition-all duration-300 ${isHovered ? 'scale-102' : 'scale-100'} overflow-hidden`}>
              <BackgroundPattern pattern={stat.bgPattern} variant={stat.variant} />

              {isHovered && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-b from-white/5 to-transparent rotate-12 blur-lg opacity-50" 
                       style={{ clipPath: 'polygon(45% 0%, 55% 0%, 70% 100%, 30% 100%)' }} />
                </div>
              )}

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex flex-col space-y-3">
                  <div className={`${styles.iconBg} w-12 h-12 rounded-xl flex items-center justify-center transform transition-all duration-300 ${isHovered ? 'scale-110 rotate-6' : 'scale-100'} backdrop-blur-sm`}>
                    <Icon className={`h-6 w-6 ${styles.iconText}`} />
                  </div>
                  <p className={`text-xl font-medium ${styles.subText} leading-tight`}>{stat.name}</p>
                </div>

                <div className="text-right">
                  <p className={`text-4xl font-bold ${styles.text} leading-none transform transition-all duration-300 ${isHovered ? 'scale-105' : 'scale-100'}`}>
                    {stat.value.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className={`absolute bottom-0 left-0 right-0 h-1 ${styles.accent} transition-all duration-300 ${isHovered ? 'scale-x-100' : 'scale-x-0'} origin-left`} />

              {isHovered && (
                <div className="absolute top-4 right-4">
                  <div className={`w-2 h-2 ${styles.accent} rounded-full animate-pulse`} />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsSection;
