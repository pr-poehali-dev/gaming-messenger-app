"""
Функция для работы с чатами и сообщениями
"""
import json
import os
import psycopg2
from typing import Dict, Any

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
    user_token = event.get('headers', {}).get('x-user-token', '')
    
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
        if method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            user_id = params.get('userId')
            
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'userId required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("""
                SELECT 
                    c.id, c.type, c.name, c.icon,
                    u.id as user_id, u.nickname, u.avatar, u.status,
                    m.content, m.created_at, m.message_type,
                    (SELECT COUNT(*) FROM messages WHERE chat_id = c.id AND user_id != %s) as unread
                FROM chats c
                JOIN chat_members cm ON cm.chat_id = c.id
                LEFT JOIN chat_members cm2 ON cm2.chat_id = c.id AND cm2.user_id != %s
                LEFT JOIN users u ON u.id = cm2.user_id
                LEFT JOIN LATERAL (
                    SELECT content, created_at, message_type
                    FROM messages
                    WHERE chat_id = c.id
                    ORDER BY created_at DESC
                    LIMIT 1
                ) m ON true
                WHERE cm.user_id = %s
                ORDER BY m.created_at DESC NULLS LAST
            """, (user_id, user_id, user_id))
            
            chats = []
            for row in cur.fetchall():
                chats.append({
                    'id': row[0],
                    'type': row[1],
                    'name': row[2] or row[5],
                    'icon': row[3] or row[6],
                    'userId': row[4],
                    'nickname': row[5],
                    'avatar': row[6],
                    'status': row[7],
                    'lastMessage': row[8],
                    'lastMessageTime': row[9].isoformat() if row[9] else None,
                    'messageType': row[10],
                    'unread': row[11]
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'chats': chats}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'send_message':
                chat_id = body_data.get('chatId')
                user_id = body_data.get('userId')
                content = body_data.get('content', '')
                message_type = body_data.get('messageType', 'text')
                media_url = body_data.get('mediaUrl')
                sticker_id = body_data.get('stickerId')
                
                cur.execute("""
                    INSERT INTO messages (chat_id, user_id, content, message_type, media_url, sticker_id)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING id, created_at
                """, (chat_id, user_id, content, message_type, media_url, sticker_id))
                
                msg = cur.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'messageId': msg[0],
                        'createdAt': msg[1].isoformat()
                    }),
                    'isBase64Encoded': False
                }
            
            elif action == 'get_messages':
                chat_id = body_data.get('chatId')
                limit = body_data.get('limit', 50)
                
                cur.execute("""
                    SELECT 
                        m.id, m.content, m.message_type, m.media_url, m.created_at,
                        u.id, u.nickname, u.avatar
                    FROM messages m
                    JOIN users u ON u.id = m.user_id
                    WHERE m.chat_id = %s
                    ORDER BY m.created_at DESC
                    LIMIT %s
                """, (chat_id, limit))
                
                messages = []
                for row in cur.fetchall():
                    messages.append({
                        'id': row[0],
                        'content': row[1],
                        'type': row[2],
                        'mediaUrl': row[3],
                        'time': row[4].isoformat(),
                        'userId': row[5],
                        'nickname': row[6],
                        'avatar': row[7]
                    })
                
                messages.reverse()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'messages': messages}),
                    'isBase64Encoded': False
                }
            
            elif action == 'create_group':
                name = body_data.get('name')
                icon = body_data.get('icon')
                creator_id = body_data.get('userId')
                
                cur.execute("""
                    INSERT INTO chats (type, name, icon)
                    VALUES ('group', %s, %s)
                    RETURNING id
                """, (name, icon))
                
                chat = cur.fetchone()
                chat_id = chat[0]
                
                cur.execute("""
                    INSERT INTO chat_members (chat_id, user_id, role)
                    VALUES (%s, %s, 'owner')
                """, (chat_id, creator_id))
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'chatId': chat_id}),
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
