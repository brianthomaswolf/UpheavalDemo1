/**
 * SF2 Engine Playground — ARCADE / VERSUS PLAYTEST DEMO
 * =============================================================
 * Standalone combat playtest build. Boots directly into character select.
 * Core systems: unified Fighter class, universal input checklist, 12-frame AI
 * reaction + 15-frame movement commitment timers, shuriken rotation, TV
 * midground parallax cross-fade, and full audio layers.
 */

// =============================================================================
// 1. GLOBAL CONFIGURATION & GAME STATES
// =============================================================================

const VIEWPORT_WIDTH = 384;
const VIEWPORT_HEIGHT = 224;
const STAGE_WIDTH = 640;
const STAGE_HEIGHT = 224;
const GROUND_Y = 208;
const FLOOR_Y = GROUND_Y;
const STAGE_LEFT = 0;
const STAGE_RIGHT = STAGE_WIDTH;

const PARALLAX_SKY = 0.1;
const PARALLAX_MID = 0.4;
const PARALLAX_FLOOR = 1.0;
const BG_PROP_FRAME_COUNT = 4;
const TICKS_PER_FRAME = 150;
const HAZARD_TICKS_PER_FRAME = 3;

const WALK_SPEED = 2.5;
const CPU_WALK_SPEED = 2;
const JUMP_VELOCITY = -7.2;
const GRAVITY = 0.42;
const MAX_FALL_SPEED = 9;
const STAND_HEIGHT = 72;
const CROUCH_HEIGHT = 44;
const FIGHTER_WIDTH = 24;
const PUSH_BOX_HALF_WIDTH = 30;
const PUSH_BOX_PADDING_Y = 2;

const GROUND_ATTACK_FRAME_COUNT = 4;
const CROUCH_ATTACK_FRAME_COUNT = 2;
const ATTACK_TICKS_PER_FRAME = 4;
const IDLE_FRAME_COUNT = 9;
const IDLE_TICKS_PER_FRAME = 9;
const WALK_FRAME_COUNT = 5;
const WALK_TICKS_PER_FRAME = 6;
const PRE_JUMP_TICKS = 3;
const LAND_RECOVERY_TICKS = 4;
const JUMP_FORWARD_SPEED = 4;
const JUMP_BACKWARD_SPEED = 3.5;
const CROUCH_JUMP_BUFFER_FRAMES = 10;
const SUPER_JUMP_VELOCITY = -12;
const SUPER_JUMP_STEER_SPEED = 4.5;
const SUPER_JUMP_VX_DECAY = 0.35;
const CROSSOVER_HEAD_CLEARANCE = 80;
const FLOOR_SHADOW_SUPER_MAX_ALTITUDE = 200;

const PUNCH_REACH = 22;
const PUNCH_HEIGHT = 18;
const KICK_REACH = 30;
const KICK_HEIGHT = 22;
const JUMP_ATTACK_WIDTH = 40;
const JUMP_ATTACK_HEIGHT = 30;

const HIT_DAMAGE = 10;
const MAX_HEALTH = 100;
const HIT_KNOCKBACK = 10;
const HIT_STUN_DURATION = 12;
const HIT_STUN_KNOCKBACK_PER_TICK = HIT_KNOCKBACK / HIT_STUN_DURATION;
const KO_FLY_VELOCITY_Y = -7;
const KO_FLY_VELOCITY_X = 3;
const KO_FLY_GRAVITY = 0.3;
const BLOCK_SPARK_DURATION = 6;
const PROJECTILE_CAST_TICKS = 6;
const SPECIAL_CAST_FRAME_COUNT = 2;
const PROJECTILE_SPAWN_Y_OFFSET = 15;
const PROJECTILE_DAMAGE = 12;
const MOTION_COMMAND_WINDOW_MS = 500;
const CPU_BLOCK_FAIL_CHANCE = 0.4;
const CPU_APPROACH_RANGE = 72;
const CPU_DECISION_TICKS = 15;
const CPU_MELEE_RANGE = 120;
const CPU_FORWARD_JUMP_CHANCE = 0.18;
const CPU_CORNER_TRAP_X_MIN = 10;
const CPU_CORNER_TRAP_X_MAX = 620;
const CPU_ANTI_AIR_CHANCE = 0.4;

const ROUND_TIMER_START = 99;
const ROUND_TIMER_INTERVAL_MS = 1000;
const ROUNDS_TO_WIN = 2;
const ROUND_INTERMISSION_MS = 2000;
const KO_DELAY_FRAMES = 90;
const SCREEN_SHAKE_DURATION = 18;
const SCREEN_SHAKE_INTENSITY = 3;

const HEALTH_BAR_WIDTH = 112;
const HEALTH_BAR_HEIGHT = 8;
const HEALTH_BAR_Y = 6;
const HUD_OUTLINE_WIDTH = 3;
const FIGHTER_HUD_NAME_GAP = 5;
const FIGHTER_HUD_NAME_Y = HEALTH_BAR_Y + HEALTH_BAR_HEIGHT + 1 + FIGHTER_HUD_NAME_GAP;
const FIGHTER_HUD_DOT_Y = FIGHTER_HUD_NAME_Y + 10;
const VICTORY_DOT_SIZE = 12;
const VICTORY_DOT_GAP = 4;

const PLAYER1_SPAWN_X = 180;
const PLAYER2_SPAWN_X = STAGE_WIDTH - 180 - 48;

const FLOOR_SHADOW_BASE_OPACITY = 0.35;
const FLOOR_SHADOW_MIN_OPACITY = 0.18;
const FLOOR_SHADOW_MAX_ALTITUDE = 64;
const FLOOR_SHADOW_WIDTH_RATIO = 0.55;
const FLOOR_SHADOW_HEIGHT = 5;
const KABUKI_SHADOW_FEET_INSET_RATIO = 0.28;

const CHARACTER_UPHEAVAL = 'UPHEAVAL';
const CHARACTER_CRIMSON_KABUKI = 'CRIMSON_KABUKI';

const GAME_STATE = {
  CHAR_SELECT: 'CHAR_SELECT',
  FIGHT_STAGE: 'FIGHT_STAGE',
  MATCH_OVER_DOCUMENTATION: 'MATCH_OVER_DOCUMENTATION',
};

const DEMO_MENU_OPTIONS = [
  'ARCADE MODE',
  'VERSUS',
];

const MENU_OPTIONS = DEMO_MENU_OPTIONS;

const MENU_ITEM_START_Y = 72;
const MENU_ITEM_LINE_HEIGHT = 28;
const MENU_TEXT_X = 112;
const MENU_CURSOR_X = 84;
const MENU_SLIDE_SPEED = 24;
const TITLE_FLASH_INTERVAL = 30;

const CHAR_GRID_COLS = 3;
const CHAR_GRID_ROWS = 2;
const CHAR_SLOT_SIZE = 32;
const CHAR_GRID_GAP = 8;
const CHAR_GRID_START_X =
  (VIEWPORT_WIDTH - (CHAR_GRID_COLS * CHAR_SLOT_SIZE + (CHAR_GRID_COLS - 1) * CHAR_GRID_GAP)) * 0.5;
const CHAR_GRID_START_Y = 88;
const CHAR_PREVIEW_X = 12;
const CHAR_PREVIEW_Y = 60;
const CHAR_PREVIEW_WIDTH = 96;
const CHAR_PREVIEW_HEIGHT = 136;
const CHAR_PREVIEW_RIGHT_X = VIEWPORT_WIDTH - CHAR_PREVIEW_WIDTH - 12;
const CHAR_SELECT_LOCK_IN_DURATION = 30;

const TUTORIAL_TEXT_X = 16;
const TUTORIAL_MOVE_LIST_START_Y = 30;
const TUTORIAL_MOVE_LINE_HEIGHT = 19;
const TUTORIAL_PREVIEW_X = 232;
const TUTORIAL_PREVIEW_Y = 48;
const TUTORIAL_ANIM_TICKS = 6;

const tutorialMoves = [
  'STANDARD PUNCH',
  'STANDARD KICK',
  'CROUCH PUNCH',
  'CROUCH KICK',
  'JUMP ATTACK',
  'STANDING BLOCK',
  'CROUCH BLOCK',
  'PROJECTILE ATTACK',
  'SUPER JUMP',
];

const moveInstructions = [
  'PRESS: J (Standing)',
  'PRESS: K (Standing)',
  'HOLD: S + PRESS: J',
  'HOLD: S + PRESS: K',
  'IN AIR + PRESS: J or K',
  'HOLD: A (While Attacked)',
  'HOLD: S + A (While Attacked)',
  'MOTION: S -> D -> J',
  'HOLD: S -> PRESS: W (Steer in Air)',
];

const TUTORIAL_INSTRUCTION_X = 280;
const TUTORIAL_INSTRUCTION_Y = 175;
const TUTORIAL_INSTRUCTION_MAX_WIDTH = 140;
const TUTORIAL_INSTRUCTION_LINE1_Y = 170;
const TUTORIAL_INSTRUCTION_LINE2_Y = 182;
const TUTORIAL_DEMO_LAUNCH_X = 250;
const TUTORIAL_DEMO_LANE_Y = 75;
const TUTORIAL_DEMO_PROJ_SIZE = 24;
const TUTORIAL_DEMO_PROJ_MAX_X = 140;

const P1_CONTROLS = {
  left: 'KeyA', right: 'KeyD', up: 'KeyW', down: 'KeyS', punch: 'KeyJ', kick: 'KeyK',
};
const P2_UPHEAVAL_CONTROLS = {
  left: 'ArrowLeft', right: 'ArrowRight', up: 'ArrowUp', down: 'ArrowDown',
  punch: 'Numpad1', kick: 'Numpad2',
};
const P2_KABUKI_CONTROLS = {
  left: 'ArrowLeft', right: 'ArrowRight', up: 'ArrowUp', down: 'ArrowDown',
  punch: 'Numpad1', kick: 'Numpad2',
};
const CPU_REACTION_DELAY_FRAMES = 12;
const AI_ACTION_COMMIT_FRAMES = 15;
let aiReactionCounter = 0;
let aiActionTimer = 0;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const battleMusic = new Audio('assets/stage1_music.mp3');
battleMusic.loop = true;
battleMusic.volume = 0.35;

const menuMusic = new Audio("assets/title_screen.mp3");
menuMusic.loop = true;
menuMusic.volume = 0.3;

const sfxChooseFighter = new Audio("assets/choose_your_fighter.wav");
const sfxCharSelected = new Audio("assets/character_selected.wav");
const sfxRound1 = new Audio("assets/round_one.wav");
const sfxRound2 = new Audio("assets/round_two.wav");
const sfxFinalRound = new Audio("assets/final_round.wav");
const sfxVictoryVoice = new Audio("assets/victory.wav");
const sfxPunch = new Audio("assets/punch.wav");
const sfxKick = new Audio("assets/kick.wav");

const camera = { x: 0 };
const keysDown = {};
const keysPressed = {};

let currentScene = GAME_STATE.CHAR_SELECT;
let currentMode = 'ARCADE MODE';
let p1Selected = CHARACTER_UPHEAVAL;
let p2Selected = CHARACTER_CRIMSON_KABUKI;
let p1RoundWins = 0;
let p2RoundWins = 0;
let roundTimer = ROUND_TIMER_START;
let roundTimerLastTickMs = 0;
let bgTickCounter = 0;
let bgFrameIndex = 0;
let hazardTickCounter = 0;
let hazardFrameIndex = 0;

const sceneUI = {
  menuIndex: 0,
  titleFlashTimer: 0,
  menuSlideOffset: VIEWPORT_WIDTH,
  menuTransitionActive: false,
  charSelectCol: 0,
  charSelectRow: 0,
  charSelectPhase: 'P1',
  charSelectP1Locked: false,
  charSelectLockInActive: false,
  charSelectLockInTimer: 0,
  tutorialMoveIndex: 0,
  tutorialAnimFrame: 0,
  tutorialAnimTick: 0,
  tutorialDemoProjX: 0,
};

const matchState = {
  frozen: false,
  roundWinnerLocked: false,
  roundIntermissionEndsAt: 0,
  p1WinsOverlay: false,
  p2WinsOverlay: false,
  screenShakeTimer: 0,
  koDelayTimer: 0,
  pendingKoWinner: null,
};

let p1 = null;
let p2 = null;
let activeProjectiles = [];
const motionCommandBuffers = {
  P1: { steps: [], startMs: 0, lastMs: 0 },
  P2: { steps: [], startMs: 0, lastMs: 0 },
};

class Projectile {
  constructor(x, y, speed, owner, type, image) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.owner = owner;
    this.type = type;
    this.launchX = x;
    this.ownerSlot = owner?.slot || 'P1';
    this.image = image;
    this.width = image?.naturalWidth || image?.width || 32;
    this.height = image?.naturalHeight || image?.height || 32;
    this.rotation = 0;
  }

  update() {
    this.x += this.speed;
    if (this.type === 'SHURIKEN') this.rotation += 0.2;
  }
}

// =============================================================================
// 2. ASSET MANIFEST REGISTRY
// =============================================================================

const studioSplashImg = new Image();
studioSplashImg.src = 'assets/summittitle_bg.png';

const menuBgImg = new Image();
menuBgImg.src = 'assets/menu_bg.png';

const charselectBgImg = new Image();
charselectBgImg.src = 'assets/charselect_bg.png';

const playerKoFlyImg = new Image();
playerKoFlyImg.src = 'assets/player_ko_fly.png';

const rivalKoFlyImg = new Image();
rivalKoFlyImg.src = 'assets/rival_ko_fly.png';

const storySlides = [
  { isTitleCard: true, text: 'STAGE 1' },
  { img: null, text: 'SEARCHING FOR ANSWERS, POPPI HAS COME TO MAZONA INDUSTRIES.' },
  { img: null, text: 'FROM FAR AWAY, THE CRIMSON KABUKI ARE SUMMONED TO DEAL WITH THE THREAT OF UPHEAVAL.' },
  { img: null, text: 'IN A SURPRISE ATTACK... ENTER THE CRIMSON KABUKI!' },
];

storySlides[1].img = new Image(); storySlides[1].img.src = "assets/stage_1_story1.png";
storySlides[2].img = new Image(); storySlides[2].img.src = "assets/stage_1_story2.png";
storySlides[3].img = new Image(); storySlides[3].img.src = "assets/stage_1_story3.png";

const STORY_FIGHT_FADE_FRAMES = 60;

let activeSlideIndex = 0;
let slideX = VIEWPORT_WIDTH;
let isTransitioning = false;
let hideHeader = false;
let storyFightFade = 0;

function rangePaths(folder, prefix, start, end, pad = '') {
  const paths = [];
  for (let i = start; i <= end; i += 1) {
    paths.push(`assets/${folder}${prefix}${pad}${i}.png`);
  }
  return paths;
}

function buildUpheavalManifest() {
  return {
    id: CHARACTER_UPHEAVAL,
    displayName: 'UPHEAVAL',
    fullMoveset: true,
    shadowFeetInset: 0,
    paths: {
      idle: rangePaths('', 'player_idle', 1, 9),
      walkForward: rangePaths('', 'walk_f_', 1, 5),
      walkBackward: rangePaths('', 'walk_b_', 1, 5),
      punch: rangePaths('', 'player_punch', 1, 4),
      kick: rangePaths('', 'player_kick', 1, 4),
      block: 'assets/block.png',
      crouch: 'assets/player_crouch.png',
      crouchBlock: 'assets/player_crouch_block.png',
      crouchPunch: 'assets/player_crouch_punch.png',
      crouchKick: 'assets/player_crouch_kick.png',
      jumpCrouch: 'assets/jump_crouch.png',
      jumpRise: 'assets/jump_rise.png',
      jumpAttack: 'assets/jump_attack.png',
      jumpDescend: 'assets/jump_descend.png',
      jumpLand: 'assets/jump_land.png',
      hit: 'assets/player_hit.png',
      koFly: 'assets/player_ko_fly.png',
      koGround: 'assets/player_ko_ground.png',
      droneAttack: rangePaths('', 'player_drone_pose', 1, 2),
      drone: 'assets/player_drone.png',
    },
  };
}

