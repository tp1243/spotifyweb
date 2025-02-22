console.log("Script loaded!");

let currentsong = new Audio();
let songs = [];
let currfolder = "songs"; // Ensure the correct folder
let currentIndex = 0;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    let minutes = Math.floor(seconds / 60);
    let remainingseconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingseconds).padStart(2, '0')}`;
}

async function getsongs(folder) {
    currfolder = folder;
    try {
        let response = await fetch(`${folder}/`);
        let text = await response.text();
        let div = document.createElement("div");
        div.innerHTML = text;
        let links = div.getElementsByTagName("a");

        songs = [];
        for (let link of links) {
            if (link.href.endsWith(".mp3")) {
                songs.push(decodeURIComponent(link.href.split(`/${currfolder}/`)[1]));
            }
        }

        let songul = document.querySelector(".song-lists ul");
        songul.innerHTML = ""; // Clear previous list
        songs.forEach((song, index) => {
            let li = document.createElement("li");
            li.innerHTML = `
                <img class="invert" src="music.svg" alt="">
                <div class="info">
                    <div>${song.replace(".mp3", "")}</div>
                    <div>Unknown Artist</div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img class="invert" src="play.svg" alt="">
                </div>
            `;
            li.addEventListener("click", () => {
                currentIndex = index;
                playmusic(songs[currentIndex]);
            });
            songul.appendChild(li);
        });

        // Set the initial song for each playlist
        if (songs.length > 0) {
            currentIndex = 0;
            currentsong.src = `${currfolder}/${songs[currentIndex]}`;
            document.querySelector("#play").src = "play.svg"; // Ensure play icon is set initially
            document.querySelector(".songinfo").textContent = songs[currentIndex].replace(".mp3", "");
        }
    } catch (error) {
        console.error("Error fetching songs:", error);
    }
}

// Sidebar toggle functionality
document.querySelector(".hamburger").addEventListener("click", () => {
    let sidebar = document.querySelector(".left");
    sidebar.classList.toggle("open");
});

document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").classList.remove("open");
});

// Add event listeners to playlist cards
document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {
        let folder = card.getAttribute("data-folder");
        getsongs(`songs/${folder}`);
    });
});

function playmusic(track) {
    if (!track) return;
    currentsong.src = `${currfolder}/${track}`;
    currentsong.play();
    document.querySelector("#play").src = "pause.svg";
    document.querySelector(".songinfo").textContent = track.replace(".mp3", "");
}

document.querySelector("#play").addEventListener("click", () => {
    if (currentsong.paused) {
        currentsong.play();
        document.querySelector("#play").src = "pause.svg";
    } else {
        currentsong.pause();
        document.querySelector("#play").src = "play.svg";
    }
});

document.querySelector("#previous").addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex--;
        playmusic(songs[currentIndex]);
    }
});

document.querySelector("#next").addEventListener("click", () => {
    if (currentIndex < songs.length - 1) {
        currentIndex++;
        playmusic(songs[currentIndex]);
    } else {
        currentIndex = 0; // Restart from the first song
        playmusic(songs[currentIndex]);
    }
});

// Play next song automatically when current ends
currentsong.addEventListener("ended", () => {
    if (currentIndex < songs.length - 1) {
        currentIndex++;
        playmusic(songs[currentIndex]);
    } else {
        currentIndex = 0; // Restart from the first song when the last song ends
        playmusic(songs[currentIndex]);
    }
});

// Seekbar Functionality
document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width);
    currentsong.currentTime = percent * currentsong.duration;
});

currentsong.addEventListener("timeupdate", () => {
    let progress = (currentsong.currentTime / currentsong.duration) * 100;
    document.querySelector(".circle").style.left = progress + "%";
    document.querySelector(".songtime").innerText = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`;
});

// Volume Control
document.querySelector(".range input").addEventListener("input", e => {
    currentsong.volume = e.target.value / 100;
});

// Load default songs on page load
getsongs("songs");
