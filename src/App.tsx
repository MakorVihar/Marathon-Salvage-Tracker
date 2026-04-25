import React, { useState, useMemo, useRef } from "react";
import { ICONS } from "./icons";

// ── Rarity tiers ─────────────────────────────────────────────────────────────
const R = {
  s:  {label:"Standard",   color:"#9B9991"},
  e:  {label:"Enhanced",   color:"#5A9E30"},
  d:  {label:"Deluxe",     color:"#3A82C4"},
  su: {label:"Superior",   color:"#9B6CCC"},
  p:  {label:"Prestige",   color:"#D4922A"},
  c:  {label:"Contraband", color:"#cc2222"},
};

// ── Container types ───────────────────────────────────────────────────────────
const CONTAINER_MAPS: Record<string,string[]> = {
  "Locked Rooms [Deluxe]":   ["Perimeter","Dire Marsh","Outpost","Cryo Archive"],
  "Locked Rooms [Superior]": ["Perimeter","Dire Marsh","Outpost","Cryo Archive"],
  "Locked Rooms [Prestige]": ["Perimeter","Dire Marsh","Outpost","Cryo Archive"],
  "Lockdown Zones":    ["Dire Marsh"],
  "Priority Hostiles": ["Perimeter","Dire Marsh","Outpost","Cryo Archive"],
  "Supply Drop":       ["Perimeter","Dire Marsh","Outpost","Cryo Archive"],
  "UESC":              ["Perimeter","Dire Marsh","Outpost","Cryo Archive"],
  "Arms Locker":       ["Perimeter","Dire Marsh","Outpost","Cryo Archive"],
  "Medical Cabinet":   ["Perimeter","Dire Marsh","Outpost","Cryo Archive"],
  "Munitions Crate":   ["Perimeter","Dire Marsh","Outpost","Cryo Archive"],
  "Tool Cart":         ["Perimeter","Dire Marsh","Outpost","Cryo Archive"],
  "Core Storage":      ["Perimeter","Dire Marsh","Outpost","Cryo Archive"],
  "Bioprinter":        ["Perimeter","Dire Marsh","Outpost","Cryo Archive"],
  "Grassy Areas":      ["Perimeter","Dire Marsh"],
};

// ── Salvage items ─────────────────────────────────────────────────────────────
const SALVAGE: Record<string,{r:string, locs:{map:string,poi:string}[], containers:string[]}> = {
  "Unstable Biomass":    {r:"s", containers:[], locs:[{map:"Perimeter",poi:"Hauler"},{map:"Perimeter",poi:"Overflow"},{map:"Dire Marsh",poi:"Algae Ponds"},{map:"Dire Marsh",poi:"Greenhouse"}]},
  "Unstable Diode":      {r:"s", containers:[], locs:[{map:"Perimeter",poi:"North Relay"},{map:"Perimeter",poi:"South Relay"},{map:"Dire Marsh",poi:"AI Uplink"}]},
  "Unstable Gel":        {r:"s", containers:[], locs:[{map:"Dire Marsh",poi:"Bio-Research"},{map:"Outpost",poi:"Orientation"},{map:"Outpost",poi:"Processing"}]},
  "Unstable Gunmetal":   {r:"s", containers:[], locs:[{map:"Perimeter",poi:"Station"},{map:"Dire Marsh",poi:"AI Uplink"},{map:"Dire Marsh",poi:"Maintenance"}]},
  "Unstable Lead":       {r:"s", containers:[], locs:[{map:"Dire Marsh",poi:"Quarantine"},{map:"Dire Marsh",poi:"Complex"},{map:"Outpost",poi:"Airfield"}]},
  "Reclaimed Biostripping":{r:"e",containers:["Arms Locker"],locs:[{map:"Perimeter",poi:"Hauler"},{map:"Dire Marsh",poi:"Algae Ponds"},{map:"Cryo Archive",poi:"Preservation"}]},
  "Sparkleaf":           {r:"e", containers:["Grassy Areas"],locs:[{map:"Perimeter",poi:"Overflow"},{map:"Dire Marsh",poi:"Greenhouse"},{map:"Cryo Archive",poi:"Revival"}]},
  "Dermachem Pack":      {r:"e", containers:["Medical Cabinet"],locs:[{map:"Outpost",poi:"Pinwheel Base"},{map:"Cryo Archive",poi:"Steerage"}]},
  "Deimosite Rods":      {r:"e", containers:["Arms Locker"],locs:[{map:"Dire Marsh",poi:"Maintenance"},{map:"Cryo Archive",poi:"Index"}]},
  "Altered Wire":        {r:"e", containers:["Munitions Crate"],locs:[{map:"Perimeter",poi:"Station"},{map:"Cryo Archive",poi:"Biostock"}]},
  "Plasma Filament":     {r:"e", containers:["Bioprinter"],locs:[{map:"Dire Marsh",poi:"AI Uplink"},{map:"Cryo Archive",poi:"Cargo"}]},
  "Surveillance Lens":   {r:"e", containers:["Bioprinter"],locs:[{map:"Dire Marsh",poi:"Quarantine"},{map:"Cryo Archive",poi:"Revival"}]},
  "Dynamic Compounds":   {r:"e", containers:[],locs:[{map:"Dire Marsh",poi:"Quarantine"},{map:"Dire Marsh",poi:"Complex"},{map:"Dire Marsh",poi:"Greenhouse"}]},
  "Drone Resin":         {r:"e", containers:[],locs:[{map:"Dire Marsh",poi:"Bio-Research"},{map:"Dire Marsh",poi:"AI Uplink"},{map:"Outpost",poi:"Processing"}]},
  "Drone Node":          {r:"e", containers:["Tool Cart"],locs:[{map:"Outpost",poi:"Orientation"},{map:"Outpost",poi:"Pinwheel Base"},{map:"Outpost",poi:"Processing"},{map:"Cryo Archive",poi:"Steerage"}]},
  "Fractal Circuit":     {r:"e", containers:["Core Storage"],locs:[{map:"Perimeter",poi:"North Relay"},{map:"Outpost",poi:"Flight Control"},{map:"Outpost",poi:"Dormitories"},{map:"Outpost",poi:"Pinwheel Base"},{map:"Cryo Archive",poi:"Preservation"}]},
  "Storage Drive":       {r:"e", containers:["Core Storage"],locs:[{map:"Perimeter",poi:"South Relay"},{map:"Cryo Archive",poi:"Biostock"}]},
  "Neurochem Pack":      {r:"d", containers:["Medical Cabinet","Locked Rooms [Deluxe, Superior, Prestige]"],locs:[{map:"Outpost",poi:"Pinwheel Base"},{map:"Cryo Archive",poi:"Steerage"}]},
  "Sterilized Biostripping":{r:"d",containers:["Arms Locker","Locked Rooms [Deluxe, Superior, Prestige]"],locs:[{map:"Perimeter",poi:"Hauler"},{map:"Dire Marsh",poi:"Algae Ponds"},{map:"Cryo Archive",poi:"Preservation"}]},
  "Tarax Seed":          {r:"d", containers:["Medical Cabinet","Locked Rooms [Deluxe, Superior, Prestige]","Grassy Areas"],locs:[{map:"Perimeter",poi:"Overflow"},{map:"Dire Marsh",poi:"Greenhouse"},{map:"Cryo Archive",poi:"Revival"}]},
  "Cetinite Rods":       {r:"d", containers:[],locs:[{map:"Dire Marsh",poi:"Maintenance"},{map:"Cryo Archive",poi:"Index"}]},
  "Anomalous Wire":      {r:"d", containers:["Munitions Crate","Locked Rooms [Deluxe, Superior, Prestige]"],locs:[{map:"Dire Marsh",poi:"Bio-Research"},{map:"Cryo Archive",poi:"Cargo"}]},
  "Tachyon Filament":    {r:"d", containers:["Bioprinter","Locked Rooms [Deluxe, Superior, Prestige]"],locs:[{map:"Dire Marsh",poi:"AI Uplink"},{map:"Cryo Archive",poi:"Cargo"}]},
  "Volatile Compounds":  {r:"d", containers:["Munitions Crate","Locked Rooms [Deluxe, Superior, Prestige]"],locs:[{map:"Dire Marsh",poi:"Complex"},{map:"Outpost",poi:"Airfield"},{map:"Outpost",poi:"Pinwheel Base"},{map:"Cryo Archive",poi:"Index"}]},
  "Thoughtwave Lens":    {r:"d", containers:[],locs:[{map:"Dire Marsh",poi:"AI Uplink"},{map:"Dire Marsh",poi:"Complex"},{map:"Dire Marsh",poi:"Maintenance"}]},
  "Biomata Resin":       {r:"d", containers:["Tool Cart","Locked Rooms [Deluxe, Superior, Prestige]"],locs:[{map:"Dire Marsh",poi:"Bio-Research"},{map:"Cryo Archive",poi:"Cargo"}]},
  "Biomata Node":        {r:"d", containers:["Tool Cart","Locked Rooms [Deluxe, Superior, Prestige]"],locs:[{map:"Outpost",poi:"Orientation"},{map:"Outpost",poi:"Pinwheel Base"},{map:"Outpost",poi:"Processing"},{map:"Cryo Archive",poi:"Steerage"}]},
  "Amygdala Drive":      {r:"d", containers:["Core Storage","Locked Rooms [Deluxe, Superior, Prestige]"],locs:[{map:"Perimeter",poi:"South Relay"},{map:"Cryo Archive",poi:"Biostock"}]},
  "Paradox Circuit":     {r:"d", containers:["Core Storage","Locked Rooms [Deluxe, Superior, Prestige]"],locs:[{map:"Perimeter",poi:"North Relay"},{map:"Outpost",poi:"Flight Control"},{map:"Outpost",poi:"Dormitories"},{map:"Outpost",poi:"Pinwheel Base"},{map:"Cryo Archive",poi:"Preservation"}]},
  "UESC Obedience Matrix":{r:"d",containers:["UESC","Supply Drop","Priority Hostiles"],locs:[]},
  "Biolens Seed":        {r:"su",containers:[],locs:[{map:"Outpost",poi:"Pinwheel Base"},{map:"Cryo Archive",poi:"Vaults"}]},
  "Neural Insulation":   {r:"su",containers:["Lockdown Zones","Locked Rooms [Superior, Prestige]"],locs:[{map:"Perimeter",poi:"North Relay"},{map:"Perimeter",poi:"Hauler"},{map:"Dire Marsh",poi:"Algae Ponds"},{map:"Outpost",poi:"Flight Control"},{map:"Outpost",poi:"Dormitories"},{map:"Cryo Archive",poi:"Preservation"}]},
  "Enzyme Replicator":   {r:"su",containers:["Lockdown Zones","Locked Rooms [Superior, Prestige]"],locs:[{map:"Dire Marsh",poi:"Complex"},{map:"Dire Marsh",poi:"Maintenance"},{map:"Outpost",poi:"Airfield"},{map:"Cryo Archive",poi:"Index"}]},
  "Predictive Framework":{r:"su",containers:["Lockdown Zones","Locked Rooms [Superior, Prestige]"],locs:[{map:"Perimeter",poi:"Station"},{map:"Perimeter",poi:"South Relay"},{map:"Cryo Archive",poi:"Biostock"}]},
  "Ballistic Turbine":   {r:"su",containers:["Lockdown Zones","Locked Rooms [Superior, Prestige]"],locs:[{map:"Dire Marsh",poi:"Maintenance"},{map:"Outpost",poi:"Airfield"},{map:"Outpost",poi:"Pinwheel Base"}]},
  "Reflex Coil":         {r:"su",containers:["Lockdown Zones","Locked Rooms [Superior, Prestige]"],locs:[{map:"Dire Marsh",poi:"AI Uplink"},{map:"Dire Marsh",poi:"Bio-Research"},{map:"Cryo Archive",poi:"Cargo"}]},
  "Shell ID":            {r:"su",containers:["Priority Hostiles"],locs:[]},
  "Hazard Capsule":      {r:"p", containers:["Locked Rooms [Prestige]"],locs:[{map:"Cryo Archive",poi:"Vaults"}]},
  "Alien Alloy":         {r:"p", containers:["Locked Rooms [Prestige]"],locs:[{map:"Cryo Archive",poi:"Vaults"}]},
  "Synapse Cube":        {r:"p", containers:["Locked Rooms [Prestige]"],locs:[{map:"Cryo Archive",poi:"Vaults"}]},
  "Compiler Ganglion":   {r:"c", containers:[],locs:[{map:"Cryo Archive",poi:"Vaults"}]},
};

// ── Map meta ──────────────────────────────────────────────────────────────────
const MAPS = {
  "Perimeter":    {diff:"Beginner", color:"#5A9E30"},
  "Dire Marsh":   {diff:"Intermediate", color:"#9B6CCC"},
  "Outpost":      {diff:"Advanced", color:"#D4922A"},
  "Cryo Archive": {diff:"Endgame", color:"#3A82C4"},
};

