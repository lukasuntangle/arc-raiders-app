// Parse recycle data from wiki text and update items.json

const fs = require('fs');
const path = require('path');

// Raw wiki data (extracted from page text)
const wikiText = `Acoustic Guitar Legendary 4× Metal Parts6× Wires 7,000 1 Quick Use — —
Adrenaline Shot Common 1× Chemicals1× Plastic Parts 300 5 Quick Use — —
Advanced ARC Powercell Rare 2× ARC Powercell 640 5 Topside Material — —
Advanced Electrical Components Rare 1× Electrical Components1× Wires 1,750 5 Refined Material — Gear Bench 3 (5×)Utility Station 3 (5×)
Advanced Mechanical Components Rare 1× Mechanical Components1× Steel Spring 1,750 5 Refined Material — Gunsmith 3 (5×)
Agave Uncommon 3× Assorted Seeds 1,000 10 Nature — —
Agave Juice Common Cannot be recycled 1,800 5 Quick Use — —
Air Freshener Uncommon Cannot be recycled 2,000 5 Trinket — —
Alarm Clock Rare 1× Processor6× Plastic Parts 1,000 3 Recyclable — —
Angled Grip I Common 6× Plastic Parts 640 1 Mods — —
Angled Grip II Uncommon 1× Duct Tape1× Mechanical Components 2,000 1 Mods — —
Angled Grip III Rare 1× Mod Components2× Duct Tape 5,000 1 Mods — —
Antiseptic Rare 10× Chemicals 1,000 5 Refined Material Doctor's Orders (2×) Medical Lab 3 (8×)
Anvil Splitter Legendary 1× Mod Components1× Processor 7,000 1 Mods — —
Apricot Uncommon 3× Assorted Seeds 640 10 Nature — Scrappy 3 (3×)Scrappy 5 (12×)
ARC Alloy Uncommon 2× Metal Parts 200 15 Topside Material Clearer Skies (3×) Explosives Station 1 (6×)Medical Lab 1 (6×)Utility Station 1 (6×)
ARC Circuitry Rare 2× ARC Alloy 1,000 5 Topside Material — Refiner 3 (10×)
ARC Coolant Rare 16× Chemicals 1,000 3 Recyclable — —
ARC Flex Rubber Rare 16× Rubber Parts 1,000 3 Recyclable — —
ARC Motion Core Rare 2× ARC Alloy 1,000 5 Topside Material — Refiner 2 (5×)
ARC Performance Steel Rare 12× Metal Parts 1,000 3 Recyclable — —
ARC Powercell Common Cannot be recycled 270 5 Topside Material — Refiner 1 (5×)
ARC Synthetic Resin Rare 14× Plastic Parts 1,000 3 Recyclable — —
ARC Thermo Lining Rare 16× Fabric 1,000 3 Recyclable — —
Assorted Seeds Common Cannot be recycled 100 100 Nature — —
Bandage Common 2× Fabric 250 5 Quick Use — —
Barricade Kit Uncommon 4× Metal Parts 640 3 Quick Use — —
Bastion Cell Epic 2× Advanced Mechanical Components2× ARC Alloy 5,000 3 Recyclable — Gear Bench 3 (6×)
Battery Uncommon 2× Metal Parts 250 15 Topside Material After Rain Comes (2×)Trash Into Treasure (1×) —
Bicycle Pump Rare 10× Metal Parts4× Canister 2,000 3 Recyclable — —
Binoculars Common 2× Rubber Parts4× Plastic Parts 640 1 Quick Use — —
Blaze Grenade Rare 2× Oil4× Metal Parts 1,600 5 Quick Use — —
Bloated Tuna Can Common Cannot be recycled 1,000 15 Trinket — —
Bombardier Cell Epic 2× Advanced Mechanical Components2× ARC Alloy 5,000 3 Recyclable — Refiner 3 (6×)
Breathtaking Snow Globe Epic Cannot be recycled 7,000 1 Trinket — —
Broken Flashlight Rare 2× Battery6× Metal Parts 1,000 3 Recyclable — —
Broken Guidance System Rare 4× Processor 2,000 3 Recyclable — —
Broken Handheld Radio Rare 2× Wires3× Sensors 2,000 3 Recyclable — —
Broken Taser Rare 2× Battery2× Wires 1,000 3 Recyclable — —
Burned ARC Circuitry Uncommon 2× ARC Alloy 640 5 Recyclable — —
Camera Lens Uncommon 8× Plastic Parts 640 5 Recyclable — —
Candle Holder Uncommon 8× Metal Parts 640 3 Recyclable — —
Candleberries Rare 2× Assorted Seeds 460 10 Nature — —
Canister Uncommon 3× Plastic Parts 300 15 Topside Material — —
Cat Bed Uncommon Cannot be recycled 1,000 3 Trinket — Scrappy 4 (1×)
Chemicals Common Cannot be recycled 50 50 Basic Material — Explosives Station 1 (50×)
Coffee Pot Common Cannot be recycled 1,000 3 Trinket — —
Combat Mk. 1 Uncommon 3× Plastic Parts3× Rubber Parts 640 1 Augment — —
Combat Mk. 2 Rare 1× Electrical Components1× Magnet 2,000 1 Augment — —
Combat Mk. 3 (Aggressive) Epic 1× Advanced Electrical Components1× Processor 5,000 1 Augment — —
Combat Mk. 3 (Flanking) Epic 1× Advanced Electrical Components1× Processor 5,000 1 Augment — —
Compensator I Common 5× Metal Parts 640 1 Mods — —
Compensator II Uncommon 1× Mechanical Components1× Wires 2,000 1 Mods — —
Compensator III Rare 1× Mod Components2× Wires 5,000 1 Mods — —
Complex Gun Parts Epic 3× Simple Gun Parts 3,000 3 Topside Material — —
Coolant Rare 2× Oil5× Chemicals 1,000 3 Recyclable — —
Cooling Coil Rare 2× Steel Spring6× Chemicals 1,000 3 Recyclable — —
Cooling Fan Rare 14× Plastic Parts4× Wires 2,000 3 Recyclable — —
Cracked Bioscanner Rare 3× Battery3× Rubber Parts 1,000 3 Recyclable — Medical Lab 2 (2×)
Crude Explosives Uncommon 3× Chemicals 270 10 Refined Material — Explosives Station 2 (5×)
Crumpled Plastic Bottle Uncommon 4× Plastic Parts 270 3 Recyclable — —
Damaged ARC Motion Core Uncommon 2× ARC Alloy 640 5 Recyclable — —
Damaged ARC Powercell Common 1× ARC Alloy 293 5 Recyclable — —
Damaged Fireball Burner Common 1× ARC Alloy 270 3 Recyclable — —
Damaged Heat Sink Rare 2× Wires6× Metal Parts 1,000 3 Recyclable — Utility Station 2 (2×)
Damaged Hornet Driver Common 2× ARC Alloy 640 3 Recyclable — —
Damaged Leaper Pulse Unit Common 3× ARC Alloy 2,000 3 Recyclable — —
Damaged Rocketeer Driver Common 3× ARC Alloy 2,000 3 Recyclable — —
Damaged Snitch Scanner Common Cannot be recycled 659 3 Recyclable — —
Damaged Tick Pod Common 1× ARC Alloy 270 3 Recyclable — —
Damaged Wasp Driver Common 1× ARC Alloy 270 3 Recyclable — —
Dart Board Uncommon Cannot be recycled 2,000 3 Trinket — —
Deadline Epic 1× ARC Circuitry1× Explosive Compound 5,000 1 Quick Use — —
Defibrillator Rare 1× Moss1× Plastic Parts 1,000 3 Quick Use — —
Deflated Football Uncommon 9× Fabric9× Rubber Parts 1,000 3 Recyclable — —
Degraded ARC Rubber Uncommon 11× Rubber Parts 640 3 Recyclable — —
Diving Goggles Rare 12× Rubber Parts 640 3 Recyclable — —
Dog Collar Rare 1× Metal Parts8× Fabric 640 3 Recyclable — Scrappy 2 (1×)
Door Blocker Common 2× Metal Parts 270 3 Quick Use — —
Dried-Out ARC Resin Uncommon 9× Plastic Parts 640 3 Recyclable — —
Duct Tape Uncommon 3× Fabric 300 15 Topside Material — —
Durable Cloth Uncommon 6× Fabric 640 10 Refined Material Doctor's Orders (1×) Medical Lab 2 (5×)
Electrical Components Uncommon 3× Plastic Parts3× Rubber Parts 640 10 Refined Material — Gear Bench 2 (5×)Utility Station 2 (5×)
Empty Wine Bottle Common Cannot be recycled 1,000 5 Trinket — —
Exodus Modules Epic 2× Magnet2× Processor 2,750 3 Topside Material — —
Expired Pasta Common Cannot be recycled 1,000 15 Trinket — —
Expired Respirator Rare 4× Fabric8× Rubber Parts 640 3 Recyclable — —
Explosive Compound Rare 2× Crude Explosives 1,000 5 Refined Material — Explosives Station 3 (5×)
Explosive Mine Rare 1× Sensors2× Oil 1,500 3 Quick Use — —
Extended Barrel Epic 1× Mod Components1× Wires 5,000 1 Mods — —
Extended Light Mag I Common 6× Plastic Parts 640 1 Mods — —
Extended Light Mag II Uncommon 1× Mechanical Components1× Steel Spring 2,000 1 Mods — —
Extended Light Mag III Rare 1× Mod Components2× Steel Spring 5,000 1 Mods — —
Extended Medium Mag I Common 6× Plastic Parts 640 1 Mods — —
Extended Medium Mag II Uncommon 1× Mechanical Components1× Steel Spring 2,000 1 Mods — —
Extended Medium Mag III Rare 1× Mod Components2× Steel Spring 5,000 1 Mods — —
Extended Shotgun Mag I Common 6× Plastic Parts 640 1 Mods — —
Extended Shotgun Mag II Uncommon 1× Mechanical Components1× Steel Spring 2,000 1 Mods — —
Extended Shotgun Mag III Rare 1× Mod Components2× Steel Spring 5,000 1 Mods — —
Fabric Common Cannot be recycled 50 50 Basic Material — Gear Bench 1 (30×)Medical Lab 1 (50×)
Faded Photograph Common Cannot be recycled 640 15 Trinket — —
Fertilizer Uncommon 2× Assorted Seeds 1,000 5 Nature — —
Film Reel Rare Cannot be recycled 2,000 3 Trinket — —
Fine Wristwatch Rare Cannot be recycled 3,000 3 Trinket — —
Fireball Burner Uncommon 1× ARC Alloy1× Chemicals 640 3 Recyclable — Refiner 2 (8×)
Firecracker Common 3× Plastic Parts 270 5 Quick Use — —
Fireworks Box Rare 1× Explosive Compound 2,000 1 Quick Use — —
Flame Spray Uncommon 1× Canister1× Fireball Burner 2,000 1 Quick Use — —
Flow Controller Rare 1× Advanced Mechanical Components1× Sensors 3,000 3 Recyclable Snap And Salvage (1×) —
Fossilized Lightning Epic 3× Explosive Compound 4,000 1 Nature — —
Free Loadout Augment Common Cannot be recycled 100 1 Augment — —
Frequency Modulation Box Rare 1× Advanced Electrical Components1× Speaker Component 3,000 3 Recyclable — —
Fried Motherboard Rare 2× Electrical Components5× Plastic Parts 2,000 3 Recyclable — Utility Station 3 (3×)
Fruit Mix Uncommon Cannot be recycled 1,800 5 Quick Use — —
Frying Pan Rare 8× Metal Parts 640 3 Recyclable — —
Garlic Press Uncommon 12× Metal Parts 1,000 3 Recyclable — —
Gas Grenade Common 1× Chemicals1× Rubber Parts 270 3 Quick Use — —
Gas Mine Common 1× Chemicals1× Rubber Parts 270 3 Quick Use — —
Geiger Counter Epic 1× Exodus Modules3× Battery 3,500 3 Recyclable — —
Great Mullein Uncommon 2× Assorted Seeds 300 15 Topside Material Doctor's Orders (1×) —
Headphones Rare 1× Speaker Component7× Rubber Parts 1,000 3 Recyclable — —
Heavy Ammo Common Cannot be recycled 12 40 Ammunition — —
Heavy Fuze Grenade Rare 1× Oil2× Rubber Parts 1,600 3 Quick Use — —
Heavy Gun Parts Rare 2× Simple Gun Parts 700 5 Topside Material — —
Heavy Shield Epic 1× Voltage Converter2× ARC Circuitry 5,500 1 Shield — —
Herbal Bandage Uncommon 2× Assorted Seeds5× Fabric 900 5 Quick Use — —
Horizontal Grip Epic 1× Mod Components2× Duct Tape 7,000 1 Mods — —
Hornet Driver Rare 2× ARC Alloy2× Electrical Components 2,000 3 Recyclable The Trifecta (2×) Gear Bench 2 (5×)
Household Cleaner Uncommon 11× Chemicals 640 3 Recyclable — —
Humidifier Rare 2× Canister2× Wires 1,000 3 Recyclable — —
Ice Cream Scooper Uncommon 7× Metal Parts 640 3 Recyclable — —
Impure ARC Coolant Uncommon 12× Chemicals 640 3 Recyclable — —
Industrial Battery Rare 2× Battery7× Chemicals 1,000 3 Recyclable — Gear Bench 3 (3×)
Industrial Charger Rare 1× Voltage Converter5× Metal Parts 1,000 3 Recyclable — —
Industrial Magnet Rare 2× Magnet4× Metal Parts 1,000 3 Recyclable — —
Ion Sputter Epic 1× Exodus Modules4× Voltage Converter 6,000 3 Recyclable — —
Jolt Mine Rare 1× Battery2× Plastic Parts 850 3 Quick Use — —
Kinetic Converter Legendary 1× Mod Components2× Duct Tape 7,000 1 Mods — —
Laboratory Reagents Rare 16× Chemicals3× Crude Explosives 2,000 3 Recyclable — Explosives Station 3 (3×)
Lance's Mixtape (5th Edition) Epic Cannot be recycled 10,000 3 Trinket — —
Launcher Ammo Rare Cannot be recycled 250 24 Ammunition — —
Leaper Pulse Unit Epic 2× Advanced Mechanical Components3× ARC Alloy 5,000 3 Recyclable Into The Fray (1×) Utility Station 3 (4×)
Lemon Uncommon 3× Assorted Seeds 640 10 Nature — Scrappy 3 (3×)
Li'l Smoke Grenade Common 1× Chemicals1× Plastic Parts 300 5 Quick Use — —
Light Ammo Common Cannot be recycled 4 100 Ammunition — —
Light Bulb Uncommon Cannot be recycled 2,000 3 Trinket — —
Light Gun Parts Rare 2× Simple Gun Parts 700 5 Topside Material — —
Light Impact Grenade Common 1× Chemicals1× Plastic Parts 270 5 Quick Use — —
Light Shield Uncommon 4× Plastic Parts 640 1 Shield — —
Light Stick Common 1× Chemicals 150 5 Quick Use — —
Lightweight Stock Epic 1× Duct Tape1× Mod Components 5,000 1 Mods — —
Looting Mk. 1 Uncommon 3× Plastic Parts3× Rubber Parts 640 1 Augment — —
Looting Mk. 2 Rare 1× Electrical Components1× Magnet 2,000 1 Augment — —
Looting Mk. 3 (Cautious) Epic 1× Advanced Electrical Components1× Processor 5,000 1 Augment — —
Looting Mk. 3 (Survivor) Epic 1× Advanced Electrical Components1× Processor 5,000 1 Augment — —
Lure Grenade Uncommon 1× Speaker Component 1,000 3 Quick Use — —
Magnet Uncommon 2× Metal Parts 300 15 Topside Material — —
Magnetic Accelerator Epic 1× Advanced Mechanical Components1× ARC Motion Core 5,500 3 Refined Material — —
Magnetron Epic 1× Magnetic Accelerator1× Steel Spring 6,000 3 Recyclable Snap And Salvage (1×) —
Matriarch Reactor Legendary 1× Magnetic Accelerator1× Power Rod 13,000 1 Recyclable — —
Mechanical Components Uncommon 2× Rubber Parts3× Metal Parts 640 10 Refined Material — Gunsmith 2 (5×)
Medium Ammo Common Cannot be recycled 6 80 Ammunition — —
Medium Gun Parts Rare 2× Simple Gun Parts 700 5 Topside Material — —
Medium Shield Rare 1× ARC Circuitry 2,000 1 Shield — —
Metal Brackets Uncommon 8× Metal Parts 640 3 Recyclable — —
Metal Parts Common Cannot be recycled 75 50 Basic Material — Gunsmith 1 (20×)Refiner 1 (60×)
Microscope Rare 1× Advanced Mechanical Components3× Magnet 3,000 3 Recyclable — —
Mini Centrifuge Rare 1× Advanced Mechanical Components2× Canister 3,000 3 Recyclable — —
Mod Components Rare 1× Mechanical Components1× Steel Spring 1,750 5 Refined Material — —
Moss Rare 3× Assorted Seeds 500 10 Topside Material — —
Motor Rare 2× Mechanical Components2× Oil 2,000 3 Recyclable — Refiner 3 (3×)
Mushroom Uncommon Cannot be recycled 1,000 10 Nature — Scrappy 5 (12×)
Music Album Rare Cannot be recycled 3,000 3 Trinket — —
Music Box Rare Cannot be recycled 5,000 3 Trinket — —
Muzzle Brake I Common 5× Metal Parts 640 1 Mods — —
Muzzle Brake II Uncommon 1× Mechanical Components1× Wires 2,000 1 Mods — —
Muzzle Brake III Rare 1× Mod Components2× Wires 5,000 1 Mods — —
Noisemaker Common 1× Speaker Component 640 3 Quick Use — —
Number Plate Uncommon 3× Metal Parts 270 3 Recyclable — —
Oil Uncommon 3× Chemicals 300 15 Topside Material — —
Olives Uncommon 2× Assorted Seeds 640 10 Nature — Scrappy 4 (6×)
Padded Stock Epic 1× Duct Tape1× Mod Components 5,000 1 Mods — —
Painted Box Common Cannot be recycled 2,000 3 Trinket — —
Photoelectric Cloak Epic 1× Advanced Electrical Components1× Speaker Component 5,000 1 Quick Use — —
Plastic Parts Common Cannot be recycled 60 50 Basic Material — Gear Bench 1 (25×)Utility Station 1 (50×)
Playing Cards Rare Cannot be recycled 5,000 3 Trinket — —
Polluted Air Filter Rare 2× Oil6× Fabric 1,000 3 Recyclable — —
Pop Trigger Uncommon 1× ARC Alloy1× Crude Explosives 640 3 Recyclable — Explosives Station 2 (5×)
Portable TV Rare 2× Battery6× Wires 2,000 1 Recyclable — —
Poster Of Natural Wonders Uncommon Cannot be recycled 2,000 3 Trinket — —
Pottery Uncommon Cannot be recycled 2,000 3 Trinket — —
Power Bank Rare 2× Battery2× Wires 1,000 3 Recyclable — —
Power Cable Rare 4× Wires 1,000 3 Recyclable — Gear Bench 2 (3×)
Power Rod Epic 1× Advanced Electrical Components1× ARC Circuitry 5,000 3 Refined Material — —
Prickly Pear Uncommon 3× Assorted Seeds 640 10 Nature — Scrappy 4 (6×)
Processor Rare 1× Plastic Parts1× Wires 500 5 Topside Material — —
Projector Rare 1× Processor2× Wires 1,000 3 Recyclable — —
Pulse Mine Uncommon 6× Chemicals 470 3 Quick Use — —
Queen Reactor Legendary 1× Magnetic Accelerator1× Power Rod 13,000 1 Recyclable — —
Radio Rare 1× Sensors1× Speaker Component 1,000 3 Recyclable — —
Radio Relay Rare 2× Sensors2× Speaker Component 3,000 3 Recyclable — —
Raider Hatch Key Rare Cannot be recycled 2,000 1 Key — —
Recorder Uncommon 10× Plastic Parts 1,000 1 Quick Use — —
Red Coral Jewelry Rare Cannot be recycled 5,000 3 Trinket — —
Remote Control Rare 1× Sensors7× Plastic Parts 1,000 3 Recyclable — —
Remote Raider Flare Common 1× Chemicals1× Rubber Parts 270 3 Quick Use — —
Resin Common Cannot be recycled 1,000 10 Nature — —
Ripped Safety Vest Uncommon 1× Durable Cloth1× Magnet 1,000 3 Recyclable — —
Rocket Thruster Rare 2× Synthesized Fuel6× Metal Parts 2,000 3 Recyclable — —
Rocketeer Driver Epic 2× Advanced Electrical Components3× ARC Alloy 5,000 3 Recyclable Out Of The Shadows (1×) Explosives Station 3 (3×)
Roots Uncommon 1× Assorted Seeds 640 10 Nature — —
Rope Rare 5× Fabric 500 5 Topside Material — —
Rosary Rare Cannot be recycled 2,000 3 Trinket — —
Rotary Encoder Rare 2× Electrical Components2× Processor 3,000 3 Recyclable — —
Rubber Duck Common Cannot be recycled 1,000 15 Trinket — —
Rubber Pad Rare 18× Rubber Parts 1,000 3 Recyclable — —
Rubber Parts Common Cannot be recycled 50 50 Basic Material — Gunsmith 1 (30×)
Ruined Accordion Rare 18× Rubber Parts3× Steel Spring 2,000 3 Recyclable — —
Ruined Augment Common 2× Plastic Parts2× Rubber Parts 270 1 Recyclable — —
Ruined Baton Uncommon 3× Rubber Parts6× Metal Parts 640 3 Recyclable — —
Ruined Handcuffs Uncommon 8× Metal Parts 640 3 Recyclable — —
Ruined Parachute Uncommon 10× Fabric 640 3 Recyclable — —
Ruined Riot Shield Rare 10× Plastic Parts6× Rubber Parts 1,000 3 Recyclable — —
Ruined Tactical Vest Uncommon 1× Magnet5× Fabric 640 3 Recyclable — —
Rusted Bolts Uncommon 8× Metal Parts 640 3 Recyclable — —
Rusted Gear Rare 2× Mechanical Components4× Metal Parts 2,000 3 Recyclable — Gunsmith 3 (3×)
Rusted Shut Medical Kit Rare 1× Antiseptic2× Syringe 2,000 3 Recyclable — Medical Lab 3 (3×)
Rusted Tools Rare 1× Steel Spring8× Metal Parts 1,000 3 Recyclable — Gunsmith 2 (3×)
Rusty ARC Steel Uncommon 8× Metal Parts 640 3 Recyclable — —
Sample Cleaner Rare 14× Assorted Seeds2× Electrical Components 3,000 3 Recyclable — —
Seeker Grenade Uncommon 1× Crude Explosives 640 5 Quick Use — —
Sensors Rare 1× Metal Parts1× Wires 500 5 Topside Material — —
Sentinel Firing Core Rare 2× ARC Alloy3× Mechanical Components 3,000 3 Recyclable — Gunsmith 3 (4×)
Shaker Uncommon 10× Plastic Parts 1,000 1 Quick Use — —
Shield Recharger Uncommon 4× Rubber Parts 520 5 Quick Use — —
Shotgun Choke I Common 5× Metal Parts 640 1 Mods — —
Shotgun Choke II Uncommon 1× Mechanical Components1× Wires 2,000 1 Mods — —
Shotgun Choke III Rare 1× Mod Components2× Wires 5,000 1 Mods — —
Shotgun Silencer Epic 1× Mod Components1× Wires 5,000 1 Mods — —
Showstopper Rare 1× Electrical Components2× Battery 2,200 5 Quick Use — —
Shrapnel Grenade Uncommon 1× Crude Explosives1× Metal Parts 800 5 Quick Use — —
Shredder Gyro Rare 3× ARC Alloy3× Mechanical Components 3,000 3 Recyclable — —
Signal Amplifier Rare 2× Electrical Components2× Voltage Converter 3,000 3 Recyclable — —
Silencer I Uncommon 1× Mechanical Components1× Wires 2,000 1 Mods — —
Silencer II Rare 1× Mod Components2× Wires 5,000 1 Mods — —
Silencer III Epic 1× Mod Components3× Wires 7,000 1 Mods — —
Silver Teaspoon Set Rare Cannot be recycled 3,000 3 Trinket — —
Simple Gun Parts Uncommon 2× Metal Parts 330 10 Topside Material — —
Smoke Grenade Rare 1× Canister2× Chemicals 1,000 5 Quick Use — —
Snap Blast Grenade Uncommon 1× Chemicals1× Magnet 800 3 Quick Use — —
Snap Hook Legendary 1× Power Rod3× Rope 14,000 1 Quick Use — —
Snitch Scanner Uncommon 1× ARC Alloy2× Electrical Components 2,000 3 Recyclable The Trifecta (2×) Utility Station 2 (6×)
Speaker Component Rare 2× Plastic Parts3× Rubber Parts 500 5 Topside Material — —
Spectrometer Rare 1× Advanced Electrical Components1× Sensors 3,000 3 Recyclable — —
Spectrum Analyzer Epic 1× Exodus Modules1× Sensors 3,500 3 Recyclable — —
Spotter Relay Uncommon 1× ARC Alloy2× Electrical Components 2,000 3 Recyclable — —
Spring Cushion Rare 2× Durable Cloth2× Steel Spring 2,000 3 Recyclable — —
Stable Stock I Common 6× Rubber Parts 640 1 Mods — —
Stable Stock II Uncommon 1× Duct Tape1× Mechanical Components 2,000 1 Mods — —
Stable Stock III Rare 1× Mod Components2× Duct Tape 5,000 1 Mods — —
Statuette Rare Cannot be recycled 3,000 3 Trinket — —
Steel Spring Uncommon 2× Metal Parts 300 15 Topside Material — —
Sterilized Bandage Rare 1× Antiseptic1× Fabric 2,000 3 Quick Use — —
Surge Shield Recharger Rare 1× Electrical Components 1,200 5 Quick Use — —
Surveyor Vault Rare 2× ARC Alloy2× Mechanical Components 2,000 3 Recyclable Mixed Signals (1×) Medical Lab 3 (5×)
Synthesized Fuel Rare 1× Oil1× Plastic Parts 700 5 Topside Material — Explosives Station 2 (3×)
Syringe Rare 2× Chemicals3× Plastic Parts 500 5 Topside Material Doctor's Orders (1×) —
Tactical Mk. 1 Uncommon 3× Plastic Parts3× Rubber Parts 640 1 Augment — —
Tactical Mk. 2 Rare 1× Electrical Components1× Magnet 2,000 1 Augment — —
Tactical Mk. 3 (Defensive) Epic 1× Advanced Electrical Components1× Processor 5,000 1 Augment — —
Tactical Mk. 3 (Healing) Epic 1× Advanced Electrical Components1× Processor 5,000 1 Augment — —
Tagging Grenade Rare 1× Plastic Parts1× Sensors 1,000 3 Quick Use — —
Tattered ARC Lining Uncommon 12× Fabric 640 3 Recyclable — —
Tattered Clothes Uncommon 11× Fabric 640 3 Recyclable — —
Telemetry Transceiver Rare 1× Advanced Electrical Components1× Processor 3,000 3 Recyclable — —
Thermostat Rare 1× Sensors7× Rubber Parts 1,000 3 Recyclable — —
Tick Pod Uncommon 2× ARC Alloy2× Chemicals 640 3 Recyclable — Medical Lab 2 (8×)
Toaster Rare 3× Wires5× Plastic Parts 1,000 3 Recyclable — Refiner 2 (3×)
Torn Blanket Rare 12× Fabric 640 3 Recyclable — —
Torn Book Common Cannot be recycled 1,000 5 Trinket — —
Trailblazer Rare 2× Crude Explosives 1,600 3 Quick Use — —
Trigger 'Nade Rare 1× Chemicals1× Processor 1,000 3 Quick Use — —
Turbo Pump Rare 1× Mechanical Components3× Oil 2,000 3 Recyclable — —
Unusable Weapon Rare 4× Metal Parts5× Simple Gun Parts 2,000 3 Recyclable — —
Vase Rare Cannot be recycled 3,000 3 Trinket — —
Vertical Grip I Common 6× Plastic Parts 640 1 Mods — —
Vertical Grip II Uncommon 1× Duct Tape1× Mechanical Components 2,000 1 Mods — —
Vertical Grip III Rare 2× Duct Tape2× Mechanical Components 5,000 1 Mods — —
Very Comfortable Pillow Uncommon Cannot be recycled 2,000 3 Trinket — Scrappy 5 (3×)
Vita Shot Rare 1× Syringe4× Chemicals 2,200 3 Quick Use — —
Vita Spray Epic 1× Antiseptic2× Canister 3,000 1 Quick Use — —
Volcanic Rock Common Cannot be recycled 270 5 Misc — —
Voltage Converter Rare 1× Rubber Parts1× Wires 500 5 Topside Material — —
Wasp Driver Rare 1× ARC Alloy1× Electrical Components 1,000 3 Recyclable The Trifecta (2×) Gunsmith 1 (8×)
Water Filter Rare 2× Rubber Parts3× Canister 1,000 3 Recyclable — —
Water Pump Rare 2× Oil4× Metal Parts 1,000 3 Recyclable — —
Wires Uncommon 2× Rubber Parts 200 15 Topside Material After Rain Comes (5×)Eyes On The Prize (3×)Trash Into Treasure (6×) —
Wolfpack Epic 1× ARC Motion Core1× Explosive Compound 5,000 1 Quick Use — —
Zipline Rare 1× Metal Parts1× Rope 1,000 3 Quick Use — —`;

