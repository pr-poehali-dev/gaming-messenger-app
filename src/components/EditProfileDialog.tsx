import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [avatarType, setAvatarType] = useState<'emoji' | 'image'>(currentAvatar.startsWith('data:') || currentAvatar.startsWith('http') ? 'image' : 'emoji');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setUploadedImage(result);
        setSelectedAvatar(result);
        setAvatarType('image');
      };
      reader.readAsDataURL(file);
    }
  };

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
            <Tabs value={avatarType} onValueChange={(v) => setAvatarType(v as 'emoji' | 'image')} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="emoji">Эмодзи</TabsTrigger>
                <TabsTrigger value="image">Изображение</TabsTrigger>
              </TabsList>
              
              <TabsContent value="emoji" className="space-y-3 mt-3">
                <div className="grid grid-cols-8 gap-2">
                  {avatarEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        setSelectedAvatar(emoji);
                        setAvatarType('emoji');
                      }}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all hover:scale-110 ${
                        selectedAvatar === emoji && avatarType === 'emoji'
                          ? 'bg-primary ring-2 ring-primary'
                          : 'bg-muted hover:bg-muted/70'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="image" className="space-y-3 mt-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Icon name="Upload" size={16} className="mr-2" />
                    Загрузить изображение
                  </Button>
                  
                  {uploadedImage && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                      <Avatar className="w-16 h-16 border-2 border-primary">
                        <AvatarImage src={uploadedImage} alt="Uploaded avatar" />
                        <AvatarFallback>IMG</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Изображение загружено</p>
                        <p className="text-xs text-muted-foreground">Нажмите "Сохранить" чтобы применить</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setUploadedImage(null);
                          setAvatarType('emoji');
                          setSelectedAvatar('🎮');
                        }}
                      >
                        <Icon name="X" size={16} />
                      </Button>
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground text-center">
                    Поддерживаются: JPG, PNG, GIF (макс. 5MB)
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
            <Avatar className="w-12 h-12 border-2 border-primary">
              {avatarType === 'image' ? (
                <AvatarImage src={selectedAvatar} alt="Avatar preview" />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-2xl">
                  {selectedAvatar}
                </AvatarFallback>
              )}
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