const textarea = document.querySelector('textarea');
const sendButton = document.querySelector('.send-button');
const chatMessages = document.querySelector('.chat-messages');
const typingIndicator = document.querySelector('.typing');

// Auto-resize textarea
textarea.addEventListener('input', function() {
  this.style.height = 'auto';
  this.style.height = Math.min(this.scrollHeight, 200) + 'px';
});

// Simulate AI typing
function showTypingIndicator() {
  typingIndicator.classList.remove('hidden');
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
  typingIndicator.classList.add('hidden');
}

// Add new message
function addMessage(content, isUser = true) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user' : 'assistant'}`;
  messageDiv.innerHTML = `<div class="message-content">${content}</div>`;
  
  // Insert before typing indicator
  chatMessages.insertBefore(messageDiv, typingIndicator);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Handle send button click
sendButton.addEventListener('click', () => {
  const message = textarea.value.trim();
  if (message) {
    addMessage(message, true);
    textarea.value = '';
    textarea.style.height = '60px';
    
    // Simulate AI response
    showTypingIndicator();
    setTimeout(() => {
      hideTypingIndicator();
      addMessage('This is a simulated AI response.', false);
    }, 2000);
  }
});

// Handle enter key
textarea.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendButton.click();
  }
});

// Add hover effect to messages
document.querySelectorAll('.message').forEach(message => {
  message.addEventListener('mouseenter', () => {
    message.style.transform = 'translateY(-2px)';
  });
  
  message.addEventListener('mouseleave', () => {
    message.style.transform = 'translateY(0)';
  });
});

// Ensure all messages are visible on load
document.addEventListener('DOMContentLoaded', () => {
  chatMessages.scrollTop = chatMessages.scrollHeight;
});