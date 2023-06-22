
// defining all the functionalities of the application
const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeBtn = document.querySelector("#theme-btn");
const deleteBtn = document.querySelector("#delete-btn");




let userText = null;



// ai tokens or keys
const API_KEY = "Use your own API key";


// SCroll height variable
const initialHeight=chatInput.scrollHeight;



// for save the history of all chats on the local storage
const loadDataFromLocalStorage = () => {
    const themecolor = localStorage.getItem("theme-color");
    document.body.classList.toggle("light-mode", themecolor === "light_mode");
    themeBtn.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";


    // Showing Default text when user not enter any text
    const defaultText = `<div class="default-text">
    <h1> This is My final year Project</h1>
    <p> Start a consversation and explore the power of Ai<br> your Chat history will be displayed Here</p>
    </div>`


    chatContainer.innerHTML = localStorage.getItem("History") || defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight);

}

// method call for save the chats in the local storage 
loadDataFromLocalStorage();



// create a chat div for every userText and ai text
const createElement = (html, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add('chat', className);
    chatDiv.innerHTML = html;
    return chatDiv;
}




// chat response from the ai
const getChatResponse = async (incomingChatDiv) => {
    const API_URL = " https://api.openai.com/v1/completions ";
    const pElement = document.createElement("p");
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: userText,
            max_tokens: 2048,
            temperature: 0.2,
            n: 1,
            stop: null
        })
    }
    try {
        const response = await (await fetch(API_URL, requestOptions)).json();
        pElement.textContent = response.choices[0].text.trim();
    } catch (error) {
        pElement.classList.add("error");
        pElement.textContent="Something went wrong";
    }

    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    localStorage.setItem("History", chatContainer.innerHTML);
}



// to copy the content 
const copyResponse = (copyBtn) => {
    const responseTextElement = copyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(responseTextElement.textContent);
    copyBtn.textContent = "done";
    setTimeout(() => copyBtn.textContent = "content_copy", 1000);
}



//Animation content
const showTypingAnimation = () => {
    const html = ` <div class="chat-content">
    <div class="chat-details">
        <img src="image/nue.png" alt="">
        <div class="typing-animation">
            <div class="typing-dot"style="--delay:0.2s"></div>
            <div class="typing-dot"style="--delay:0.3s"></div>
            <div class="typing-dot"style="--delay:0.4s"></div>
        </div>
    </div>
    <span onclick="copyResponse(this)" class="material-symbols-rounded">
        content_copy
    </span>
</div>`;

    const incomingChatDiv = createElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    getChatResponse(incomingChatDiv);
}

// handle the user text  for the openai
const handleOutgoingChat = () => {
    userText = chatInput.value.trim();
    if (!userText) return;

    chatInput.value="";
    chatInput.style.height=`${initialHeight}px`;

    const html = ` <div class="chat-content">
    <div class="chat-details">
        <img src="image/me.png" alt="">
        <p>${userText}</p>
    </div>
</div>`;
    const outgoingChatDiv = createElement(html, "outgoing");
    outgoingChatDiv.querySelector("p").textContent = userText;
    document.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation, 500);
}


// for Change theeme of the screen 
themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    localStorage.setItem("theme-color", themeBtn.innerText);
    themeBtn.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
})



// Delete the all logs from the local storage 
deleteBtn.addEventListener("click", () => {
    if (confirm("want to delete all the log?")) {
        localStorage.removeItem("History");
        loadDataFromLocalStorage();
    }
});






chatInput.addEventListener("input",()=>{
    chatInput.style.height=`${initialHeight}px`;
    chatInput.style.height=`${chatInput.scrollHeight}px`;
})


chatInput.addEventListener("keydown",(e)=>{
    if(e.key === "Enter" &&  !e.shift &&  window.innerWidth>800){

        e.preventDefault();

        handleOutgoingChat();
    }
})


// send the userText to the ai for generating the answer by click event 
sendButton.addEventListener("click", handleOutgoingChat);
