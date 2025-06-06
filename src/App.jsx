import { useState, useCallback, useEffect } from 'react'
import getCroppedImg from './utils/utils'
import Header from './components/Header';
import InstallShareButtons from './components/InstallShareButtons';
import CropperSection from './components/CropperSection';
import EmojiPreview from './components/EmojiPreview';
import LoadingIndicator from './components/LoadingIndicator';
import ErrorModal from './components/ErrorModal';
import UploadButtons from './components/UploadButtons';
import ContactModal from './components/ContactModal';
import AboutModal from './components/AboutModal';
import Footer from './components/Footer';
import { applyBackgroundColor, incrementEmojiCount, fetchEmojiCount } from './utils/utils';
import { removeBackgroundLocal } from './lib/removeBackground';
import { getWrappedLines } from './utils/utils';
import OptionsTabs from './components/OptionsTabs';
import ResetCreatePanel from './components/ResetCreatePanel';
import customBackgrounds from './constants/customBackgrounds';

//Main App component
export default function App() {
  const [loading, setLoading] = useState(false)
  const [imageSrc, setImageSrc] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [croppedImage, setCroppedImage] = useState(null)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstall, setShowInstall] = useState(false)
  const [backgroundColor, setBackgroundColor] = useState('')
  const [backgroundType, setBackgroundType] = useState('original'); // 'original', 'remove', 'color', 'bubbles', 'fire'
  const [isRound, setIsRound] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [emojiText, setEmojiText] = useState('');
  const [fontColor, setFontColor] = useState('#ffffff'); // Default to white
  const [fontSize, setFontSize] = useState(24); // default size
  const [isBold, setIsBold] = useState(true);   // default bold  
  const cropperDiameter = 256; // or whatever your cropper's pixel size is
  const previewCanvas = document.createElement('canvas');
  const previewCtx = previewCanvas.getContext('2d');
  previewCtx.font = `bold ${Math.floor(cropperDiameter / 8)}px sans-serif`;
  const [keepOriginalBg, setKeepOriginalBg] = useState(true);
  const [bgRemovedPreview, setBgRemovedPreview] = useState(null);
  const patternTypes = customBackgrounds.map(bg => bg.type);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [textBoxSize, setTextBoxSize] = useState({ width: 180, height: 60 });
  const [isQuoteBubble, setIsQuoteBubble] = useState(false);

  //Fetch initial emoji count
  const [emojiCount, setEmojiCount] = useState(null);
  useEffect(() => {
    fetchEmojiCount(setEmojiCount);
  }, []);

  //initial image upload handler
  useEffect(() => {
    if (!imageSrc) return;

    const img = new window.Image();
    img.src = imageSrc;
    img.onload = () => {
      const imgAspect = img.width / img.height;
      const cropperAspect = 1; // square

      let newZoom;
      if (imgAspect > cropperAspect) {
        newZoom = 320 / img.height;
      } else {
        newZoom = 320 / img.width;
      }
      // Never zoom out smaller than 1:1 (natural size)
      newZoom = Math.max(newZoom, 1);
      setZoom(newZoom);
      setCrop({ x: 0, y: 0 });
    };
  }, [imageSrc]);  

  //Window event listener for PWA install prompt
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handler = (e) => {
        e.preventDefault()
        setDeferredPrompt(e)
        setShowInstall(true)
      }

      window.addEventListener('beforeinstallprompt', handler)

      return () => {
        window.removeEventListener('beforeinstallprompt', handler)
      }
    }
  }, [])

  //Install PWA handler
  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null)
        setShowInstall(false)
      })
    }
  }

  //Crop complete handler
  const onCropComplete = useCallback(async (_, areaPixels) => {
    setCroppedAreaPixels(areaPixels);

    // Only remove background if needed
    /*if (!keepOriginalBg && imageSrc && areaPixels) {
      console.log("I'm here");
      const blob = await getCroppedImg(imageSrc, areaPixels, 'image/png', true);
      const bgRemoved = await removeBackgroundLocal(blob);
      setBgRemovedPreview(URL.createObjectURL(bgRemoved));
    } else {
      setBgRemovedPreview(null);
    }*/
  }, [imageSrc, keepOriginalBg]);

  //Function to show cropped image and process it
  const showCroppedImage = useCallback(async () => {
    setCroppedImage(null); // Hide preview and buttons immediately
    try {
      setLoading(true);

      // Step 1: Crop the image
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels, 'image/png', true);
      console.log("Cropped blob:", blob);

      // Step 2: Handle background logic
      let finalBlob;
      console.log("Keep original background:", keepOriginalBg);
      if (keepOriginalBg) {
        // Skip background removal and coloring, use original cropped blob
        finalBlob = blob;
      } else {
        // Remove the background
        const bgRemoved = await removeBackgroundLocal(blob);
        console.log("Background removed:", bgRemoved);

        // Handle specific error conditions
        if (!bgRemoved || bgRemoved instanceof Error || (typeof bgRemoved === 'object' && bgRemoved.error)) {
          if (bgRemoved?.error === 'no_foreground') {
            setErrorMessage("We couldn't detect a clear subject in the image. Try cropping closer or using a photo with more contrast.");
          } else {
            setErrorMessage("Something went wrong while removing the background. Please try again with a different image.");
          }
          setShowErrorModal(true);
          return;
        }

        // Apply background color if selected
        if (backgroundColor) {
          finalBlob = await applyBackgroundColor(bgRemoved, backgroundColor);
        } else {
          finalBlob = bgRemoved;
        }

        const patternTypes = customBackgrounds.map(bg => bg.type);

        if (patternTypes.includes(backgroundType)) {
            const img = await createImageBitmap(bgRemoved);
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            // Draw pattern
            const patternImg = new window.Image();
            const patternMap = Object.fromEntries(customBackgrounds.map(bg => [bg.type, bg.img]));
            patternImg.src = patternMap[backgroundType];
            await new Promise((res) => { patternImg.onload = res; });
            ctx.drawImage(patternImg, 0, 0, canvas.width, canvas.height);
            // Draw subject on top
            ctx.drawImage(img, 0, 0);
            // Convert to blob
            finalBlob = await new Promise((resolve) =>
              canvas.toBlob(resolve, 'image/png')
            );
        }
      }

      //Step 5: Convert blob to image
      const img = await createImageBitmap(finalBlob);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (isRound) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(
          canvas.width / 2,
          canvas.height / 2,
          Math.min(canvas.width, canvas.height) / 2,
          0,
          Math.PI * 2
        );
        ctx.closePath();
        ctx.clip();
      }

      //Step 6: Draw the image onto the canvas
      ctx.drawImage(img, 0, 0);

      //Step 7: Draw text (customize font, color, position as needed)
      const previewWidth = 320;  // width of your overlay
      const previewHeight = 320; // height of your overlay

      const scaleX = canvas.width / previewWidth;
      const scaleY = canvas.height / previewHeight;

      if (isQuoteBubble && emojiText) {
        ctx.save();
        ctx.fillStyle = 'white'; // or your bubble color
        ctx.strokeStyle = '#333'; // outline color
        ctx.lineWidth = 3;

        // Draw rounded rectangle for bubble
        const bubbleX = textPosition.x * scaleX;
        const bubbleY = textPosition.y * scaleY;
        const bubbleW = textBoxSize.width * scaleX;
        const bubbleH = textBoxSize.height * scaleY;
        const radius = 18 * scaleX;

        // Rounded rect
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

        // Draw a small "tail" for the bubble
        ctx.beginPath();
        ctx.moveTo(bubbleX + bubbleW * 0.2, bubbleY + bubbleH);
        ctx.lineTo(bubbleX + bubbleW * 0.2 + 12 * scaleX, bubbleY + bubbleH + 18 * scaleY);
        ctx.lineTo(bubbleX + bubbleW * 0.2 + 24 * scaleX, bubbleY + bubbleH);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      }      

      if (emojiText) {
        const overlayFontSize = fontSize;
        const fontWeight = isBold ? 'bold' : 'normal';
        ctx.font = `${fontWeight} ${overlayFontSize * scaleY}px sans-serif`;
        ctx.fillStyle = fontColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4;

        const maxWidth = textBoxSize.width * scaleX;
        const lines = getWrappedLines(ctx, emojiText, maxWidth);
        const lineHeight = overlayFontSize * scaleY * 1.2;
        const padding = 4 * scaleY;

        const drawX = (textPosition.x + textBoxSize.width / 2) * scaleX;

        let drawY;
        if (isQuoteBubble) {
          // Center vertically in the bubble
          const totalTextHeight = lines.length * lineHeight;
          drawY = (textPosition.y * scaleY) + ((textBoxSize.height * scaleY - totalTextHeight) / 2);
        } else {
          // Original logic (top of box + padding)
          drawY = textPosition.y * scaleY + padding;
        }

        lines.forEach((line, i) => {
          ctx.strokeText(line, drawX, drawY + i * lineHeight);
          ctx.fillText(line, drawX, drawY + i * lineHeight);
        });
      }

      //Step 8: Restore context if using round crop
      if (isRound) {
        ctx.restore();
      }

      //Step 9: Convert canvas back to blob
      const withTextBlob = await new Promise((resolve) =>
        canvas.toBlob(resolve, 'image/png')
      );

      console.log("Final blob:", finalBlob);

      // Step 10: Generate final image preview
      const finalUrl = URL.createObjectURL(withTextBlob);
      console.log("Final image URL:", finalUrl);
      setCroppedImage(finalUrl);

      // Step 11: Increment the emoji counter
      await incrementEmojiCount(setEmojiCount);
    } catch (e) {
        console.error(e);
        setErrorMessage(e.message || 'Something went wrong while processing the image.');
        setShowErrorModal(true);
      } finally {
            setLoading(false);
    }
  }, [imageSrc, croppedAreaPixels, backgroundColor, emojiText, fontColor, fontSize, isBold, isQuoteBubble, keepOriginalBg, backgroundType, textBoxSize, textPosition]);

  //Reset handler to clear all states
  const handleReset = () => {
    setImageSrc(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
    setCroppedImage(null)
    setEmojiText('')
    setBackgroundColor('')
    setBackgroundType('original')
    setKeepOriginalBg(true)
    setIsRound(false)
    setFontColor('#ffffff') // Reset to default white
    setBgRemovedPreview(null);
    setTextBoxSize({ width: 180, height: 60 });
    setTextPosition({ x: 0, y: 0 });
  }

  //Style for the crop container
  const cropContainerStyle = {
    backgroundColor: '#fff',
    border: 'none',
    borderRadius: isRound ? '9999px' : '0.5rem',
    boxShadow: 'none',
    overflow: 'hidden',
    width: '100%',
    height: '100%',
  }

  //Render the frontend UI
  return (
    // Main app container with background image and styles
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen space-y-4 p-4"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>

      {/*Set the header, emoji count, and install/share buttons*/}
      <div className="absolute inset-0 bg-black bg-opacity-30 z-0 pointer-events-none"></div> 
      {!imageSrc && <Header emojiCount={emojiCount} />}
      
      {/*Show the upload buttons if no image is selected*/}
      {!imageSrc && <UploadButtons onImageSelect={setImageSrc} />}

      {/*Show the image cropper section if an image is selected*/}
      {imageSrc && (
        <>
          {/* Show the cropper options, including emoji text and background */}
          <div className="relative w-fit mx-auto">
            <CropperSection
              imageSrc={bgRemovedPreview || imageSrc}
              crop={crop}
              setCrop={setCrop}
              zoom={zoom}
              setZoom={setZoom}
              onCropComplete={onCropComplete}
              cropContainerStyle={cropContainerStyle}
              backgroundType={backgroundType}
              backgroundColor={backgroundColor}
              patternTypes={patternTypes}
              emojiText={emojiText}
              fontColor={fontColor}
              fontSize={fontSize}
              setFontSize={setFontSize}
              isBold={isBold}
              setIsBold={setIsBold}
              isQuoteBubble={isQuoteBubble}
              setIsQuoteBubble={setIsQuoteBubble}
              textPosition={textPosition}
              setTextPosition={setTextPosition}
              textBoxSize={textBoxSize}
              setTextBoxSize={setTextBoxSize}
            />
          </div>

          <OptionsTabs
            backgroundColor={backgroundColor}
            setBackgroundColor={setBackgroundColor}
            backgroundType={backgroundType}
            setBackgroundType={setBackgroundType}
            keepOriginalBg={keepOriginalBg}
            setKeepOriginalBg={setKeepOriginalBg}
            isRound={isRound}
            setIsRound={setIsRound}
            emojiText={emojiText}
            setEmojiText={setEmojiText}
            fontColor={fontColor}
            setFontColor={setFontColor}
            fontSize={fontSize}
            setFontSize={setFontSize}
            isBold={isBold}
            setIsBold={setIsBold}
            isQuoteBubble={isQuoteBubble}
            setIsQuoteBubble={setIsQuoteBubble}
            presetTextColors={[
              "#ffffff", "#000000", "#ff0000", "#00ff00", "#0000ff",
              "#ffa500", "#800080", "#00ffff", "#ff69b4", "#ffd700", "#87ceeb"
            ]}
          />
          <ResetCreatePanel
            onReset={handleReset}
            onCreate={showCroppedImage}
          />
        </>
      )}

      {/* Show the 'processing emoji line' if loading */}
      {loading && <LoadingIndicator />}

      {/* Set the cropped emoji preview, with the share and download buttons */}
      <EmojiPreview
        croppedImage={croppedImage}
        isRound={isRound}
        onShareMobile={async () => {
          try {
            const response = await fetch(croppedImage);
            const blob = await response.blob();
            const file = new File([blob], "emoji.png", { type: blob.type });

            if (navigator.share && navigator.canShare?.({ files: [file] })) {
              await navigator.share({
                title: "My Custom Emoji",
                text: "Check out this emoji I made!",
                files: [file],
              });
            } else {
              alert("❌ Mobile sharing not supported on this device.");
            }
          } catch (error) {
            console.error(error);
            alert("❌ Failed to share via mobile.");
          }
        }}
        onShareClipboard={async () => {
          try {
            const response = await fetch(croppedImage);
            const blob = await response.blob();

            if (navigator.clipboard && window.ClipboardItem) {
              const item = new ClipboardItem({ [blob.type]: blob });
              await navigator.clipboard.write([item]);
              alert("✅ Emoji image copied! You can now paste it into messaging apps.");
            } else {
              alert("❌ Image clipboard not supported on this browser.");
            }
          } catch (err) {
            console.error(err);
            alert("❌ Failed to copy image to clipboard.");
          }
        }}
        onDownload={() => {
          const defaultName = "emoji";
          const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
          const tempName = `${defaultName}-${timestamp}`;
          const userInput = prompt("Enter filename (without extension):", tempName);

          if (userInput === null) return;

          const finalName = `${userInput || defaultName}.png`;
          const link = document.createElement("a");
          link.href = croppedImage;
          link.download = finalName;
          link.click();
        }}
      />
      <InstallShareButtons showInstall={showInstall} handleInstallClick={handleInstallClick} />

      {/* Show the error modal if there's an error */}
      <ErrorModal
        open={showErrorModal}
        errorMessage={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />

      {/* Show the contact modal if contact is clicked */}
      <ContactModal
        open={showContactModal}
        onClose={() => setShowContactModal(false)}
        contactForm={contactForm}
        setContactForm={setContactForm}
        contactSubmitted={contactSubmitted}
        setContactSubmitted={setContactSubmitted}
      />

      {/* Show the about modal if about is clicked */}
      <AboutModal
        open={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />

      {/* Footer with about and contact links */}
      <Footer
        onAbout={() => setShowAboutModal(true)}
        onContact={() => setShowContactModal(true)}
      />
      {/* Reset button to clear all options and upload a new image */}
      {imageSrc && (
        <button
          onClick={handleReset}
          className="fixed bottom-8 right-8 z-50 bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-full shadow-lg transition-all duration-200"
          style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.25)' }}
          aria-label="Start Over"
          title="Reset all options and upload a new image!"
        >
          Start Over
        </button>
      )}
    </div>
  )
}
