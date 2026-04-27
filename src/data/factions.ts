import { NodeDef } from "../types";

interface FactionDef {
  accent: string;
  rep: string;
  tag: string;
  cols: number;
  rows: number;
  nodes: NodeDef[];
}

export const FACTIONS: Record<string, FactionDef> = {
  CyberAcme: {accent:"#1DB878",rep:"ONI",tag:"Vault · Utility · Economy",cols:6,rows:4,nodes:[
    {id:"ca-expansion",   name:"Expansion",         requires:null,             col:1,row:1,ranks:[
      {name:"Expansion 1",     fx:"Vault Size +8 rows",              cr:2500, req:[["Unstable Diode",12]]},
      {name:"Expansion 2",     fx:"Vault Size +8 rows",              cr:4000, req:[["Unstable Diode",22],["Unstable Gunmetal",12]]},
      {name:"Expansion 3",     fx:"Vault Size +6 rows",              cr:5000, req:[["Unstable Diode",27],["Unstable Gunmetal",15]]},
      {name:"Expansion 4",     fx:"Vault Size +4 rows",              cr:7000, req:[["Unstable Diode",30],["Unstable Gunmetal",18]]},
      {name:"Expansion 5",     fx:"Vault Size +4 rows",              cr:10000,req:[["Unstable Diode",50],["Unstable Gunmetal",30]]},
    ]},
    {id:"ca-informant",   name:"Informant",          requires:null,             col:2,row:1,ranks:[
      {name:"Informant.exe 1", fx:"Data Card Credit Value +50%",     cr:1500, req:[]},
      {name:"Informant.exe 2", fx:"Data Card Credit Value +50%",     cr:2000, req:[]},
    ]},
    {id:"ca-credit-limit",name:"Credit Limit",       requires:"ca-informant",   col:3,row:1,ranks:[
      {name:"Credit Limit 1",  fx:"Credit Wallet Capacity +20k",     cr:2500, req:[]},
      {name:"Credit Limit 2",  fx:"Credit Wallet Capacity +50k",     cr:4000, req:[]},
      {name:"Credit Limit 3",  fx:"Credit Wallet Capacity +200k",    cr:7000, req:[]},
      {name:"Credit Limit 4",  fx:"Credit Wallet Capacity +700k",    cr:10000,req:[]},
      {name:"Credit Limit 5",  fx:"Credit Wallet Capacity +9000k",   cr:50000,req:[]},
    ]},
    {id:"ca-enh-weaponry",name:"Enhanced Weaponry",  requires:null,             col:4,row:1,ranks:[{name:"Enhanced Weaponry",fx:"Unlocks Enhanced Overrun AR, V11 Punch, CE Tactical Sidearm",cr:2500,req:[]}]},
    {id:"ca-dlx-weaponry",name:"Deluxe Weaponry",    requires:"ca-enh-weaponry",col:5,row:1,ranks:[{name:"Deluxe Weaponry",  fx:"Unlocks Deluxe Overrun AR, V11 Punch, CE Tactical Sidearm",  cr:4000,req:[]}]},
    {id:"ca-heat-sink",   name:"Heat Sink",           requires:null,             col:6,row:1,ranks:[
      {name:"HEAT_SINK.EXE 1", fx:"Heat Capacity +20",               cr:2500, req:[["Unstable Biomass",12]]},
      {name:"HEAT_SINK.EXE 2", fx:"Heat Capacity +20",               cr:3500, req:[["Unstable Biomass",24],["Unstable Lead",12]]},
      {name:"HEAT_SINK.EXE 3", fx:"Heat Capacity +20",               cr:5000, req:[["Unstable Biomass",30],["Unstable Lead",20]]},
    ]},
    {id:"ca-carrier",     name:"Carrier",             requires:null,             col:1,row:2,ranks:[{name:"Carrier",          fx:"Enhanced Backpacks in Armory",    cr:1500,req:[]}]},
    {id:"ca-carrier-plus",name:"Carrier+",            requires:"ca-carrier",     col:5,row:2,ranks:[{name:"Carrier+",         fx:"Deluxe Backpacks in Armory",      cr:4000,req:[]}]},
    {id:"ca-quick-vent",  name:"Quick Vent",           requires:"ca-heat-sink",   col:6,row:2,ranks:[
      {name:"QUICK_VENT.EXE 1",fx:"Heat Recovery Speed -20%",       cr:2500, req:[["Unstable Gel",8]]},
      {name:"QUICK_VENT.EXE 2",fx:"Heat Recovery Speed -20%",       cr:4000, req:[["Unstable Gel",16]]},
    ]},
    {id:"ca-scavenger",   name:"Scavenger",            requires:null,             col:1,row:3,ranks:[
      {name:"SCAVENGER.EXE 1", fx:"Loot Speed +20",                  cr:750,  req:[]},
      {name:"SCAVENGER.EXE 2", fx:"Loot Speed +20",                  cr:2500, req:[]},
      {name:"SCAVENGER.EXE 3", fx:"Loot Speed +20%",                 cr:4000, req:[]},
    ]},
    {id:"ca-loot-siphon", name:"Loot Siphon",          requires:"ca-scavenger",   col:2,row:3,ranks:[
      {name:"LOOT_SIPHON.EXE 1",fx:"Tactical Energy on Container Loot 5%",cr:1500,req:[]},
      {name:"LOOT_SIPHON.EXE 2",fx:"Tactical Energy on Container Loot 5%",cr:4000,req:[]},
    ]},
    {id:"ca-soundproof",  name:"Soundproof",           requires:"ca-loot-siphon", col:5,row:3,ranks:[{name:"SOUNDPROOF.EXE",  fx:"Less noise while looting",        cr:5000,req:[]}]},
    {id:"ca-active-cool", name:"Active Cool",           requires:"ca-quick-vent",  col:6,row:3,ranks:[
      {name:"ACTIVE_COOL.EXE 1",fx:"Heat Recovery Rate 15%",         cr:3500, req:[["Unstable Gel",24]]},
      {name:"ACTIVE_COOL.EXE 2",fx:"Heat Recovery Rate 15%",         cr:5000, req:[["Unstable Gel",30]]},
    ]},
    {id:"ca-firm-stance", name:"Firm Stance",           requires:null,             col:1,row:4,ranks:[
      {name:"FIRM_STANCE.EXE 1",fx:"Fall Resistance +20",            cr:750,  req:[]},
      {name:"FIRM_STANCE.EXE 2",fx:"Fall Resistance +20",            cr:4000, req:[]},
      {name:"FIRM_STANCE.EXE 3",fx:"Fall Resistance +20",            cr:5000, req:[]},
    ]},
    {id:"ca-loose-change",name:"Loose Change",          requires:"ca-loot-siphon", col:2,row:4,ranks:[{name:"LOOSE_CHANGE.EXE",fx:"Opening a container rewards 25 credits",cr:5000,req:[]}]},
    {id:"ca-locksmith",   name:"Locksmith",             requires:null,             col:3,row:4,ranks:[
      {name:"Locksmith",        fx:"Unlocks lockbox key in Armory",  cr:2500, req:[]},
      {name:"Keymaker",         fx:"Unlocks Deluxe Key templates",   cr:4000, req:[]},
      {name:"Keymaker+",        fx:"Unlocks Superior Key templates", cr:7000, req:[]},
    ]},
    {id:"ca-fixative",    name:"Fixative",              requires:null,             col:4,row:4,ranks:[{name:"FIXATIVE.EXE",    fx:"Increased chance of Matter Fixatives from UESC",cr:3500,req:[]}]},
    {id:"ca-slider",      name:"Slider",                requires:"ca-active-cool", col:6,row:4,ranks:[{name:"SLIDER.EXE",      fx:"Sprint slide generates less heat",cr:7000,req:[]}]},
  ]},
  NuCaloric: {accent:"#F1387D",rep:"Gaius",tag:"Shields · Healing · Survival",cols:6,rows:4,nodes:[
    {id:"nc-safeguard",    name:"Safeguard",         requires:null,               col:1,row:1,ranks:[{name:"Safeguard",        fx:"Free Daily Shield Charges in Armory",cr:750,  req:[["Unstable Biomass",16]]}]},
    {id:"nc-adv-shields",  name:"Advanced Shields",  requires:"nc-safeguard",     col:2,row:1,ranks:[{name:"Advanced Shields", fx:"Unlocks Advanced Shield Charges",   cr:1500, req:[["Reclaimed Biostripping",10],["Unstable Biomass",10]]}]},
    {id:"nc-safeguard-plus",name:"Safeguard+",       requires:"nc-adv-shields",   col:3,row:1,ranks:[
      {name:"Safeguard+",      fx:"Free Daily Advanced Shield Charges",cr:2000,req:[["Sterilized Biostripping",6],["Sparkleaf",16]]},
      {name:"Shield Stock",    fx:"Adv. Shield Charge stock +5",       cr:1500,req:[["Reclaimed Biostripping",15],["Sparkleaf",8]]},
    ]},
    {id:"nc-shield-comm",  name:"Shield Comm",       requires:"nc-safeguard-plus",col:4,row:1,ranks:[{name:"Shield Comm",      fx:"Contracts award Shield Charges",    cr:2000, req:[["Sterilized Biostripping",12],["Tarax Seed",6]]}]},
    {id:"nc-shielded",     name:"Shielded",          requires:null,               col:5,row:1,ranks:[{name:"Shielded",         fx:"Enhanced Shield Implants in Armory",cr:1500, req:[["Reclaimed Biostripping",12],["Unstable Biomass",13]]}]},
    {id:"nc-armored",      name:"Armored",           requires:"nc-shielded",               col:6,row:1,ranks:[{name:"Armored",          fx:"Deluxe Shield Implants in Armory",  cr:3500, req:[["Biolens Seed",7],["Neural Insulation",3]]}]},
    {id:"nc-restore",      name:"Restore",           requires:null,               col:1,row:2,ranks:[{name:"Restore",          fx:"Free Daily Patch Kits in Armory",   cr:1500, req:[["Unstable Biomass",23]]}]},
    {id:"nc-adv-patch",    name:"Advanced Patch",    requires:"nc-restore",       col:2,row:2,ranks:[{name:"Advanced Patch",   fx:"Unlocks Advanced Patch Kits",       cr:1500, req:[["Dermachem Pack",10],["Unstable Biomass",13]]}]},
    {id:"nc-restore-plus", name:"Restore+",          requires:"nc-adv-patch",               col:3,row:2,ranks:[
      {name:"Restore+",        fx:"Free Daily Advanced Patch Kits",   cr:2000,req:[["Neurochem Pack",5],["Sparkleaf",16]]},
      {name:"Patch Stock",     fx:"Advanced Patch Kit stock +5",      cr:1500,req:[["Dermachem Pack",8],["Unstable Biomass",11]]},
    ]},
    {id:"nc-health-comm",  name:"Health Comm",       requires:"nc-restore-plus",  col:4,row:2,ranks:[{name:"Health Comm",      fx:"Contracts award Patch Kits",        cr:5000, req:[["Hazard Capsule",2]]}]},
    {id:"nc-panacea",      name:"Panacea Kit",       requires:null,               col:6,row:2,ranks:[{name:"Panacea Kit",      fx:"Unlocks Panacea Kits in Armory",   cr:5000, req:[["Hazard Capsule",2],["Neural Insulation",7]]}]},
    {id:"nc-regen",        name:"Regen",             requires:null,               col:1,row:3,ranks:[
      {name:"Regen",           fx:"Unlocks Regen V2 implant",         cr:750,  req:[["Unstable Biomass",10]]},
      {name:"Regen+",          fx:"Unlocks Regen V3 implant",         cr:1500, req:[["Reclaimed Biostripping",28],["Sparkleaf",14]]},
      {name:"Regen++",         fx:"Unlocks Regen V4 implant",         cr:3500, req:[["Biolens Seed",7],["Neural Insulation",3]]},
    ]},
    {id:"nc-null-hazard",  name:"Null Hazard",       requires:null,               col:2,row:3,ranks:[
      {name:"NULL_HAZARD.EXE 1",fx:"Hazard Tolerance +50",           cr:750,  req:[["Unstable Biomass",19]]},
      {name:"NULL_HAZARD.EXE 2",fx:"Hazard Tolerance +50",           cr:1500, req:[["Sterilized Biostripping",5],["Sparkleaf",12]]},
      {name:"TCIV_RESIST.EXE",  fx:"Ticks, lightning & Heat Cascade dmg reduced",cr:3500,req:[["Biolens Seed",5],["Tarax Seed",7]]},
    ]},
    {id:"nc-reinforce",    name:"Reinforce",         requires:null,               col:3,row:3,ranks:[
      {name:"REINFORCE.EXE 1", fx:"Hardware +20",                    cr:1500, req:[["Reclaimed Biostripping",8],["Unstable Biomass",9]]},
      {name:"REINFORCE.EXE 2", fx:"Hardware +20",                    cr:2000, req:[["Sterilized Biostripping",7],["Sparkleaf",25]]},
      {name:"REINFORCE.EXE 3", fx:"Hardware +20",                    cr:5000, req:[["Hazard Capsule",2]]},
    ]},
    {id:"nc-unfazed",      name:"Unfazed",           requires:"nc-reinforce",     col:4,row:3,ranks:[
      {name:"UNFAZED.EXE 1",   fx:"Firewall +20",                    cr:1500, req:[["Dermachem Pack",7],["Unstable Biomass",7]]},
      {name:"UNFAZED.EXE 2",   fx:"Firewall +20",                    cr:2000, req:[["Neurochem Pack",8],["Tarax Seed",5]]},
      {name:"UNFAZED.EXE 3",   fx:"Firewall +20",                    cr:5000, req:[["Hazard Capsule",2],["Tarax Seed",9]]},
    ]},
    {id:"nc-resist-comm",  name:"Resist Comm",       requires:null,               col:5,row:3,ranks:[{name:"RESIST COMM",      fx:"Contracts award Mechanic's Kits or OS Reboots",cr:3500,req:[["Biolens Seed",9],["Neural Insulation",3]]}]},
    {id:"nc-recovery",     name:"Recovery",          requires:null,               col:1,row:4,ranks:[
      {name:"RECOVERY.EXE 1",  fx:"Self-Repair Speed +20",           cr:1500, req:[["Dermachem Pack",10],["Unstable Biomass",13]]},
      {name:"RECOVERY.EXE 2",  fx:"Self-Repair Speed +20",           cr:2000, req:[["Neurochem Pack",10],["Tarax Seed",6]]},
      {name:"RECOVERY.EXE 3",  fx:"Self-Repair Speed +20",           cr:5000, req:[["Hazard Capsule",3],["Enzyme Replicator",3]]},
    ]},
    {id:"nc-adv-mch",      name:"Advanced Mch",      requires:null,               col:2,row:4,ranks:[
      {name:"Advanced MCH",    fx:"Unlocks Advanced Mechanic's Kits",cr:1500, req:[["Reclaimed Biostripping",8],["Unstable Biomass",9]]},
      {name:"Advanced OS",     fx:"Unlocks Advanced OS Debugs",      cr:1500, req:[["Reclaimed Biostripping",10],["Unstable Biomass",10]]},
    ]},
    {id:"nc-helping-hands",name:"Helping Hands",     requires:null,               col:3,row:4,ranks:[
      {name:"Helping Hands",   fx:"Unlocks Helping Hands V2 implant",cr:750,  req:[["Unstable Biomass",10]]},
      {name:"Helping Hands+",  fx:"Unlocks Helping Hands V3 implant",cr:1500, req:[["Dermachem Pack",18],["Sparkleaf",13]]},
      {name:"Helping Hands++", fx:"Unlocks Helping Hands V4 implant",cr:3500, req:[["Biolens Seed",9],["Tarax Seed",14]]},
    ]},
    {id:"nc-self-revive",  name:"Self-Revive",       requires:null,               col:4,row:4,ranks:[{name:"Self-Revive",      fx:"Unlocks Self-Revives for purchase",cr:1500, req:[["Neurochem Pack",4],["Sparkleaf",14]]}]},
    {id:"nc-field-medic",  name:"Field Medic",       requires:null,               col:6,row:4,ranks:[{name:"FIELD_MEDIC.EXE",  fx:"Health & shield consumables use faster",cr:5000,req:[["Hazard Capsule",3],["Enzyme Replicator",8]]}]},
  ]},
  Traxus: {accent:"#EB7209",rep:"Vulcan",tag:"Weapons · Mods · Combat",cols:6,rows:4,nodes:[
    {id:"tx-dlx-chips",    name:"Deluxe Chips",      requires:"tx-enh-chips",     col:1,row:1,ranks:[{name:"Deluxe Chips",    fx:"Unlocks Deluxe chip mods in Armory",cr:5000,req:[["Alien Alloy",3],["Reflex Coil",11]]}]},
    {id:"tx-enh-chips",    name:"Enhanced Chips",    requires:null,               col:3,row:1,ranks:[
      {name:"Enhanced Chips",  fx:"Unlocks Enhanced chip mods",      cr:1500, req:[["Altered Wire",7],["Unstable Gunmetal",6]]},
      {name:"Enhanced Chips+", fx:"Additional Enhanced chip mods",   cr:1500, req:[["Altered Wire",19],["Plasma Filament",9]]},
    ]},
    {id:"tx-tad-boost",    name:"TAD Boost",         requires:null,               col:4,row:1,ranks:[{name:"TAD_BOOST.EXE",   fx:"TAD Ping Area +20m",               cr:750,  req:[["Unstable Gunmetal",19]]}]},
    {id:"tx-tracker",      name:"Tracker",           requires:"tx-tad-boost",     col:6,row:1,ranks:[
      {name:"TRACKER.EXE 1",   fx:"Ping Duration +30",               cr:2000, req:[["Anomalous Wire",7],["Plasma Filament",21]]},
      {name:"TRACKER.EXE 2",   fx:"Ping Duration +30",               cr:5000, req:[["Alien Alloy",2]]},
    ]},
    {id:"tx-dlx-smg-mods", name:"Deluxe SMG Mods",  requires:"tx-enh-heavy-smg", col:1,row:2,ranks:[{name:"Deluxe SMG Mods", fx:"Rotating Deluxe SMG mod in Armory",cr:3500,req:[["Predictive Framework",4],["Tachyon Filament",6]]}]},
    {id:"tx-enh-heavy-smg",name:"Enhanced Heavy SMG",requires:"tx-smg-mods",      col:2,row:2,ranks:[{name:"Enh. Heavy SMG",  fx:"Unlocks Enhanced Bully SMG",       cr:1500, req:[["Deimosite Rods",23],["Altered Wire",9]]}]},
    {id:"tx-smg-mods",     name:"SMG Mods",          requires:null,               col:3,row:2,ranks:[
      {name:"SMG Mods",        fx:"Rotating Enhanced SMG mod",       cr:750,  req:[["Unstable Gunmetal",10]]},
      {name:"SMG Mods+",       fx:"Additional rotating Enhanced SMG mod",cr:1500,req:[["Deimosite Rods",7],["Unstable Gunmetal",6]]},
    ]},
    {id:"tx-ar-mods",      name:"AR Mods",           requires:null,               col:4,row:2,ranks:[
      {name:"AR Mods",         fx:"Rotating Enhanced AR mod",        cr:750,  req:[["Unstable Gunmetal",10]]},
      {name:"AR Mods+",        fx:"Additional rotating Enhanced AR mod",cr:1500,req:[["Altered Wire",7],["Unstable Gunmetal",6]]},
    ]},
    {id:"tx-enh-light-ar", name:"Enhanced Light AR", requires:"tx-ar-mods",       col:5,row:2,ranks:[{name:"Enhanced Light AR",fx:"Unlocks Enhanced M77 AR",         cr:2000, req:[["Anomalous Wire",10],["Tachyon Filament",4]]}]},
    {id:"tx-dlx-ar-mods",  name:"Deluxe AR Mods",    requires:"tx-enh-light-ar",  col:6,row:2,ranks:[{name:"Deluxe AR Mods",  fx:"Rotating Deluxe AR mod in Armory", cr:5000, req:[["Alien Alloy",2]]}]},
    {id:"tx-volt-pr",      name:"Volt PR",            requires:"tx-volt-mods",     col:2,row:3,ranks:[
      {name:"Volt PR",         fx:"Unlocks V66 Lookout",             cr:1500, req:[["Deimosite Rods",19],["Altered Wire",7]]},
      {name:"Enhanced Volt PR",fx:"Unlocks Enhanced V66 Lookout",    cr:3500, req:[["Predictive Framework",5],["Tachyon Filament",7]]},
    ]},
    {id:"tx-volt-mods",    name:"Volt Mods",          requires:"tx-smg-mods",      col:3,row:3,ranks:[
      {name:"Volt Mods",       fx:"Rotating Enhanced volt mod",      cr:750,  req:[["Unstable Gunmetal",13]]},
      {name:"Volt Mods+",      fx:"Additional rotating Enhanced volt mod",cr:1500,req:[["Deimosite Rods",12],["Altered Wire",6]]},
      {name:"Precision Volt Mods",fx:"Rotating Enhanced volt mod",   cr:1500, req:[["Cetinite Rods",6],["Altered Wire",11]]},
    ]},
    {id:"tx-precision-mods",name:"Precision Mods",   requires:"tx-ar-mods",       col:4,row:3,ranks:[
      {name:"Precision Mods",  fx:"Rotating Enhanced precision mod", cr:750,  req:[["Unstable Gunmetal",19]]},
      {name:"Precision Mods+", fx:"Additional rotating Enhanced precision mod",cr:1500,req:[["Deimosite Rods",19],["Altered Wire",7]]},
      {name:"Precision Mods++",fx:"Additional rotating Enhanced precision mod",cr:2000,req:[["Cetinite Rods",8],["Tachyon Filament",4]]},
    ]},
    {id:"tx-mips-sniper",  name:"MIPS Sniper",        requires:"tx-precision-mods",col:5,row:3,ranks:[
      {name:"MIPS Sniper",     fx:"Unlocks Longshot Sniper Rifle",   cr:1500, req:[["Anomalous Wire",5],["Plasma Filament",10]]},
      {name:"Enhanced MIPS Sniper",fx:"Unlocks Enhanced Longshot",   cr:3500, req:[["Ballistic Turbine",9],["Predictive Framework",3]]},
    ]},
    {id:"tx-dlx-volt-mods",name:"Deluxe Volt Mods",  requires:"tx-enh-volt-smg",  col:1,row:4,ranks:[{name:"Deluxe Volt Mods",fx:"Rotating Deluxe volt mod in Armory",cr:3500,req:[["Predictive Framework",7],["Ballistic Turbine",3]]}]},
    {id:"tx-enh-volt-smg", name:"Enhanced Volt SMG",  requires:"tx-volt-pr",       col:2,row:4,ranks:[{name:"Enh. Volt SMG",   fx:"Unlocks Enhanced V22 Volt Thrower SMG",cr:2000,req:[["Cetinite Rods",12],["Tachyon Filament",5]]}]},
    {id:"tx-enh-hardline", name:"Enhanced Hardline PR",requires:"tx-mips-sniper",  col:5,row:4,ranks:[{name:"Enh. Hardline PR",fx:"Unlocks Enhanced Hardline PR",     cr:2000, req:[["Anomalous Wire",7],["Plasma Filament",21]]}]},
    {id:"tx-dlx-precision-mods",name:"Deluxe Precision Mods",requires:"tx-enh-hardline",col:6,row:4,ranks:[{name:"Deluxe Precision Mods",fx:"Rotating Deluxe precision mod",cr:5000,req:[["Alien Alloy",2],["Tachyon Filament",9]]}]},
  ]},
  MIDA: {accent:"#C373ED",rep:"_GANTRY",tag:"Grenades · Equipment · Mobility",cols:6,rows:4,nodes:[
    {id:"mi-eyes-open",   name:"Eyes Open",          requires:"mi-bad-step",      col:1,row:1,ranks:[{name:"Eyes Open",       fx:"Unlocks Proximity Sensor",         cr:2000, req:[["Dynamic Compounds",28],["Surveillance Lens",14]]}]},
    {id:"mi-bad-step",    name:"Bad Step",           requires:null,               col:2,row:1,ranks:[{name:"Bad Step",        fx:"Unlocks Claymores",                cr:750,  req:[["Unstable Lead",13]]}]},
    {id:"mi-got-em",      name:"Got Em",             requires:"mi-bad-step",      col:3,row:1,ranks:[{name:"Got Em",          fx:"Unlocks Trap Packs",               cr:1500, req:[["Dynamic Compounds",19],["Surveillance Lens",9]]}]},
    {id:"mi-survivor",    name:"Survivor",           requires:null,               col:4,row:1,ranks:[
      {name:"Survivor",        fx:"Unlocks Survivor Kit V2 implant", cr:1500, req:[["Surveillance Lens",13],["Unstable Lead",9]]},
      {name:"Survivor+",       fx:"Unlocks Survivor Kit V3 implant", cr:1500, req:[["Thoughtwave Lens",6],["Dynamic Compounds",11]]},
      {name:"Survivor++",      fx:"Unlocks Survivor Kit V4 implant", cr:3500, req:[["Biolens Seed",10],["Ballistic Turbine",3]]},
    ]},
    {id:"mi-graceful",    name:"Graceful",           requires:null,               col:5,row:1,ranks:[
      {name:"Graceful",        fx:"Unlocks Graceful Landing V2 implant",cr:1500,req:[["Surveillance Lens",9],["Unstable Lead",5]]},
      {name:"Graceful+",       fx:"Unlocks Graceful Landing V3 implant",cr:2000,req:[["Thoughtwave Lens",8],["Dynamic Compounds",26]]},
      {name:"Graceful++",      fx:"Unlocks Graceful Landing V4 implant",cr:3500,req:[["Biolens Seed",8],["Ballistic Turbine",3]]},
    ]},
    {id:"mi-sprinter",    name:"Sprinter",           requires:null,               col:6,row:1,ranks:[
      {name:"Sprinter",        fx:"Unlocks Bionic Legs V2 implant",   cr:750,  req:[["Unstable Lead",13]]},
      {name:"Sprinter+",       fx:"Unlocks Bionic Legs V3 implant",   cr:1500, req:[["Thoughtwave Lens",5],["Dynamic Compounds",8]]},
      {name:"Sprinter++",      fx:"Unlocks Bionic Legs V4 implant",   cr:3500, req:[["Biolens Seed",10],["Ballistic Turbine",3]]},
    ]},
    {id:"mi-spare-rounds",name:"Spare Rounds",       requires:"mi-bad-step",      col:2,row:2,ranks:[
      {name:"Spare Rounds 1",  fx:"Unlocks Ammo Crates",              cr:1500, req:[["Dynamic Compounds",19],["Surveillance Lens",9]]},
      {name:"Spare Rounds 2",  fx:"Unlocks Advanced Ammo Crates",     cr:2000, req:[["Volatile Compounds",6],["Surveillance Lens",16]]},
    ]},
    {id:"mi-hot-potato",  name:"Hot Potato",         requires:null,               col:1,row:3,ranks:[{name:"Hot Potato",      fx:"Unlocks Heat Grenades",            cr:750,  req:[["Unstable Lead",16]]}]},
    {id:"mi-explosives",  name:"Explosives",         requires:"mi-hot-potato",    col:2,row:3,ranks:[{name:"Explosives",      fx:"Unlocks Frag Grenades",            cr:750,  req:[["Unstable Lead",16]]}]},
    {id:"mi-lights-out",  name:"Lights Out",         requires:"mi-explosives",    col:3,row:3,ranks:[{name:"Lights Out",      fx:"Unlocks EMP Grenades",             cr:2000, req:[["Volatile Compounds",6],["Surveillance Lens",16]]}]},
    {id:"mi-av-packs",    name:"Anti-Virus Packs",   requires:null,               col:4,row:3,ranks:[{name:"Anti-Virus Packs",fx:"Unlocks Anti-Virus Packs",        cr:1500, req:[["Unstable Lead",23]]}]},
    {id:"mi-anti-virus",  name:"Anti Virus",         requires:"mi-av-packs",      col:5,row:3,ranks:[
      {name:"ANTI_VIRUS.EXE 1",fx:"Active Anti-Virus Protection +40s",cr:1500,req:[["Surveillance Lens",28],["Dynamic Compounds",10]]},
      {name:"ANTI_VIRUS.EXE 2",fx:"Active Anti-Virus Protection +40s",cr:2000,req:[["Thoughtwave Lens",12],["Volatile Compounds",4]]},
      {name:"ANTI_VIRUS.EXE 3",fx:"Active Anti-Virus Protection +40s",cr:5000,req:[["Hazard Capsule",2]]},
    ]},
    {id:"mi-bullseye",    name:"Bullseye",           requires:"mi-hot-potato",    col:1,row:4,ranks:[{name:"Bullseye",        fx:"Unlocks Flechette Grenades",       cr:1500, req:[["Dynamic Compounds",15],["Surveillance Lens",8]]}]},
    {id:"mi-chemist",     name:"Chemist",            requires:"mi-explosives",    col:2,row:4,ranks:[{name:"Chemist",         fx:"Unlocks Chem Grenades",            cr:1500, req:[["Volatile Compounds",4],["Surveillance Lens",10]]}]},
    {id:"mi-flex-matrix", name:"Flex Matrix",        requires:null,               col:3,row:4,ranks:[
      {name:"FLEX_MATRIX.EXE 1",fx:"Agility +20",                    cr:750,  req:[["Unstable Lead",16]]},
      {name:"FLEX_MATRIX.EXE 2",fx:"Agility +20",                    cr:1500, req:[["Surveillance Lens",28],["Dynamic Compounds",10]]},
      {name:"FLEX_MATRIX.EXE 3",fx:"Agility +20",                    cr:2000, req:[["Thoughtwave Lens",8],["Dynamic Compounds",26]]},
    ]},
    {id:"mi-cardio-kick", name:"Cardio Kick",        requires:"mi-flex-matrix",   col:4,row:4,ranks:[{name:"Cardio Kick",     fx:"Unlocks Cardio Kicks",             cr:1500, req:[["Thoughtwave Lens",4],["Dynamic Compounds",7]]}]},
    {id:"mi-full-throttle",name:"Full Throttle",     requires:"mi-cardio-kick",   col:5,row:4,ranks:[{name:"FULL_THROTTLE.EXE",fx:"Cardio Kick effect at start of run",cr:5000,req:[["Alien Alloy",3],["Ballistic Turbine",11]]}]},
    {id:"mi-cloud-cover", name:"Cloud Cover",        requires:null,               col:6,row:4,ranks:[{name:"CLOUD_COVER.EXE", fx:"Smoke cloud on exfil site activation",cr:5000,req:[["Hazard Capsule",3],["Biolens Seed",12]]}]},
  ]},
  Arachne: {accent:"#B80B0E",rep:"Charter",tag:"PvP · Melee · Weapons",cols:6,rows:4,nodes:[
    {id:"ar-lmg-mods",    name:"LMG Mods",           requires:null,               col:1,row:1,ranks:[{name:"LMG MODS",        fx:"Unlocks Enhanced LMG mod set",     cr:750,  req:[["Unstable Gel",13]]}]},
    {id:"ar-railgun-mods",name:"Railgun Mods",        requires:null,               col:2,row:1,ranks:[{name:"RAILGUN MODS",    fx:"Unlocks Enhanced railgun mod set",  cr:1500, req:[["Drone Resin",8],["Unstable Gel",9]]}]},
    {id:"ar-shotgun-mods",name:"Shotgun Mods",        requires:null,               col:3,row:1,ranks:[{name:"SHOTGUN MODS",    fx:"Unlocks Enhanced shotgun mod set",  cr:750,  req:[["Unstable Gel",18]]}]},
    {id:"ar-hard-strike", name:"Hard Strike",         requires:null,               col:4,row:1,ranks:[
      {name:"HARD_STRIKE.EXE 1",fx:"Melee Damage +20",               cr:1500, req:[["Drone Resin",7],["Unstable Gel",6]]},
      {name:"HARD_STRIKE.EXE 2",fx:"Melee Damage +20",               cr:2000, req:[["Biomata Resin",8],["Drone Node",22]]},
      {name:"HARD_STRIKE.EXE 3",fx:"Melee Damage +20",               cr:3500, req:[["Reflex Coil",6],["Biomata Node",6]]},
    ]},
    {id:"ar-knife-fight", name:"Knife Fight",         requires:null,               col:5,row:1,ranks:[
      {name:"KNIFE FIGHT",      fx:"Unlocks Knife Fight V2 implant", cr:750,  req:[["Unstable Gel",13]]},
      {name:"KNIFE FIGHT+",     fx:"Unlocks Knife Fight V3 implant", cr:1500, req:[["Drone Node",23],["Drone Resin",12]]},
      {name:"KNIFE FIGHT++",    fx:"Unlocks Knife Fight V4 implant", cr:3500, req:[["Enzyme Replicator",9],["Reflex Coil",3]]},
    ]},
    {id:"ar-hurting-hands",name:"Hurting Hands",      requires:null,               col:6,row:1,ranks:[
      {name:"HURTING HANDS",    fx:"Unlocks Hurting Hands V2 implant",cr:750, req:[["Unstable Gel",10]]},
      {name:"HURTING HANDS+",   fx:"Unlocks Hurting Hands V3 implant",cr:1500,req:[["Drone Node",19],["Drone Resin",9]]},
      {name:"HURTING HANDS++",  fx:"Unlocks Hurting Hands V4 implant",cr:3500,req:[["Enzyme Replicator",7],["Reflex Coil",3]]},
    ]},
    {id:"ar-mips-railgun",name:"MIPS Railgun",        requires:null,               col:2,row:2,ranks:[{name:"MIPS RAILGUN",    fx:"Unlocks ARES RG",                  cr:750,  req:[["Unstable Gel",13]]}]},
    {id:"ar-mips-shotgun",name:"MIPS Shotgun",        requires:null,               col:3,row:2,ranks:[{name:"MIPS SHOTGUN",    fx:"Unlocks WSTR Combat Shotgun",      cr:1500, req:[["Drone Resin",7],["Unstable Gel",8]]}]},
    {id:"ar-cutthroat",   name:"Cutthroat",           requires:null,               col:4,row:2,ranks:[
      {name:"CUTTHROAT.EXE 1",  fx:"Finisher Siphon +20",            cr:750,  req:[["Unstable Gel",16]]},
      {name:"CUTTHROAT.EXE 2",  fx:"Finisher Siphon +20",            cr:2000, req:[["Biomata Resin",12],["Biomata Node",4]]},
      {name:"CUTTHROAT.EXE 3",  fx:"Finisher Siphon +20",            cr:3500, req:[["Reflex Coil",7],["Enzyme Replicator",3]]},
    ]},
    {id:"ar-enh-retaliator",name:"Enh. Retaliator LMG",requires:null,             col:1,row:3,ranks:[{name:"Enh. Retaliator LMG",fx:"Unlocks Enhanced Retaliator LMG",cr:1500,req:[["Biomata Node",4],["Drone Resin",11]]}]},
    {id:"ar-enh-mips-railgun",name:"Enh. MIPS Railgun",requires:"ar-mips-railgun",col:2,row:3,ranks:[{name:"Enh. MIPS Railgun",fx:"Unlocks Enhanced ARES RG",        cr:2000, req:[["Biomata Resin",12],["Biomata Node",4]]}]},
    {id:"ar-enh-mips-shotgun",name:"Enh. MIPS Shotgun",requires:"ar-mips-shotgun",col:3,row:3,ranks:[{name:"Enh. MIPS Shotgun",fx:"Unlocks Enhanced WSTR Combat Shotgun",cr:2000,req:[["Biomata Node",6],["Drone Resin",18]]}]},
    {id:"ar-reboot",      name:"Reboot",              requires:null,               col:4,row:3,ranks:[
      {name:"REBOOT.EXE 1",     fx:"Revive Speed +20",               cr:1500, req:[["Drone Resin",19],["Unstable Gel",17]]},
      {name:"REBOOT.EXE 2",     fx:"Revive Speed +20",               cr:3500, req:[["Reflex Coil",5],["Biomata Node",5]]},
      {name:"REBOOT.EXE 3",     fx:"Revive Speed +20",               cr:5000, req:[["Synapse Cube",2],["Biomata Resin",9]]},
    ]},
    {id:"ar-dlx-retaliator",name:"Dlx. Retaliator LMG",requires:"ar-enh-retaliator",col:1,row:4,ranks:[{name:"Dlx. Retaliator LMG",fx:"Unlocks Deluxe Retaliator LMG",cr:3500,req:[["Enzyme Replicator",9],["Reflex Coil",3]]}]},
    {id:"ar-dlx-mips-railgun",name:"Dlx. MIPS Railgun",requires:"ar-enh-mips-railgun",col:2,row:4,ranks:[{name:"Dlx. MIPS Railgun",fx:"Unlocks Deluxe ARES RG",cr:5000,req:[["Hazard Capsule",2],["Enzyme Replicator",7]]}]},
    {id:"ar-dlx-mips-shotgun",name:"Dlx. MIPS Shotgun",requires:"ar-enh-mips-shotgun",col:3,row:4,ranks:[{name:"Dlx. MIPS Shotgun",fx:"Unlocks Deluxe WSTR Combat Shotgun",cr:5000,req:[["Synapse Cube",2],["Biomata Resin",9]]}]},
    {id:"ar-leech",       name:"Leech",               requires:null,               col:5,row:4,ranks:[{name:"LEECH.EXE",        fx:"Knife attacks restore health",     cr:5000, req:[["Synapse Cube",2]]}]},
    {id:"ar-heat-death",  name:"Heat Death",           requires:null,               col:6,row:4,ranks:[{name:"HEAT_DEATH.EXE",   fx:"Eliminating hostile reduces heat", cr:5000, req:[["Hazard Capsule",3],["Enzyme Replicator",11]]}]},
  ]},
  Sekiguchi: {accent:"#80ECB5",rep:"Nona",tag:"Cores · Implants · Energy",cols:6,rows:4,nodes:[
    {id:"sk-energy-amp",  name:"Energy Amp",          requires:null,               col:1,row:1,ranks:[{name:"Energy Amp",       fx:"Unlocks Energy Amps for purchase", cr:750,  req:[["Unstable Diode",10]]}]},
    {id:"sk-amped",       name:"Amped",               requires:"sk-energy-amp",    col:2,row:1,ranks:[{name:"Amped",            fx:"Free Daily Energy Amps in Armory", cr:1500, req:[["Fractal Circuit",23],["Storage Drive",9]]}]},
    {id:"sk-amp-stock",   name:"Amp Stock",           requires:"sk-amped",         col:3,row:1,ranks:[{name:"Amp Stock",        fx:"Energy Amp stock increased in Armory",cr:2000,req:[["Paradox Circuit",12],["Amygdala Drive",5]]}]},
    {id:"sk-scab-factory1",name:"Scab Factory",       requires:null,               col:4,row:1,ranks:[{name:"SCAB_FACTORY.EXE 1",fx:"DBNO Time +30s",                 cr:2000, req:[["Amygdala Drive",7],["Fractal Circuit",20]]}]},
    {id:"sk-scab-factory2",name:"Scab Factory",       requires:"sk-scab-factory1", col:5,row:1,ranks:[{name:"SCAB_FACTORY.EXE 2",fx:"DBNO Time +30s",                 cr:3500, req:[["Predictive Framework",9],["Neural Insulation",3]]}]},
    {id:"sk-lethal-amp",  name:"Lethal Amp",          requires:null,               col:6,row:1,ranks:[{name:"LETHAL_AMP.EXE",   fx:"Down→Tac energy · Elim→Prime energy",cr:3500,req:[["Predictive Framework",7],["Neural Insulation",3]]}]},
    {id:"sk-triage",      name:"Triage",              requires:null,               col:1,row:2,ranks:[{name:"Triage",           fx:"Unlocks 2 Enhanced Triage cores",  cr:1500, req:[["Storage Drive",8],["Unstable Diode",9]]}]},
    {id:"sk-destroyer",   name:"Destroyer",           requires:null,               col:2,row:2,ranks:[{name:"Destroyer",        fx:"Unlocks 2 Enhanced Destroyer cores",cr:1500,req:[["Fractal Circuit",8],["Unstable Diode",9]]}]},
    {id:"sk-assassin",    name:"Assassin",            requires:null,               col:3,row:2,ranks:[{name:"Assassin",         fx:"Unlocks 2 Enhanced Assassin cores",cr:1500, req:[["Storage Drive",8],["Unstable Diode",9]]}]},
    {id:"sk-vandal",      name:"Vandal",              requires:null,               col:4,row:2,ranks:[{name:"Vandal",           fx:"Unlocks 2 Enhanced Vandal cores",  cr:1500, req:[["Fractal Circuit",8],["Unstable Diode",9]]}]},
    {id:"sk-recon",       name:"Recon",               requires:null,               col:5,row:2,ranks:[{name:"Recon",            fx:"Unlocks 2 Enhanced Recon cores",   cr:1500, req:[["Storage Drive",8],["Unstable Diode",9]]}]},
    {id:"sk-thief",       name:"Thief",               requires:null,               col:6,row:2,ranks:[{name:"Thief",            fx:"Unlocks 2 Enhanced Thief cores",   cr:1500, req:[["Fractal Circuit",8],["Unstable Diode",9]]}]},
    {id:"sk-triage-plus", name:"Triage+",             requires:"sk-triage",        col:1,row:3,ranks:[{name:"Triage+",          fx:"Unlocks 2 Deluxe Triage cores",    cr:1500, req:[["Amygdala Drive",4],["Fractal Circuit",8]]}]},
    {id:"sk-destroyer-plus",name:"Destroyer+",        requires:"sk-destroyer",     col:2,row:3,ranks:[{name:"Destroyer+",       fx:"Unlocks 2 Deluxe Destroyer cores", cr:1500, req:[["Paradox Circuit",4],["Storage Drive",8]]}]},
    {id:"sk-assassin-plus",name:"Assassin+",          requires:"sk-assassin",      col:3,row:3,ranks:[{name:"Assassin+",        fx:"Unlocks 2 Deluxe Assassin cores",  cr:1500, req:[["Amygdala Drive",4],["Fractal Circuit",8]]}]},
    {id:"sk-vandal-plus", name:"Vandal+",             requires:"sk-vandal",        col:4,row:3,ranks:[{name:"Vandal+",          fx:"Unlocks 2 Deluxe Vandal cores",    cr:1500, req:[["Paradox Circuit",4],["Storage Drive",8]]}]},
    {id:"sk-recon-plus",  name:"Recon+",              requires:"sk-recon",         col:5,row:3,ranks:[{name:"Recon+",           fx:"Unlocks 2 Deluxe Recon cores",     cr:1500, req:[["Amygdala Drive",4],["Fractal Circuit",8]]}]},
    {id:"sk-thief-plus",  name:"Thief+",              requires:"sk-thief",         col:6,row:3,ranks:[{name:"Thief+",           fx:"Unlocks 2 Deluxe Thief cores",     cr:1500, req:[["Paradox Circuit",4],["Storage Drive",8]]}]},
    {id:"sk-harvester",   name:"Harvester",           requires:null,               col:1,row:4,ranks:[
      {name:"Harvester",       fx:"Unlocks Energy Harvesting V2 implant",cr:1500,req:[["Fractal Circuit",7],["Unstable Diode",6]]},
      {name:"Harvester+",      fx:"Unlocks Energy Harvesting V3 implant",cr:2000,req:[["Fractal Circuit",23],["Storage Drive",9]]},
      {name:"Harvester++",     fx:"Unlocks Energy Harvesting V4 implant",cr:3500,req:[["Neural Insulation",7],["Predictive Framework",3]]},
    ]},
    {id:"sk-capacitors",  name:"Capacitors",          requires:"sk-harvester",     col:2,row:4,ranks:[
      {name:"Capacitors",      fx:"Unlocks Augmented Capacitors V2 implant",cr:1500,req:[["Storage Drive",10],["Unstable Diode",10]]},
      {name:"Capacitors+",     fx:"Unlocks Augmented Capacitors V3 implant",cr:2000,req:[["Amygdala Drive",8],["Fractal Circuit",13]]},
      {name:"Capacitors++",    fx:"Unlocks Augmented Capacitors V4 implant",cr:3500,req:[["Predictive Framework",9],["Neural Insulation",3]]},
    ]},
    {id:"sk-tac-amp",     name:"Tac Amp",             requires:null,               col:3,row:4,ranks:[
      {name:"TAC_AMP.EXE 1",   fx:"Tactical Recovery +30",           cr:750,  req:[["Unstable Diode",16]]},
      {name:"TAC_AMP.EXE 2",   fx:"Tactical Recovery +30",           cr:2000, req:[["Paradox Circuit",8],["Storage Drive",30]]},
    ]},
    {id:"sk-prime-amp",   name:"Prime Amp",           requires:"sk-tac-amp",       col:4,row:4,ranks:[
      {name:"PRIME_AMP.EXE 1", fx:"Prime Recovery +30",              cr:5000, req:[["Synapse Cube",2]]},
      {name:"PRIME_AMP.EXE 2", fx:"Prime Recovery +30",              cr:5000, req:[["Synapse Cube",3],["Predictive Framework",3]]},
    ]},
    {id:"sk-head-start",  name:"Head Start",          requires:null,               col:5,row:4,ranks:[
      {name:"HEAD_START.EXE 1",fx:"Partial tactical charge at run start",cr:1500,req:[["Storage Drive",10],["Unstable Diode",10]]},
      {name:"HEAD_START.EXE 2",fx:"Full tactical charge at run start",cr:2000, req:[["Amygdala Drive",7],["Fractal Circuit",20]]},
    ]},
    {id:"sk-primed",      name:"Primed",              requires:"sk-head-start",    col:6,row:4,ranks:[
      {name:"PRIMED.EXE 1",    fx:"Partial prime charge at run start",cr:5000, req:[["Alien Alloy",2],["Neural Insulation",7]]},
      {name:"PRIMED.EXE 2",    fx:"Full prime charge at run start",   cr:5000, req:[["Alien Alloy",3],["Neural Insulation",11]]},
    ]},
  ]},
};
