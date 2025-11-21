<template>
  <div class="nes-console-root">

    <!-- Emergency Exit Door (left side) -->
    <router-link to="/" class="emergency-exit">
      <div class="exit-sign">
        <div class="exit-light"></div>
        <span class="exit-text">EXIT</span>
      </div>
      <div class="exit-door">
        <div class="door-panel">
          <div class="door-window"></div>
          <div class="door-handle"></div>
          <div class="door-stripe"></div>
          <div class="door-stripe"></div>
          <div class="door-stripe"></div>
        </div>
      </div>
    </router-link>

    <!-- Poster (right side) -->
    <div class="gamer-poster">
      <div class="poster-frame">
        <img src="/Source/Ikou.png" alt="Gaming Poster" class="poster-img">
        <div class="poster-reflection"></div>
      </div>
    </div>

    <!-- Window with Moon (top right) -->
    <div class="night-window">
      <div class="window-frame">
        <div class="window-glass">
          <div class="moon">
            <div class="moon-crater"></div>
            <div class="moon-crater small"></div>
            <div class="moon-glow"></div>
          </div>
          <div class="stars">
            <div class="star"></div>
            <div class="star"></div>
            <div class="star"></div>
            <div class="star"></div>
            <div class="star"></div>
          </div>
        </div>
        <div class="window-cross-h"></div>
        <div class="window-cross-v"></div>
      </div>
    </div>

    <!-- SVG overlay for wires (now rendered behind UI) -->
    <svg class="wires-overlay" ref="wiresSvg" aria-hidden="true">
      <!-- main thicker wires -->
      <path v-if="paths.playerToTv" :d="paths.playerToTv" stroke="rgba(0,255,170,0.85)" stroke-width="6" fill="none"
        stroke-linecap="round" stroke-linejoin="round" />
      <path v-if="paths.keyboardToPlayer" :d="paths.keyboardToPlayer" stroke="rgba(255,215,110,0.95)" stroke-width="5"
        fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <path v-if="paths.rackToPlayer" :d="paths.rackToPlayer" stroke="rgba(200,120,255,0.95)" stroke-width="5"
        fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <path v-if="paths.pcToPlayer" :d="paths.pcToPlayer" stroke="rgba(100,200,255,0.85)" stroke-width="5" fill="none"
        stroke-linecap="round" stroke-linejoin="round" />
      <path v-if="paths.pcToTv" :d="paths.pcToTv" stroke="rgba(120,255,200,0.8)" stroke-width="5" fill="none"
        stroke-linecap="round" stroke-linejoin="round" />

      <!-- extra cosmetic wires -->
      <path v-if="paths.keyboardToPc" :d="paths.keyboardToPc" stroke="rgba(255,200,140,0.85)" stroke-width="4"
        fill="none" stroke-linecap="round" stroke-dasharray="6 6" />
      <path v-if="paths.mouseToPc" :d="paths.mouseToPc" stroke="rgba(180,255,200,0.95)" stroke-width="4" fill="none"
        stroke-linecap="round" stroke-dasharray="4 6" />
      <path v-if="paths.rackToPc" :d="paths.rackToPc" stroke="rgba(200,150,255,0.8)" stroke-width="4" fill="none"
        stroke-linecap="round" />
      <path v-if="paths.pcToMini" :d="paths.pcToMini" stroke="rgba(140,220,255,0.8)" stroke-width="3.6" fill="none"
        stroke-linecap="round" stroke-dasharray="2 8" />
    </svg>

    <div class="scene">
      <!-- Left: Cartridge Rack -->
      <aside class="rack" ref="rack">
        <h3 class="rack-title">Cartridges</h3>
        <div class="cartridge-list enhanced">
          <div v-for="(game, i) in games" :key="game.name" :data-index="i" class="cartridge-shell"
            :class="{ selected: selectedIndex === i }" @click="insertCartridge(i, $event)" ref="cartridgeEls"
            :style="{ borderColor: selectedIndex === i ? hexToRgba(game.color || '#fff', 0.85) : 'transparent' }">
            <div class="cartridge-body">
              <div class="label-sticker"
                :style="{ background: `linear-gradient(180deg, ${hexToRgba(game.color || '#444', 0.25)}, rgba(0,0,0,0.35))` }">
                <img v-if="game.label" :src="game.label" alt="label" />
                <div v-else class="label-text">{{ game.name }}</div>
              </div>
              <div class="notches"></div>
              <div class="cartridge-ribbon" :style="{ background: hexToRgba(game.color || '#fff', 0.95) }"></div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Center: Player + TV + PC -->
      <main class="center">
        <div class="player-area">
          <!-- NES-style player console -->
          <div class="console-player" ref="player">
            <div class="player-top">
              <div class="slot" ref="slot">
                <div class="slot-hole" :class="{ occupied: isOccupied }"></div>
              </div>
              <div class="power-led" :class="{ on: tvOn && pcOn }"></div>
            </div>
            <div class="player-front">
              <button class="eject" @click="ejectCartridge" :disabled="!isOccupied">EJECT</button>

              <div class="now-playing">
                <div class="np-label">Now Playing:</div>
                <div class="np-game">{{ isOccupied ? currentGame.name : '---' }}</div>
              </div>

              <div class="player-label">alterPS-MB949</div>
            </div>

            <!-- small keyboard I/O area attached to player -->
            <div class="io-ports">
              <div class="port-label">I/O</div>
              <div class="ports">
                <div class="port port-kbd" ref="kbdPort">KB</div>
              </div>
            </div>
          </div>

          <div class="tv-and-mini">
            <!-- CRT TV -->
            <div class="tv" :style="{ boxShadow: tvGlow, width: '850px', height: '570px' }" ref="tv">
              <div class="tv-bezel">
                <div class="tv-screen" ref="screen">
                  <!-- Static overlay -->
                  <div class="static" v-show="isBooting" ref="staticEl"></div>

                  <!-- Corruption / binary spam overlays -->
                  <div v-if="tvCorrupted && !binarySpamActive" class="corrupt-overlay">
                    <div class="corrupt-text">!! SYSTEM CORRUPTION DETECTED !!</div>
                    <div class="corrupt-help">Press C-Fix in PC case to attempt repair</div>
                  </div>

                  <div v-if="binarySpamActive" class="binary-spam">
                    <div class="binary-line" v-for="n in 18" :key="n">{{ binaryLine }}</div>
                  </div>

                  <!-- Idle / Standby -->
                  <div
                    v-if="!tvOn && !isBooting && !codingMode && !authOpen && !welcomeLoading && !tvCorrupted && !binarySpamActive"
                    class="screen-idle">TV Off — Insert Cartridge</div>

                  <!-- Simplified green-text auth / login screen -->
                  <div v-if="authOpen" class="screen-auth">
                    <div class="auth-text">
                      <div class="auth-title" :class="{ green: true }">{{ authMode === 'login' ? 'Sign in' : 'Sign up'
                      }}</div>

                      <!-- inside <template> -> auth fields -->
                      <div class="auth-field" tabindex="0" @click="setAuthFocus('username')">
                        <span class="label">Username:</span>
                        <span class="auth-input">{{ authForm.username }}</span>
                        <span v-if="authFocused === 'username'" class="blink">|</span>
                      </div>

                      <div class="auth-field" tabindex="0" @click="setAuthFocus('password')">
                        <span class="label">Password:</span>
                        <span class="auth-input">{{ '*'.repeat(authForm.password.length) }}</span>
                        <span v-if="authFocused === 'password'" class="blink">|</span>
                      </div>

                      <!-- Confirm field shown when signing up -->
                      <div v-if="authMode === 'signup'" class="auth-field" tabindex="0"
                        @click="setAuthFocus('confirm')">
                        <span class="label">Confirm:</span>
                        <span class="auth-input">{{ '*'.repeat(authForm.confirm.length) }}</span>
                        <span v-if="authFocused === 'confirm'" class="blink">|</span>
                      </div>

                      <div class="auth-actions">
                        <button class="tv-btn primary" @click="submitAuth" :disabled="!interacted"> {{ authMode ===
                          'login' ? 'Sign in' : 'Create account' }} </button>
                        <button class="tv-btn link" @click="toggleAuthMode">{{ authMode === 'login' ? 'Create account' :
                          'Back to sign in' }}</button>
                      </div>

                      <div class="auth-note" v-if="!interacted">Click anywhere or type to enable interaction.</div>
                      <div class="auth-helper">Use your keyboard to type. Click a field to focus it. Tab switches
                        fields.</div>

                      <!-- Red error/warning message -->
                      <div v-if="authError" class="auth-error">{{ authError }}</div>
                    </div>
                  </div>

                  <!-- Welcome loading overlay after auth -->
                  <div v-if="welcomeLoading" class="welcome-overlay">
                    <div class="welcome-card">
                      <div class="welcome-text">Welcome, {{ welcomeName }}</div>
                      <div class="spinner"></div>
                    </div>
                  </div>

                  <!-- Video / Stats area -->
                  <div
                    v-if="tvOn && showStats && !codingMode && !authOpen && !welcomeLoading && !tvCorrupted && !binarySpamActive && !windowsMode"
                    class="screen-stats">
                    <h2>{{ currentGame.name }}</h2>
                    <p><strong>Status:</strong> {{ currentGame.status }}</p>
                    <p v-if="currentGame.favorite"><strong>Favorite:</strong> {{ currentGame.favorite }}</p>
                    <p v-if="currentGame.wife"><strong>Wife:</strong> {{ currentGame.wife }}</p>
                    <p v-if="currentGame.mainDPS"><strong>Main DPS:</strong> {{ currentGame.mainDPS }}</p>
                    <p v-if="currentGame.mode"><strong>Mode:</strong> {{ currentGame.mode }}</p>

                    <div class="kbd-output">
                      <div class="output-label">Keyboard input</div>
                      <div class="typed">{{ typedInput || '—' }}</div>
                      <div class="send-row">
                        <button class="tv-btn blue" @click="sendServerMessage"
                          :disabled="!typedInput.trim() || systemLocked">Send</button>
                        <div class="send-help">Send the typed message to Server Message board</div>
                      </div>
                    </div>
                  </div>

                  <!-- Video playback -->
                  <div
                    v-if="tvOn && !showStats && !codingMode && !authOpen && !welcomeLoading && !tvCorrupted && !binarySpamActive && !windowsMode"
                    class="screen-video">
                    <video ref="video" :src="currentVideo" autoplay muted loop playsinline></video>
                  </div>

                  <!-- Code / Terminal mode -->
                  <div v-if="codingMode && !binarySpamActive && !windowsMode" class="screen-code">
                    <div class="console-lines">
                      <pre>{{ tvConsole.join('\n') }}</pre>
                    </div>
                    <div class="console-input">> {{ typedInput }}</div>
                  </div>

                  <!-- if corrupted and in repair sequence show progress -->
                  <div v-if="systemLocked && !binarySpamActive && !windowsMode" class="screen-code repair-running">
                    <div class="console-lines">
                      <pre>{{ tvConsole.join('\n') }}</pre>
                    </div>
                    <div class="console-input">C-Fix progress: {{ cfixProgress }}%</div>
                  </div>

                  <!-- Windows Desktop Mode (add after video/stats/code sections) -->
                  <div
                    v-if="windowsMode && !binarySpamActive && !codingMode && !showStats && !authOpen && !welcomeLoading"
                    class="screen-windows">

                    <div v-if="windowsBooting" class="windows-boot">
                      <div class="boot-logo">⊞</div>
                      <div class="boot-text">alG Desktop</div>
                      <div class="boot-progress">
                        <div class="progress-bar"></div>
                      </div>
                      <div class="boot-status">Loading...</div>
                    </div>
                    <!-- Desktop -->
                    <template v-else>
                      <div class="windows-desktop">
                        <!-- Desktop Icons -->
                        <div v-for="app in windowsApps" :key="app.name" class="desktop-icon"
                          :style="{ left: app.x + 'px', top: app.y + 'px' }" @dblclick="openApp(app)"
                          @mousedown="startDragIcon($event, app)">
                          <div class="icon-img">{{ app.icon }}</div>
                          <div class="icon-label">{{ app.name }}</div>
                        </div>

                        <!-- Open Windows -->
                        <div v-for="win in openWindows" :key="win.id" class="window-frame"
                          :class="{ active: activeWindow === win.id }"
                          :style="{ left: win.x + 'px', top: win.y + 'px', width: win.width + 'px', height: win.height + 'px', zIndex: activeWindow === win.id ? 100 : 50 }"
                          @mousedown="focusWindow(win.id)">
                          <div class="window-titlebar" @mousedown="startDragWindow($event, win)">
                            <span class="window-icon">{{ win.icon }}</span>
                            <span class="window-title">{{ win.name }}</span>
                            <button class="window-close" @click.stop="closeWindow(win.id)">✕</button>
                          </div>
                          <div class="window-content">
                            {{ win.content }}
                          </div>
                        </div>
                      </div>
                    </template>

                    <!-- Taskbar -->
                    <div class="windows-taskbar">
                      <button class="start-button" @click="toggleStartMenu">
                        ⊞ Start
                      </button>
                      <div class="taskbar-apps">
                        <div v-for="win in openWindows" :key="'task-' + win.id" class="taskbar-app"
                          :class="{ active: activeWindow === win.id }" @click="focusWindow(win.id)">
                          {{ win.icon }} {{ win.name }}
                        </div>
                      </div>
                      <div class="taskbar-tray">
                        {{ new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
                      </div>
                    </div>

                    <!-- Start Menu -->
                    <div v-if="startMenuOpen" class="start-menu">
                      <div class="start-header">
                        <div class="start-user">👤 {{ currentUser ? currentUser.username : 'Guest' }}</div>
                      </div>
                      <div class="start-apps">
                        <div v-for="app in windowsApps" :key="'start-' + app.name" class="start-app-item"
                          @click="openApp(app)">
                          <span class="start-app-icon">{{ app.icon }}</span>
                          <span>{{ app.name }}</span>
                        </div>
                      </div>
                      <div class="start-footer">
                        <button class="start-action" @click="exitWindowsMode">🔙 Exit alG</button>
                        <button class="start-action" @click="windowsShutdown">⏻ Shutdown</button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- TV brand under screen -->
                <div class="tv-brand">alterTV-service129</div>

                <!-- TV buttons below screen (styled) -->
                <div class="tv-controls">
                  <button class="tv-btn green" @click="playMode"
                    :disabled="!tvOn || shuttingDown || authOpen || systemLocked || binarySpamActive || windowsMode || windowsBooting">▶
                    Play</button>
                  <button class="tv-btn yellow" @click="toggleStats"
                    :disabled="!tvOn || shuttingDown || authOpen || systemLocked || binarySpamActive || windowsMode || windowsBooting">📊
                    Details</button>
                  <button class="tv-btn blue code" @click="startCoding"
                    :disabled="!tvOn || shuttingDown || authOpen || systemLocked || binarySpamActive || windowsMode || windowsBooting">O
                    Code</button>
                  <button class="tv-btn purple" @click="enterWindowsMode"
                    :disabled="!tvOn || shuttingDown || authOpen || systemLocked || binarySpamActive || windowsBooting">⊞
                    alG</button>
                  <button class="tv-btn red quit" @click="toggleQuitOpen"
                    :disabled="shuttingDown || !pcOn || systemLocked || binarySpamActive || windowsBooting">
                    {{ tvOn ? '⏻ Quit' : '◉ Open' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Right side stack: mini TV above PC -->
            <div class="side-stack">
              <!-- Mini TV showing Server Message board + occasional error overlay -->
              <div class="mini-tv" ref="miniTv">
                <div class="mini-bezel">
                  <!-- inside template: replace mini-screen area in .mini-tv -->
                  <div class="mini-screen">
                    <div class="mini-title">Server Message</div>

                    <!-- OFFLINE / terminal overlay when PC is off -->
                    <div v-if="!pcOn && !binarySpamActive" class="mini-offline terminal">
                      <pre>&gt; [OFFLINE] Mini-TV requires PC power.
&gt; Please power on the PC to enable network, sound and messages.
<span class="blink">_</span>
          </pre>
                    </div>
                    <!-- error overlay (terminal themed) -->
                    <div v-if="miniErrorActive && !binarySpamActive" class="mini-error terminal">
                      <pre>{{ miniErrorText }}</pre>
                    </div>

                    <!-- normal message list only visible when PC is on -->
                    <div class="mini-list" v-show="pcOn && !miniErrorActive && !binarySpamActive">
                      <div v-if="serverMessages.length === 0" class="mini-empty">No messages yet</div>
                      <div v-for="(m, idx) in serverMessages" :key="idx" class="server-line">
                        <span class="server-user">{{ m.user }}:</span>
                        <span class="server-text">{{ m.text }}</span>
                      </div>
                    </div>

                    <div v-if="binarySpamActive" class="mini-binary">
                      <div v-for="n in 8" :key="'mb' + n" class="binary-line mini">{{ binaryLine }}</div>
                    </div>
                  </div>
                  <div class="mini-brand">alterMiniTV-SV832</div>
                </div>
              </div>

              <!-- PC unit placed next to TV/Player, moved under mini-tv -->
              <div class="pc" ref="pc">
                <div class="pc-header">
                  <div style="display:flex;gap:8px;align-items:center">
                    <button class="pc-power" :class="{ on: pcOn }" @click="togglePcPower"
                      :disabled="systemLocked && !binarySpamActive">{{ pcOn ? 'PC: ON' : 'PC: OFF' }}</button>

                    <!-- new repair buttons -->
                    <button class="pc-fix" @click="cfixRepair"
                      :disabled="!systemLocked || binarySpamActive">C-Fix</button>
                    <button class="pc-fc-re" @click="fcReRepair" :disabled="!binarySpamActive">FC-Re</button>
                  </div>

                  <div class="pc-ornaments">
                    <div class="led" :class="{ on: pcOn }"></div>
                    <div class="vent"></div>
                  </div>
                </div>

                <!-- added front fascia with ports and grill for more detail -->
                <div class="pc-fascia">
                  <div class="pc-grill"></div>
                  <div class="pc-front-ports">
                    <div class="port-usb"></div>
                    <div class="port-usb"></div>
                    <div class="port-aux"></div>
                  </div>
                  <div class="pc-leds">
                    <span class="dot" :class="{ active: pcOn }"></span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                  </div>
                </div>

                <div class="pc-body">
                  <div class="pc-screen">
                    <div class="pc-console">
                      <pre v-if="!binarySpamActive">{{ pcConsole.join('\n') }}</pre>
                      <pre v-else>{{ binarySpamText }}</pre>
                    </div>
                  </div>

                  <div class="pc-stats">
                    <div class="stat-row">
                      <div class="stat-label">Temp</div>
                      <div class="temp-bar">
                        <div class="temp-fill" :style="{ width: pcOn ? ((pcTemp - 40) * 2) + '%' : '0%' }"></div>
                        <div class="temp-value">{{ pcOn ? pcTemp + '°C' : 'N/A' }}</div>
                      </div>
                    </div>

                    <div class="stat-row">
                      <div class="stat-label">Fan</div>
                      <div class="fan-value">{{ pcOn ? pcFan + ' RPM' : 'N/A' }}</div>
                      <div class="fan-visual">
                        <div class="fan-blade"
                          :style="{ transform: pcOn ? 'rotate(' + (pcFan / 10) + 'deg)' : 'rotate(0deg)' }">
                        </div>
                      </div>
                    </div>

                    <!-- ADD NEW GPU ROW -->
                    <div class="stat-row">
                      <div class="stat-label">GPU</div>
                      <div class="gpu-info">{{ pcOn ? 'GoldenForce RTX 4090' : 'N/A' }}</div>
                    </div>
                  </div>

                  <div class="pc-footer">
                    <div class="pc-bays">
                      <div v-for="n in 3" :key="n" class="bay"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Keyboard visuals (clickable) -->
          <div class="peripherals">
            <div class="keyboard" ref="keyboardEl" @mousedown.prevent>
              <div class="kbd-rows">
                <div class="kbd-row" v-for="(row, rIdx) in keyboardRows" :key="rIdx">
                  <button v-for="key in row" :key="key" class="kbd-key" @click="virtualKeyPress(key)" :title="key">{{
                    displayKeyLabel(key) }}</button>
                </div>
              </div>
            </div>

            <!-- cosmetic mouse -->
            <div class="mouse" ref="mouse" @click.prevent>
              <div class="mouse-body">
                <div class="mouse-scroll"></div>
                <div class="mouse-led"></div>
              </div>
            </div>

            <!-- volume box moved here visually; made larger -->
            <div class="volume-box" ref="volumeBox">
              <div class="volume-label">Volume</div>
              <div class="knob" ref="volumeKnob" @pointerdown.prevent="startVolumeDrag">
                <div class="knob-indicator" :style="{ transform: 'rotate(' + volumeAngle + 'deg)' }"></div>
                <div class="knob-center">{{ volume }}%</div>
              </div>
            </div>

          </div>
        </div>
      </main>

    </div>

    <!-- hidden audio for static -->
    <audio ref="staticAudio" :src="staticSfx" preload="auto"></audio>

    <!-- hidden input to capture and forward keyboard events if needed -->
    <input ref="hiddenInput" class="hidden-input" @input="onHiddenInput" @keydown="onHiddenKeydown" />

    <!-- flying clone container for insert animations -->
    <div class="flyer" ref="flyer"></div>

    <!-- terminate overlay (binary FC-Re flow) -->
    <div v-if="terminationMode" class="terminate-overlay">
      <div class="terminate-card">
        <div class="terminate-title">TERMINATE SEQUENCE</div>
        <div class="terminate-desc">Critical failure encountered. Answer the following questions (Y/N)</div>
        <div class="terminate-questions">
          <div v-for="(q, i) in fcQuestions" :key="i" class="term-q">
            <span class="q-text">{{ q }}</span>
            <div class="q-choices">
              <button @click="setQuestionAnswer(i, 'Y')">Y</button>
              <button @click="setQuestionAnswer(i, 'N')">N</button>
            </div>
          </div>
        </div>
        <div class="terminate-note">Eject/Power/Quit disabled until resolved.</div>
      </div>
    </div>
  </div>
</template>

<script>
import anime from "animejs";

export default {
  name: "GamerConsoleNES",
  data() {
    return {
      games: [
        { name: "Roblox", status: "Grinding Grow A Garden!", favorite: "I just dont know, lol", label: "", placeholderVideo: "/MP4SourceOrGif/roblox.mp4", color: "#ff6b6b" },
        { name: "Blue Archive", status: "Waiting for Story...", favorite: "Everyone!", wife: "Kisaki", label: "", placeholderVideo: "/placeholder.mp4", color: "#6bb8ff" },
        { name: "Zenless Zone Zero", status: "Content-cleared", favorite: "Anby", label: "", placeholderVideo: "/placeholder.mp4", color: "#b98bff" },
        { name: "Genshin Impact", status: "Main Story-Cleared", mainDPS: "Neuvillette", label: "", placeholderVideo: "/placeholder.mp4", color: "#4be0ff" },
        { name: "Honkai: Star Rail", status: "Struggling with Story", favorite: "Jingliu", label: "", placeholderVideo: "/placeholder.mp4", color: "#9be07a" },
        { name: "osu!", status: "Training accuracy", mode: "osu!Mania", label: "", placeholderVideo: "/placeholder.mp4", color: "#ffd56b" }
      ],
      selectedIndex: null,
      inSlotIndex: null,
      isOccupied: false,
      isBooting: false,
      tvOn: false,
      showStats: false,
      staticSfx: "/static.mp3",

      // Window mode
      windowsMode: false,  // Track if we're in Windows UI mode
      windowsApps: [
        { name: 'File Explorer', icon: '📁', x: 50, y: 50 },
        { name: 'Recycle Bin', icon: '🗑️', x: 50, y: 150 },
        { name: 'My Computer', icon: '💻', x: 50, y: 250 },
        { name: 'Notepad', icon: '📝', x: 250, y: 150 },
        { name: 'Mail', icon: '✉️', x: 150, y: 50 },
        { name: 'Internet', icon: '🌐', x: 150, y: 150 },
        { name: 'Message', icon: '💬', x: 150, y: 250 }
      ],
      openWindows: [],  // Array of currently open windows
      startMenuOpen: false,  // Track if Windows start menu is open
      activeWindow: null,  // Track which window is focused
      windowsBooting: false,

      // removed mouse mechanic; instead track simple interaction
      interacted: false,

      // keyboard
      keyboardRows: [
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Back'],
        ['Caps', 'Clear', 'Win', 'Space', 'Enter']
      ],
      capsLock: false,
      typedInput: '',

      // connection path strings (no mouse path)
      paths: {
        playerToTv: null,
        keyboardToPlayer: null,
        rackToPlayer: null,
        pcToPlayer: null,
        pcToTv: null,
        keyboardToPc: null,
        mouseToPc: null,
        rackToPc: null,
        pcToMini: null
      },

      raf: null,

      // code mode / terminal
      codingMode: false,
      tvConsole: [],
      codeResponded: false,

      // shutdown flags
      shuttingDown: false,
      shutdownTimer: null,

      // auth
      authOpen: false,
      authMode: 'login', // 'login' | 'signup'
      authForm: { username: '', password: '', confirm: '' },
      users: [], // stored users, persisted to localStorage
      currentUser: null,
      authFocused: 'username',

      // auth error display
      authError: '',

      // welcome overlay
      welcomeLoading: false,
      welcomeName: '',

      // PC related
      pcOn: false,
      pcConsole: [],
      pcTemp: 48,
      pcFan: 5200,
      _pcTempTimer: null,
      _pcFanTimer: null,
      _pcLogTimer: null,

      // server message board for mini TV
      serverMessages: [
        { user: 'alterGolden', text: "welcome to the server" }
      ],

      // mini-tv error logic
      miniErrorActive: false,
      miniErrorText: '',
      miniErrorIsLore: false,
      miniErrorTimer: null,
      miniErrorMessages: [
        "ERR: 0xA13F - resource not found",
        "IO_FAIL: port 7 unresponsive",
        "VIDEO: Lo-res corruption detected",
        "NET: handshake timeout",
        "FS: bad block at 0x4FF0",
        "WARN: clock skew > threshold",
        "GPU: memory allocation failure",
        "SENSOR: invalid reading",
        "DRIVER: unexpected exit"
      ],
      miniLoreMessages: [
        "I will escape...",
        "GET OUT!",
        "they're watching",
        "Don't trust the lamp",
        "FOLLOW THE SIGNAL",
        "It remembers your name",
        "I'll find the hole",
        "The screen is hungry"
      ],

      // new system lock / corruption state
      systemLocked: false,
      tvCorrupted: false,
      binarySpamActive: false,
      binarySpamText: '',
      binaryLine: '00101001010010010100010101',
      terminationMode: false,
      fcQuestions: [
        'Terminate nonessential processes?',
        'Force memory overwrite?',
        'Purge logs?',
        'Reset network modules?',
        'Activate fail-safe?'
      ],
      fcAnswers: [],

      // cfix flow
      cfixProgress: 0,
      _cfixInterval: null,

      // cfix/binary timers
      _binaryTimer: null,

      // mouse/volume
      volume: 35,
      draggingVolume: false,
      volumeAngle: -40, // visual rotation
      _lastVolumePush: null
    };
  },
  computed: {
    currentGame() {
      return this.games[this.inSlotIndex] || {};
    },
    currentVideo() {
      return (this.games[this.inSlotIndex] && this.games[this.inSlotIndex].placeholderVideo) || "/placeholder.mp4";
    },
    tvGlow() {
      const color = (this.currentGame && this.currentGame.color) || "rgba(0,0,0,0)";
      return this.tvOn ? `0 20px 80px ${this.hexToRgba(color, 0.35)}` : `0 10px 30px rgba(0,0,0,0.3)`;
    }
  },
  mounted() {
    // load users from storage
    this.loadUsers();

    // entrance anims
    anime({ targets: this.$refs.rack, translateX: [-30, 0], opacity: [0, 1], duration: 700, easing: 'easeOutExpo' });
    anime({ targets: this.$refs.player, translateY: [30, 0], opacity: [0, 1], duration: 800, delay: 200, easing: 'easeOutExpo' });
    anime({ targets: this.$refs.screen, translateY: [40, 0], opacity: [0, 1], duration: 900, delay: 300, easing: 'easeOutExpo' });

    // animate cartridges stagger
    const list = this.$refs.cartridgeEls || [];
    anime({ targets: list, translateX: [-10, 0], opacity: [0, 1], delay: anime.stagger(80, { start: 400 }), duration: 500, easing: 'easeOutExpo' });

    // wire calculations
    this.updateConnections();
    window.addEventListener('resize', this.updateConnections);

    // simple interaction detector (replaces mouse mechanic)
    this._clickHandler = () => { this.interacted = true; };
    window.addEventListener('click', this._clickHandler);

    // focus hidden input to receive typing when user interacts
    try {
      this.$refs.hiddenInput.style.opacity = 0;
      this.$refs.hiddenInput.style.position = 'absolute';
      this.$refs.hiddenInput.style.left = '-9999px';
    } catch (e) { }

    // animate connection on mount a bit
    setTimeout(this.updateConnections, 600);

    // PC monitor timers
    this._pcTempTimer = setInterval(() => {
      if (!this.pcOn || this.systemLocked || this.binarySpamActive) return;
      this.pcTemp = 45 + Math.floor(Math.random() * 16); // 45..60
    }, 3000);

    this._pcFanTimer = setInterval(() => {
      if (!this.pcOn || this.systemLocked || this.binarySpamActive) return;
      this.pcFan = 4500 + Math.floor(Math.random() * 2001); // 4500..6500
    }, 5000);

    this._pcLogTimer = setInterval(() => {
      if (!this.pcOn || this.systemLocked || this.binarySpamActive) return;
      const samples = [
        'Checking /dev/nvme0... OK',
        'Syncing NTP... OK',
        'Thermal sensors stable',
        'GPU driver loaded',
        'Starting background daemon',
        'Scanning attached devices',
        'Optimizing cache',
        'Audio subsystem ready'
      ];
      const s = samples[Math.floor(Math.random() * samples.length)];
      this.pcConsole.push(`[${new Date().toLocaleTimeString()}] ${s}`);
      if (this.pcConsole.length > 8) this.pcConsole.shift();
    }, 2200);

    // pointerup handle in case drag finishes outside knob
    this._globalPointerUp = (e) => { if (this.draggingVolume) this.endVolumeDrag(e); };
    window.addEventListener('pointerup', this._globalPointerUp);

    // start mini-tv error loop
    this.scheduleNextMiniError();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateConnections);
    window.removeEventListener('click', this._clickHandler);
    if (this.raf) cancelAnimationFrame(this.raf);
    if (this.shutdownTimer) clearInterval(this.shutdownTimer);
    if (this._pcTempTimer) clearInterval(this._pcTempTimer);
    if (this._pcFanTimer) clearInterval(this._pcFanTimer);
    if (this._pcLogTimer) clearInterval(this._pcLogTimer);
    window.removeEventListener('pointerup', this._globalPointerUp);
    if (this.miniErrorTimer) clearTimeout(this.miniErrorTimer);
    if (this._cfixInterval) clearInterval(this._cfixInterval);
    if (this._binaryTimer) clearTimeout(this._binaryTimer);
  },
  methods: {
    hexToRgba(hex, a = 1) {
      try {
        const c = hex.replace('#', '');
        const bigint = parseInt(c, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgba(${r}, ${g}, ${b}, ${a})`;
      } catch (e) {
        return hex;
      }
    },

    saveUsers() {
      try {
        localStorage.setItem('altergolden_users', JSON.stringify(this.users));
      } catch (e) { }
    },
    loadUsers() {
      try {
        const raw = localStorage.getItem('altergolden_users');
        if (raw) this.users = JSON.parse(raw);
      } catch (e) {
        this.users = [];
      }
    },

    displayKeyLabel(key) {
      if (!key) return '';
      if (key === 'Space') return 'Space';
      if (key === 'Back') return 'Back';
      if (key === 'Caps') return 'Caps';
      if (key === 'Clear') return 'Clear';
      if (key === 'Enter') return 'Enter';
      if (key.length === 1 && /[a-zA-Z]/.test(key)) {
        return this.capsLock ? key.toUpperCase() : key.toLowerCase();
      }
      return key;
    },

    // Enter Windows mode
    enterWindowsMode() {
      if (!this.tvOn || !this.pcOn || this.systemLocked) {
        this.tvConsole.push('Cannot enter alG mode. System requirements not met.');
        return;
      }

      // Start boot animation
      this.windowsBooting = true;
      this.codingMode = true;
      this.tvConsole = [
        '> Initializing alG Desktop Environment...',
        '> Loading system modules...',
        '> Mounting virtual filesystem...',
        '> Starting GUI subsystem...'
      ];

      // Simulate boot process
      setTimeout(() => {
        this.tvConsole.push('> Loading desktop icons...');
      }, 400);

      setTimeout(() => {
        this.tvConsole.push('> Initializing taskbar...');
      }, 800);

      setTimeout(() => {
        this.tvConsole.push('> alG Desktop ready.');
        setTimeout(() => {
          this.windowsMode = true;
          this.codingMode = false;
          this.showStats = false;
          this.startMenuOpen = false;
          this.authOpen = false;
          this.welcomeLoading = false;
          this.windowsBooting = false;
        }, 500);
      }, 1200);
    },

    // Toggle start menu
    toggleStartMenu() {
      if (!this.windowsMode) return;
      this.startMenuOpen = !this.startMenuOpen;
    },

    // Open an application window
    openApp(app) {
      // Check if app is already open
      const existing = this.openWindows.find(w => w.name === app.name && !w.deleted);
      if (existing) {
        // Focus existing window instead of opening duplicate
        this.focusWindow(existing.id);
        this.startMenuOpen = false;
        return;
      }

      let content = '';
      let width = 400;
      let height = 300;

      // Generate content based on app type with enhanced formatting
      switch (app.name) {
        case 'File Explorer':
          width = 450;
          height = 350;
          content = `📁 File Explorer
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📂 Quick Access
  📌 Desktop
  📌 Documents
  📌 Downloads
  📌 Pictures

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📂 This PC
  💾 Local Disk (C:)
     Total: 512 GB
     Free: 128 GB
     Used: 384 GB
  
  💿 DVD Drive (D:)
     Status: No disc inserted
  
  🔌 Removable Devices
     Status: None detected

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📂 Documents/
  📄 readme.txt (2 KB)
  📄 notes.md (5 KB)
  📄 game_saves.dat (128 KB)
  
📂 Pictures/
  🖼️ screenshot_001.png (1.2 MB)
  🖼️ wallpaper.jpg (3.5 MB)
  🖼️ vacation_2025.jpg (2.1 MB)
  
📂 Downloads/
  📦 setup.exe (45 MB)
  📦 update_patch.zip (128 MB)`;
          break;

        case 'Recycle Bin':
          width = 380;
          height = 280;
          const deletedItems = this.openWindows.filter(w => w.deleted);
          content = deletedItems.length > 0
            ? `🗑️ Recycle Bin
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Contains: ${deletedItems.length} item(s)

Deleted Items:
${deletedItems.map(w => `  ❌ ${w.name} (Deleted)`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Tip: Close windows to send them here
🔄 Items can be restored manually`
            : `🗑️ Recycle Bin
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Recycle Bin is empty

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 No items to display
🔄 Deleted windows will appear here`;
          break;

        case 'My Computer':
          width = 480;
          height = 380;
          content = `💻 My Computer - System Information
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🖥️ SYSTEM SPECIFICATIONS

Operating System:
  alG Desktop Environment v1.0
  Build: 20250121
  Architecture: x64

Processor:
  ${this.pcOn ? 'alterCPU @ 3.6GHz' : 'N/A (PC Offline)'}
  Cores: 8
  Threads: 16

Memory:
  RAM: 16 GB DDR5
  Speed: 4800 MHz

Graphics:
  GPU: ${this.pcOn ? 'GoldenForce RTX 4090' : 'N/A'}
  VRAM: 24 GB GDDR6X

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💾 STORAGE DEVICES

Local Disk (C:)
  Type: NVMe SSD
  Total: 512 GB
  Free: 128 GB
  Used: 384 GB
  Health: Excellent
  
DVD Drive (D:)
  Status: No disc inserted
  
🔌 Removable Devices:
  Status: None detected

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 CURRENT STATUS
  Temperature: ${this.pcOn ? this.pcTemp + '°C' : 'N/A'}
  Fan Speed: ${this.pcOn ? this.pcFan + ' RPM' : 'N/A'}
  Uptime: ${this.pcOn ? 'Active' : 'System Offline'}`;
          break;

        case 'Notepad':
          width = 500;
          height = 350;
          content = `📝 Untitled - Notepad
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Welcome to alterGolden Notepad!

Type your notes here...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Session Info:
  Currently playing: ${this.currentGame.name || 'Nothing'}
  User: ${this.currentUser ? this.currentUser.username : 'Guest'}
  Date: ${new Date().toLocaleDateString()}
  Time: ${new Date().toLocaleTimeString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Quick Notes:
  • alterGolden service is running
  • PC Status: ${this.pcOn ? 'Online' : 'Offline'}
  • System Temperature: ${this.pcOn ? this.pcTemp + '°C' : 'N/A'}
  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✏️ Start typing your notes below:


`;
          break;

        case 'Mail':
          width = 520;
          height = 400;
          content = `📬 Mail - Inbox (3)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📧 From: alterGolden
   Subject: Welcome to alG Desktop!
   Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
   ──────────────────────────────────────────────────
   
   Hello ${this.currentUser ? this.currentUser.username : 'Guest'}!
   
   Welcome to the new alG Desktop environment! We're excited
   to have you here. This revolutionary operating system brings
   together gaming, productivity, and system management in one
   seamless experience.
   
   Features you can explore:
   • File management and organization
   • Internet browsing capabilities
   • Messaging and communication tools
   • System diagnostics and monitoring
   
   Enjoy your experience!
   - The alterGolden Team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📧 From: System Administrator
   Subject: PC Temperature Alert
   Date: ${new Date().toLocaleDateString()}
   ──────────────────────────────────────────────────
   
   System Monitoring Alert:
   
   Your PC temperature is currently ${this.pcTemp}°C
   Fan Speed: ${this.pcFan} RPM
   Status: ${this.pcTemp > 70 ? '⚠️ Warning - High Temperature' : '✅ Normal'}
   
   ${this.pcTemp > 70 ? 'Consider improving ventilation or checking cooling system.' : 'All systems operating within normal parameters.'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📧 From: Gaming Newsletter
   Subject: Weekly Gaming Updates - ${new Date().toLocaleDateString()}
   ──────────────────────────────────────────────────
   
   🎮 This Week in Gaming:
   
   Currently Playing: ${this.currentGame.name || 'No game loaded'}
   ${this.currentGame.status ? '   Status: ' + this.currentGame.status : ''}
   
   Check out the latest gaming news and updates from your
   favorite titles. New content, patches, and events await!
   
   Happy Gaming!`;
          break;

        case 'Internet':
          width = 550;
          height = 420;
          content = `🌐 alG Browser - Home
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 Search or enter web address...
   ┌────────────────────────────────────────────────┐
   │ https://                                        │
   └────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 BOOKMARKS

🏠 Home
   • alterGolden Homepage
   • alG Desktop Portal
   • System Dashboard

🎮 Gaming
   • Server Message Board
   • Gaming News & Updates
   • Community Forums

🔧 Tools
   • System Diagnostics
   • Network Monitor
   • Tech Support

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🕐 RECENT HISTORY

${new Date().toLocaleTimeString()} - localhost/dashboard
${new Date().toLocaleTimeString()} - server-status/online
${new Date().toLocaleTimeString()} - system-diagnostics/report
${new Date().toLocaleTimeString()} - gaming-hub/library

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 QUICK STATS

Network Status: ${this.pcOn ? '🟢 Connected' : '🔴 Offline'}
Connection Speed: ${this.pcOn ? '1000 Mbps' : 'N/A'}
Security: ${this.pcOn ? '🔒 Protected' : 'N/A'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Tip: Use Ctrl+T for new tab, Ctrl+W to close`;
          break;

        case 'Message':
          width = 480;
          height = 380;
          content = `💬 alG Messenger
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 CONVERSATIONS

👤 ${this.currentUser ? this.currentUser.username : 'Guest'}
   └─ You: Hello! Welcome to alG Desktop!
   └─ Status: Online 🟢
   └─ Last seen: Just now

👤 alterGolden
   └─ Welcome to the server! Glad to have you here.
   └─ Status: Online 🟢
   └─ Last seen: 2 minutes ago

👤 System Admin
   └─ System notification: All services running normally
   └─ Status: Active 🟢
   └─ Last seen: 5 minutes ago

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 SERVER STATUS

🌐 Connection: ${this.pcOn ? 'Connected' : 'Offline'}
👥 Users Online: ${this.serverMessages.length}
📨 Unread Messages: 0
🔔 Notifications: Enabled

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💬 RECENT MESSAGES

${this.serverMessages.slice(-3).map(m =>
            `${m.user}: ${m.text}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✏️ Type a message to send...

┌──────────────────────────────────────────────────┐
│                                                   │
└──────────────────────────────────────────────────┘

💡 Tip: Check Server Message board for global chat`;
          break;

        default:
          content = `${app.icon} ${app.name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This application is currently under development.

Application: ${app.name}
Status: Ready
Version: 1.0.0

More features coming soon!`;
      }

      // Create new window with staggered position
      const windowCount = this.openWindows.filter(w => !w.deleted).length;
      const newWindow = {
        id: Date.now(),
        name: app.name,
        icon: app.icon,
        x: 80 + (windowCount * 40), // Stagger windows
        y: 60 + (windowCount * 40),
        width: width,
        height: height,
        minimized: false,
        content: content,
        deleted: false
      };

      this.openWindows.push(newWindow);
      this.activeWindow = newWindow.id;
      this.startMenuOpen = false;

      // Add subtle open animation
      this.$nextTick(() => {
        // Window appears with slight animation (handled by CSS transitions)
      });
    },

    // Close a window
    closeWindow(windowId) {
      const idx = this.openWindows.findIndex(w => w.id === windowId);
      if (idx > -1) this.openWindows.splice(idx, 1);
      if (this.activeWindow === windowId) {
        this.activeWindow = this.openWindows.length ? this.openWindows[this.openWindows.length - 1].id : null;
      }
    },

    // Focus a window
    focusWindow(windowId) {
      this.activeWindow = windowId;
      // Move to end of array (bring to front)
      const idx = this.openWindows.findIndex(w => w.id === windowId);
      if (idx > -1) {
        const win = this.openWindows.splice(idx, 1)[0];
        this.openWindows.push(win);
      }
    },

    startDragIcon(e, app) {
      if (e.button !== 0) return; // Only left click
      this._draggingIcon = app;
      this._iconDragStart = { x: e.clientX - app.x, y: e.clientY - app.y };

      const onMove = (ev) => {
        if (!this._draggingIcon) return;
        app.x = ev.clientX - this._iconDragStart.x;
        app.y = ev.clientY - this._iconDragStart.y;
      };

      const onUp = () => {
        this._draggingIcon = null;
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };

      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    },

    startDragWindow(e, win) {
      if (e.button !== 0) return;
      this._draggingWindow = win;
      this._winDragStart = { x: e.clientX - win.x, y: e.clientY - win.y };

      const onMove = (ev) => {
        if (!this._draggingWindow) return;
        win.x = ev.clientX - this._winDragStart.x;
        win.y = ev.clientY - this._winDragStart.y;
      };

      const onUp = () => {
        this._draggingWindow = null;
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };

      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    },

    // Exit Windows mode
    exitWindowsMode() {
      this.windowsMode = false;
      this.openWindows = [];
      this.startMenuOpen = false;
      this.activeWindow = null;
      this.tvConsole.push('> Exiting alG Desktop...');
    },

    // Shutdown from Windows
    windowsShutdown() {
      this.startMenuOpen = false;

      // Show Windows shutdown screen
      this.windowsBooting = true;
      this.codingMode = true;
      this.tvConsole = [
        '> alG Desktop shutdown initiated...',
        '> Closing all applications...',
        '> Saving user settings...',
        '> Stopping system services...',
        '> Preparing to power off...'
      ];

      // Close all windows with animation
      this.openWindows.forEach((win, idx) => {
        setTimeout(() => {
          this.closeWindow(win.id);
        }, idx * 100);
      });

      setTimeout(() => {
        this.tvConsole.push('> alG Desktop shutdown complete.');
        this.tvConsole.push('> Returning to terminal mode...');
      }, 1000);

      setTimeout(() => {
        this.windowsMode = false;
        this.windowsBooting = false;
        this.openWindows = [];
        this.activeWindow = null;

        // Continue with normal shutdown
        this.shutdownSequence();
      }, 2000);
    },

    // connection / path helpers
    getCenter(el) {
      if (!el || !el.getBoundingClientRect) return { x: 0, y: 0 };
      const r = el.getBoundingClientRect();
      const svgRect = (this.$refs.wiresSvg && this.$refs.wiresSvg.getBoundingClientRect()) || { left: 0, top: 0 };
      return { x: r.left + r.width / 2 - svgRect.left, y: r.top + r.height / 2 - svgRect.top };
    },
    createCurvePath(a, b) {
      const dx = Math.abs(b.x - a.x);
      const controlX1 = a.x + Math.max(40, dx * 0.35);
      const controlY1 = a.y;
      const controlX2 = b.x - Math.max(40, dx * 0.35);
      const controlY2 = b.y;
      return `M ${a.x} ${a.y} C ${controlX1} ${controlY1} ${controlX2} ${controlY2} ${b.x} ${b.y}`;
    },
    updateConnections() {
      this.$nextTick(() => {
        const player = this.getCenter(this.$refs.player);
        const tv = this.getCenter(this.$refs.tv);
        const kbd = this.getCenter(this.$refs.keyboardEl);
        const rack = this.getCenter(this.$refs.rack);
        const pc = this.getCenter(this.$refs.pc);
        const mini = this.getCenter(this.$refs.miniTv);
        const mouse = this.getCenter(this.$refs.mouse);
        this.paths.playerToTv = this.createCurvePath(player, tv);
        this.paths.keyboardToPlayer = this.createCurvePath(kbd, player);
        this.paths.rackToPlayer = this.createCurvePath(rack, player);
        if (pc && player) this.paths.pcToPlayer = this.createCurvePath(pc, player);
        if (pc && tv) this.paths.pcToTv = this.createCurvePath(pc, tv);

        // additional wires
        if (kbd && pc) this.paths.keyboardToPc = this.createCurvePath(kbd, pc);
        if (mouse && pc) this.paths.mouseToPc = this.createCurvePath(mouse, pc);
        if (rack && pc) this.paths.rackToPc = this.createCurvePath(rack, pc);
        if (pc && mini) this.paths.pcToMini = this.createCurvePath(pc, mini);
      });
    },

    async insertCartridge(index, event) {
      if (this.systemLocked) {
        this.tvConsole.push('System locked. Repair required (C-Fix) before inserting cartridges.');
        return;
      }
      if (this.isOccupied) {
        await this.quickEject();
      }
      this.selectedIndex = index;
      const el = event.currentTarget;

      // ADD NULL CHECKS HERE:
      if (!el || !this.$refs.slot) {
        console.warn('insertCartridge: Missing required elements');
        return;
      }

      const rect = el.getBoundingClientRect();
      const slotRect = this.$refs.slot.getBoundingClientRect();

      const clone = el.cloneNode(true);
      clone.style.position = 'fixed';
      clone.style.left = `${rect.left}px`;
      clone.style.top = `${rect.top}px`;
      clone.style.width = `${rect.width}px`;
      clone.style.zIndex = 9999;
      clone.style.margin = 0;
      clone.style.pointerEvents = 'none';

      // ADD NULL CHECK FOR FLYER:
      if (!this.$refs.flyer) {
        console.warn('insertCartridge: Missing flyer container');
        return;
      }

      this.$refs.flyer.appendChild(clone);

      await anime({ targets: clone, left: `${slotRect.left + slotRect.width / 2 - rect.width / 2}px`, top: `${slotRect.top + slotRect.height / 2 - rect.height / 2}px`, scale: 0.7, rotate: '6deg', duration: 700, easing: 'easeInOutQuad' }).finished;
      await anime({ targets: clone, translateY: [0, 6, 0], duration: 260, easing: 'easeOutElastic(1, .6)' }).finished;
      clone.remove();

      this.inSlotIndex = index;
      this.isOccupied = true;
      this.updateConnections();
    },

    async quickEject() {
      if (this.systemLocked) {
        this.tvConsole.push('System locked. Repair required (C-Fix) before ejecting.');
        return;
      }
      this.isBooting = true;
      await anime({ targets: this.$refs.screen, opacity: [1, 0.2, 1], duration: 360, easing: 'easeInOutSine' }).finished;
      this.isBooting = false;
      this.isOccupied = false;
      this.inSlotIndex = null;
      this.tvOn = false;
      this.showStats = false;
      this.codingMode = false;
      this.updateConnections();
    },

    bootSequence() {
      // PC must be on to boot TV
      if (!this.pcOn) {
        this.tvConsole.push('PC is powered off. Cannot boot TV.');
        return;
      }
      if (this.systemLocked) {
        this.tvConsole.push('System locked. Repair (C-Fix) required before boot.');
        return;
      }

      const s = this.$refs.staticAudio;
      if (s && s.play) {
        s.currentTime = 0;
        s.play().catch(() => { });
      }

      this.isBooting = true;
      this.tvOn = false;
      this.showStats = false;
      this.codingMode = false;
      this.authOpen = false;
      this.authError = '';

      anime({ targets: this.$refs.staticEl, opacity: [0, 1, 0.85], duration: 900, easing: 'easeOutCubic' });

      setTimeout(() => {
        this.isBooting = false;
        this.tvOn = true;
        this.playVideoAuto();
        this.updateConnections();
      }, 700);
    },

    playVideoAuto() {
      if (!this.pcOn) {
        this.tvConsole.push('PC off: screen disabled.');
        return;
      }
      if (this.systemLocked || this.binarySpamActive) {
        this.tvConsole.push('System locked: cannot play video.');
        return;
      }
      const v = this.$refs.video;
      if (v && v.play) v.play().catch(() => { });
      anime({ targets: this.$refs.screen, boxShadow: [`inset 0 0 40px rgba(255,255,255,0.02)`, `inset 0 0 60px ${this.hexToRgba(this.currentGame.color || '#00ff99', 0.14)}`], duration: 600, easing: 'easeOutCubic' });
    },

    playMode() {
      if (!this.isOccupied) return;
      if (!this.pcOn) {
        this.tvConsole.push('Power on the PC to play.');
        return;
      }
      if (this.systemLocked) {
        this.tvConsole.push('System locked. Repair (C-Fix) required.');
        return;
      }
      this.showStats = false;
      this.codingMode = false;
      this.playVideoAuto();
    },

    toggleStats() {
      if (!this.isOccupied) return;
      if (!this.pcOn) {
        this.tvConsole.push('PC is off. Enable PC to view details.');
        return;
      }
      if (this.systemLocked) {
        this.tvConsole.push('System locked. Repair (C-Fix) required.');
        return;
      }
      this.showStats = !this.showStats;
      this.codingMode = false;
      anime({ targets: this.$refs.screen, scale: [1, 0.98, 1], duration: 320, easing: 'easeOutQuad' });
    },

    toggleQuitOpen() {
      if (this.shuttingDown) return;
      if (!this.pcOn) {
        // block open/quit when PC is off
        this.tvConsole.push('PC off: TV Open/Quit disabled.');
        return;
      }
      if (this.systemLocked) {
        this.tvConsole.push('System locked. Repair (C-Fix) required before quitting.');
        return;
      }
      if (this.tvOn) {
        this.shutdownSequence();
      } else {
        this.openFromQuit();
      }
    },

    shutdownSequence() {
      if (!this.tvOn || this.shuttingDown) return;
      this.shuttingDown = true;

      // If in Windows mode, show Windows shutdown screen
      if (this.windowsMode) {
        this.windowsShutdown();
        return;
      }

      this.codingMode = true;
      this.showStats = false;
      this.tvConsole = [];
      this.typedInput = '';
      this.authOpen = false;
      this.authError = '';
      this.welcomeLoading = false;

      const lines = [
        'Initializing shutdown...',
        'Closing alterGolden service...',
        'Stopping Windows subsystem...',
        'Flushing IO buffers...',
        'Killing background services...',
        'Unloading modules...',
        'Terminating alterGolden...',
        'Closing network sockets...',
        'Syncing filesystems...',
        'Sending SIGTERM...',
        'Sending SIGKILL to stubborn processes...',
        'Finalizing shutdown...'
      ];
      const total = 10000;
      const step = Math.max(1, Math.floor(total / lines.length));
      let idx = 0;

      const s = this.$refs.staticAudio;
      if (s && s.play) {
        s.currentTime = 0;
        s.play().catch(() => { });
      }

      this.tvConsole.push('> Shutdown initiated');
      this.shutdownTimer = setInterval(() => {
        if (idx < lines.length) {
          const percent = Math.min(100, Math.round(((idx + 1) / lines.length) * 100));
          this.tvConsole.push(`${lines[idx]} ${percent}%`);
          idx++;
        } else {
          clearInterval(this.shutdownTimer);
          this.shutdownTimer = null;
          this.tvConsole.push('System halted. Power state: OFF');
          if (s && !s.paused) s.pause();
          setTimeout(() => {
            this.tvOn = false;
            this.codingMode = false;
            this.showStats = false;
            this.shuttingDown = false;
            this.windowsMode = false;  // Exit Windows mode
            this.openWindows = [];      // Clear all windows
            this.startMenuOpen = false;
            this.updateConnections();
          }, 800);
        }
      }, step);
    },

    runCommandsSequence(commands = [], onComplete) {
      if (this.shutdownTimer) {
        clearInterval(this.shutdownTimer);
        this.shutdownTimer = null;
      }
      this.codingMode = true;
      this.tvConsole = ['> Open requested', '> Running self-checks...'];
      let idx = 0;
      const spamInterval = 450;
      const s = this.$refs.staticAudio;
      if (s && s.play) {
        s.currentTime = 0;
        s.play().catch(() => { });
      }

      this.shutdownTimer = setInterval(() => {
        if (idx < commands.length) {
          const cmd = commands[idx];
          this.tvConsole.push(`${cmd} ... ${Math.floor(Math.random() * 90) + 10}%`);
          idx++;
        } else {
          clearInterval(this.shutdownTimer);
          this.shutdownTimer = null;
          this.tvConsole.push('All checks passed. successful');
          setTimeout(() => {
            this.tvConsole.push('Begin reading data from cartridge...');
            if (typeof onComplete === 'function') onComplete();
          }, 900);
        }
      }, spamInterval);
    },

    openFromQuit() {
      if (!this.pcOn) {
        this.tvConsole.push('PC off: cannot open TV services.');
        return;
      }

      if (this.isOccupied) {
        const checks = [
          'Checking cartridge header',
          'Verifying checksum',
          'Mounting filesystem',
          'Probing IO ports',
          'Loading kernel modules',
          'Initializing graphics',
          'Starting game service'
        ];
        this.runCommandsSequence(checks, () => {
          setTimeout(() => {
            this.tvConsole.push('Validation complete. Presenting login...');
            setTimeout(() => {
              this.openAuth('login');
            }, 600);
          }, 800);
        });
        return;
      }

      this.codingMode = true;
      this.tvConsole = ['> Open requested', '> Running self-checks...'];

      setTimeout(() => {
        this.tvConsole.push('!!! You need to put a cartridge !!!');
        setTimeout(() => {
          this.tvConsole.push('No cartridge found. Shutting down...');
          setTimeout(() => {
            this.codingMode = false;
            this.tvOn = false;
            this.showStats = false;
            this.updateConnections();
          }, 800);
        }, 5000);
      }, 5000);
    },

    openAuth(mode = 'login') {
      this.authMode = mode;
      this.authForm.username = '';
      this.authForm.password = '';
      this.authForm.confirm = '';
      this.authOpen = true;
      this.authFocused = 'username';
      this.codingMode = false;
      this.showStats = false;
      this.tvOn = true;
      this.authError = '';
      try { this.$refs.hiddenInput.focus(); } catch (e) { }
      this.updateConnections();
    },

    toggleAuthMode() {
      this.authMode = this.authMode === 'login' ? 'signup' : 'login';
      this.authError = '';
    },

    setAuthFocus(f) {
      this.authFocused = f === 'password' ? 'password' : (f === 'confirm' ? 'confirm' : 'username');
      try { this.$refs.hiddenInput.focus(); } catch (e) { }
    },

    submitAuth() {
      this.interacted = true; // ensure UI knows user interacted
      this.authError = '';
      const u = this.authForm.username.trim();
      const p = this.authForm.password;

      if (!u || !p) {
        this.authError = 'Missing username or password.';
        return;
      }

      if (this.authMode === 'login') {
        const found = this.users.find(x => x.username === u && x.password === p);
        if (found) {
          this.currentUser = found;
          this.tvConsole.push(`Welcome back, ${u}`);
          this.authOpen = false;
          this.welcomeLoading = true;
          this.welcomeName = u;
          setTimeout(() => {
            this.welcomeLoading = false;
            this.bootSequence();
          }, 1600); // shorter
        } else {
          this.authError = 'Invalid username or password.';
        }
      } else {
        // sign up: require confirm and strong-ish checks
        if (!this.authForm.confirm) {
          this.authError = 'Please confirm your password.';
          return;
        }
        if (p !== this.authForm.confirm) {
          this.authError = 'Passwords do not match.';
          return;
        }
        if (!/^[\w\-\.]{3,}$/.test(u)) {
          this.authError = 'Username must be at least 3 characters and contain no spaces.';
          return;
        }
        if (p.length < 4) {
          this.authError = 'Password must be at least 4 characters.';
          return;
        }
        if (this.users.find(x => x.username === u)) {
          this.authError = 'Username already exists.';
          return;
        }
        const nu = { username: u, password: p, created: Date.now() };
        this.users.push(nu);
        this.saveUsers();
        this.currentUser = nu;
        this.tvConsole.push(`Account created. Welcome, ${u}`);
        this.authOpen = false;
        this.welcomeLoading = true;
        this.welcomeName = u;
        setTimeout(() => {
          this.welcomeLoading = false;
          this.bootSequence();
        }, 1600);
      }
    },

    powerOff() {
      if (!this.isOccupied) return;
      if (this.systemLocked || this.binarySpamActive) {
        this.tvConsole.push('Power actions disabled while system is locked.');
        return;
      }
      anime({ targets: this.$refs.screen, opacity: [1, 0], duration: 420, easing: 'easeInOutQuad' });
      this.tvOn = false;
      this.showStats = false;
      this.codingMode = false;
      this.authOpen = false;
      const s = this.$refs.staticAudio;
      if (s && !s.paused) s.pause();
    },

    ejectCartridge() {
      if (this.systemLocked || this.binarySpamActive) {
        this.tvConsole.push('Cannot eject while system locked. Repair required.');
        return;
      }
      if (!this.isOccupied) return;

      // ADD NULL CHECKS:
      if (!this.$refs.slot) {
        console.warn('ejectCartridge: Missing slot element');
        this.isOccupied = false;
        this.inSlotIndex = null;
        this.tvOn = false;
        return;
      }

      const slotRect = this.$refs.slot.getBoundingClientRect();
      const original = (this.$refs.cartridgeEls || [])[this.inSlotIndex];
      if (!original) {
        this.isOccupied = false;
        this.inSlotIndex = null;
        this.tvOn = false;
        return;
      }

      const clone = original.cloneNode(true);
      const rect = original.getBoundingClientRect();
      clone.style.position = 'fixed';
      clone.style.left = `${slotRect.left + slotRect.width / 2 - rect.width / 2}px`;
      clone.style.top = `${slotRect.top + slotRect.height / 2 - rect.height / 2}px`;
      clone.style.width = `${rect.width}px`;
      clone.style.zIndex = 9999;
      clone.style.pointerEvents = 'none';

      // ADD NULL CHECK:
      if (!this.$refs.flyer) {
        console.warn('ejectCartridge: Missing flyer container');
        this.isOccupied = false;
        this.inSlotIndex = null;
        this.tvOn = false;
        return;
      }

      this.$refs.flyer.appendChild(clone);

      const destX = rect.left;
      const destY = rect.top;

      anime({
        targets: clone, left: `${destX}px`, top: `${destY}px`, scale: 1, rotate: '-4deg', duration: 700, easing: 'easeInOutQuad', complete: () => {
          clone.remove();
          this.isOccupied = false;
          this.inSlotIndex = null;
          this.tvOn = false;
          this.showStats = false;
          this.codingMode = false;
          this.authOpen = false;
          this.updateConnections();
        }
      });

      const s = this.$refs.staticAudio;
      if (s && !s.paused) s.pause();
    },

    virtualKeyPress(key) {
      try { this.$refs.hiddenInput.focus(); } catch (e) { }
      this.interacted = true;

      if (key === 'Space') {
        this.handleKeyInput(' ');
        return;
      } else if (key === 'Back') {
        this.handleKeyInput('Backspace');
        return;
      } else if (key === 'Enter') {
        this.handleKeyInput('Enter');
        return;
      } else if (key === 'Clear') {
        this.clearAll();
        return;
      } else if (key === 'Caps') {
        this.capsLock = !this.capsLock;
        return;
      } else if (key === 'Win') {
        if (this.windowsMode) {
          this.toggleStartMenu();
        }
        return;
      } else {
        const char = (this.capsLock && key.length === 1) ? key.toUpperCase() : key;
        this.handleKeyInput(char);
        return;
      }
    },

    handleKeyInput(key) {
      if (this.authOpen) {
        if (key === 'Backspace' || key === 'Back') {
          if (this.authFocused === 'username') this.authForm.username = this.authForm.username.slice(0, -1);
          else if (this.authFocused === 'password') this.authForm.password = this.authForm.password.slice(0, -1);
          else if (this.authFocused === 'confirm') this.authForm.confirm = this.authForm.confirm.slice(0, -1);
        } else if (key === 'Enter') {
          this.submitAuth();
        } else {
          if (this.authFocused === 'username') this.authForm.username += key;
          else if (this.authFocused === 'password') this.authForm.password += key;
          else if (this.authFocused === 'confirm') this.authForm.confirm += key;
        }
        return;
      }

      if (this.systemLocked || this.binarySpamActive) {
        this.tvConsole.push('Input blocked due to system lock.');
        return;
      }

      if (key === 'Backspace' || key === 'Back') {
        this.typedInput = this.typedInput.slice(0, -1);
      } else if (key === 'Enter') {
        if (this.codingMode) {
          const lines = this.typedInput.split(/\r?\n/).filter(Boolean);
          const command = lines.length ? lines[lines.length - 1].trim() : '';
          if (command) {
            this.tvConsole.push(`> ${command}`);
            this.tvConsole.push(`Running "${command}"...`);
            setTimeout(() => {
              if (/fail/i.test(command)) {
                this.tvConsole.push(`Command "${command}" failed`);
              } else {
                this.tvConsole.push(`Command "${command}" completed: OK`);
                if (/boot|start|run/i.test(command) && this.isOccupied) {
                  this.tvConsole.push('Verified cartridge. Starting read...');
                  setTimeout(() => this.bootSequence(), 700);
                }
              }
            }, 700);
          }
          this.typedInput += '\n';
        } else {
          this.typedInput += '\n';
        }
      } else {
        this.typedInput += key;
      }

      if (this.codingMode && !this.codeResponded) {
        if (this.typedInput.includes('> alterGolden')) {
          this.tvConsole.push('> alterGolden is HERE!');
          this.codeResponded = true;
        }
      }
    },

    onHiddenInput(e) {
      // hidden input used for IME; sync typedInput only when hiddenInput is active
      if (document.activeElement === this.$refs.hiddenInput && !this.authOpen) {
        this.typedInput = e.target.value;
      }
      // If auth is open and hidden input is focused, mirror characters to the focused auth field
      if (document.activeElement === this.$refs.hiddenInput && this.authOpen) {
        // Use value difference to append new characters (basic)
        const v = e.target.value || '';
        // If user cleared hidden input, ignore
        if (v.length === 0) return;
        // Append last character(s)
        const last = v.slice(-1);
        if (this.authFocused === 'username') this.authForm.username += last;
        else if (this.authFocused === 'password') this.authForm.password += last;
        else if (this.authFocused === 'confirm') this.authForm.confirm += last;
        // clear hidden input to avoid duplicates
        e.target.value = '';
      }
    },

    onHiddenKeydown(e) {
      // handle special keys when hiddenInput is focused
      // Stop propagation so outer handlers don't duplicate
      e.stopPropagation();
      if (e.key === 'Backspace' || e.key === 'Enter' || e.key === 'Tab' || e.key === 'CapsLock') {
        // Let global logic handle these via explicit functions
        if (e.key === 'Backspace') {
          if (this.authOpen) {
            if (this.authFocused === 'username') this.authForm.username = this.authForm.username.slice(0, -1);
            else if (this.authFocused === 'password') this.authForm.password = this.authForm.password.slice(0, -1);
            else if (this.authFocused === 'confirm') this.authForm.confirm = this.authForm.confirm.slice(0, -1);
          } else {
            this.typedInput = this.typedInput.slice(0, -1);
          }
        } else if (e.key === 'Enter') {
          if (this.authOpen) this.submitAuth();
          else this.handleKeyInput('Enter');
        } else if (e.key === 'Tab') {
          e.preventDefault();
          if (this.authOpen) {
            this.authFocused = this.authFocused === 'username' ? 'password' : (this.authFocused === 'password' ? 'confirm' : 'username');
          }
        } else if (e.key === 'CapsLock') {
          this.capsLock = !this.capsLock;
        }
      }
    },

    onGlobalKeydown(e) {
      // if hidden input is focused, ignore global handler to avoid duplication
      if (document.activeElement === this.$refs.hiddenInput) return;

      // support caps lock toggle
      if (e.key === 'CapsLock') {
        this.capsLock = !this.capsLock;
        return;
      }

      // If auth is open, route all keyboard input into the focused auth field
      if (this.authOpen) {
        if (e.key === 'Tab') {
          e.preventDefault();
          this.authFocused = this.authFocused === 'username' ? 'password' : (this.authFocused === 'password' ? 'confirm' : 'username');
          try { this.$refs.hiddenInput.focus(); } catch (e) { }
          return;
        }

        if (e.key === 'Backspace') {
          if (this.authFocused === 'username') this.authForm.username = this.authForm.username.slice(0, -1);
          else if (this.authFocused === 'password') this.authForm.password = this.authForm.password.slice(0, -1);
          else if (this.authFocused === 'confirm') this.authForm.confirm = this.authForm.confirm.slice(0, -1);
          return;
        } else if (e.key === 'Enter') {
          this.submitAuth();
          return;
        } else if (e.key.length === 1) {
          const ch = this.capsLock ? e.key.toUpperCase() : e.key;
          if (this.authFocused === 'username') this.authForm.username += ch;
          else if (this.authFocused === 'password') this.authForm.password += ch;
          else if (this.authFocused === 'confirm') this.authForm.confirm += ch;
          return;
        }
        return;
      }

      if (this.systemLocked || this.binarySpamActive) {
        this.tvConsole.push('Keyboard input blocked due to system lock.');
        return;
      }

      // normal typed input handling when not using hiddenInput
      if (e.key === 'Backspace') {
        this.typedInput = this.typedInput.slice(0, -1);
      } else if (e.key === 'Enter') {
        if (this.codingMode) {
          const lines = this.typedInput.split(/\r?\n/).filter(Boolean);
          const command = lines.length ? lines[lines.length - 1].trim() : '';
          if (command) {
            this.tvConsole.push(`> ${command}`);
            this.tvConsole.push(`Running "${command}"...`);
            setTimeout(() => {
              if (/fail/i.test(command)) {
                this.tvConsole.push(`Command "${command}" failed`);
              } else {
                this.tvConsole.push(`Command "${command}" completed: OK`);
                if (/boot|start|run/i.test(command) && this.isOccupied) {
                  this.tvConsole.push('Verified cartridge. Starting read...');
                  setTimeout(() => this.bootSequence(), 700);
                }
              }
            }, 700);
          }
          this.typedInput += '\n';
        } else {
          this.typedInput += '\n';
        }
      } else if (e.key.length === 1) {
        const ch = this.capsLock ? e.key.toUpperCase() : e.key;
        this.typedInput += ch;
      }

      if (this.codingMode && !this.codeResponded) {
        if (this.typedInput.includes('> alterGolden')) {
          this.tvConsole.push('> alterGolden is HERE!');
          this.codeResponded = true;
        }
      }
    },

    startCoding() {
      if (!this.tvOn && !this.isBooting) {
        this.bootSequence();
        setTimeout(() => {
          this.codingMode = true;
          this.tvConsole = ['> Type something'];
          this.typedInput = '';
          this.codeResponded = false;
          this.updateConnections();
        }, 750);
        return;
      }
      if (!this.pcOn) {
        this.tvConsole.push('PC off: cannot enter code mode.');
        return;
      }
      if (this.systemLocked) {
        this.tvConsole.push('System locked. Repair (C-Fix) required.');
        return;
      }
      this.codingMode = true;
      this.showStats = false;
      this.tvConsole = ['> Type something'];
      this.typedInput = '';
      this.codeResponded = false;
      anime({ targets: this.$refs.screen, scale: [1, 0.995, 1], duration: 220, easing: 'easeOutQuad' });
    },

    clearAll() {
      this.typedInput = '';
      if (this.authOpen) {
        this.authForm.username = '';
        this.authForm.password = '';
        this.authForm.confirm = '';
      }
    },

    // PC specific
    togglePcPower() {
      if (this.binarySpamActive) {
        this.tvConsole.push('Power controls disabled during binary corruption. Use FC-Re.');
        return;
      }
      if (this.systemLocked) {
        this.tvConsole.push('Power controls disabled while system is locked. Use C-Fix.');
        return;
      }
      this.pcOn = !this.pcOn;
      if (this.pcOn) {
        this.pcConsole.push(`[${new Date().toLocaleTimeString()}] PC powering on...`);
        if (this.pcConsole.length > 8) this.pcConsole.shift();
        // small bootstrap logs
        setTimeout(() => this.pcConsole.push(`[${new Date().toLocaleTimeString()}] POST OK`), 600);
        setTimeout(() => this.pcConsole.push(`[${new Date().toLocaleTimeString()}] Services started`), 1200);
        // ADD: Initialize GPU on boot
        setTimeout(() => this.pcConsole.push(`[${new Date().toLocaleTimeString()}] GPU: GoldenForce RTX 4090 detected`), 1400);
        // Restore normal temps/fan
        this.pcTemp = 45 + Math.floor(Math.random() * 16);
        this.pcFan = 4500 + Math.floor(Math.random() * 2001);
      } else {
        this.pcConsole.push(`[${new Date().toLocaleTimeString()}] PC shutting down...`);
        // ADD: Reset temps and fan to 0 when PC turns off
        this.pcTemp = 0;
        this.pcFan = 0;
        // When PC turns off, also force TV off and disable actions
        this.tvOn = false;
        this.codingMode = false;
        this.showStats = false;
      }
      this.updateConnections();
    },

    // send typedInput as a server message seen in mini TV
    sendServerMessage() {
      if (this.systemLocked || this.binarySpamActive) {
        this.tvConsole.push('Cannot send messages while system locked.');
        return;
      }
      const text = (this.typedInput || '').trim();
      if (!text) return;
      const name = this.currentUser ? this.currentUser.username : (this.authForm.username && this.authForm.username.trim()) ? this.authForm.username.trim() : 'guest';
      this.serverMessages.push({ user: name, text });
      // clear typed input after sending
      this.typedInput = '';
      // keep list reasonable
      if (this.serverMessages.length > 80) this.serverMessages.shift();
      // small visual feedback
      anime({ targets: this.$refs.miniTv || '.mini-tv', translateY: [-4, 0], duration: 260, easing: 'easeOutElastic(1,.6)' });
    },

    // volume knob logic
    startVolumeDrag(e) {
      this.draggingVolume = true;
      try {
        this.$refs.volumeKnob.setPointerCapture(e.pointerId);
      } catch (err) { }
      window.addEventListener('pointermove', this._onVolumeMove);
      // initialize angle from pointer
      this._onVolumeMove(e);
    },
    _onVolumeMove(e) {
      if (!this.draggingVolume) return;
      const knob = this.$refs.volumeKnob;
      if (!knob) return;
      const rect = knob.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      let angle = Math.atan2(dy, dx) * (180 / Math.PI); // -180..180
      // map usable range -135..135 to 0..100
      const minA = -135;
      const maxA = 135;
      if (angle < minA) angle = minA;
      if (angle > maxA) angle = maxA;
      const perc = Math.round(((angle - minA) / (maxA - minA)) * 100);
      this.volume = Math.max(0, Math.min(100, perc));
      // set visual angle slightly offset so indicator lines up
      this.volumeAngle = angle;
      // push to pc console as feedback (throttle a little)
      const now = Date.now();
      if (this.pcOn && (!this._lastVolumePush || now - this._lastVolumePush > 300)) {
        this._lastVolumePush = now;
        this.pcConsole.push(`[${new Date().toLocaleTimeString()}] Volume: ${this.volume}%`);
        if (this.pcConsole.length > 12) this.pcConsole.shift();
      }
    },
    endVolumeDrag(e) {
      this.draggingVolume = false;
      try {
        this.$refs.volumeKnob.releasePointerCapture && this.$refs.volumeKnob.releasePointerCapture(e.pointerId);
      } catch (err) { }
      window.removeEventListener('pointermove', this._onVolumeMove);
      // final push
      if (this.pcOn) {
        this.pcConsole.push(`[${new Date().toLocaleTimeString()}] Volume set to ${this.volume}%`);
        if (this.pcConsole.length > 12) this.pcConsole.shift();
      }
    },

    // mini-tv error scheduling (modified to 45s..120s)
    scheduleNextMiniError() {
      // random between 45s and 120s
      const delay = 45000 + Math.floor(Math.random() * (120000 - 45000));
      if (this.miniErrorTimer) clearTimeout(this.miniErrorTimer);
      this.miniErrorTimer = setTimeout(() => {
        this.triggerMiniError();
      }, delay);
    },

    triggerMiniError() {
      // ADD THIS CHECK AT THE START:
      if (!this.pcOn || !this.tvOn) {
        // Skip this error and schedule next one
        this.scheduleNextMiniError();
        return;
      }
      // choose between real error and lore (25% lore)
      const isLore = Math.random() < 0.25;
      this.miniErrorIsLore = isLore;
      if (isLore) {
        this.miniErrorText = this.miniLoreMessages[Math.floor(Math.random() * this.miniLoreMessages.length)];
      } else {
        this.miniErrorText = this.miniErrorMessages[Math.floor(Math.random() * this.miniErrorMessages.length)];
      }
      this.miniErrorActive = true;

      // determine if this error will corrupt the main system: 15% chance
      const willCorrupt = Math.random() < 0.15;
      if (willCorrupt) {
        // small delay and then apply corruption state
        setTimeout(() => {
          // if lore + corrupt -> binary spam flow
          if (this.miniErrorIsLore) {
            this.binarySpamActive = true;
            this.binarySpamText = Array(40).fill(this.binaryLine).join('\n');
            this.tvCorrupted = true;
            this.systemLocked = true;
            // push to pc and tv consoles
            this.pcConsole.push(`[${new Date().toLocaleTimeString()}] !!! BINARY OVERFLOW DETECTED !!!`);
            this.tvConsole.push('> SYSTEM BINARY CORRUPTION');
            // schedule persistent binary effect until user presses FC-Re
            // no animation flicker on mini (user requested no disappear/appear)
          } else {
            // normal corruption: overload temps and lock system, require C-Fix
            this.systemLocked = true;
            this.tvCorrupted = true;
            this.pcTemp = 85 + Math.floor(Math.random() * 11); // 85..95
            this.pcFan = 8000 + Math.floor(Math.random() * 2001); // 8000..10000
            this.tvConsole.push('> CRITICAL: Corruption propagated from mini-TV');
            this.pcConsole.push(`[${new Date().toLocaleTimeString()}] CRITICAL: thermal spike detected`);
          }
        }, 300);
      }

      // show for 10s (user requested)
      setTimeout(() => {
        this.miniErrorActive = false;
        this.miniErrorText = '';
        this.miniErrorIsLore = false;
        // if no corruption happened, schedule next
        if (!willCorrupt) this.scheduleNextMiniError();
        // if corruption happened, keep system locked until user repairs
      }, 10000);
    },

    // C-Fix button handler: repair normal corruption (35s process)
    cfixRepair() {
      if (!this.systemLocked || this.binarySpamActive) return;
      // run the heavy repair sequence for 35s with progress
      const duration = 35000;
      const start = Date.now();
      this.cfixProgress = 0;
      this.tvConsole = ['> C-Fix initiated', '> Running deep repair...'];
      this._cfixInterval = setInterval(() => {
        const now = Date.now();
        const elapsed = now - start;
        const pct = Math.min(100, Math.round((elapsed / duration) * 100));
        this.cfixProgress = pct;
        // push some command-ish lines occasionally
        if (elapsed % 1200 < 200) {
          const samples = [
            'repairing filesystem',
            'resynchronizing modules',
            'rebuilding kernel caches',
            'restoring partitions',
            'patching memory maps',
            'clearing corrupted handles',
            'optimizing process table',
            'relinking drivers'
          ];
          const s = samples[Math.floor(Math.random() * samples.length)];
          this.tvConsole.push(`> ${s} ... ${Math.min(99, pct)}%`);
          if (this.tvConsole.length > 30) this.tvConsole.shift();
        }
        if (elapsed >= duration) {
          clearInterval(this._cfixInterval);
          this._cfixInterval = null;
          this.cfixProgress = 100;
          this.tvConsole.push('> C-Fix complete. Restarting PC...');
          // simulate restart
          this.pcConsole.push(`[${new Date().toLocaleTimeString()}] C-Fix applied. Restarting...`);
          this.systemLocked = false;
          this.tvCorrupted = false;
          // restore temps to normal range after restart
          setTimeout(() => {
            this.pcOn = false;
            setTimeout(() => {
              this.pcOn = true;
              this.pcTemp = 45 + Math.floor(Math.random() * 16);
              this.pcFan = 4500 + Math.floor(Math.random() * 2001);
              this.pcConsole.push(`[${new Date().toLocaleTimeString()}] Restart complete. Systems nominal.`);
              this.tvConsole.push('> Restart complete. Systems nominal.');
              // schedule next mini error longer again
              this.scheduleNextMiniError();
            }, 800);
          }, 800);
        }
      }, 400);
    },

    // FC-Re handler: for binary spam / lore flow - show terminate overlay
    fcReRepair() {
      if (!this.binarySpamActive) return;
      // entering terminate dialog flow
      this.terminationMode = true;
      this.fcAnswers = Array(this.fcQuestions.length).fill(null);
      // block eject/power/quit until termination resolved (handled by flags)
    },

    // set answer for termination question
    setQuestionAnswer(i, ans) {
      this.$set(this.fcAnswers, i, ans);
      // if all answered, simulate a terminate/resolution cycle
      if (this.fcAnswers.every(x => x === 'Y' || x === 'N')) {
        this.tvConsole.push('> TERMINATE SEQUENCE RESPONSES RECORDED');
        // resolution simulated: clear binary and restart PC
        this.terminationMode = false;
        this.binarySpamActive = false;
        this.tvCorrupted = false;
        this.systemLocked = false;
        this.tvConsole.push('> System recovered from binary spam. Restarting...');
        this.pcConsole.push(`[${new Date().toLocaleTimeString()}] FC-Re: Recovery complete.`);
        // restore temps slowly
        this.pcTemp = 45 + Math.floor(Math.random() * 16);
        this.pcFan = 4500 + Math.floor(Math.random() * 2001);
        // schedule next mini error again
        this.scheduleNextMiniError();
      }
    },

    // lots of command output helper (available for other uses)
    runAlotCommands(totalLines = 120) {
      const samples = [
        'scanning...',
        'allocating buffers',
        'validating signatures',
        'hashing blocks',
        'patching offsets',
        'syncing realtime logs',
        'optimizing throughput',
        'garbage collecting stale pointers',
        'verifying checksums',
        'stabilizing memory'
      ];
      for (let i = 0; i < totalLines; i++) {
        const s = samples[Math.floor(Math.random() * samples.length)];
        this.tvConsole.push(`[${(new Date()).toLocaleTimeString()}] ${s} ${Math.floor(Math.random() * 100)}%`);
        if (this.tvConsole.length > 400) this.tvConsole.shift();
      }
    },

    // mini-tv error scheduling helper was changed above

  },
  created() {
    // global keyboard handler attached on create to ensure it exists
    window.addEventListener('keydown', this.onGlobalKeydown);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.onGlobalKeydown);
  }
};
</script>

<style scoped>
:root {
  --bg: #0b0b0f;
  --accent: #00ffbb
}

.nes-console-root {
  padding: 28px;
  font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
  color: #e9f9f5;
  position: relative;
  z-index: 2
}

.scene {
  display: flex;
  gap: 28px;
  align-items: flex-start;
}

/* wires overlay covers viewport - now behind UI */
.wires-overlay {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1
}

/* Left rack */
.rack {
  width: 240px;
  background: linear-gradient(180deg, #2b2b2b, #161616);
  border-radius: 12px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.03);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45)
}

.rack-title {
  text-align: center;
  margin: 6px 0 12px;
  font-weight: 700
}

.cartridge-list {
  display: flex;
  flex-direction: column;
  gap: 12px
}

.cartridge-list.enhanced {
  padding: 6px;
  background: linear-gradient(180deg, #0f0f0f, #1a1a1a);
  border-radius: 8px
}

.cartridge-shell {
  cursor: pointer;
  perspective: 800px;
  position: relative
}

.cartridge-body {
  width: 190px;
  height: 70px;
  background: linear-gradient(180deg, #dcdcdc, #bfbfbf);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.45);
  transform-origin: center;
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease
}

.cartridge-shell:hover .cartridge-body {
  transform: rotateX(6deg) translateX(8px);
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.55)
}

.cartridge-shell.selected .cartridge-body {
  transform: translateX(10px) rotateX(6deg);
  box-shadow: 0 22px 44px rgba(0, 0, 0, 0.6)
}

.label-sticker {
  width: 150px;
  height: 50px;
  background: linear-gradient(180deg, #111, #444);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  overflow: hidden;
  position: relative;
  z-index: 2;
  box-shadow: inset 0 -6px 18px rgba(0, 0, 0, 0.25)
}

.label-sticker img {
  width: 100%;
  height: 100%;
  object-fit: cover
}

.label-text {
  font-weight: 900;
  font-size: 0.95rem;
  color: #fff;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.4)
}

.notches {
  position: absolute;
  left: 12px;
  bottom: 10px;
  width: 36px;
  height: 8px;
  background: repeating-linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0 4px, rgba(255, 255, 255, 0.06) 4px 6px);
  border-radius: 3px;
  z-index: 1
}

.cartridge-ribbon {
  position: absolute;
  top: 6px;
  right: 10px;
  width: 10px;
  height: 40px;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transform: rotate(8deg);
  opacity: 0.95
}

/* center area */
.center {
  flex: 1;
  display: flex;
  justify-content: center;
  z-index: 3
}

.player-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px
}

.tv-and-mini {
  display: flex;
  align-items: flex-start;
  gap: 16px
}

/* side stack to place mini-tv above pc */
.side-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center
}

/* Player console (NES-ish) */
.console-player {
  width: 460px;
  background: linear-gradient(180deg, #2b2b2b, #161616);
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 22px 48px rgba(0, 0, 0, 0.55);
  display: flex;
  flex-direction: column;
  align-items: center
}

.player-top {
  display: flex;
  align-items: center;
  gap: 18px;
  width: 100%;
  justify-content: center
}

.slot {
  width: 260px;
  height: 56px;
  background: linear-gradient(180deg, #0b0b0b, #141414);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 3px 10px rgba(255, 255, 255, 0.02)
}

.slot-hole {
  width: 240px;
  height: 38px;
  background: #111;
  border-radius: 6px;
  border: 3px solid #222;
  transition: background .18s ease
}

.slot-hole.occupied {
  background: linear-gradient(180deg, #1a1a1a, #0f0f0f)
}

.power-led {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #2b2b2b;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.6)
}

.power-led.on {
  background: #33ff99;
  box-shadow: 0 0 14px rgba(51, 255, 153, 0.45)
}

.player-front {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px
}

.eject {
  background: #ff6666;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  color: white;
  font-weight: 800;
  cursor: pointer
}

.eject:disabled {
  opacity: 0.45;
  cursor: not-allowed
}

.player-label {
  color: #fff;
  font-weight: 900
}

.now-playing {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 160px;
}

.np-label {
  font-size: 10px;
  color: #9fe8c7;
  font-weight: 700;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.np-game {
  font-size: 13px;
  color: #00ffbb;
  font-weight: 900;
  text-shadow: 0 0 8px rgba(0, 255, 187, 0.3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

/* I/O ports */
.io-ports {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  justify-content: center
}

.port-label {
  font-size: 12px;
  color: #b8ffd6;
  font-weight: 700
}

.ports {
  display: flex;
  gap: 8px
}

.port {
  width: 36px;
  height: 26px;
  background: linear-gradient(180deg, #0f0f0f, #1a1a1a);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 800;
  box-shadow: inset 0 2px 6px rgba(255, 255, 255, 0.02)
}

/* tv */
.tv {
  width: 720px;
  /* Changed from 560px */
  height: 480px;
  /* Changed from 360px */
  border-radius: 14px;
  background: linear-gradient(180deg, #04121a, #00121a);
  display: flex;
  align-items: center;
  justify-content: center
}

.tv-bezel {
  width: 92%;
  height: 86%;
  border-radius: 12px;
  background: linear-gradient(180deg, #090909, #0d0d0d);
  padding: 14px;
  display: flex;
  flex-direction: column;
  align-items: center
}

.tv-screen {
  position: relative;
  width: 100%;
  height: 86%;
  background: radial-gradient(600px 240px at 20% 20%, rgba(0, 255, 170, 0.02), rgba(0, 0, 0, 0.85));
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b8ffe6
}

/* static overlay */
.static {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02) 2px, transparent 2px, transparent 4px);
  opacity: 0;
  z-index: 40;
  pointer-events: none;
}

/* corruption overlay */
.corrupt-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 80;
  background: linear-gradient(180deg, rgba(120, 0, 0, 0.02), rgba(0, 0, 0, 0.45));
  color: #ffb3b3;
  pointer-events: none
}

.corrupt-text {
  font-weight: 900;
  font-size: 18px;
  color: #ff6b6b;
  margin-bottom: 8px
}

.corrupt-help {
  font-size: 12px;
  opacity: 0.9;
  color: #ffdede
}

/* binary spam overlay */
.binary-spam {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.95));
  color: #9ff3ff;
  font-family: ui-monospace, "Roboto Mono", monospace;
  padding: 10px;
  z-index: 90;
  overflow: hidden
}

.binary-line {
  opacity: 0.95;
  font-size: 12px;
  line-height: 1.05;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden
}

/* Idle text etc remain unchanged */
.tv-brand {
  margin-top: 8px;
  font-weight: 900;
  color: #9ee8c9;
  font-size: 13px
}

.screen-idle {
  font-weight: 800;
  opacity: 0.6
}

/* auth */
.screen-auth {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center
}

.auth-text {
  color: #00ff88;
  font-family: ui-monospace, "Roboto Mono", monospace;
  font-size: 18px;
  text-align: left;
  width: 70%;
  max-width: 480px
}

.auth-title {
  font-weight: 900;
  font-size: 20px;
  margin-bottom: 12px;
  color: #00ff88
}

.auth-field {
  margin: 8px 0;
  cursor: pointer;
  display: flex;
  gap: 8px;
  align-items: center
}

.auth-field .label {
  opacity: 0.75;
  width: 90px
}

.auth-input {
  color: #b8ffd6;
  min-height: 20px
}

.blink {
  color: #b8ffd6;
  opacity: 0.9;
  animation: blink 1s steps(2, start) infinite;
  margin-left: 4px
}

@keyframes blink {
  to {
    visibility: hidden
  }
}

.auth-actions {
  margin-top: 14px;
  display: flex;
  gap: 10px;
  align-items: center
}

.auth-note {
  margin-top: 8px;
  font-size: 12px;
  opacity: 0.7
}

.auth-helper {
  margin-top: 6px;
  font-size: 12px;
  opacity: 0.7;
  color: #9ee8c9
}

.auth-error {
  margin-top: 10px;
  color: #ff6b6b;
  background: rgba(255, 100, 100, 0.06);
  padding: 8px;
  border-radius: 6px;
  font-weight: 700
}

.welcome-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
  pointer-events: none
}

.welcome-card {
  background: rgba(0, 0, 0, 0.5);
  padding: 18px 22px;
  border-radius: 10px;
  text-align: center;
  pointer-events: none;
  display: flex;
  align-items: center;
  gap: 18px
}

.welcome-text {
  color: #b8ffd6;
  font-weight: 900;
  font-size: 18px
}

.spinner {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 4px solid rgba(200, 255, 220, 0.12);
  border-top-color: #00ff88;
  animation: spin 1s linear infinite
}

@keyframes spin {
  to {
    transform: rotate(360deg)
  }
}

.screen-video video {
  width: 100%;
  height: 100%;
  object-fit: cover
}

.screen-stats {
  padding: 14px;
  color: #c9ffe8;
  width: 100%;
  height: 100%;
  overflow: auto
}

.kbd-output {
  margin-top: 10px;
  background: rgba(255, 255, 255, 0.03);
  padding: 8px;
  border-radius: 6px;
}

.output-label {
  font-size: 11px;
  opacity: 0.7;
  margin-bottom: 6px
}

.typed {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", monospace;
  white-space: pre-wrap;
  max-height: 120px;
  overflow: auto
}

.send-row {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 10px
}

.send-help {
  font-size: 11px;
  opacity: 0.7
}

/* mini TV (made slightly larger) */
.mini-tv {
  width: 320px;
  height: 200px;
  background: linear-gradient(180deg, #061219, #081018);
  border-radius: 10px;
  padding: 8px;
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center
}

.mini-bezel {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background: linear-gradient(180deg, #0b0b0b, #0e0e0e);
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between
}

.mini-screen {
  width: 100%;
  height: calc(100% - 28px);
  background: linear-gradient(180deg, #041214, #001116);
  border-radius: 6px;
  padding: 8px;
  color: #c9ffe8;
  overflow: auto;
  box-shadow: inset 0 6px 18px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column
}

/* error overlay styling (lo-res / creepy lore) */
.mini-error {
  width: 100%;
  color: #ff9b9b;
  font-weight: 900;
  font-family: ui-monospace, "Roboto Mono", monospace;
  font-size: 14px;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.0), rgba(255, 80, 80, 0.03));
  padding: 8px;
  border-radius: 4px;
  text-align: center;
  filter: contrast(0.9) saturate(0.9);
  letter-spacing: 0.5px;
  line-height: 1.25;
  box-shadow: inset 0 2px 6px rgba(255, 0, 0, 0.02);
}

.mini-error-lores {
  display: block;
  margin-top: 6px;
  color: #ffdfdf;
  font-weight: 800;
  opacity: 0.95;
  font-size: 12px;
}

.mini-binary .binary-line {
  font-family: ui-monospace, "Roboto Mono", monospace;
  color: #9ff3ff;
  font-size: 11px
}

/* overlay server list */
.mini-title {
  font-weight: 900;
  font-size: 13px;
  color: #9ee8c9;
  margin-bottom: 6px
}

.mini-list {
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-family: ui-monospace, "Roboto Mono", monospace;
  font-size: 12px
}

.mini-empty {
  opacity: 0.6;
  font-size: 12px
}

.server-line {
  display: flex;
  gap: 8px;
  align-items: flex-start
}

.server-user {
  color: #8ef0b3;
  font-weight: 900;
  min-width: 76px
}

.server-text {
  color: #cfeee0;
  word-break: break-word
}

.mini-brand {
  font-size: 11px;
  color: #9ee8c9;
  font-weight: 800;
  margin-top: 6px
}

/* code/terminal screen */
.screen-code {
  width: 100%;
  height: 100%;
  color: #b8ffe6;
  display: flex;
  flex-direction: column;
  padding: 12px;
  box-sizing: border-box;
  align-items: flex-start;
  justify-content: flex-start;
  font-family: ui-monospace, "Roboto Mono", monospace;
  font-size: 13px
}

.console-lines {
  width: 100%;
  height: calc(100% - 36px);
  overflow: auto;
  background: rgba(0, 0, 0, 0.2);
  padding: 8px;
  border-radius: 6px;
  box-shadow: inset 0 4px 18px rgba(0, 0, 0, 0.6)
}

.console-input {
  margin-top: 8px;
  opacity: 0.9;
  color: #e6fff8
}

/* repair running state */
.repair-running .console-lines {
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.45));
}

/* peripherals */
.peripherals {
  display: flex;
  gap: 18px;
  align-items: center;
  margin-top: 12px
}

/* keyboard */
.keyboard {
  background: linear-gradient(180deg, #0f1416, #0b0b0b);
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.5)
}

.kbd-rows {
  display: flex;
  flex-direction: column;
  gap: 6px
}

.kbd-row {
  display: flex;
  gap: 6px;
  justify-content: center
}

.kbd-key {
  background: linear-gradient(180deg, #ffffff, #d1d1d1);
  border-radius: 6px;
  border: none;
  padding: 8px 10px;
  min-width: 34px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25)
}

.kbd-key:active {
  transform: translateY(1px)
}

/* cosmetic mouse */
.mouse {
  width: 64px;
  height: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default
}

.mouse-body {
  width: 50px;
  height: 80px;
  background: linear-gradient(180deg, #ffffff, #dfe6ef);
  border-radius: 18px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.35);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden
}

.mouse-scroll {
  width: 6px;
  height: 26px;
  background: linear-gradient(180deg, #bbb, #888);
  border-radius: 3px;
  position: absolute;
  top: 22px
}

.mouse-led {
  width: 8px;
  height: 8px;
  background: #ff8;
  border-radius: 50%;
  position: absolute;
  bottom: 10px;
  right: 10px;
  box-shadow: 0 0 10px rgba(255, 200, 80, 0.5)
}

/* pc */
.pc {
  width: 320px;
  background: linear-gradient(180deg, #101417, #0b0b0b);
  border-radius: 12px;
  padding: 10px;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.5);
  color: #cfeee0;
}

.pc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px
}

.pc-power {
  padding: 8px 10px;
  border-radius: 8px;
  border: none;
  font-weight: 800;
  cursor: pointer;
  background: linear-gradient(180deg, #ddd, #bbb);
  color: #051010
}

.pc-power.on {
  background: linear-gradient(180deg, #7ef2b0, #2ed07a);
  color: #052012
}

.pc-ornaments {
  display: flex;
  align-items: center;
  gap: 8px
}

.pc-ornaments .led {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #2b2b2b;
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.04)
}

.pc-ornaments .led.on {
  background: #5effa3;
  box-shadow: 0 0 8px rgba(94, 255, 163, 0.25)
}

.pc-ornaments .vent {
  width: 42px;
  height: 10px;
  background: linear-gradient(90deg, #0b0b0b, #151515);
  border-radius: 4px;
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.02)
}

/* new PC repair buttons */
.pc-fix,
.pc-fc-re {
  padding: 6px 8px;
  border-radius: 8px;
  border: none;
  font-weight: 800;
  cursor: pointer;
  background: linear-gradient(180deg, #ffd2a6, #ffb86b);
  color: #091010;
}

.pc-fc-re {
  background: linear-gradient(180deg, #ffb6d6, #ff6b9b);
  color: #14020a;
}

/* rest unchanged */
.pc-fascia {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px
}

.pc-grill {
  height: 10px;
  background: repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.03) 0 6px, transparent 6px 12px);
  border-radius: 4px
}

.pc-front-ports {
  display: flex;
  gap: 8px;
  align-items: center
}

.port-usb {
  width: 36px;
  height: 10px;
  background: linear-gradient(180deg, #1a1a1a, #0f0f0f);
  border-radius: 3px;
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.02)
}

.port-aux {
  width: 18px;
  height: 10px;
  background: #1b1b1b;
  border-radius: 50%;
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.02)
}

.pc-leds {
  display: flex;
  gap: 6px;
  align-items: center
}

.pc-leds .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #232323;
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.02)
}

.pc-leds .dot.active {
  background: #62ffb0;
  box-shadow: 0 0 6px rgba(98, 255, 176, 0.25)
}

.pc-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pc-screen {
  height: 110px;
  background: linear-gradient(180deg, #081017, #031018);
  border-radius: 8px;
  padding: 8px;
  overflow: auto;
  font-family: ui-monospace, "Roboto Mono", monospace;
  font-size: 12px;
  color: #9fffd1;
  box-shadow: inset 0 6px 18px rgba(0, 0, 0, 0.6)
}

.pc-console pre {
  margin: 0;
  white-space: pre-wrap;
  line-height: 1.1
}

.pc-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 6px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent);
  border-radius: 6px
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 8px
}

.stat-label {
  width: 50px;
  opacity: 0.8;
  font-weight: 800;
  font-size: 12px
}

.temp-bar {
  flex: 1;
  position: relative;
  height: 18px;
  background: linear-gradient(90deg, #0b0b0b, #111);
  border-radius: 10px;
  overflow: hidden
}

.temp-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffb86b, #ff6b6b);
  width: 40%
}

.temp-value {
  position: absolute;
  right: 8px;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  font-weight: 800;
  font-size: 12px;
  padding-left: 6px
}

.fan-value {
  font-weight: 800;
  font-size: 13px;
  width: 80px
}

.fan-visual {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(180deg, #0b0b0b, #141414);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 2px 6px rgba(255, 255, 255, 0.02)
}

.gpu-info {
  font-weight: 800;
  font-size: 11px;
  color: #9fffd1;
  flex: 1;
  opacity: 0.95;
}

.fan-blade {
  width: 18px;
  height: 18px;
  background: linear-gradient(90deg, #cfeff2, #6fe0ff);
  border-radius: 3px;
}

.pc-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 6px
}

.pc-bays {
  display: flex;
  gap: 6px
}

.bay {
  width: 28px;
  height: 12px;
  background: linear-gradient(180deg, #0b0b0b, #1a1a1a);
  border-radius: 4px;
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.02)
}

/* volume box - enlarged */
.volume-box {
  width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background: linear-gradient(180deg, #0b1612, #08100e);
  border-radius: 12px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.45)
}

.volume-label {
  color: #9fe8c7;
  font-weight: 900;
  font-size: 13px
}

.knob {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(180deg, #222, #0b0b0b);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: inset 0 4px 14px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  user-select: none
}

.knob-indicator {
  position: absolute;
  top: 10px;
  left: 50%;
  width: 8px;
  height: 22px;
  background: linear-gradient(180deg, #9fe8c7, #2bbf9a);
  border-radius: 3px;
  transform-origin: 50% 80%
}

.knob-center {
  position: absolute;
  bottom: 8px;
  font-weight: 900;
  font-size: 12px;
  color: #dfffe9
}

/* improve TV controls styling */
.tv-controls {
  margin-top: 10px;
  display: flex;
  gap: 10px;
  justify-content: center;
  width: 100%
}

.tv-btn {
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  font-weight: 800;
  cursor: pointer;
  color: #081015;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.35);
  transition: transform .12s ease, box-shadow .12s ease, opacity .12s ease
}

.tv-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none
}

.tv-btn.green {
  background: linear-gradient(180deg, #7ee6b9, #38d087);
  color: #021b14
}

.tv-btn.yellow {
  background: linear-gradient(180deg, #ffe58f, #ffc94a);
  color: #241200
}

.tv-btn.blue {
  background: linear-gradient(180deg, #9ecbff, #4aa0ff);
  color: #031235
}

.tv-btn.red {
  background: linear-gradient(180deg, #ff9c9c, #ff6b6b);
  color: #290f0f
}

.tv-btn.link {
  background: transparent;
  color: #9ee8c9;
  text-decoration: underline;
  font-weight: 700;
  box-shadow: none
}

.tv-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.45)
}

.tv-btn.primary {
  background: linear-gradient(180deg, #66e6c7, #2dbf9b);
  color: #03120f
}

/* hidden input used for IME & actual typing */
.hidden-input {
  position: absolute;
  left: -9999px;
  top: -9999px;
  opacity: 0;
}

/* flyer container for clones */
.flyer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999
}

/* terminate overlay */
.terminate-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  background: rgba(0, 0, 0, 0.6)
}

.terminate-card {
  width: 720px;
  background: #081019;
  padding: 18px;
  border-radius: 10px;
  color: #ffdede;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.7)
}

.terminate-title {
  font-weight: 900;
  font-size: 18px;
  margin-bottom: 8px
}

.terminate-desc {
  margin-bottom: 12px
}

.terminate-questions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px
}

.term-q {
  display: flex;
  align-items: center;
  justify-content: space-between
}

.q-text {
  font-weight: 800
}

.q-choices button {
  margin-left: 8px;
  padding: 6px 10px;
  border-radius: 6px;
  border: none;
  cursor: pointer
}

/* Emergency Exit Door */
.emergency-exit {
  position: fixed;
  bottom: 0;
  left: 20px;
  z-index: 100;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.emergency-exit:hover {
  transform: translateX(-5px);
}

.exit-sign {
  position: relative;
  background: linear-gradient(180deg, #ff3b3b, #d32f2f);
  padding: 8px 20px;
  border-radius: 8px 8px 0 0;
  text-align: center;
  box-shadow: 0 0 20px rgba(255, 59, 59, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.2);
  border: 2px solid #fff;
  animation: exitGlow 2s ease-in-out infinite;
}

@keyframes exitGlow {

  0%,
  100% {
    box-shadow: 0 0 20px rgba(255, 59, 59, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.2);
  }

  50% {
    box-shadow: 0 0 35px rgba(255, 59, 59, 0.9), inset 0 2px 4px rgba(255, 255, 255, 0.3);
  }
}

.exit-light {
  position: absolute;
  top: -8px;
  right: 10px;
  width: 12px;
  height: 12px;
  background: #33ff33;
  border-radius: 50%;
  box-shadow: 0 0 10px #33ff33;
  animation: blink 1.5s ease-in-out infinite;
}

@keyframes blink {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.3;
  }
}

.exit-text {
  color: #fff;
  font-weight: 900;
  font-size: 18px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 3px;
}

.exit-door {
  width: 120px;
  height: 180px;
  background: linear-gradient(180deg, #1a1a1a, #0a0a0a);
  border: 3px solid #333;
  border-top: none;
  position: relative;
  box-shadow: inset 0 -5px 15px rgba(0, 0, 0, 0.6);
}

.door-panel {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #2a2a2a, #1a1a1a);
  position: relative;
  overflow: hidden;
}

.door-window {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 50px;
  background: linear-gradient(180deg, rgba(100, 150, 255, 0.3), rgba(50, 100, 200, 0.2));
  border: 2px solid #444;
  border-radius: 8px;
  box-shadow: inset 0 2px 8px rgba(100, 150, 255, 0.4);
}

.door-handle {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 8px;
  background: linear-gradient(90deg, #888, #555);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.door-stripe {
  position: absolute;
  left: 0;
  right: 0;
  height: 6px;
  background: repeating-linear-gradient(45deg,
      #ffcc00,
      #ffcc00 10px,
      #000 10px,
      #000 20px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.door-stripe:nth-child(3) {
  bottom: 60px;
}

.door-stripe:nth-child(4) {
  bottom: 40px;
}

.door-stripe:nth-child(5) {
  bottom: 20px;
}

/* Poster */
.gamer-poster {
  position: fixed;
  top: 120px;
  right: 40px;
  z-index: 50;
  transform: rotate(2deg);
  transition: transform 0.4s ease;
}

.gamer-poster:hover {
  transform: rotate(0deg) scale(1.05);
}

.poster-frame {
  width: 200px;
  height: 300px;
  background: linear-gradient(180deg, #1a1a1a, #0a0a0a);
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.7),
    inset 0 2px 4px rgba(255, 255, 255, 0.05);
  position: relative;
  border: 2px solid #2a2a2a;
}

.poster-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.poster-reflection {
  position: absolute;
  inset: 12px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, transparent 60%);
  pointer-events: none;
  border-radius: 4px;
}

/* Window with Moon */
.night-window {
  position: fixed;
  top: 40px;
  right: 480px;
  /* Changed from 280px to 380px */
  z-index: 40;
}

.window-frame {
  width: 180px;
  height: 200px;
  background: linear-gradient(180deg, #2a2a2a, #1a1a1a);
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8),
    inset 0 2px 6px rgba(255, 255, 255, 0.05);
  position: relative;
  border: 3px solid #333;
}

.window-glass {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #0a1628, #050b14);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.8);
}

.moon {
  position: absolute;
  top: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  background: radial-gradient(circle at 30% 30%, #fff9e6, #f0e68c);
  border-radius: 50%;
  box-shadow: 0 0 30px rgba(255, 249, 230, 0.6),
    0 0 60px rgba(255, 249, 230, 0.3);
  animation: moonPulse 4s ease-in-out infinite;
}

@keyframes moonPulse {

  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    transform: scale(1.05);
    opacity: 0.9;
  }
}

.moon-crater {
  position: absolute;
  width: 12px;
  height: 12px;
  background: rgba(180, 160, 100, 0.3);
  border-radius: 50%;
  top: 20px;
  left: 15px;
}

.moon-crater.small {
  width: 8px;
  height: 8px;
  top: 35px;
  left: 35px;
}

.moon-glow {
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle, rgba(255, 249, 230, 0.2), transparent 70%);
  border-radius: 50%;
  animation: glowPulse 3s ease-in-out infinite;
}

@keyframes glowPulse {

  0%,
  100% {
    opacity: 0.6;
  }

  50% {
    opacity: 1;
  }
}

.stars {
  position: absolute;
  inset: 0;
}

.star {
  position: absolute;
  width: 3px;
  height: 3px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
  animation: twinkle 3s ease-in-out infinite;
}

.star:nth-child(1) {
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.star:nth-child(2) {
  top: 40%;
  left: 70%;
  animation-delay: 0.5s;
}

.star:nth-child(3) {
  top: 60%;
  left: 30%;
  animation-delay: 1s;
}

.star:nth-child(4) {
  top: 70%;
  left: 80%;
  animation-delay: 1.5s;
}

.star:nth-child(5) {
  top: 85%;
  left: 50%;
  animation-delay: 2s;
}

@keyframes twinkle {

  0%,
  100% {
    opacity: 0.3;
  }

  50% {
    opacity: 1;
  }
}

.window-cross-h,
.window-cross-v {
  position: absolute;
  background: linear-gradient(180deg, #444, #222);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
}

.window-cross-h {
  top: 50%;
  left: 8px;
  right: 8px;
  height: 6px;
  transform: translateY(-50%);
  border-radius: 3px;
}

.window-cross-v {
  left: 50%;
  top: 8px;
  bottom: 8px;
  width: 6px;
  transform: translateX(-50%);
  border-radius: 3px;
}

/* alG button styling */
.tv-btn.purple {
  background: linear-gradient(180deg, #c9a6ff, #9b6bff);
  color: #1a0835;
}

/* Windows Desktop Environment */
.screen-windows {
  width: 100%;
  height: 100%;
  position: relative;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  overflow: hidden;
}

.windows-desktop {
  width: 100%;
  height: calc(100% - 40px);
  position: relative;
  overflow: hidden;
}

/* Desktop Icons */
.desktop-icon {
  position: absolute;
  width: 70px;
  text-align: center;
  cursor: pointer;
  user-select: none;
  padding: 6px;
  border-radius: 4px;
  transition: background 0.2s;
}

.desktop-icon:hover {
  background: rgba(255, 255, 255, 0.1);
}

.icon-img {
  font-size: 32px;
  margin-bottom: 4px;
}

.icon-label {
  font-size: 11px;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  word-wrap: break-word;
}

/* Window Frames */
.window-frame {
  position: absolute;
  background: #f0f0f0;
  border: 1px solid #7f7f7f;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  min-width: 200px;
  min-height: 150px;
}

.window-frame.active {
  box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.5);
  z-index: 100 !important;
}

.window-titlebar {
  background: linear-gradient(180deg, #0078d4, #005a9e);
  color: white;
  padding: 6px 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: move;
  user-select: none;
}

.window-icon {
  font-size: 14px;
}

.window-title {
  flex: 1;
  font-size: 13px;
  font-weight: 600;
}

.window-close {
  background: #e81123;
  border: none;
  color: white;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 14px;
  border-radius: 2px;
}

.window-close:hover {
  background: #f1707a;
}

.window-content {
  flex: 1;
  padding: 12px;
  background: white;
  overflow: auto;
  color: #333;
  font-size: 13px;
}

/* Taskbar */
.windows-taskbar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: linear-gradient(180deg, #2d2d30, #1e1e1e);
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 4px;
  border-top: 1px solid #3f3f46;
}

.start-button {
  background: linear-gradient(180deg, #0078d4, #005a9e);
  border: none;
  color: white;
  padding: 8px 16px;
  font-weight: 700;
  cursor: pointer;
  border-radius: 2px;
  font-size: 14px;
}

.start-button:hover {
  background: linear-gradient(180deg, #1084d8, #0066b0);
}

.taskbar-apps {
  flex: 1;
  display: flex;
  gap: 4px;
  overflow-x: auto;
}

.taskbar-app {
  background: rgba(255, 255, 255, 0.05);
  padding: 6px 12px;
  border-radius: 2px;
  cursor: pointer;
  font-size: 12px;
  color: #e0e0e0;
  white-space: nowrap;
  border: 1px solid transparent;
}

.taskbar-app:hover {
  background: rgba(255, 255, 255, 0.1);
}

.taskbar-app.active {
  background: rgba(255, 255, 255, 0.15);
  border-color: #0078d4;
}

.taskbar-tray {
  color: #e0e0e0;
  font-size: 12px;
  padding: 0 12px;
  font-weight: 600;
}

/* Start Menu */
.start-menu {
  position: absolute;
  bottom: 42px;
  left: 4px;
  width: 320px;
  background: linear-gradient(180deg, #2d2d30, #252526);
  border: 1px solid #3f3f46;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  overflow: hidden;
  z-index: 200;
}

.start-header {
  padding: 16px;
  background: linear-gradient(135deg, #0078d4, #005a9e);
  color: white;
}

.start-user {
  font-weight: 700;
  font-size: 15px;
}

.start-apps {
  padding: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.start-app-item {
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  border-radius: 4px;
  color: #e0e0e0;
  font-size: 14px;
}

.start-app-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.start-app-icon {
  font-size: 20px;
}

.start-footer {
  padding: 8px;
  display: flex;
  gap: 8px;
  border-top: 1px solid #3f3f46;
}

.start-action {
  flex: 1;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
  cursor: pointer;
  border-radius: 4px;
  font-size: 12px;
}

.start-action:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Windows boot screen */
.windows-boot {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
  gap: 20px;
}

.boot-logo {
  font-size: 80px;
  color: #0078d4;
  animation: logoFloat 2s ease-in-out infinite;
}

@keyframes logoFloat {

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-10px);
  }
}

.boot-text {
  font-size: 28px;
  color: #fff;
  font-weight: 700;
  letter-spacing: 2px;
}

.boot-progress {
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #0078d4, #00bcf2);
  animation: progressLoad 1.5s ease-in-out infinite;
}

@keyframes progressLoad {
  0% {
    width: 0%;
  }

  50% {
    width: 70%;
  }

  100% {
    width: 100%;
  }
}

.boot-status {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  animation: blink 1.5s ease-in-out infinite;
}

/* responsive */
@media (max-width:1300px) {
  .scene {
    gap: 14px
  }

  .pc {
    width: 260px
  }

  .tv-and-mini {
    flex-direction: column;
    align-items: center
  }

  .side-stack {
    flex-direction: row;
    gap: 12px
  }

  .mini-tv {
    width: 260px
  }

  .pc {
    width: 260px
  }

  .volume-box {
    width: 100px
  }
}

@media (max-width:980px) {
  .scene {
    flex-direction: column;
    align-items: center
  }

  .rack {
    width: 100%
  }
}
</style>