function buildKabukiManifest() {
  return {
    id: CHARACTER_CRIMSON_KABUKI,
    displayName: 'THE CRIMSON KABUKI',
    fullMoveset: true,
    shadowFeetInset: KABUKI_SHADOW_FEET_INSET_RATIO,
    paths: {
      idle: rangePaths('', 'rival_idle', 1, 9),
      walkForward: rangePaths('', 'rival_walk_f_', 1, 5),
      walkBackward: rangePaths('', 'rival_walk_b_', 1, 5),
      punch: rangePaths('', 'rival_punch', 1, 4),
      kick: rangePaths('', 'rival_kick', 1, 4),
      block: 'assets/rival_block.png',
      crouch: 'assets/rival_crouch.png',
      crouchBlock: 'assets/rival_crouch_block.png',
      crouchPunch: rangePaths('', 'rival_punch', 1, 4),
      crouchKick: rangePaths('', 'rival_kick', 1, 4),
      jumpCrouch: 'assets/rival_jump_crouch.png',
      jumpRise: 'assets/rival_jump_rise.png',
      jumpAttack: 'assets/rival_jump_attack.png',
      jumpDescend: 'assets/rival_jump_descend.png',
      jumpLand: 'assets/rival_jump_land.png',
      hit: 'assets/rival_hit.png',
      koFly: 'assets/rival_ko_fly.png',
      koGround: 'assets/rival_ko_ground.png',
      shurikenAttack: rangePaths('', 'rival_shuriken_pose', 1, 2),
      shuriken: 'assets/rival_shuriken.png',
    },
  };
}

const CHARACTER_MANIFEST = {
  [CHARACTER_UPHEAVAL]: buildUpheavalManifest(),
  [CHARACTER_CRIMSON_KABUKI]: buildKabukiManifest(),
};

/** Per-character manual sprite draw offsets keyed by animation state. */
const SPRITE_DRAW_CONFIG = {
  DEFAULT: { offsetX: 0, offsetY: 0 },
  UPHEAVAL: {
    IDLE: { offsetX: 0, offsetY: 0 },
    WALK_FORWARD: { offsetX: 0, offsetY: 0 },
    WALK_BACKWARD: { offsetX: 0, offsetY: 0 },
    PUNCH: { offsetX: 0, offsetY: 0 },
    KICK: { offsetX: 0, offsetY: 0 },
    BLOCK: { offsetX: 0, offsetY: 0 },
    CROUCH: { offsetX: 0, offsetY: 0 },
    CROUCH_BLOCK: { offsetX: 0, offsetY: 0 },
    CROUCH_PUNCH: { offsetX: 0, offsetY: 0 },
    CROUCH_KICK: { offsetX: 0, offsetY: 0 },
    PRE_JUMP: { offsetX: 0, offsetY: 0 },
    JUMP_RISE: { offsetX: 0, offsetY: 0 },
    JUMP_DESCEND: { offsetX: 0, offsetY: 0 },
    JUMP_ATTACK: { offsetX: 0, offsetY: 0 },
    LAND_RECOVERY: { offsetX: 0, offsetY: 0 },
    DRONE_ATTACK: { offsetX: 0, offsetY: 0 },
    SHURIKEN_ATTACK: { offsetX: 0, offsetY: 0 },
  },
  CRIMSON_KABUKI: {
    IDLE: { offsetX: 0, offsetY: 0 },
    WALK_FORWARD: { offsetX: 0, offsetY: 0 },
    WALK_BACKWARD: { offsetX: 0, offsetY: 0 },
    PUNCH: { offsetX: 0, offsetY: 0 },
    KICK: { offsetX: 0, offsetY: 0 },
    BLOCK: { offsetX: 0, offsetY: 0 },
    CROUCH: { offsetX: 0, offsetY: 0 },
    CROUCH_BLOCK: { offsetX: 0, offsetY: 0 },
    CROUCH_PUNCH: { offsetX: 0, offsetY: 0 },
    CROUCH_KICK: { offsetX: 0, offsetY: 0 },
    PRE_JUMP: { offsetX: 0, offsetY: 0 },
    JUMP_RISE: { offsetX: 0, offsetY: 0 },
    JUMP_DESCEND: { offsetX: 0, offsetY: 0 },
    JUMP_ATTACK: { offsetX: 0, offsetY: 0 },
    LAND_RECOVERY: { offsetX: 0, offsetY: 0 },
    DRONE_ATTACK: { offsetX: 0, offsetY: 0 },
    SHURIKEN_ATTACK: { offsetX: 0, offsetY: 0 },
  },
};

const STAGE_MANIFEST = {
  sky: 'assets/stage1_sky.png',
  mid: 'assets/stage1_mid.png',
  floor: 'assets/stage1_floor.png',
  tvLoopFrames: Array.from({ length: BG_PROP_FRAME_COUNT }, (_, i) => `assets/tv_loop${i + 1}.png`),
  hazardFrames: Array.from({ length: BG_PROP_FRAME_COUNT }, (_, i) => `assets/fire_spark${i + 1}.png`),
};

const UI_MANIFEST = {
  titleBg: 'assets/title_bg.png',
  menuCursor: 'assets/menu_cursor.png',
  charSelectBg: 'assets/charselect_bg.png',
  charSelectSlot: 'assets/charselect_slot.png',
  charHeroIcon: 'assets/char_hero_icon.png',
  charHeroLarge: 'assets/char_hero_large.png',
  charRivalIcon: 'assets/char_rival_icon.png',
  charRivalLarge: 'assets/char_rival_large.png',
  victoryDotEmpty: 'assets/victory_dot_empty.png',
  victoryDotFilled: 'assets/victory_dot_filled.png',
};

const loadedImages = {
  stage: {},
  ui: {},
  characters: {},
};

