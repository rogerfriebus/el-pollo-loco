let canvas;
let world;
let keyboard = new Keyboard();
let audioManager;
let gameIntervals = [];

/**
 * Registers a game interval for later cleanup.
 * @param {Function} callback interval callback
 * @param {number} delay interval delay
 * @returns {number}
 */
function setGameInterval(callback, delay) {
  const intervalId = setInterval(callback, delay);
  gameIntervals.push(intervalId);
  return intervalId;
}

/**
 * Clears all active game intervals.
 */
function clearGameIntervals() {
  gameIntervals.forEach((intervalId) => clearInterval(intervalId));
  gameIntervals = [];
}

/**
 * Initializes all UI bindings.
 */
function init() {
  audioManager = new AudioManager();
  bindMainButtons();
  bindKeyboardEvents();
  bindMobileControls();
  bindDialogEvents();
  bindFullscreenChange();
  updateSoundButton();
  updateFullscreenButton();
}

/**
 * Binds home, start, help and restart buttons.
 */
function bindMainButtons() {
  getElement("start-button").addEventListener("click", startGame);
  getElement("help-button").addEventListener("click", openHelp);
  getElement("close-help-button").addEventListener("click", closeHelp);
  getElement("home-button").addEventListener("click", goHome);
  getElement("restart-button").addEventListener("click", startGame);
  getElement("sound-button").addEventListener("click", toggleSound);
  getElement("fullscreen-button").addEventListener("click", toggleFullscreen);
  bindEndScreenButtons();
}

/**
 * Binds game over and win screen buttons.
 */
function bindEndScreenButtons() {
  getElement("game-over-home-button").addEventListener("click", goHome);
  getElement("game-over-restart-button").addEventListener("click", startGame);
  getElement("win-home-button").addEventListener("click", goHome);
  getElement("win-restart-button").addEventListener("click", startGame);
}

/**
 * Starts a fresh game instance.
 */
async function startGame() {
  stopCurrentGame();
  hideEndScreens();
  showGameScreen();
  await audioManager.activate();
  audioManager.startBackground();
  canvas = getElement("canvas");
  world = new World(canvas, keyboard, audioManager);
  updateSoundButton();
}

/**
 * Stops the currently running game.
 */
function stopCurrentGame() {
  if (world) world.stop();
  if (audioManager) audioManager.stopBackground();
  clearGameIntervals();
  keyboard = new Keyboard();
  world = null;
}

/**
 * Switches back to the home screen.
 */
function goHome() {
  stopCurrentGame();
  hideEndScreens();
  getElement("game-screen").classList.add("hidden");
  getElement("home-screen").classList.remove("hidden");
  updateSoundButton();
}

/**
 * Shows the game area.
 */
function showGameScreen() {
  getElement("home-screen").classList.add("hidden");
  getElement("game-screen").classList.remove("hidden");
}

/**
 * Shows the game over overlay.
 */
function showGameOverScreen() {
  getElement("game-over-overlay").classList.remove("hidden");
}

/**
 * Shows the win overlay.
 */
function showWinScreen() {
  getElement("win-overlay").classList.remove("hidden");
}

/**
 * Hides all end screen overlays.
 */
function hideEndScreens() {
  getElement("game-over-overlay").classList.add("hidden");
  getElement("win-overlay").classList.add("hidden");
}

/**
 * Toggles sound state.
 */
async function toggleSound() {
  await audioManager.activate();
  audioManager.toggleMute();
  updateSoundButton();
}

/**
 * Updates the sound button label.
 */
function updateSoundButton() {
  const label = audioManager.isMuted ? "Sound: Off" : "Sound: On";
  getElement("sound-button").textContent = label;
}

/**
 * Toggles fullscreen mode.
 */
function toggleFullscreen() {
  if (document.fullscreenElement) closeFullscreen();
  else openFullscreen();
}

/**
 * Opens fullscreen mode.
 */
function openFullscreen() {
  const gameScreen = getElement("game-screen");
  if (gameScreen.requestFullscreen) gameScreen.requestFullscreen();
}

/**
 * Closes fullscreen mode.
 */
function closeFullscreen() {
  if (document.exitFullscreen) document.exitFullscreen();
}

/**
 * Updates the fullscreen button label.
 */
function updateFullscreenButton() {
  const label = document.fullscreenElement ? "Exit Fullscreen" : "Fullscreen";
  getElement("fullscreen-button").textContent = label;
}

/**
 * Binds fullscreen state changes.
 */
function bindFullscreenChange() {
  document.addEventListener("fullscreenchange", updateFullscreenButton);
}

/**
 * Binds desktop keyboard events.
 */
function bindKeyboardEvents() {
  window.addEventListener("keydown", (event) => handleKey(event, true));
  window.addEventListener("keyup", (event) => handleKey(event, false));
}

/**
 * Stores key state and blocks browser scrolling keys.
 * @param {KeyboardEvent} event keyboard event
 * @param {boolean} isPressed key state
 */
function handleKey(event, isPressed) {
  if (isGameKey(event.code)) event.preventDefault();
  keyboard.setKey(event, isPressed);
}

/**
 * Checks whether a key belongs to the game controls.
 * @param {string} code keyboard event code
 * @returns {boolean}
 */
function isGameKey(code) {
  return [
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "Space",
    "KeyD",
    "KeyH",
  ].includes(code);
}

/**
 * Binds all mobile touch buttons.
 */
function bindMobileControls() {
  bindTouchButton("touch-left", "left");
  bindTouchButton("touch-right", "right");
  bindTouchButton("touch-jump", "up");
  bindTouchButton("touch-throw", "d");
}

/**
 * Binds one touch button.
 * @param {string} buttonId touch button id
 * @param {string} key keyboard property name
 */
function bindTouchButton(buttonId, key) {
  const button = getElement(buttonId);
  button.addEventListener("touchstart", (event) =>
    setTouchKey(event, key, true),
  );
  button.addEventListener("touchend", (event) =>
    setTouchKey(event, key, false),
  );
  button.addEventListener("contextmenu", (event) => event.preventDefault());
}

/**
 * Updates keyboard state from touch input.
 * @param {TouchEvent} event touch event
 * @param {string} key keyboard property name
 * @param {boolean} isPressed key state
 */
function setTouchKey(event, key, isPressed) {
  event.preventDefault();
  keyboard[key] = isPressed;
}

/**
 * Opens the help dialog.
 */
function openHelp() {
  const dialog = getElement("help-dialog");
  if (dialog.showModal) dialog.showModal();
  else dialog.setAttribute("open", "");
}

/**
 * Closes the help dialog.
 */
function closeHelp() {
  getElement("help-dialog").close();
}

/**
 * Binds dialog backdrop click.
 */
function bindDialogEvents() {
  getElement("help-dialog").addEventListener("click", closeOnBackdropClick);
}

/**
 * Closes dialog when backdrop is clicked.
 * @param {MouseEvent} event click event
 */
function closeOnBackdropClick(event) {
  const dialog = getElement("help-dialog");
  if (event.target === dialog) closeHelp();
}

/**
 * Returns one DOM element.
 * @param {string} id element id
 * @returns {HTMLElement}
 */
function getElement(id) {
  return document.getElementById(id);
}

window.addEventListener("DOMContentLoaded", init);
