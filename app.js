const toggle = document.getElementById("toggle");
const closeBtn = document.getElementById("close");
const voiceSelecte = document.getElementById("voice");
const text = document.getElementById("text");
const read = document.getElementById("read");
const main = document.querySelector("main");

const data = [
  {
    image: "img/drink.jpg",
    text: "I'm Thirsty",
  },
  {
    image: "img/food.jpg",
    text: "I'm Hungry",
  },
  {
    image: "img/tired.jpg",
    text: "I'm Tired",
  },
  {
    image: "img/hurt.jpg",
    text: "I'm Hurt",
  },
  {
    image: "img/happy.jpg",
    text: "I'm Happy",
  },
  {
    image: "img/angry.jpg",
    text: "I'm Angry",
  },
  {
    image: "img/sad.jpg",
    text: "I'm Sad",
  },
  {
    image: "img/scared.jpg",
    text: "I'm Scared",
  },
  {
    image: "img/outside.jpg",
    text: "I Want to Go Outside",
  },
  {
    image: "img/home.jpg",
    text: "I'm Home",
  },
  {
    image: "img/school.jpg",
    text: "I Want to go School",
  },
  {
    image: "img/grandma.jpg",
    text: "I Want to go Grandma House",
  },
];

// generate speech object
const message = new SpeechSynthesisUtterance();

// arry of voices
let voices = [];

function getVoices() {
  voices = speechSynthesis.getVoices();

  voices.forEach((voice) => {
    const option = document.createElement("option");
    option.value = voice.name;
    option.innerText = `${voice.name} ${voice.lang}`;

    voiceSelecte.appendChild(option);
  });
}

// add the images to dom
data.forEach(createBox);

// Create Box Function
function createBox(item) {
  const { text, image } = item;

  const box = document.createElement("div");
  box.classList.add("box");

  box.innerHTML = `
        <img src="${image}" alt="${text}">
        <p class="info">${text}</p>
    `;

  // adding box events
  box.addEventListener("click", () => {
    setTextMessage(text);
    speakText();

    box.classList.add("active");
    setTimeout(() => box.classList.remove("active"), 800);
  });

  main.appendChild(box);
}

// setTextMessage
function setTextMessage(text) {
  message.text = text;
}
// speak Text
function speakText() {
  speechSynthesis.speak(message);
}

// Set Voice Function
function setVoice(e) {
  console.log(e.target.value);
  message.voice = voices.find((voice) => voice.name === e.target.value);
  speakText();
}

// add toggle event
toggle.addEventListener("click", () =>
  document.getElementById("text-box").classList.toggle("show")
);

// add close event
closeBtn.addEventListener("click", () =>
  document.getElementById("text-box").classList.remove("show")
);

// speeach event
speechSynthesis.addEventListener("voiceschanged", getVoices);

// select event
voiceSelecte.addEventListener("change", setVoice);

// Read Text
read.addEventListener("click", () => {
  setTextMessage(text.value);
  speakText();
});

getVoices();
