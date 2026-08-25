// ==========================================
// MUSIC PLAYER
// HTML + CSS + JAVASCRIPT + LOCAL STORAGE
// ==========================================


// ==========================================
// ELEMENTS
// ==========================================

const audio = document.getElementById("audio-player");

const playButton = document.getElementById("play-btn");
const previousButton = document.getElementById("previous-btn");
const nextButton = document.getElementById("next-btn");

const shuffleButton = document.getElementById("shuffle-btn");
const repeatButton = document.getElementById("repeat-btn");

const progressBar = document.getElementById("progress-bar");
const volumeBar = document.getElementById("volume-bar");

const currentTimeElement = document.getElementById("current-time");
const durationElement = document.getElementById("duration");

const titleElement = document.getElementById("song-title");
const artistElement = document.getElementById("artist-name");
const coverImage = document.getElementById("cover-image");

const playlistElement = document.getElementById("playlist");
const songCountElement = document.getElementById("song-count");

const searchInput = document.getElementById("search-input");

const favoriteButton = document.getElementById("favorite-btn");
const favoritesList = document.getElementById("favorites-list");
const favoriteCount = document.getElementById("favorite-count");
const emptyFavorites = document.getElementById("empty-favorites");

const historyList = document.getElementById("history-list");
const emptyHistory = document.getElementById("empty-history");
const clearHistoryButton =
    document.getElementById("clear-history-btn");

const themeButton =
    document.getElementById("theme-btn");


// ==========================================
// SONG DATA
// ==========================================

const songs = [

    {
        id: 1,
        title: "Udhiram BGM",
        artist: "BGM",
        src: "songs/udhiram-bgm.mp3",
        cover: "images/cover1.jpg"
    },

    {
        id: 2,
        title: "Raga Revenge",
        artist: "BGM",
        src: "songs/raga-revenge.mp3",
        cover: "images/cover2.jpg"
    },

    {
        id: 3,
        title: "God Mode Begins",
        artist: "BGM",
        src: "songs/god-mode-begins.mp3",
        cover: "images/cover3.jpg"
    }

];


// ==========================================
// PLAYER STATE
// ==========================================

let currentSongIndex = 0;

let isPlaying = false;

let isShuffle = false;

let isRepeat = false;


// ==========================================
// LOCAL STORAGE
// ==========================================

let favorites =
    JSON.parse(
        localStorage.getItem("musicFavorites")
    ) || [];

let history =
    JSON.parse(
        localStorage.getItem("musicHistory")
    ) || [];


// ==========================================
// LOAD SONG
// ==========================================

function loadSong(index) {

    currentSongIndex = index;

    const song = songs[currentSongIndex];

    titleElement.textContent = song.title;

    artistElement.textContent = song.artist;

    coverImage.src = song.cover;

    audio.src = song.src;

    audio.load();

    currentTimeElement.textContent = "0:00";

    durationElement.textContent = "0:00";

    progressBar.value = 0;

    updateFavoriteButton();

    renderPlaylist();

}


// ==========================================
// PLAY SONG
// ==========================================

function playSong() {

    const playPromise = audio.play();

    if (playPromise !== undefined) {

        playPromise
            .then(function () {

                isPlaying = true;

                playButton.textContent = "⏸";

                addToHistory(
                    songs[currentSongIndex]
                );

            })
            .catch(function (error) {

                console.error(
                    "Audio playback error:",
                    error
                );

                alert(
                    "Audio could not be played. Please check the song file."
                );

            });

    }

}


// ==========================================
// PAUSE SONG
// ==========================================

function pauseSong() {

    audio.pause();

    isPlaying = false;

    playButton.textContent = "▶";

}


// ==========================================
// PLAY / PAUSE
// ==========================================

playButton.addEventListener(
    "click",
    function () {

        if (isPlaying) {

            pauseSong();

        } else {

            playSong();

        }

    }
);


// ==========================================
// NEXT SONG
// ==========================================

function nextSong() {

    if (isShuffle) {

        let randomIndex;

        do {

            randomIndex =
                Math.floor(
                    Math.random() * songs.length
                );

        } while (
            randomIndex === currentSongIndex &&
            songs.length > 1
        );

        currentSongIndex = randomIndex;

    } else {

        currentSongIndex++;

        if (
            currentSongIndex >= songs.length
        ) {

            currentSongIndex = 0;

        }

    }

    loadSong(currentSongIndex);

    playSong();

}


nextButton.addEventListener(
    "click",
    nextSong
);


