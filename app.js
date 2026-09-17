const phrases = [
  { text: "I'm thirsty", image: "img/drink.jpg", category: "Needs" },
  { text: "I'm hungry", image: "img/food.jpg", category: "Needs" },
  { text: "I'm tired", image: "img/tired.jpg", category: "Needs" },
  { text: "I'm hurt", image: "img/hurt.jpg", category: "Needs" },
  { text: "I'm happy", image: "img/happy.jpg", category: "Feelings" },
  { text: "I'm angry", image: "img/angry.jpg", category: "Feelings" },
  { text: "I'm sad", image: "img/sad.jpg", category: "Feelings" },
  { text: "I'm scared", image: "img/scared.jpg", category: "Feelings" },
  { text: "I want to go outside", image: "img/outside.jpg", category: "Places" },
  { text: "I want to go home", image: "img/home.jpg", category: "Places" },
  { text: "I want to go to school", image: "img/school.jpg", category: "Places" },
  { text: "I want to go to Grandma's house", image: "img/grandma.jpg", category: "Places" }
];

const board = document.getElementById("phrase-board");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const resultCount = document.getElementById("result-count");
const emptyState = document.getElementById("empty-state");
const voiceSelect = document.getElementById("voice");
const rateInput = document.getElementById("rate");
const pitchInput = document.getElementById("pitch");
const rateValue = document.getElementById("rate-value");
const pitchValue = document.getElementById("pitch-value");
const customText = document.getElementById("custom-text");
const speakCustomButton = document.getElementById("speak-custom");
const stopSpeechButton = document.getElementById("stop-speech");
const speechStatus = document.getElementById("speech-status");

const synth = window.speechSynthesis;
let availableVoices = [];
let activeCard = null;

const categories = [...new Set(phrases.map(({ category }) => category))];
categories.forEach((category) => {
  const option = document.createElement("option");
  option.value = category;
  option.textContent = category;
  categorySelect.appendChild(option);
});

function setStatus(message, state = "ready") {
  speechStatus.textContent = message;
  speechStatus.dataset.state = state;
}

function clearActiveCard() {
  if (activeCard) {
    activeCard.classList.remove("active");
    activeCard = null;
  }
}

function speak(text, sourceCard = null) {
  const normalizedText = text.trim();

  if (!normalizedText) {
    setStatus("Enter a message before speaking.", "error");
    customText.focus();
    return;
  }

  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
    setStatus("Speech synthesis is not supported in this browser.", "error");
    return;
  }

  synth.cancel();
  clearActiveCard();

  const utterance = new SpeechSynthesisUtterance(normalizedText);
  const selectedVoice = availableVoices.find((voice) => voice.name === voiceSelect.value);

  if (selectedVoice) utterance.voice = selectedVoice;
  utterance.rate = Number(rateInput.value);
  utterance.pitch = Number(pitchInput.value);

  utterance.onstart = () => {
    if (sourceCard) {
      activeCard = sourceCard;
      activeCard.classList.add("active");
    }
    setStatus(`Speaking: “${normalizedText}”`, "speaking");
  };

  utterance.onend = () => {
    clearActiveCard();
    setStatus("Ready to speak.");
  };

  utterance.onerror = (event) => {
    clearActiveCard();
    if (event.error === "canceled" || event.error === "interrupted") {
      setStatus("Speech stopped.");
      return;
    }
    setStatus("Speech could not be played. Try another voice or browser.", "error");
  };

  synth.speak(utterance);
}

function createPhraseCard(phrase) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "phrase-card";
  card.setAttribute("aria-label", `Speak: ${phrase.text}`);

  const image = document.createElement("img");
  image.src = phrase.image;
  image.alt = "";
  image.loading = "lazy";

  const body = document.createElement("div");
  body.className = "card-body";

  const meta = document.createElement("div");
  meta.className = "card-meta";

  const category = document.createElement("span");
  category.className = "card-category";
  category.textContent = phrase.category;

  const action = document.createElement("span");
  action.className = "card-action";
  action.textContent = "Tap to speak";

  const title = document.createElement("p");
  title.className = "card-title";
  title.textContent = phrase.text;

  meta.append(category, action);
  body.append(meta, title);
  card.append(image, body);
  card.addEventListener("click", () => speak(phrase.text, card));

  return card;
}

function renderPhrases() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedCategory = categorySelect.value;

  const filtered = phrases.filter((phrase) => {
    const matchesSearch = phrase.text.toLowerCase().includes(query);
    const matchesCategory = selectedCategory === "All" || phrase.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  board.replaceChildren(...filtered.map(createPhraseCard));
  resultCount.textContent = `${filtered.length} ${filtered.length === 1 ? "phrase" : "phrases"}`;
  emptyState.hidden = filtered.length !== 0;
}

function populateVoices() {
  const previousVoice = voiceSelect.value;
  availableVoices = synth.getVoices().slice().sort((a, b) => {
    if (a.lang === b.lang) return a.name.localeCompare(b.name);
    return a.lang.localeCompare(b.lang);
  });

  voiceSelect.replaceChildren();

  if (availableVoices.length === 0) {
    const option = document.createElement("option");
    option.textContent = "System default voice";
    option.value = "";
    voiceSelect.appendChild(option);
    return;
  }

  availableVoices.forEach((voice) => {
    const option = document.createElement("option");
    option.value = voice.name;
    option.textContent = `${voice.name} · ${voice.lang}${voice.default ? " · Default" : ""}`;
    voiceSelect.appendChild(option);
  });

  const stillAvailable = availableVoices.some((voice) => voice.name === previousVoice);
  if (stillAvailable) voiceSelect.value = previousVoice;
}

searchInput.addEventListener("input", renderPhrases);
categorySelect.addEventListener("change", renderPhrases);

rateInput.addEventListener("input", () => {
  rateValue.value = `${Number(rateInput.value).toFixed(1)}×`;
});

pitchInput.addEventListener("input", () => {
  pitchValue.value = Number(pitchInput.value).toFixed(1);
});

speakCustomButton.addEventListener("click", () => speak(customText.value));
stopSpeechButton.addEventListener("click", () => {
  synth.cancel();
  clearActiveCard();
  setStatus("Speech stopped.");
});

customText.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    event.preventDefault();
    speak(customText.value);
  }
});

if ("speechSynthesis" in window) {
  populateVoices();
  speechSynthesis.addEventListener("voiceschanged", populateVoices);
} else {
  voiceSelect.disabled = true;
  speakCustomButton.disabled = true;
  stopSpeechButton.disabled = true;
  setStatus("Speech synthesis is not supported in this browser.", "error");
}

renderPhrases();
