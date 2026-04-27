import _FOUR_SQUARES from "../assets/upgrades/four_squares.png";
import _TABLET from "../assets/upgrades/tablet.png";
import _CASH from "../assets/upgrades/cash.png";
import _SWORD from "../assets/upgrades/sword.png";
import _HEAT_UP from "../assets/upgrades/heat_up.png";
import _BACKPACK from "../assets/upgrades/backpack.png";
import _HEAT_TIME from "../assets/upgrades/heat_time.png";
import _CHEST from "../assets/upgrades/chest.png";
import _CHEST_UP from "../assets/upgrades/chest_up.png";
import _CHEST_MUTE from "../assets/upgrades/chest_mute.png";
import _HEAT_WAVES from "../assets/upgrades/heat_waves.png";
import _SKULL_ARROW from "../assets/upgrades/skull_arrow.png";
import _CHEST_CASH from "../assets/upgrades/chest_cash.png";
import _KEY from "../assets/upgrades/key.png";
import _ROOK_PLUS from "../assets/upgrades/rook_plus.png";
import _SLIDER from "../assets/upgrades/slider.png";
import _HEAL_SHIELD_CARD from "../assets/upgrades/heal_shield_card.png";
import _SHIELD from "../assets/upgrades/shield.png";
import _IMPLANT from "../assets/upgrades/implant.png";
import _EXCLAMATION from "../assets/upgrades/exclamation.png";
import _WRENCH_UP from "../assets/upgrades/wrench_up.png";
import _DOT_DASH_UP from "../assets/upgrades/dot_dash_up.png";
import _REFRESH from "../assets/upgrades/refresh.png";
import _HEAL_SHIELD from "../assets/upgrades/heal_shield.png";
import _HEAL_SHIELD_UP from "../assets/upgrades/heal_shield_up.png";
import _CHIP from "../assets/upgrades/chip.png";
import _TAD from "../assets/upgrades/tad.png";
import _STAR from "../assets/upgrades/star.png";
import _BOX_DOWN from "../assets/upgrades/box_down.png";
import _ARROWS_RIGHT from "../assets/upgrades/arrows_right.png";
import _ARROWS_UP from "../assets/upgrades/arrows_up.png";
import _DASHED_EYE from "../assets/upgrades/dashed_eye.png";
import _FIST from "../assets/upgrades/fist.png";
import _SKULL_PLUS from "../assets/upgrades/skull_plus.png";
import _DASHED_CIRCLE_PLUS from "../assets/upgrades/dashed_circle_plus.png";
import _SWORD_PLUS from "../assets/upgrades/sword_plus.png";
import _HEAT_SKULL from "../assets/upgrades/heat_skull.png";
import _TRIAGE from "../assets/upgrades/triage.png";
import _DESTROYER from "../assets/upgrades/destroyer.png";
import _ASSASSIN from "../assets/upgrades/assassin.png";
import _VANDAL from "../assets/upgrades/vandal.png";
import _RECON from "../assets/upgrades/recon.png";
import _THIEF from "../assets/upgrades/thief.png";
import _CIRCLE_SQUARE_BRACKETS from "../assets/upgrades/circle_square_brackets.png";
import _STAR_SQUARE_BRACKETS from "../assets/upgrades/star_square_brackets.png";
import _CIRCLE_SQUARE_BRACKETS_UP from "../assets/upgrades/circle_square_brackets_up.png";
import _STAR_SQUARE_BRACKETS_UP from "../assets/upgrades/star_square_brackets_up.png";

