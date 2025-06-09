import { removeBackgroundLocal } from '../lib/removeBackground';
import { applyBackgroundColor } from './utils';
import { getWrappedLines } from './utils'; // For text wrapping in bubbles

/**
 * Processes the background of an image blob:
 * - Optionally removes the background
 * - Optionally applies a solid color or pattern background
 * - Returns a new image blob
 */
export async function processBackground(blob, {
  keepOriginalBg,
  backgroundColor,
  backgroundType,
  customBackgrounds
}) {
  // If user wants to keep the original background, return the original blob
  if (keepOriginalBg) {
    return blob;
  }

  // Remove the background from the image
  const bgRemoved = await removeBackgroundLocal(blob);

  // If background removal failed, return the error for the caller to handle
  if (!bgRemoved || bgRemoved instanceof Error || (typeof bgRemoved === 'object' && bgRemoved.error)) {
    return bgRemoved;
  }

  // If a solid background color is selected, apply it behind the subject
  if (backgroundColor) {
    return await applyBackgroundColor(bgRemoved, backgroundColor);
  }

  // If a pattern background is selected, draw the pattern behind the subject
  const patternTypes = customBackgrounds.map(bg => bg.title);
  if (patternTypes.includes(backgroundType)) {
    // Create a canvas and draw the pattern and subject
    const img = await createImageBitmap(bgRemoved);
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');

    // Prepare the pattern image
    const patternImg = new window.Image();
    const patternMap = Object.fromEntries(customBackgrounds.map(bg => [bg.title, bg.img]));
    patternImg.src = patternMap[backgroundType];
    await new Promise((res) => { patternImg.onload = res; });

    // Draw the pattern as the background
    ctx.drawImage(patternImg, 0, 0, canvas.width, canvas.height);
    // Draw the subject (foreground) on top
    ctx.drawImage(img, 0, 0);

    // Convert the canvas to a PNG blob and return it
    return await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/png')
    );
  }

  // If no color or pattern, just return the background-removed blob
  return bgRemoved;
}

/**
 * Draws emoji text, quote bubble, and tail decorations on a canvas context.
 * Handles text wrapping, font styling, and bubble/tail geometry.
 */
export function drawTextAndDecorations(ctx, options) {
  const {
    emojiText,
    fontSize,
    fontColor,
    isBold,
    isQuoteBubble,
    textPosition,
    textBoxSize,
    tailBase,
    arrowTip,
    scaleX,
    scaleY,
  } = options;

  // --- Draw quote bubble if enabled ---
  if (isQuoteBubble && emojiText) {
    ctx.save();
    ctx.fillStyle = 'white';      // Bubble fill color
    ctx.strokeStyle = '#333';     // Bubble border color
    ctx.lineWidth = 3;

    // Calculate bubble rectangle and corner radius
    const bubbleX = textPosition.x * scaleX;
    const bubbleY = textPosition.y * scaleY;
    const bubbleW = textBoxSize.width * scaleX;
    const bubbleH = textBoxSize.height * scaleY;
    const radius = 18 * scaleX;

    // Draw rounded rectangle for the bubble
    ctx.beginPath();
    ctx.moveTo(bubbleX + radius, bubbleY);
    ctx.lineTo(bubbleX + bubbleW - radius, bubbleY);
    ctx.quadraticCurveTo(bubbleX + bubbleW, bubbleY, bubbleX + bubbleW, bubbleY + radius);
    ctx.lineTo(bubbleX + bubbleW, bubbleY + bubbleH - radius);
    ctx.quadraticCurveTo(bubbleX + bubbleW, bubbleY + bubbleH, bubbleX + bubbleW - radius, bubbleY + bubbleH);
    ctx.lineTo(bubbleX + radius, bubbleY + bubbleH);
    ctx.quadraticCurveTo(bubbleX, bubbleY + bubbleH, bubbleX, bubbleY + bubbleH - radius);
    ctx.lineTo(bubbleX, bubbleY + radius);
    ctx.quadraticCurveTo(bubbleX, bubbleY, bubbleX + radius, bubbleY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // --- Draw the bubble tail (arrow) ---
    const offset = 12 * scaleX;
    // Calculate base and tip of the tail, scaled to canvas
    const scaledTailBase = {
      x: (textPosition.x + tailBase.x) * scaleX,
      y: (textPosition.y + tailBase.y) * scaleY
    };
    const scaledArrowTip = {
      x: (textPosition.x + arrowTip.x) * scaleX,
      y: (textPosition.y + arrowTip.y) * scaleY
    };
    let base1, base2;
    // Determine which side the tail is on and set base points accordingly
    if (tailBase.y === 0) { // top
      base1 = { x: scaledTailBase.x - offset, y: scaledTailBase.y };
      base2 = { x: scaledTailBase.x + offset, y: scaledTailBase.y };
    } else if (tailBase.y === textBoxSize.height) { // bottom
      base1 = { x: scaledTailBase.x - offset, y: scaledTailBase.y };
      base2 = { x: scaledTailBase.x + offset, y: scaledTailBase.y };
    } else if (tailBase.x === 0) { // left
      base1 = { x: scaledTailBase.x, y: scaledTailBase.y - offset };
      base2 = { x: scaledTailBase.x, y: scaledTailBase.y + offset };
    } else if (tailBase.x === textBoxSize.width) { // right
      base1 = { x: scaledTailBase.x, y: scaledTailBase.y - offset };
      base2 = { x: scaledTailBase.x, y: scaledTailBase.y + offset };
    } else {
      // Default: bottom center
      base1 = { x: scaledTailBase.x - offset, y: scaledTailBase.y };
      base2 = { x: scaledTailBase.x + offset, y: scaledTailBase.y };
    }
    // Draw the tail triangle
    ctx.beginPath();
    ctx.moveTo(base1.x, base1.y);
    ctx.lineTo(base2.x, base2.y);
    ctx.lineTo(scaledArrowTip.x, scaledArrowTip.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // --- Draw emoji text (with wrapping and styling) ---
  if (emojiText) {
    const overlayFontSize = fontSize;
    const fontWeight = isBold ? 'bold' : 'normal';
    ctx.font = `${fontWeight} ${overlayFontSize * scaleY}px sans-serif`;
    ctx.fillStyle = fontColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;

    // Calculate max width for text wrapping
    const maxWidth = textBoxSize.width * scaleX;
    // Get wrapped lines using helper
    const lines = getWrappedLines(ctx, emojiText, maxWidth);
    const lineHeight = overlayFontSize * scaleY * 1.2;
    const padding = 4 * scaleY;
    // Center text horizontally in the box
    const drawX = (textPosition.x + textBoxSize.width / 2) * scaleX;
    let drawY;
    // Vertically center text if in a quote bubble, otherwise use padding
    if (isQuoteBubble) {
      const totalTextHeight = lines.length * lineHeight;
      drawY = (textPosition.y * scaleY) + ((textBoxSize.height * scaleY - totalTextHeight) / 2);
    } else {
      drawY = textPosition.y * scaleY + padding;
    }
    // Draw each line with stroke (outline) and fill (main color)
    lines.forEach((line, i) => {
      ctx.strokeText(line, drawX, drawY + i * lineHeight);
      ctx.fillText(line, drawX, drawY + i * lineHeight);
    });
  }
}