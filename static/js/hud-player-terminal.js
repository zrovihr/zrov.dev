(function () {
  const clock = document.getElementById('nodeClock');
  const audioToggle = document.getElementById('audioToggle');
  const volumeSlider = document.getElementById('volumeSlider');
  const playlistToggle = document.getElementById('playlistToggle');
  const playlistMenu = document.getElementById('playlistMenu');
  const playlistList = document.getElementById('playlistList');
  const playlistOpenAll = document.getElementById('playlistOpenAll');
  const nowPlaying = document.getElementById('nowPlaying');
  const musicProgress = document.getElementById('musicProgress');
  const musicProgressFill = document.getElementById('musicProgressFill');
  const musicWave = document.getElementById('musicWave');
  const terminalForm = document.getElementById('quickTerminalForm');
  const searchForm = document.getElementById('googleSearchForm');
  const commandInput = document.getElementById('commandInput');
  const output = document.getElementById('quickTerminalOutput');
  const lockSession = document.getElementById('lockSession');
  const playlistFallbackTracks = [
    { title: 'Porter Robinson - Shelter', youtubeId: 'HQnC1UHBvWA', source: 'Windows Into His World' },
    { title: 'Mac Quayle - 1.4_2-impenetrable.sd2', youtubeId: 'i61Sq7LEZ60', source: 'Planting Seeds' },
    { title: "Heidi Montag - I'll Do It", youtubeId: 'lQ9oaxLQIwI', source: 'Meet Lainey' },
    { title: 'Unity Events track', youtubeId: 'NXXyIYXmu_M', source: 'Unity Events' },
    { title: 'Smart Pointers track', youtubeId: '1ZHM3k9rwfU', source: 'Smart Pointers' },
    { title: 'Japanese Job Interview track', youtubeId: 'sJ_oBENCzy8', source: 'Japanese Job Interview' },
    { title: 'Unity Progress track', youtubeId: '5sUtizeP0NE', source: 'Unity Progress 1' },
    { title: 'First Post track', youtubeId: '2bFSr3pZFjc', source: 'First Post' }
  ];
  let playlistTracks = playlistFallbackTracks.slice();
  let repeatedCommand = '';
  let ytPlayer = null;
  let ytReady = false;
  let ytLoading = false;
  let currentTrackIndex = 0;
  let isYoutubePlaying = false;
  let progressTimer = null;
  const pendingYoutubeActions = [];
  const SHUFFLE_KEY = 'zrov:hud:shuffle';
  let shuffleEnabled = (function () {
    try {
      var raw = localStorage.getItem(SHUFFLE_KEY);
      if (raw === null) return true;
      return raw === 'true';
    } catch (_) {
      return true;
    }
  })();

  function persistShuffle() {
    try { localStorage.setItem(SHUFFLE_KEY, String(shuffleEnabled)); } catch (_) {}
    if (playlistToggle) {
      playlistToggle.title = 'Playlist (shuffle: ' + (shuffleEnabled ? 'ON' : 'OFF') + ')';
    }
  }

  function shuffleArray(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[ch];
    });
  }

  function writeOutput(message) {
    if (!output) return;
    output.innerHTML = '<span class="prompt">Terminal:</span> <span>' + escapeHTML(message) + '</span>';
  }

  function updateClock() {
    if (!clock) return;
    const now = new Date();
    clock.textContent =
      String(now.getHours()).padStart(2, '0') + ':' +
      String(now.getMinutes()).padStart(2, '0') + ':' +
      String(now.getSeconds()).padStart(2, '0');
  }

  function navigate(message, url) {
    writeOutput(message);
    window.location.href = url;
  }

  function currentTrack() {
    return playlistTracks[currentTrackIndex] || playlistTracks[0];
  }

  function normalizePlaylistTracks(rawTracks) {
    if (!Array.isArray(rawTracks)) return [];
    return rawTracks
      .map(function (track) {
        if (!track || !track.title || !track.youtubeId) return null;
        return {
          title: String(track.title),
          youtubeId: String(track.youtubeId),
          source: track.source ? String(track.source) : 'YouTube'
        };
      })
      .filter(Boolean);
  }

  function updateNowPlaying(status) {
    if (!nowPlaying) return;
    const track = currentTrack();
    const label = status || (isYoutubePlaying ? 'Playing' : 'Selected');
    nowPlaying.innerHTML = '<strong>' + escapeHTML(label) + ':</strong> ' +
      escapeHTML(track ? track.title : 'No track loaded');
  }

  function updatePlaylistSelection() {
    if (!playlistList) return;
    Array.prototype.forEach.call(playlistList.querySelectorAll('.playlist-track'), function (button, index) {
      const isActive = index === currentTrackIndex;
      button.classList.toggle('is-active', isActive);
      if (isActive) {
        button.setAttribute('aria-current', 'true');
      } else {
        button.removeAttribute('aria-current');
      }
    });
  }

  function renderPlaylist() {
    if (!playlistList) return;
    playlistList.innerHTML = '';

    playlistTracks.forEach(function (track, index) {
      const item = document.createElement('li');
      const link = document.createElement('button');
      const idx = document.createElement('span');
      const title = document.createElement('span');
      const meta = document.createElement('span');

      link.className = 'playlist-track';
      link.type = 'button';
      link.setAttribute('aria-label', 'Play ' + track.title);
      if (index === currentTrackIndex) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'true');
      }

      idx.className = 'playlist-track__idx';
      idx.textContent = String(index + 1).padStart(2, '0');
      title.className = 'playlist-track__title';
      title.textContent = track.title;
      meta.className = 'playlist-track__meta';
      meta.textContent = track.source;

      link.appendChild(idx);
      link.appendChild(title);
      link.appendChild(meta);
      link.addEventListener('click', function () {
        playYoutubeTrack(index, true);
        setPlaylistOpen(false);
      });
      item.appendChild(link);
      playlistList.appendChild(item);
    });

    if (playlistOpenAll) {
      playlistOpenAll.href = 'https://www.youtube.com/watch_videos?video_ids=' +
        playlistTracks.map(function (track) {
          return encodeURIComponent(track.youtubeId);
        }).join(',');
    }

    updateNowPlaying();
  }

  var ytTitleCache = {};
  try {
    var rawCache = localStorage.getItem('zrov:hud:yt-titles');
    if (rawCache) ytTitleCache = JSON.parse(rawCache);
  } catch (_) { ytTitleCache = {}; }

  function persistYtTitles() {
    try { localStorage.setItem('zrov:hud:yt-titles', JSON.stringify(ytTitleCache)); } catch (_) {}
  }

  function fetchYoutubeTitle(videoId) {
    if (ytTitleCache[videoId]) return Promise.resolve(ytTitleCache[videoId]);
    return fetch('https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=' + encodeURIComponent(videoId) + '&format=json')
      .then(function (r) {
        if (!r.ok) throw new Error('oEmbed failed');
        return r.json();
      })
      .then(function (data) {
        var title = data && data.title ? String(data.title) : null;
        if (title) {
          ytTitleCache[videoId] = title;
          persistYtTitles();
        }
        return title;
      })
      .catch(function () { return null; });
  }

  function enrichTitles(tracks) {
    return Promise.all(tracks.map(function (track) {
      if (!track || !track.youtubeId) return Promise.resolve(track);
      return fetchYoutubeTitle(track.youtubeId).then(function (realTitle) {
        if (realTitle) track.title = realTitle;
        return track;
      });
    }));
  }

  function fetchBlogTracks() {
    return fetch('/blogs/posts/manifest.json', { cache: 'no-store' })
      .then(function (response) {
        if (!response.ok) throw new Error('Blog manifest unavailable');
        return response.json();
      })
      .then(function (manifest) {
        if (!Array.isArray(manifest)) return [];
        return manifest
          .filter(function (entry) { return entry && entry.youtubeId && entry.title; })
          .map(function (entry) {
            var musicLabel = entry.music ? String(entry.music).replace(/^Today'?s?\s*(Music|Song|music|song):?\s*/i, '').trim() : '';
            return {
              title: musicLabel || String(entry.title),
              youtubeId: String(entry.youtubeId),
              source: String(entry.title)
            };
          });
      })
      .catch(function () { return []; });
  }

  function mergeTracks(manualTracks, blogTracks) {
    var seen = {};
    var merged = [];
    blogTracks.forEach(function (track) {
      if (!seen[track.youtubeId]) {
        seen[track.youtubeId] = true;
        merged.push(track);
      }
    });
    manualTracks.forEach(function (track) {
      if (!seen[track.youtubeId]) {
        seen[track.youtubeId] = true;
        merged.push(track);
      }
    });
    return merged;
  }

  function loadPlaylist() {
    function applyShuffle() {
      if (!shuffleEnabled || playlistTracks.length < 2) return;
      shuffleArray(playlistTracks);
      currentTrackIndex = 0;
    }

    renderPlaylist();

    Promise.all([
      fetch('/static/data/playlist.json', { cache: 'no-store' })
        .then(function (response) {
          if (!response.ok) throw new Error('Playlist request failed');
          return response.json();
        })
        .then(function (tracks) { return normalizePlaylistTracks(tracks); })
        .catch(function () { return []; }),
      fetchBlogTracks()
    ])
      .then(function (results) {
        var manualTracks = results[0];
        var blogTracks = results[1];
        var merged = mergeTracks(manualTracks, blogTracks);
        if (!merged.length) throw new Error('No playable tracks from any source');
        return enrichTitles(merged);
      })
      .then(function (enrichedTracks) {
        playlistTracks = enrichedTracks;
        applyShuffle();
        renderPlaylist();
      })
      .catch(function () {
        playlistTracks = playlistFallbackTracks.slice();
        enrichTitles(playlistTracks).then(function (enriched) {
          playlistTracks = enriched;
          applyShuffle();
          renderPlaylist();
        }).catch(function () {
          applyShuffle();
          renderPlaylist();
        });
        writeOutput('All playlist sources unavailable. Using built-in fallback tracks.');
      });
  }

  function setPlaylistOpen(isOpen) {
    if (!playlistMenu || !playlistToggle) return;
    playlistMenu.hidden = !isOpen;
    playlistToggle.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) writeOutput('Playlist node open. Choose a YouTube track or open the queue.');
  }

  function togglePlaylist() {
    if (!playlistMenu) return;
    setPlaylistOpen(playlistMenu.hidden);
  }

  function setAudioButton(label) {
    if (audioToggle) audioToggle.textContent = label;
  }

  function setProgress(percent) {
    const safePercent = Math.max(0, Math.min(100, Number.isFinite(percent) ? percent : 0));
    if (musicProgressFill) musicProgressFill.style.width = safePercent.toFixed(2) + '%';
    if (musicProgress) musicProgress.setAttribute('aria-valuenow', String(Math.round(safePercent)));
  }

  function updatePlaybackChrome(isPlaying) {
    if (musicWave) musicWave.classList.toggle('is-playing', isPlaying);
    if (!isPlaying && progressTimer) {
      window.clearInterval(progressTimer);
      progressTimer = null;
    }
  }

  function updateProgress() {
    if (!ytPlayer || !ytReady ||
      typeof ytPlayer.getDuration !== 'function' ||
      typeof ytPlayer.getCurrentTime !== 'function') return;

    const duration = ytPlayer.getDuration();
    const current = ytPlayer.getCurrentTime();
    if (!duration || duration <= 0) {
      setProgress(0);
      return;
    }

    setProgress((current / duration) * 100);
  }

  function startProgressTimer() {
    updateProgress();
    if (progressTimer) return;
    progressTimer = window.setInterval(updateProgress, 250);
  }

  function setYoutubeVolume() {
    if (!ytPlayer || !ytReady || !volumeSlider || typeof ytPlayer.setVolume !== 'function') return;
    ytPlayer.setVolume(Math.round(parseFloat(volumeSlider.value) * 100));
  }

  function onYoutubeStateChange(event) {
    if (!window.YT || !window.YT.PlayerState) return;

    if (event.data === window.YT.PlayerState.PLAYING) {
      isYoutubePlaying = true;
      setAudioButton('\u23F8');
      updateNowPlaying('Playing');
      updatePlaybackChrome(true);
      startProgressTimer();
      return;
    }

    if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
      isYoutubePlaying = false;
      setAudioButton('\u25B6');
      updateNowPlaying(event.data === window.YT.PlayerState.ENDED ? 'Ended' : 'Paused');
      updatePlaybackChrome(false);
      updateProgress();
      if (event.data === window.YT.PlayerState.ENDED) setProgress(100);
      if (event.data === window.YT.PlayerState.ENDED && playlistTracks.length) {
        playYoutubeTrack((currentTrackIndex + 1) % playlistTracks.length, true);
      }
    }
  }

  function flushYoutubeActions() {
    while (pendingYoutubeActions.length) pendingYoutubeActions.shift()();
  }

  function createYoutubePlayer() {
    if (!window.YT || !window.YT.Player || ytPlayer) return;
    const track = currentTrack();
    ytPlayer = new window.YT.Player('ytPlayer', {
      width: '1',
      height: '1',
      videoId: track.youtubeId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        modestbranding: 1,
        playsinline: 1,
        rel: 0
      },
      events: {
        onReady: function () {
          ytReady = true;
          setYoutubeVolume();
          flushYoutubeActions();
        },
        onStateChange: onYoutubeStateChange,
        onError: function () {
          isYoutubePlaying = false;
          setAudioButton('\u25B6');
          updatePlaybackChrome(false);
          setProgress(0);
          updateNowPlaying('Unavailable');
          writeOutput('YouTube player could not load this track. Open queue is still available.');
        }
      }
    });
  }

  function ensureYoutubePlayer(action) {
    if (ytReady && ytPlayer) {
      action();
      return;
    }

    setAudioButton('\u25D0');
    pendingYoutubeActions.push(action);

    if (ytPlayer) return;
    if (window.YT && window.YT.Player) {
      createYoutubePlayer();
      return;
    }

    if (ytLoading) return;
    ytLoading = true;
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.async = true;
    tag.onerror = function () {
      ytLoading = false;
      pendingYoutubeActions.length = 0;
      setAudioButton('\u25B6');
      writeOutput('YouTube player API failed to load.');
    };
    document.head.appendChild(tag);
  }

  window.onYouTubeIframeAPIReady = function () {
    createYoutubePlayer();
  };

  function playYoutubeTrack(index, fromSelection) {
    currentTrackIndex = index;
    const track = currentTrack();
    if (!track) return;

    updateNowPlaying(fromSelection ? 'Loading' : 'Selected');
    updatePlaylistSelection();
    if (fromSelection) setProgress(0);
    ensureYoutubePlayer(function () {
      setYoutubeVolume();
      if (fromSelection && typeof ytPlayer.loadVideoById === 'function') {
        ytPlayer.loadVideoById(track.youtubeId);
      } else if (typeof ytPlayer.playVideo === 'function') {
        ytPlayer.playVideo();
      }
      isYoutubePlaying = true;
      setAudioButton('\u23F8');
      updateNowPlaying('Playing');
      updatePlaybackChrome(true);
      startProgressTimer();
      updatePlaylistSelection();
      writeOutput('Playing YouTube: ' + track.title);
    });
  }

  function toggleYoutubePlayback() {
    if (isYoutubePlaying && ytPlayer && ytReady && typeof ytPlayer.pauseVideo === 'function') {
      ytPlayer.pauseVideo();
      isYoutubePlaying = false;
      setAudioButton('\u25B6');
      updateNowPlaying('Paused');
      updatePlaybackChrome(false);
      updateProgress();
      writeOutput('YouTube music paused.');
      return;
    }

    playYoutubeTrack(currentTrackIndex, false);
  }

  function searchGoogleQuery(rawText) {
    const q = rawText.trim();
    if (!q) return;
    navigate('Routing Google query: ' + q, 'https://www.google.com/search?q=' + encodeURIComponent(q));
  }

  function handleCommand(rawCommand) {
    const original = rawCommand.trim();
    const command = original.toLowerCase();
    if (!command) {
      writeOutput('No command received.');
      return;
    }

    if (command.endsWith('.com') || command.endsWith('.dev') || command.endsWith('.org')) {
      navigate('Opening external node: ' + command, 'https://' + command);
      return;
    }

    switch (command) {
      case 'y':
      case 'yt':
      case 'youtube':
        navigate('Navigating to youtube.com', 'https://www.youtube.com');
        break;
      case 'google':
        navigate('Navigating to google.com', 'https://www.google.com');
        break;
      case 'git':
      case 'github':
        navigate('Opening ZROV GitHub profile', 'https://github.com/zrov');
        break;
      case 'modrinth':
        navigate('Opening Modrinth profile', 'https://modrinth.com/user/zrov');
        break;
      case 'nexus':
        navigate('Opening Nexus Mods profile', 'https://www.nexusmods.com/profile/zrovihr/mods');
        break;
      case 'x':
      case 'twitter':
        navigate('Opening X profile', 'https://x.com/zrovihr');
        break;
      case 'gmail':
      case 'mail':
        navigate('Navigating to gmail.com', 'https://www.gmail.com');
        break;
      case 'jisho':
        navigate('Opening Jisho', 'https://jisho.org/');
        break;
      case 'htb':
      case 'hackthebox':
        navigate('Opening Hack The Box', 'https://hackthebox.com/');
        break;
      case 'time':
        writeOutput('Local node time: ' + (clock ? clock.textContent : new Date().toLocaleTimeString()));
        break;
      case 'hello':
      case 'hi':
        writeOutput('WELL HELL0 THERE..');
        break;
      case 'play':
      case 'audio':
      case 'music':
      case 'player':
      case 'playmusic':
        playYoutubeTrack(currentTrackIndex, false);
        break;
      case 'pause':
      case 'stop':
            if (ytPlayer && ytReady && typeof ytPlayer.pauseVideo === 'function') ytPlayer.pauseVideo();
            isYoutubePlaying = false;
            setAudioButton('\u25B6');
            updateNowPlaying('Paused');
            updatePlaybackChrome(false);
            updateProgress();
            writeOutput('YouTube music paused.');
            break;
      case 'playlist':
      case 'songs':
      case 'tracks':
        togglePlaylist();
        break;
      case 'shuffle':
        writeOutput('Shuffle is ' + (shuffleEnabled ? 'ON' : 'OFF') + '. Use "shuffle on" or "shuffle off".');
        break;
      case 'shuffle on':
        shuffleEnabled = true;
        persistShuffle();
        writeOutput('Shuffle enabled. Reload page or type "reshuffle" to randomize now.');
        break;
      case 'shuffle off':
        shuffleEnabled = false;
        persistShuffle();
        writeOutput('Shuffle disabled. Playlist plays in original order.');
        break;
      case 'reshuffle':
        if (shuffleEnabled && playlistTracks.length > 1) {
          shuffleArray(playlistTracks);
          currentTrackIndex = 0;
          renderPlaylist();
          playYoutubeTrack(0, true);
          writeOutput('Playlist reshuffled. Now playing: ' + currentTrack().title);
        } else if (!shuffleEnabled) {
          writeOutput('Shuffle is OFF. Enable it first with "shuffle on".');
        } else {
          writeOutput('Not enough tracks to shuffle.');
        }
        break;
      case 'lock':
        writeOutput('Session sealed. Local controls remain in watch mode.');
        break;
      default:
        if (original === repeatedCommand) {
          searchGoogleQuery(original);
          return;
        }
        repeatedCommand = original;
        writeOutput('Does not recognize: ' + original + '. Press enter again to submit as Google search.');
        break;
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
  loadPlaylist();
  if (playlistToggle) {
    playlistToggle.title = 'Playlist (shuffle: ' + (shuffleEnabled ? 'ON' : 'OFF') + ')';
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', function () {
      setYoutubeVolume();
    });
  }

  if (musicProgress) {
    musicProgress.addEventListener('click', function (event) {
      if (!ytPlayer || !ytReady ||
        typeof ytPlayer.getDuration !== 'function' ||
        typeof ytPlayer.seekTo !== 'function') return;

      const duration = ytPlayer.getDuration();
      if (!duration || duration <= 0) return;
      const rect = musicProgress.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      ytPlayer.seekTo(duration * ratio, true);
      setProgress(ratio * 100);
    });
  }

  if (audioToggle) {
    audioToggle.addEventListener('click', function () {
      toggleYoutubePlayback();
    });
  }

  if (playlistToggle) {
    playlistToggle.addEventListener('click', function () {
      togglePlaylist();
    });
  }

  document.addEventListener('click', function (event) {
    if (!playlistMenu || playlistMenu.hidden) return;
    if (playlistMenu.contains(event.target) || (playlistToggle && playlistToggle.contains(event.target))) return;
    setPlaylistOpen(false);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') setPlaylistOpen(false);
  });

  if (terminalForm) {
    terminalForm.addEventListener('submit', function (event) {
      event.preventDefault();
      handleCommand(commandInput ? commandInput.value : '');
    });
  }

  if (searchForm) {
    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const input = searchForm.elements.q;
      searchGoogleQuery(input ? input.value : '');
    });
  }

  if (lockSession) {
    lockSession.addEventListener('click', function () {
      handleCommand('lock');
    });
  }
})();