// Parse recycle data from wiki text
function parseRecycleData(text) {
  const recycleMap = {};
  const lines = text.split('\n');

  for (const line of lines) {
    // Match pattern: "Item Name Rarity RecycleInfo..."
    // RecycleInfo is like "1× Chemicals1× Plastic Parts" or "Cannot be recycled"

    // Find where recycle info starts (after rarity)
    const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
    let rarityIndex = -1;
    let rarity = '';

    for (const r of rarities) {
      const idx = line.indexOf(' ' + r + ' ');
      if (idx !== -1) {
        rarityIndex = idx + 1;
        rarity = r;
        break;
      }
    }

    if (rarityIndex === -1) continue;

    const itemName = line.substring(0, rarityIndex).trim();
    const afterRarity = line.substring(rarityIndex + rarity.length + 1);

    // Check if cannot be recycled
    if (afterRarity.startsWith('Cannot be recycled')) {
      recycleMap[itemName] = null;
      continue;
    }

    // Parse recycle outputs: "1× Chemicals1× Plastic Parts 300 5..."
    const recycleOutputs = [];
    const recycleMatch = afterRarity.match(/^((?:\d+×\s*[A-Za-z\s'()]+)+)/);

    if (recycleMatch) {
      const recycleText = recycleMatch[1];
      // Split by quantity markers
      const parts = recycleText.split(/(?=\d+×)/);

      for (const part of parts) {
        const match = part.match(/(\d+)×\s*([A-Za-z\s'()]+)/);
        if (match) {
          const quantity = parseInt(match[1]);
          const material = match[2].trim();
          // Clean up material name (remove trailing numbers that might be sell price)
          const cleanMaterial = material.replace(/\s+\d+.*$/, '').trim();
          if (cleanMaterial && !cleanMaterial.match(/^\d/)) {
            recycleOutputs.push({ material: cleanMaterial, quantity });
          }
        }
      }
    }

    if (recycleOutputs.length > 0) {
      recycleMap[itemName] = recycleOutputs;
    }
  }

  return recycleMap;
}

// Generate item ID from name
function generateId(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

// Main
const recycleData = parseRecycleData(wikiText);

// Load existing items
const itemsPath = path.join(__dirname, '..', 'data', 'items.json');
const itemsData = JSON.parse(fs.readFileSync(itemsPath, 'utf8'));

// Update items with recycle data
let updated = 0;
let notFound = [];

for (const [itemName, recyclesTo] of Object.entries(recycleData)) {
  const itemId = generateId(itemName);
  const item = itemsData.items.find(i => i.id === itemId);

  if (item) {
    item.recycleTo = recyclesTo;
    updated++;
  } else {
    notFound.push({ name: itemName, id: itemId });
  }
}

// Save updated items
fs.writeFileSync(itemsPath, JSON.stringify(itemsData, null, 2));

console.log(`Updated ${updated} items with recycle data`);
console.log(`Items not found in database: ${notFound.length}`);

if (notFound.length > 0) {
  console.log('\nNot found items (first 20):');
  notFound.slice(0, 20).forEach(item => {
    console.log(`  - ${item.name} (${item.id})`);
  });
}

// Also output a summary of all base materials that items can recycle into
const materialsMap = {};
for (const [itemName, recyclesTo] of Object.entries(recycleData)) {
  if (recyclesTo) {
    for (const { material, quantity } of recyclesTo) {
      if (!materialsMap[material]) {
        materialsMap[material] = [];
      }
      materialsMap[material].push({ item: itemName, quantity });
    }
  }
}

console.log('\n--- Base Materials Summary ---');
const sortedMaterials = Object.keys(materialsMap).sort();
for (const material of sortedMaterials) {
  console.log(`${material}: ${materialsMap[material].length} donors`);
}
