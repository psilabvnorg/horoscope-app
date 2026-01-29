import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sparkles, Heart, User, Calendar, ArrowRight, ChevronRight } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: (data: {
    name: string;
    birthday: string;
    gender: 'male' | 'female' | 'other';
    partnerBirthday?: string;
  }) => void;
}

type Step = 'welcome' | 'name' | 'birthday' | 'gender' | 'partner' | 'complete';

// Helper to convert dd/mm/yyyy to yyyy-mm-dd for storage
function toISODate(ddmmyyyy: string): string {
  const parts = ddmmyyyy.split('/');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
  }
  return ddmmyyyy;
}

// Helper to validate dd/mm/yyyy format
function isValidDate(ddmmyyyy: string): boolean {
  const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  const match = ddmmyyyy.match(regex);
  if (!match) return false;
  
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);
  
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1900 || year > new Date().getFullYear()) return false;
  
  const date = new Date(year, month - 1, day);
  return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState<Step>('welcome');
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('other');
  const [partnerBirthday, setPartnerBirthday] = useState('');
  const [hasPartner, setHasPartner] = useState<boolean | null>(null);

  const handleNext = () => {
    switch (step) {
      case 'welcome':
        setStep('name');
        break;
      case 'name':
        if (name.trim()) setStep('birthday');
        break;
      case 'birthday':
        if (isValidDate(birthday)) setStep('gender');
        break;
      case 'gender':
        setStep('partner');
        break;
      case 'partner':
        if (hasPartner === false) {
          onComplete({ name, birthday: toISODate(birthday), gender });
        } else if (hasPartner === true && isValidDate(partnerBirthday)) {
          onComplete({ name, birthday: toISODate(birthday), gender, partnerBirthday: toISODate(partnerBirthday) });
        }
        break;
    }
  };

  const handleSkipPartner = () => {
    onComplete({ name, birthday: toISODate(birthday), gender });
  };

  const renderStep = () => {
    switch (step) {
      case 'welcome':
        return (
          <div className="flex flex-col items-center text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Welcome to Horos
              </h1>
              <p className="text-muted-foreground max-w-sm">
                Discover your cosmic destiny through astrology, tarot, and personalized insights
              </p>
            </div>
            <Button 
              onClick={handleNext}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-full shadow-lg shadow-purple-500/30 transition-all hover:scale-105"
            >
              Begin Your Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        );

      case 'name':
        return (
          <div className="flex flex-col space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 w-full max-w-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <User className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">What should we call you?</h2>
                <p className="text-sm text-muted-foreground">This helps personalize your experience</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="h-12 text-lg"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && name.trim() && handleNext()}
              />
            </div>
            <Button 
              onClick={handleNext}
              disabled={!name.trim()}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
            >
              Continue
              <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        );

      case 'birthday':
        return (
          <div className="flex flex-col space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 w-full max-w-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">When were you born?</h2>
                <p className="text-sm text-muted-foreground">We use this to determine your zodiac sign</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthday">Birth Date (dd/mm/yyyy)</Label>
              <Input
                id="birthday"
                type="text"
                value={birthday}
                onChange={(e) => {
                  const val = e.target.value;
                  // Auto-add slashes
                  if (val.length === 2 && birthday.length === 1) {
                    setBirthday(val + '/');
                  } else if (val.length === 5 && birthday.length === 4) {
                    setBirthday(val + '/');
                  } else {
                    setBirthday(val);
                  }
                }}
                placeholder="dd/mm/yyyy"
                className="h-12 text-lg"
                maxLength={10}
                onKeyDown={(e) => e.key === 'Enter' && isValidDate(birthday) && handleNext()}
              />
              {birthday && !isValidDate(birthday) && (
                <p className="text-sm text-red-500">Please enter a valid date (dd/mm/yyyy)</p>
              )}
            </div>
            <Button 
              onClick={handleNext}
              disabled={!isValidDate(birthday)}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
            >
              Continue
              <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        );

      case 'gender':
        return (
          <div className="flex flex-col space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 w-full max-w-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">How do you identify?</h2>
                <p className="text-sm text-muted-foreground">This helps us personalize your readings</p>
              </div>
            </div>
            <RadioGroup value={gender} onValueChange={(v) => setGender(v as any)} className="space-y-3">
              <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female" className="flex-1 cursor-pointer">Female</Label>
              </div>
              <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male" className="flex-1 cursor-pointer">Male</Label>
              </div>
              <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other" className="flex-1 cursor-pointer">Other / Prefer not to say</Label>
              </div>
            </RadioGroup>
            <Button 
              onClick={handleNext}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
            >
              Continue
              <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        );

      case 'partner':
        return (
          <div className="flex flex-col space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 w-full max-w-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                <Heart className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Have a partner?</h2>
                <p className="text-sm text-muted-foreground">Add their info for couple compatibility readings</p>
              </div>
            </div>
            
            {hasPartner === null ? (
              <div className="space-y-3">
                <Button 
                  variant="outline"
                  onClick={() => setHasPartner(true)}
                  className="w-full h-14 text-lg justify-start px-6"
                >
                  <Heart className="mr-3 w-5 h-5 text-rose-500" />
                  Yes, I have a partner
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    onComplete({ name, birthday, gender });
                  }}
                  className="w-full h-14 text-lg justify-start px-6"
                >
                  <Sparkles className="mr-3 w-5 h-5 text-violet-500" />
                  No, I'm single
                </Button>
              </div>
            ) : hasPartner ? (
              <div className="space-y-4 animate-in fade-in">
                <div className="space-y-2">
                  <Label htmlFor="partner-birthday">Partner's Birth Date (dd/mm/yyyy)</Label>
                  <Input
                    id="partner-birthday"
                    type="text"
                    value={partnerBirthday}
                    onChange={(e) => {
                      const val = e.target.value;
                      // Auto-add slashes
                      if (val.length === 2 && partnerBirthday.length === 1) {
                        setPartnerBirthday(val + '/');
                      } else if (val.length === 5 && partnerBirthday.length === 4) {
                        setPartnerBirthday(val + '/');
                      } else {
                        setPartnerBirthday(val);
                      }
                    }}
                    placeholder="dd/mm/yyyy"
                    className="h-12 text-lg"
                    maxLength={10}
                  />
                  {partnerBirthday && !isValidDate(partnerBirthday) && (
                    <p className="text-sm text-red-500">Please enter a valid date (dd/mm/yyyy)</p>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => setHasPartner(null)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleNext}
                    disabled={!isValidDate(partnerBirthday)}
                    className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                  >
                    Complete
                  </Button>
                </div>
              </div>
            ) : null}
            
            {hasPartner === null && (
              <Button 
                variant="ghost"
                onClick={handleSkipPartner}
                className="text-muted-foreground"
              >
                Skip for now
              </Button>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-violet-950/20 dark:via-purple-950/20 dark:to-pink-950/20">
      <div className="w-full max-w-md">
        {/* Progress indicator */}
        {step !== 'welcome' && (
          <div className="flex gap-1 mb-8">
            {(['name', 'birthday', 'gender', 'partner'] as Step[]).map((s, i) => (
              <div 
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  ['name', 'birthday', 'gender', 'partner'].indexOf(step) >= i 
                    ? 'bg-gradient-to-r from-violet-500 to-purple-500' 
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
        )}
        
        {renderStep()}
      </div>
    </div>
  );
}
