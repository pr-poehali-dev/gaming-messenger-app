import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

interface RegisterDialogProps {
  open: boolean;
  onComplete: (userData: any) => void;
  inviteCode?: string;
}

const avatarEmojis = ['🎮', '🚀', '⚡', '🔥', '💎', '🎯', '🌟', '👑'];

const RegisterDialog = ({ open, onComplete, inviteCode }: RegisterDialogProps) => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [nickname, setNickname] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🎮');
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    if (step === 1 && phone.trim()) {
      setStep(2);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const { api } = await import('@/lib/api');
      const result = await api.register(phone, nickname || 'User', selectedAvatar, inviteCode);
      
      if (result.user) {
        localStorage.setItem('rilmas_user', JSON.stringify(result.user));
        localStorage.setItem('rilmas_token', result.token);
        onComplete(result.user);
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} modal={true}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-center">
            {step === 1 ? 'Добро пожаловать в Rilmas!' : 'Настройте профиль'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {step === 1
              ? 'Введите ваш номер телефона для регистрации'
              : 'Выберите имя и аватар'}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Номер телефона</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (___) ___-__-__"
                className="bg-muted border-border"
              />
            </div>

            {inviteCode && (
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-2 text-sm">
                  <Icon name="UserPlus" size={16} className="text-primary" />
                  <span className="font-medium">Приглашение от друга</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Код: {inviteCode}
                </p>
              </div>
            )}

            <Button onClick={handleContinue} className="w-full" disabled={!phone.trim()}>
              Продолжить
              <Icon name="ArrowRight" size={16} className="ml-2" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nickname">Ваше имя</Label>
              <Input
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Введите имя"
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
                <p className="font-semibold">{nickname || 'Ваше имя'}</p>
                <p className="text-sm text-muted-foreground">{phone}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Назад
              </Button>
              <Button onClick={handleRegister} className="flex-1" disabled={loading}>
                {loading ? 'Регистрация...' : 'Готово'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RegisterDialog;
