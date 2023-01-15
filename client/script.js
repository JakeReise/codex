import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

/*const botChatStripe = document.querySelector('.bot-chat-stripe');
let botResponse = '';

// Expand the bot chat stripe to accommodate the text on screen as it nears the current bot stripe size
function expandBotChatStripe() {
  let currentHeight = botChatStripe.offsetHeight;
  let newHeight = currentHeight + (botResponse.length * 10); // Increase the height by 10px for each character in the response

  if (newHeight > currentHeight) {
      botChatStripe.style.height = newHeight + 'px';
  }
}

// Clear any loading intervals and type out the bot's response in that element 
function typeBotResponse(response) {
  clearInterval(loadingInterval); // Clear any loading intervals 

  let i = 0; 
  let typingInterval = setInterval(function() { 
      if (i < response.length) { 
          botResponse += response.charAt(i); 
          document.querySelector('#bot-response').innerHTML = botResponse; 

          expandBotChatStripe(); // Expand the chat stripe as needed

          i++; 
      } else { 
          clearInterval(typingInterval); 
      } 
  }, 50);   // Type out one character every 50ms  
}
*/
function loader(element) {
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent += '.';

    if (element.textContent === '....') {
      element.textContent = '';
    }
  }, 300)
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if(index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20)
}

function generateUniqueID() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe (isAi, value, uniqueId) {
  return (
    `
      <div class="wrapper ${isAi && 'ai'}">
        <div class="chat">
          <div class="profile">
            <img
              src="${isAi ? bot : user}"
              alt="${isAi ? 'bot' : 'user'}"
            />
          </div>
          <div class="message" id=${uniqueId}>${value}</div>
        </div>
      </div>
    `
  )
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  //user's chatStripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset();

  //bot's chatStripe
  const uniqueId = generateUniqueID();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  // fetch data from server -> bot's response

  const response = await fetch('http://localhost:5000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })

    clearInterval(loadInterval);
    messageDiv.innerHTML = '';

    if(response.ok) {
      const data = await response.json();
      const parsedData = data.bot.trim();

      typeText(messageDiv, parsedData);
    } else {
      const err = await response.text();

      messageDiv.innerHTML = "Something went wrong";

      alert(err);
    }
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.shiftKey && e.keyCode === 13) {
    e.preventDefault();
    var input = this;
    var start = input.selectionStart;
    var end = input.selectionEnd;
    input.value = input.value.substring(0, start) + "\n" + input.value.substring(end);
    input.selectionStart = input.selectionEnd = start + 1;
    var currentLine = $(this).getCursorPosition().start;
    $(this).setCursorPosition(currentLine + 1); 
  } else if (e.keyCode === 13) {
    handleSubmit(e);
} 
});