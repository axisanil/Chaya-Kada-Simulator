console.log("✅ Script is working");

const sounds = [
  {
    name: "Music",
    files: [
      "sounds/aakasha.mp3",
      "sounds/aayiram.mp3",
      "sounds/alli.mp3",
      "sounds/azhal.mp3",
      "sounds/ennum.mp3",
      "sounds/enteellam.mp3",
      "sounds/kilukil.mp3",
      "sounds/Music.mp3",
      "sounds/nimadhu.mp3",
      "sounds/orupushpam.mp3",
      "sounds/pavizhamalli.mp3",
      "sounds/pinakkamano.mp3",
      "sounds/poomukha.mp3",
      "sounds/thamara.mp3",
      "sounds/walking.mp3"
    ],
    image: "images/Music.png"
  },
  {
    name: "Rain",
    file: "sounds/Rain.mp3",
    image: "images/rain.png"
  },
  {
    name: "crowd",
    file: "sounds/Cafe.mp3",
    image: "images/speak.png"
  },
  {
    name: "Thunderstorm",
    file: "sounds/earthquake.mp3",
    image: "images/thunder.png"
  }
];

const container = document.getElementById("soundboard");

sounds.forEach((sound) => {
  const context = new (window.AudioContext || window.webkitAudioContext)();

  let file = sound.file;
  let currentIndex = -1;
  let shuffledPlaylist = [];

  // Shuffle Music playlist if applicable
  if (sound.name === "Music" && Array.isArray(sound.files)) {
    shuffledPlaylist = sound.files.sort(() => Math.random() - 0.5);
    currentIndex = 0;
    file = shuffledPlaylist[currentIndex];
  }

  const audio = new Audio(file);
  const source = context.createMediaElementSource(audio);
  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 22050;

  source.connect(filter);
  filter.connect(context.destination);

  // Loop ambient sounds; disable loop for Music
  if (sound.name === "Music") {
    audio.loop = false;
    audio.addEventListener("ended", () => {
      currentIndex = (currentIndex + 1) % shuffledPlaylist.length;
      audio.src = shuffledPlaylist[currentIndex];
      audio.play();
    });
  } else {
    audio.loop = true;
  }

  audio.volume = 0.5;

  const div = document.createElement("div");
  div.className = "sound";

  div.innerHTML = `
    <img src="${sound.image}" class="sound-icon" alt="${sound.name}">
    <h3>${sound.name}</h3>
    <input type="range" min="0" max="1" step="0.01" value="0.5" class="volume-slider">
    ${
      sound.name === "Music"
        ? `<div class="button-row">
             <button class="play-btn">Play</button>
             <button class="muffle-btn">Enable Realistic Mode</button>
           </div>`
        : `<button class="play-btn">Play</button>`
    }
  `;

  container.appendChild(div);

  const playBtn = div.querySelector(".play-btn");
  const slider = div.querySelector(".volume-slider");

  let isPlaying = false;

  playBtn.addEventListener("click", () => {
    if (context.state === "suspended") {
      context.resume();
    }

    if (!isPlaying) {
      audio.play();
      isPlaying = true;
      playBtn.textContent = "Pause";

      if (sound.name === "Rain") {
        document.getElementById("rain-overlay").style.opacity = "1";
      }
    } else {
      audio.pause();
      isPlaying = false;
      playBtn.textContent = "Play";

      if (sound.name === "Rain") {
        document.getElementById("rain-overlay").style.opacity = "0";
      }
    }
  });

  slider.addEventListener("input", (e) => {
    audio.volume = e.target.value;
  });

  // Toggle realistic mode for music
  const muffleBtn = div.querySelector(".muffle-btn");
  if (muffleBtn) {
    let muffled = false;
    muffleBtn.addEventListener("click", () => {
      muffled = !muffled;
      filter.frequency.setTargetAtTime(
        muffled ? 1000 : 22050,
        context.currentTime,
        0.25
      );
      muffleBtn.textContent = muffled
        ? "Disable Realistic Mode"
        : "Enable Realistic Mode";
    });
  }
});

// Tea button effect
const teaButton = document.getElementById("make-tea");
const teaSound = new Audio("sounds/tea.mp3");
teaSound.volume = 0.8;

teaButton.addEventListener("click", () => {
  teaSound.currentTime = 0;
  teaSound.play();
});