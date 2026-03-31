import createModule from './bin/neomod.js';

// Annoying, but we need to track if the module is 'alive'
//
// Because in the case the WASM module runs out of memory,
// we can't even call delete(), we need to re-create a new module!
//
// Or else, we wouldn't be able to recover from an error caused
// by a malicious map.

let alive = true;
let module;

async function init() {
    module = await createModule({
        wasmMemory: new WebAssembly.Memory({
            initial: 256,
            maximum: process.env.NEOSU_MAX_WASM_PAGES || 1024,
        })
    });
    module.onAbort = () => { alive = false; };
    alive = true;
}

// WASM classes/functions
async function Beatmap(osu_bytes) {
    if(!alive) await init();
    return new module.Beatmap(osu_bytes);
}


// WASM constants
await init();
const PP_ALGORITHM_VERSION = module.PP_ALGORITHM_VERSION;


// Other constants
const ModFlags = {
  // Green mods
  NoFail: 1n << 0n,
  Easy: 1n << 1n,
  Autopilot: 1n << 2n,
  Relax: 1n << 3n,

  // Red mods
  Hidden: 1n << 4n,
  HardRock: 1n << 5n,
  Flashlight: 1n << 6n,
  SuddenDeath: 1n << 7n,
  Perfect: (1n << 7n) | (1n << 8n),
  Nightmare: 1n << 9n,

  // Special mods
  NoPitchCorrection: 1n << 10n,
  TouchDevice: 1n << 11n,
  SpunOut: 1n << 12n,
  ScoreV2: 1n << 13n,
  FPoSu: 1n << 14n,
  Target: 1n << 15n,

  // Experimental mods
  AROverrideLock: 1n << 16n,
  ODOverrideLock: 1n << 17n,
  Timewarp: 1n << 18n,
  ARTimewarp: 1n << 19n,
  Minimize: 1n << 20n,
  Jigsaw1: 1n << 21n,
  Jigsaw2: 1n << 22n,
  Wobble1: 1n << 23n,
  Wobble2: 1n << 24n,
  ARWobble: 1n << 25n,
  FullAlternate: 1n << 26n,
  Shirone: 1n << 27n,
  Mafham: 1n << 28n,
  HalfWindow: 1n << 29n,
  HalfWindowAllow300s: 1n << 30n,
  Ming3012: 1n << 31n,
  No100s: 1n << 32n,
  No50s: 1n << 33n,
  MirrorHorizontal: 1n << 34n,
  MirrorVertical: 1n << 35n,
  FPoSu_Strafing: 1n << 36n,
  FadingCursor: 1n << 37n,
  FPS: 1n << 38n,
  ReverseSliders: 1n << 39n,
  Millhioref: 1n << 40n,
  StrictTracking: 1n << 41n,
  ApproachDifferent: 1n << 42n,
  Singletap: 1n << 43n,
  NoKeylock: 1n << 44n,
  NoPausing: 1n << 45n,
  SliderHeadAccuracy: 1n << 46n,
  SliderTailAccuracy: 1n << 47n,
  DKS: 1n << 48n,
  Traceable: 1n << 49n,
  FreezeFrame: 1n << 50n,
};
Object.freeze(ModFlags);


export default {Beatmap, ModFlags, PP_ALGORITHM_VERSION};
