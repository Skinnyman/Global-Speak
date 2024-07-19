const exchangeIcon = document.querySelector(".exchange");
const exchangeIcon_File = document.querySelector(".exchange-file");
const type_text = document.querySelector(".enter-text");
const translate_text = document.querySelector(".translate-text");
const CopyBtn = document.querySelector(".copy-me");
const CopyBtn2 = document.querySelector(".copy-me2");
const VolumeBtn = document.querySelector(".volume");
const VolumeBtn2 = document.querySelector(".volume2");
const TranslateBtn = document.querySelector(".transbtn");
const left_Select = document.getElementById("Text-select");
const right_Select = document.getElementById("translate-select");
const Right_file_Select = document.getElementById("Filetranslate-select");
const left_file_Select = document.getElementById("File-select");
const translate_FileBtn = document.querySelector(".Translate-file");
const File_Input = document.getElementById("file");
const Downloadlink = document.getElementById("downloadLink");
const transbribe = document.getElementById('transcribeButton')

const API_URL = 'http://127.0.0.1:5000/translate'

// This eventlistener helps to navigate from Translate Text to Translate Files
document.addEventListener('click', function() {
    const textBtn = document.getElementById("text-translate");
    const fileBtn = document.getElementById("file-translate");
    const  Transtext= document.getElementById("text-trans");
    const Transfile = document.getElementById("file-trans");

    textBtn.addEventListener('click', ()=>{
        Transtext.classList.add('active');
        Transfile.classList.remove('active');
        textBtn.classList.add('trans-high');
        fileBtn.classList.remove('trans-high');


    })
    fileBtn.addEventListener('click', ()=>{
        Transtext.classList.remove('active');
        Transfile.classList.add('active');
        fileBtn.classList.add('trans-high');
        textBtn.classList.remove("trans-high");

    })

  });


// The exhange Icon swaps the language selected
exchangeIcon.addEventListener("click", () => {
    // Store the current values of the type_text input and the first select element
    const tempText = type_text.value,
        tempLang = left_Select.value;

    // Swap the values of the fromText and toText inputs
    type_text.value = translate_text.value;
    translate_text.value = tempText;

    // Swap the values of the first and second select elements
    left_Select.value = right_Select.value;
    right_Select.value = tempLang;
});


// For the file translate
exchangeIcon_File.addEventListener("click", () => {
    // Store the current values of the type_text input and the first select element
        tempLang = left_file_Select.value;

    // Swap the values of the first and second select elements
    left_file_Select.value = Right_file_Select.value;
    Right_file_Select.value = tempLang;
});


// This CopyBtn1 is used to copy text
CopyBtn.addEventListener("click",() => {
    if(!type_text.value) return;
    navigator.clipboard.writeText(type_text.value);
    alert("Text copied to clipboard!")
})

// This CopyBtn2 is used to copy text
CopyBtn2.addEventListener("click",() => {
    if(!translate_text.value) return;
    navigator.clipboard.writeText(translate_text.value);
    alert("Text copied to clipboard!")
})

// This VolumeBtn is used for text-to-speech
VolumeBtn.addEventListener("click", ()=>{
    const speech = new SpeechSynthesisUtterance();
    speech.text = type_text.value;
    speech.lang = left_Select.value;
    window.speechSynthesis.speak(speech);
})
VolumeBtn2.addEventListener("click", ()=>{
    const speech = new SpeechSynthesisUtterance();
    speech.text = translate_text.value;
    speech.lang = right_Select.value;
    window.speechSynthesis.speak(speech);
})


// Translating text
TranslateBtn.addEventListener('click' ,() => {
      function texttranslation(){

        fetch(API_URL,{
            method: "POST",
            body: JSON.stringify({
            q: type_text.value,
            source: left_Select.value,
            target: right_Select.value,
            format: "text",
            api_key: ""
        }),
        headers: { "Content-Type": "application/json" }
        })
        .then(data => data.json())
        .then (item => {
            console.log(item)
            translate_text.textContent = item.translatedText
        })
        .catch((error) =>{
              console.log(error)
        })
      }
      texttranslation()
})
// Translating document file
translate_FileBtn.addEventListener('click', () => {
    async function texttranslation(){
        if (! File_Input.files.length) {
            // Alert the user if no file is selected and exit the function
            alert('Please select a file.');
            return;
        }

        // Get the selected file and the target language
            const file = File_Input.files[0];
            const targetLanguage = Right_file_Select.value;
         // Read the content of the file as text
          const text = await readFileAsText(file);
    // Translate the text content to the target language
           const translatedText = await translateText(text, targetLanguage);
    // Create a new Blob with the translated text and set the content type to 'text/plain'
        const translatedBlob = new Blob([translatedText], { type: 'text/plain' });

      // Create a URL for the Blob and set it as the href attribute of the download link
        const translatedUrl = URL.createObjectURL(translatedBlob);
        Downloadlink.href = translatedUrl;

        // Set the download attribute of the link to specify the filename for the downloaded file
        Downloadlink.download = `translated_${file.name}`;

        // Make the download link visible and set its text content
        Downloadlink.style.display = 'block';
        Downloadlink.textContent = 'Download Translated File';
      }
      texttranslation()

      // Function to read a file and return its content as text
            function readFileAsText(file) {
                // Return a promise that resolves with the file content or rejects with an error
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result); // Resolve with the file content on successful load
                    reader.onerror = () => reject(reader.error); // Reject with an error on failure
                    reader.readAsText(file); // Start reading the file as text
                });
            }
     async function translateText(text, targetLanguage) {
        // Send a POST request to the translation API
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                q: text,
                source: left_file_Select.value,
                target: targetLanguage,
                format: 'text'
            })
        });

        // Check if the API request was successful
        if (!response.ok) {
            throw new Error('Translation API request failed'); // Throw an error if the request failed
        }

        // Parse the JSON response and return the translated text
        const data = await response.json();
        return data.translatedText;
    }
})

// Check if the browser supports the Web Speech API
if (!('webkitSpeechRecognition' in window)) {
    // Alert the user if their browser does not support the Web Speech API
    alert('Your browser does not support the Web Speech API. Please use Google Chrome or another supported browser');
} else {
    const recordButton = document.getElementById('recordButton');

    // Create a new instance of the webkitSpeechRecognition API
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    // Add an event listener to the recordButton to start the speech recognition when clicked
    recordButton.addEventListener('click', () => {
        recognition.start();
    });

    // Define a function to be executed when the speech recognition starts
    recognition.onstart = function() {
        type_text.textContent = 'Recording...';
    };

    // Define a function to be executed when the speech recognition returns a result
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        type_text.textContent = `${transcript}`;
    };

    // Define a function to be executed when an error occurs during speech recognition
    recognition.onerror = function(event) {
        type_text.textContent = `Error occurred in recognition: ${event.error}`;
    };

    // Define a function to be executed when the speech recognition ends
    recognition.onend = function() {
        if (type_text.textContent === 'Recording...') {
            type_text.textContent = 'Recording ended with no result.';
        }
    };
}

