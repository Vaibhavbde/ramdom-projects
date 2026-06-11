document.addEventListener("DOMContentLoaded", () => {

    const texts = [
        "What do you want to play?",
        "Winning Speech",
        "Apna Bana Le",
        "Gehra Hua"
    ];

    let i = 0;
    let j = 0;
    let currentText = "";
    let isDeleting = false;

    function typeEffect() {
        currentText = texts[i];

        if (isDeleting) {
            j--;
        } else {
            j++;
        }

        document.getElementById("typing").textContent =
            currentText.substring(0, j);

        if (!isDeleting && j === currentText.length) {
            isDeleting = true;
            setTimeout(typeEffect, 1200);
            return;
        }

        if (isDeleting && j === 0) {
            isDeleting = false;
            i = (i + 1) % texts.length;
        }

        setTimeout(typeEffect, isDeleting ? 50 : 100);
    }

    const input = document.getElementById("searchInput");
    const typing = document.getElementById("typing");

    input.addEventListener("input", () => {
        typing.style.display = input.value ? "none" : "block";
    });

    typeEffect();

});


window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");

    if (window.scrollY > 10) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});


// ================= GLOBAL VARIABLES =================
// ================= SONG DATA =================

let songs = [
    {
        songName: "Wavy",
        singer: "Karan Aujla",
        image: "assets/images/wavy.jpg",
        video: "assets/videos/wavy.mp4",
        path: "assets/songs/wavy.mp3",
        gradient: "linear-gradient(90deg, #b37605, #463304)"
    },

    {
        songName: "Deva Deva",
        singer: "Pritam, Arijit Singh",
        image: "assets/images/deva-deva.jpg",
        video: "assets/videos/devadeva.mp4",
        path: "assets/songs/devadeva.mp3",
        textcolor: "#ffffff",
        gradient: "linear-gradient(90deg, #03235e, #160129)"
    },

    {
        songName: "Headlights",
        singer: "Alan Walker, Alok, KIDDO",
        image: "assets/images/headlights.jpg",
        video: "assets/videos/headlights.mp4",
        path: "assets/songs/headlights.mp3",
        gradient: "linear-gradient(90deg, #0875a0, #4e0322)"
    },

    {
        songName: "Blinding Lights",
        singer: "The Weeknd",
        image: "assets/images/bindinglights.png",
        video: "assets/videos/blindinglights.mp4",
        path: "assets/songs/blindinglights.mp3",
        gradient: "linear-gradient(90deg, #e40c0c, #eb0a4d)"
    }
];

// ================= GLOBAL VARIABLES =================

let currentAudio = new Audio();
let currentIndex = -1;

// ================= CLOSE VIDEO FUNCTION =================

function closeVideoScreen() {

    document.querySelector(".video-screen")
        .classList.remove("active");

    let video =
        document.querySelector(".main-video");

    video.pause();

    video.currentTime = 0;

    video.src = "";
}

// ================= PLAY SONG =================

function playSong(index) {

    // CLOSE VIDEO WHEN SONG CHANGES
    closeVideoScreen();

    currentIndex = index;

    let song = songs[index];

    // Set audio source
    currentAudio.src = song.path;

    // Play audio
    currentAudio.play();

    // Update Song Name
    document.querySelector(".song-name").innerText =
        song.songName;

    // Update Singer Name
    document.querySelector(".singer-name").innerText =
        song.singer;

    // Update Song Image
    document.querySelector(".song-img").innerHTML =
        `<img src="${song.image}" alt="">`;

    // Change Play Button Icon
    document.querySelector(".play-btn").src =
        "assets/images/pause.svg";

    // Show footer
    document.querySelector(".mainbar-footer")
        .classList.add("active");

    console.log("Now Playing:", song.songName);

    // Dynamic gradients
    document.querySelector(".footer-left").style.backgroundImage =
        song.gradient;

    document.querySelector(".footer-right").style.backgroundImage =
        song.gradient;

    // Dynamic text colors
    document.querySelector(".song-name").style.color =
        song.textcolor || "#ffffff";

    document.querySelector(".singer-name").style.color =
        song.textcolor || "#d1d1d1";

    // Visualizer active
    document.querySelector(".visualizer")
        .classList.add("playing");

    document.querySelector(".footer-center")
        .classList.add("playing");
}