// ── Types ─────────────────────────────────────────────────────────────────────
interface RankDef {
  name: string;
  fx: string;
  cr: number;
  req: [string, number][];
}
interface NodeDef {
  id: string;          // unique node id e.g. "ca-expansion"
  name: string;        // display name
  requires: string | null;  // id of prerequisite node (or null)
  col: number;         // 1-based grid column
  row: number;         // 1-based grid row
  ranks: RankDef[];
}

interface SalvageInfo {
  r?: keyof typeof R;
  locs?: { map: string; poi: string }[]; // <--- We missed the 'map: string' part!
  containers?: string[];
}

// ── Faction data ──────────────────────────────────────────────────────────────
// rankId = `${nodeId}:${rankIndex}` e.g. "ca-expansion:0"

const FACTIONS: Record<string, {
  accent: string; rep: string; tag: string;
  cols: number; rows: number;
  nodes: NodeDef[];
}> = {

  CyberAcme: {
    accent:"#1DB878", rep:"ONI", tag:"Vault · Utility · Economy",
    cols:6, rows:4,
    nodes:[
      {id:"ca-expansion",    name:"Expansion",          requires:null,          col:1,row:1, ranks:[
        {name:"Expansion 1",      fx:"Vault Size +8 rows",               cr:2500,  req:[["Unstable Diode",12]]},
        {name:"Expansion 2",      fx:"Vault Size +8 rows",               cr:4000,  req:[["Unstable Diode",22],["Unstable Gunmetal",12]]},
        {name:"Expansion 3",      fx:"Vault Size +6 rows",               cr:5000,  req:[["Unstable Diode",27],["Unstable Gunmetal",15]]},
        {name:"Expansion 4",      fx:"Vault Size +4 rows",               cr:7000,  req:[["Unstable Diode",30],["Unstable Gunmetal",18]]},
        {name:"Expansion 5",      fx:"Vault Size +4 rows",               cr:10000, req:[["Unstable Diode",50],["Unstable Gunmetal",30]]},
      ]},
      {id:"ca-informant",    name:"Informant",          requires:null,          col:2,row:1, ranks:[
        {name:"Informant.exe 1",  fx:"Data Card Credit Value +50%",      cr:1500,  req:[]},
        {name:"Informant.exe 2",  fx:"Data Card Credit Value +50%",      cr:2000,  req:[]},
      ]},
      {id:"ca-credit-limit", name:"Credit Limit",       requires:"ca-informant",col:3,row:1, ranks:[
        {name:"Credit Limit 1",   fx:"Credit Wallet Capacity +20k",      cr:2500,  req:[]},
        {name:"Credit Limit 2",   fx:"Credit Wallet Capacity +50k",      cr:4000,  req:[]},
        {name:"Credit Limit 3",   fx:"Credit Wallet Capacity +200k",     cr:7000,  req:[]},
        {name:"Credit Limit 4",   fx:"Credit Wallet Capacity +700k",     cr:10000, req:[]},
        {name:"Credit Limit 5",   fx:"Credit Wallet Capacity +9000k",    cr:50000, req:[]},
      ]},
      {id:"ca-enh-weaponry", name:"Enhanced Weaponry",  requires:null,          col:4,row:1, ranks:[
        {name:"Enhanced Weaponry",fx:"Unlocks Enhanced Overrun AR, V11 Punch, CE Tactical Sidearm",cr:2500,req:[]},
      ]},
      {id:"ca-dlx-weaponry", name:"Deluxe Weaponry",    requires:"ca-enh-weaponry",col:5,row:1, ranks:[
        {name:"Deluxe Weaponry",  fx:"Unlocks Deluxe Overrun AR, V11 Punch, CE Tactical Sidearm",cr:4000,req:[]},
      ]},
      {id:"ca-heat-sink",    name:"Heat Sink",          requires:null,          col:6,row:1, ranks:[
        {name:"HEAT_SINK.EXE 1",  fx:"Heat Capacity +20",                cr:2500,  req:[["Unstable Biomass",12]]},
        {name:"HEAT_SINK.EXE 2",  fx:"Heat Capacity +20",                cr:3500,  req:[["Unstable Biomass",24],["Unstable Lead",12]]},
        {name:"HEAT_SINK.EXE 3",  fx:"Heat Capacity +20",                cr:5000,  req:[["Unstable Biomass",30],["Unstable Lead",20]]},
      ]},
      {id:"ca-carrier",      name:"Carrier",            requires:null,          col:1,row:2, ranks:[
        {name:"Carrier",          fx:"Enhanced Backpacks in Armory",     cr:1500,  req:[]},
      ]},
      {id:"ca-carrier-plus", name:"Carrier+",           requires:"ca-carrier",  col:5,row:2, ranks:[
        {name:"Carrier+",         fx:"Deluxe Backpacks in Armory",       cr:4000,  req:[]},
      ]},
      {id:"ca-quick-vent",   name:"Quick Vent",         requires:"ca-heat-sink",col:6,row:2, ranks:[
        {name:"QUICK_VENT.EXE 1", fx:"Heat Recovery Speed -20%",        cr:2500,  req:[["Unstable Gel",8]]},
        {name:"QUICK_VENT.EXE 2", fx:"Heat Recovery Speed -20%",        cr:4000,  req:[["Unstable Gel",16]]},
      ]},
      {id:"ca-scavenger",    name:"Scavenger",          requires:null,          col:1,row:3, ranks:[
        {name:"SCAVENGER.EXE 1",  fx:"Loot Speed +20",                   cr:750,   req:[]},
        {name:"SCAVENGER.EXE 2",  fx:"Loot Speed +20",                   cr:2500,  req:[]},
        {name:"SCAVENGER.EXE 3",  fx:"Loot Speed +20%",                  cr:4000,  req:[]},
      ]},
      {id:"ca-loot-siphon",  name:"Loot Siphon",        requires:"ca-scavenger", col:2,row:3, ranks:[
        {name:"LOOT_SIPHON.EXE 1",fx:"Tactical Energy on Container Loot 5%",cr:1500,req:[]},
        {name:"LOOT_SIPHON.EXE 2",fx:"Tactical Energy on Container Loot 5%",cr:4000,req:[]},
      ]},
      {id:"ca-soundproof",   name:"Soundproof",         requires:"ca-loot-siphon", col:5,row:3, ranks:[
        {name:"SOUNDPROOF.EXE",   fx:"Less noise while looting",         cr:5000,  req:[]},
      ]},
      {id:"ca-active-cool",  name:"Active Cool",        requires:"ca-quick-vent",   col:6,row:3, ranks:[
        {name:"ACTIVE_COOL.EXE 1",fx:"Heat Recovery Rate 15%",           cr:3500,  req:[["Unstable Gel",24]]},
        {name:"ACTIVE_COOL.EXE 2",fx:"Heat Recovery Rate 15%",           cr:5000,  req:[["Unstable Gel",30]]},
      ]},
      {id:"ca-firm-stance",  name:"Firm Stance",        requires:null,          col:1,row:4, ranks:[
        {name:"FIRM_STANCE.EXE 1",fx:"Fall Resistance +20",              cr:750,   req:[]},
        {name:"FIRM_STANCE.EXE 2",fx:"Fall Resistance +20",              cr:4000,  req:[]},
        {name:"FIRM_STANCE.EXE 3",fx:"Fall Resistance +20",              cr:5000,  req:[]},
      ]},
      {id:"ca-loose-change", name:"Loose Change",       requires:"ca-loot-siphon", col:2,row:4, ranks:[
        {name:"LOOSE_CHANGE.EXE", fx:"Opening a container rewards 25 credits",cr:5000,req:[]},
      ]},
      {id:"ca-locksmith",    name:"Locksmith",          requires:null,          col:3,row:4, ranks:[
        {name:"Locksmith",        fx:"Unlocks lockbox key in Armory",    cr:2500,  req:[]},
        {name:"Keymaker",         fx:"Unlocks Deluxe Key templates",     cr:4000,  req:[]},
        {name:"Keymaker+",        fx:"Unlocks Superior Key templates",   cr:7000,  req:[]},
      ]},
      {id:"ca-fixative",     name:"Fixative",           requires:null,          col:4,row:4, ranks:[
        {name:"FIXATIVE.EXE",     fx:"Increased chance of Matter Fixatives from UESC",cr:3500,req:[]},
      ]},
      {id:"ca-slider",       name:"Slider",             requires:"ca-active-cool",          col:6,row:4, ranks:[
        {name:"SLIDER.EXE",       fx:"Sprint slide generates less heat", cr:7000,  req:[]},
      ]},
    ],
  },

  NuCaloric: {
    accent:"#5A9E30", rep:"Gaius", tag:"Shields · Healing · Survival",
    cols:6, rows:4,
    nodes:[
      {id:"nc-safeguard",    name:"Safeguard",          requires:null,              col:1,row:1, ranks:[
        {name:"Safeguard",        fx:"Free Daily Shield Charges in Armory",cr:750,  req:[["Unstable Biomass",16]]},
      ]},
      {id:"nc-adv-shields",  name:"Advanced Shields",   requires:"nc-safeguard",    col:2,row:1, ranks:[
        {name:"Advanced Shields", fx:"Unlocks Advanced Shield Charges",   cr:1500, req:[["Reclaimed Biostripping",10],["Unstable Biomass",10]]},
      ]},
      {id:"nc-safeguard-plus",name:"Safeguard+",        requires:"nc-adv-shields",  col:3,row:1, ranks:[
        {name:"Safeguard+",       fx:"Free Daily Advanced Shield Charges",cr:2000, req:[["Sterilized Biostripping",6],["Sparkleaf",16]]},
        {name:"Shield Stock",     fx:"Adv. Shield Charge stock +5",       cr:1500, req:[["Reclaimed Biostripping",15],["Sparkleaf",8]]},
      ]},
      {id:"nc-shield-comm",  name:"Shield Comm",        requires:"nc-safeguard-plus",col:4,row:1, ranks:[
        {name:"Shield Comm",      fx:"Contracts award Shield Charges",    cr:2000, req:[["Sterilized Biostripping",12],["Tarax Seed",6]]},
      ]},
      {id:"nc-shielded",     name:"Shielded",           requires:null,              col:5,row:1, ranks:[
        {name:"Shielded",         fx:"Enhanced Shield Implants in Armory",cr:1500, req:[["Reclaimed Biostripping",12],["Unstable Biomass",13]]},
      ]},
      {id:"nc-armored",      name:"Armored",            requires:null,              col:6,row:1, ranks:[
        {name:"Armored",          fx:"Deluxe Shield Implants in Armory",  cr:3500, req:[["Biolens Seed",7],["Neural Insulation",3]]},
      ]},
      {id:"nc-restore",      name:"Restore",            requires:null,              col:1,row:2, ranks:[
        {name:"Restore",          fx:"Free Daily Patch Kits in Armory",   cr:1500, req:[["Unstable Biomass",23]]},
      ]},
      {id:"nc-adv-patch",    name:"Advanced Patch",     requires:"nc-restore",      col:2,row:2, ranks:[
        {name:"Advanced Patch",   fx:"Unlocks Advanced Patch Kits",       cr:1500, req:[["Dermachem Pack",10],["Unstable Biomass",13]]},
      ]},
      {id:"nc-restore-plus", name:"Restore+",           requires:null,              col:3,row:2, ranks:[
        {name:"Restore+",         fx:"Free Daily Advanced Patch Kits",    cr:2000, req:[["Neurochem Pack",5],["Sparkleaf",16]]},
        {name:"Patch Stock",      fx:"Advanced Patch Kit stock +5",       cr:1500, req:[["Dermachem Pack",8],["Unstable Biomass",11]]},
      ]},
      {id:"nc-health-comm",  name:"Health Comm",        requires:"nc-restore-plus", col:4,row:2, ranks:[
        {name:"Health Comm",      fx:"Contracts award Patch Kits",        cr:5000, req:[["Hazard Capsule",2]]},
      ]},
      {id:"nc-panacea",      name:"Panacea Kit",        requires:null,              col:6,row:2, ranks:[
        {name:"Panacea Kit",      fx:"Unlocks Panacea Kits in Armory",   cr:5000, req:[["Hazard Capsule",2],["Neural Insulation",7]]},
      ]},
      {id:"nc-regen",        name:"Regen",              requires:null,              col:1,row:3, ranks:[
        {name:"Regen",            fx:"Unlocks Regen V2 implant",          cr:750,  req:[["Unstable Biomass",10]]},
        {name:"Regen+",           fx:"Unlocks Regen V3 implant",          cr:1500, req:[["Reclaimed Biostripping",28],["Sparkleaf",14]]},
        {name:"Regen++",          fx:"Unlocks Regen V4 implant",          cr:3500, req:[["Biolens Seed",7],["Neural Insulation",3]]},
      ]},
      {id:"nc-null-hazard",  name:"Null Hazard",        requires:null,              col:2,row:3, ranks:[
        {name:"NULL_HAZARD.EXE 1",fx:"Hazard Tolerance +50",             cr:750,  req:[["Unstable Biomass",19]]},
        {name:"NULL_HAZARD.EXE 2",fx:"Hazard Tolerance +50",             cr:1500, req:[["Sterilized Biostripping",5],["Sparkleaf",12]]},
        {name:"TCIV_RESIST.EXE",  fx:"Ticks, lightning & Heat Cascade dmg reduced",cr:3500,req:[["Biolens Seed",5],["Tarax Seed",7]]},
      ]},
      {id:"nc-reinforce",    name:"Reinforce",          requires:null,              col:3,row:3, ranks:[
        {name:"REINFORCE.EXE 1",  fx:"Hardware +20",                     cr:1500, req:[["Reclaimed Biostripping",8],["Unstable Biomass",9]]},
        {name:"REINFORCE.EXE 2",  fx:"Hardware +20",                     cr:2000, req:[["Sterilized Biostripping",7],["Sparkleaf",25]]},
        {name:"REINFORCE.EXE 3",  fx:"Hardware +20",                     cr:5000, req:[["Hazard Capsule",2]]},
      ]},
      {id:"nc-unfazed",      name:"Unfazed",            requires:"nc-reinforce",    col:4,row:3, ranks:[
        {name:"UNFAZED.EXE 1",    fx:"Firewall +20",                     cr:1500, req:[["Dermachem Pack",7],["Unstable Biomass",7]]},
        {name:"UNFAZED.EXE 2",    fx:"Firewall +20",                     cr:2000, req:[["Neurochem Pack",8],["Tarax Seed",5]]},
        {name:"UNFAZED.EXE 3",    fx:"Firewall +20",                     cr:5000, req:[["Hazard Capsule",2],["Tarax Seed",9]]},
      ]},
      {id:"nc-resist-comm",  name:"Resist Comm",        requires:null,              col:5,row:3, ranks:[
        {name:"RESIST COMM",      fx:"Contracts award Mechanic's Kits or OS Reboots",cr:3500,req:[["Biolens Seed",9],["Neural Insulation",3]]},
      ]},
      {id:"nc-recovery",     name:"Recovery",           requires:null,              col:1,row:4, ranks:[
        {name:"RECOVERY.EXE 1",   fx:"Self-Repair Speed +20",            cr:1500, req:[["Dermachem Pack",10],["Unstable Biomass",13]]},
        {name:"RECOVERY.EXE 2",   fx:"Self-Repair Speed +20",            cr:2000, req:[["Neurochem Pack",10],["Tarax Seed",6]]},
        {name:"RECOVERY.EXE 3",   fx:"Self-Repair Speed +20",            cr:5000, req:[["Hazard Capsule",3],["Enzyme Replicator",3]]},
      ]},
      {id:"nc-adv-mch",      name:"Advanced Mch",       requires:null,              col:2,row:4, ranks:[
        {name:"Advanced MCH",     fx:"Unlocks Advanced Mechanic's Kits", cr:1500, req:[["Reclaimed Biostripping",8],["Unstable Biomass",9]]},
        {name:"Advanced OS",      fx:"Unlocks Advanced OS Debugs",       cr:1500, req:[["Reclaimed Biostripping",10],["Unstable Biomass",10]]},
      ]},
      {id:"nc-helping-hands",name:"Helping Hands",      requires:null,              col:3,row:4, ranks:[
        {name:"Helping Hands",    fx:"Unlocks Helping Hands V2 implant", cr:750,  req:[["Unstable Biomass",10]]},
        {name:"Helping Hands+",   fx:"Unlocks Helping Hands V3 implant", cr:1500, req:[["Dermachem Pack",18],["Sparkleaf",13]]},
        {name:"Helping Hands++",  fx:"Unlocks Helping Hands V4 implant", cr:3500, req:[["Biolens Seed",9],["Tarax Seed",14]]},
      ]},
      {id:"nc-self-revive",  name:"Self-Revive",        requires:null,              col:4,row:4, ranks:[
        {name:"Self-Revive",      fx:"Unlocks Self-Revives for purchase",cr:1500, req:[["Neurochem Pack",4],["Sparkleaf",14]]},
      ]},
      {id:"nc-field-medic",  name:"Field Medic",        requires:null,              col:6,row:4, ranks:[
        {name:"FIELD_MEDIC.EXE",  fx:"Health & shield consumables use faster",cr:5000,req:[["Hazard Capsule",3],["Enzyme Replicator",8]]},
      ]},
    ],
  },

  Traxus: {
    accent:"#D4922A", rep:"Vulcan", tag:"Weapons · Mods · Combat",
    cols:6, rows:4,
    nodes:[
      {id:"tx-dlx-chips",    name:"Deluxe Chips",       requires:"tx-enh-chips",                    col:1,row:1, ranks:[
        {name:"Deluxe Chips",     fx:"Unlocks Deluxe chip mods in Armory",cr:5000,req:[["Alien Alloy",3],["Reflex Coil",11]]},
      ]},
      {id:"tx-enh-chips",    name:"Enhanced Chips",     requires:null,            col:3,row:1, ranks:[
        {name:"Enhanced Chips",   fx:"Unlocks Enhanced chip mods",        cr:1500, req:[["Altered Wire",7],["Unstable Gunmetal",6]]},
        {name:"Enhanced Chips+",  fx:"Additional Enhanced chip mods",     cr:1500, req:[["Altered Wire",19],["Plasma Filament",9]]},
      ]},
      {id:"tx-tad-boost",    name:"TAD Boost",          requires:null,                      col:4,row:1, ranks:[
        {name:"TAD_BOOST.EXE",    fx:"TAD Ping Area +20m",               cr:750,  req:[["Unstable Gunmetal",19]]},
      ]},
      {id:"tx-tracker",      name:"Tracker",            requires:"tx-tad-boost",            col:6,row:1, ranks:[
        {name:"TRACKER.EXE 1",    fx:"Ping Duration +30",                cr:2000, req:[["Anomalous Wire",7],["Plasma Filament",21]]},
        {name:"TRACKER.EXE 2",    fx:"Ping Duration +30",                cr:5000, req:[["Alien Alloy",2]]},
      ]},
      {id:"tx-dlx-smg-mods", name:"Deluxe SMG Mods",   requires:"tx-enh-heavy-smg",        col:1,row:2, ranks:[
        {name:"Deluxe SMG Mods",  fx:"Rotating Deluxe SMG mod in Armory",cr:3500, req:[["Predictive Framework",4],["Tachyon Filament",6]]},
      ]},
      {id:"tx-enh-heavy-smg",name:"Enhanced Heavy SMG", requires:"tx-smg-mods",             col:2,row:2, ranks:[
        {name:"Enh. Heavy SMG",   fx:"Unlocks Enhanced Bully SMG",       cr:1500, req:[["Deimosite Rods",23],["Altered Wire",9]]},
      ]},
      {id:"tx-smg-mods",     name:"SMG Mods",           requires:null,                      col:3,row:2, ranks:[
        {name:"SMG Mods",         fx:"Rotating Enhanced SMG mod",        cr:750,  req:[["Unstable Gunmetal",10]]},
        {name:"SMG Mods+",        fx:"Additional rotating Enhanced SMG mod",cr:1500,req:[["Deimosite Rods",7],["Unstable Gunmetal",6]]},
      ]},
      {id:"tx-ar-mods",      name:"AR Mods",            requires:null,                      col:4,row:2, ranks:[
        {name:"AR Mods",          fx:"Rotating Enhanced AR mod",         cr:750,  req:[["Unstable Gunmetal",10]]},
        {name:"AR Mods+",         fx:"Additional rotating Enhanced AR mod",cr:1500,req:[["Altered Wire",7],["Unstable Gunmetal",6]]},
      ]},
      {id:"tx-enh-light-ar", name:"Enhanced Light AR",  requires:"tx-ar-mods",              col:5,row:2, ranks:[
        {name:"Enhanced Light AR",fx:"Unlocks Enhanced M77 AR",          cr:2000, req:[["Anomalous Wire",10],["Tachyon Filament",4]]},
      ]},
      {id:"tx-dlx-ar-mods",  name:"Deluxe AR Mods",     requires:"tx-enh-light-ar",         col:6,row:2, ranks:[
        {name:"Deluxe AR Mods",   fx:"Rotating Deluxe AR mod in Armory", cr:5000, req:[["Alien Alloy",2]]},
      ]},
      {id:"tx-volt-pr",      name:"Volt PR",             requires:"tx-volt-mods",            col:2,row:3, ranks:[
        {name:"Volt PR",          fx:"Unlocks V66 Lookout",              cr:1500, req:[["Deimosite Rods",19],["Altered Wire",7]]},
        {name:"Enhanced Volt PR", fx:"Unlocks Enhanced V66 Lookout",     cr:3500, req:[["Predictive Framework",5],["Tachyon Filament",7]]},
      ]},
      {id:"tx-volt-mods",    name:"Volt Mods",           requires:"tx-smg-mods",             col:3,row:3, ranks:[
        {name:"Volt Mods",        fx:"Rotating Enhanced volt mod",       cr:750,  req:[["Unstable Gunmetal",13]]},
        {name:"Volt Mods+",       fx:"Additional rotating Enhanced volt mod",cr:1500,req:[["Deimosite Rods",12],["Altered Wire",6]]},
        {name:"Precision Volt Mods",fx:"Rotating Enhanced volt mod",     cr:1500, req:[["Cetinite Rods",6],["Altered Wire",11]]},
      ]},
      {id:"tx-precision-mods",name:"Precision Mods",    requires:"tx-ar-mods",              col:4,row:3, ranks:[
        {name:"Precision Mods",   fx:"Rotating Enhanced precision mod",  cr:750,  req:[["Unstable Gunmetal",19]]},
        {name:"Precision Mods+",  fx:"Additional rotating Enhanced precision mod",cr:1500,req:[["Deimosite Rods",19],["Altered Wire",7]]},
        {name:"Precision Mods++", fx:"Additional rotating Enhanced precision mod",cr:2000,req:[["Cetinite Rods",8],["Tachyon Filament",4]]},
      ]},
      {id:"tx-mips-sniper",  name:"MIPS Sniper",         requires:"tx-precision-mods",                      col:5,row:3, ranks:[
        {name:"MIPS Sniper",      fx:"Unlocks Longshot Sniper Rifle",    cr:1500, req:[["Anomalous Wire",5],["Plasma Filament",10]]},
        {name:"Enhanced MIPS Sniper",fx:"Unlocks Enhanced Longshot",     cr:3500, req:[["Ballistic Turbine",9],["Predictive Framework",3]]},
      ]},
      {id:"tx-dlx-volt-mods",name:"Deluxe Volt Mods",   requires:"tx-enh-volt-smg",         col:1,row:4, ranks:[
        {name:"Deluxe Volt Mods", fx:"Rotating Deluxe volt mod in Armory",cr:3500,req:[["Predictive Framework",7],["Ballistic Turbine",3]]},
      ]},
      {id:"tx-enh-volt-smg", name:"Enhanced Volt SMG",   requires:"tx-volt-pr",              col:2,row:4, ranks:[
        {name:"Enh. Volt SMG",    fx:"Unlocks Enhanced V22 Volt Thrower SMG",cr:2000,req:[["Cetinite Rods",12],["Tachyon Filament",5]]},
      ]},
      {id:"tx-enh-hardline",  name:"Enhanced Hardline PR",requires:"tx-mips-sniper",  col:5,row:4, ranks:[
        {name:"Enh. Hardline PR", fx:"Unlocks Enhanced Hardline PR",     cr:2000, req:[["Anomalous Wire",7],["Plasma Filament",21]]},
      ]},
      {id:"tx-dlx-precision-mods",name:"Deluxe Precision Mods",requires:"tx-enh-hardline",  col:6,row:4, ranks:[
        {name:"Deluxe Precision Mods",fx:"Rotating Deluxe precision mod",cr:5000, req:[["Alien Alloy",2],["Tachyon Filament",9]]},
      ]},
    ],
  },

  MIDA: {
    accent:"#7B6BD4", rep:"_GANTRY", tag:"Grenades · Equipment · Mobility",
    cols:6, rows:4,
    nodes:[
      {id:"mi-eyes-open",    name:"Eyes Open",          requires:"mi-bad-step",         col:1,row:1, ranks:[
        {name:"Eyes Open",        fx:"Unlocks Proximity Sensor",         cr:2000, req:[["Dynamic Compounds",28],["Surveillance Lens",14]]},
      ]},
      {id:"mi-bad-step",     name:"Bad Step",           requires:null,                  col:2,row:1, ranks:[
        {name:"Bad Step",         fx:"Unlocks Claymores",                cr:750,  req:[["Unstable Lead",13]]},
      ]},
      {id:"mi-got-em",       name:"Got Em",             requires:"mi-bad-step",         col:3,row:1, ranks:[
        {name:"Got Em",           fx:"Unlocks Trap Packs",               cr:1500, req:[["Dynamic Compounds",19],["Surveillance Lens",9]]},
      ]},
      {id:"mi-survivor",     name:"Survivor",           requires:null,                  col:4,row:1, ranks:[
        {name:"Survivor",         fx:"Unlocks Survivor Kit V2 implant",  cr:1500, req:[["Surveillance Lens",13],["Unstable Lead",9]]},
        {name:"Survivor+",        fx:"Unlocks Survivor Kit V3 implant",  cr:1500, req:[["Thoughtwave Lens",6],["Dynamic Compounds",11]]},
        {name:"Survivor++",       fx:"Unlocks Survivor Kit V4 implant",  cr:3500, req:[["Biolens Seed",10],["Ballistic Turbine",3]]},
      ]},
      {id:"mi-graceful",     name:"Graceful",           requires:null,                  col:5,row:1, ranks:[
        {name:"Graceful",         fx:"Unlocks Graceful Landing V2 implant",cr:1500,req:[["Surveillance Lens",9],["Unstable Lead",5]]},
        {name:"Graceful+",        fx:"Unlocks Graceful Landing V3 implant",cr:2000,req:[["Thoughtwave Lens",8],["Dynamic Compounds",26]]},
        {name:"Graceful++",       fx:"Unlocks Graceful Landing V4 implant",cr:3500,req:[["Biolens Seed",8],["Ballistic Turbine",3]]},
      ]},
      {id:"mi-sprinter",     name:"Sprinter",           requires:null,                  col:6,row:1, ranks:[
        {name:"Sprinter",         fx:"Unlocks Bionic Legs V2 implant",   cr:750,  req:[["Unstable Lead",13]]},
        {name:"Sprinter+",        fx:"Unlocks Bionic Legs V3 implant",   cr:1500, req:[["Thoughtwave Lens",5],["Dynamic Compounds",8]]},
        {name:"Sprinter++",       fx:"Unlocks Bionic Legs V4 implant",   cr:3500, req:[["Biolens Seed",10],["Ballistic Turbine",3]]},
      ]},
      {id:"mi-spare-rounds", name:"Spare Rounds",       requires:"mi-bad-step",         col:2,row:2, ranks:[
        {name:"Spare Rounds 1",   fx:"Unlocks Ammo Crates",             cr:1500, req:[["Dynamic Compounds",19],["Surveillance Lens",9]]},
        {name:"Spare Rounds 2",   fx:"Unlocks Advanced Ammo Crates",    cr:2000, req:[["Volatile Compounds",6],["Surveillance Lens",16]]},
      ]},
      {id:"mi-hot-potato",   name:"Hot Potato",         requires:null,                  col:1,row:3, ranks:[
        {name:"Hot Potato",       fx:"Unlocks Heat Grenades",            cr:750,  req:[["Unstable Lead",16]]},
      ]},
      {id:"mi-explosives",   name:"Explosives",         requires:"mi-hot-potato",       col:2,row:3, ranks:[
        {name:"Explosives",       fx:"Unlocks Frag Grenades",            cr:750,  req:[["Unstable Lead",16]]},
      ]},
      {id:"mi-lights-out",   name:"Lights Out",         requires:"mi-explosives",       col:3,row:3, ranks:[
        {name:"Lights Out",       fx:"Unlocks EMP Grenades",             cr:2000, req:[["Volatile Compounds",6],["Surveillance Lens",16]]},
      ]},
      {id:"mi-av-packs",     name:"Anti-Virus Packs",   requires:null,                  col:4,row:3, ranks:[
        {name:"Anti-Virus Packs", fx:"Unlocks Anti-Virus Packs",        cr:1500, req:[["Unstable Lead",23]]},
      ]},
      {id:"mi-anti-virus",   name:"Anti Virus",         requires:"mi-av-packs",         col:5,row:3, ranks:[
        {name:"ANTI_VIRUS.EXE 1", fx:"Active Anti-Virus Protection +40s",cr:1500,req:[["Surveillance Lens",28],["Dynamic Compounds",10]]},
        {name:"ANTI_VIRUS.EXE 2", fx:"Active Anti-Virus Protection +40s",cr:2000,req:[["Thoughtwave Lens",12],["Volatile Compounds",4]]},
        {name:"ANTI_VIRUS.EXE 3", fx:"Active Anti-Virus Protection +40s",cr:5000,req:[["Hazard Capsule",2]]},
      ]},
      {id:"mi-bullseye",     name:"Bullseye",           requires:"mi-hot-potato",       col:1,row:4, ranks:[
        {name:"Bullseye",         fx:"Unlocks Flechette Grenades",       cr:1500, req:[["Dynamic Compounds",15],["Surveillance Lens",8]]},
      ]},
      {id:"mi-chemist",      name:"Chemist",            requires:"mi-explosives",       col:2,row:4, ranks:[
        {name:"Chemist",          fx:"Unlocks Chem Grenades",            cr:1500, req:[["Volatile Compounds",4],["Surveillance Lens",10]]},
      ]},
      {id:"mi-flex-matrix",  name:"Flex Matrix",        requires:null,                  col:3,row:4, ranks:[
        {name:"FLEX_MATRIX.EXE 1",fx:"Agility +20",                     cr:750,  req:[["Unstable Lead",16]]},
        {name:"FLEX_MATRIX.EXE 2",fx:"Agility +20",                     cr:1500, req:[["Surveillance Lens",28],["Dynamic Compounds",10]]},
        {name:"FLEX_MATRIX.EXE 3",fx:"Agility +20",                     cr:2000, req:[["Thoughtwave Lens",8],["Dynamic Compounds",26]]},
      ]},
      {id:"mi-cardio-kick",  name:"Cardio Kick",        requires:"mi-flex-matrix",    col:4,row:4, ranks:[
        {name:"Cardio Kick",      fx:"Unlocks Cardio Kicks",             cr:1500, req:[["Thoughtwave Lens",4],["Dynamic Compounds",7]]},
      ]},
      {id:"mi-full-throttle",name:"Full Throttle",      requires:"mi-cardio-kick",                  col:5,row:4, ranks:[
        {name:"FULL_THROTTLE.EXE",fx:"Cardio Kick effect at start of run",cr:5000,req:[["Alien Alloy",3],["Ballistic Turbine",11]]},
      ]},
      {id:"mi-cloud-cover",  name:"Cloud Cover",        requires:null,                  col:6,row:4, ranks:[
        {name:"CLOUD_COVER.EXE",  fx:"Smoke cloud on exfil site activation",cr:5000,req:[["Hazard Capsule",3],["Biolens Seed",12]]},
      ]},
    ],
  },

  Arachne: {
    accent:"#CC4A25", rep:"Charter", tag:"PvP · Melee · Weapons",
    cols:6, rows:4,
    nodes:[
      {id:"ar-lmg-mods",     name:"LMG Mods",           requires:null,                  col:1,row:1, ranks:[
        {name:"LMG MODS",         fx:"Unlocks Enhanced LMG mod set",     cr:750,  req:[["Unstable Gel",13]]},
      ]},
      {id:"ar-railgun-mods", name:"Railgun Mods",        requires:null,                  col:2,row:1, ranks:[
        {name:"RAILGUN MODS",     fx:"Unlocks Enhanced railgun mod set",  cr:1500, req:[["Drone Resin",8],["Unstable Gel",9]]},
      ]},
      {id:"ar-shotgun-mods", name:"Shotgun Mods",        requires:null,                  col:3,row:1, ranks:[
        {name:"SHOTGUN MODS",     fx:"Unlocks Enhanced shotgun mod set",  cr:750,  req:[["Unstable Gel",18]]},
      ]},
      {id:"ar-hard-strike",  name:"Hard Strike",         requires:null,                  col:4,row:1, ranks:[
        {name:"HARD_STRIKE.EXE 1",fx:"Melee Damage +20",                 cr:1500, req:[["Drone Resin",7],["Unstable Gel",6]]},
        {name:"HARD_STRIKE.EXE 2",fx:"Melee Damage +20",                 cr:2000, req:[["Biomata Resin",8],["Drone Node",22]]},
        {name:"HARD_STRIKE.EXE 3",fx:"Melee Damage +20",                 cr:3500, req:[["Reflex Coil",6],["Biomata Node",6]]},
      ]},
      {id:"ar-knife-fight",  name:"Knife Fight",         requires:null,                  col:5,row:1, ranks:[
        {name:"KNIFE FIGHT",      fx:"Unlocks Knife Fight V2 implant",   cr:750,  req:[["Unstable Gel",13]]},
        {name:"KNIFE FIGHT+",     fx:"Unlocks Knife Fight V3 implant",   cr:1500, req:[["Drone Node",23],["Drone Resin",12]]},
        {name:"KNIFE FIGHT++",    fx:"Unlocks Knife Fight V4 implant",   cr:3500, req:[["Enzyme Replicator",9],["Reflex Coil",3]]},
      ]},
      {id:"ar-hurting-hands",name:"Hurting Hands",       requires:null,                  col:6,row:1, ranks:[
        {name:"HURTING HANDS",    fx:"Unlocks Hurting Hands V2 implant", cr:750,  req:[["Unstable Gel",10]]},
        {name:"HURTING HANDS+",   fx:"Unlocks Hurting Hands V3 implant", cr:1500, req:[["Drone Node",19],["Drone Resin",9]]},
        {name:"HURTING HANDS++",  fx:"Unlocks Hurting Hands V4 implant", cr:3500, req:[["Enzyme Replicator",7],["Reflex Coil",3]]},
      ]},
      {id:"ar-mips-railgun", name:"MIPS Railgun",        requires:null,                  col:2,row:2, ranks:[
        {name:"MIPS RAILGUN",     fx:"Unlocks ARES RG",                  cr:750,  req:[["Unstable Gel",13]]},
      ]},
      {id:"ar-mips-shotgun", name:"MIPS Shotgun",        requires:null,                  col:3,row:2, ranks:[
        {name:"MIPS SHOTGUN",     fx:"Unlocks WSTR Combat Shotgun",      cr:1500, req:[["Drone Resin",7],["Unstable Gel",8]]},
      ]},
      {id:"ar-cutthroat",    name:"Cutthroat",           requires:null,                  col:4,row:2, ranks:[
        {name:"CUTTHROAT.EXE 1",  fx:"Finisher Siphon +20",             cr:750,  req:[["Unstable Gel",16]]},
        {name:"CUTTHROAT.EXE 2",  fx:"Finisher Siphon +20",             cr:2000, req:[["Biomata Resin",12],["Biomata Node",4]]},
        {name:"CUTTHROAT.EXE 3",  fx:"Finisher Siphon +20",             cr:3500, req:[["Reflex Coil",7],["Enzyme Replicator",3]]},
      ]},
      {id:"ar-enh-retaliator",name:"Enh. Retaliator LMG",requires:null,                 col:1,row:3, ranks:[
        {name:"Enh. Retaliator LMG",fx:"Unlocks Enhanced Retaliator LMG",cr:1500,req:[["Biomata Node",4],["Drone Resin",11]]},
      ]},
      {id:"ar-enh-mips-railgun",name:"Enh. MIPS Railgun",requires:"ar-mips-railgun",    col:2,row:3, ranks:[
        {name:"Enh. MIPS Railgun",fx:"Unlocks Enhanced ARES RG",        cr:2000, req:[["Biomata Resin",12],["Biomata Node",4]]},
      ]},
      {id:"ar-enh-mips-shotgun",name:"Enh. MIPS Shotgun",requires:"ar-mips-shotgun",                 col:3,row:3, ranks:[
        {name:"Enh. MIPS Shotgun",fx:"Unlocks Enhanced WSTR Combat Shotgun",cr:2000,req:[["Biomata Node",6],["Drone Resin",18]]},
      ]},
      {id:"ar-reboot",       name:"Reboot",              requires:null,                  col:4,row:3, ranks:[
        {name:"REBOOT.EXE 1",     fx:"Revive Speed +20",                 cr:1500, req:[["Drone Resin",19],["Unstable Gel",17]]},
        {name:"REBOOT.EXE 2",     fx:"Revive Speed +20",                 cr:3500, req:[["Reflex Coil",5],["Biomata Node",5]]},
        {name:"REBOOT.EXE 3",     fx:"Revive Speed +20",                 cr:5000, req:[["Synapse Cube",2],["Biomata Resin",9]]},
      ]},
      {id:"ar-dlx-retaliator",name:"Dlx. Retaliator LMG",requires:"ar-enh-retaliator",  col:1,row:4, ranks:[
        {name:"Dlx. Retaliator LMG",fx:"Unlocks Deluxe Retaliator LMG", cr:3500, req:[["Enzyme Replicator",9],["Reflex Coil",3]]},
      ]},
      {id:"ar-dlx-mips-railgun",name:"Dlx. MIPS Railgun",requires:"ar-enh-mips-railgun",col:2,row:4, ranks:[
        {name:"Dlx. MIPS Railgun",fx:"Unlocks Deluxe ARES RG",          cr:5000, req:[["Hazard Capsule",2],["Enzyme Replicator",7]]},
      ]},
      {id:"ar-dlx-mips-shotgun",name:"Dlx. MIPS Shotgun",requires:"ar-enh-mips-shotgun",col:3,row:4, ranks:[
        {name:"Dlx. MIPS Shotgun",fx:"Unlocks Deluxe WSTR Combat Shotgun",cr:5000,req:[["Synapse Cube",2],["Biomata Resin",9]]},
      ]},
      {id:"ar-leech",        name:"Leech",               requires:null,                  col:5,row:4, ranks:[
        {name:"LEECH.EXE",        fx:"Knife attacks restore health",     cr:5000, req:[["Synapse Cube",2]]},
      ]},
      {id:"ar-heat-death",   name:"Heat Death",          requires:null,                  col:6,row:4, ranks:[
        {name:"HEAT_DEATH.EXE",   fx:"Eliminating hostile reduces heat", cr:5000, req:[["Hazard Capsule",3],["Enzyme Replicator",11]]},
      ]},
    ],
  },

  Sekiguchi: {
    accent:"#3A82C4", rep:"Nona", tag:"Cores · Implants · Energy",
    cols:6, rows:4,
    nodes:[
      {id:"sk-energy-amp",   name:"Energy Amp",          requires:null,                  col:1,row:1, ranks:[
        {name:"Energy Amp",       fx:"Unlocks Energy Amps for purchase", cr:750,  req:[["Unstable Diode",10]]},
      ]},
      {id:"sk-amped",        name:"Amped",               requires:"sk-energy-amp",       col:2,row:1, ranks:[
        {name:"Amped",            fx:"Free Daily Energy Amps in Armory", cr:1500, req:[["Fractal Circuit",23],["Storage Drive",9]]},
      ]},
      {id:"sk-amp-stock",    name:"Amp Stock",           requires:"sk-amped",            col:3,row:1, ranks:[
        {name:"Amp Stock",        fx:"Energy Amp stock increased in Armory",cr:2000,req:[["Paradox Circuit",12],["Amygdala Drive",5]]},
      ]},
      {id:"sk-scab-factory1", name:"Scab Factory",        requires:null,                  col:4,row:1, ranks:[
        {name:"SCAB_FACTORY.EXE 1",fx:"DBNO Time +30s",                 cr:2000, req:[["Amygdala Drive",7],["Fractal Circuit",20]]},
      ]},
      {id:"sk-scab-factory2", name:"Scab Factory",        requires:"sk-scab-factory1",                  col:5,row:1, ranks:[
        {name:"SCAB_FACTORY.EXE 2",fx:"DBNO Time +30s",                 cr:3500, req:[["Predictive Framework",9],["Neural Insulation",3]]},
      ]},
      {id:"sk-lethal-amp",   name:"Lethal Amp",          requires:null,                  col:6,row:1, ranks:[
        {name:"LETHAL_AMP.EXE",   fx:"Down→Tac energy · Elim→Prime energy",cr:3500,req:[["Predictive Framework",7],["Neural Insulation",3]]},
      ]},
      {id:"sk-triage",       name:"Triage",              requires:null,                  col:1,row:2, ranks:[
        {name:"Triage",           fx:"Unlocks 2 Enhanced Triage cores",  cr:1500, req:[["Storage Drive",8],["Unstable Diode",9]]},
      ]},
      {id:"sk-destroyer",    name:"Destroyer",           requires:null,                  col:2,row:2, ranks:[
        {name:"Destroyer",        fx:"Unlocks 2 Enhanced Destroyer cores",cr:1500,req:[["Fractal Circuit",8],["Unstable Diode",9]]},
      ]},
      {id:"sk-assassin",     name:"Assassin",            requires:null,                  col:3,row:2, ranks:[
        {name:"Assassin",         fx:"Unlocks 2 Enhanced Assassin cores",cr:1500, req:[["Storage Drive",8],["Unstable Diode",9]]},
      ]},
      {id:"sk-vandal",       name:"Vandal",              requires:null,                  col:4,row:2, ranks:[
        {name:"Vandal",           fx:"Unlocks 2 Enhanced Vandal cores",  cr:1500, req:[["Fractal Circuit",8],["Unstable Diode",9]]},
      ]},
      {id:"sk-recon",        name:"Recon",               requires:null,                  col:5,row:2, ranks:[
        {name:"Recon",            fx:"Unlocks 2 Enhanced Recon cores",   cr:1500, req:[["Storage Drive",8],["Unstable Diode",9]]},
      ]},
      {id:"sk-thief",        name:"Thief",               requires:null,                  col:6,row:2, ranks:[
        {name:"Thief",            fx:"Unlocks 2 Enhanced Thief cores",   cr:1500, req:[["Fractal Circuit",8],["Unstable Diode",9]]},
      ]},
      {id:"sk-triage-plus",  name:"Triage+",             requires:"sk-triage",           col:1,row:3, ranks:[
        {name:"Triage+",          fx:"Unlocks 2 Deluxe Triage cores",    cr:1500, req:[["Amygdala Drive",4],["Fractal Circuit",8]]},
      ]},
      {id:"sk-destroyer-plus",name:"Destroyer+",         requires:"sk-destroyer",        col:2,row:3, ranks:[
        {name:"Destroyer+",       fx:"Unlocks 2 Deluxe Destroyer cores", cr:1500, req:[["Paradox Circuit",4],["Storage Drive",8]]},
      ]},
      {id:"sk-assassin-plus",name:"Assassin+",           requires:"sk-assassin",         col:3,row:3, ranks:[
        {name:"Assassin+",        fx:"Unlocks 2 Deluxe Assassin cores",  cr:1500, req:[["Amygdala Drive",4],["Fractal Circuit",8]]},
      ]},
      {id:"sk-vandal-plus",  name:"Vandal+",             requires:"sk-vandal",           col:4,row:3, ranks:[
        {name:"Vandal+",          fx:"Unlocks 2 Deluxe Vandal cores",    cr:1500, req:[["Paradox Circuit",4],["Storage Drive",8]]},
      ]},
      {id:"sk-recon-plus",   name:"Recon+",              requires:"sk-recon",            col:5,row:3, ranks:[
        {name:"Recon+",           fx:"Unlocks 2 Deluxe Recon cores",     cr:1500, req:[["Amygdala Drive",4],["Fractal Circuit",8]]},
      ]},
      {id:"sk-thief-plus",   name:"Thief+",              requires:"sk-thief",            col:6,row:3, ranks:[
        {name:"Thief+",           fx:"Unlocks 2 Deluxe Thief cores",     cr:1500, req:[["Paradox Circuit",4],["Storage Drive",8]]},
      ]},
      {id:"sk-harvester",    name:"Harvester",           requires:null,                  col:1,row:4, ranks:[
        {name:"Harvester",        fx:"Unlocks Energy Harvesting V2 implant",cr:1500,req:[["Fractal Circuit",7],["Unstable Diode",6]]},
        {name:"Harvester+",       fx:"Unlocks Energy Harvesting V3 implant",cr:2000,req:[["Fractal Circuit",23],["Storage Drive",9]]},
        {name:"Harvester++",      fx:"Unlocks Energy Harvesting V4 implant",cr:3500,req:[["Neural Insulation",7],["Predictive Framework",3]]},
      ]},
      {id:"sk-capacitors",   name:"Capacitors",          requires:"sk-harvester",        col:2,row:4, ranks:[
        {name:"Capacitors",       fx:"Unlocks Augmented Capacitors V2 implant",cr:1500,req:[["Storage Drive",10],["Unstable Diode",10]]},
        {name:"Capacitors+",      fx:"Unlocks Augmented Capacitors V3 implant",cr:2000,req:[["Amygdala Drive",8],["Fractal Circuit",13]]},
        {name:"Capacitors++",     fx:"Unlocks Augmented Capacitors V4 implant",cr:3500,req:[["Predictive Framework",9],["Neural Insulation",3]]},
      ]},
      {id:"sk-tac-amp",      name:"Tac Amp",             requires:null,                  col:3,row:4, ranks:[
        {name:"TAC_AMP.EXE 1",    fx:"Tactical Recovery +30",            cr:750,  req:[["Unstable Diode",16]]},
        {name:"TAC_AMP.EXE 2",    fx:"Tactical Recovery +30",            cr:2000, req:[["Paradox Circuit",8],["Storage Drive",30]]},
      ]},
      {id:"sk-prime-amp",    name:"Prime Amp",           requires:"sk-tac-amp",          col:4,row:4, ranks:[
        {name:"PRIME_AMP.EXE 1",  fx:"Prime Recovery +30",               cr:5000, req:[["Synapse Cube",2]]},
        {name:"PRIME_AMP.EXE 2",  fx:"Prime Recovery +30",               cr:5000, req:[["Synapse Cube",3],["Predictive Framework",3]]},
      ]},
      {id:"sk-head-start",   name:"Head Start",          requires:null,                  col:5,row:4, ranks:[
        {name:"HEAD_START.EXE 1", fx:"Partial tactical charge at run start",cr:1500,req:[["Storage Drive",10],["Unstable Diode",10]]},
        {name:"HEAD_START.EXE 2", fx:"Full tactical charge at run start",cr:2000, req:[["Amygdala Drive",7],["Fractal Circuit",20]]},
      ]},
      {id:"sk-primed",       name:"Primed",              requires:"sk-head-start",       col:6,row:4, ranks:[
        {name:"PRIMED.EXE 1",     fx:"Partial prime charge at run start", cr:5000, req:[["Alien Alloy",2],["Neural Insulation",7]]},
        {name:"PRIMED.EXE 2",     fx:"Full prime charge at run start",    cr:5000, req:[["Alien Alloy",3],["Neural Insulation",11]]},
      ]},
    ],
  },
};

