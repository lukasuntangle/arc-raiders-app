#!/bin/bash

# Download Arc Raiders item images using Fandom API
# This script gets the correct image URLs from the wiki API

OUTPUT_DIR="../assets/images/items"
mkdir -p "$OUTPUT_DIR"

# Item names from the wiki (will be converted to File:Name.png format)
declare -a ITEMS=(
  "advanced_arc_powercell|Advanced ARC Powercell"
  "advanced_electrical_components|Advanced Electrical Components"
  "advanced_mechanical_components|Advanced Mechanical Components"
  "agave|Agave"
  "agave_juice|Agave Juice"
  "air_freshener|Air Freshener"
  "alarm_clock|Alarm Clock"
  "ammunition_crate_common|Ammunition Crate (Common)"
  "ammunition_crate_uncommon|Ammunition Crate (Uncommon)"
  "ammunition_crate_rare|Ammunition Crate (Rare)"
  "apricot|Apricot"
  "arc_battery_cell|ARC Battery Cell"
  "arc_calibration_kit|ARC Calibration Kit"
  "arc_glass_shard|ARC Glass Shard"
  "arc_reinforced_plate|ARC Reinforced Plate"
  "arc_rubber|ARC Rubber"
  "basic_electrical_components|Basic Electrical Components"
  "basic_mechanical_components|Basic Mechanical Components"
  "batteries|Batteries"
  "bear_trap|Bear Trap"
  "beeswax|Beeswax"
  "binoculars|Binoculars"
  "blueberries|Blueberries"
  "bone_saw|Bone Saw"
  "bottle_cap|Bottle Cap"
  "broken_guitar|Broken Guitar"
  "broken_wristwatch|Broken Wristwatch"
  "canned_food|Canned Food"
  "car_battery|Car Battery"
  "cardboard|Cardboard"
  "cat_bed|Cat Bed"
  "chalk|Chalk"
  "chemicals|Chemicals"
  "circuit_board|Circuit Board"
  "clean_water|Clean Water"
  "coil|Coil"
  "colander|Colander"
  "compass|Compass"
  "computer_mouse|Computer Mouse"
  "cooking_pot|Cooking Pot"
  "copper_wire|Copper Wire"
  "corroded_battery|Corroded Battery"
  "cracked_screen|Cracked Screen"
  "crude_pipe_bomb|Crude Pipe Bomb"
  "cutting_board|Cutting Board"
  "damaged_arc_circuitry|Damaged ARC Circuitry"
  "damaged_arc_optics|Damaged ARC Optics"
  "damaged_arc_plating|Damaged ARC Plating"
  "damaged_tick_pod|Damaged Tick Pod"
  "damaged_wasp_driver|Damaged Wasp Driver"
  "dart_board|Dart Board"
  "deflated_football|Deflated Football"
  "degraded_arc_rubber|Degraded ARC Rubber"
  "diving_goggles|Diving Goggles"
  "dog_collar|Dog Collar"
  "dried_out_arc_resin|Dried Out ARC Resin"
  "duct_tape|Duct Tape"
  "electrical_components|Electrical Components"
  "electronics|Electronics"
  "empty_soda_can|Empty Soda Can"
  "energy_drink|Energy Drink"
  "fabric|Fabric"
  "figs|Figs"
  "fire_extinguisher|Fire Extinguisher"
  "first_aid_kit|First Aid Kit"
  "fishing_line|Fishing Line"
  "flashlight|Flashlight"
  "flask|Flask"
  "flint|Flint"
  "flour|Flour"
  "flower_pot|Flower Pot"
  "flywheel|Flywheel"
  "fuel|Fuel"
  "fur_pelt|Fur Pelt"
  "fuse|Fuse"
  "garlic|Garlic"
  "glass_bottle|Glass Bottle"
  "glass_jar|Glass Jar"
  "globe|Globe"
  "glue|Glue"
  "gold_coin|Gold Coin"
  "golden_bracelet|Golden Bracelet"
  "golden_ring|Golden Ring"
  "grapes|Grapes"
  "gunpowder|Gunpowder"
  "hair_brush|Hair Brush"
  "hand_mirror|Hand Mirror"
  "hand_pump|Hand Pump"
  "hardened_arc_plating|Hardened ARC Plating"
  "heavy_gun_parts|Heavy Gun Parts"
  "herbs|Herbs"
  "honey|Honey"
  "instant_noodles|Instant Noodles"
  "kitchen_knife|Kitchen Knife"
  "large_gear|Large Gear"
  "leather|Leather"
  "light_gun_parts|Light Gun Parts"
  "lightbulb|Lightbulb"
  "lighter|Lighter"
  "magnifying_glass|Magnifying Glass"
  "matriarch_reactor|Matriarch Reactor"
  "mechanical_components|Mechanical Components"
  "medium_gun_parts|Medium Gun Parts"
  "metal_brackets|Metal Brackets"
  "metal_parts|Metal Parts"
  "microscope|Microscope"
  "mini_centrifuge|Mini Centrifuge"
  "mod_components|Mod Components"
  "motor_oil|Motor Oil"
  "mushroom|Mushroom"
  "nails|Nails"
  "olive|Olive"
  "onion|Onion"
  "orange|Orange"
  "paint_can|Paint Can"
  "paper|Paper"
  "peach|Peach"
  "pear|Pear"
  "pillow|Pillow"
  "plastic|Plastic"
  "pliers|Pliers"
  "plum|Plum"
  "pomegranate|Pomegranate"
  "potato|Potato"
  "prickly_pear|Prickly Pear"
  "pristine_arc_circuitry|Pristine ARC Circuitry"
  "pristine_arc_core|Pristine ARC Core"
  "pristine_arc_optics|Pristine ARC Optics"
  "pristine_arc_plating|Pristine ARC Plating"
  "pristine_arc_powercell|Pristine ARC Powercell"
  "propane_tank|Propane Tank"
  "radio|Radio"
  "rags|Rags"
  "rebar|Rebar"
  "rechargeable_battery|Rechargeable Battery"
  "resin|Resin"
  "ring|Ring"
  "rope|Rope"
  "rubber|Rubber"
  "ruined_parachute|Ruined Parachute"
  "ruined_riot_shield|Ruined Riot Shield"
  "ruined_tactical_vest|Ruined Tactical Vest"
  "rusted_bolts|Rusted Bolts"
  "rusted_gear|Rusted Gear"
  "rusted_shut_medical_kit|Rusted Shut Medical Kit"
  "rusted_tools|Rusted Tools"
  "rusty_arc_steel|Rusty ARC Steel"
  "salt|Salt"
  "scalpel|Scalpel"
  "scissors|Scissors"
  "scrap_metal|Scrap Metal"
  "screwdriver|Screwdriver"
  "sewing_kit|Sewing Kit"
  "shrapnel|Shrapnel"
  "silver_necklace|Silver Necklace"
  "small_gear|Small Gear"
  "soap|Soap"
  "soldering_iron|Soldering Iron"
  "spatula|Spatula"
  "spice|Spice"
  "sponge|Sponge"
  "spoon|Spoon"
  "spring|Spring"
  "stapler|Stapler"
  "steel_pipe|Steel Pipe"
  "stethoscope|Stethoscope"
  "strawberries|Strawberries"
  "sugar|Sugar"
  "sunglasses|Sunglasses"
  "surgical_mask|Surgical Mask"
  "syringe|Syringe"
  "tennis_racket|Tennis Racket"
  "thermometer|Thermometer"
  "timer|Timer"
  "tire|Tire"
  "tomato|Tomato"
  "torch|Torch"
  "toy_car|Toy Car"
  "transistor|Transistor"
  "umbrella|Umbrella"
  "vacuum_tube|Vacuum Tube"
  "walnut|Walnut"
  "watermelon|Watermelon"
  "wheat|Wheat"
  "wire|Wire"
  "wrench|Wrench"
  "zip_ties|Zip Ties"
)

