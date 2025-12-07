import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread?: number;
  online?: boolean;
}

interface Stream {
  id: number;
  streamer: string;
  game: string;
  viewers: string;
  thumbnail: string;
  live: boolean;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedChat, setSelectedChat] = useState<number | null>(1);

  const chats: Chat[] = [
    { id: 1, name: 'Alex "Shadow" Morgan', avatar: '', lastMessage: 'GG! Завтра снова играем?', time: '2м', unread: 3, online: true },
    { id: 2, name: 'Team Dragons', avatar: '', lastMessage: 'Катя: Собираемся в 20:00', time: '15м', unread: 12, online: true },
    { id: 3, name: 'Mike "Fury"', avatar: '', lastMessage: 'Видел новый патч? Мета изменилась', time: '1ч', online: true },
    { id: 4, name: 'Elite Squad', avatar: '', lastMessage: 'Антон: Нужен ещё один для рейда', time: '3ч', unread: 5 },
    { id: 5, name: 'Sarah K.', avatar: '', lastMessage: 'Скинь билд своего перса', time: '5ч' },
  ];

  const streams: Stream[] = [
    { id: 1, streamer: 'ProGamer_TTV', game: 'Valorant', viewers: '12.5K', thumbnail: '', live: true },
    { id: 2, streamer: 'QueenOfGames', game: 'League of Legends', viewers: '8.2K', thumbnail: '', live: true },
    { id: 3, streamer: 'SpeedRunner_99', game: 'Dark Souls III', viewers: '5.1K', thumbnail: '', live: true },
    { id: 4, streamer: 'TacticalMind', game: 'CS:GO', viewers: '3.8K', thumbnail: '', live: true },
  ];

  const voiceChannels = [
    { id: 1, name: 'Лобби', users: 3, active: false },
    { id: 2, name: 'Соревнования', users: 5, active: true },
    { id: 3, name: 'Casual Gaming', users: 2, active: false },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <aside className="w-20 bg-card border-r border-border flex flex-col items-center py-6 gap-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-xl">
          G
        </div>
        
        <nav className="flex flex-col gap-4 flex-1">
          <Button
            variant={activeTab === 'chats' ? 'default' : 'ghost'}
            size="icon"
            className="w-12 h-12 rounded-xl"
            onClick={() => setActiveTab('chats')}
          >
            <Icon name="MessageSquare" size={22} />
          </Button>
          
          <Button
            variant={activeTab === 'streams' ? 'default' : 'ghost'}
            size="icon"
            className="w-12 h-12 rounded-xl"
            onClick={() => setActiveTab('streams')}
          >
            <Icon name="Radio" size={22} />
          </Button>
          
          <Button
            variant={activeTab === 'games' ? 'default' : 'ghost'}
            size="icon"
            className="w-12 h-12 rounded-xl"
            onClick={() => setActiveTab('games')}
          >
            <Icon name="Gamepad2" size={22} />
          </Button>
          
          <Button
            variant={activeTab === 'profile' ? 'default' : 'ghost'}
            size="icon"
            className="w-12 h-12 rounded-xl"
            onClick={() => setActiveTab('profile')}
          >
            <Icon name="User" size={22} />
          </Button>
        </nav>

        <div className="flex flex-col gap-3">
          <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl">
            <Icon name="Settings" size={20} />
          </Button>
          
          <div className="relative">
            <Avatar className="w-12 h-12 border-2 border-primary">
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary">JD</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-background" />
          </div>
        </div>
      </aside>

      <div className="w-80 bg-card border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-xl font-bold mb-3">
            {activeTab === 'chats' && 'Сообщения'}
            {activeTab === 'streams' && 'Стримы'}
            {activeTab === 'games' && 'Игры'}
            {activeTab === 'profile' && 'Профиль'}
          </h2>
          <div className="relative">
            <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск..."
              className="pl-10 bg-background border-border"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          {activeTab === 'chats' && (
            <div className="p-2">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`w-full p-3 rounded-xl mb-1 flex items-start gap-3 transition-all hover:bg-muted ${
                    selectedChat === chat.id ? 'bg-muted' : ''
                  }`}
                >
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20">
                        {chat.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    {chat.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                    )}
                  </div>
                  
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm truncate">{chat.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">{chat.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                  </div>
                  
                  {chat.unread && (
                    <Badge className="bg-primary text-primary-foreground">{chat.unread}</Badge>
                  )}
                </button>
              ))}
            </div>
          )}

          {activeTab === 'streams' && (
            <div className="p-2">
              {streams.map((stream) => (
                <div
                  key={stream.id}
                  className="mb-3 rounded-xl overflow-hidden bg-muted hover:ring-2 hover:ring-primary transition-all cursor-pointer"
                >
                  <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Icon name="Play" size={40} className="text-primary" />
                    {stream.live && (
                      <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                        <Icon name="Radio" size={12} className="mr-1" />
                        LIVE
                      </Badge>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="font-semibold mb-1">{stream.streamer}</h4>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{stream.game}</span>
                      <span className="flex items-center gap-1">
                        <Icon name="Eye" size={12} />
                        {stream.viewers}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'games' && (
            <div className="p-4">
              <div className="space-y-3">
                {['Valorant', 'League of Legends', 'CS:GO', 'Dota 2', 'Apex Legends'].map((game, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-gradient-to-br from-muted to-muted/50 hover:ring-2 hover:ring-primary transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                        <Icon name="Gamepad2" size={24} />
                      </div>
                      <div>
                        <h4 className="font-semibold">{game}</h4>
                        <p className="text-xs text-muted-foreground">Последняя игра: сегодня</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="p-4">
              <div className="text-center mb-6">
                <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-2xl font-bold">
                    JD
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold mb-1">John "Dragon" Doe</h3>
                <p className="text-sm text-muted-foreground">Уровень 47 • Elite Gamer</p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-muted">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Рейтинг</span>
                    <span className="font-bold text-primary">Diamond II</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Побед</span>
                    <span className="font-semibold">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Часов в игре</span>
                    <span className="font-semibold">2,340ч</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Trophy" size={20} className="text-secondary" />
                    <span className="font-semibold">Достижения</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Разблокировано 156 из 200</p>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>

        {activeTab === 'chats' && (
          <div className="p-4 border-t border-border">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Icon name="Volume2" size={16} className="text-primary" />
              Голосовые каналы
            </h3>
            <div className="space-y-2">
              {voiceChannels.map((channel) => (
                <button
                  key={channel.id}
                  className={`w-full p-2 rounded-lg flex items-center justify-between transition-all ${
                    channel.active
                      ? 'bg-primary/20 ring-2 ring-primary'
                      : 'bg-muted hover:bg-muted/70'
                  }`}
                >
                  <span className="text-sm font-medium">{channel.name}</span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Icon name="Users" size={12} />
                    {channel.users}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        {selectedChat && activeTab === 'chats' ? (
          <>
            <div className="h-16 border-b border-border px-6 flex items-center justify-between bg-card/50 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20">
                    AM
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">Alex "Shadow" Morgan</h3>
                  <p className="text-xs text-green-500 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    Онлайн
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <Icon name="Phone" size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <Icon name="Video" size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <Icon name="MoreVertical" size={20} />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4 max-w-3xl mx-auto">
                <div className="flex gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20">
                      AM
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-2 mb-1">
                      <p>Привет! Готов к катке?</p>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">14:23</span>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <div>
                    <div className="bg-primary rounded-2xl rounded-tr-md px-4 py-2 mb-1">
                      <p>Да, уже в игре! Заходи</p>
                    </div>
                    <span className="text-xs text-muted-foreground mr-2">14:24</span>
                  </div>
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary">
                      JD
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20">
                      AM
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-2 mb-1">
                      <p>Отлично! Катя с нами будет?</p>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">14:25</span>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <div>
                    <div className="bg-primary rounded-2xl rounded-tr-md px-4 py-2 mb-1">
                      <p>Да, она уже в голосовом канале</p>
                    </div>
                    <span className="text-xs text-muted-foreground mr-2">14:26</span>
                  </div>
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary">
                      JD
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20">
                      AM
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-2 mb-1">
                      <p>GG! Завтра снова играем?</p>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">14:28</span>
                  </div>
                </div>
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border bg-card/50 backdrop-blur-sm">
              <div className="flex gap-3 max-w-3xl mx-auto">
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <Icon name="Plus" size={20} />
                </Button>
                <Input
                  placeholder="Напишите сообщение..."
                  className="flex-1 bg-muted border-0 rounded-xl"
                />
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <Icon name="Smile" size={20} />
                </Button>
                <Button size="icon" className="rounded-xl bg-primary hover:bg-primary/90">
                  <Icon name="Send" size={20} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-6">
                <Icon name="MessageSquare" size={64} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Выберите чат</h2>
              <p className="text-muted-foreground">Начните общение с друзьями и командой</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