// ── localStorage helpers ──────────────────────────────────────────────────────
function lsGet<T>(key:string, fb:T):T {
  try { const v=localStorage.getItem(key); return v?JSON.parse(v):fb; } catch { return fb; }
}
function lsSet(key:string, val:unknown) {
  try { localStorage.setItem(key,JSON.stringify(val)); } catch {}
}

// ── Container expansion ───────────────────────────────────────────────────────
const expandContainers = (containers:string[]):string[] => {
  const out:string[]=[];
  for(const ct of containers){
    if(ct==="Locked Rooms [Deluxe, Superior, Prestige]") out.push("Locked Rooms [Deluxe]","Locked Rooms [Superior]","Locked Rooms [Prestige]");
    else if(ct==="Locked Rooms [Superior, Prestige]") out.push("Locked Rooms [Superior]","Locked Rooms [Prestige]");
    else out.push(ct);
  }
  return out;
};

// ── SalvageIcon ───────────────────────────────────────────────────────────────
function SalvageIcon({name,size=20}:{name:string;size?:number}) {
  const [err,setErr]=useState(false);
  const info = (SALVAGE[name] || {}) as SalvageInfo;
  const col=R[info.r||"s"]?.color||"#888";
  const src=ICONS[name];
  if(err||!src) return <div style={{width:size,height:size,borderRadius:3,background:col+"22",border:`1px solid ${col}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.5,color:col,fontWeight:700,flexShrink:0}}>{name[0]}</div>;
  return <img src={src} style={{width:size,height:size,objectFit:"contain",flexShrink:0}} onError={()=>setErr(true)}/>;
}
// ── Node Card ─────────────────────────────────────────────────────────────────
function NodeCard({node, acc, tracked, onTrack, BG0, BG1, BG2, BORDER, TEXT, MUTED, DIM}:{
  node:NodeDef; acc:string;
  tracked:Set<string>;
  onTrack:(rankId:string)=>void;
  BG0:string;BG1:string;BG2:string;BORDER:string;TEXT:string;MUTED:string;DIM:string;
}) {
  const [viewing,setViewing]=useState(0);
  const vRank=node.ranks[viewing];
  const hasMulti=node.ranks.length>1;
  const anyTracked=node.ranks.some((_,i)=>tracked.has(`${node.id}:${i}`));

  return (
    <div style={{
      width:GCARD_W, 
      minHeight: MIN_CARD_HEIGHT, // <--- This "ceils" the height to at least this value
      borderRadius:6, 
      padding:"8px 8px 6px",
      background:anyTracked?`linear-gradient(135deg,${acc}1a,${BG2})`:`${BG2}`,
      border:`1px solid ${anyTracked?acc:BORDER}`,
      boxShadow:anyTracked?`0 0 10px ${acc}22`:"none",
      display:"flex",
      flexDirection:"column",
      gap:4,
      transition:"border-color 0.15s",
    }}>
      {/* Node name */}
      <div style={{fontSize:10,fontWeight:700,color:anyTracked?acc:TEXT,lineHeight:1.2,marginBottom:2}}>{node.name}</div>

      {/* Rank selector (multi-rank only) */}
      {hasMulti && (
        <div style={{display:"flex",gap:2,flexWrap:"wrap"}}>
          {node.ranks.map((_,i)=>{
            const rid=`${node.id}:${i}`;
            const isViewing=viewing===i;
            const isTracked=tracked.has(rid);
            return (
              <button key={i} onClick={()=>setViewing(i)} style={{
                width:20,height:20,borderRadius:3,border:`1.5px solid ${isViewing?acc:isTracked?acc+"88":BORDER}`,
                background:isViewing?acc+"22":"transparent",
                color:isViewing?acc:isTracked?acc:MUTED,
                fontSize:9,fontWeight:700,cursor:"pointer",lineHeight:1,
                display:"flex",alignItems:"center",justifyContent:"center",
                position:"relative",
              }}>
                {i+1}
                {isTracked && <span style={{
                  position:"absolute",top:-3,right:-3,width:6,height:6,
                  borderRadius:"50%",background:acc,border:`1px solid ${BG2}`,
                  pointerEvents:"none",
                }}/>}
              </button>
            );
          })}
        </div>
      )}

      {/* Rank details */}
      <div style={{fontSize:8,color:MUTED,lineHeight:1.35}}>{vRank.fx}</div>
      <div style={{fontSize:8,color:"#D4922A",fontWeight:600}}>◆ {vRank.cr.toLocaleString()}</div>
      
      {/* Wrap content in a div with flex: 1 to push the button to the bottom if desired */}
      <div style={{ flex: 1 }}>
        {vRank.req.length>0 && (
          <div style={{display:"flex",flexDirection:"column",gap:2}}>
            {vRank.req.map(([item,qty])=>{
              const rc=R[SALVAGE[item]?.r||"s"]?.color||"#888";
              return (
                <div key={item} style={{display:"flex",alignItems:"center",gap:4}}>
                  <SalvageIcon name={item} size={14}/>
                  <span style={{fontSize:7,color:rc,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item}</span>
                  <span style={{fontSize:8,fontWeight:700,color:TEXT,flexShrink:0}}>×{qty}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Track button */}
      <button onClick={()=>onTrack(`${node.id}:${viewing}`)} style={{
        marginTop: "auto", // <--- Pushes the button to the very bottom of the card
        padding:"3px 0",
        borderRadius:3,
        fontSize:8,
        fontWeight:700,
        border:`1px solid ${tracked.has(`${node.id}:${viewing}`)?acc:BORDER}`,
        background:tracked.has(`${node.id}:${viewing}`)?acc+"22":"transparent",
        color:tracked.has(`${node.id}:${viewing}`)?acc:MUTED,
        cursor:"pointer",
        letterSpacing:"0.04em",
      }}>
        {tracked.has(`${node.id}:${viewing}`) ? "✓ TRACKED" : "TRACK"}
      </button>
    </div>
  );
}
// ── Grid constants ───────────────────────────────────────────────────────────
const GCELL_W = 180; 
const GCELL_H = 190; 
const GCARD_W = 160; 

// This MUST match the minHeight in your NodeCard style
const MIN_CARD_HEIGHT = 110; 

// Center of a card in the grid
const gcx = (col:number) => (col - 1) * GCELL_W + GCARD_W / 2;

// Edges - Updated to use MIN_CARD_HEIGHT
const gRight  = (col:number) => (col - 1) * GCELL_W + GCARD_W;
const gLeft   = (col:number) => (col - 1) * GCELL_W;

// Bottom edge of the card's minimum footprint
const gBottom = (row:number) => (row - 1) * GCELL_H + MIN_CARD_HEIGHT;

// Top edge of the card
const gTop    = (row:number) => (row - 1) * GCELL_H;

// Vertical midpoint of the card's minimum footprint
// Using MIN_CARD_HEIGHT / 2 keeps horizontal lines perfectly level across rows
const gMidY   = (row:number) => (row - 1) * GCELL_H + (MIN_CARD_HEIGHT / 2);

// ── Connector lines between nodes ─────────────────────────────────────────────
function NodeConnectors({nodes, cols, rows, acc}:{
  nodes:NodeDef[];cols:number;rows:number;acc:string;
}) {
  const lines: React.ReactNode[]=[];

  nodes.forEach((node, index) => {
    if(!node.requires) return;
    const parent=nodes.find(n=>n.id===node.requires);
    if(!parent) return;

    const key = `path-${node.id}-${index}`;
    const stroke = acc;
    
    // Path logic remains the same
    let d = "";
    if(parent.row === node.row){
      d = `M${gRight(parent.col)},${gMidY(parent.row)} L${gLeft(node.col)},${gMidY(node.row)}`;
    } else if(parent.col === node.col){
      d = `M${gcx(parent.col)},${gBottom(parent.row)} L${gcx(parent.col)},${gTop(node.row)}`;
    } else {
      const px = gcx(parent.col);
      const py1 = gBottom(parent.row);
      const cy = gMidY(node.row);
      const cx = node.col > parent.col ? gLeft(node.col) : gRight(node.col);
      d = `M${px},${py1} L${px},${cy} L${cx},${cy}`;
    }

    lines.push(
      <path 
        key={key}
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={10} // Width of the chevron "tunnel"
        strokeOpacity={0.8}
        strokeDasharray="4, 6" // This creates the "narrow" spacing
        strokeLinecap="butt"
        // The magic property: This makes the "line" use the chevron marker
        markerEnd={`url(#chevron-${index})`} 
        style={{
            // We use a marker-start/mid/end or a dash pattern. 
            // But for total control, let's use a Dash Path with a specific shape:
            strokeDasharray: "1, 10",
        }}
      />
    );

    // ALTERNATIVE: If patterns are acting up, the most reliable "Narrow" look 
    // is actually a simple dashed line with a high stroke width and a linejoin.
    // However, to get the SHAPE of a chevron, we'll use a Marker.
  });

  const W = cols * GCELL_W;
  const H = rows * GCELL_H;

  return (
    <svg style={{position:"absolute",top:0,left:0,pointerEvents:"none",overflow:"visible"}} width={W} height={H}>
      <defs>
        {/* We define the chevron once here */}
        <marker id="chevron-marker" 
          viewBox="0 0 10 10" 
          refX="5" refY="5"
          markerWidth="4" 
          markerHeight="4"
          orient="auto-start-reverse">
          <path d="M 0 0 L 5 5 L 0 10" fill="none" stroke={acc} strokeWidth="2" />
        </marker>
      </defs>

      {/* Since we want MANY chevrons, we use the dash trick combined 
          with the original textPath, but we'll normalize the scaling.
      */}
      {nodes.map((node, i) => {
          if(!node.requires) return null;
          const parent=nodes.find(n=>n.id===node.requires);
          if(!parent) return null;
          
          const pId = `p-${node.id}`;
          let d = "";
          if(parent.row === node.row) d = `M${gRight(parent.col)},${gMidY(parent.row)} L${gLeft(node.col)},${gMidY(node.row)}`;
          else if(parent.col === node.col) d = `M${gcx(parent.col)},${gBottom(parent.row)} L${gcx(parent.col)},${gTop(node.row)}`;
          else {
              const px = gcx(parent.col); const py = gBottom(parent.row);
              const cy = gMidY(node.row); const cx = node.col > parent.col ? gLeft(node.col) : gRight(node.col);
              d = `M${px},${py} L${px},${cy} L${cx},${cy}`;
          }

          return (
            <g key={i}>
              <path id={pId} d={d} fill="none" stroke="none" />
              <text dy="0.3em" style={{ fontSize: 26, fill: acc, userSelect: 'none' }}>
                <textPath href={`#${pId}`} spacing="exact" method="stretch">
                    {/* Adding 'method="stretch"' actually forces the browser to calculate 
                        the bounding box once, preventing the "growing" bug. */}
                    {"›".repeat(100)}
                </textPath>
              </text>
            </g>
          );
      })}
    </svg>
  );
}

