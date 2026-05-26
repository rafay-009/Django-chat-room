# 📚 Django Complete Guide + Real-Time Chat App

---

## Table of Contents

1. [What is Django?](#what-is-django)
2. [Django vs Other Frameworks](#django-vs-other-frameworks)
3. [The MTV Architecture](#the-mtv-architecture)
4. [Django Core Concepts](#django-core-concepts)
5. [Project File Structure Explained](#project-file-structure-explained)
6. [Real-Time Chat App — Every File Explained](#real-time-chat-app--every-file-explained)
7. [How a Request Flows Through Django](#how-a-request-flows-through-django)
8. [WebSockets & Django Channels](#websockets--django-channels)

---

## What is Django?

Django is a **high-level Python web framework** that encourages rapid development and clean, pragmatic design. It was created in 2003 by Adrian Holovaty and Simon Willison at a newspaper company — which is why it's so good at content-heavy, database-driven sites.

> **"Django — The web framework for perfectionists with deadlines."**

### Why Django?
| Feature | What it means for you |
|---|---|
| **Batteries included** | Admin panel, auth, ORM, forms — all built-in |
| **DRY principle** | Don't Repeat Yourself — write code once |
| **Secure by default** | CSRF, XSS, SQL injection protection built-in |
| **Scalable** | Used by Instagram, Pinterest, Disqus at massive scale |
| **ORM** | Talk to databases in Python, not SQL |
| **Admin** | Auto-generated admin dashboard with zero code |

---

## Django vs Other Frameworks

```
Django (Python)     →  Full-featured, "batteries included"
Flask (Python)      →  Micro-framework, you add pieces yourself
FastAPI (Python)    →  Async-first, API-focused
Express (Node.js)   →  Minimalist, JavaScript
Laravel (PHP)       →  PHP equivalent of Django
Rails (Ruby)        →  Ruby equivalent of Django
```

Django is best when you need:
- A database-driven web application
- A built-in admin panel
- User authentication
- A structured, maintainable codebase

---

## The MTV Architecture

Django follows **MTV** — Model, Template, View. (Similar to MVC but with Django's naming.)

```
Browser Request
      ↓
   URL Router (urls.py)
      ↓
   View (views.py)  ←→  Model (models.py) ←→ Database
      ↓
   Template (.html)
      ↓
Browser Response
```

### Model (M)
- Defines your **data structure**
- Each Model class = one database table
- Django's ORM translates Python → SQL automatically

```python
# Example Model
class Message(models.Model):
    content = models.TextField()
    sender  = models.ForeignKey(User, on_delete=models.CASCADE)
    sent_at = models.DateTimeField(auto_now_add=True)
```

### Template (T)
- The **HTML layer** — what the user sees
- Uses Django Template Language (DTL) for dynamic content
- `{{ variable }}` → outputs a value
- `{% tag %}` → logic like loops and conditions

```html
<!-- Example Template -->
{% for message in messages %}
  <div class="message">{{ message.content }}</div>
{% endfor %}
```

### View (V)
- The **brain** — receives a request, fetches data, returns a response
- Can be a function (FBV) or a class (CBV)

```python
# Function-Based View
def chat_room(request, room_name):
    messages = Message.objects.filter(room__name=room_name)
    return render(request, 'chat/room.html', {'messages': messages})
```

---

## Django Core Concepts

### 1. Projects vs Apps

```
Project = the whole website
App     = one feature/module of the website
```

A Django **project** can contain many **apps**:
```
chatproject/          ← Project
├── accounts/         ← App (handles login/register)
├── chat/             ← App (handles chat rooms)
└── core/             ← App (homepage, about)
```

Each app is **self-contained** — it has its own models, views, URLs, and templates. This makes apps **reusable** across projects.

---

### 2. The ORM (Object-Relational Mapper)

Instead of writing SQL, you write Python:

```python
# SQL:    SELECT * FROM chat_message WHERE room_id=1 ORDER BY sent_at
# Django: 
Message.objects.filter(room_id=1).order_by('sent_at')

# SQL:    INSERT INTO chat_message (content, sender_id) VALUES ('Hello', 1)
# Django:
Message.objects.create(content='Hello', sender=user)
```

The ORM supports all databases: SQLite, PostgreSQL, MySQL, Oracle.

---

### 3. URL Routing

Django maps URLs to views using `urls.py`:

```python
urlpatterns = [
    path('',           views.home,      name='home'),
    path('chat/<str:room_name>/', views.room, name='room'),
    path('admin/',     admin.site.urls),
]
```

- `path()` — exact URL match
- `<str:room_name>` — URL parameter captured and passed to view
- `name=` — lets you reverse-reference URLs in templates with `{% url 'room' room_name %}`

---

### 4. Settings (settings.py)

The central configuration file. Key sections:

```python
SECRET_KEY      # Cryptographic key — keep secret!
DEBUG           # True in dev, False in production
INSTALLED_APPS  # All apps Django knows about
DATABASES       # Database connection settings
STATIC_URL      # URL prefix for CSS/JS/images
TEMPLATES       # Template engine configuration
MIDDLEWARE      # Request/response processing pipeline
```

---

### 5. Migrations

Migrations are Django's way of syncing your Python models with the database schema.

```
You change models.py
        ↓
python manage.py makemigrations  ← Creates migration file
        ↓
python manage.py migrate         ← Applies changes to DB
```

Migration files live in `app/migrations/` and track your entire schema history.

---

### 6. Admin Panel

Zero configuration needed. Register your model:

```python
# admin.py
from django.contrib import admin
from .models import Message, Room

admin.site.register(Room)
admin.site.register(Message)
```

Visit `http://localhost:8000/admin` → full CRUD interface for all your data.

---

### 7. Middleware

Middleware is code that runs on **every request and response** — like a chain of filters:

```
Request → SecurityMiddleware → SessionMiddleware → AuthMiddleware → View
Response ← SecurityMiddleware ← SessionMiddleware ← AuthMiddleware ← View
```

Built-in middleware handles: CSRF protection, session management, authentication, security headers.

---

### 8. Static Files

CSS, JavaScript, images are "static files":

```
app/
└── static/
    └── app/
        ├── css/style.css
        ├── js/chat.js
        └── images/logo.png
```

In templates: `{% load static %}` then `{% static 'app/css/style.css' %}`

---

## Project File Structure Explained

Here is the **complete file structure** of our real-time chat app:

```
chatproject/                    ← Root project folder
│
├── manage.py                   ← Django's command-line utility
├── requirements.txt            ← Python package dependencies
├── .env                        ← Environment variables (secrets)
│
├── chatproject/                ← Project configuration package
│   ├── __init__.py             ← Makes this a Python package
│   ├── settings.py             ← ALL project settings
│   ├── urls.py                 ← Root URL configuration
│   ├── asgi.py                 ← ASGI entry point (for WebSockets)
│   └── wsgi.py                 ← WSGI entry point (for HTTP)
│
├── chat/                       ← The chat application
│   ├── __init__.py             ← Makes this a Python package
│   ├── admin.py                ← Admin panel configuration
│   ├── apps.py                 ← App configuration class
│   ├── consumers.py            ← WebSocket consumer (real-time logic)
│   ├── models.py               ← Database models (Room, Message)
│   ├── routing.py              ← WebSocket URL routing
│   ├── urls.py                 ← HTTP URL routing for this app
│   ├── views.py                ← HTTP request handlers
│   ├── forms.py                ← Django forms
│   ├── tests.py                ← Unit tests
│   │
│   ├── migrations/             ← Database migration files
│   │   ├── __init__.py
│   │   └── 0001_initial.py     ← First migration (creates tables)
│   │
│   ├── templates/              ← HTML templates for this app
│   │   └── chat/
│   │       ├── base.html       ← Base template all others extend
│   │       ├── home.html       ← Chat room list page
│   │       ├── room.html       ← Chat room page (main UI)
│   │       └── login.html      ← Login page
│   │
│   └── static/                 ← Static files for this app
│       └── chat/
│           ├── css/
│           │   └── style.css   ← All styling
│           └── js/
│               └── chat.js     ← WebSocket client JavaScript
│
└── accounts/                   ← Authentication application
    ├── __init__.py
    ├── admin.py
    ├── apps.py
    ├── models.py               ← Custom user model (optional)
    ├── views.py                ← Login, register, logout views
    ├── urls.py                 ← Auth URL routes
    ├── forms.py                ← Login and registration forms
    └── templates/
        └── accounts/
            ├── login.html
            └── register.html
```

---

## Real-Time Chat App — Every File Explained

---

### `manage.py`

```python
#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chatproject.settings')
    from django.core.management import execute_from_command_line
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
```

**What it does:** The gateway to all Django commands:
- `python manage.py runserver` — starts the dev server
- `python manage.py makemigrations` — creates migration files
- `python manage.py migrate` — applies migrations to DB
- `python manage.py createsuperuser` — creates an admin user
- `python manage.py shell` — opens a Python shell with Django loaded

---

### `chatproject/settings.py`

The **brain** of your project. Every behaviour is controlled here.

```python
# Key sections explained:

SECRET_KEY = 'your-secret-key'   # Used for cryptographic signing

DEBUG = True                      # Shows error pages in development
                                  # ALWAYS False in production!

ALLOWED_HOSTS = ['localhost', '127.0.0.1']  # Which domains can serve this

INSTALLED_APPS = [
    'django.contrib.admin',       # Admin panel
    'django.contrib.auth',        # Authentication system
    'django.contrib.contenttypes',# Content type framework
    'django.contrib.sessions',    # Session management
    'django.contrib.messages',    # Flash messages
    'django.contrib.staticfiles', # Static file serving
    
    'channels',                   # Django Channels (WebSockets)
    'chat',                       # Our chat app
    'accounts',                   # Our accounts app
]

# Django Channels — use in-memory channel layer for dev
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
    }
}

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',   # SQLite file location
    }
}

ASGI_APPLICATION = 'chatproject.asgi.application'  # Entry point for async
```

---

### `chatproject/urls.py`

The **root URL dispatcher**. All URLs start here.

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),         # Built-in admin
    path('', include('chat.urls')),          # Delegate to chat app
    path('accounts/', include('accounts.urls')), # Delegate to accounts
]
```

**How it works:** Django reads the URL top-to-bottom. When a URL matches a `path()`, it either calls a view directly or `include()`s another urls.py for further matching.

---

### `chatproject/asgi.py`

The **ASGI entry point** — critical for WebSockets.

```python
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import chat.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chatproject.settings')

application = ProtocolTypeRouter({
    # HTTP requests → standard Django
    'http': get_asgi_application(),
    
    # WebSocket requests → Django Channels
    'ws': AuthMiddlewareStack(
        URLRouter(
            chat.routing.websocket_urlpatterns
        )
    ),
})
```

**What it does:** WSGI (traditional Django) only handles HTTP. ASGI handles both HTTP *and* WebSockets. The `ProtocolTypeRouter` inspects each incoming connection and routes it to the right handler based on protocol type.

---

### `chatproject/wsgi.py`

Traditional HTTP entry point (used for non-WebSocket HTTP in production with gunicorn):

```python
import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chatproject.settings')
application = get_wsgi_application()
```

---

### `chat/models.py`

Defines the **database structure**. Two models: `Room` and `Message`.

```python
from django.db import models
from django.contrib.auth.models import User

class Room(models.Model):
    """A chat room that users can join"""
    name        = models.CharField(max_length=100, unique=True)
    slug        = models.SlugField(unique=True)          # URL-safe name
    description = models.TextField(blank=True)
    created_by  = models.ForeignKey(User, on_delete=models.CASCADE, 
                                    related_name='created_rooms')
    created_at  = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name   # Shows room name in admin


class Message(models.Model):
    """A single chat message"""
    room      = models.ForeignKey(Room, on_delete=models.CASCADE, 
                                  related_name='messages')
    sender    = models.ForeignKey(User, on_delete=models.CASCADE)
    content   = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['timestamp']   # Always ordered by time
    
    def __str__(self):
        return f'{self.sender.username}: {self.content[:50]}'
```

**Field types explained:**
| Field | Use Case |
|---|---|
| `CharField` | Short text (name, title) — requires `max_length` |
| `TextField` | Long text (message content, description) |
| `SlugField` | URL-safe text like `general-chat` |
| `DateTimeField` | Date + time. `auto_now_add=True` = set once on create |
| `ForeignKey` | Link to another model (many-to-one relationship) |
| `on_delete=CASCADE` | Delete messages when room is deleted |

---

### `chat/admin.py`

Registers models with Django's admin panel:

```python
from django.contrib import admin
from .models import Room, Message

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display  = ['name', 'created_by', 'created_at']
    prepopulated_fields = {'slug': ('name',)}  # Auto-fill slug from name
    search_fields = ['name', 'description']

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display  = ['sender', 'room', 'content', 'timestamp']
    list_filter   = ['room', 'timestamp']
    search_fields = ['content', 'sender__username']
```

---

### `chat/views.py`

The **HTTP request handlers** — these serve pages.

```python
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from .models import Room, Message
from .forms import RoomForm

def home(request):
    """List all available chat rooms"""
    rooms = Room.objects.all().order_by('-created_at')
    return render(request, 'chat/home.html', {'rooms': rooms})

@login_required                  # Redirect to login if not authenticated
def room(request, slug):
    """Show a specific chat room with message history"""
    room = get_object_or_404(Room, slug=slug)   # 404 if room not found
    messages = room.messages.all()[:50]          # Last 50 messages
    return render(request, 'chat/room.html', {
        'room': room,
        'messages': messages,
    })

@login_required
def create_room(request):
    """Handle room creation form"""
    if request.method == 'POST':
        form = RoomForm(request.POST)
        if form.is_valid():
            room = form.save(commit=False)   # Don't save yet
            room.created_by = request.user   # Set the creator
            room.save()
            return redirect('room', slug=room.slug)
    else:
        form = RoomForm()
    return render(request, 'chat/create_room.html', {'form': form})
```

**Decorators:**
- `@login_required` — redirects unauthenticated users to login page
- `get_object_or_404()` — returns 404 HTTP error if object doesn't exist (better than crashing)

---

### `chat/urls.py`

URL routing **specific to the chat app**:

```python
from django.urls import path
from . import views

app_name = 'chat'   # Namespace — use as {% url 'chat:home' %}

urlpatterns = [
    path('',                  views.home,        name='home'),
    path('create/',           views.create_room, name='create_room'),
    path('room/<slug:slug>/', views.room,         name='room'),
]
```

`app_name = 'chat'` creates a **namespace** so you can use `{% url 'chat:room' slug=room.slug %}` in templates without URL name conflicts.

---

### `chat/forms.py`

Django forms handle **validation and HTML rendering**:

```python
from django import forms
from .models import Room
from django.utils.text import slugify

class RoomForm(forms.ModelForm):
    class Meta:
        model  = Room
        fields = ['name', 'description']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-input', 
                'placeholder': 'Room name...'
            }),
            'description': forms.Textarea(attrs={
                'class': 'form-textarea',
                'rows': 3,
            }),
        }
    
    def save(self, commit=True):
        room = super().save(commit=False)
        room.slug = slugify(room.name)   # Auto-generate slug
        if commit:
            room.save()
        return room
```

**Why forms?** Django forms give you:
1. Automatic HTML widget rendering
2. Server-side validation
3. CSRF protection
4. Error message display

---

### `chat/consumers.py` ⭐ (The Real-Time Heart)

This is the **most important file** for real-time chat. A Consumer is like a Django view, but for WebSocket connections.

```python
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Message, Room
from django.contrib.auth.models import User

class ChatConsumer(AsyncWebsocketConsumer):
    """
    Handles WebSocket connections for a single chat room.
    
    Lifecycle:
    1. connect()    → Client opens WebSocket
    2. receive()    → Client sends a message
    3. disconnect() → Client closes WebSocket
    """
    
    async def connect(self):
        """Called when a WebSocket connection is opened"""
        self.room_slug = self.scope['url_route']['kwargs']['room_slug']
        self.room_group_name = f'chat_{self.room_slug}'
        
        # Join the channel group for this room
        # All users in same room share same group_name
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name   # This specific connection's unique ID
        )
        
        await self.accept()   # Accept the WebSocket connection
    
    async def disconnect(self, close_code):
        """Called when WebSocket closes"""
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        """Called when client sends a message"""
        data = json.loads(text_data)
        message_content = data['message']
        username = self.scope['user'].username
        
        # Save message to database (async-safe)
        await self.save_message(self.scope['user'], 
                                self.room_slug, 
                                message_content)
        
        # Broadcast to EVERYONE in the room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',     # Maps to chat_message() method
                'message': message_content,
                'username': username,
            }
        )
    
    async def chat_message(self, event):
        """Called by group_send — sends message to THIS client's WebSocket"""
        await self.send(text_data=json.dumps({
            'message':  event['message'],
            'username': event['username'],
        }))
    
    @database_sync_to_async
    def save_message(self, user, room_slug, content):
        """Save message to DB — must be sync because ORM is synchronous"""
        room = Room.objects.get(slug=room_slug)
        Message.objects.create(room=room, sender=user, content=content)
```

**WebSocket message flow:**
```
User A types "Hello"
      ↓
Browser sends JSON over WebSocket to Consumer.receive()
      ↓
Consumer saves to database
      ↓
Consumer calls channel_layer.group_send() → broadcasts to room group
      ↓
chat_message() is called for EVERY connected user in the room
      ↓
Each user's browser receives the JSON instantly
      ↓
JavaScript appends the message to the chat UI
```

---

### `chat/routing.py`

WebSocket URL routing — like `urls.py` but for WebSockets:

```python
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<room_slug>[\w-]+)/$', consumers.ChatConsumer.as_asgi()),
]
```

`ws/chat/general/` → connects to `ChatConsumer` with `room_slug='general'`

---

### `chat/apps.py`

App configuration class — Django discovers apps through this:

```python
from django.apps import AppConfig

class ChatConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'chat'
    verbose_name = 'Chat Application'   # Human-readable name in admin
    
    def ready(self):
        # Import signals when app loads (if using signals)
        pass
```

`default_auto_field = 'BigAutoField'` means all models get a `BIGINT` primary key (id field) automatically.

---

### `chat/migrations/0001_initial.py`

Auto-generated migration — **never edit manually**:

```python
# This file was auto-generated by: python manage.py makemigrations

from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):
    initial = True           # This is the first migration
    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),  # Depends on User model
    ]
    
    operations = [
        # Creates the chat_room table
        migrations.CreateModel(
            name='Room',
            fields=[
                ('id', models.BigAutoField(primary_key=True)),
                ('name', models.CharField(max_length=100, unique=True)),
                ('slug', models.SlugField(unique=True)),
                ...
            ],
        ),
        # Creates the chat_message table
        migrations.CreateModel(
            name='Message',
            fields=[...]
        ),
    ]
```

---

### `chat/templates/chat/base.html`

The **master template** all pages extend:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}ChatApp{% endblock %}</title>
    {% load static %}
    <link rel="stylesheet" href="{% static 'chat/css/style.css' %}">
</head>
<body>
    <nav class="navbar">
        <a href="{% url 'chat:home' %}">💬 ChatApp</a>
        {% if user.is_authenticated %}
            <span>Hello, {{ user.username }}!</span>
            <a href="{% url 'accounts:logout' %}">Logout</a>
        {% else %}
            <a href="{% url 'accounts:login' %}">Login</a>
        {% endif %}
    </nav>
    
    {% if messages %}  <!-- Django flash messages, NOT chat messages -->
        {% for msg in messages %}
            <div class="alert alert-{{ msg.tags }}">{{ msg }}</div>
        {% endfor %}
    {% endif %}
    
    <main>
        {% block content %}{% endblock %}  <!-- Child templates fill this -->
    </main>
    
    {% block scripts %}{% endblock %}  <!-- Page-specific JS goes here -->
</body>
</html>
```