// ================= PLAY BUTTON =================

function handlePlay() {

    if (songs.length === 0) return;

    // First Play
    if (currentIndex === -1) {

        let randomIndex =
            Math.floor(Math.random() * songs.length);

        playSong(randomIndex);

        return;
    }

    // Toggle Play / Pause
    if (currentAudio.paused) {

        currentAudio.play();

        document.querySelector(".play-btn").src =
            "assets/images/pause.svg";

        document.querySelector(".visualizer")
            .classList.add("playing");

        document.querySelector(".footer-center")
            .classList.add("playing");

    } else {

        currentAudio.pause();

        document.querySelector(".play-btn").src =
            "assets/images/play.svg";

        document.querySelector(".visualizer")
            .classList.remove("playing");

        document.querySelector(".footer-center")
            .classList.remove("playing");
    }
}

// ================= NEXT =================

function handleNext() {

    if (songs.length === 0) return;

    currentIndex =
        (currentIndex + 1) % songs.length;

    playSong(currentIndex);
}

// ================= PREVIOUS =================

function handlePrevious() {

    if (songs.length === 0) return;

    currentIndex =
        (currentIndex - 1 + songs.length) % songs.length;

    playSong(currentIndex);
}

// ================= AUTO NEXT =================

currentAudio.addEventListener("ended", handleNext);

// ================= EVENT LISTENERS =================

document.addEventListener("DOMContentLoaded", () => {

    // Play Button
    document.querySelector(".play-btn")
        .addEventListener("click", handlePlay);

    // Next Button
    document.querySelector(".next-btn")
        .addEventListener("click", handleNext);

    // Previous Button
    document.querySelector(".prev-btn")
        .addEventListener("click", handlePrevious);

    // OPEN VIDEO SCREEN
    document.querySelector(".footer-left")
        .addEventListener("click", () => {

            if (currentIndex === -1) return;

            let song = songs[currentIndex];

            let video =
                document.querySelector(".main-video");

            video.src = song.video;

            video.play();

            document.querySelector(".video-screen")
                .classList.add("active");
        });

    // CLOSE VIDEO SCREEN
    document.querySelector(".close-video")
        .addEventListener("click", closeVideoScreen);
});

// ================= HORIZONTAL SCROLL =================

const songsContainer =
    document.querySelector(".songs-container");

document.querySelector(".right-btn")
    .addEventListener("click", () => {

        songsContainer.scrollLeft += 500;
    });

document.querySelector(".left-btn")
    .addEventListener("click", () => {

        songsContainer.scrollLeft -= 500;
    });

// ================= TIME + PROGRESS =================

currentAudio.addEventListener("timeupdate", () => {

    // Current Time
    let currentMinutes =
        Math.floor(currentAudio.currentTime / 60);

    let currentSeconds =
        Math.floor(currentAudio.currentTime % 60);

    if (currentSeconds < 10) {
        currentSeconds = "0" + currentSeconds;
    }

    document.querySelector(".current-time").innerText =
        `${currentMinutes}:${currentSeconds}`;

    // Total Duration
    let durationMinutes =
        Math.floor(currentAudio.duration / 60);

    let durationSeconds =
        Math.floor(currentAudio.duration % 60);

    if (durationSeconds < 10) {
        durationSeconds = "0" + durationSeconds;
    }

    document.querySelector(".total-time").innerText =
        `${durationMinutes}:${durationSeconds}`;

    // Progress Bar
    let progressPercent =
        (currentAudio.currentTime / currentAudio.duration) * 100;

    document.querySelector(".progress").style.width =
        progressPercent + "%";
});