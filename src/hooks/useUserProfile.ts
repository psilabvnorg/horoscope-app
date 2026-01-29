import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { UserProfile, SwipeDirection } from '@/types';
import { getZodiacSign } from '@/types';

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  birthday: '',
  gender: 'other',
  sign: 'aries',
  acceptedTraits: [],
  rejectedTraits: [],
  swipeCount: 0,
  interests: {},
  createdAt: '',
};

export function useUserProfile() {
  const [profile, setProfile] = useLocalStorage<UserProfile>('horos-profile', DEFAULT_PROFILE);

  const isOnboarded = useMemo(() => {
    return !!profile.name && !!profile.birthday && !!profile.createdAt;
  }, [profile]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => {
      const newProfile = { ...prev, ...updates };
      if (updates.birthday && !updates.sign) {
        newProfile.sign = getZodiacSign(updates.birthday);
      }
      if (updates.partnerBirthday && !updates.partnerSign) {
        newProfile.partnerSign = getZodiacSign(updates.partnerBirthday);
      }
      return newProfile;
    });
  }, [setProfile]);

  const completeOnboarding = useCallback((data: {
    name: string;
    birthday: string;
    gender: 'male' | 'female' | 'other';
    partnerBirthday?: string;
  }) => {
    const sign = getZodiacSign(data.birthday);
    const partnerSign = data.partnerBirthday ? getZodiacSign(data.partnerBirthday) : undefined;
    
    setProfile({
      ...DEFAULT_PROFILE,
      name: data.name,
      birthday: data.birthday,
      gender: data.gender,
      sign,
      partnerBirthday: data.partnerBirthday,
      partnerSign,
      createdAt: new Date().toISOString(),
    });
  }, [setProfile]);

  const handleSwipe = useCallback((traitId: string, direction: SwipeDirection) => {
    setProfile(prev => {
      const newProfile = { ...prev };
      
      if (direction === 'right' || direction === 'up') {
        if (!newProfile.acceptedTraits.includes(traitId)) {
          newProfile.acceptedTraits = [...newProfile.acceptedTraits, traitId];
        }
        newProfile.rejectedTraits = newProfile.rejectedTraits.filter(t => t !== traitId);
        
        // Update interests based on trait category
        const category = traitId.split('-')[0];
        if (category) {
          newProfile.interests = {
            ...newProfile.interests,
            [category]: (newProfile.interests[category] || 0) + (direction === 'up' ? 2 : 1)
          };
        }
      } else if (direction === 'left') {
        if (!newProfile.rejectedTraits.includes(traitId)) {
          newProfile.rejectedTraits = [...newProfile.rejectedTraits, traitId];
        }
        newProfile.acceptedTraits = newProfile.acceptedTraits.filter(t => t !== traitId);
      }
      
      newProfile.swipeCount += 1;
      return newProfile;
    });
  }, [setProfile]);

  const clearHistory = useCallback(() => {
    setProfile(prev => ({
      ...prev,
      acceptedTraits: [],
      rejectedTraits: [],
      swipeCount: 0,
      interests: {},
    }));
  }, [setProfile]);

  const deleteAccount = useCallback(() => {
    setProfile(DEFAULT_PROFILE);
  }, [setProfile]);

  const removePartner = useCallback(() => {
    setProfile(prev => ({
      ...prev,
      partnerBirthday: undefined,
      partnerSign: undefined,
    }));
  }, [setProfile]);

  return {
    profile,
    isOnboarded,
    updateProfile,
    completeOnboarding,
    handleSwipe,
    clearHistory,
    deleteAccount,
    removePartner,
  };
}
