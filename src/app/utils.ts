export class ColorFader {
  fadeColor(startColor: string, endColor: string, duration: number, callback: (color: string) => void) {
    const start = performance.now();

    const animate = (time: number) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1); // Ensure progress does not exceed 1

      // Get the interpolated color
      const color = this.interpolateColor(startColor, endColor, progress);

      // Call the callback with the interpolated color
      callback(color);

      // Continue the animation if not completed
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  fadeColorSquare(startColor: string, endColor: string, duration: number, callback: (color: string) => void) {
    const start = this.parseColor(startColor);
    const end = this.parseColor(endColor);
    const steps = duration / 16; // Roughly 60 frames per second
    let currentStep = 0;

    const interval = setInterval(() => {
      const r = Math.round(start.r + (end.r - start.r) * (currentStep / steps));
      const g = Math.round(start.g + (end.g - start.g) * (currentStep / steps));
      const b = Math.round(start.b + (end.b - start.b) * (currentStep / steps));

      const color = `rgb(${r},${g},${b})`;
      callback(color);

      currentStep++;

      if (currentStep >= steps) {
        clearInterval(interval);
        callback(endColor); // Ensure the final color is set
      }
    }, 16);
  }

  // Convert hex to RGB
  private hexToRgba(hex: string): [number, number, number, number] {
    let r = 0, g = 0, b = 0, a = 1;

    if (hex.length === 5) { // #RGBA format
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
      a = parseInt(hex[4] + hex[4], 16) / 255;
    } else if (hex.length === 9) { // #RRGGBBAA format
      r = parseInt(hex[1] + hex[2], 16);
      g = parseInt(hex[3] + hex[4], 16);
      b = parseInt(hex[5] + hex[6], 16);
      a = parseInt(hex[7] + hex[8], 16) / 255;
    } else if (hex.length === 4) { // #RGB format
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) { // #RRGGBB format
      r = parseInt(hex[1] + hex[2], 16);
      g = parseInt(hex[3] + hex[4], 16);
      b = parseInt(hex[5] + hex[6], 16);
    }

    return [r, g, b, a];
  }

// Convert RGBA to hex
  private rgbaToHex(r: number, g: number, b: number, a: number): string {
    const hexAlpha = Math.round(a * 255).toString(16).padStart(2, '0');
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('') + hexAlpha;
  }

// Interpolate between two colors, including opacity
  private interpolateColor(color1: string, color2: string, factor: number): string {
    const [r1, g1, b1, a1] = this.hexToRgba(color1);
    const [r2, g2, b2, a2] = this.hexToRgba(color2);

    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);
    const a = a1 + (a2 - a1) * factor;

    return this.rgbaToHex(r, g, b, a);
  }

  private parseColor(color: string) {
    // Assuming color is in the form "#RRGGBB"
    const bigint = parseInt(color.slice(1), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  }

  getContrastColor(hexColor: string): string {
    // Remove the '#' if it's present
    const color = hexColor.replace(/^#/, '');

    // Parse r, g, b values
    const r = parseInt(color.slice(0, 2), 16) / 255;
    const g = parseInt(color.slice(2, 4), 16) / 255;
    const b = parseInt(color.slice(4, 6), 16) / 255;

    // Calculate the relative luminance
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    // If luminance is greater than 0.5, return black; otherwise, return white
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  }
}

export class MusicFader {
  async fadeOut(audio: HTMLAudioElement, time: number) {
    for (let i = 99; i > 0; i--) {
      audio.volume = i / 100;
      await new Promise(resolve => setTimeout(resolve, time / 100));
    }
    audio.pause();
    audio.volume = 1;
  }
}