function loadImage(path) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load: ${path}`));
    img.src = path;
  });
}

async function loadPathOrNull(path) {
  if (!path) return null;
  try {
    return await loadImage(path);
  } catch {
    return null;
  }
}

async function loadImageSafe(path, fallbackPath = null) {
  const loaded = await loadPathOrNull(path);
  if (loaded && (loaded.naturalWidth > 0 || loaded.width > 0)) return loaded;
  if (fallbackPath && fallbackPath !== path) return loadPathOrNull(fallbackPath);
  return null;
}

async function loadImageArraySafe(paths, fallbackPath) {
  const images = await Promise.all(paths.map((path) => loadImageSafe(path, fallbackPath)));
  const defaultFrame = images.find((img) => img && (img.naturalWidth > 0 || img.width > 0)) || null;
  return images.map((img) => (
    img && (img.naturalWidth > 0 || img.width > 0) ? img : defaultFrame
  ));
}

async function loadCharacterAssets(characterId) {
  const manifest = CHARACTER_MANIFEST[characterId];
  const paths = manifest.paths;
  const fallbackIdle = paths.idle[0];
  const [
    idle, walkForward, walkBackward, punch, kick,
    block, crouch, crouchBlock, crouchPunch, crouchKick,
    jumpCrouch, jumpRise, jumpAttack, jumpDescend, jumpLand,
    hit, koFly, koGround,
    droneAttack, drone, shurikenAttack, shuriken,
  ] = await Promise.all([
    loadImageArraySafe(paths.idle, fallbackIdle),
    loadImageArraySafe(paths.walkForward, fallbackIdle),
    loadImageArraySafe(paths.walkBackward, fallbackIdle),
    loadImageArraySafe(paths.punch, fallbackIdle),
    loadImageArraySafe(paths.kick, fallbackIdle),
    loadImageSafe(paths.block, fallbackIdle),
    loadImageSafe(paths.crouch, fallbackIdle),
    loadImageSafe(paths.crouchBlock, fallbackIdle),
    loadImageSafe(paths.crouchPunch, fallbackIdle),
    loadImageSafe(paths.crouchKick, fallbackIdle),
    loadImageSafe(paths.jumpCrouch, fallbackIdle),
    loadImageSafe(paths.jumpRise, fallbackIdle),
    loadImageSafe(paths.jumpAttack, fallbackIdle),
    loadImageSafe(paths.jumpDescend, fallbackIdle),
    loadImageSafe(paths.jumpLand, fallbackIdle),
    loadImageSafe(paths.hit, fallbackIdle),
    loadImageSafe(paths.koFly, fallbackIdle),
    loadImageSafe(paths.koGround, fallbackIdle),
    paths.droneAttack ? loadImageArraySafe(paths.droneAttack, fallbackIdle) : Promise.resolve(null),
    loadImageSafe(paths.drone, fallbackIdle),
    paths.shurikenAttack ? loadImageArraySafe(paths.shurikenAttack, fallbackIdle) : Promise.resolve(null),
    loadImageSafe(paths.shuriken, fallbackIdle),
  ]);

  loadedImages.characters[characterId] = {
    idle, walkForward, walkBackward, punch, kick,
    block, crouch, crouchBlock, crouchPunch, crouchKick,
    jumpCrouch, jumpRise, jumpAttack, jumpDescend, jumpLand,
    hit, koFly, koGround,
    droneAttack, drone, shurikenAttack, shuriken,
  };
}

function loadTrackedPropImage(path) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      console.log('SUCCESS: Loaded ' + img.src);
      resolve(img);
    };
    img.onerror = () => {
      console.error('CRITICAL ERROR: Failed to find ' + img.src + '. Check your folder spelling and capitalization!');
      resolve(null);
    };
    img.src = path;
  });
}

async function loadTvLoopFrames() {
  const frames = [];
  for (let i = 1; i <= BG_PROP_FRAME_COUNT; i += 1) {
    const img = await loadTrackedPropImage(`assets/tv_loop${i}.png`);
    if (img && (img.naturalWidth > 0 || img.width > 0)) frames.push(img);
  }
  return frames;
}

async function loadHazardFrames() {
  const frames = [];
  for (let i = 1; i <= BG_PROP_FRAME_COUNT; i += 1) {
    const img = await loadTrackedPropImage(`assets/fire_spark${i}.png`);
    if (img && (img.naturalWidth > 0 || img.width > 0)) frames.push(img);
  }
  return frames;
}

async function loadAllAssets() {
  const [sky, mid, floor, tvLoopFrames, hazardFrames] = await Promise.all([
    loadImage(STAGE_MANIFEST.sky),
    loadImage(STAGE_MANIFEST.mid),
    loadImage(STAGE_MANIFEST.floor),
    loadTvLoopFrames(),
    loadHazardFrames(),
  ]);
  loadedImages.stage = { sky, mid, floor, tvLoopFrames, hazardFrames };

  const uiEntries = await Promise.all(
    Object.entries(UI_MANIFEST).map(async ([key, path]) => [key, await loadImage(path)])
  );
  loadedImages.ui = Object.fromEntries(uiEntries);

  await loadCharacterAssets(CHARACTER_UPHEAVAL);
  await loadCharacterAssets(CHARACTER_CRIMSON_KABUKI);
}

// =============================================================================
// 3. THE MASTER 'FIGHTER' CLASS COMPONENT
// =============================================================================

class Fighter {
  constructor({ x, facing, characterId, controls, slot, isCpu = false }) {
    this.x = x;
    this.y = GROUND_Y - STAND_HEIGHT;
    this.facing = facing;
    this.characterId = characterId;
    this.controls = controls;
    this.slot = slot;
    this.isCpu = isCpu;
    this.manifest = CHARACTER_MANIFEST[characterId];
    this.assets = loadedImages.characters[characterId] || null;

    this.health = MAX_HEALTH;
    this.maxHealth = MAX_HEALTH;
    this.state = 'IDLE';
    this.currentFrame = 0;
    this.tickCounter = 0;
    this.stateTimer = 0;

    this.vx = 0;
    this.vy = 0;
    this.width = FIGHTER_WIDTH;
    this.height = STAND_HEIGHT;
    this.onGround = true;
    this.isAirborne = false;
    this.isCrouching = false;
    this.jumpLocked = false;
    this.jumpLockedVx = 0;
    this.crouchBuffer = 0;
    this.isSuperJump = false;
    this.isAttacking = false;
    this.attackType = null;
    this.attackHitConnected = false;
    this.jumpAttackHitConnected = false;
    this.isJumpAttacking = false;
    this.hitActive = false;
    this.hitStunTimer = 0;
    this.hitStunKnockbackDir = 0;
    this.combatReaction = null;
    this.isKnockedOut = false;
    this.lastBlockSparkStrikeId = '';
    this.specialProjectileSpawned = false;
    this.cpuBlockWillSucceed = true;
    this.cpuBlockRolled = false;
    this.cpuAttackCooldown = 0;
    this.cpuForcedJumpVx = 0;
    this.cpuSuperJumpSteer = 0;
    this.cpuIntent = null;
    this.cpuHeldMovement = { left: false, right: false, down: false };
    this.inputs = { left: false, right: false, up: false, down: false, punch: false, kick: false };
    this.inputPressed = { up: false, punch: false, kick: false };
  }

  setState(newState) {
    if (this.state === newState) return false;
    this.state = newState;
    this.currentFrame = 0;
    this.tickCounter = 0;
    return true;
  }

  isHumanControlled() {
    return !this.isCpu && (this.slot === 'P1' || (this.slot === 'P2' && isTwoPlayerMode()));
  }

  getControlMap() {
    return this.slot === 'P1' ? P1_CONTROLS : this.controls;
  }

  clearInputs() {
    this.inputs.left = false;
    this.inputs.right = false;
    this.inputs.up = false;
    this.inputs.down = false;
    this.inputs.punch = false;
    this.inputs.kick = false;
    this.inputPressed.up = false;
    this.inputPressed.punch = false;
    this.inputPressed.kick = false;
    this.cpuIntent = null;
  }

  collectHumanInputs() {
    const c = this.getControlMap();
    this.inputs.left = Boolean(keysDown[c.left]);
    this.inputs.right = Boolean(keysDown[c.right]);
    this.inputs.up = Boolean(keysDown[c.up]);
    this.inputs.down = Boolean(keysDown[c.down]);
    this.inputs.punch = Boolean(keysDown[c.punch]);
    this.inputs.kick = Boolean(keysDown[c.kick]);
    this.inputPressed.up = Boolean(keysPressed[c.up]);
    this.inputPressed.punch = Boolean(keysPressed[c.punch]);
    this.inputPressed.kick = Boolean(keysPressed[c.kick]);
  }

  getWalkBackInputKey() {
    return this.facing === 1 ? 'left' : 'right';
  }

  getWalkForwardInputKey() {
    return this.facing === 1 ? 'right' : 'left';
  }

  isWalkBackHeld() {
    return this.inputs[this.getWalkBackInputKey()];
  }

  applyCpuHeldMovement() {
    this.inputs.left = this.cpuHeldMovement.left;
    this.inputs.right = this.cpuHeldMovement.right;
    this.inputs.down = this.cpuHeldMovement.down;
  }

  commitCpuMovement() {
    this.cpuHeldMovement.left = this.inputs.left;
    this.cpuHeldMovement.right = this.inputs.right;
    this.cpuHeldMovement.down = this.inputs.down;
  }

  populateCpuInputs(opponent) {
    if (!this.isControllable()) return;

    const dist = this.getCpuThreatDistance(opponent);
    const towardKey = opponent.x >= this.x ? 'right' : 'left';
    const backKey = this.getWalkBackInputKey();
    this.facing = opponent.x >= this.x ? 1 : -1;

    if (this.isAirborne && this.isSuperJump) {
      if (this.cpuSuperJumpSteer > 0) this.inputs.right = true;
      else if (this.cpuSuperJumpSteer < 0) this.inputs.left = true;
      return;
    }

    const cornerTrapped =
      (this.x <= CPU_CORNER_TRAP_X_MIN || this.x >= CPU_CORNER_TRAP_X_MAX) &&
      dist <= CPU_MELEE_RANGE;
    if (cornerTrapped && !this.isInJumpSequence()) {
      this.inputs.down = true;
      this.inputPressed.up = true;
      this.cpuSuperJumpSteer = opponent.x >= this.x ? 1 : -1;
      return;
    }

    if (this.onGround && !this.isAttacking && !this.isJumpInputLocked()) {
      const threatActive = this.isOpponentAttackThreat(opponent);
      if (threatActive) {
        aiReactionCounter += 1;
      } else {
        aiReactionCounter = 0;
      }

      if (threatActive && aiReactionCounter >= CPU_REACTION_DELAY_FRAMES) {
        if (this.isLowAttackThreat(opponent)) {
          this.inputs.down = true;
          this.inputs[backKey] = true;
          return;
        }
        if (
          opponent.state === 'PUNCH' ||
          opponent.state === 'KICK' ||
          opponent.state === 'PROJECTILE_ATTACK' ||
          this.isIncomingProjectileThreat(opponent)
        ) {
          this.inputs[backKey] = true;
          return;
        }
      }
    }

    if (this.isAttacking || this.isJumpInputLocked()) return;

    if (this.isOpponentJumpThreat(opponent) && Math.random() < CPU_ANTI_AIR_CHANCE) {
      this.inputs[backKey] = true;
      return;
    }

    this.cpuAttackCooldown += 1;
    if (this.cpuAttackCooldown < CPU_DECISION_TICKS) {
      if (aiActionTimer > 0) {
        aiActionTimer -= 1;
        this.applyCpuHeldMovement();
      }
      return;
    }
    this.cpuAttackCooldown = 0;

    if (dist <= CPU_MELEE_RANGE) {
      const meleeRoll = Math.random();
      if (meleeRoll < 0.2) {
        this.cpuIntent = 'projectile';
        return;
      }
      if (meleeRoll < 0.3) {
        this.inputPressed.punch = true;
        return;
      }
      if (meleeRoll < 0.6) {
        this.inputPressed.kick = true;
        return;
      }
      if (meleeRoll < 0.85) {
        this.cpuIntent = Math.random() < 0.5 ? 'crouch_punch' : 'crouch_kick';
        this.inputs.down = true;
        return;
      }
    }

    if (aiActionTimer > 0) {
      aiActionTimer -= 1;
      this.applyCpuHeldMovement();
      return;
    }

    if (dist > CPU_MELEE_RANGE) {
      const roll = Math.random();
      if (roll < 0.55) {
        this.inputs[towardKey] = true;
      } else if (roll < 0.65) {
        this.inputs[backKey] = true;
      } else if (roll < 0.65 + CPU_FORWARD_JUMP_CHANCE) {
        this.inputPressed.up = true;
        this.cpuForcedJumpVx = (towardKey === 'right' ? 1 : -1) * JUMP_FORWARD_SPEED;
      }
      this.commitCpuMovement();
      aiActionTimer = AI_ACTION_COMMIT_FRAMES;
      return;
    }

    if (Math.random() < 0.5) {
      this.inputs.down = true;
      this.inputs[backKey] = true;
    } else {
      this.inputs[backKey] = true;
    }
    this.commitCpuMovement();
    aiActionTimer = AI_ACTION_COMMIT_FRAMES;
  }

  executeFighterInputs(opponent) {
    if (!this.isControllable()) return;

    const inp = this.inputs;
    const pressed = this.inputPressed;
    const motionBufferActive = (motionCommandBuffers[this.slot]?.steps.length || 0) > 0;

    if (this.isHumanControlled() && this.tryMotionCommandSpecial()) return;

    if (this.cpuIntent === 'projectile') {
      this.startProjectileAttack();
      return;
    }
    if (this.cpuIntent === 'crouch_punch' || this.cpuIntent === 'crouch_kick') {
      this.startCpuCrouchAttack(this.cpuIntent);
      return;
    }

    if (this.isAirborne) {
      if (pressed.punch || pressed.kick) this.startJumpAttack();
      return;
    }

    if (this.isJumpInputLocked()) {
      this.vx = 0;
      return;
    }

    if (this.isAttacking) {
      this.vx = 0;
      return;
    }

    if (this.onGround && !this.isInJumpSequence() && !motionBufferActive) {
      if (this.supportsGroundControls() && inp.down) {
        if (inp[this.getWalkBackInputKey()]) {
          if (this.setState('CROUCH_BLOCK')) this.snapToCrouch();
        } else {
          if (this.setState('CROUCH')) this.snapToCrouch();
        }
      } else if (!inp.down) {
        this.isCrouching = false;
      }
    }

    if (this.canPerformJump() && pressed.up) {
      this.startPreJump(inp.down);
    }

    if (this.onGround && !this.isCrouching && !this.isInJumpSequence()) {
      let move = 0;
      if (inp.left) move -= 1;
      if (inp.right) move += 1;
      this.vx = move * WALK_SPEED;
      if (this.shouldStandingBlockFromInputs(opponent)) {
        this.vx = 0;
        this.isCrouching = false;
        this.setState('BLOCK');
        this.snapToGround();
        return;
      }
    } else if (this.onGround && this.isCrouching) {
      this.vx = 0;
    }

    if (this.onGround && !this.isCrouching && !this.isInJumpSequence()) {
      if (pressed.punch) this.startAttack('punch');
      if (pressed.kick) this.startAttack('kick');
    }

    if (
      this.onGround &&
      this.isCrouching &&
      this.supportsGroundControls() &&
      inp.down &&
      !inp[this.getWalkBackInputKey()]
    ) {
      if (pressed.punch) this.startCrouchAttack('crouch_punch');
      if (pressed.kick) this.startCrouchAttack('crouch_kick');
    }

    this.updateLocomotionStateFromInputs(opponent);
  }

  shouldStandingBlockFromInputs(opponent) {
    if (!this.onGround || this.isCrouching || this.isAttacking || this.isInJumpSequence()) return false;
    if (!this.isOpponentActiveStrike(opponent) && !this.isIncomingProjectileThreat(opponent)) return false;
    if (this.isCpu) return this.cpuBlockWillSucceed;
    return this.isWalkBackHeld();
  }

  updateLocomotionStateFromInputs(opponent) {
    if (this.isAttacking || this.isInJumpSequence() || this.isInHitStun() || this.isInKoSequence()) return;

    const inp = this.inputs;
    const backKey = this.getWalkBackInputKey();

    if (this.onGround) {
      if (this.supportsGroundControls() && inp.down && inp[backKey]) {
        this.setState('CROUCH_BLOCK');
        return;
      }
      if (this.supportsGroundControls() && inp.down) {
        this.setState('CROUCH');
        return;
      }
      if (this.shouldStandingBlockFromInputs(opponent)) {
        this.vx = 0;
        this.setState('BLOCK');
        return;
      }
      if (this.vx !== 0 && this.vx * this.facing < 0) {
        this.setState('WALK_BACKWARD');
        return;
      }
      if (this.vx !== 0) {
        this.setState('WALK_FORWARD');
        return;
      }
      if (!inp.left && !inp.right && !(this.supportsGroundControls() && inp.down)) {
        this.setState('IDLE');
      }
    }
  }

  get displayName() {
    return this.manifest.displayName;
  }

  get hasFullMoveset() {
    return this.manifest.fullMoveset;
  }

  isControllable() {
    return !this.isKnockedOut && !this.isInHitStun() && !this.isInKoSequence() && !this.isJumpInputLocked();
  }

  isInHitStun() {
    return this.combatReaction === 'HIT_STUN' && this.hitStunTimer > 0;
  }

  isInKoSequence() {
    return this.combatReaction === 'KO_FLY' || this.combatReaction === 'KO_GROUND';
  }

  isJumpInputLocked() {
    return this.state === 'PRE_JUMP' || this.state === 'LAND_RECOVERY';
  }

  isInJumpSequence() {
    return (
      this.state === 'PRE_JUMP' ||
      this.state === 'JUMP_RISE' ||
      this.state === 'JUMP_DESCEND' ||
      this.state === 'JUMP_ATTACK' ||
      this.state === 'LAND_RECOVERY' ||
      this.isAirborne
    );
  }

  isBlocking() {
    return this.onGround && !this.isAttacking && (this.state === 'BLOCK' || this.state === 'CROUCH_BLOCK');
  }

  isLowStrike() {
    return this.state === 'CROUCH_PUNCH' || this.state === 'CROUCH_KICK';
  }

  isGroundStrike() {
    return this.isAttacking && (this.state === 'PUNCH' || this.state === 'KICK');
  }

  isOpponentActiveStrike(opponent) {
    if (!opponent) return false;
    const strikeStates = new Set(['PUNCH', 'KICK', 'CROUCH_PUNCH', 'CROUCH_KICK']);
    if (!strikeStates.has(opponent.state)) return false;
    return opponent.getHitbox() !== null;
  }

  snapToGround() {
    const bodyH = this.isCrouching ? CROUCH_HEIGHT : STAND_HEIGHT;
    this.y = GROUND_Y - bodyH;
    this.height = bodyH;
    this.onGround = true;
  }

  snapToCrouch() {
    this.isCrouching = true;
    this.height = CROUCH_HEIGHT;
    this.y = GROUND_Y - CROUCH_HEIGHT;
    this.onGround = true;
  }

  resetToSpawn(x, facing) {
    this.x = x;
    this.facing = facing;
    this.y = GROUND_Y - STAND_HEIGHT;
    this.width = FIGHTER_WIDTH;
    this.height = STAND_HEIGHT;
    this.vx = 0;
    this.vy = 0;
    this.onGround = true;
    this.isAirborne = false;
    this.isCrouching = false;
    this.jumpLocked = false;
    this.jumpLockedVx = 0;
    this.crouchBuffer = 0;
    this.isSuperJump = false;
    this.isAttacking = false;
    this.attackType = null;
    this.currentFrame = 0;
    this.tickCounter = 0;
    this.stateTimer = 0;
    this.state = 'IDLE';
    this.combatReaction = null;
    this.hitStunTimer = 0;
    this.hitStunKnockbackDir = 0;
    this.isKnockedOut = false;
    this.health = MAX_HEALTH;
    this.attackHitConnected = false;
    this.jumpAttackHitConnected = false;
    this.isJumpAttacking = false;
    this.hitActive = false;
    this.lastBlockSparkStrikeId = '';
    this.specialProjectileSpawned = false;
    this.cpuAttackCooldown = 0;
    this.cpuForcedJumpVx = 0;
    this.cpuSuperJumpSteer = 0;
    this.assets = loadedImages.characters[this.characterId] || null;
  }

  animate() {
    if (this.isInHitStun() || this.isInKoSequence()) return;

    if (this.state === 'PRE_JUMP' || this.state === 'LAND_RECOVERY') {
      return;
    }

    if (this.state === 'IDLE') {
      this.tickCounter += 1;
      if (this.tickCounter >= IDLE_TICKS_PER_FRAME) {
        this.tickCounter = 0;
        this.currentFrame = (this.currentFrame + 1) % IDLE_FRAME_COUNT;
      }
      return;
    }

    if (this.state === 'WALK_FORWARD' || this.state === 'WALK_BACKWARD') {
      this.tickCounter += 1;
      if (this.tickCounter >= WALK_TICKS_PER_FRAME) {
        this.tickCounter = 0;
        this.currentFrame = (this.currentFrame + 1) % WALK_FRAME_COUNT;
      }
      return;
    }

    if (this.state === 'PUNCH' || this.state === 'KICK') {
      this.tickCounter += 1;
      if (this.tickCounter >= ATTACK_TICKS_PER_FRAME) {
        this.tickCounter = 0;
        this.currentFrame += 1;
        if (this.currentFrame >= GROUND_ATTACK_FRAME_COUNT) {
          this.endAttack();
        }
      }
      return;
    }

    if (this.state === 'CROUCH_PUNCH' || this.state === 'CROUCH_KICK') {
      this.tickCounter += 1;
      if (this.tickCounter >= ATTACK_TICKS_PER_FRAME) {
        this.tickCounter = 0;
        this.currentFrame += 1;
        if (this.currentFrame >= GROUND_ATTACK_FRAME_COUNT) {
          this.endAttack();
        }
      }
      return;
    }

    if (this.state === 'PROJECTILE_ATTACK') {
      this.tickCounter += 1;
      if (this.tickCounter >= PROJECTILE_CAST_TICKS) {
        this.tickCounter = 0;
        this.currentFrame += 1;
        if (this.currentFrame === 1 && !this.specialProjectileSpawned) {
          this.spawnProjectile();
          this.specialProjectileSpawned = true;
        }
        if (this.currentFrame >= SPECIAL_CAST_FRAME_COUNT) {
          this.endSpecialAttack();
        }
      }
      return;
    }
  }

  endAttack() {
    const wasCrouch = this.state === 'CROUCH_PUNCH' || this.state === 'CROUCH_KICK';
    this.isAttacking = false;
    this.attackType = null;
    this.currentFrame = 0;
    this.tickCounter = 0;
    this.vx = 0;
    this.hitActive = false;
    this.lastBlockSparkStrikeId = '';

    if (wasCrouch && this.hasFullMoveset) {
      if (keysDown[this.controls.down]) {
        this.state = 'CROUCH';
        this.snapToCrouch();
      } else {
        this.isCrouching = false;
        this.state = 'IDLE';
        this.snapToGround();
      }
      return;
    }

    this.state = 'IDLE';
    this.snapToGround();
  }

  updateHitStun() {
    if (!this.isInHitStun()) return;
    this.x += this.hitStunKnockbackDir * HIT_STUN_KNOCKBACK_PER_TICK;
    this.clampToStage();
    this.hitStunTimer -= 1;
    if (this.hitStunTimer <= 0) {
      this.combatReaction = null;
      this.state = 'IDLE';
      this.snapToGround();
    }
  }

  updateKo() {
    if (this.combatReaction !== 'KO_FLY') return;
    const anchorHeight = this.getAnchorSpriteHeight();
    if (this.y + anchorHeight < GROUND_Y) return;
    this.isAirborne = false;
    this.combatReaction = 'KO_GROUND';
    this.state = 'KO_GROUND';
    this.y = GROUND_Y - anchorHeight;
    this.vy = 0;
    this.vx = 0;
    return 'landed';
  }

  getAnchorSpriteHeight() {
    const sprite = this.getActiveSprite();
    if (!sprite) return this.getBodyHeight();
    return sprite.naturalHeight || sprite.height || this.getBodyHeight();
  }

  getSpriteDrawConfig() {
    const kit = SPRITE_DRAW_CONFIG[this.characterId] || {};
    return kit[this.state] || SPRITE_DRAW_CONFIG.DEFAULT;
  }

  resolveJumpAsset(key) {
    const assets = this.assets;
    if (!assets || !this.characterId) return null;
    return assets[key] || null;
  }

  startCpuCrouchAttack(type) {
    if (!this.supportsGroundControls() || !this.onGround || this.isAttacking || this.isInJumpSequence()) {
      return;
    }
    this.isCrouching = true;
    this.isAttacking = true;
    this.attackType = type;
    this.currentFrame = 0;
    this.tickCounter = 0;
    this.attackHitConnected = false;
    this.lastBlockSparkStrikeId = '';
    this.vx = 0;
    this.state = type === 'crouch_kick' ? 'CROUCH_KICK' : 'CROUCH_PUNCH';
    this.snapToCrouch();
  }

  isOpponentJumpThreat(opponent) {
    return (
      opponent.isAirborne ||
      opponent.state === 'PRE_JUMP' ||
      opponent.state === 'JUMP_RISE' ||
      opponent.state === 'JUMP_DESCEND' ||
      opponent.state === 'JUMP_ATTACK'
    );
  }

  getCpuThreatDistance(opponent) {
    return Math.abs(
      (this.x + this.width * 0.5) - (opponent.x + opponent.width * 0.5)
    );
  }

  isIncomingProjectileThreat(opponent) {
    if (!opponent) return false;
    if (opponent.state === 'PROJECTILE_ATTACK' && this.getCpuThreatDistance(opponent) <= CPU_MELEE_RANGE + 60) {
      return true;
    }
    for (const projectile of activeProjectiles) {
      if (projectile.ownerSlot !== opponent.slot) continue;
      const dx = projectile.x - (this.x + this.width * 0.5);
      const approaching = projectile.speed > 0 ? dx > 0 : dx < 0;
      if (approaching && Math.abs(dx) <= CPU_MELEE_RANGE + 80) return true;
    }
    return false;
  }

  isOpponentMeleeThreat(opponent) {
    if (!opponent) return false;
    const attackStates = new Set(['PUNCH', 'KICK', 'CROUCH_PUNCH', 'CROUCH_KICK']);
    if (!attackStates.has(opponent.state)) return false;
    return opponent.getHitbox() !== null && this.getCpuThreatDistance(opponent) <= CPU_MELEE_RANGE + 20;
  }

  isOpponentAttackThreat(opponent) {
    return this.isOpponentMeleeThreat(opponent) || this.isIncomingProjectileThreat(opponent);
  }

  isLowAttackThreat(opponent) {
    return opponent?.state === 'CROUCH_KICK' || opponent?.state === 'CROUCH_PUNCH';
  }

  update(opponent) {
    this.clearInputs();

    const canAcceptInput = opponent && !isFightInputLocked();
    if (canAcceptInput) {
      if (this.isHumanControlled()) {
        this.collectHumanInputs();
      } else if (
        this.isCpu &&
        (currentMode === 'ARCADE MODE' || currentMode === 'STORY MODE')
      ) {
        this.populateCpuInputs(opponent);
      }

      this.executeFighterInputs(opponent);
    }

    this.updateHitStun();

    if (this.combatReaction === 'KO_FLY') {
      this.y += this.vy;
      this.x += this.vx;
      this.vy += KO_FLY_GRAVITY;
      this.clampToStage();
      const koLanded = this.updateKo();
      if (koLanded) return koLanded;
      return null;
    }

    const koLanded = this.updateKo();
    if (koLanded) return koLanded;

    if (this.isInHitStun() || this.isInKoSequence()) {
      return null;
    }

    if (this.state === 'PRE_JUMP') {
      this.vx = 0;
      this.vy = 0;
      this.stateTimer -= 1;
      if (this.stateTimer <= 0) this.launchJump();
      return null;
    }

    if (this.state === 'LAND_RECOVERY') {
      this.vx = 0;
      this.vy = 0;
      this.stateTimer -= 1;
      if (this.stateTimer <= 0) {
        this.state = 'IDLE';
        this.snapToGround();
      }
      return null;
    }

    if (this.isAirborne || !this.onGround) {
      if (this.isSuperJump) this.updateSuperJumpSteering();
      this.vy = Math.min(this.vy + GRAVITY, MAX_FALL_SPEED);
      this.y += this.vy;
      this.x += this.isSuperJump ? this.vx : (this.jumpLocked ? this.jumpLockedVx : this.vx);

      const floorTop = GROUND_Y - this.getAnchorSpriteHeight();
      if (this.y >= floorTop) {
        this.beginLandRecovery();
      } else {
        this.updateAirState();
      }
    } else {
      this.x += this.vx;
      this.snapToGround();
    }

    this.clampToStage();
    this.animate();
    this.updateHitActive();
    return null;
  }

  updateAirState() {
    if (this.isJumpAttacking) {
      this.setState('JUMP_ATTACK');
      return;
    }
    this.setState(this.vy < 0 ? 'JUMP_RISE' : 'JUMP_DESCEND');
  }

  updateSuperJumpSteering() {
    const inp = this.inputs;
    if (inp.left && !inp.right) {
      this.vx = -SUPER_JUMP_STEER_SPEED;
    } else if (inp.right && !inp.left) {
      this.vx = SUPER_JUMP_STEER_SPEED;
    } else if (this.cpuSuperJumpSteer > 0) {
      this.vx = SUPER_JUMP_STEER_SPEED;
    } else if (this.cpuSuperJumpSteer < 0) {
      this.vx = -SUPER_JUMP_STEER_SPEED;
    } else if (this.vx > 0) {
      this.vx = Math.max(0, this.vx - SUPER_JUMP_VX_DECAY);
    } else if (this.vx < 0) {
      this.vx = Math.min(0, this.vx + SUPER_JUMP_VX_DECAY);
    }
  }

  resolveJumpAirVelocity() {
    const inp = this.inputs;
    const forwardHeld = this.facing === 1 ? inp.right : inp.left;
    const backwardHeld = this.facing === 1 ? inp.left : inp.right;
    if (forwardHeld && !backwardHeld) return this.facing * JUMP_FORWARD_SPEED;
    if (backwardHeld && !forwardHeld) return -this.facing * JUMP_BACKWARD_SPEED;
    return 0;
  }

  canPerformJump() {
    return this.hasFullMoveset || Boolean(this.resolveJumpAsset('jumpCrouch'));
  }

  supportsGroundControls() {
    return this.hasFullMoveset || Boolean(this.assets?.crouch) || Boolean(this.resolveJumpAsset('jumpCrouch'));
  }

  launchJump() {
    const anchorHeight = this.getAnchorSpriteHeight();
    const superJump = this.isSuperJump;
    this.isAirborne = true;
    this.onGround = false;
    if (superJump) {
      this.jumpLocked = false;
      this.jumpLockedVx = 0;
      this.vx = 0;
      this.vy = SUPER_JUMP_VELOCITY;
    } else {
      this.jumpLockedVx = this.cpuForcedJumpVx !== 0
        ? this.cpuForcedJumpVx
        : this.resolveJumpAirVelocity();
      this.jumpLocked = true;
      this.vx = 0;
      this.vy = JUMP_VELOCITY;
      this.cpuForcedJumpVx = 0;
    }
    this.y = GROUND_Y - anchorHeight;
    this.state = 'JUMP_RISE';
  }

  beginLandRecovery() {
    const anchorHeight = this.getAnchorSpriteHeight();
    this.isAirborne = false;
    this.onGround = true;
    this.isJumpAttacking = false;
    this.jumpAttackHitConnected = false;
    this.jumpLocked = false;
    this.jumpLockedVx = 0;
    this.isSuperJump = false;
    this.cpuSuperJumpSteer = 0;
    this.vx = 0;
    this.vy = 0;
    this.state = 'LAND_RECOVERY';
    this.stateTimer = LAND_RECOVERY_TICKS;
    this.y = GROUND_Y - anchorHeight;
  }

  clampToStage() {
    this.x = Math.max(STAGE_LEFT, Math.min(STAGE_RIGHT - this.width, this.x));
  }

  updateHitActive() {
    this.hitActive = false;
    if (this.state === 'JUMP_ATTACK' && this.isJumpAttacking) {
      this.hitActive = true;
      return;
    }
    if ((this.state === 'PUNCH' || this.state === 'KICK') && this.currentFrame === 2) {
      this.hitActive = true;
      return;
    }
    if (
      (this.state === 'CROUCH_PUNCH' || this.state === 'CROUCH_KICK') &&
      this.currentFrame === 2
    ) {
      this.hitActive = true;
    }
  }

  getBodyHeight() {
    return this.isCrouching ? CROUCH_HEIGHT : STAND_HEIGHT;
  }

  getHurtbox() {
    return {
      x: this.x,
      y: GROUND_Y - this.getBodyHeight(),
      width: this.width,
      height: this.getBodyHeight(),
    };
  }

  getPushbox() {
    const h = this.getBodyHeight();
    const cx = this.x + this.width * 0.5;
    return {
      x: cx - PUSH_BOX_HALF_WIDTH,
      y: GROUND_Y - h - PUSH_BOX_PADDING_Y,
      width: PUSH_BOX_HALF_WIDTH * 2,
      height: h + PUSH_BOX_PADDING_Y,
    };
  }

  getHitbox() {
    const facingRight = this.facing === 1;

    if (
      (this.state === 'PUNCH' || this.state === 'CROUCH_PUNCH') &&
      this.currentFrame === 2
    ) {
      if (facingRight) {
        return { x: this.x + 80, y: this.y + 40, w: 50, h: 20 };
      }
      return { x: this.x - 10, y: this.y + 40, w: 50, h: 20 };
    }

    if (
      (this.state === 'KICK' || this.state === 'CROUCH_KICK') &&
      this.currentFrame === 2
    ) {
      if (facingRight) {
        return { x: this.x + 85, y: this.y + 70, w: 60, h: 25 };
      }
      return { x: this.x - 20, y: this.y + 70, w: 60, h: 25 };
    }

    if (this.state === 'JUMP_ATTACK') {
      if (facingRight) {
        return { x: this.x + 70, y: this.y + 80, w: 50, h: 30 };
      }
      return { x: this.x - 10, y: this.y + 80, w: 50, h: 30 };
    }

    return null;
  }

  getLaunchCoords() {
    const handOffsetX = this.facing === 1 ? this.width + 52 : -28;
    const handOffsetY = this.isCrouching ? 28 : 40;
    return {
      x: this.x + handOffsetX,
      y: this.y + handOffsetY,
    };
  }

  startProjectileAttack() {
    const canCast =
      !this.isCpu &&
      (this.characterId === CHARACTER_UPHEAVAL || this.characterId === CHARACTER_CRIMSON_KABUKI);
    if (!canCast || !this.onGround || this.isAttacking || this.isInJumpSequence()) return false;
    this.isAttacking = true;
    this.isCrouching = false;
    this.state = 'PROJECTILE_ATTACK';
    this.currentFrame = 0;
    this.tickCounter = 0;
    this.specialProjectileSpawned = false;
    this.vx = 0;
    this.snapToGround();
    return true;
  }

  endSpecialAttack() {
    this.isAttacking = false;
    this.currentFrame = 0;
    this.tickCounter = 0;
    this.specialProjectileSpawned = false;
    this.vx = 0;
    this.state = 'IDLE';
    this.snapToGround();
  }

  spawnProjectile() {
    const isDrone = this.characterId === CHARACTER_UPHEAVAL;
    const type = isDrone ? 'DRONE' : 'SHURIKEN';
    const facingRight = this.facing === 1;
    const speed = facingRight ? 6 : -6;
    const spawnX = facingRight ? this.x + 80 : this.x - 20;
    const spawnY = this.y + PROJECTILE_SPAWN_Y_OFFSET;
    const image = isDrone ? this.assets?.drone : this.assets?.shuriken;
    const assetReady = image && (image.naturalWidth > 0 || image.width > 0);
    if (!assetReady) {
      console.warn(`Projectile asset not ready for ${type}; spawn skipped.`);
      return;
    }
    try {
      activeProjectiles.push(new Projectile(spawnX, spawnY, speed, this, type, image));
    } catch (error) {
      console.error('Projectile spawn failed:', error);
    }
  }

  tryMotionCommandSpecial() {
    if (!this.onGround || this.isAttacking || this.isInJumpSequence()) return false;
    const c = this.controls;
    const buffer = motionCommandBuffers[this.slot];
    if (!buffer) return false;
    const now = performance.now();
    const canUseMotion =
      !this.isCpu &&
      (this.characterId === CHARACTER_UPHEAVAL || this.characterId === CHARACTER_CRIMSON_KABUKI);
    if (!canUseMotion) return false;

    if (buffer.steps.length > 0 && now - buffer.startMs > MOTION_COMMAND_WINDOW_MS) {
      buffer.steps = [];
    }

    if (keysPressed[c.down] && buffer.steps.length === 0) {
      buffer.steps = ['down'];
      buffer.startMs = now;
      buffer.lastMs = now;
      return false;
    }
    if (keysPressed[c.right] && buffer.steps.length === 1 && buffer.steps[0] === 'down') {
      buffer.steps.push('right');
      buffer.lastMs = now;
      return false;
    }
    if (keysPressed[c.punch] && buffer.steps.length === 2 && buffer.steps[0] === 'down' && buffer.steps[1] === 'right') {
      buffer.steps = [];
      if (now - buffer.startMs <= MOTION_COMMAND_WINDOW_MS) return this.startProjectileAttack();
      return false;
    }

    return false;
  }

  getActiveHitbox() {
    const hit = this.getHitbox();
    if (!hit) return null;
    return {
      x: hit.x,
      y: hit.y,
      width: hit.w,
      height: hit.h,
    };
  }

  resolveKoFlySprite() {
    this.currentFrame = 0;
    return this.assets?.koFly || null;
  }

  getActiveSprite() {
    const assets = this.assets;
    if (!assets) return null;

    const fallbackIdle = this.getFallbackIdleSprite();
    const pick = (sprite) => this.resolveSprite(sprite, fallbackIdle);
    const pickFrame = (frames) => pick(frames?.[this.currentFrame] || frames?.[0]);

    if (this.combatReaction === 'HIT_STUN') return pick(assets.hit);
    if (this.combatReaction === 'KO_FLY' || this.state === 'KO_FLY') {
      return pick(this.resolveKoFlySprite());
    }
    if (this.combatReaction === 'KO_GROUND') return pick(assets.koGround);

    switch (this.state) {
      case 'KO_FLY':
        return pick(this.resolveKoFlySprite());
      case 'IDLE':
        return pickFrame(assets.idle);
      case 'WALK_FORWARD':
        return pickFrame(assets.walkForward);
      case 'WALK_BACKWARD':
        return pickFrame(assets.walkBackward);
      case 'PUNCH':
        return pickFrame(assets.punch);
      case 'KICK':
        return pickFrame(assets.kick);
      case 'DRONE_ATTACK':
      case 'SHURIKEN_ATTACK':
      case 'PROJECTILE_ATTACK':
        if (this.characterId === CHARACTER_UPHEAVAL) {
          return pick(assets.droneAttack?.[this.currentFrame] || assets.droneAttack?.[0]);
        }
        return pick(assets.shurikenAttack?.[this.currentFrame] || assets.shurikenAttack?.[0]);
      case 'BLOCK':
        return pick(assets.block);
      case 'CROUCH':
        return pick(assets.crouch);
      case 'CROUCH_BLOCK':
        return pick(assets.crouchBlock);
      case 'CROUCH_PUNCH':
        return pick(assets.crouchPunch);
      case 'CROUCH_KICK':
        return pick(assets.crouchKick);
      case 'PRE_JUMP':
        return pick(this.resolveJumpAsset('jumpCrouch'));
      case 'JUMP_RISE':
        return pick(this.resolveJumpAsset('jumpRise'));
      case 'JUMP_DESCEND':
        return pick(this.resolveJumpAsset('jumpDescend'));
      case 'JUMP_ATTACK':
        return pick(this.resolveJumpAsset('jumpAttack'));
      case 'LAND_RECOVERY':
        return pick(this.resolveJumpAsset('jumpLand'));
      default:
        return fallbackIdle;
    }
  }

  isValidSprite(sprite) {
    return Boolean(sprite && ((sprite.naturalWidth || sprite.width || 0) > 0));
  }

  getFallbackIdleSprite() {
    const assets = this.assets;
    if (!assets?.idle?.length) return null;
    for (const frame of assets.idle) {
      if (this.isValidSprite(frame)) return frame;
    }
    return null;
  }

  resolveSprite(sprite, fallbackIdle = null) {
    if (this.isValidSprite(sprite)) return sprite;
    return fallbackIdle || this.getFallbackIdleSprite();
  }

  draw() {
    let activeSprite = null;
    if (this.state === 'KO_FLY' || this.combatReaction === 'KO_FLY') {
      activeSprite = this.resolveKoFlySprite();
    } else {
      activeSprite = this.getActiveSprite();
    }
    if (!this.isValidSprite(activeSprite)) return null;

    const sw = activeSprite.naturalWidth || activeSprite.width;
    const sh = activeSprite.naturalHeight || activeSprite.height;
    if (sw <= 0 || sh <= 0) return null;

    const config = this.getSpriteDrawConfig();
    const drawX = Math.round(worldToScreenX(this.x + config.offsetX));
    const usesWorldY =
      this.isAirborne ||
      this.state === 'KO_FLY' ||
      this.state === 'PRE_JUMP' ||
      this.state === 'JUMP_RISE' ||
      this.state === 'JUMP_DESCEND' ||
      this.state === 'JUMP_ATTACK' ||
      this.combatReaction === 'KO_FLY';
    const drawY = Math.round(
      usesWorldY ? this.y + config.offsetY : GROUND_Y - sh + config.offsetY
    );

    ctx.save();
    configurePixelatedCanvas();

    if (this.facing === -1) {
      ctx.translate(drawX + sw, drawY);
      ctx.scale(-1, 1);
      ctx.drawImage(activeSprite, 0, 0, sw, sh, 0, 0, sw, sh);
    } else {
      ctx.drawImage(activeSprite, 0, 0, sw, sh, drawX, drawY, sw, sh);
    }

    ctx.restore();

    if (this.slot === 'P2') {
      ctx.globalAlpha = 1.0;
      ctx.globalCompositeOperation = 'source-over';
    }

    return { drawX, drawY, drawWidth: sw, drawHeight: sh, sw, sh };
  }

  startAttack(type) {
    if (!this.onGround || this.isAttacking || this.isInJumpSequence()) return;
    this.isAttacking = true;
    this.attackType = type;
    this.currentFrame = 0;
    this.tickCounter = 0;
    this.attackHitConnected = false;
    this.lastBlockSparkStrikeId = '';
    this.vx = 0;
    this.state = type === 'kick' ? 'KICK' : 'PUNCH';
  }

  startCrouchAttack(type) {
    if (!this.supportsGroundControls() || !this.onGround || !this.isCrouching) return;
    const inp = this.inputs;
    if (!inp.down || inp[this.getWalkBackInputKey()]) return;
    if (this.isAttacking || this.isInJumpSequence()) return;
    this.isAttacking = true;
    this.attackType = type;
    this.currentFrame = 0;
    this.tickCounter = 0;
    this.attackHitConnected = false;
    this.lastBlockSparkStrikeId = '';
    this.vx = 0;
    this.state = type === 'crouch_kick' ? 'CROUCH_KICK' : 'CROUCH_PUNCH';
    this.snapToCrouch();
  }

  startPreJump(superJump = false) {
    if (!this.canPerformJump() || !this.onGround || this.isAttacking) return;
    if (!superJump && this.isCrouching) return;
    this.isSuperJump = superJump;
    this.isCrouching = false;
    this.state = 'PRE_JUMP';
    this.stateTimer = PRE_JUMP_TICKS;
    this.vx = 0;
    if (superJump) this.crouchBuffer = 0;
  }

  tickCrouchJumpBuffer() {
    const c = this.controls;
    if (this.onGround && keysDown[c.down]) {
      this.crouchBuffer = CROUCH_JUMP_BUFFER_FRAMES;
    } else if (this.crouchBuffer > 0) {
      this.crouchBuffer -= 1;
    }
  }

  startJumpAttack() {
    if (!this.supportsGroundControls() || !this.isAirborne || this.onGround) return;
    this.isJumpAttacking = true;
    this.jumpAttackHitConnected = false;
    this.state = 'JUMP_ATTACK';
  }

  updateFacing(opponent) {
    if (this.isAttacking || this.isAirborne || this.isInHitStun() || this.isInKoSequence() || this.isJumpInputLocked()) return;
    this.facing = opponent.x >= this.x ? 1 : -1;
  }

  applyHitStun(fromFighter) {
    this.isAttacking = false;
    this.attackType = null;
    this.isJumpAttacking = false;
    this.currentFrame = 0;
    this.tickCounter = 0;
    this.hitActive = false;
    this.combatReaction = 'HIT_STUN';
    this.state = 'HIT_STUN';
    this.hitStunTimer = HIT_STUN_DURATION;
    this.hitStunKnockbackDir = this.x < fromFighter.x ? -1 : 1;
    this.x += this.hitStunKnockbackDir * HIT_KNOCKBACK;
    this.clampToStage();
  }

  applyKo(fromFighter) {
    this.isKnockedOut = true;
    this.isAttacking = false;
    this.isCrouching = false;
    this.onGround = false;
    this.isAirborne = true;
    this.combatReaction = 'KO_FLY';
    this.state = 'KO_FLY';
    this.hitStunTimer = 0;
    this.vy = KO_FLY_VELOCITY_Y;
    this.vx = this.facing === 1 ? -KO_FLY_VELOCITY_X : KO_FLY_VELOCITY_X;
    this.y = GROUND_Y - STAND_HEIGHT;
    this.height = STAND_HEIGHT;
    matchState.koDelayTimer = KO_DELAY_FRAMES;
    matchState.pendingKoWinner = fromFighter === p1 || fromFighter?.slot === 'P1' ? 'p1' : 'p2';
  }
}

// =============================================================================
// 4. UNIVERSAL DIRECTIONAL HITBOX ENGINES & COLLISION
// =============================================================================

function boxesOverlap(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function isDefenderInCrouchBlock(defender) {
  return defender.hasFullMoveset && defender.state === 'CROUCH_BLOCK';
}

function isDefenderInStandingBlock(defender) {
  return defender.state === 'BLOCK';
}

function doesBlockAbsorbHit(attacker, defender) {
  if (isDefenderInCrouchBlock(defender)) return true;
  if (isDefenderInStandingBlock(defender)) return !attacker.isLowStrike();
  return false;
}

function hitboxesOverlap(a, b) {
  if (!a || !b) return false;
  const aw = a.w ?? a.width ?? 0;
  const ah = a.h ?? a.height ?? 0;
  const bw = b.w ?? b.width ?? 0;
  const bh = b.h ?? b.height ?? 0;
  return (
    a.x < b.x + bw &&
    a.x + aw > b.x &&
    a.y < b.y + bh &&
    a.y + ah > b.y
  );
}

function getFighterBodyBox(fighter) {
  return { x: fighter.x + 30, y: fighter.y, w: 68, h: 128 };
}

const blockSparks = [];

function getHitboxOverlapCenter(hitbox, bodyBox) {
  const overlapLeft = Math.max(hitbox.x, bodyBox.x);
  const overlapTop = Math.max(hitbox.y, bodyBox.y);
  const overlapRight = Math.min(hitbox.x + hitbox.w, bodyBox.x + bodyBox.w);
  const overlapBottom = Math.min(hitbox.y + hitbox.h, bodyBox.y + bodyBox.h);
  return {
    x: (overlapLeft + overlapRight) * 0.5,
    y: (overlapTop + overlapBottom) * 0.5,
  };
}

function spawnBlockSpark(worldX, worldY) {
  blockSparks.push({ x: worldX, y: worldY, timer: BLOCK_SPARK_DURATION });
}

function updateBlockSparks() {
  for (let i = blockSparks.length - 1; i >= 0; i -= 1) {
    blockSparks[i].timer -= 1;
    if (blockSparks[i].timer <= 0) blockSparks.splice(i, 1);
  }
}

function clearBlockSparks() {
  blockSparks.length = 0;
}

function clearActiveProjectiles() {
  activeProjectiles.length = 0;
}

function getProjectileHitbox(projectile) {
  return {
    x: projectile.x,
    y: projectile.y,
    w: projectile.width,
    h: projectile.height,
  };
}

function updateProjectiles(p1, p2) {
  for (let i = activeProjectiles.length - 1; i >= 0; i -= 1) {
    const projectile = activeProjectiles[i];
    projectile.update();

    if (projectile.x < STAGE_LEFT || projectile.x > STAGE_RIGHT) {
      activeProjectiles.splice(i, 1);
      continue;
    }

    const defender = projectile.ownerSlot === 'P1' ? p2 : p1;
    if (!defender || defender.isKnockedOut || defender.isInKoSequence()) continue;

    const projectileBox = getProjectileHitbox(projectile);
    const defenderBody = getFighterBodyBox(defender);
    if (!hitboxesOverlap(projectileBox, defenderBody)) continue;

    if (defender.state === 'BLOCK' || defender.state === 'CROUCH_BLOCK') {
      const contact = getHitboxOverlapCenter(projectileBox, defenderBody);
      spawnBlockSpark(contact.x, contact.y);
      activeProjectiles.splice(i, 1);
      continue;
    }

    defender.health = Math.max(0, Math.min(MAX_HEALTH, defender.health - PROJECTILE_DAMAGE));
    if (defender.health <= 0) {
      defender.applyKo(projectile.owner || { x: projectile.x });
    } else {
      defender.applyHitStun(projectile.owner || { x: projectile.x });
    }
    activeProjectiles.splice(i, 1);
  }
}

function getProjectileLaneTopY(projectile) {
  return projectile.y;
}

function drawProjectileTrails() {
  for (const projectile of activeProjectiles) {
    const headX = worldToScreenX(projectile.x);
    const tailX = worldToScreenX(projectile.launchX);
    const left = Math.min(headX, tailX);
    const width = Math.max(1, Math.abs(headX - tailX));
    const laneTopY = getProjectileLaneTopY(projectile);
    const gradient = ctx.createLinearGradient(headX, 0, tailX, 0);
    if (projectile.type === 'DRONE') {
      gradient.addColorStop(0, 'rgba(0, 150, 255, 0.6)');
      gradient.addColorStop(1, 'rgba(0, 150, 255, 0.0)');
    } else {
      gradient.addColorStop(0, 'rgba(255, 0, 50, 0.6)');
      gradient.addColorStop(1, 'rgba(255, 0, 50, 0.0)');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(left, laneTopY, width, projectile.height);
  }
}

function drawProjectiles() {
  ctx.save();
  configurePixelatedCanvas();
  for (const projectile of activeProjectiles) {
    const sx = worldToScreenX(projectile.x);
    const laneTopY = getProjectileLaneTopY(projectile);
    if (projectile.image) {
      if (projectile.type === 'SHURIKEN') {
        ctx.save();
        ctx.translate(sx + projectile.width * 0.5, laneTopY + projectile.height * 0.5);
        ctx.rotate(projectile.rotation);
        ctx.drawImage(
          projectile.image,
          -projectile.width * 0.5,
          -projectile.height * 0.5,
          projectile.width,
          projectile.height
        );
        ctx.restore();
      } else {
        ctx.drawImage(projectile.image, sx, laneTopY, projectile.width, projectile.height);
      }
    } else {
      ctx.fillStyle = projectile.type === 'DRONE' ? '#0096ff' : '#ff0032';
      ctx.fillRect(sx, laneTopY, projectile.width, projectile.height);
    }
  }
  ctx.restore();
}

function applyStrikeHit(attacker, defender) {
  if (defender.isKnockedOut || defender.isInKoSequence()) return;

  const attackerHit = attacker.getHitbox();
  if (!attackerHit || attacker.tickCounter !== 0) return;

  const defenderBody = getFighterBodyBox(defender);
  if (!hitboxesOverlap(attackerHit, defenderBody)) return;

  const lowStrike =
    attacker.state === 'CROUCH_PUNCH' || attacker.state === 'CROUCH_KICK';
  const blocked =
    defender.state === 'CROUCH_BLOCK' ||
    (defender.state === 'BLOCK' && !lowStrike);

  if (blocked) {
    const strikeId = `${attacker.state}:${attacker.currentFrame}`;
    if (attacker.lastBlockSparkStrikeId !== strikeId) {
      attacker.lastBlockSparkStrikeId = strikeId;
      const contact = getHitboxOverlapCenter(attackerHit, defenderBody);
      spawnBlockSpark(contact.x, contact.y);
    }
    return;
  }

  if (defender.isInHitStun()) return;

  if (attacker.state === 'PUNCH' || attacker.state === 'CROUCH_PUNCH') {
    sfxPunch.cloneNode(true).play();
  } else if (attacker.state === 'KICK' || attacker.state === 'CROUCH_KICK') {
    sfxKick.cloneNode(true).play();
  }

  defender.health = Math.max(0, Math.min(100, defender.health - HIT_DAMAGE));

  if (defender.health <= 0) {
    defender.applyKo(attacker);
    return;
  }

  defender.isAttacking = false;
  defender.attackType = null;
  defender.hitActive = false;
  defender.isJumpAttacking = false;
  defender.state = 'HIT_STUN';
  defender.combatReaction = 'HIT_STUN';
  defender.hitStunTimer = 12;
  defender.stateTimer = 12;
  defender.currentFrame = 0;
  defender.tickCounter = 0;
  defender.hitStunKnockbackDir = attacker.x < defender.x ? -1 : 1;
  const atLeftWall = defender.x <= STAGE_LEFT;
  const atRightWall = defender.x >= STAGE_RIGHT - defender.width;
  if (!atLeftWall && !atRightWall) {
    defender.x += attacker.x < defender.x ? 20 : -20;
    defender.clampToStage();
  }
}

function checkCollisions(p1, p2) {
  if (matchState.frozen) return;

  p1.health = Math.max(0, Math.min(100, p1.health));
  p2.health = Math.max(0, Math.min(100, p2.health));

  applyStrikeHit(p1, p2);
  applyStrikeHit(p2, p1);

  p1.health = Math.max(0, Math.min(100, p1.health));
  p2.health = Math.max(0, Math.min(100, p2.health));
}

function getFighterFeetWorldY(fighter) {
  return fighter.y + fighter.getAnchorSpriteHeight();
}

function canFighterCrossOver(jumper, other) {
  if (!jumper.isAirborne) return false;
  return getFighterFeetWorldY(jumper) < other.y - CROSSOVER_HEAD_CLEARANCE;
}

function shouldBypassPushbox(a, b) {
  return canFighterCrossOver(a, b) || canFighterCrossOver(b, a);
}

function syncFighterFacingByPosition(fighterA, fighterB) {
  if (fighterA.x < fighterB.x) {
    fighterA.facing = 1;
    fighterB.facing = -1;
  } else if (fighterA.x > fighterB.x) {
    fighterA.facing = -1;
    fighterB.facing = 1;
  }
}

function resolvePushboxCollision(a, b) {
  if (a.isInKoSequence() && a.combatReaction === 'KO_FLY') return;
  if (b.isInKoSequence() && b.combatReaction === 'KO_FLY') return;
  if (shouldBypassPushbox(a, b)) return;

  const boxA = a.getPushbox();
  const boxB = b.getPushbox();
  if (!boxesOverlap(boxA, boxB)) return;

  const overlap = (boxA.x + boxA.width * 0.5) - (boxB.x + boxB.width * 0.5);
  const push = overlap * 0.5;
  a.x += push;
  b.x -= push;
  a.clampToStage();
  b.clampToStage();
}

function isFightInputLocked() {
  return matchState.frozen || matchState.roundWinnerLocked;
}

function getControlsForFighter(fighter) {
  if (fighter.slot === 'P1') return P1_CONTROLS;
  return fighter.characterId === CHARACTER_UPHEAVAL ? P2_UPHEAVAL_CONTROLS : P2_KABUKI_CONTROLS;
}

function isCpuMode() {
  return currentMode === 'ARCADE MODE' || currentMode === 'STORY MODE';
}

function isTwoPlayerMode() {
  return currentMode === 'VERSUS';
}

function isStoryMode() {
  return currentMode === 'STORY MODE';
}

function getOppositeCharacter(id) {
  return id === CHARACTER_UPHEAVAL ? CHARACTER_CRIMSON_KABUKI : CHARACTER_UPHEAVAL;
}

function getCharacterDisplayName(id) {
  return CHARACTER_MANIFEST[id]?.displayName || id;
}

function createFightersForMatch() {
  const p1Controls = getControlsForFighter({ slot: 'P1', characterId: p1Selected });
  const p2Controls = getControlsForFighter({ slot: 'P2', characterId: p2Selected });
  p1 = new Fighter({
    x: PLAYER1_SPAWN_X,
    facing: 1,
    characterId: p1Selected,
    controls: p1Controls,
    slot: 'P1',
    isCpu: false,
  });
  p2 = new Fighter({
    x: PLAYER2_SPAWN_X,
    facing: -1,
    characterId: p2Selected,
    controls: p2Controls,
    slot: 'P2',
    isCpu: isCpuMode(),
  });
}

function resetRoundFighters() {
  p1.resetToSpawn(PLAYER1_SPAWN_X, 1);
  p2.resetToSpawn(PLAYER2_SPAWN_X, -1);
  p2.isCpu = isCpuMode();
  roundTimer = ROUND_TIMER_START;
  roundTimerLastTickMs = 0;
  clearBlockSparks();
  clearActiveProjectiles();
  matchState.koDelayTimer = 0;
  matchState.pendingKoWinner = null;
}

function resolveRoundEnd(winner) {
  if (matchState.roundWinnerLocked) return;
  matchState.roundWinnerLocked = true;
  matchState.frozen = true;
  matchState.p1WinsOverlay = winner === 'p1';
  matchState.p2WinsOverlay = winner === 'p2';
  if (winner === 'p1') p1RoundWins += 1;
  if (winner === 'p2') p2RoundWins += 1;
  matchState.roundIntermissionEndsAt = performance.now() + ROUND_INTERMISSION_MS;
}

function resetTournament() {
  p1RoundWins = 0;
  p2RoundWins = 0;
  matchState.p1WinsOverlay = false;
  matchState.p2WinsOverlay = false;
  matchState.frozen = false;
  matchState.roundWinnerLocked = false;
  matchState.roundIntermissionEndsAt = 0;
  matchState.screenShakeTimer = 0;
  matchState.koDelayTimer = 0;
  matchState.pendingKoWinner = null;
}

function updateCamera() {
  const mid = (p1.x + p1.width * 0.5 + p2.x + p2.width * 0.5) * 0.5;
  camera.x = Math.max(0, Math.min(STAGE_WIDTH - VIEWPORT_WIDTH, mid - VIEWPORT_WIDTH * 0.5));
}

function worldToScreenX(worldX) {
  return worldX - camera.x;
}

function configurePixelatedCanvas() {
  ctx.imageSmoothingEnabled = false;
}

function triggerScreenShake() {
  matchState.screenShakeTimer = SCREEN_SHAKE_DURATION;
}

function getScreenShakeOffset() {
  if (matchState.screenShakeTimer <= 0) return { x: 0, y: 0 };
  matchState.screenShakeTimer -= 1;
  return {
    x: (Math.random() * 2 - 1) * SCREEN_SHAKE_INTENSITY,
    y: (Math.random() * 2 - 1) * SCREEN_SHAKE_INTENSITY,
  };
}

function updateRoundTimer(timestamp) {
  if (currentScene !== GAME_STATE.FIGHT_STAGE || isFightInputLocked()) return;
  if (!roundTimerLastTickMs) {
    roundTimerLastTickMs = timestamp;
    return;
  }
  if (timestamp - roundTimerLastTickMs < ROUND_TIMER_INTERVAL_MS) return;
  roundTimerLastTickMs = timestamp;
  roundTimer = Math.max(0, roundTimer - 1);
  if (roundTimer <= 0) {
    if (p1.health > p2.health) resolveRoundEnd('p1');
    else if (p2.health > p1.health) resolveRoundEnd('p2');
    else resolveRoundEnd(null);
  }
}

function updateRoundIntermission() {
  if (!matchState.roundWinnerLocked || !matchState.roundIntermissionEndsAt) return;
  if (performance.now() < matchState.roundIntermissionEndsAt) return;
  if (matchState.koDelayTimer > 0) return;
  matchState.roundIntermissionEndsAt = 0;
  if (p1RoundWins >= ROUNDS_TO_WIN || p2RoundWins >= ROUNDS_TO_WIN) {
    battleMusic.pause();
    battleMusic.currentTime = 0;
    sfxVictoryVoice.play();
    currentScene = GAME_STATE.MATCH_OVER_DOCUMENTATION;
    return;
  }
  matchState.frozen = false;
  matchState.roundWinnerLocked = false;
  matchState.p1WinsOverlay = false;
  matchState.p2WinsOverlay = false;
  resetRoundFighters();
  playRoundAnnouncer();
  updateCamera();
}

function updateFightStage() {
  const koSequenceActive = p1.isInKoSequence() || p2.isInKoSequence();

  if (!matchState.frozen || koSequenceActive) {
    const ko1 = p1.update(p2);
    const ko2 = p2.update(p1);
    if (!matchState.frozen) {
      resolvePushboxCollision(p1, p2);
      syncFighterFacingByPosition(p1, p2);
      checkCollisions(p1, p2);
      updateProjectiles(p1, p2);
    }
    if (ko1 === 'landed' || ko2 === 'landed') triggerScreenShake();
  }

  if (koSequenceActive && matchState.koDelayTimer > 0) {
    matchState.koDelayTimer -= 1;
  }

  if (
    matchState.koDelayTimer === 0 &&
    matchState.pendingKoWinner &&
    !matchState.roundWinnerLocked
  ) {
    resolveRoundEnd(matchState.pendingKoWinner);
    matchState.pendingKoWinner = null;
  }

  updateBlockSparks();
  updateCamera();
}

// =============================================================================
// 5. CLEAN RENDERING ENGINE (THE DRAW LOOP)
// =============================================================================

function drawOutlinedHudText(text, x, y, align = 'center', baseline = 'middle') {
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = HUD_OUTLINE_WIDTH;
  ctx.strokeText(text, x, y);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(text, x, y);
}

function drawResponsiveName(text, centerX, frameBottomY, maxWidth) {
  const fixedFontSize = 14;
  const lineGap = 14;
  const bottomPad = 6;
  ctx.font = `bold ${fixedFontSize}px "Courier New", Courier, monospace`;
  const textFits = (value) => ctx.measureText(value).width <= maxWidth;
  const resolveLines = () => {
    if (textFits(text)) return [text];
    const words = text.trim().split(/\s+/);
    if (words.length <= 1) return [text];
    return [words[0], words.slice(1).join(' ')];
  };
  const drawLine = (value, y) => {
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = HUD_OUTLINE_WIDTH;
    ctx.strokeText(value, centerX, y);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(value, centerX, y);
  };

  const lines = resolveLines();
  const line2Y = frameBottomY - bottomPad;
  const line1Y = line2Y - lineGap;
  const drawPositions = lines.length === 1
    ? [{ text: lines[0], y: line2Y }]
    : [{ text: lines[0], y: line1Y }, { text: lines[1], y: line2Y }];

  const maxLineWidth = Math.max(...drawPositions.map((entry) => ctx.measureText(entry.text).width));
  const stripWidth = Math.min(maxWidth, maxLineWidth + 8);
  const stripHeight = lines.length === 1 ? fixedFontSize + 4 : fixedFontSize + lineGap + 4;
  const stripX = centerX - stripWidth * 0.5;
  const stripY = frameBottomY - bottomPad - stripHeight;
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(stripX, stripY, stripWidth, stripHeight + bottomPad);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  drawPositions.forEach(({ text: lineText, y }) => drawLine(lineText, y));
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}

function drawParallaxLayer(image, factor) {
  if (!image) return;
  configurePixelatedCanvas();
  ctx.drawImage(image, -Math.floor(camera.x * factor), 0, STAGE_WIDTH, STAGE_HEIGHT);
}

function updateBackgroundPropsClock() {
  bgTickCounter += 1;
  if (bgTickCounter >= TICKS_PER_FRAME) {
    bgTickCounter = 0;
    bgFrameIndex = (bgFrameIndex + 1) % BG_PROP_FRAME_COUNT;
  }

  hazardTickCounter += 1;
  if (hazardTickCounter >= HAZARD_TICKS_PER_FRAME) {
    hazardTickCounter = 0;
    hazardFrameIndex = (hazardFrameIndex + 1) % BG_PROP_FRAME_COUNT;
  }
}

function drawStageMidgroundProps() {
  const { tvLoopFrames = [], hazardFrames = [] } = loadedImages.stage;
  if (!tvLoopFrames.length && !hazardFrames.length) return;

  const midgroundOffset = -camera.x * 0.4;
  const propX = Math.floor(midgroundOffset);
  const propY = 0;
  configurePixelatedCanvas();

  const hazardFrame = hazardFrames[hazardFrameIndex];
  if (hazardFrame) {
    ctx.globalAlpha = 1;
    ctx.drawImage(hazardFrame, propX, propY, STAGE_WIDTH, STAGE_HEIGHT);
  }

  const fadeRatio = bgTickCounter > 90 ? (bgTickCounter - 90) / 60 : 0;
  const currentTvFrame = tvLoopFrames[bgFrameIndex];
  const nextTvFrame = tvLoopFrames[(bgFrameIndex + 1) % BG_PROP_FRAME_COUNT];

  const drawTvLayer = (frame, alpha) => {
    if (!frame) return;
    ctx.globalAlpha = alpha;
    ctx.drawImage(frame, propX, propY, STAGE_WIDTH, STAGE_HEIGHT);
  };

  if (bgTickCounter <= 90) {
    drawTvLayer(currentTvFrame, 1);
  } else {
    drawTvLayer(currentTvFrame, 1 - fadeRatio);
    drawTvLayer(nextTvFrame, fadeRatio);
  }

  ctx.globalAlpha = 1;
}

function drawStageBackground() {
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
  const stage = loadedImages.stage;
  drawParallaxLayer(stage.sky, PARALLAX_SKY);
  drawParallaxLayer(stage.mid, PARALLAX_MID);
  drawStageMidgroundProps();
  drawParallaxLayer(stage.floor, PARALLAX_FLOOR);
}

function getFighterDrawLayout(fighter, sprite) {
  if (!sprite) return null;
  const sw = sprite.naturalWidth || sprite.width;
  const sh = sprite.naturalHeight || sprite.height;
  if (sw <= 0 || sh <= 0) return null;
  const config = fighter.getSpriteDrawConfig();
  const drawX = worldToScreenX(fighter.x + config.offsetX);
  const usesWorldY =
    fighter.isAirborne ||
    fighter.state === 'PRE_JUMP' ||
    fighter.state === 'JUMP_RISE' ||
    fighter.state === 'JUMP_DESCEND' ||
    fighter.state === 'JUMP_ATTACK' ||
    fighter.combatReaction === 'KO_FLY';
  const drawY = usesWorldY
    ? fighter.y + config.offsetY
    : GROUND_Y - sh + config.offsetY;
  return { drawX, drawY, drawWidth: sw, drawHeight: sh, sw, sh };
}

function getFighterFeetCenterX(fighter, layout) {
  const inset = fighter.manifest.shadowFeetInset;
  if (inset > 0) {
    if (fighter.facing === 1) return fighter.x + layout.drawWidth - layout.drawWidth * inset;
    return fighter.x + layout.drawWidth * inset;
  }
  return fighter.x + layout.drawWidth * 0.5;
}

function getFighterShadowMetrics(fighter) {
  const sprite = fighter.getActiveSprite();
  const layout = getFighterDrawLayout(fighter, sprite);
  if (!layout) return null;
  const feetY = fighter.isAirborne || fighter.combatReaction === 'KO_FLY'
    ? fighter.y + layout.drawHeight
    : GROUND_Y;
  const altitude = Math.max(0, GROUND_Y - feetY);
  const maxAltitude = fighter.isSuperJump
    ? FLOOR_SHADOW_SUPER_MAX_ALTITUDE
    : FLOOR_SHADOW_MAX_ALTITUDE;
  const ratio = Math.min(1, altitude / maxAltitude);
  const sizeScale = fighter.isSuperJump
    ? Math.max(0.06, 1 - ratio * 0.94)
    : 1 - ratio * 0.35;
  const opacity = fighter.isSuperJump
    ? Math.max(0.05, FLOOR_SHADOW_BASE_OPACITY - ratio * (FLOOR_SHADOW_BASE_OPACITY - 0.05))
    : FLOOR_SHADOW_BASE_OPACITY - ratio * (FLOOR_SHADOW_BASE_OPACITY - FLOOR_SHADOW_MIN_OPACITY);
  return {
    centerX: worldToScreenX(getFighterFeetCenterX(fighter, layout)),
    radiusX: Math.max(
      fighter.isSuperJump ? 2 : 6,
      layout.drawWidth * FLOOR_SHADOW_WIDTH_RATIO * 0.5 * sizeScale
    ),
    radiusY: Math.max(2, FLOOR_SHADOW_HEIGHT * 0.5 * sizeScale),
    opacity,
  };
}

function drawFighterShadow(fighter) {
  const shadow = getFighterShadowMetrics(fighter);
  if (!shadow) return;
  ctx.save();
  ctx.fillStyle = `rgba(0, 0, 0, ${shadow.opacity.toFixed(3)})`;
  ctx.beginPath();
  ctx.ellipse(shadow.centerX, GROUND_Y, shadow.radiusX, shadow.radiusY, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawFighterSprite(fighter) {
  return fighter.draw();
}

function drawCrouchHitboxDebug(fighter) {
  if (fighter.slot !== 'P1' || !fighter.hitActive) return;
  const box = fighter.getHitbox();
  if (!box || (fighter.state !== 'CROUCH_PUNCH' && fighter.state !== 'CROUCH_KICK')) return;
  ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
  ctx.fillRect(worldToScreenX(box.x), box.y, box.w, box.h);
}

function drawBlockSparks() {
  ctx.save();
  for (const spark of blockSparks) {
    const sx = worldToScreenX(spark.x);
    const sy = spark.y;
    const life = spark.timer / BLOCK_SPARK_DURATION;
    const radius = 2 + Math.floor((1 - life) * 5);
    const ringOffsets = [
      [0, -radius],
      [radius, -radius],
      [radius, 0],
      [radius, radius],
      [0, radius],
      [-radius, radius],
      [-radius, 0],
      [-radius, -radius],
    ];

    ctx.fillStyle = life > 0.5 ? '#ffff00' : '#ffe066';
    for (const [dx, dy] of ringOffsets) {
      ctx.fillRect(sx + dx - 1, sy + dy - 1, 2, 2);
    }
    if (life > 0.33) {
      ctx.fillRect(sx - 1, sy - 1, 3, 3);
    }
  }
  ctx.restore();
}

function drawHealthBar(health, maxHealth, side) {
  const ratio = Math.max(0, health / maxHealth);
  const x = side === 'left' ? 8 : VIEWPORT_WIDTH - HEALTH_BAR_WIDTH - 8;
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.strokeRect(x - 1, HEALTH_BAR_Y - 1, HEALTH_BAR_WIDTH + 2, HEALTH_BAR_HEIGHT + 2);
  ctx.fillStyle = '#330000';
  ctx.fillRect(x, HEALTH_BAR_Y, HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT);
  const fillW = Math.floor(HEALTH_BAR_WIDTH * ratio);
  ctx.fillStyle = side === 'left' ? '#e52521' : '#2b5fd9';
  if (side === 'left') ctx.fillRect(x, HEALTH_BAR_Y, fillW, HEALTH_BAR_HEIGHT);
  else ctx.fillRect(x + HEALTH_BAR_WIDTH - fillW, HEALTH_BAR_Y, fillW, HEALTH_BAR_HEIGHT);
}

function drawVictoryDots(wins, side) {
  const ui = loadedImages.ui;
  const baseX = side === 'left' ? 8 : VIEWPORT_WIDTH - 8 - VICTORY_DOT_SIZE * 2 - VICTORY_DOT_GAP;
  for (let i = 0; i < 2; i += 1) {
    const img = i < wins ? ui.victoryDotFilled : ui.victoryDotEmpty;
    if (!img) continue;
    configurePixelatedCanvas();
    ctx.drawImage(img, baseX + i * (VICTORY_DOT_SIZE + VICTORY_DOT_GAP), FIGHTER_HUD_DOT_Y, VICTORY_DOT_SIZE, VICTORY_DOT_SIZE);
  }
}

function drawFightHud() {
  drawHealthBar(p1.health, p1.maxHealth, 'left');
  drawHealthBar(p2.health, p2.maxHealth, 'right');
  drawVictoryDots(p1RoundWins, 'left');
  drawVictoryDots(p2RoundWins, 'right');

  ctx.font = 'bold 8px "Courier New", Courier, monospace';
  drawOutlinedHudText(p1.displayName, 8, FIGHTER_HUD_NAME_Y, 'left', 'top');
  drawOutlinedHudText(p2.displayName, VIEWPORT_WIDTH - 8, FIGHTER_HUD_NAME_Y, 'right', 'top');

  drawOutlinedHudText(String(roundTimer), VIEWPORT_WIDTH * 0.5, HEALTH_BAR_Y + 2, 'center', 'top');
}

function drawWinOverlay() {
  if (!matchState.p1WinsOverlay && !matchState.p2WinsOverlay) return;
  const text = matchState.p1WinsOverlay ? 'PLAYER 1 WINS' : 'PLAYER 2 WINS';
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fillRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
  ctx.font = 'bold 16px "Courier New", Courier, monospace';
  drawOutlinedHudText(text, VIEWPORT_WIDTH * 0.5, VIEWPORT_HEIGHT * 0.5);
  ctx.restore();
}

function drawFightStage(shake) {
  ctx.save();
  ctx.translate(shake.x, shake.y);
  drawStageBackground();
  drawProjectileTrails();
  drawProjectiles();
  drawFighterShadow(p2);
  drawFighterShadow(p1);
  drawFighterSprite(p2);
  ctx.globalAlpha = 1.0;
  ctx.globalCompositeOperation = 'source-over';
  drawFighterSprite(p1);
  drawBlockSparks();
  drawFightHud();
  drawWinOverlay();
  ctx.restore();
}

function drawTitleScreen() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
  const bg = loadedImages.ui.titleBg;
  if (bg) {
    configurePixelatedCanvas();
    ctx.drawImage(bg, 0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
  }
  if (Math.floor(sceneUI.titleFlashTimer / TITLE_FLASH_INTERVAL) % 2 === 0) {
    ctx.font = 'bold 12px "Courier New", Courier, monospace';
    drawOutlinedHudText('PRESS ENTER TO START', VIEWPORT_WIDTH * 0.5, VIEWPORT_HEIGHT - 28);
  }
}

function drawMainMenu() {
  if (menuBgImg.complete && menuBgImg.naturalWidth > 0) {
    configurePixelatedCanvas();
    ctx.drawImage(menuBgImg, 0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
  } else {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
  }
  ctx.save();
  ctx.translate(sceneUI.menuSlideOffset, 0);
  ctx.font = 'bold 14px "Courier New", Courier, monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const menuTextX = 220;
  const menuStartY = 50;
  const menuLineHeight = 30;
  const menuCursorX = 200;
  for (let i = 0; i < MENU_OPTIONS.length; i += 1) {
    const y = menuStartY + i * menuLineHeight;
    ctx.fillStyle = '#000000';
    ctx.fillText(MENU_OPTIONS[i], menuTextX + 2, y + 2);
    ctx.fillStyle = '#FF7F00';
    ctx.fillText(MENU_OPTIONS[i], menuTextX, y);
  }
  const cursor = loadedImages.ui.menuCursor;
  if (cursor) {
    configurePixelatedCanvas();
    ctx.drawImage(cursor, menuCursorX, menuStartY + sceneUI.menuIndex * menuLineHeight - cursor.naturalHeight * 0.5);
  }
  ctx.restore();
}

function getTutorialPreviewSprite(moveIndex, animFrame) {
  const assets = loadedImages.characters[CHARACTER_UPHEAVAL];
  if (!assets) return null;
  switch (moveIndex) {
    case 0:
      return assets.punch?.[animFrame % 4] || assets.punch?.[0] || assets.idle?.[0];
    case 1:
      return assets.kick?.[animFrame % 4] || assets.kick?.[0] || assets.idle?.[0];
    case 2:
      return assets.crouchPunch || assets.idle?.[0];
    case 3:
      return assets.crouchKick || assets.idle?.[0];
    case 4:
      return assets.jumpAttack || assets.idle?.[0];
    case 5:
      return assets.block || assets.idle?.[0];
    case 6:
      return assets.crouchBlock || assets.idle?.[0];
    case 7:
      return assets.droneAttack?.[animFrame % 2] || assets.droneAttack?.[0] || assets.idle?.[0];
    case 8: {
      const phase = animFrame % 12;
      if (phase < 2) return assets.jumpCrouch || assets.idle?.[0];
      if (phase < 6) return assets.jumpRise || assets.idle?.[0];
      if (phase < 10) return assets.jumpDescend || assets.idle?.[0];
      return assets.jumpLand || assets.idle?.[0];
    }
    default:
      return assets.idle?.[0] || null;
  }
}

function splitTutorialInstructionTwoLines(text) {
  const words = text.split(' ');
  let line1 = words[0] || '';
  for (let i = 1; i < words.length; i += 1) {
    const candidate = `${line1} ${words[i]}`;
    if (ctx.measureText(candidate).width <= TUTORIAL_INSTRUCTION_MAX_WIDTH) {
      line1 = candidate;
    } else {
      return [line1, words.slice(i).join(' ')];
    }
  }
  const mid = text.indexOf(' ', Math.floor(text.length / 2));
  if (mid > 0) return [text.slice(0, mid).trim(), text.slice(mid).trim()];
  const half = Math.ceil(text.length / 2);
  return [text.slice(0, half), text.slice(half)];
}

function drawTutorialInstructionText(text) {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = HUD_OUTLINE_WIDTH;
  ctx.fillStyle = '#FF7F00';

  ctx.font = 'bold 12px "Courier New", Courier, monospace';
  if (ctx.measureText(text).width <= TUTORIAL_INSTRUCTION_MAX_WIDTH) {
    ctx.strokeText(text, TUTORIAL_INSTRUCTION_X, TUTORIAL_INSTRUCTION_Y);
    ctx.fillText(text, TUTORIAL_INSTRUCTION_X, TUTORIAL_INSTRUCTION_Y);
    return;
  }

  ctx.font = 'bold 11px "Courier New", Courier, monospace';
  const [line1, line2] = splitTutorialInstructionTwoLines(text);
  ctx.strokeText(line1, TUTORIAL_INSTRUCTION_X, TUTORIAL_INSTRUCTION_LINE1_Y);
  ctx.fillText(line1, TUTORIAL_INSTRUCTION_X, TUTORIAL_INSTRUCTION_LINE1_Y);
  ctx.strokeText(line2, TUTORIAL_INSTRUCTION_X, TUTORIAL_INSTRUCTION_LINE2_Y);
  ctx.fillText(line2, TUTORIAL_INSTRUCTION_X, TUTORIAL_INSTRUCTION_LINE2_Y);
}

function drawTutorialScreen() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
  if (charselectBgImg.complete && charselectBgImg.naturalWidth > 0) {
    configurePixelatedCanvas();
    ctx.drawImage(charselectBgImg, 0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
  }

  ctx.font = 'bold 12px "Courier New", Courier, monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  for (let i = 0; i < tutorialMoves.length; i += 1) {
    const y = TUTORIAL_MOVE_LIST_START_Y + i * TUTORIAL_MOVE_LINE_HEIGHT;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = HUD_OUTLINE_WIDTH;
    ctx.strokeText(tutorialMoves[i], TUTORIAL_TEXT_X, y);
    ctx.fillStyle = i === sceneUI.tutorialMoveIndex ? '#ffe45e' : '#FF7F00';
    ctx.fillText(tutorialMoves[i], TUTORIAL_TEXT_X, y);
  }

  const cursor = loadedImages.ui.menuCursor;
  if (cursor) {
    configurePixelatedCanvas();
    const cursorY = TUTORIAL_MOVE_LIST_START_Y + sceneUI.tutorialMoveIndex * TUTORIAL_MOVE_LINE_HEIGHT;
    ctx.drawImage(cursor, TUTORIAL_TEXT_X - 18, cursorY - cursor.naturalHeight * 0.5 + 6);
  }

  const previewSprite = getTutorialPreviewSprite(sceneUI.tutorialMoveIndex, sceneUI.tutorialAnimFrame);
  if (previewSprite) {
    const sw = previewSprite.naturalWidth || previewSprite.width;
    const sh = previewSprite.naturalHeight || previewSprite.height;
    if (sw > 0 && sh > 0) {
      const tutorialFloorY = GROUND_Y - 55;
      let previewDrawY = tutorialFloorY - sh;
      if (sceneUI.tutorialMoveIndex === 8) {
        const jumpPhase = sceneUI.tutorialAnimFrame % 12;
        let lift = 0;
        if (jumpPhase >= 2 && jumpPhase < 6) lift = (jumpPhase - 1) * 16;
        else if (jumpPhase >= 6 && jumpPhase < 10) lift = (10 - jumpPhase) * 16;
        previewDrawY = tutorialFloorY - sh - lift;
      }
      const shadowCenterX = TUTORIAL_PREVIEW_X + sw * 0.5;
      const shadowScale = sceneUI.tutorialMoveIndex === 8
        ? Math.max(0.2, 1 - Math.max(0, tutorialFloorY - sh - previewDrawY) / 64)
        : 1;
      ctx.save();
      ctx.fillStyle = `rgba(0, 0, 0, ${FLOOR_SHADOW_BASE_OPACITY})`;
      ctx.beginPath();
      ctx.ellipse(
        shadowCenterX,
        tutorialFloorY,
        Math.max(6, sw * FLOOR_SHADOW_WIDTH_RATIO * 0.5 * shadowScale),
        FLOOR_SHADOW_HEIGHT * 0.5 * shadowScale,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.restore();
      configurePixelatedCanvas();
      ctx.drawImage(previewSprite, TUTORIAL_PREVIEW_X, previewDrawY, sw, sh);
    }
  }

  if (sceneUI.tutorialMoveIndex === 7 && sceneUI.tutorialDemoProjX > 0) {
    const demoProjX = sceneUI.tutorialDemoProjX;
    const launchX = TUTORIAL_DEMO_LAUNCH_X;
    const laneY = TUTORIAL_DEMO_LANE_Y;
    const tipX = launchX + demoProjX;
    const trailLeft = Math.min(launchX, tipX);
    const trailWidth = Math.max(1, demoProjX);
    const gradient = ctx.createLinearGradient(tipX, 0, launchX, 0);
    gradient.addColorStop(0, 'rgba(0, 150, 255, 0.6)');
    gradient.addColorStop(1, 'rgba(0, 150, 255, 0.0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(trailLeft, laneY, trailWidth, TUTORIAL_DEMO_PROJ_SIZE);
    const droneImg = loadedImages.characters[CHARACTER_UPHEAVAL]?.drone;
    if (droneImg) {
      configurePixelatedCanvas();
      ctx.drawImage(droneImg, tipX, laneY, TUTORIAL_DEMO_PROJ_SIZE, TUTORIAL_DEMO_PROJ_SIZE);
    } else {
      ctx.fillStyle = '#0096ff';
      ctx.fillRect(tipX, laneY, TUTORIAL_DEMO_PROJ_SIZE, TUTORIAL_DEMO_PROJ_SIZE);
    }
  }

  drawTutorialInstructionText(moveInstructions[sceneUI.tutorialMoveIndex] || '');

  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = HUD_OUTLINE_WIDTH;
  ctx.strokeText('[ PRESS SPACEBAR TO RETURN TO MENU ]', 192, 210);
  ctx.fillStyle = '#FF7F00';
  ctx.fillText('[ PRESS SPACEBAR TO RETURN TO MENU ]', 192, 210);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}

function getCharSlotPosition(col, row) {
  return {
    x: CHAR_GRID_START_X + col * (CHAR_SLOT_SIZE + CHAR_GRID_GAP),
    y: CHAR_GRID_START_Y + row * (CHAR_SLOT_SIZE + CHAR_GRID_GAP),
  };
}

function getCharSlotId(col, row) {
  if (row === 0 && col === 0) return CHARACTER_UPHEAVAL;
  if (row === 0 && col === 1) return CHARACTER_CRIMSON_KABUKI;
  return null;
}

function drawCharSelect() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
  const ui = loadedImages.ui;
  if (ui.charSelectBg) {
    configurePixelatedCanvas();
    ctx.drawImage(ui.charSelectBg, 0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
  }

  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  const playerHeadline = sceneUI.charSelectPhase === 'P1' ? 'PLAYER 1' : 'PLAYER 2';
  ctx.font = 'bold 20px "Courier New", Courier, monospace';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = HUD_OUTLINE_WIDTH;
  ctx.strokeText(playerHeadline, VIEWPORT_WIDTH * 0.5, 25);
  ctx.fillStyle = '#FF7F00';
  ctx.fillText(playerHeadline, VIEWPORT_WIDTH * 0.5, 25);
  ctx.font = 'bold 11px "Courier New", Courier, monospace';
  ctx.strokeText('CHOOSE YOUR FIGHTER', VIEWPORT_WIDTH * 0.5, 40);
  ctx.fillStyle = '#ffffff';
  ctx.fillText('CHOOSE YOUR FIGHTER', VIEWPORT_WIDTH * 0.5, 40);
  const modeLabel = currentMode === 'VERSUS' ? 'VERSUS' : 'ARCADE MODE';
  ctx.strokeText(`MODE: ${modeLabel}  (TAB TO SWITCH)`, VIEWPORT_WIDTH * 0.5, 54);
  ctx.fillStyle = '#FF7F00';
  ctx.fillText(`MODE: ${modeLabel}  (TAB TO SWITCH)`, VIEWPORT_WIDTH * 0.5, 54);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  const slotId = getCharSlotId(sceneUI.charSelectCol, sceneUI.charSelectRow);
  const leftPortraitCenterX = CHAR_PREVIEW_X + CHAR_PREVIEW_WIDTH * 0.5;
  const rightPortraitCenterX = CHAR_PREVIEW_RIGHT_X + CHAR_PREVIEW_WIDTH * 0.5;
  const p1SelectedName = getCharacterDisplayName(CHARACTER_UPHEAVAL);
  const p2SelectedName = getCharacterDisplayName(CHARACTER_CRIMSON_KABUKI);
  const portraitFrameBottomY = CHAR_PREVIEW_Y + CHAR_PREVIEW_HEIGHT;
  if (slotId === CHARACTER_UPHEAVAL) {
    if (ui.charHeroLarge) {
      configurePixelatedCanvas();
      ctx.drawImage(ui.charHeroLarge, CHAR_PREVIEW_X, CHAR_PREVIEW_Y, CHAR_PREVIEW_WIDTH, CHAR_PREVIEW_HEIGHT);
    }
    drawResponsiveName(p1SelectedName, leftPortraitCenterX, portraitFrameBottomY, 110);
  }
  if (slotId === CHARACTER_CRIMSON_KABUKI) {
    if (ui.charRivalLarge) {
      configurePixelatedCanvas();
      ctx.drawImage(ui.charRivalLarge, CHAR_PREVIEW_RIGHT_X, CHAR_PREVIEW_Y, CHAR_PREVIEW_WIDTH, CHAR_PREVIEW_HEIGHT);
    }
    drawResponsiveName(p2SelectedName, rightPortraitCenterX, portraitFrameBottomY, 110);
  }

  for (let row = 0; row < CHAR_GRID_ROWS; row += 1) {
    for (let col = 0; col < CHAR_GRID_COLS; col += 1) {
      const pos = getCharSlotPosition(col, row);
      if (ui.charSelectSlot) {
        configurePixelatedCanvas();
        ctx.drawImage(ui.charSelectSlot, pos.x, pos.y, CHAR_SLOT_SIZE, CHAR_SLOT_SIZE);
      }
      const id = getCharSlotId(col, row);
      if (id === CHARACTER_UPHEAVAL && ui.charHeroIcon) ctx.drawImage(ui.charHeroIcon, pos.x, pos.y, CHAR_SLOT_SIZE, CHAR_SLOT_SIZE);
      if (id === CHARACTER_CRIMSON_KABUKI && ui.charRivalIcon) ctx.drawImage(ui.charRivalIcon, pos.x, pos.y, CHAR_SLOT_SIZE, CHAR_SLOT_SIZE);
      if (!id) {
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.fillRect(pos.x, pos.y, CHAR_SLOT_SIZE, CHAR_SLOT_SIZE);
      }
    }
  }

  const cursorPos = getCharSlotPosition(sceneUI.charSelectCol, sceneUI.charSelectRow);
  ctx.strokeStyle = sceneUI.charSelectLockInActive ? '#ffffff' : '#ff3030';
  ctx.lineWidth = 2;
  ctx.strokeRect(cursorPos.x - 1, cursorPos.y - 1, CHAR_SLOT_SIZE + 2, CHAR_SLOT_SIZE + 2);

  drawOutlinedHudText(
    sceneUI.charSelectPhase === 'P1' ? 'PRESS J OR ENTER TO CONFIRM' : 'USE ARROWS + NUMPAD 1 OR ENTER',
    VIEWPORT_WIDTH * 0.5,
    VIEWPORT_HEIGHT - 16
  );
}

function drawMatchOverDocumentation() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
  if (charselectBgImg.complete && charselectBgImg.naturalWidth > 0) {
    configurePixelatedCanvas();
    ctx.drawImage(charselectBgImg, 0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
  }

  const winner = p1RoundWins >= ROUNDS_TO_WIN
    ? getCharacterDisplayName(p1Selected)
    : getCharacterDisplayName(p2Selected);
  const centerX = VIEWPORT_WIDTH * 0.5;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = HUD_OUTLINE_WIDTH;
  ctx.fillStyle = '#FF7F00';

  ctx.font = 'bold 24px "Courier New", Courier, monospace';
  ctx.strokeText('VICTORY', centerX, 50);
  ctx.fillText('VICTORY', centerX, 50);

  ctx.font = 'bold 18px "Courier New", Courier, monospace';
  ctx.strokeText(winner, centerX, 90);
  ctx.fillText(winner, centerX, 90);

  ctx.font = 'bold 12px "Courier New", Courier, monospace';
  const roundsText = `ROUNDS: ${p1RoundWins} - ${p2RoundWins}`;
  ctx.strokeText(roundsText, centerX, 130);
  ctx.fillText(roundsText, centerX, 130);

  ctx.strokeText('[ PRESS SPACEBAR FOR REMATCH ]', centerX, 190);
  ctx.fillText('[ PRESS SPACEBAR FOR REMATCH ]', centerX, 190);

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}

function draw() {
  switch (currentScene) {
    case GAME_STATE.CHAR_SELECT:
      drawCharSelect();
      break;
    case GAME_STATE.MATCH_OVER_DOCUMENTATION:
      drawMatchOverDocumentation();
      break;
    case GAME_STATE.FIGHT_STAGE:
      drawFightStage(getScreenShakeOffset());
      break;
  }
}

// =============================================================================
// 6. FULL INTERFACE MODE FLOW MANAGER
// =============================================================================

function setupInput() {
  const blockKeys = new Set([
    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Space', 'Numpad1', 'Numpad2', 'Tab',
  ]);

  window.addEventListener('keydown', (event) => {
    keysDown[event.code] = true;
    keysPressed[event.code] = true;
    if (blockKeys.has(event.code)) event.preventDefault();
  });

  window.addEventListener('keyup', (event) => {
    keysDown[event.code] = false;
  });
}

function isEnterPressed() {
  return Boolean(keysPressed.Enter);
}

function isSpacePressed() {
  return Boolean(keysPressed.Space);
}

function isMenuUpPressed() {
  return Boolean(keysPressed.ArrowUp || keysPressed.KeyW);
}

function isMenuDownPressed() {
  return Boolean(keysPressed.ArrowDown || keysPressed.KeyS);
}

function playRoundAnnouncer() {
  if (p1RoundWins === 1 && p2RoundWins === 1) {
    sfxFinalRound.play();
  } else if (p1RoundWins + p2RoundWins === 1) {
    sfxRound2.play();
  } else if (p1RoundWins + p2RoundWins === 0) {
    sfxRound1.play();
  }
}

function resetStoryIntro() {
  activeSlideIndex = 0;
  slideX = VIEWPORT_WIDTH;
  isTransitioning = false;
  hideHeader = false;
  storyFightFade = 0;
}

function updateStoryIntro() {
  if (currentScene !== GAME_STATE.STORY_INTRO) return;

  if (storyFightFade > 0) {
    storyFightFade -= 1;
    if (storyFightFade === 0) beginFightStage();
    return;
  }

  if (isTransitioning) {
    slideX -= 18;
    if (slideX <= -VIEWPORT_WIDTH) {
      activeSlideIndex += 1;
      slideX = VIEWPORT_WIDTH;
      isTransitioning = false;
    }
  }

  const confirmed = Boolean(keysPressed.Enter || keysPressed.KeyJ);
  if (!confirmed || slideX !== 0 || isTransitioning) return;

  if (activeSlideIndex < storySlides.length - 1) {
    isTransitioning = true;
    return;
  }

  hideHeader = true;
  storyFightFade = STORY_FIGHT_FADE_FRAMES;
}

function beginFightStage() {
  if (isStoryMode()) {
    p1Selected = CHARACTER_UPHEAVAL;
    p2Selected = CHARACTER_CRIMSON_KABUKI;
  }
  createFightersForMatch();
  resetTournament();
  resetRoundFighters();
  currentScene = GAME_STATE.FIGHT_STAGE;
  menuMusic.pause();
  menuMusic.currentTime = 0;
  if (battleMusic.paused) battleMusic.play();
  playRoundAnnouncer();
  updateCamera();
}

function enterMainMenu() {
  currentScene = GAME_STATE.MAIN_MENU;
  sceneUI.menuTransitionActive = true;
  sceneUI.menuSlideOffset = VIEWPORT_WIDTH;
}

function enterCharSelect() {
  currentMode = MENU_OPTIONS[sceneUI.menuIndex];
  sceneUI.charSelectCol = 0;
  sceneUI.charSelectRow = 0;
  sceneUI.charSelectPhase = 'P1';
  sceneUI.charSelectP1Locked = false;
  sceneUI.charSelectLockInActive = false;
  sceneUI.charSelectLockInTimer = 0;
  p1Selected = CHARACTER_UPHEAVAL;
  p2Selected = CHARACTER_CRIMSON_KABUKI;
  currentScene = GAME_STATE.CHAR_SELECT;
  sfxChooseFighter.play();
}

function confirmCharSelect() {
  const slotId = getCharSlotId(sceneUI.charSelectCol, sceneUI.charSelectRow);
  if (!slotId) return;

  if (sceneUI.charSelectPhase === 'P1') {
    p1Selected = slotId;
    sceneUI.charSelectP1Locked = true;
    if (isTwoPlayerMode()) {
      sceneUI.charSelectPhase = 'P2';
      sceneUI.charSelectCol = slotId === CHARACTER_UPHEAVAL ? 1 : 0;
      sceneUI.charSelectRow = 0;
      return;
    }
    p2Selected = getOppositeCharacter(p1Selected);
  } else {
    p2Selected = slotId;
  }

  sceneUI.charSelectLockInActive = true;
  sceneUI.charSelectLockInTimer = CHAR_SELECT_LOCK_IN_DURATION;
  sfxCharSelected.play();
}

function updateTitleScreen() {
  sceneUI.titleFlashTimer += 1;
  if (isEnterPressed()) {
    sfxCharSelected.cloneNode(true).play();
    enterMainMenu();
  }
}

function updateMainMenu() {
  if (sceneUI.menuTransitionActive) {
    sceneUI.menuSlideOffset = Math.max(0, sceneUI.menuSlideOffset - MENU_SLIDE_SPEED);
    if (sceneUI.menuSlideOffset <= 0) sceneUI.menuTransitionActive = false;
  }

  if (isMenuUpPressed()) {
    sceneUI.menuIndex = (sceneUI.menuIndex - 1 + MENU_OPTIONS.length) % MENU_OPTIONS.length;
  }
  if (isMenuDownPressed()) {
    sceneUI.menuIndex = (sceneUI.menuIndex + 1) % MENU_OPTIONS.length;
  }

  if (!isEnterPressed()) return;
  sfxCharSelected.cloneNode(true).play();
  const option = MENU_OPTIONS[sceneUI.menuIndex];
  if (option === 'HOW TO PLAY') {
    currentScene = GAME_STATE.TUTORIAL_SCREEN;
    sceneUI.tutorialMoveIndex = 0;
    sceneUI.tutorialAnimFrame = 0;
    sceneUI.tutorialAnimTick = 0;
    sceneUI.tutorialDemoProjX = 0;
    return;
  }
  if (option === 'STORY MODE') {
    currentMode = option;
    resetStoryIntro();
    currentScene = GAME_STATE.STORY_INTRO;
    return;
  }
  enterCharSelect();
}

function updateTutorialScreen() {
  if (isSpacePressed()) {
    currentScene = GAME_STATE.MAIN_MENU;
    return;
  }
  const up = Boolean(keysPressed.ArrowUp || keysPressed.KeyW);
  const down = Boolean(keysPressed.ArrowDown || keysPressed.KeyS);
  if (up) {
    sceneUI.tutorialMoveIndex = (sceneUI.tutorialMoveIndex - 1 + tutorialMoves.length) % tutorialMoves.length;
  }
  if (down) {
    sceneUI.tutorialMoveIndex = (sceneUI.tutorialMoveIndex + 1) % tutorialMoves.length;
  }
  if (sceneUI.tutorialMoveIndex === 7) {
    sceneUI.tutorialDemoProjX += 5;
    if (sceneUI.tutorialDemoProjX > TUTORIAL_DEMO_PROJ_MAX_X) sceneUI.tutorialDemoProjX = 0;
  } else {
    sceneUI.tutorialDemoProjX = 0;
  }
  sceneUI.tutorialAnimTick += 1;
  if (sceneUI.tutorialAnimTick >= TUTORIAL_ANIM_TICKS) {
    sceneUI.tutorialAnimTick = 0;
    sceneUI.tutorialAnimFrame += 1;
  }
}

function updateCharSelect() {
  const phase = sceneUI.charSelectPhase;
  const up = Boolean(keysPressed.ArrowUp || (phase === 'P1' && keysPressed.KeyW));
  const down = Boolean(keysPressed.ArrowDown || (phase === 'P1' && keysPressed.KeyS));
  const left = Boolean(keysPressed.ArrowLeft || (phase === 'P1' && keysPressed.KeyA));
  const right = Boolean(keysPressed.ArrowRight || (phase === 'P1' && keysPressed.KeyD));

  if (keysPressed.Tab && phase === 'P1' && !sceneUI.charSelectLockInActive) {
    sceneUI.menuIndex = (sceneUI.menuIndex + 1) % DEMO_MENU_OPTIONS.length;
    currentMode = DEMO_MENU_OPTIONS[sceneUI.menuIndex];
  }

  if (sceneUI.charSelectLockInActive) {
    sceneUI.charSelectLockInTimer -= 1;
    if (sceneUI.charSelectLockInTimer <= 0) beginFightStage();
    return;
  }

  if (up) sceneUI.charSelectRow = Math.max(0, sceneUI.charSelectRow - 1);
  if (down) sceneUI.charSelectRow = Math.min(CHAR_GRID_ROWS - 1, sceneUI.charSelectRow + 1);
  if (left) sceneUI.charSelectCol = Math.max(0, sceneUI.charSelectCol - 1);
  if (right) sceneUI.charSelectCol = Math.min(CHAR_GRID_COLS - 1, sceneUI.charSelectCol + 1);

  const confirm = phase === 'P1'
    ? Boolean(keysPressed.Enter || keysPressed.KeyJ)
    : Boolean(keysPressed.Enter || keysPressed.Numpad1);
  if (confirm) confirmCharSelect();
}

function updateMatchOverDocumentation() {
  if (!isSpacePressed()) return;

  p1RoundWins = 0;
  p2RoundWins = 0;
  resetTournament();
  sceneUI.charSelectCol = 0;
  sceneUI.charSelectRow = 0;
  sceneUI.charSelectPhase = 'P1';
  sceneUI.charSelectP1Locked = false;
  sceneUI.charSelectLockInActive = false;
  sceneUI.charSelectLockInTimer = 0;
  currentScene = GAME_STATE.CHAR_SELECT;
  sfxChooseFighter.play();
  menuMusic.currentTime = 10;
  if (menuMusic.paused) menuMusic.play();
}

function update(timestamp) {
  updateBackgroundPropsClock();

  switch (currentScene) {
    case GAME_STATE.CHAR_SELECT:
      updateCharSelect();
      break;
    case GAME_STATE.MATCH_OVER_DOCUMENTATION:
      updateMatchOverDocumentation();
      break;
    case GAME_STATE.FIGHT_STAGE:
      updateRoundTimer(timestamp);
      updateRoundIntermission();
      updateFightStage();
      break;
  }

  for (const code of Object.keys(keysPressed)) delete keysPressed[code];
}

function gameLoop(timestamp) {
  update(timestamp);
  draw();
  requestAnimationFrame(gameLoop);
}

function bootDemoCharSelect() {
  currentScene = GAME_STATE.CHAR_SELECT;
  currentMode = DEMO_MENU_OPTIONS[sceneUI.menuIndex];
  sceneUI.charSelectCol = 0;
  sceneUI.charSelectRow = 0;
  sceneUI.charSelectPhase = 'P1';
  sceneUI.charSelectP1Locked = false;
  sceneUI.charSelectLockInActive = false;
  sceneUI.charSelectLockInTimer = 0;
  p1Selected = CHARACTER_UPHEAVAL;
  p2Selected = CHARACTER_CRIMSON_KABUKI;
  sfxChooseFighter.play();
  menuMusic.currentTime = 10;
  menuMusic.play().catch(() => {
    window.addEventListener('keydown', () => {
      menuMusic.currentTime = 10;
      menuMusic.play();
    }, { once: true });
    window.addEventListener('mousemove', () => {
      menuMusic.currentTime = 10;
      menuMusic.play();
    }, { once: true });
  });
}

async function init() {
  configurePixelatedCanvas();
  setupInput();
  try {
    await loadAllAssets();
  } catch (error) {
    console.error('Asset loading failed:', error);
  }
  bootDemoCharSelect();
  requestAnimationFrame(gameLoop);
}

init();