// ==========================================
// PREVIOUS SONG
// ==========================================

previousButton.addEventListener(
    "click",
    function () {

        currentSongIndex--;

        if (currentSongIndex < 0) {

            currentSongIndex =
                songs.length - 1;

        }

        loadSong(currentSongIndex);

        playSong();

    }
);


// ==========================================
// SONG ENDED
// ==========================================

audio.addEventListener(
    "ended",
    function () {

        if (isRepeat) {

            audio.currentTime = 0;

            playSong();

        } else {

            nextSong();

        }

    }
);


// ==========================================
// AUDIO TIME UPDATE
// ==========================================

audio.addEventListener(
    "timeupdate",
    function () {

        if (!audio.duration) {
            return;
        }

        const percentage =
            (
                audio.currentTime /
                audio.duration
            ) * 100;

        progressBar.value = percentage;

        currentTimeElement.textContent =
            formatTime(
                audio.currentTime
            );

        durationElement.textContent =
            formatTime(
                audio.duration
            );

    }
);


// ==========================================
// PROGRESS BAR
// ==========================================

progressBar.addEventListener(
    "input",
    function () {

        if (!audio.duration) {
            return;
        }

        audio.currentTime =
            (
                progressBar.value / 100
            ) * audio.duration;

    }
);


// ==========================================
// VOLUME
// ==========================================

volumeBar.addEventListener(
    "input",
    function () {

        audio.volume =
            Number(volumeBar.value);

    }
);


// ==========================================
// SHUFFLE
// ==========================================

shuffleButton.addEventListener(
    "click",
    function () {

        isShuffle = !isShuffle;

        shuffleButton.style.color =
            isShuffle
                ? "var(--accent)"
                : "var(--text)";

    }
);


// ==========================================
// REPEAT
// ==========================================

repeatButton.addEventListener(
    "click",
    function () {

        isRepeat = !isRepeat;

        repeatButton.style.color =
            isRepeat
                ? "var(--accent)"
                : "var(--text)";

    }
);


// ==========================================
// PLAYLIST
// ==========================================

function renderPlaylist(
    filteredSongs = songs
) {

    playlistElement.innerHTML = "";

    songCountElement.textContent =
        `${filteredSongs.length} songs`;


    filteredSongs.forEach(
        function (song, displayIndex) {

            const actualIndex =
                songs.findIndex(
                    function (item) {

                        return item.id === song.id;

                    }
                );


            const item =
                document.createElement("li");

            item.classList.add(
                "song-item"
            );


            if (
                actualIndex ===
                currentSongIndex
            ) {

                item.classList.add(
                    "active"
                );

            }


            item.innerHTML = `

                <span class="song-number">
                    ${displayIndex + 1}
                </span>

                <div class="song-details">

                    <strong>
                        ${song.title}
                    </strong>

                    <span>
                        ${song.artist}
                    </span>

                </div>

                <button
                    class="song-action"
                    type="button"
                >
                    ▶
                </button>

            `;


            item.addEventListener(
                "click",
                function () {

                    loadSong(actualIndex);

                    playSong();

                }
            );


            playlistElement.appendChild(item);

        }
    );

}


// ==========================================
// SEARCH
// ==========================================

searchInput.addEventListener(
    "input",
    function () {

        const searchTerm =
            searchInput.value
                .toLowerCase()
                .trim();


        const filteredSongs =
            songs.filter(
                function (song) {

                    return (

                        song.title
                            .toLowerCase()
                            .includes(searchTerm)

                        ||

                        song.artist
                            .toLowerCase()
                            .includes(searchTerm)

                    );

                }
            );


        renderPlaylist(
            filteredSongs
        );

    }
);


// ==========================================
// FAVORITES
// ==========================================

favoriteButton.addEventListener(
    "click",
    function () {

        const song =
            songs[currentSongIndex];


        const existingIndex =
            favorites.findIndex(
                function (item) {

                    return item.id === song.id;

                }
            );


        if (existingIndex === -1) {

            favorites.push(song);

        } else {

            favorites.splice(
                existingIndex,
                1
            );

        }


        saveFavorites();

        updateFavoriteButton();

        renderFavorites();

    }
);


// ==========================================
// UPDATE FAVORITE BUTTON
// ==========================================

