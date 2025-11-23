from PIL import Image
import colorsys

def get_vibrant_colors(image_path, n_colors=5):
    try:
        image = Image.open(image_path)
        image = image.convert('RGB')
        image = image.resize((100, 100))
        pixels = list(image.getdata())
        
        # Filter for vibrant colors (saturation > 0.2, brightness > 0.2 and < 0.95)
        vibrant_pixels = []
        for r, g, b in pixels:
            h, s, v = colorsys.rgb_to_hsv(r/255, g/255, b/255)
            if s > 0.2 and 0.2 < v < 0.95:
                vibrant_pixels.append((r, g, b))
        
        if not vibrant_pixels:
            return []

        # Simple clustering: just take the most common ones from the vibrant set
        # But since exact matches are rare, let's just bin them
        binned_pixels = []
        for r, g, b in vibrant_pixels:
            # Round to nearest 10
            r = round(r / 20) * 20
            g = round(g / 20) * 20
            b = round(b / 20) * 20
            binned_pixels.append((r, g, b))
            
        from collections import Counter
        counts = Counter(binned_pixels)
        most_common = counts.most_common(n_colors)
        
        hex_colors = []
        for color, count in most_common:
            hex_color = '#{:02x}{:02x}{:02x}'.format(*color)
            hex_colors.append(hex_color)
            
        return hex_colors
    except Exception as e:
        print(f"Error processing {image_path}: {e}")
        return []

if __name__ == "__main__":
    print("Colors from mascotte.png:")
    print(get_vibrant_colors("src/images/mascotte.png", n_colors=5))
    print("\nColors from palette.png:")
    print(get_vibrant_colors("src/images/palette.png", n_colors=5))