echo "Starting download of ${#ITEMS[@]} images using Fandom API..."
echo "Output directory: $OUTPUT_DIR"

downloaded=0
failed=0

for item in "${ITEMS[@]}"; do
  IFS='|' read -r id name <<< "$item"
  filename="${id}.webp"
  filepath="$OUTPUT_DIR/$filename"

  # Skip if already downloaded
  if [ -f "$filepath" ] && [ $(stat -f%z "$filepath" 2>/dev/null || echo "0") -gt 1000 ]; then
    echo "⏭ Skipping: $id (already exists)"
    ((downloaded++))
    continue
  fi

  # URL encode the name for the API
  encoded_name=$(python3 -c "import urllib.parse; print(urllib.parse.quote('File:${name}.png'))")

  # Get image URL from Fandom API
  api_url="https://arc-raiders.fandom.com/api.php?action=query&titles=${encoded_name}&prop=imageinfo&iiprop=url&format=json"

  # Extract the URL from the API response
  image_url=$(curl -s "$api_url" | python3 -c "
import sys, json
data = json.load(sys.stdin)
pages = data.get('query', {}).get('pages', {})
for page_id, page in pages.items():
    if 'imageinfo' in page:
        print(page['imageinfo'][0]['url'])
        break
" 2>/dev/null)

  if [ -z "$image_url" ]; then
    echo "✗ Not found: $id ($name)"
    ((failed++))
    continue
  fi

  # Download the image
  http_code=$(curl -s -w "%{http_code}" -L \
    -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" \
    -o "$filepath" \
    "$image_url")

  filesize=$(stat -f%z "$filepath" 2>/dev/null || echo "0")

  if [ "$http_code" = "200" ] && [ "$filesize" -gt 1000 ]; then
    echo "✓ Downloaded: $id ($filesize bytes)"
    ((downloaded++))
  else
    echo "✗ Failed: $id (HTTP $http_code, $filesize bytes)"
    rm -f "$filepath"
    ((failed++))
  fi

  # Small delay to be nice to the server
  sleep 0.15
done

echo ""
echo "Download complete!"
echo "Downloaded: $downloaded"
echo "Failed: $failed"