function updateFavoriteButton() {

    const song =
        songs[currentSongIndex];


    const isFavorite =
        favorites.some(
            function (item) {

                return item.id === song.id;

            }
        );


    if (isFavorite) {

        favoriteButton.textContent =
            "♥ Remove from Favorites";

        favoriteButton.classList.add(
            "active"
        );

    } else {

        favoriteButton.textContent =
            "♡ Add to Favorites";

        favoriteButton.classList.remove(
            "active"
        );

    }

}


// ==========================================
// SAVE FAVORITES
// ==========================================

function saveFavorites() {

    localStorage.setItem(
        "musicFavorites",
        JSON.stringify(favorites)
    );

}


// ==========================================
// DISPLAY FAVORITES
// ==========================================

function renderFavorites() {

    favoritesList.innerHTML = "";

    favoriteCount.textContent =
        favorites.length;


    if (favorites.length === 0) {

        emptyFavorites.style.display =
            "block";

        return;

    }


    emptyFavorites.style.display =
        "none";


    favorites.forEach(
        function (song) {

            const item =
                document.createElement("li");

            item.classList.add(
                "song-item"
            );


            item.innerHTML = `

                <div class="song-details">

                    <strong>
                        ${song.title}
                    </strong>

                    <span>
                        ${song.artist}
                    </span>

                </div>

                <button
                    class="song-action"
                    type="button"
                >
                    ♥
                </button>

            `;


            item.addEventListener(
                "click",
                function () {

                    const index =
                        songs.findIndex(
                            function (originalSong) {

                                return (
                                    originalSong.id ===
                                    song.id
                                );

                            }
                        );


                    if (index !== -1) {

                        loadSong(index);

                        playSong();

                    }

                }
            );


            favoritesList.appendChild(item);

        }
    );

}


// ==========================================
// HISTORY
// ==========================================

function addToHistory(song) {

    history =
        history.filter(
            function (item) {

                return item.id !== song.id;

            }
        );


    history.unshift(song);


    if (history.length > 10) {

        history =
            history.slice(0, 10);

    }


    localStorage.setItem(
        "musicHistory",
        JSON.stringify(history)
    );


    renderHistory();

}


// ==========================================
// DISPLAY HISTORY
// ==========================================

function renderHistory() {

    historyList.innerHTML = "";


    if (history.length === 0) {

        emptyHistory.style.display =
            "block";

        return;

    }


    emptyHistory.style.display =
        "none";


    history.forEach(
        function (song) {

            const item =
                document.createElement("li");

            item.classList.add(
                "song-item"
            );


            item.innerHTML = `

                <div class="song-details">

                    <strong>
                        ${song.title}
                    </strong>

                    <span>
                        ${song.artist}
                    </span>

                </div>

                <button
                    class="song-action"
                    type="button"
                >
                    ▶
                </button>

            `;


            item.addEventListener(
                "click",
                function () {

                    const index =
                        songs.findIndex(
                            function (originalSong) {

                                return (
                                    originalSong.id ===
                                    song.id
                                );

                            }
                        );


                    if (index !== -1) {

                        loadSong(index);

                        playSong();

                    }

                }
            );


            historyList.appendChild(item);

        }
    );

}


// ==========================================
// CLEAR HISTORY
// ==========================================

clearHistoryButton.addEventListener(
    "click",
    function () {

        history = [];

        localStorage.removeItem(
            "musicHistory"
        );

        renderHistory();

    }
);


// ==========================================
// DARK / LIGHT MODE
// ==========================================

themeButton.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "light-mode"
        );


        const isLight =
            document.body.classList.contains(
                "light-mode"
            );


        themeButton.textContent =
            isLight
                ? "☀️"
                : "🌙";


        localStorage.setItem(
            "musicTheme",
            isLight
                ? "light"
                : "dark"
        );

    }
);


// ==========================================
// FORMAT TIME
// ==========================================

function formatTime(seconds) {

    if (!isFinite(seconds)) {

        return "0:00";

    }


    const minutes =
        Math.floor(
            seconds / 60
        );

    const remainingSeconds =
        Math.floor(
            seconds % 60
        );


    return (
        minutes +
        ":" +
        String(
            remainingSeconds
        ).padStart(2, "0")
    );

}


// ==========================================
// LOAD SAVED THEME
// ==========================================

const savedTheme =
    localStorage.getItem(
        "musicTheme"
    );


if (savedTheme === "light") {

    document.body.classList.add(
        "light-mode"
    );

    themeButton.textContent =
        "☀️";

}


// ==========================================
// INITIAL SETUP
// ==========================================

audio.volume = 1;

loadSong(0);

renderPlaylist();

renderFavorites();

renderHistory();