document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const themeToggle = document.getElementById('theme-toggle');
    const backBtn = document.getElementById('back-btn');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const optionBtns = document.querySelectorAll('.option-btn');
    const optionsContainer = document.getElementById('options-container');
    
    // Ensure the page starts in light mode
    document.body.classList.add('light-mode');
    document.body.classList.remove('dark-mode');
    
    // Theme toggle functionality - fixed implementation
    themeToggle.addEventListener('click', function() {
        // Toggle classes
        const isDarkMode = document.body.classList.toggle('dark-mode');
        document.body.classList.toggle('light-mode');
        
        // Update icon based on current mode
        const icon = themeToggle.querySelector('i');
        if (isDarkMode) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
        
        // Log the theme change for debugging
        console.log('Theme changed. Dark mode:', isDarkMode);
    });
    
    // Back button functionality
    backBtn.addEventListener('click', function() {
        // Show the main options menu
        optionsContainer.style.display = 'block';
        
        // Add a system message indicating return to main menu
        addSystemMessage("You've returned to the main menu. How can I help you?");
    });
    
    // Send message functionality
    sendBtn.addEventListener('click', function() {
        sendMessage();
    });
    
    // Enter key to send message
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Option buttons functionality
    optionBtns.forEach(button => {
        button.addEventListener('click', function() {
            const option = this.dataset.option;
            const optionText = this.textContent;
            
            // Add user message
            addUserMessage(optionText);
            
            // Hide the options container when an option is selected
            optionsContainer.style.display = 'none';
            
            // Clear input field
            userInput.value = '';
            
            // As per requirements, we don't return actual answers
            // Just acknowledge the question was received
            setTimeout(() => {
                addSystemMessage("Thank you for your question. This is a placeholder response as requested.");
            }, 500);
        });
    });
    
    // Function to send user message
    function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            // Add user message
            addUserMessage(message);
            
            // Clear input field
            userInput.value = '';
            
            // As per requirements, we don't return actual answers
            // Just acknowledge the message was received
            setTimeout(() => {
                addSystemMessage("Thank you for your question. This is a placeholder response as requested.");
            }, 500);
        }
    }
    
    // Function to add user message to chat
    function addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'user');
        
        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('avatar');
        const avatarIcon = document.createElement('i');
        avatarIcon.classList.add('fas', 'fa-user');
        avatarDiv.appendChild(avatarIcon);
        
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');
        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        contentDiv.appendChild(paragraph);
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to add system message to chat
    function addSystemMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'system');
        
        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('avatar');
        const avatarIcon = document.createElement('i');
        avatarIcon.classList.add('fas', 'fa-headset');
        avatarDiv.appendChild(avatarIcon);
        
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');
        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        contentDiv.appendChild(paragraph);
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});