**Template Inheritance:**
- `base.html` defines the skeleton with `{% block %}` holes
- Child templates `{% extends 'chat/base.html' %}` and fill the holes
- This avoids repeating the navbar/footer on every page

---

### `chat/templates/chat/room.html`

The chat room UI:

```html
{% extends 'chat/base.html' %}
{% load static %}

{% block title %}{{ room.name }} — ChatApp{% endblock %}

{% block content %}
<div class="chat-container">
    <div class="chat-header">
        <h1>{{ room.name }}</h1>
        <p>{{ room.description }}</p>
    </div>
    
    <!-- Message history loaded from DB -->
    <div class="messages" id="chat-messages">
        {% for message in messages %}
        <div class="message {% if message.sender == request.user %}own{% endif %}">
            <span class="username">{{ message.sender.username }}</span>
            <p class="content">{{ message.content }}</p>
            <span class="time">{{ message.timestamp|date:"H:i" }}</span>
        </div>
        {% endfor %}
    </div>
    
    <!-- Message input -->
    <div class="chat-input">
        <input type="text" id="message-input" placeholder="Type a message..." />
        <button id="send-btn">Send</button>
    </div>
</div>
{% endblock %}

{% block scripts %}
<!-- Pass Django values to JavaScript safely -->
<script>
    const roomSlug = "{{ room.slug }}";
    const currentUser = "{{ request.user.username }}";
</script>
<script src="{% static 'chat/js/chat.js' %}"></script>
{% endblock %}
```