// ── Inventory Tab ─────────────────────────────────────────────────────────────
const RARITY_ORDER_INV=["c","p","su","d","e","s"] as const;
const UNIT=56;
const CELL_SPAN:Record<string,{cols:number,rows:number}>={c:{cols:2,rows:2},p:{cols:2,rows:2},su:{cols:2,rows:2},d:{cols:2,rows:1},e:{cols:1,rows:1},s:{cols:1,rows:1}};

function InvCell({name,qty,onSet,forBatch,batchMode,BG0,TEXT}:{name:string;qty:number;onSet:(n:string,v:number)=>void;forBatch?:boolean;batchMode?:"add"|"remove"|null;BG0:string;TEXT:string}) {
  const info = (SALVAGE[name] || {}) as SalvageInfo;
  const rc=R[info.r||"s"].color;
  const src=ICONS[name];
  const span=CELL_SPAN[info.r||"s"];
  const W=span.cols*UNIT, H=span.rows*UNIT;
  const [editing,setEditing]=useState(false);
  const [draft,setDraft]=useState("0");
  const inputRef=useRef<HTMLInputElement>(null);
  React.useEffect(()=>{if(!editing)setDraft(String(qty));},[qty,editing]);
  React.useEffect(()=>{if(editing&&inputRef.current){inputRef.current.focus();inputRef.current.select();}},[editing]);
  const commit=()=>{const v=parseInt(draft);onSet(name,isNaN(v)||v<0?0:v);setEditing(false);};
  const adj=(d:number)=>{const n=Math.max(0,(parseInt(draft)||0)+d);setDraft(String(n));onSet(name,n);};
  const btnSz=Math.max(18,Math.min(28,Math.round(W*0.22)));
  const inputW=Math.max(32,Math.round(W*0.38));
  const isRemove=forBatch&&batchMode==="remove";
  return (
    <div style={{position:"relative",width:W,height:H,cursor:"pointer",flexShrink:0,outline:editing?`2px solid ${rc}`:undefined,outlineOffset:-2,zIndex:editing?2:1}}
      onClick={!editing?()=>{setDraft(String(qty));setEditing(true);}:undefined} title={name}>
      <img src={src||""} alt={name} style={{display:"block",width:"100%",height:"100%",objectFit:"cover",opacity:editing?0.18:qty>0?1:0.28,transition:"opacity 0.1s",userSelect:"none",pointerEvents:"none"}}/>
      {!editing&&qty>0&&<div style={{position:"absolute",bottom:3,right:4,fontSize:Math.min(15,Math.round(W*0.22)),fontWeight:700,color:isRemove?"#ff5555":"#fff",textShadow:"0 1px 4px #000,0 0 8px #000",pointerEvents:"none",lineHeight:1}}>{isRemove?`−${qty}`:`×${qty}`}</div>}
      {!editing&&qty===0&&<div style={{position:"absolute",inset:0,background:rc+"0d",pointerEvents:"none"}}/>}
      {editing&&(
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,background:BG0+"cc"}} onClick={e=>e.stopPropagation()}>
          <div style={{display:"flex",alignItems:"center",gap:3}}>
            <button onMouseDown={e=>{e.preventDefault();adj(-1);}} style={{width:btnSz,height:btnSz,borderRadius:3,border:"none",background:rc+"44",color:"#fff",fontSize:btnSz*0.75,fontWeight:700,cursor:"pointer",lineHeight:1,display:"flex",alignItems:"center",justifyContent:"center",userSelect:"none"}}>−</button>
            <input ref={inputRef} value={draft} onChange={e=>{const v=e.target.value.replace(/\D/g,"");setDraft(v);const n=parseInt(v);if(!isNaN(n))onSet(name,n);}} onBlur={commit} onKeyDown={e=>{if(e.key==="Enter")commit();if(e.key==="Escape")setEditing(false);}} style={{width:inputW,height:btnSz,textAlign:"center",background:"#000",border:`1.5px solid ${rc}`,color:"#fff",fontSize:13,fontWeight:700,borderRadius:3}}/>
            <button onMouseDown={e=>{e.preventDefault();adj(1);}} style={{width:btnSz,height:btnSz,borderRadius:3,border:"none",background:rc+"44",color:"#fff",fontSize:btnSz*0.75,fontWeight:700,cursor:"pointer",lineHeight:1,display:"flex",alignItems:"center",justifyContent:"center",userSelect:"none"}}>+</button>
          </div>
        </div>
      )}
    </div>
  );
}