export const UPGRADE_ICONS: Record<string, string> = {
	"Expansion": _FOUR_SQUARES,
	"Informant": _TABLET,
	"Credit Limit": _CASH,
	"Enhanced Weaponry": _SWORD,
	"Deluxe Weaponry": _SWORD,
	"Heat Sink": _HEAT_UP,
	"Carrier": _BACKPACK,
	"Carrier+": _BACKPACK,
	"Quick Vent": _HEAT_TIME,
	"Scavenger": _CHEST,
	"Loot Siphon": _CHEST_UP,
	"Soundproof": _CHEST_MUTE,
	"Active Cool": _HEAT_WAVES,
	"Firm Stance": _SKULL_ARROW,
	"Loose Change": _CHEST_CASH,
	"Locksmith": _KEY,
	"Fixative": _ROOK_PLUS,
	"Slider": _SLIDER,
	"Safeguard": _HEAL_SHIELD,
	"Advanced Shields": _HEAL_SHIELD,
	"Safeguard+": _HEAL_SHIELD,
	"Shield Comm": _HEAL_SHIELD_CARD,
	"Shielded": _SHIELD,
	"Armored": _SHIELD,
	"Restore": _HEAL_SHIELD,
	"Advanced Patch": _HEAL_SHIELD,
	"Restore+": _HEAL_SHIELD,
	"Health Comm": _HEAL_SHIELD_CARD,
	"Panacea Kit": _HEAL_SHIELD,
	"Regen": _IMPLANT,
	"Null Hazard": _EXCLAMATION,
	"Reinforce": _WRENCH_UP,
	"Unfazed": _DOT_DASH_UP,
	"Resist Comm": _HEAL_SHIELD_CARD,
	"Recovery": _REFRESH,
	"Advanced Mch": _HEAL_SHIELD,
	"Helping Hands": _IMPLANT,
	"Self-Revive": _HEAL_SHIELD,
	"Field Medic": _HEAL_SHIELD_UP,
	"Deluxe Chips": _CHIP,
	"Enhanced Chips": _CHIP,
	"TAD Boost": _TAD,
	"Tracker": _STAR,
	"Deluxe SMG Mods": _CHIP,
	"Enhanced Heavy SMG": _SWORD,
	"SMG Mods": _CHIP,
	"AR Mods": _CHIP,
	"Enhanced Light AR": _SWORD,
	"Deluxe AR Mods": _CHIP,
	"Volt PR": _SWORD,
	"Volt Mods": _CHIP,
	"Precision Mods": _CHIP,
	"MIPS Sniper": _SWORD,
	"Deluxe Volt Mods": _CHIP,
	"Enhanced Volt SMG": _SWORD,
	"Enhanced Hardline PR": _SWORD,
	"Deluxe Precision Mods": _CHIP,
	"Eyes Open": _BOX_DOWN,
	"Bad Step": _BOX_DOWN,
	"Got Em": _BOX_DOWN,
	"Survivor": _IMPLANT,
	"Graceful": _IMPLANT,
	"Sprinter": _IMPLANT,
	"Spare Rounds": _BOX_DOWN,
	"Hot Potato": _BOX_DOWN,
	"Explosives": _BOX_DOWN,
	"Lights Out": _BOX_DOWN,
	"Anti-Virus Packs": _HEAL_SHIELD,
	"Anti Virus": _EXCLAMATION,
	"Bullseye": _BOX_DOWN,
	"Chemist": _BOX_DOWN,
	"Flex Matrix": _ARROWS_RIGHT,
	"Cardio Kick": _HEAL_SHIELD,
	"Full Throttle": _ARROWS_UP,
	"Cloud Cover": _DASHED_EYE,
	"LMG Mods": _CHIP,
	"Railgun Mods": _CHIP,
	"Shotgun Mods": _CHIP,
	"Hard Strike": _FIST,
	"Knife Fight": _IMPLANT,
	"Hurting Hands": _IMPLANT,
	"MIPS Railgun": _SWORD,
	"MIPS Shotgun": _SWORD,
	"Cutthroat": _SKULL_PLUS,
	"Enh. Retaliator LMG": _SWORD,
	"Enh. MIPS Railgun": _SWORD,
	"Enh. MIPS Shotgun": _SWORD,
	"Reboot": _DASHED_CIRCLE_PLUS,
	"Dlx. Retaliator LMG": _SWORD,
	"Dlx. MIPS Railgun": _SWORD,
	"Dlx. MIPS Shotgun": _SWORD,
	"Leech": _SWORD_PLUS,
	"Heat Death": _HEAT_SKULL,
	"Energy Amp": _HEAL_SHIELD,
	"Amped": _HEAL_SHIELD,
	"Amp Stock": _HEAL_SHIELD,
	"Scab Factory": _DASHED_CIRCLE_PLUS,
	"Lethal Amp": _SKULL_PLUS,
	"Triage": _TRIAGE,
	"Destroyer": _DESTROYER,
	"Assassin": _ASSASSIN,
	"Vandal": _VANDAL,
	"Recon": _RECON,
	"Thief": _THIEF,
	"Triage+": _TRIAGE,
	"Destroyer+": _DESTROYER,
	"Assassin+": _ASSASSIN,
	"Vandal+": _VANDAL,
	"Recon+": _RECON,
	"Thief+": _THIEF,
	"Harvester": _IMPLANT,
	"Capacitors": _IMPLANT,
	"Tac Amp": _CIRCLE_SQUARE_BRACKETS,
	"Prime Amp": _STAR_SQUARE_BRACKETS,
	"Head Start": _CIRCLE_SQUARE_BRACKETS_UP,
	"Primed":_STAR_SQUARE_BRACKETS_UP,
};