---

### `chat/static/chat/js/chat.js`

The **client-side WebSocket code** — connects to the server and updates the UI:

```javascript
// Build the WebSocket URL
// ws:// for dev, wss:// for production (secure)
const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
const socket = new WebSocket(`${wsProtocol}://${window.location.host}/ws/chat/${roomSlug}/`);

// ─── Connection opened ───────────────────────────────────────
socket.onopen = function(e) {
    console.log('✅ WebSocket connected');
};

// ─── Message received from server ────────────────────────────
socket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    appendMessage(data.username, data.message);
};

// ─── Connection closed ────────────────────────────────────────
socket.onclose = function(e) {
    console.log('❌ WebSocket disconnected');
};

// ─── Send message ─────────────────────────────────────────────
document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('message-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    if (!message) return;
    
    // Send JSON to Django Channels consumer
    socket.send(JSON.stringify({ 'message': message }));
    input.value = '';  // Clear input
}

// ─── Render message in UI ─────────────────────────────────────
function appendMessage(username, message) {
    const messagesDiv = document.getElementById('chat-messages');
    const isOwn = username === currentUser;
    
    const div = document.createElement('div');
    div.className = `message ${isOwn ? 'own' : ''}`;
    div.innerHTML = `
        <span class="username">${username}</span>
        <p class="content">${escapeHtml(message)}</p>
    `;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;  // Auto-scroll
}

