import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import SplashScreen from '@/components/SplashScreen';
import EditProfileDialog from '@/components/EditProfileDialog';
import CreateGroupDialog from '@/components/CreateGroupDialog';

interface User {
  id: number;
  name: string;
  avatar: string;
  online?: boolean;
  customName?: string;
}

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

interface Group {
  id: number;
  name: string;
  icon: string;
  description: string;
  members: number;
  maxMembers: number;
}

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedChat, setSelectedChat] = useState<number | null>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  
  const [userProfile, setUserProfile] = useState({
    nickname: 'John "Dragon" Doe',
    avatar: '🎮'
  });

  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Alex "Shadow" Morgan', avatar: '⚡', online: true },
    { id: 2, name: 'Mike "Fury"', avatar: '🔥', online: true },
    { id: 3, name: 'Sarah K.', avatar: '💎', online: false },
    { id: 4, name: 'Катя "Phoenix"', avatar: '🦅', online: true },
  ]);

  const [groups, setGroups] = useState<Group[]>([
    { id: 1, name: 'Team Dragons', icon: '🐉', description: 'Профессиональная команда', members: 847, maxMembers: 200000 },
    { id: 2, name: 'Elite Squad', icon: '⚔️', description: 'Топовые игроки', members: 1253, maxMembers: 200000 },
  ]);

  const [chats] = useState<Chat[]>([
    { id: 1, name: 'Alex "Shadow" Morgan', avatar: '⚡', lastMessage: 'GG! Завтра снова играем?', time: '2м', unread: 3, online: true },
    { id: 2, name: 'Team Dragons', avatar: '🐉', lastMessage: 'Катя: Собираемся в 20:00', time: '15м', unread: 12, online: true },
    { id: 3, name: 'Mike "Fury"', avatar: '🔥', lastMessage: 'Видел новый патч? Мета изменилась', time: '1ч', online: true },
    { id: 4, name: 'Elite Squad', avatar: '⚔️', lastMessage: 'Антон: Нужен ещё один для рейда', time: '3ч', unread: 5 },
    { id: 5, name: 'Sarah K.', avatar: '💎', lastMessage: 'Скинь билд своего перса', time: '5ч' },
  ]);

  const streams: Stream[] = [
    { id: 1, streamer: 'ProGamer_TTV', game: 'Valorant', viewers: '12.5K', thumbnail: '', live: true },
    { id: 2, streamer: 'QueenOfGames', game: 'League of Legends', viewers: '8.2K', thumbnail: '', live: true },
    { id: 3, streamer: 'SpeedRunner_99', game: 'Dark Souls III', viewers: '5.1K', thumbnail: '', live: true },
    { id: 4, streamer: 'TacticalMind', game: 'CS:GO', viewers: '3.8K', thumbnail: '', live: true },
    { id: 5, streamer: 'Roblox_Master', game: 'Roblox', viewers: '15.2K', thumbnail: '', live: true },
  ];

  const games = ['Valorant', 'League of Legends', 'CS:GO', 'Dota 2', 'Apex Legends', 'Roblox'];

  const voiceChannels = [
    { id: 1, name: 'Лобби', users: 3, active: false },
    { id: 2, name: 'Соревнования', users: 5, active: true },
    { id: 3, name: 'Casual Gaming', users: 2, active: false },
  ];

  const handleSaveProfile = (nickname: string, avatar: string) => {
    setUserProfile({ nickname, avatar });
  };

  const handleCreateGroup = (name: string, description: string, icon: string) => {
    const newGroup: Group = {
      id: groups.length + 1,
      name,
      icon,
      description,
      members: 1,
      maxMembers: 200000
    };
    setGroups([...groups, newGroup]);
  };

  const handleRenameUser = (userId: number, newName: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, customName: newName } : user
    ));
  };

  const filteredUsers = users.filter(user =>
    (user.customName || user.name).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <aside className="w-20 bg-card border-r border-border flex flex-col items-center py-6 gap-6 animate-slide-up">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-xl transition-transform hover:scale-110 cursor-pointer">
          R
        </div>
        
        <nav className="flex flex-col gap-4 flex-1">
          <Button
            variant={activeTab === 'chats' ? 'default' : 'ghost'}
            size="icon"
            className="w-12 h-12 rounded-xl transition-all hover:scale-110"
            onClick={() => setActiveTab('chats')}
          >
            <Icon name="MessageSquare" size={22} />
          </Button>
          
          <Button
            variant={activeTab === 'streams' ? 'default' : 'ghost'}
            size="icon"
            className="w-12 h-12 rounded-xl transition-all hover:scale-110"
            onClick={() => setActiveTab('streams')}
          >
            <Icon name="Radio" size={22} />
          </Button>
          
          <Button
            variant={activeTab === 'games' ? 'default' : 'ghost'}
            size="icon"
            className="w-12 h-12 rounded-xl transition-all hover:scale-110"
            onClick={() => setActiveTab('games')}
          >
            <Icon name="Gamepad2" size={22} />
          </Button>
          
          <Button
            variant={activeTab === 'search' ? 'default' : 'ghost'}
            size="icon"
            className="w-12 h-12 rounded-xl transition-all hover:scale-110"
            onClick={() => setActiveTab('search')}
          >
            <Icon name="Search" size={22} />
          </Button>
          
          <Button
            variant={activeTab === 'profile' ? 'default' : 'ghost'}
            size="icon"
            className="w-12 h-12 rounded-xl transition-all hover:scale-110"
            onClick={() => setActiveTab('profile')}
          >
            <Icon name="User" size={22} />
          </Button>
        </nav>

        <div className="flex flex-col gap-3">
          <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl transition-all hover:scale-110">
            <Icon name="Settings" size={20} />
          </Button>
          
          <button 
            onClick={() => setEditProfileOpen(true)}
            className="relative group"
          >
            <Avatar className="w-12 h-12 border-2 border-primary transition-transform group-hover:scale-110">
              {userProfile.avatar.startsWith('data:') || userProfile.avatar.startsWith('http') ? (
                <AvatarImage src={userProfile.avatar} alt="User avatar" />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-2xl">
                  {userProfile.avatar}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-background" />
          </button>
        </div>
      </aside>

      <div className="w-80 bg-card border-r border-border flex flex-col animate-fade-in">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold">
              {activeTab === 'chats' && 'Сообщения'}
              {activeTab === 'streams' && 'Стримы'}
              {activeTab === 'games' && 'Игры'}
              {activeTab === 'search' && 'Поиск'}
              {activeTab === 'profile' && 'Профиль'}
            </h2>
            {activeTab === 'chats' && (
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => setCreateGroupOpen(true)}
                className="h-8 w-8 p-0 hover:bg-primary/20"
              >
                <Icon name="Plus" size={18} />
              </Button>
            )}
          </div>
          <div className="relative">
            <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-border"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          {activeTab === 'chats' && (
            <div className="p-2">
              {chats.map((chat, index) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  className={`w-full p-3 rounded-xl mb-1 flex items-start gap-3 transition-all hover:bg-muted animate-fade-in ${
                    selectedChat === chat.id ? 'bg-muted' : ''
                  }`}
                >
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-xl">
                        {chat.avatar}
                      </AvatarFallback>
                    </Avatar>
                    {chat.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card animate-pulse" />
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
                    <Badge className="bg-primary text-primary-foreground animate-scale-in">{chat.unread}</Badge>
                  )}
                </button>
              ))}
            </div>
          )}

          {activeTab === 'streams' && (
            <div className="p-2">
              {streams.map((stream, index) => (
                <div
                  key={stream.id}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  className="mb-3 rounded-xl overflow-hidden bg-muted hover:ring-2 hover:ring-primary transition-all cursor-pointer animate-fade-in"
                >
                  <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Icon name="Play" size={40} className="text-primary" />
                    {stream.live && (
                      <Badge className="absolute top-2 left-2 bg-red-500 text-white animate-pulse">
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
                {games.map((game, i) => (
                  <div
                    key={i}
                    style={{ animationDelay: `${i * 0.05}s` }}
                    className="p-4 rounded-xl bg-gradient-to-br from-muted to-muted/50 hover:ring-2 hover:ring-primary transition-all cursor-pointer animate-fade-in"
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

          {activeTab === 'search' && (
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Icon name="Users" size={16} className="text-primary" />
                    Пользователи
                  </h3>
                  <div className="space-y-2">
                    {filteredUsers.map((user, i) => (
                      <div
                        key={user.id}
                        style={{ animationDelay: `${i * 0.05}s` }}
                        className="p-3 rounded-xl bg-muted hover:bg-muted/70 transition-all cursor-pointer animate-fade-in group"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-lg">
                              {user.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{user.customName || user.name}</p>
                            {user.customName && (
                              <p className="text-xs text-muted-foreground truncate">Оригинал: {user.name}</p>
                            )}
                          </div>
                          {user.online && (
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-7 px-2"
                            onClick={() => {
                              const newName = prompt('Введите новое имя:', user.customName || user.name);
                              if (newName) handleRenameUser(user.id, newName);
                            }}
                          >
                            <Icon name="Edit" size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Icon name="Users" size={16} className="text-secondary" />
                    Группы
                  </h3>
                  <div className="space-y-2">
                    {filteredGroups.map((group, i) => (
                      <div
                        key={group.id}
                        style={{ animationDelay: `${(filteredUsers.length + i) * 0.05}s` }}
                        className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 hover:ring-2 hover:ring-primary transition-all cursor-pointer animate-fade-in"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-xl">
                            {group.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{group.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {group.members.toLocaleString()} из {group.maxMembers.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="p-4 animate-fade-in">
              <div className="text-center mb-6">
                <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary">
                  {userProfile.avatar.startsWith('data:') || userProfile.avatar.startsWith('http') ? (
                    <AvatarImage src={userProfile.avatar} alt="User avatar" />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-4xl">
                      {userProfile.avatar}
                    </AvatarFallback>
                  )}
                </Avatar>
                <h3 className="text-xl font-bold mb-1">{userProfile.nickname}</h3>
                <p className="text-sm text-muted-foreground">Уровень 47 • Elite Gamer</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3"
                  onClick={() => setEditProfileOpen(true)}
                >
                  <Icon name="Edit" size={14} className="mr-2" />
                  Редактировать
                </Button>
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
                  className={`w-full p-2 rounded-lg flex items-center justify-between transition-all hover:scale-105 ${
                    channel.active
                      ? 'bg-primary/20 ring-2 ring-primary animate-glow-pulse'
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
            <div className="h-16 border-b border-border px-6 flex items-center justify-between bg-card/50 backdrop-blur-sm animate-fade-in">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-lg">
                    ⚡
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">Alex "Shadow" Morgan</h3>
                  <p className="text-xs text-green-500 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Онлайн
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-xl transition-transform hover:scale-110">
                  <Icon name="Phone" size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-xl transition-transform hover:scale-110">
                  <Icon name="Video" size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-xl transition-transform hover:scale-110">
                  <Icon name="MoreVertical" size={20} />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4 max-w-3xl mx-auto">
                {[
                  { sender: 'other', text: 'Привет! Готов к катке?', time: '14:23', avatar: '⚡' },
                  { sender: 'me', text: 'Да, уже в игре! Заходи', time: '14:24', avatar: userProfile.avatar },
                  { sender: 'other', text: 'Отлично! Катя с нами будет?', time: '14:25', avatar: '⚡' },
                  { sender: 'me', text: 'Да, она уже в голосовом канале', time: '14:26', avatar: userProfile.avatar },
                  { sender: 'other', text: 'GG! Завтра снова играем?', time: '14:28', avatar: '⚡' },
                ].map((msg, i) => (
                  <div
                    key={i}
                    style={{ animationDelay: `${i * 0.1}s` }}
                    className={`flex gap-3 animate-slide-up ${msg.sender === 'me' ? 'justify-end' : ''}`}
                  >
                    {msg.sender === 'other' && (
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-lg">
                          {msg.avatar}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <div className={`${msg.sender === 'me' ? 'bg-primary' : 'bg-muted'} rounded-2xl ${msg.sender === 'me' ? 'rounded-tr-md' : 'rounded-tl-md'} px-4 py-2 mb-1 transition-all hover:scale-105`}>
                        <p>{msg.text}</p>
                      </div>
                      <span className={`text-xs text-muted-foreground ${msg.sender === 'me' ? 'mr-2' : 'ml-2'}`}>{msg.time}</span>
                    </div>
                    {msg.sender === 'me' && (
                      <Avatar className="w-10 h-10">
                        {msg.avatar.startsWith('data:') || msg.avatar.startsWith('http') ? (
                          <AvatarImage src={msg.avatar} alt="Your avatar" />
                        ) : (
                          <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-lg">
                            {msg.avatar}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border bg-card/50 backdrop-blur-sm">
              <div className="flex gap-3 max-w-3xl mx-auto">
                <Button variant="ghost" size="icon" className="rounded-xl transition-transform hover:scale-110">
                  <Icon name="Plus" size={20} />
                </Button>
                <Input
                  placeholder="Напишите сообщение..."
                  className="flex-1 bg-muted border-0 rounded-xl"
                />
                <Button variant="ghost" size="icon" className="rounded-xl transition-transform hover:scale-110">
                  <Icon name="Smile" size={20} />
                </Button>
                <Button size="icon" className="rounded-xl bg-primary hover:bg-primary/90 transition-transform hover:scale-110">
                  <Icon name="Send" size={20} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center animate-fade-in">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-6 animate-glow-pulse">
                <Icon name="MessageSquare" size={64} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Выберите чат</h2>
              <p className="text-muted-foreground">Начните общение с друзьями и командой</p>
            </div>
          </div>
        )}
      </div>

      <EditProfileDialog
        open={editProfileOpen}
        onOpenChange={setEditProfileOpen}
        currentNickname={userProfile.nickname}
        currentAvatar={userProfile.avatar}
        onSave={handleSaveProfile}
      />

      <CreateGroupDialog
        open={createGroupOpen}
        onOpenChange={setCreateGroupOpen}
        onCreate={handleCreateGroup}
      />
    </div>
  );
};

export default Index;