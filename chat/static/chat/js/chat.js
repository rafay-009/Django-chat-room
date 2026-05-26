(function() {
    // Parse parameters passed from Django context
    const roomSlug = JSON.parse(document.getElementById('room-slug').textContent);
    const currentUser = JSON.parse(document.getElementById('user-username').textContent);

    const chatLog = document.getElementById('chat-messages');
    const messageInput = document.getElementById('chat-message-input');
    const messageSubmit = document.getElementById('chat-message-submit');
    const chatEmpty = document.getElementById('chat-empty');

    // Auto-scroll to bottom of chat history on load
    scrollToBottom();

    // Construct WebSocket URL
    const loc = window.location;
    const wsStart = loc.protocol === 'https:' ? 'wss://' : 'ws://';
    const wsUrl = `${wsStart}${loc.host}/ws/chat/${roomSlug}/`;

    console.log(`Connecting to WebSocket: ${wsUrl}`);
    const chatSocket = new WebSocket(wsUrl);

    // Socket lifecycle event: opened
    chatSocket.onopen = function(e) {
        console.log('WebSocket successfully established.');
    };

    // Socket lifecycle event: message received
    chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        const message = data.message;
        const username = data.username;

        // Remove empty state message if it exists
        if (chatEmpty) {
            chatEmpty.remove();
        }

        // Render message
        const messageWrapper = document.createElement('div');
        const isOwn = username === currentUser;
        messageWrapper.className = `message-wrapper ${isOwn ? 'message-own' : 'message-other'}`;

        // Get current timestamp formatted as HH:MM
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

        messageWrapper.innerHTML = `
            <div class="message-bubble">
                <span class="message-sender">${escapeHTML(username)}</span>
                <p class="message-text">${escapeHTML(message)}</p>
                <span class="message-time">${timeString}</span>
            </div>
        `;

        chatLog.appendChild(messageWrapper);
        scrollToBottom();
    };

    // Socket lifecycle event: closed
    chatSocket.onclose = function(e) {
        console.error('Chat socket closed unexpectedly.');
    };

    // Input autofocus focus
    messageInput.focus();

    // Enter key trigger
    messageInput.onkeyup = function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    // Click submit button trigger
    messageSubmit.onclick = function(e) {
        sendMessage();
    };

    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            chatSocket.send(JSON.stringify({
                'message': message
            }));
            messageInput.value = '';
        }
        messageInput.focus();
    }

    function scrollToBottom() {
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    function escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
})();
