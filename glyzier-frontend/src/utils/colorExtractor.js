/**
 * Color Extraction Utility
 * 
 * Extracts dominant colors from images using canvas sampling.
 * Used for generating dynamic Aurora color stops based on product images.
 * 
 * @author Glyzier Team
 * @version 1.0
 */

/**
 * Extract dominant colors from an image URL
 * @param {string} imageUrl - URL of the image to analyze
 * @returns {Promise<Array<string>>} Promise resolving to array of hex color strings
 */
export const extractColorsFromImage = (imageUrl) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Resize for performance
        canvas.width = 100;
        canvas.height = 100;
        ctx.drawImage(img, 0, 0, 100, 100);
        
        const imageData = ctx.getImageData(0, 0, 100, 100).data;
        const colorMap = {};
        
        // Sample colors and count frequency
        for (let i = 0; i < imageData.length; i += 4 * 10) { // Sample every 10th pixel
          const r = imageData[i];
          const g = imageData[i + 1];
          const b = imageData[i + 2];
          const a = imageData[i + 3];
          
          // Skip transparent and very light/dark pixels
          if (a < 128 || (r > 240 && g > 240 && b > 240) || (r < 20 && g < 20 && b < 20)) continue;
          
          // Round to reduce color variations
          const roundedR = Math.round(r / 30) * 30;
          const roundedG = Math.round(g / 30) * 30;
          const roundedB = Math.round(b / 30) * 30;
          const key = `${roundedR},${roundedG},${roundedB}`;
          
          colorMap[key] = (colorMap[key] || 0) + 1;
        }
        
        // Get top 3 colors by frequency
        const sortedColors = Object.entries(colorMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([color]) => {
            const [r, g, b] = color.split(',').map(Number);
            return rgbToHex(r, g, b);
          });
        
        // Return 3 colors (use fallback if needed)
        const fallbackColors = ['#c9bfe8', '#b8afe8', '#9b8dd4'];
        while (sortedColors.length < 3) {
          sortedColors.push(fallbackColors[sortedColors.length]);
        }
        
        resolve(sortedColors);
      } catch (error) {
        console.error('Error extracting colors:', error);
        resolve(['#c9bfe8', '#b8afe8', '#9b8dd4']); // Fallback colors
      }
    };
    
    img.onerror = () => {
      resolve(['#c9bfe8', '#b8afe8', '#9b8dd4']); // Fallback colors
    };
    
    img.src = imageUrl;
  });
};

/**
 * Enhance colors for better aurora visibility
 * Increases saturation and adjusts lightness
 * @param {Array<string>} colors - Array of hex color strings
 * @returns {Array<string>} Enhanced hex color strings
 */
export const enhanceColorsForAurora = (colors) => {
  return colors.map(hex => {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    // Increase saturation for more vibrant aurora
    hsl.s = Math.min(100, hsl.s + 20);
    
    // Adjust lightness to medium range for better visibility
    if (hsl.l < 40) hsl.l = 50;
    if (hsl.l > 70) hsl.l = 60;
    
    const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
  });
};

/**
 * Convert RGB to Hex
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {string} Hex color string
 */
const rgbToHex = (r, g, b) => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

/**
 * Convert Hex to RGB
 * @param {string} hex - Hex color string
 * @returns {Object} RGB object with r, g, b properties
 */
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

/**
 * Convert RGB to HSL
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {Object} HSL object with h, s, l properties
 */
const rgbToHsl = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    
    h /= 6;
  }
  
  return { h: h * 360, s: s * 100, l: l * 100 };
};

/**
 * Convert HSL to RGB
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {Object} RGB object with r, g, b properties
 */
const hslToRgb = (h, s, l) => {
  h /= 360;
  s /= 100;
  l /= 100;
  
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
};
