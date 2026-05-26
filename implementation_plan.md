# Django Real-Time Chat App Implementation Plan

We will create a full-featured, visually gorgeous real-time chat application using Django, Django Channels, and standard HTML/CSS/JS. This application will support user authentication, room creation, persistent message logging, and instant message broadcasting via WebSockets.

## User Review Required

> [!IMPORTANT]
> - We will use the built-in SQLite database for simplicity, which is standard for Django development.
> - We will use Django Channels with `InMemoryChannelLayer` for development. This allows WebSockets to work without running an external Redis server. If you plan to scale this to production, you will need to install Redis and configure `channels-redis`.
> - All HTML templates will be styled with high-end premium CSS (gradients, shadows, smooth transitions, responsive layout).

## Open Questions

None at the moment, but feel free to let me know if you would prefer styling choices (e.g. Dark Mode by default, Glassmorphism, etc.). We've designed a sleek, modern, dark-themed UI.

---

## Proposed Changes

### Project Initialization

#### [NEW] [manage.py](file:///d:/AI%20engineer/django/manage.py)
The CLI manager for running server, migrations, shell, and superuser creation.

#### [NEW] [settings.py](file:///d:/AI%20engineer/django/chatproject/settings.py)
Will contain the project settings including `INSTALLED_APPS` (adding `'channels'`, `'daphne'`, `'chat'`, `'accounts'`), `ASGI_APPLICATION`, and `CHANNEL_LAYERS`.

#### [NEW] [urls.py](file:///d:/AI%20engineer/django/chatproject/urls.py)
The root URL configuration mapping to standard views and delegating sub-routes to `chat.urls` and `accounts.urls`.

#### [NEW] [asgi.py](file:///d:/AI%20engineer/django/chatproject/asgi.py)
ASGI setup to support WebSocket protocols alongside standard HTTP.

#### [NEW] [wsgi.py](file:///d:/AI%20engineer/django/chatproject/wsgi.py)
Standard WSGI configuration for production-ready HTTP serving.

---

### Chat Application (chat)

#### [NEW] [models.py](file:///d:/AI%20engineer/django/chat/models.py)
Database schema defining `Room` and `Message` models.

#### [NEW] [views.py](file:///d:/AI%20engineer/django/chat/views.py)
Views to render the chat homepage (list of rooms), individual chat room pages, and room creation.

#### [NEW] [urls.py](file:///d:/AI%20engineer/django/chat/urls.py)
App-specific HTTP routing.

#### [NEW] [forms.py](file:///d:/AI%20engineer/django/chat/forms.py)
Form helper for creating new rooms.

#### [NEW] [admin.py](file:///d:/AI%20engineer/django/chat/admin.py)
Registering `Room` and `Message` with Django Admin.

#### [NEW] [consumers.py](file:///d:/AI%20engineer/django/chat/consumers.py)
The WebSocket consumer handling connections, message receiving/sending, database saves, and group broadcasts.

#### [NEW] [routing.py](file:///d:/AI%20engineer/django/chat/routing.py)
WebSocket URL routing linking the consumer to `/ws/chat/<room_slug>/`.

#### [NEW] [base.html](file:///d:/AI%20engineer/django/chat/templates/chat/base.html)
Base HTML template with beautiful styling, navbar, container layout, and responsive styles.

#### [NEW] [home.html](file:///d:/AI%20engineer/django/chat/templates/chat/home.html)
Homepage displaying existing rooms and containing a quick-access modal or panel to create a room.

#### [NEW] [room.html](file:///d:/AI%20engineer/django/chat/templates/chat/room.html)
The central chat dashboard displaying message streams and an input bar.

#### [NEW] [chat.js](file:///d:/AI%20engineer/django/chat/static/chat/js/chat.js)
Vanilla JS to establish WebSocket connections, handle typing/sending events, sanitize inputs, and auto-scroll content.

#### [NEW] [style.css](file:///d:/AI%20engineer/django/chat/static/chat/css/style.css)
Core stylesheet featuring dark mode, glassmorphism, glowing accents, and smooth hover effects.

---

### Authentication Application (accounts)

#### [NEW] [views.py](file:///d:/AI%20engineer/django/accounts/views.py)
View functions to handle login, register, and logout.

#### [NEW] [urls.py](file:///d:/AI%20engineer/django/accounts/urls.py)
Authentication route endpoints.

#### [NEW] [login.html](file:///d:/AI%20engineer/django/accounts/templates/accounts/login.html)
Visually stunning login form layout.

#### [NEW] [register.html](file:///d:/AI%20engineer/django/accounts/templates/accounts/register.html)
Registration form layout matching the site aesthetics.

---

## Verification Plan

### Manual Verification
1. Run `python manage.py makemigrations` and `python manage.py migrate` to prepare the database.
2. Run `python manage.py createsuperuser` to create an admin.
3. Start the Daphne ASGI dev server via `python manage.py runserver`.
4. Open two separate browser tabs/sessions (e.g. one in Chrome and one in Incognito or Firefox).
5. Register two distinct users (e.g., UserA and UserB).
6. Create a room and join it from both tabs.
7. Send messages and verify that they appear instantly in both tabs without refreshing the browser.
8. Verify that Django Admin (at `/admin`) correctly lists rooms and messages.
