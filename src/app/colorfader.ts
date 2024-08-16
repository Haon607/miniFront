import { animate } from "@angular/animations";

export class ColorFader {
  // Convert hex to RGB
  private hexToRgb(hex: string): [number, number, number] {
    let r = 0, g = 0, b = 0;

    // 3 digits
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    }
    // 6 digits
    else if (hex.length === 7) {
      r = parseInt(hex[1] + hex[2], 16);
      g = parseInt(hex[3] + hex[4], 16);
      b = parseInt(hex[5] + hex[6], 16);
    }

    return [r, g, b];
  }

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

  // Convert RGB to hex
  private rgbToHex(r: number, g: number, b: number): string {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  // Interpolate between two colors
  private interpolateColor(color1: string, color2: string, factor: number): string {
    const [r1, g1, b1] = this.hexToRgb(color1);
    const [r2, g2, b2] = this.hexToRgb(color2);

    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);

    return this.rgbToHex(r, g, b);
  }
}
