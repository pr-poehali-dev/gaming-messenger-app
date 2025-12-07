import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (name: string, description: string, icon: string) => void;
}

const groupIcons = ['🎮', '🎯', '⚔️', '🛡️', '🏆', '👥', '💬', '🌟', '🔥', '⚡', '💎', '🎪'];

const CreateGroupDialog = ({ open, onOpenChange, onCreate }: CreateGroupDialogProps) => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('👥');

  const handleCreate = () => {
    if (groupName.trim()) {
      onCreate(groupName, description, selectedIcon);
      setGroupName('');
      setDescription('');
      setSelectedIcon('👥');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Создать группу</DialogTitle>
          <DialogDescription>
            Создайте группу до 200,000 участников
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="groupName">Название группы</Label>
            <Input
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Введите название"
              className="bg-muted border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Расскажите о вашей группе..."
              className="bg-muted border-border resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <Label>Иконка группы</Label>
            <div className="grid grid-cols-6 gap-2">
              {groupIcons.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setSelectedIcon(icon)}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl transition-all hover:scale-110 ${
                    selectedIcon === icon
                      ? 'bg-primary ring-2 ring-primary'
                      : 'bg-muted hover:bg-muted/70'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-xl">
                {selectedIcon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{groupName || 'Название группы'}</p>
                <p className="text-xs text-muted-foreground">0 участников • Лимит: 200,000</p>
              </div>
            </div>
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Отмена
          </Button>
          <Button onClick={handleCreate} className="flex-1">
            <Icon name="Plus" size={16} className="mr-2" />
            Создать
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;
