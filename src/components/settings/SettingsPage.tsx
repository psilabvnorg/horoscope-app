import { useState } from 'react';
import type { UserProfile } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  User, 
  Calendar, 
  Heart, 
  Trash2, 
  LogOut, 
  ChevronRight,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

interface SettingsPageProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onClearHistory: () => void;
  onDeleteAccount: () => void;
  onRemovePartner: () => void;
}

export function SettingsPage({ 
  profile, 
  onUpdateProfile, 
  onClearHistory, 
  onDeleteAccount,
  onRemovePartner 
}: SettingsPageProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');

  const handleSave = () => {
    if (editingField && tempValue) {
      onUpdateProfile({ [editingField]: tempValue });
      setEditingField(null);
      setTempValue('');
    }
  };

  const renderEditDialog = () => {
    if (!editingField) return null;

    const titles: Record<string, string> = {
      name: 'Edit Name',
      birthday: 'Edit Birthday',
      partnerBirthday: 'Edit Partner Birthday',
    };

    const isDate = editingField.includes('birthday');

    return (
      <Dialog open={!!editingField} onOpenChange={() => setEditingField(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{titles[editingField]}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              type={isDate ? 'date' : 'text'}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              placeholder={`Enter new ${editingField}`}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingField(null)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your profile and preferences</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6 max-w-2xl mx-auto">
          {/* Profile section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Profile</h3>
            
            {/* Name */}
            <div 
              className="flex items-center justify-between p-4 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
              onClick={() => { setEditingField('name'); setTempValue(profile.name); }}
            >
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-violet-500" />
                <div>
                  <div className="text-sm text-muted-foreground">Name</div>
                  <div className="font-medium">{profile.name}</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>

            {/* Birthday */}
            <div 
              className="flex items-center justify-between p-4 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
              onClick={() => { setEditingField('birthday'); setTempValue(profile.birthday); }}
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-violet-500" />
                <div>
                  <div className="text-sm text-muted-foreground">Birthday</div>
                  <div className="font-medium">
                    {profile.birthday ? new Date(profile.birthday).toLocaleDateString() : 'Not set'}
                  </div>
                  <div className="text-xs text-violet-500 capitalize">{profile.sign}</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>

            {/* Gender */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-5 h-5 text-violet-500" />
                <div className="text-sm text-muted-foreground">Gender</div>
              </div>
              <RadioGroup 
                value={profile.gender} 
                onValueChange={(v) => onUpdateProfile({ gender: v as any })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Partner section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Partner</h3>
            
            {profile.partnerSign ? (
              <div className="space-y-2">
                <div 
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => { setEditingField('partnerBirthday'); setTempValue(profile.partnerBirthday || ''); }}
                >
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-rose-500" />
                    <div>
                      <div className="text-sm text-muted-foreground">Partner's Birthday</div>
                      <div className="font-medium">
                        {profile.partnerBirthday ? new Date(profile.partnerBirthday).toLocaleDateString() : 'Not set'}
                      </div>
                      <div className="text-xs text-rose-500 capitalize">{profile.partnerSign}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full gap-2 text-rose-500"
                  onClick={onRemovePartner}
                >
                  <Heart className="w-4 h-4" />
                  Remove Partner
                </Button>
              </div>
            ) : (
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <Heart className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No partner added</p>
                <Button 
                  variant="outline" 
                  className="mt-2 gap-2"
                  onClick={() => { setEditingField('partnerBirthday'); setTempValue(''); }}
                >
                  <Heart className="w-4 h-4" />
                  Add Partner
                </Button>
              </div>
            )}
          </div>

          {/* Data section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Data</h3>
            
            <div className="space-y-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full gap-2">
                    <Trash2 className="w-4 h-4" />
                    Clear History
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Clear History?</DialogTitle>
                    <DialogDescription>
                      This will remove all your swipe history, tarot readings, and accepted traits. This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button variant="destructive" onClick={onClearHistory}>Clear</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full gap-2 text-red-500">
                    <LogOut className="w-4 h-4" />
                    Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      Delete Account?
                    </DialogTitle>
                    <DialogDescription>
                      This will permanently delete all your data including profile, history, and preferences. This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button variant="destructive" onClick={onDeleteAccount}>Delete</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats */}
          <div className="p-4 bg-violet-50 dark:bg-violet-950/30 rounded-lg">
            <h4 className="font-medium mb-3">Your Journey</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-violet-600">{profile.swipeCount}</div>
                <div className="text-xs text-muted-foreground">Traits Swiped</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-violet-600">{profile.acceptedTraits.length}</div>
                <div className="text-xs text-muted-foreground">Accepted</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-violet-600">{profile.rejectedTraits.length}</div>
                <div className="text-xs text-muted-foreground">Rejected</div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      {renderEditDialog()}
    </div>
  );
}
