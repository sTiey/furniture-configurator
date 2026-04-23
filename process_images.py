import os
import glob
from rembg import remove

print("Starting background removal process...")
files = glob.glob('public/*.png')
total = len([f for f in files if '_iso.' not in f and not f.endswith('guide_1776686156605.png') and not f.endswith('guide_1776686170798.png')])
count = 0

for f in files:
    if '_iso.' in f or 'guide_' in f:
        continue # Skip already processed or guide guides
    
    base_name = os.path.basename(f)
    output_path = f.replace('.png', '_iso.png')
    
    if os.path.exists(output_path):
        continue
        
    count += 1
    print(f"Processing ({count}/{total}): {base_name}...")
    
    try:
        with open(f, 'rb') as i:
            input_data = i.read()
        
        output_data = remove(input_data)
        
        with open(output_path, 'wb') as o:
            o.write(output_data)
        print(f"Saved {output_path}")
    except Exception as e:
        print(f"Error processing {base_name}: {e}")

print("All images processed successfully.")
