const https = require('https');
const fs = require('fs');
const path = require('path');

// All item images extracted from the Arc Raiders Wiki
const imageData = [
  {"name":"Advanced ARC Powercell","id":"advanced_arc_powercell","url":"https://static.wikia.nocookie.net/arc-raiders/images/3/31/Advanced_ARC_Powercell.png/revision/latest"},
  {"name":"Advanced Electrical Components","id":"advanced_electrical_components","url":"https://static.wikia.nocookie.net/arc-raiders/images/9/9b/Advanced_Electrical_Components.png/revision/latest"},
  {"name":"Advanced Mechanical Components","id":"advanced_mechanical_components","url":"https://static.wikia.nocookie.net/arc-raiders/images/2/25/Advanced_Mechanical_Components.png/revision/latest"},
  {"name":"Agave","id":"agave","url":"https://static.wikia.nocookie.net/arc-raiders/images/4/47/Agave.png/revision/latest"},
  {"name":"Agave Juice","id":"agave_juice","url":"https://static.wikia.nocookie.net/arc-raiders/images/a/a8/Agave_Juice.png/revision/latest"},
  {"name":"Air Freshener","id":"air_freshener","url":"https://static.wikia.nocookie.net/arc-raiders/images/0/03/Air_Freshener.png/revision/latest"},
  {"name":"Alarm Clock","id":"alarm_clock","url":"https://static.wikia.nocookie.net/arc-raiders/images/4/48/Alarm_Clock.png/revision/latest"},
  {"name":"Ammunition Crate (Common)","id":"ammunition_crate_common","url":"https://static.wikia.nocookie.net/arc-raiders/images/e/ec/Ammunition_Crate_%28Common%29.png/revision/latest"},
  {"name":"Ammunition Crate (Uncommon)","id":"ammunition_crate_uncommon","url":"https://static.wikia.nocookie.net/arc-raiders/images/8/89/Ammunition_Crate_%28Uncommon%29.png/revision/latest"},
  {"name":"Ammunition Crate (Rare)","id":"ammunition_crate_rare","url":"https://static.wikia.nocookie.net/arc-raiders/images/f/f7/Ammunition_Crate_%28Rare%29.png/revision/latest"},
  {"name":"Apricot","id":"apricot","url":"https://static.wikia.nocookie.net/arc-raiders/images/5/5a/Apricot.png/revision/latest"},
  {"name":"ARC Battery Cell","id":"arc_battery_cell","url":"https://static.wikia.nocookie.net/arc-raiders/images/5/53/ARC_Battery_Cell.png/revision/latest"},
  {"name":"ARC Calibration Kit","id":"arc_calibration_kit","url":"https://static.wikia.nocookie.net/arc-raiders/images/b/b5/ARC_Calibration_Kit.png/revision/latest"},
  {"name":"ARC Glass Shard","id":"arc_glass_shard","url":"https://static.wikia.nocookie.net/arc-raiders/images/9/93/ARC_Glass_Shard.png/revision/latest"},
  {"name":"ARC Reinforced Plate","id":"arc_reinforced_plate","url":"https://static.wikia.nocookie.net/arc-raiders/images/e/e9/ARC_Reinforced_Plate.png/revision/latest"},
  {"name":"ARC Rubber","id":"arc_rubber","url":"https://static.wikia.nocookie.net/arc-raiders/images/c/c3/ARC_Rubber.png/revision/latest"},
  {"name":"Basic Mechanical Components","id":"basic_mechanical_components","url":"https://static.wikia.nocookie.net/arc-raiders/images/d/d3/Basic_Mechanical_Components.png/revision/latest"},
  {"name":"Basic Electrical Components","id":"basic_electrical_components","url":"https://static.wikia.nocookie.net/arc-raiders/images/a/af/Basic_Electrical_Components.png/revision/latest"},
  {"name":"Batteries","id":"batteries","url":"https://static.wikia.nocookie.net/arc-raiders/images/a/a9/Batteries.png/revision/latest"},
  {"name":"Bear Trap","id":"bear_trap","url":"https://static.wikia.nocookie.net/arc-raiders/images/6/6c/Bear_Trap.png/revision/latest"},
  {"name":"Beeswax","id":"beeswax","url":"https://static.wikia.nocookie.net/arc-raiders/images/b/bb/Beeswax.png/revision/latest"},
  {"name":"Binoculars","id":"binoculars","url":"https://static.wikia.nocookie.net/arc-raiders/images/1/17/Binoculars.png/revision/latest"},
  {"name":"Blueberries","id":"blueberries","url":"https://static.wikia.nocookie.net/arc-raiders/images/4/4b/Blueberries.png/revision/latest"},
  {"name":"Bone Saw","id":"bone_saw","url":"https://static.wikia.nocookie.net/arc-raiders/images/c/cd/Bone_Saw.png/revision/latest"},
  {"name":"Bottle Cap","id":"bottle_cap","url":"https://static.wikia.nocookie.net/arc-raiders/images/7/7a/Bottle_Cap.png/revision/latest"},
  {"name":"Broken Guitar","id":"broken_guitar","url":"https://static.wikia.nocookie.net/arc-raiders/images/5/5f/Broken_Guitar.png/revision/latest"},
  {"name":"Broken Wristwatch","id":"broken_wristwatch","url":"https://static.wikia.nocookie.net/arc-raiders/images/1/12/Broken_Wristwatch.png/revision/latest"},
  {"name":"Canned Food","id":"canned_food","url":"https://static.wikia.nocookie.net/arc-raiders/images/0/0b/Canned_Food.png/revision/latest"},
  {"name":"Car Battery","id":"car_battery","url":"https://static.wikia.nocookie.net/arc-raiders/images/6/64/Car_Battery.png/revision/latest"},
  {"name":"Cardboard","id":"cardboard","url":"https://static.wikia.nocookie.net/arc-raiders/images/e/ee/Cardboard.png/revision/latest"},
  {"name":"Cat Bed","id":"cat_bed","url":"https://static.wikia.nocookie.net/arc-raiders/images/b/b9/Cat_Bed.png/revision/latest"},
  {"name":"Chalk","id":"chalk","url":"https://static.wikia.nocookie.net/arc-raiders/images/4/4e/Chalk.png/revision/latest"},
  {"name":"Chemicals","id":"chemicals","url":"https://static.wikia.nocookie.net/arc-raiders/images/c/c9/Chemicals.png/revision/latest"},
  {"name":"Circuit Board","id":"circuit_board","url":"https://static.wikia.nocookie.net/arc-raiders/images/6/6e/Circuit_Board.png/revision/latest"},
  {"name":"Clean Water","id":"clean_water","url":"https://static.wikia.nocookie.net/arc-raiders/images/0/0a/Clean_Water.png/revision/latest"},
  {"name":"Coil","id":"coil","url":"https://static.wikia.nocookie.net/arc-raiders/images/b/b9/Coil.png/revision/latest"},
  {"name":"Colander","id":"colander","url":"https://static.wikia.nocookie.net/arc-raiders/images/d/d9/Colander.png/revision/latest"},
  {"name":"Compass","id":"compass","url":"https://static.wikia.nocookie.net/arc-raiders/images/e/e5/Compass.png/revision/latest"},
  {"name":"Computer Mouse","id":"computer_mouse","url":"https://static.wikia.nocookie.net/arc-raiders/images/a/a9/Computer_Mouse.png/revision/latest"},
  {"name":"Cooking Pot","id":"cooking_pot","url":"https://static.wikia.nocookie.net/arc-raiders/images/c/ca/Cooking_Pot.png/revision/latest"},
  {"name":"Copper Wire","id":"copper_wire","url":"https://static.wikia.nocookie.net/arc-raiders/images/4/4a/Copper_Wire.png/revision/latest"},
  {"name":"Corroded Battery","id":"corroded_battery","url":"https://static.wikia.nocookie.net/arc-raiders/images/5/5f/Corroded_Battery.png/revision/latest"},
  {"name":"Cracked Screen","id":"cracked_screen","url":"https://static.wikia.nocookie.net/arc-raiders/images/7/72/Cracked_Screen.png/revision/latest"},
  {"name":"Crude Pipe Bomb","id":"crude_pipe_bomb","url":"https://static.wikia.nocookie.net/arc-raiders/images/7/7e/Crude_Pipe_Bomb.png/revision/latest"},
  {"name":"Cutting Board","id":"cutting_board","url":"https://static.wikia.nocookie.net/arc-raiders/images/4/4f/Cutting_Board.png/revision/latest"},
  {"name":"Damaged ARC Circuitry","id":"damaged_arc_circuitry","url":"https://static.wikia.nocookie.net/arc-raiders/images/d/d5/Damaged_ARC_Circuitry.png/revision/latest"},
  {"name":"Damaged ARC Optics","id":"damaged_arc_optics","url":"https://static.wikia.nocookie.net/arc-raiders/images/6/60/Damaged_ARC_Optics.png/revision/latest"},
  {"name":"Damaged ARC Plating","id":"damaged_arc_plating","url":"https://static.wikia.nocookie.net/arc-raiders/images/0/07/Damaged_ARC_Plating.png/revision/latest"},
  {"name":"Damaged Tick Pod","id":"damaged_tick_pod","url":"https://static.wikia.nocookie.net/arc-raiders/images/d/d6/Damaged_Tick_Pod.png/revision/latest"},
  {"name":"Damaged Wasp Driver","id":"damaged_wasp_driver","url":"https://static.wikia.nocookie.net/arc-raiders/images/e/e6/Damaged_Wasp_Driver.png/revision/latest"},
  {"name":"Dart Board","id":"dart_board","url":"https://static.wikia.nocookie.net/arc-raiders/images/4/4d/Dart_Board.png/revision/latest"},
  {"name":"Deflated Football","id":"deflated_football","url":"https://static.wikia.nocookie.net/arc-raiders/images/7/7c/Deflated_Football.png/revision/latest"},
  {"name":"Degraded ARC Rubber","id":"degraded_arc_rubber","url":"https://static.wikia.nocookie.net/arc-raiders/images/3/37/Degraded_ARC_Rubber.png/revision/latest"},
  {"name":"Diving Goggles","id":"diving_goggles","url":"https://static.wikia.nocookie.net/arc-raiders/images/1/1a/Diving_Goggles.png/revision/latest"},
  {"name":"Dog Collar","id":"dog_collar","url":"https://static.wikia.nocookie.net/arc-raiders/images/0/0e/Dog_Collar.png/revision/latest"},
  {"name":"Duct Tape","id":"duct_tape","url":"https://static.wikia.nocookie.net/arc-raiders/images/4/44/Duct_Tape.png/revision/latest"},
  {"name":"Electrical Components","id":"electrical_components","url":"https://static.wikia.nocookie.net/arc-raiders/images/4/4d/Electrical_Components.png/revision/latest"},
  {"name":"Electronics","id":"electronics","url":"https://static.wikia.nocookie.net/arc-raiders/images/5/5a/Electronics.png/revision/latest"},
  {"name":"Empty Soda Can","id":"empty_soda_can","url":"https://static.wikia.nocookie.net/arc-raiders/images/8/88/Empty_Soda_Can.png/revision/latest"},
  {"name":"Energy Drink","id":"energy_drink","url":"https://static.wikia.nocookie.net/arc-raiders/images/4/4e/Energy_Drink.png/revision/latest"},
  {"name":"Fabric","id":"fabric","url":"https://static.wikia.nocookie.net/arc-raiders/images/9/95/Fabric.png/revision/latest"},
  {"name":"Figs","id":"figs","url":"https://static.wikia.nocookie.net/arc-raiders/images/e/ec/Figs.png/revision/latest"},
  {"name":"Fire Extinguisher","id":"fire_extinguisher","url":"https://static.wikia.nocookie.net/arc-raiders/images/7/7b/Fire_Extinguisher.png/revision/latest"},
  {"name":"First Aid Kit","id":"first_aid_kit","url":"https://static.wikia.nocookie.net/arc-raiders/images/1/16/First_Aid_Kit.png/revision/latest"},
  {"name":"Fishing Line","id":"fishing_line","url":"https://static.wikia.nocookie.net/arc-raiders/images/a/a9/Fishing_Line.png/revision/latest"},
  {"name":"Flask","id":"flask","url":"https://static.wikia.nocookie.net/arc-raiders/images/c/c7/Flask.png/revision/latest"},
  {"name":"Flashlight","id":"flashlight","url":"https://static.wikia.nocookie.net/arc-raiders/images/c/c9/Flashlight.png/revision/latest"},
  {"name":"Flint","id":"flint","url":"https://static.wikia.nocookie.net/arc-raiders/images/0/0e/Flint.png/revision/latest"},
  {"name":"Flour","id":"flour","url":"https://static.wikia.nocookie.net/arc-raiders/images/a/a6/Flour.png/revision/latest"},
  {"name":"Flower Pot","id":"flower_pot","url":"https://static.wikia.nocookie.net/arc-raiders/images/0/0a/Flower_Pot.png/revision/latest"},
  {"name":"Flywheel","id":"flywheel","url":"https://static.wikia.nocookie.net/arc-raiders/images/9/9e/Flywheel.png/revision/latest"},
  {"name":"Fuel","id":"fuel","url":"https://static.wikia.nocookie.net/arc-raiders/images/5/50/Fuel.png/revision/latest"},
  {"name":"Fur Pelt","id":"fur_pelt","url":"https://static.wikia.nocookie.net/arc-raiders/images/a/a5/Fur_Pelt.png/revision/latest"},
  {"name":"Fuse","id":"fuse","url":"https://static.wikia.nocookie.net/arc-raiders/images/f/f1/Fuse.png/revision/latest"},
  {"name":"Garlic","id":"garlic","url":"https://static.wikia.nocookie.net/arc-raiders/images/2/21/Garlic.png/revision/latest"},
  {"name":"Glass Bottle","id":"glass_bottle","url":"https://static.wikia.nocookie.net/arc-raiders/images/c/c7/Glass_Bottle.png/revision/latest"},
  {"name":"Glass Jar","id":"glass_jar","url":"https://static.wikia.nocookie.net/arc-raiders/images/4/41/Glass_Jar.png/revision/latest"},
  {"name":"Globe","id":"globe","url":"https://static.wikia.nocookie.net/arc-raiders/images/2/2d/Globe.png/revision/latest"},
  {"name":"Glue","id":"glue","url":"https://static.wikia.nocookie.net/arc-raiders/images/0/03/Glue.png/revision/latest"},
  {"name":"Gold Coin","id":"gold_coin","url":"https://static.wikia.nocookie.net/arc-raiders/images/4/4a/Gold_Coin.png/revision/latest"},
  {"name":"Golden Bracelet","id":"golden_bracelet","url":"https://static.wikia.nocookie.net/arc-raiders/images/0/05/Golden_Bracelet.png/revision/latest"},
  {"name":"Golden Ring","id":"golden_ring","url":"https://static.wikia.nocookie.net/arc-raiders/images/4/48/Golden_Ring.png/revision/latest"},
  {"name":"Grapes","id":"grapes","url":"https://static.wikia.nocookie.net/arc-raiders/images/6/66/Grapes.png/revision/latest"},
  {"name":"Gunpowder","id":"gunpowder","url":"https://static.wikia.nocookie.net/arc-raiders/images/c/c9/Gunpowder.png/revision/latest"},
  {"name":"Hair Brush","id":"hair_brush","url":"https://static.wikia.nocookie.net/arc-raiders/images/0/09/Hair_Brush.png/revision/latest"},
  {"name":"Hand Mirror","id":"hand_mirror","url":"https://static.wikia.nocookie.net/arc-raiders/images/a/a7/Hand_Mirror.png/revision/latest"},
  {"name":"Hand Pump","id":"hand_pump","url":"https://static.wikia.nocookie.net/arc-raiders/images/4/46/Hand_Pump.png/revision/latest"},
  {"name":"Hardened ARC Plating","id":"hardened_arc_plating","url":"https://static.wikia.nocookie.net/arc-raiders/images/4/4e/Hardened_ARC_Plating.png/revision/latest"},
  {"name":"Heavy Gun Parts","id":"heavy_gun_parts","url":"https://static.wikia.nocookie.net/arc-raiders/images/f/f9/Heavy_Gun_Parts.png/revision/latest"},
  {"name":"Herbs","id":"herbs","url":"https://static.wikia.nocookie.net/arc-raiders/images/0/04/Herbs.png/revision/latest"},
  {"name":"Honey","id":"honey","url":"https://static.wikia.nocookie.net/arc-raiders/images/c/c9/Honey.png/revision/latest"},
  {"name":"Instant Noodles","id":"instant_noodles","url":"https://static.wikia.nocookie.net/arc-raiders/images/9/94/Instant_Noodles.png/revision/latest"},
  {"name":"Kitchen Knife","id":"kitchen_knife","url":"https://static.wikia.nocookie.net/arc-raiders/images/3/35/Kitchen_Knife.png/revision/latest"},
  {"name":"Large Gear","id":"large_gear","url":"https://static.wikia.nocookie.net/arc-raiders/images/e/e2/Large_Gear.png/revision/latest"},
  {"name":"Leather","id":"leather","url":"https://static.wikia.nocookie.net/arc-raiders/images/4/42/Leather.png/revision/latest"},
  {"name":"Light Gun Parts","id":"light_gun_parts","url":"https://static.wikia.nocookie.net/arc-raiders/images/2/24/Light_Gun_Parts.png/revision/latest"},
  {"name":"Lighter","id":"lighter","url":"https://static.wikia.nocookie.net/arc-raiders/images/5/52/Lighter.png/revision/latest"},
  {"name":"Lightbulb","id":"lightbulb","url":"https://static.wikia.nocookie.net/arc-raiders/images/1/19/Lightbulb.png/revision/latest"},
  {"name":"Magnifying Glass","id":"magnifying_glass","url":"https://static.wikia.nocookie.net/arc-raiders/images/4/41/Magnifying_Glass.png/revision/latest"},
  {"name":"Matriarch Reactor","id":"matriarch_reactor","url":"https://static.wikia.nocookie.net/arc-raiders/images/2/24/Matriarch_Reactor.png/revision/latest"},
  {"name":"Mechanical Components","id":"mechanical_components","url":"https://static.wikia.nocookie.net/arc-raiders/images/9/94/Mechanical_Components.png/revision/latest"},
  {"name":"Medium Gun Parts","id":"medium_gun_parts","url":"https://static.wikia.nocookie.net/arc-raiders/images/9/9a/Medium_Gun_Parts.png/revision/latest"},
  {"name":"Metal Brackets","id":"metal_brackets","url":"https://static.wikia.nocookie.net/arc-raiders/images/6/62/Metal_Brackets.png/revision/latest"},
  {"name":"Metal Parts","id":"metal_parts","url":"https://static.wikia.nocookie.net/arc-raiders/images/8/89/Metal_Parts.png/revision/latest"},
  {"name":"Microscope","id":"microscope","url":"https://static.wikia.nocookie.net/arc-raiders/images/2/2c/Microscope.png/revision/latest"},
  {"name":"Mini Centrifuge","id":"mini_centrifuge","url":"https://static.wikia.nocookie.net/arc-raiders/images/4/4c/Mini_Centrifuge.png/revision/latest"},
  {"name":"Mortar and Pestle","id":"mortar_and_pestle","url":"https://static.wikia.nocookie.net/arc-raiders/images/f/ff/Mortar_and_Pestle.png/revision/latest"},
  {"name":"Motor Oil","id":"motor_oil","url":"https://static.wikia.nocookie.net/arc-raiders/images/0/09/Motor_Oil.png/revision/latest"},
  {"name":"Mushroom","id":"mushroom","url":"https://static.wikia.nocookie.net/arc-raiders/images/5/5b/Mushroom.png/revision/latest"},
  {"name":"Nails","id":"nails","url":"https://static.wikia.nocookie.net/arc-raiders/images/f/f9/Nails.png/revision/latest"},
  {"name":"Olive","id":"olive","url":"https://static.wikia.nocookie.net/arc-raiders/images/1/11/Olive.png/revision/latest"},
  {"name":"Onion","id":"onion","url":"https://static.wikia.nocookie.net/arc-raiders/images/6/62/Onion.png/revision/latest"},
  {"name":"Orange","id":"orange","url":"https://static.wikia.nocookie.net/arc-raiders/images/5/52/Orange.png/revision/latest"},
  {"name":"Paint Can","id":"paint_can","url":"https://static.wikia.nocookie.net/arc-raiders/images/5/5b/Paint_Can.png/revision/latest"},
  {"name":"Paper","id":"paper","url":"https://static.wikia.nocookie.net/arc-raiders/images/3/37/Paper.png/revision/latest"},
  {"name":"Peach","id":"peach","url":"https://static.wikia.nocookie.net/arc-raiders/images/f/f9/Peach.png/revision/latest"},
  {"name":"Pear","id":"pear","url":"https://static.wikia.nocookie.net/arc-raiders/images/e/e3/Pear.png/revision/latest"},
  {"name":"Pillow","id":"pillow","url":"https://static.wikia.nocookie.net/arc-raiders/images/3/3e/Pillow.png/revision/latest"},
  {"name":"Plastic","id":"plastic","url":"https://static.wikia.nocookie.net/arc-raiders/images/7/78/Plastic.png/revision/latest"},
  {"name":"Pliers","id":"pliers","url":"https://static.wikia.nocookie.net/arc-raiders/images/f/f9/Pliers.png/revision/latest"},
  {"name":"Plum","id":"plum","url":"https://static.wikia.nocookie.net/arc-raiders/images/4/40/Plum.png/revision/latest"},
  {"name":"Pomegranate","id":"pomegranate","url":"https://static.wikia.nocookie.net/arc-raiders/images/9/98/Pomegranate.png/revision/latest"},
  {"name":"Potato","id":"potato","url":"https://static.wikia.nocookie.net/arc-raiders/images/e/e0/Potato.png/revision/latest"},
  {"name":"Prickly Pear","id":"prickly_pear","url":"https://static.wikia.nocookie.net/arc-raiders/images/3/38/Prickly_Pear.png/revision/latest"},
  {"name":"Pristine ARC Circuitry","id":"pristine_arc_circuitry","url":"https://static.wikia.nocookie.net/arc-raiders/images/e/e7/Pristine_ARC_Circuitry.png/revision/latest"},
  {"name":"Pristine ARC Core","id":"pristine_arc_core","url":"https://static.wikia.nocookie.net/arc-raiders/images/e/e0/Pristine_ARC_Core.png/revision/latest"},
  {"name":"Pristine ARC Optics","id":"pristine_arc_optics","url":"https://static.wikia.nocookie.net/arc-raiders/images/7/76/Pristine_ARC_Optics.png/revision/latest"},
  {"name":"Pristine ARC Plating","id":"pristine_arc_plating","url":"https://static.wikia.nocookie.net/arc-raiders/images/6/60/Pristine_ARC_Plating.png/revision/latest"},
  {"name":"Pristine ARC Powercell","id":"pristine_arc_powercell","url":"https://static.wikia.nocookie.net/arc-raiders/images/d/d5/Pristine_ARC_Powercell.png/revision/latest"},
  {"name":"Propane Tank","id":"propane_tank","url":"https://static.wikia.nocookie.net/arc-raiders/images/2/23/Propane_Tank.png/revision/latest"},
  {"name":"Radio","id":"radio","url":"https://static.wikia.nocookie.net/arc-raiders/images/6/6d/Radio.png/revision/latest"},
  {"name":"Rags","id":"rags","url":"https://static.wikia.nocookie.net/arc-raiders/images/1/15/Rags.png/revision/latest"},
  {"name":"Rebar","id":"rebar","url":"https://static.wikia.nocookie.net/arc-raiders/images/d/d9/Rebar.png/revision/latest"},
  {"name":"Rechargeable Battery","id":"rechargeable_battery","url":"https://static.wikia.nocookie.net/arc-raiders/images/7/71/Rechargeable_Battery.png/revision/latest"},
  {"name":"Resin","id":"resin","url":"https://static.wikia.nocookie.net/arc-raiders/images/2/25/Resin.png/revision/latest"},
  {"name":"Ring","id":"ring","url":"https://static.wikia.nocookie.net/arc-raiders/images/3/3a/Ring.png/revision/latest"},
  {"name":"Rope","id":"rope","url":"https://static.wikia.nocookie.net/arc-raiders/images/f/f5/Rope.png/revision/latest"},
  {"name":"Rubber","id":"rubber","url":"https://static.wikia.nocookie.net/arc-raiders/images/2/21/Rubber.png/revision/latest"},
  {"name":"Ruined Parachute","id":"ruined_parachute","url":"https://static.wikia.nocookie.net/arc-raiders/images/5/5c/Ruined_Parachute.png/revision/latest"},
  {"name":"Ruined Riot Shield","id":"ruined_riot_shield","url":"https://static.wikia.nocookie.net/arc-raiders/images/c/cb/Ruined_Riot_Shield.png/revision/latest"},
  {"name":"Ruined Tactical Vest","id":"ruined_tactical_vest","url":"https://static.wikia.nocookie.net/arc-raiders/images/c/c2/Ruined_Tactical_Vest.png/revision/latest"},
  {"name":"Rusted Bolts","id":"rusted_bolts","url":"https://static.wikia.nocookie.net/arc-raiders/images/b/bf/Rusted_Bolts.png/revision/latest"},
  {"name":"Rusted Gear","id":"rusted_gear","url":"https://static.wikia.nocookie.net/arc-raiders/images/c/cf/Rusted_Gear.png/revision/latest"},
  {"name":"Rusted Shut Medical Kit","id":"rusted_shut_medical_kit","url":"https://static.wikia.nocookie.net/arc-raiders/images/1/1a/Rusted_Shut_Medical_Kit.png/revision/latest"},
  {"name":"Rusted Tools","id":"rusted_tools","url":"https://static.wikia.nocookie.net/arc-raiders/images/2/2e/Rusted_Tools.png/revision/latest"},
  {"name":"Salt","id":"salt","url":"https://static.wikia.nocookie.net/arc-raiders/images/5/59/Salt.png/revision/latest"},
  {"name":"Scalpel","id":"scalpel","url":"https://static.wikia.nocookie.net/arc-raiders/images/5/55/Scalpel.png/revision/latest"},
  {"name":"Scissors","id":"scissors","url":"https://static.wikia.nocookie.net/arc-raiders/images/f/f2/Scissors.png/revision/latest"},
  {"name":"Scrap Metal","id":"scrap_metal","url":"https://static.wikia.nocookie.net/arc-raiders/images/f/fd/Scrap_Metal.png/revision/latest"},
  {"name":"Screwdriver","id":"screwdriver","url":"https://static.wikia.nocookie.net/arc-raiders/images/9/96/Screwdriver.png/revision/latest"},
  {"name":"Sewing Kit","id":"sewing_kit","url":"https://static.wikia.nocookie.net/arc-raiders/images/3/37/Sewing_Kit.png/revision/latest"},
  {"name":"Shrapnel","id":"shrapnel","url":"https://static.wikia.nocookie.net/arc-raiders/images/d/db/Shrapnel.png/revision/latest"},
  {"name":"Silver Necklace","id":"silver_necklace","url":"https://static.wikia.nocookie.net/arc-raiders/images/2/2f/Silver_Necklace.png/revision/latest"},
  {"name":"Small Gear","id":"small_gear","url":"https://static.wikia.nocookie.net/arc-raiders/images/6/65/Small_Gear.png/revision/latest"},
  {"name":"Soap","id":"soap","url":"https://static.wikia.nocookie.net/arc-raiders/images/d/d6/Soap.png/revision/latest"},
  {"name":"Soldering Iron","id":"soldering_iron","url":"https://static.wikia.nocookie.net/arc-raiders/images/2/2b/Soldering_Iron.png/revision/latest"},
  {"name":"Spatula","id":"spatula","url":"https://static.wikia.nocookie.net/arc-raiders/images/5/5a/Spatula.png/revision/latest"},
  {"name":"Spice","id":"spice","url":"https://static.wikia.nocookie.net/arc-raiders/images/b/b9/Spice.png/revision/latest"},
  {"name":"Sponge","id":"sponge","url":"https://static.wikia.nocookie.net/arc-raiders/images/0/08/Sponge.png/revision/latest"},
  {"name":"Spoon","id":"spoon","url":"https://static.wikia.nocookie.net/arc-raiders/images/3/38/Spoon.png/revision/latest"},
  {"name":"Spring","id":"spring","url":"https://static.wikia.nocookie.net/arc-raiders/images/5/5c/Spring.png/revision/latest"},
  {"name":"Stapler","id":"stapler","url":"https://static.wikia.nocookie.net/arc-raiders/images/4/42/Stapler.png/revision/latest"},
  {"name":"Steel Pipe","id":"steel_pipe","url":"https://static.wikia.nocookie.net/arc-raiders/images/4/48/Steel_Pipe.png/revision/latest"},
  {"name":"Stethoscope","id":"stethoscope","url":"https://static.wikia.nocookie.net/arc-raiders/images/5/5c/Stethoscope.png/revision/latest"},
  {"name":"Strawberries","id":"strawberries","url":"https://static.wikia.nocookie.net/arc-raiders/images/e/e7/Strawberries.png/revision/latest"},
  {"name":"Sugar","id":"sugar","url":"https://static.wikia.nocookie.net/arc-raiders/images/9/99/Sugar.png/revision/latest"},
  {"name":"Sunglasses","id":"sunglasses","url":"https://static.wikia.nocookie.net/arc-raiders/images/b/b9/Sunglasses.png/revision/latest"},
  {"name":"Surgical Mask","id":"surgical_mask","url":"https://static.wikia.nocookie.net/arc-raiders/images/2/2c/Surgical_Mask.png/revision/latest"},
  {"name":"Syringe","id":"syringe","url":"https://static.wikia.nocookie.net/arc-raiders/images/4/48/Syringe.png/revision/latest"},
  {"name":"Tennis Racket","id":"tennis_racket","url":"https://static.wikia.nocookie.net/arc-raiders/images/8/8f/Tennis_Racket.png/revision/latest"},
  {"name":"Thermometer","id":"thermometer","url":"https://static.wikia.nocookie.net/arc-raiders/images/2/26/Thermometer.png/revision/latest"},
  {"name":"Timer","id":"timer","url":"https://static.wikia.nocookie.net/arc-raiders/images/3/3c/Timer.png/revision/latest"},
  {"name":"Tire","id":"tire","url":"https://static.wikia.nocookie.net/arc-raiders/images/3/3a/Tire.png/revision/latest"},
  {"name":"Tomato","id":"tomato","url":"https://static.wikia.nocookie.net/arc-raiders/images/2/21/Tomato.png/revision/latest"},
  {"name":"Torch","id":"torch","url":"https://static.wikia.nocookie.net/arc-raiders/images/4/43/Torch.png/revision/latest"},
  {"name":"Toy Car","id":"toy_car","url":"https://static.wikia.nocookie.net/arc-raiders/images/f/f7/Toy_Car.png/revision/latest"},
  {"name":"Transistor","id":"transistor","url":"https://static.wikia.nocookie.net/arc-raiders/images/a/a2/Transistor.png/revision/latest"},
  {"name":"Umbrella","id":"umbrella","url":"https://static.wikia.nocookie.net/arc-raiders/images/3/3a/Umbrella.png/revision/latest"},
  {"name":"Vacuum Tube","id":"vacuum_tube","url":"https://static.wikia.nocookie.net/arc-raiders/images/3/39/Vacuum_Tube.png/revision/latest"},
  {"name":"Walnut","id":"walnut","url":"https://static.wikia.nocookie.net/arc-raiders/images/5/5a/Walnut.png/revision/latest"},
  {"name":"Watermelon","id":"watermelon","url":"https://static.wikia.nocookie.net/arc-raiders/images/6/63/Watermelon.png/revision/latest"},
  {"name":"Wheat","id":"wheat","url":"https://static.wikia.nocookie.net/arc-raiders/images/8/87/Wheat.png/revision/latest"},
  {"name":"Wire","id":"wire","url":"https://static.wikia.nocookie.net/arc-raiders/images/1/1b/Wire.png/revision/latest"},
  {"name":"Wrench","id":"wrench","url":"https://static.wikia.nocookie.net/arc-raiders/images/b/bc/Wrench.png/revision/latest"},
  {"name":"Zip Ties","id":"zip_ties","url":"https://static.wikia.nocookie.net/arc-raiders/images/1/10/Zip_Ties.png/revision/latest"}
];

const outputDir = path.join(__dirname, '..', 'assets', 'images', 'items');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function downloadImage(item) {
  return new Promise((resolve, reject) => {
    const filename = `${item.id}.png`;
    const filepath = path.join(outputDir, filename);

    // Skip if file already exists
    if (fs.existsSync(filepath)) {
      console.log(`Skipping ${item.name} (already exists)`);
      resolve({ ...item, downloaded: false });
      return;
    }

    const file = fs.createWriteStream(filepath);

    https.get(item.url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`Downloaded: ${item.name}`);
            resolve({ ...item, downloaded: true });
          });
        }).on('error', (err) => {
          fs.unlink(filepath, () => {});
          reject(err);
        });
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded: ${item.name}`);
          resolve({ ...item, downloaded: true });
        });
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function downloadAll() {
  console.log(`Starting download of ${imageData.length} images...`);
  console.log(`Output directory: ${outputDir}`);

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const item of imageData) {
    try {
      const result = await downloadImage(item);
      if (result.downloaded) {
        downloaded++;
      } else {
        skipped++;
      }
      // Add a small delay to be nice to the server
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (err) {
      console.error(`Failed to download ${item.name}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDownload complete!`);
  console.log(`Downloaded: ${downloaded}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);
}

downloadAll();
