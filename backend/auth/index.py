"""
Функция регистрации и авторизации пользователей по номеру телефона
"""
import json
import os
import psycopg2
from typing import Dict, Any
import hashlib
import random
import string

def generate_invite_code() -> str:
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database not configured'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'register':
                phone = body_data.get('phone', '').strip()
                nickname = body_data.get('nickname', 'User').strip()
                avatar = body_data.get('avatar', '🎮')
                invite_code_used = body_data.get('inviteCode', '').strip()
                
                if not phone:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Phone required'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute("SELECT id FROM users WHERE phone = %s", (phone,))
                existing = cur.fetchone()
                
                if existing:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Phone already registered'}),
                        'isBase64Encoded': False
                    }
                
                invite_code = generate_invite_code()
                
                cur.execute("""
                    INSERT INTO users (phone, nickname, avatar, invite_code, invited_by, status)
                    VALUES (%s, %s, %s, %s, %s, 'online')
                    RETURNING id, phone, nickname, avatar, invite_code
                """, (phone, nickname, avatar, invite_code, invite_code_used or None))
                
                user = cur.fetchone()
                
                if invite_code_used:
                    cur.execute("SELECT id FROM users WHERE invite_code = %s", (invite_code_used,))
                    inviter = cur.fetchone()
                    if inviter:
                        cur.execute("""
                            INSERT INTO chats (type, name) VALUES ('direct', NULL) RETURNING id
                        """)
                        chat = cur.fetchone()
                        chat_id = chat[0]
                        
                        cur.execute("""
                            INSERT INTO chat_members (chat_id, user_id, role)
                            VALUES (%s, %s, 'member'), (%s, %s, 'member')
                        """, (chat_id, user[0], chat_id, inviter[0]))
                        
                        cur.execute("""
                            INSERT INTO notifications (user_id, type, title, message)
                            VALUES (%s, 'new_contact', 'Новый контакт', %s)
                        """, (inviter[0], f'{nickname} присоединился по вашей ссылке'))
                
                conn.commit()
                
                token = hashlib.sha256(f"{user[0]}{phone}".encode()).hexdigest()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'user': {
                            'id': user[0],
                            'phone': user[1],
                            'nickname': user[2],
                            'avatar': user[3],
                            'inviteCode': user[4]
                        },
                        'token': token
                    }),
                    'isBase64Encoded': False
                }
            
            elif action == 'login':
                phone = body_data.get('phone', '').strip()
                
                cur.execute("""
                    SELECT id, phone, nickname, avatar, invite_code
                    FROM users WHERE phone = %s
                """, (phone,))
                
                user = cur.fetchone()
                
                if not user:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'User not found'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute("""
                    UPDATE users SET status = 'online', last_seen = CURRENT_TIMESTAMP
                    WHERE id = %s
                """, (user[0],))
                conn.commit()
                
                token = hashlib.sha256(f"{user[0]}{phone}".encode()).hexdigest()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'user': {
                            'id': user[0],
                            'phone': user[1],
                            'nickname': user[2],
                            'avatar': user[3],
                            'inviteCode': user[4]
                        },
                        'token': token
                    }),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()