// Security: prevent XSS by escaping HTML characters
function escapeHtml(text) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}
```

---

### `accounts/views.py`

Authentication views:

```python
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib import messages

def register_view(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)   # Auto-login after registration
            messages.success(request, 'Account created successfully!')
            return redirect('chat:home')
    else:
        form = UserCreationForm()
    return render(request, 'accounts/register.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect(request.GET.get('next', 'chat:home'))
    else:
        form = AuthenticationForm()
    return render(request, 'accounts/login.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect('accounts:login')
```

---

## How a Request Flows Through Django

### Scenario: User visits `http://localhost:8000/room/general/`

```
1. Browser sends HTTP GET /room/general/
         ↓
2. Django ASGI/WSGI receives request
         ↓
3. Middleware runs (SecurityMiddleware, SessionMiddleware, AuthMiddleware...)
         - Session middleware loads user from session cookie
         - Auth middleware attaches user to request
         ↓
4. chatproject/urls.py matches 'room/' → includes chat.urls
         ↓
5. chat/urls.py matches 'room/<slug:slug>/' → calls views.room()
         ↓
6. views.room() runs:
         - @login_required checks user.is_authenticated
         - Queries Room.objects.get(slug='general')
         - Queries Message.objects.filter(room=room)[:50]
         ↓
7. render() is called with template 'chat/room.html' + context data
         ↓
8. Django Template Engine:
         - Loads room.html
         - Finds {% extends 'chat/base.html' %} → loads base
         - Fills {% block content %} with room.html content
         - Renders {{ room.name }}, {% for message in messages %}
         - {% static %} resolves to /static/chat/css/style.css
         ↓
9. HTML response sent to browser (200 OK)
         ↓
10. Browser loads HTML, then fetches CSS/JS static files
          ↓
11. chat.js runs → opens WebSocket ws://localhost:8000/ws/chat/general/
          ↓
12. asgi.py routes WebSocket to ChatConsumer.connect()
          ↓
13. Consumer joins group 'chat_general'
          → Now this user gets all messages broadcast to that group
```

---

## WebSockets & Django Channels

### HTTP vs WebSocket

```
HTTP (traditional):
  Client  ──────── Request ────────→  Server
  Client  ←──────── Response ──────  Server
  (connection closes — one-way at a time)

WebSocket (real-time):
  Client  ←────── Persistent tunnel ──────→  Server
  Client  ←─────────── Push ───────────────  Server
  Client  ──────────── Send ───────────────→ Server
  (connection stays open — bidirectional)
```

### Channel Layer

The **Channel Layer** is how multiple consumer instances (different users) communicate with each other:

```
User A's Consumer                    User B's Consumer
      │                                     │
      │    channel_layer.group_send()       │
      │ ──────────────────────────────────→ │
      │        (via Redis or memory)        │
      │                                     │
      │                              chat_message()
      │                                     ↓
      │                            socket.send() to B's browser
```

- **InMemoryChannelLayer** — only works on one server, use for development
- **RedisChannelLayer** — works across multiple servers, use for production

### Why `async`?

WebSocket consumers use `async/await` because they need to handle **thousands of simultaneous connections** efficiently. Async code doesn't block the thread while waiting — it handles other connections while one is waiting for a database query.

```python
# Sync (blocks thread — bad for WebSockets)
def receive(self, text_data):
    time.sleep(1)  # Thread is FROZEN during this
    
# Async (non-blocking — good for WebSockets)  
async def receive(self, text_data):
    await asyncio.sleep(1)  # Other connections handled during this
```

---

## Key Commands Reference

```bash
# Setup
python manage.py startproject chatproject .     # Create project in current dir
python manage.py startapp chat                  # Create a new app
python manage.py startapp accounts

# Database
python manage.py makemigrations                 # Generate migration files
python manage.py migrate                        # Apply migrations
python manage.py showmigrations                 # List all migrations

# Admin
python manage.py createsuperuser               # Create admin user

# Development Server
python manage.py runserver                     # Start on http://localhost:8000
python manage.py runserver 0.0.0.0:8000        # Allow external connections

# Shell
python manage.py shell                         # Interactive Python shell

# Static Files (production)
python manage.py collectstatic                 # Gather all static files
```

---

## Summary: What Each File Does

| File | Purpose |
|---|---|
| `manage.py` | CLI entry point for all Django commands |
| `settings.py` | Project-wide configuration |
| `urls.py` (project) | Root URL dispatcher |
| `asgi.py` | Async entry point for HTTP + WebSockets |
| `wsgi.py` | Sync HTTP entry point |
| `models.py` | Database schema in Python |
| `views.py` | Business logic + HTTP response handlers |
| `urls.py` (app) | App-level URL routing |
| `forms.py` | Form definitions and validation |
| `admin.py` | Admin panel configuration |
| `apps.py` | App metadata and configuration |
| `consumers.py` | WebSocket event handlers |
| `routing.py` | WebSocket URL routing |
| `templates/` | HTML files with DTL syntax |
| `static/` | CSS, JavaScript, images |
| `migrations/` | Database change history |
| `tests.py` | Unit and integration tests |
