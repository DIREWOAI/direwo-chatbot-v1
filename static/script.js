const textarea = document.querySelector('textarea');
const sendButton = document.querySelector('.send-button');
const chatMessages = document.querySelector('.chat-messages');
const typingIndicator = document.querySelector('.typing');

// Auto-resize textarea
textarea.addEventListener('input', function() {
  this.style.height = 'auto';
  this.style.height = Math.min(this.scrollHeight, 200) + 'px';
});

// Simulate AI typing (show and hide)
function showTypingIndicator() {
  typingIndicator.classList.remove('hidden');
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
  typingIndicator.classList.add('hidden');
}

// Add new message (user or assistant)
function addMessage(content, isUser = true) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user' : 'assistant'}`;
  messageDiv.innerHTML = `<div class="message-content">${content}</div>`;

  // Insert before typing indicator
  chatMessages.insertBefore(messageDiv, typingIndicator);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Handle send button click
sendButton.addEventListener('click', async () => {
  const message = textarea.value.trim();
  if (message) {
    addMessage(message, true); // Add user's message
    textarea.value = '';
    textarea.style.height = '60px';
    
    // Show typing indicator while waiting
    showTypingIndicator();
    
    try {
      const response = await fetch('/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: message })
      });

      const data = await response.json();
      hideTypingIndicator();
      addMessage(data.answer, false); // Add AI's real answer
    } catch (error) {
      hideTypingIndicator();
      addMessage('Error: Could not get response from server.', false);
      console.error('Error:', error);
    }
  }
});

// Handle enter key press (send on Enter)
textarea.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendButton.click();
  }
});

// Add hover effect to messages
document.addEventListener('mouseover', (e) => {
  if (e.target.closest('.message')) {
    e.target.closest('.message').style.transform = 'translateY(-2px)';
  }
});

document.addEventListener('mouseout', (e) => {
  if (e.target.closest('.message')) {
    e.target.closest('.message').style.transform = 'translateY(0)';
  }
});

// Ensure all messages visible on page load
document.addEventListener('DOMContentLoaded', () => {
  chatMessages.scrollTop = chatMessages.scrollHeight;
});
