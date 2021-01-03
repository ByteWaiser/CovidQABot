
async function postData(url, data) { 
    const response = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const j = await response.json();
    const d = await j.text;
    return d;
}



(function() {

    const submit = document.querySelector(".chat-submit");
    const chatBox = document.querySelector(".chat-box");
    const chatInput = document.querySelector(".chat-input");
    const m_type = document.querySelectorAll(".model-type");
  
    // const aiThinking = false;
  
    function chatTemplate(aiOrPerson) {
        return (
          `
            <div class="ai-person-container">
              <div class="${aiOrPerson.class}">
                <p>${aiOrPerson.text}</p>
              </div>
              <span class="${aiOrPerson.class}-date">${aiOrPerson.date}</span>
            </div>
          `
        );
    }

    submit.addEventListener("click", function() {
        appendChatBox(true)
    });
  
    document.addEventListener("keypress", function(e) {
        if (e.keyCode == "13") {
        appendChatBox(true)
        }
    });
  
    async function appendChatBox(fromPerson) {
        const date = new Date()
        if (!fromPerson){
          date.setSeconds(date.getSeconds() + 2)
        }
        if (fromPerson && !chatInput.value.trim()) {
          return;
        }
    
        let data = {
            "question": chatInput.value.trim(),
            "question_type": m_type[0].checked ? m_type[0].value : m_type[1].value
        }

        data.question = data.question[data.question.length-1] != "?" ? data.question + "?":data.question;
         
        const timestamp = date.toLocaleTimeString()
        const newChatDiv = chatTemplate({
          class: fromPerson ? "person" : "ai",
            text: fromPerson ? chatInput.value.trim() : await postData("https://covid-qa-chatbot.herokuapp.com/", data),
          date: timestamp
        });
        if (!fromPerson) {
          // make it so it only responds once to multiple fast sentences
          setTimeout(function() {
            chatBox.innerHTML += newChatDiv;
            chatBox.scrollTop = chatBox.scrollHeight;
          }, 2000)
        } else {
          chatBox.innerHTML += newChatDiv;
          chatBox.scrollTop = chatBox.scrollHeight;
        }
        if (fromPerson) {
          appendChatBox(false);
          chatInput.value = "";
        }
    }

}())



