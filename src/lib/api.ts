const API_URLS = {
  auth: 'https://functions.poehali.dev/fc053cb0-402d-4967-a3d0-6361ace03e8c',
  chats: 'https://functions.poehali.dev/b2f066c6-b216-4d1e-9063-c2b37e1a4642',
};

export const api = {
  async register(phone: string, nickname: string, avatar: string, inviteCode?: string) {
    const response = await fetch(API_URLS.auth, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'register',
        phone,
        nickname,
        avatar,
        inviteCode,
      }),
    });
    return response.json();
  },

  async login(phone: string) {
    const response = await fetch(API_URLS.auth, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'login',
        phone,
      }),
    });
    return response.json();
  },

  async getChats(userId: number, token: string) {
    const response = await fetch(`${API_URLS.chats}?userId=${userId}`, {
      headers: { 'X-User-Token': token },
    });
    return response.json();
  },

  async getMessages(chatId: number, token: string) {
    const response = await fetch(API_URLS.chats, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Token': token,
      },
      body: JSON.stringify({
        action: 'get_messages',
        chatId,
      }),
    });
    return response.json();
  },

  async sendMessage(
    chatId: number,
    userId: number,
    content: string,
    token: string,
    messageType: string = 'text',
    mediaUrl?: string,
    stickerId?: number
  ) {
    const response = await fetch(API_URLS.chats, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Token': token,
      },
      body: JSON.stringify({
        action: 'send_message',
        chatId,
        userId,
        content,
        messageType,
        mediaUrl,
        stickerId,
      }),
    });
    return response.json();
  },

  async createGroup(name: string, icon: string, userId: number, token: string) {
    const response = await fetch(API_URLS.chats, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Token': token,
      },
      body: JSON.stringify({
        action: 'create_group',
        name,
        icon,
        userId,
      }),
    });
    return response.json();
  },
};