function InventoryTab({owned,setOwned,BG0,BG1,BG2,BG3,BORDER,TEXT,MUTED,DIM}:{owned:Record<string,number>;setOwned:React.Dispatch<React.SetStateAction<Record<string,number>>>;BG0:string;BG1:string;BG2:string;BG3:string;BORDER:string;TEXT:string;MUTED:string;DIM:string}) {
  const [batchMode,setBatchMode]=useState<"add"|"remove"|null>(null);
  const [batchItems,setBatchItems]=useState<Record<string,number>>({});
  const onSet=(name:string,v:number)=>setOwned(p=>({...p,[name]:v}));
  const applyBatch=(mode:"add"|"remove")=>{
    setOwned(prev=>{const next={...prev};Object.entries(batchItems).forEach(([name,qty])=>{if(mode==="add")next[name]=(next[name]||0)+qty;else next[name]=Math.max(0,(next[name]||0)-qty);});return next;});
    setBatchItems({});setBatchMode(null);
  };
  const totalItems=Object.values(owned).reduce((a,b)=>a+b,0);
  const totalTypes=Object.values(owned).filter(v=>v>0).length;
  return (
    <div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden",minHeight:0}}>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 14px",borderBottom:`1px solid ${BORDER}`,background:BG1,flexShrink:0,flexWrap:"wrap"}}>
        <div style={{fontSize:11,color:MUTED}}><span style={{color:TEXT,fontWeight:600}}>{totalTypes}</span> types &nbsp;·&nbsp;<span style={{color:TEXT,fontWeight:600}}>{totalItems}</span> total</div>
        <div style={{flex:1}}/>
        <button onClick={()=>{setBatchItems({});setBatchMode("add");}} style={{padding:"4px 12px",borderRadius:4,border:`1px solid #5A9E3088`,background:"#5A9E3014",color:"#5A9E30",fontSize:11,fontWeight:600,cursor:"pointer"}}>+ ADD LOOT</button>
        <button onClick={()=>{setBatchItems({});setBatchMode("remove");}} style={{padding:"4px 12px",borderRadius:4,border:`1px solid #cc552288`,background:"#cc552214",color:"#cc5522",fontSize:11,fontWeight:600,cursor:"pointer"}}>− USE ITEMS</button>
        {totalItems>0&&<button onClick={()=>setOwned({})} style={{padding:"4px 10px",borderRadius:4,border:`1px solid ${BORDER}`,background:"transparent",color:MUTED,fontSize:11,cursor:"pointer"}}>Clear all</button>}
      </div>
      {batchMode&&(
        <div style={{padding:"10px 14px",borderBottom:`1px solid ${BORDER}`,background:BG0,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
            <span style={{fontSize:11,fontWeight:700,letterSpacing:"0.08em",color:batchMode==="add"?"#5A9E30":"#cc5522"}}>{batchMode==="add"?"ADD LOOT FROM MATCH":"DEDUCT USED ITEMS"}</span>
            <span style={{fontSize:10,color:MUTED,flex:1}}>— click items to set quantities</span>
            <button onClick={()=>applyBatch(batchMode)} disabled={Object.keys(batchItems).length===0} style={{padding:"4px 14px",borderRadius:4,border:"none",background:batchMode==="add"?"#5A9E30":"#cc5522",color:"#fff",fontSize:11,fontWeight:700,cursor:Object.keys(batchItems).length===0?"default":"pointer",opacity:Object.keys(batchItems).length===0?0.4:1}}>Apply {Object.keys(batchItems).length>0?`(${Object.keys(batchItems).length})`:""}</button>
            <button onClick={()=>setBatchMode(null)} style={{padding:"4px 10px",borderRadius:4,border:`1px solid ${BORDER}`,background:"transparent",color:MUTED,fontSize:11,cursor:"pointer"}}>Cancel</button>
          </div>
          {Object.keys(batchItems).length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:4}}>{Object.entries(batchItems).map(([name,qty])=>{const rc=R[SALVAGE[name]?.r||"s"].color;return(<div key={name} style={{display:"flex",alignItems:"center",gap:3,padding:"2px 6px 2px 4px",borderRadius:4,background:rc+"22",border:`1px solid ${rc}55`,fontSize:10}}><SalvageIcon name={name} size={14}/><span style={{color:TEXT}}>{name}</span><span style={{color:rc,fontWeight:700}}>×{qty}</span><button onMouseDown={()=>setBatchItems(p=>{const n={...p};delete n[name];return n;})} style={{background:"none",border:"none",color:MUTED,cursor:"pointer",fontSize:11,padding:0,lineHeight:1,marginLeft:1}}>×</button></div>);})}</div>}
        </div>
      )}
      <div style={{overflowY:"auto",flex:1,padding:"12px 14px"}}>
        {RARITY_ORDER_INV.map(tier=>{
          const items=Object.keys(SALVAGE).filter(n=>SALVAGE[n].r===tier).sort();
          if(!items.length) return null;
          const rc=R[tier].color;
          return(
            <div key={tier} style={{marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                <div style={{width:8,height:8,borderRadius:2,background:rc,flexShrink:0}}/>
                <span style={{fontSize:9,fontWeight:700,letterSpacing:"0.14em",color:rc,textTransform:"uppercase"}}>{R[tier].label}</span>
                <div style={{flex:1,height:1,background:BORDER}}/>
                <span style={{fontSize:9,color:DIM}}>{items.filter(n=>(owned[n]||0)>0).length}/{items.length}</span>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:1,background:"#000",border:"1px solid #000",width:"fit-content"}}>
                {items.map(name=>{
                  const qty=batchMode?(batchItems[name]||0):(owned[name]||0);
                  return <InvCell key={name} name={name} qty={qty} onSet={batchMode?(n,v)=>setBatchItems(p=>v===0?(({[n]:_,...r})=>r)(p):{...p,[n]:v}):onSet} forBatch={!!batchMode} batchMode={batchMode} BG0={BG0} TEXT={TEXT}/>;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [faction,setFaction]  =useState("CyberAcme");
  const [tracked,setTracked]  =useState<Set<string>>(()=>new Set(lsGet<string[]>("marathon_tracked",[])));
  const [ignored,setIgnored]  =useState<Set<string>>(()=>new Set(lsGet<string[]>("marathon_ignored",[])));
  const [view,setView]        =useState("upgrades");
  const [activePOI,setActivePOI]=useState<{map:string,poi:string}|null>(null);
  const [owned,setOwned]      =useState<Record<string,number>>(()=>lsGet("marathon_owned",{}));

  React.useEffect(()=>{lsSet("marathon_owned",owned);},[owned]);
  React.useEffect(()=>{lsSet("marathon_tracked",[...tracked]);},[tracked]);
  React.useEffect(()=>{lsSet("marathon_ignored",[...ignored]);},[ignored]);

  const fd=FACTIONS[faction];
  const toggleTrack=(rankId:string)=>setTracked(p=>{const n=new Set(p);n.has(rankId)?n.delete(rankId):n.add(rankId);return n;});
  const toggleIgnore=(name:string)=>setIgnored(p=>{const n=new Set(p);n.has(name)?n.delete(name):n.add(name);return n;});
  const clearAll=()=>setTracked(new Set());

  // Aggregate needed items from tracked ranks
  const needed=useMemo(()=>{
    const agg:Record<string,number>={};
    Object.values(FACTIONS).forEach(fac=>fac.nodes.forEach(node=>node.ranks.forEach((rank,i)=>{
      if(!tracked.has(`${node.id}:${i}`)) return;
      rank.req.forEach(([item,qty])=>agg[item]=(agg[item]||0)+qty);
    })));
    return agg;
  },[tracked]);

  const totalCr=useMemo(()=>{
    let t=0;
    Object.values(FACTIONS).forEach(fac=>fac.nodes.forEach(node=>node.ranks.forEach((rank,i)=>{
      if(tracked.has(`${node.id}:${i}`)) t+=rank.cr;
    })));
    return t;
  },[tracked]);

  const sortedItems=useMemo(()=>{
    const order=["c","p","su","d","e","s"];
    return Object.entries(needed).sort(([a],[b])=>order.indexOf(SALVAGE[a]?.r||"s")-order.indexOf(SALVAGE[b]?.r||"s"));
  },[needed]);

  const remaining=useMemo(()=>{
    const rem:Record<string,number>={};
    Object.entries(needed).forEach(([name,qty])=>{
      if(ignored.has(name)) return;
      const r=Math.max(0,(qty as number)-(owned[name]||0));
      if(r>0) rem[name]=r;
    });
    return rem;
  },[needed,owned,ignored]);

  const locationScores=useMemo(()=>{
    const groundCounts:Record<string,number>={};
    const containerCounts:Record<string,number>={};
    Object.entries(remaining).forEach(([name,qty])=>{
      const info = (SALVAGE[name] || {}) as SalvageInfo; if(!info) return;
      info.locs.forEach(({map,poi})=>{const k=`${map}|||${poi}`;groundCounts[k]=(groundCounts[k]||0)+qty;});
      expandContainers(info.containers).forEach(ct=>{(CONTAINER_MAPS[ct]||[]).forEach(map=>{const k=`${map}|||${ct}`;containerCounts[k]=(containerCounts[k]||0)+qty;});});
    });
    const byMap:Record<string,{groundTotal:number,containerTotal:number,pois:{poi:string,count:number}[],containers:{name:string,count:number}[]}>={};
    const ensureMap=(map:string)=>{if(!byMap[map])byMap[map]={groundTotal:0,containerTotal:0,pois:[],containers:[]};};
    Object.entries(groundCounts).forEach(([k,c])=>{const[map,poi]=k.split("|||");ensureMap(map);byMap[map].groundTotal+=c;byMap[map].pois.push({poi,count:c});});
    Object.entries(containerCounts).forEach(([k,c])=>{const[map,ct]=k.split("|||");ensureMap(map);byMap[map].containerTotal+=c;byMap[map].containers.push({name:ct,count:c});});
    return Object.entries(byMap).map(([map,d])=>({map,total:d.groundTotal+d.containerTotal,groundTotal:d.groundTotal,containerTotal:d.containerTotal,pois:d.pois.sort((a,b)=>b.count-a.count),containers:d.containers.sort((a,b)=>b.count-a.count)})).sort((a,b)=>b.total-a.total);
  },[remaining]);

  const poiItems=useMemo(()=>{
    if(!activePOI) return [];
    const {map,poi}=activePOI;
    const isContainer=poi in CONTAINER_MAPS;
    return Object.entries(remaining).filter(([name])=>{
      const info = (SALVAGE[name] || {}) as SalvageInfo;if(!info) return false;
      if(isContainer) return expandContainers(info.containers).includes(poi)&&(CONTAINER_MAPS[poi]||[]).includes(map);
      return info.locs.some(l=>l.map===map&&l.poi===poi);
    }).map(([name,qty])=>({name,qty:qty as number})).sort((a,b)=>(SALVAGE[b.name]?.r||"s").localeCompare(SALVAGE[a.name]?.r||"s"));
  },[activePOI,remaining]);

  const factionTrackedCount=(fname:string)=>{
    const fac=FACTIONS[fname];
    return fac.nodes.reduce((acc,node)=>acc+node.ranks.filter((_,i)=>tracked.has(`${node.id}:${i}`)).length,0);
  };

  const togglePOI=(map:string,poi:string)=>setActivePOI(p=>p&&p.map===map&&p.poi===poi?null:{map,poi});

  // Colours
  const BG0="#090b0e",BG1="#0f1318",BG2="#161c24",BG3="#1e2738";
  const BORDER="rgba(255,255,255,0.07)";
  const TEXT="#d6dde8",MUTED="#6a7a8e",DIM="#3a4a5a";
  const acc=fd.accent;

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",background:BG0,color:TEXT,fontFamily:"system-ui,sans-serif",fontSize:13,overflow:"hidden"}}>

      {/* Top bar */}
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"8px 14px",borderBottom:`1px solid ${BORDER}`,background:BG1,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginRight:4}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:acc,boxShadow:`0 0 8px ${acc}`}}/>
          <span style={{fontSize:12,fontWeight:600,letterSpacing:"0.1em",color:TEXT}}>MARATHON</span>
          <span style={{fontSize:11,color:MUTED,letterSpacing:"0.06em"}}>SALVAGE TRACKER</span>
        </div>
        <div style={{display:"flex",gap:2,padding:"2px",background:BG0,borderRadius:6,border:`1px solid ${BORDER}`}}>
          {["upgrades","inventory"].map(v=>(
            <button key={v} onClick={()=>setView(v)} style={{padding:"4px 12px",borderRadius:4,border:"none",cursor:"pointer",fontSize:11,fontWeight:500,letterSpacing:"0.06em",textTransform:"uppercase",background:view===v?BG3:"transparent",color:view===v?TEXT:MUTED,transition:"all 0.15s"}}>{v}</button>
          ))}
        </div>
        <div style={{flex:1}}/>
        <button onClick={()=>{const state={owned,tracked:[...tracked],ignored:[...ignored],faction,view};const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`marathon-tracker-${new Date().toISOString().slice(0,10)}.json`;a.click();}} style={{padding:"3px 9px",borderRadius:4,border:`1px solid ${BORDER}`,background:"transparent",color:MUTED,fontSize:10,cursor:"pointer",fontWeight:600,letterSpacing:"0.05em"}}>↓ EXPORT</button>
        <label style={{padding:"3px 9px",borderRadius:4,border:`1px solid ${BORDER}`,background:"transparent",color:MUTED,fontSize:10,cursor:"pointer",fontWeight:600,letterSpacing:"0.05em"}}>
          ↑ IMPORT
          <input type="file" accept=".json" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result as string);if(typeof d==="object"&&!Array.isArray(d)){if(d.owned)setOwned(d.owned);if(d.tracked)setTracked(new Set(d.tracked));if(d.ignored)setIgnored(new Set(d.ignored));if(d.faction&&d.faction in FACTIONS)setFaction(d.faction);if(d.view)setView(d.view);}else alert("Invalid backup file.");}catch{alert("Failed to parse backup file.");}};r.readAsText(f);e.target.value="";}}/>
        </label>
        {tracked.size>0&&<div style={{display:"flex",alignItems:"center",gap:10,fontSize:11}}><span style={{color:MUTED}}>{tracked.size} tracked</span><span style={{color:"#D4922A",fontWeight:600}}>◆ {totalCr.toLocaleString()}</span></div>}
      </div>

      {/* Faction tabs */}
      {view!=="inventory"&&(
        <div style={{display:"flex",alignItems:"center",borderBottom:`1px solid ${BORDER}`,background:BG1,flexShrink:0,overflowX:"auto"}}>
          {Object.entries(FACTIONS).map(([name,f])=>{
            const active=name===faction,cnt=factionTrackedCount(name);
            return(
              <button key={name} onClick={()=>setFaction(name)} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 16px",border:"none",borderBottom:`2px solid ${active?f.accent:"transparent"}`,background:"transparent",color:active?f.accent:MUTED,cursor:"pointer",fontSize:11,fontWeight:600,letterSpacing:"0.08em",whiteSpace:"nowrap",transition:"color 0.15s",flexShrink:0}}>
                {name.toUpperCase()}
                {cnt>0&&<div style={{width:16,height:16,borderRadius:"50%",background:f.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:BG0,fontWeight:700}}>{cnt}</div>}
              </button>
            );
          })}
          <div style={{flex:1}}/>
          {tracked.size>0&&<button onClick={clearAll} style={{padding:"5px 12px",margin:"0 8px",borderRadius:4,border:`1px solid ${BORDER}`,background:"transparent",color:"#cc5555",fontSize:10,cursor:"pointer",fontWeight:600,letterSpacing:"0.05em",whiteSpace:"nowrap",flexShrink:0}}>CLEAR ALL FACTIONS</button>}
        </div>
      )}

      {/* Inventory */}
      {view==="inventory"&&<InventoryTab owned={owned} setOwned={setOwned} BG0={BG0} BG1={BG1} BG2={BG2} BG3={BG3} BORDER={BORDER} TEXT={TEXT} MUTED={MUTED} DIM={DIM}/>}

      {/* Main pane */}
      {view!=="inventory"&&(
        <div style={{display:"flex",flex:1,overflow:"hidden",minHeight:0}}>

          {/* Left: upgrade grid */}
          <div style={{flex:1,overflowY:"auto",overflowX:"auto",padding:16}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,padding:"10px 14px",background:BG2,borderRadius:8,border:`1px solid ${acc}33`,borderLeft:`3px solid ${acc}`}}>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:acc,letterSpacing:"0.08em",marginBottom:2}}>{faction.toUpperCase()}</div>
                <div style={{fontSize:11,color:MUTED}}>{fd.tag} · Rep: {fd.rep}</div>
              </div>
            </div>

            {/* Grid */}
            <div style={{position:"relative",width:fd.cols*GCELL_W,minHeight:fd.rows*GCELL_H}}>
              <NodeConnectors nodes={fd.nodes} cols={fd.cols} rows={fd.rows} acc={acc}/>
              {fd.nodes.map(node=>(
                <div key={node.id} style={{
                  position:"absolute",
                  left:(node.col-1)*GCELL_W,
                  top:(node.row-1)*GCELL_H,
                  width:GCARD_W,
                }}>
                  <NodeCard node={node} acc={acc} tracked={tracked} onTrack={toggleTrack} BG0={BG0} BG1={BG1} BG2={BG2} BORDER={BORDER} TEXT={TEXT} MUTED={MUTED} DIM={DIM}/>
                </div>
              ))}
            </div>
          </div>

          {/* Right: shopping list */}
          <div style={{width:270,borderLeft:`1px solid ${BORDER}`,background:BG1,display:"flex",flexDirection:"column",flexShrink:0,overflowY:"auto"}}>
            {sortedItems.length===0?(
              <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,padding:24}}>
                <div style={{fontSize:28,color:DIM}}>□</div>
                <div style={{fontSize:11,color:MUTED,textAlign:"center",lineHeight:1.6}}>Track upgrade ranks to build your salvage list</div>
              </div>
            ):(<>
              {/* Header */}
              <div style={{padding:"11px 14px",borderBottom:`1px solid ${BORDER}`}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                  <span style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:MUTED,flex:1}}>SALVAGE REQUIRED</span>
                  {Object.keys(owned).length>0&&<button onClick={()=>setOwned({})} title="Clear inventory" style={{padding:"3px 7px",borderRadius:4,border:`1px solid ${BORDER}`,cursor:"pointer",background:"transparent",color:"#cc5555",fontSize:9,fontWeight:700}}>✕</button>}
                </div>
                <div style={{fontSize:11,color:TEXT}}>{sortedItems.length} items · {tracked.size} tracked · <span style={{color:"#D4922A"}}>◆ {totalCr.toLocaleString()}</span></div>
              </div>

              {/* Best locations */}
              {locationScores.length>0&&(
                <div style={{padding:"11px 14px",borderBottom:`1px solid ${BORDER}`}}>
                  <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:MUTED,marginBottom:8}}>BEST LOCATIONS TO FARM</div>
                  {locationScores.slice(0,4).map(({map,total,pois,containers},i)=>{
                    const m=MAPS[map]||{color:"#888"};
                    return(
                      <div key={map} style={{marginBottom:12}}>
                        <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4}}>
                          <div style={{width:6,height:6,borderRadius:"50%",background:m.color,flexShrink:0}}/>
                          <span style={{fontSize:11,fontWeight:i===0?700:500,color:i===0?TEXT:MUTED,flex:1}}>{map}</span>
                          <span style={{fontSize:10,fontWeight:700,color:m.color}}>{total}</span>
                        </div>
                        {pois.length>0&&(
                          <div style={{marginBottom:4}}>
                            <div style={{fontSize:8,letterSpacing:"0.1em",color:DIM,paddingLeft:13,marginBottom:2}}>GROUND</div>
                            {pois.map(({poi,count},j)=>{
                              const isActive=activePOI?.map===map&&activePOI?.poi===poi;
                              return(
                                <div key={poi}>
                                  <div onClick={()=>togglePOI(map,poi)} style={{display:"flex",alignItems:"center",gap:5,marginBottom:2,cursor:"pointer",borderRadius:4,padding:"3px 4px 3px 13px",background:isActive?m.color+"22":"transparent",border:`1px solid ${isActive?m.color+"55":"transparent"}`}}>
                                    <span style={{color:j===0?m.color:DIM,fontSize:8,flexShrink:0}}>↳</span>
                                    <span style={{fontSize:9,color:isActive?m.color:j===0?TEXT:MUTED,fontWeight:j===0?600:400,flex:1}}>{poi}</span>
                                    <span style={{fontSize:9,fontWeight:700,color:isActive?m.color:MUTED,flexShrink:0}}>{count}</span>
                                    <span style={{fontSize:8,color:DIM,flexShrink:0}}>{isActive?"▲":"▼"}</span>
                                  </div>
                                  {isActive&&(
                                    <div style={{marginLeft:22,marginBottom:4,padding:"6px 8px",background:BG0,borderRadius:4,border:`1px solid ${m.color}33`}}>
                                      {poiItems.length===0?<div style={{fontSize:9,color:MUTED}}>No items needed here</div>
                                        :poiItems.map(({name,qty})=>{const rc=R[SALVAGE[name]?.r||"s"].color;return(<div key={name} style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}><SalvageIcon name={name} size={16}/><span style={{fontSize:9,color:rc,flex:1}}>{name}</span><span style={{fontSize:9,fontWeight:700,color:TEXT}}>×{qty}</span></div>);})}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                        {containers.length>0&&(
                          <div>
                            <div style={{fontSize:8,letterSpacing:"0.1em",color:DIM,paddingLeft:13,marginBottom:2}}>CONTAINERS & EVENTS</div>
                            {containers.map(({name:ct,count},j)=>{
                              const isActive=activePOI?.map===map&&activePOI?.poi===ct;
                              const cc="#C8922A";
                              return(
                                <div key={ct}>
                                  <div onClick={()=>togglePOI(map,ct)} style={{display:"flex",alignItems:"center",gap:5,marginBottom:2,cursor:"pointer",borderRadius:4,padding:"3px 4px 3px 13px",background:isActive?cc+"22":"transparent",border:`1px solid ${isActive?cc+"55":"transparent"}`}}>
                                    <span style={{color:isActive?cc:DIM,fontSize:8,flexShrink:0}}>◈</span>
                                    <span style={{fontSize:9,color:isActive?cc:j===0?MUTED:DIM,fontWeight:400,flex:1,fontStyle:"italic"}}>{ct}</span>
                                    <span style={{fontSize:9,fontWeight:700,color:isActive?cc:DIM,flexShrink:0}}>{count}</span>
                                    <span style={{fontSize:8,color:DIM,flexShrink:0}}>{isActive?"▲":"▼"}</span>
                                  </div>
                                  {isActive&&(
                                    <div style={{marginLeft:22,marginBottom:4,padding:"6px 8px",background:BG0,borderRadius:4,border:`1px solid ${cc}33`}}>
                                      {poiItems.length===0?<div style={{fontSize:9,color:MUTED}}>No items needed here</div>
                                        :poiItems.map(({name,qty})=>{const rc=R[SALVAGE[name]?.r||"s"].color;return(<div key={name} style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}><SalvageIcon name={name} size={16}/><span style={{fontSize:9,color:rc,flex:1}}>{name}</span><span style={{fontSize:9,fontWeight:700,color:TEXT}}>×{qty}</span></div>);})}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Item list */}
              <div style={{padding:"11px 14px",flex:1}}>
                {["c","p","su","d","e","s"].map(tier=>{
                  const items=sortedItems.filter(([n])=>(SALVAGE[n]?.r||"s")===tier);
                  if(!items.length) return null;
                  const rc=R[tier].color;
                  return(
                    <div key={tier} style={{marginBottom:14}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                        <div style={{width:6,height:6,borderRadius:1,background:rc,flexShrink:0}}/>
                        <span style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:rc}}>{R[tier].label.toUpperCase()}</span>
                        <div style={{flex:1,height:"1px",background:BORDER}}/>
                      </div>
                      {items.map(([name,qty])=>{
                        const info = (SALVAGE[name] || {}) as SalvageInfo,rc2=R[info.r||"s"].color;
                        const have=owned[name]||0;
                        const isIgnored=ignored.has(name);
                        const rem=isIgnored?0:Math.max(0,(qty as number)-have);
                        const done=!isIgnored&&rem===0;
                        return(
                          <div key={name} style={{padding:"7px 9px",marginBottom:5,borderRadius:5,background:isIgnored?BG0:done?"rgba(58,138,48,0.08)":BG2,border:`1px solid ${isIgnored?BORDER:done?"rgba(58,138,48,0.25)":BORDER}`,borderLeft:`2px solid ${isIgnored?DIM:done?"#3A8A30":rc2}`,opacity:isIgnored?0.45:done?0.7:1}}>
                            <div style={{display:"flex",alignItems:"center",gap:7}}>
                              <SalvageIcon name={name} size={22}/>
                              <div style={{flex:1,minWidth:0}}>
                                <div style={{fontSize:11,fontWeight:600,color:isIgnored?MUTED:done?"#5A9E30":TEXT,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",textDecoration:isIgnored?"line-through":"none"}}>
                                  {done&&!isIgnored&&<span style={{marginRight:3}}>✓</span>}{name}
                                </div>
                                <div style={{fontSize:9,color:MUTED}}>{(info.locs||[]).slice(0,2).map(l=>l.poi).join(" · ")}</div>
                              </div>
                              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:2,flexShrink:0}}>
                                {!isIgnored&&!done&&<div style={{fontSize:12,fontWeight:700,color:rc2,background:rc2+"22",borderRadius:4,padding:"2px 7px"}}>×{rem}</div>}
                                {!isIgnored&&done&&<div style={{fontSize:10,fontWeight:700,color:"#3A8A30",background:"rgba(58,138,48,0.15)",borderRadius:4,padding:"2px 7px"}}>done</div>}
                                {have>0&&<div style={{fontSize:8,color:"#3A8A30",fontWeight:600}}>have ×{have}{done&&!isIgnored?` / ×${qty}`:""}</div>}
                                <button onClick={e=>{e.stopPropagation();toggleIgnore(name);}} title={isIgnored?"Un-ignore":"Ignore"} style={{marginTop:2,padding:"1px 5px",borderRadius:3,border:`1px solid ${isIgnored?DIM:BORDER}`,background:"transparent",color:isIgnored?MUTED:DIM,fontSize:8,cursor:"pointer",letterSpacing:"0.04em",fontWeight:600,lineHeight:1.4}}>
                                  {isIgnored?"UNIGNORE":"IGNORE"}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </>)}
          </div>
        </div>
      )}
    </div>
  );
}
