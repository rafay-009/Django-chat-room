# Walkthrough — Django Real-Time Chat App

We have built a fully featured, visually stunning real-time chat application inside the workspace. The backend uses **Django** paired with **Django Channels** and **Daphne** to manage WebSockets and async processes, while the frontend utilizes premium **Glassmorphism** styling and safe JavaScript WebSocket bindings.

---

## 🛠️ Summary of Changes

We created the following structure:

### 1. Project Configuration
- **[settings.py](file:///d:/AI%20engineer/django/chatproject/settings.py)**: Added `daphne`, `channels`, `chat`, and `accounts` to standard apps. Set up async ASGI application bindings, in-memory channels layers for development, and authentication URL configurations.
- **[urls.py (project)](file:///d:/AI%20engineer/django/chatproject/urls.py)**: Routed general traffic to standard admin paths, auth endpoints, and the lobby homepage.
- **[asgi.py](file:///d:/AI%20engineer/django/chatproject/asgi.py)**: Hooked in standard HTTP parsing together with the Channels protocol router to enable WebSockets under the path pattern `ws/chat/<room_slug>/`.

### 2. Chat Application (`chat`)
- **[models.py](file:///d:/AI%20engineer/django/chat/models.py)**: Created `Room` and `Message` tables mapped using standard foreign keys.
- **[consumers.py](file:///d:/AI%20engineer/django/chat/consumers.py)**: Real-time hub. Manages client join/leave broadcasts and registers incoming chat payload data to the database using async safe wrappers.
- **[routing.py](file:///d:/AI%20engineer/django/chat/routing.py)**: Maps WebSocket patterns directly to the consumer handler.
- **[views.py](file:///d:/AI%20engineer/django/chat/views.py)** & **[forms.py](file:///d:/AI%20engineer/django/chat/forms.py)**: Implemented views to display room listings, validate new room forms (with slug checks), and pull chat room logs.
- **[base.html](file:///d:/AI%20engineer/django/chat/templates/chat/base.html)**: Clean template wrapper containing global CSS imports and responsive navbar layouts.
- **[home.html](file:///d:/AI%20engineer/django/chat/templates/chat/home.html)**: Beautiful, modern layout listing all current chat groups.
- **[room.html](file:///d:/AI%20engineer/django/chat/templates/chat/room.html)**: Interactive messaging workspace. Passes parameters to JavaScript securely via `json_script`.
- **[chat.js](file:///d:/AI%20engineer/django/chat/static/chat/js/chat.js)**: Connects to the WebSocket, updates the DOM with new messages in real-time, escapes incoming HTML elements (XSS prevention), and auto-scrolls to the bottom.
- **[style.css](file:///d:/AI%20engineer/django/chat/static/chat/css/style.css)**: Implements custom glassmorphic styling, neon colors, and glowing gradients.

### 3. Authentication Application (`accounts`)
- **[views.py](file:///d:/AI%20engineer/django/accounts/views.py)**: Controllers for logging in, registering, and secure POST-only logouts.
- **[login.html](file:///d:/AI%20engineer/django/accounts/templates/accounts/login.html)** & **[register.html](file:///d:/AI%20engineer/django/accounts/templates/accounts/register.html)**: Gorgeous styling inputs matching the core dashboard styling.

---

## 🚀 Running and Verifying

To verify and run the project:

### 1. Launch the server
Run the development server command from the root directory:
```bash
.\venv\Scripts\python.exe manage.py runserver
```

### 2. Admin dashboard
Go to [http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin) and log in with:
- **Username**: `admin`
- **Password**: `adminpass123`

You can explore registered tables and inspect or create rooms directly here.

### 3. Real-Time Chat Test
1. Go to the home lobby at [http://127.0.0.1:8000/](http://127.0.0.1:8000/).
2. You will be redirected to log in. Log in as `admin`.
3. Create a room (e.g. "Python Developers").
4. Open a new Incognito browser window or separate browser.
5. Go to [http://127.0.0.1:8000/accounts/register/](http://127.0.0.1:8000/accounts/register/) and create a second account (e.g., `developer1`).
6. Join the "Python Developers" room from both sessions.
7. Send a message from either window — notice it appears **instantly** in the other window without reloading!
