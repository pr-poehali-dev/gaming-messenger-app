import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentNickname: string;
  currentAvatar: string;
  onSave: (nickname: string, avatar: string) => void;
}

const avatarEmojis = ['🎮', '🚀', '⚡', '🔥', '💎', '🎯', '🌟', '👑', '🦁', '🐉', '🦅', '🦈', '🎨', '🎭', '🎪', '🎸'];

const EditProfileDialog = ({ open, onOpenChange, currentNickname, currentAvatar, onSave }: EditProfileDialogProps) => {
  const [nickname, setNickname] = useState(currentNickname);
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);

  const handleSave = () => {
    if (nickname.trim()) {
      onSave(nickname, selectedAvatar);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Редактировать профиль</DialogTitle>
          <DialogDescription>
            Измените свой никнейм и выберите аватар
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="nickname">Никнейм</Label>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Введите никнейм"
              className="bg-muted border-border"
            />
          </div>

          <div className="space-y-3">
            <Label>Выберите аватар</Label>
            <div className="grid grid-cols-8 gap-2">
              {avatarEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setSelectedAvatar(emoji)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all hover:scale-110 ${
                    selectedAvatar === emoji
                      ? 'bg-primary ring-2 ring-primary'
                      : 'bg-muted hover:bg-muted/70'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
            <Avatar className="w-12 h-12 border-2 border-primary">
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-2xl">
                {selectedAvatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{nickname || 'Ваш никнейм'}</p>
              <p className="text-sm text-muted-foreground">Предпросмотр</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Отмена
          </Button>
          <Button onClick={handleSave} className="flex-1">
            Сохранить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
