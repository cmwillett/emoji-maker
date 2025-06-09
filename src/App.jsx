import { useState, useCallback, useEffect } from 'react'
// Utility and helper imports
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
import { incrementEmojiCount, fetchEmojiCount } from './utils/utils';
import OptionsTabs from './components/OptionsTabs';
import ResetCreatePanel from './components/ResetCreatePanel';
import customBackgrounds from './constants/customBackgrounds';
import { processBackground } from './utils/imageProcessing';
import { drawTextAndDecorations } from './utils/imageProcessing';
import { buttonBase } from './lib/classNames';

// Main App component
export default function App() {
  // --- State variables for all app logic and UI ---
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
  const cropperDiameter = 256; // Used for preview font sizing
  // Preview canvas for internal calculations (not shown in UI)
  const previewCanvas = document.createElement('canvas');
  const previewCtx = previewCanvas.getContext('2d');
  previewCtx.font = `bold ${Math.floor(cropperDiameter / 8)}px sans-serif`;
  const [keepOriginalBg, setKeepOriginalBg] = useState(true);
  const [bgRemovedPreview, setBgRemovedPreview] = useState(null);
  const patternTypes = customBackgrounds.map(bg => bg.type);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [textBoxSize, setTextBoxSize] = useState({ width: 180, height: 60 });
  const [isQuoteBubble, setIsQuoteBubble] = useState(false);
  const [tailBase, setTailBase] = useState({ x: textBoxSize.width / 2, y: textBoxSize.height });
  const [arrowTip, setArrowTip] = useState({ x: textBoxSize.width / 2, y: textBoxSize.height + 24 });

  // --- Emoji counter state and fetch on mount ---
  const [emojiCount, setEmojiCount] = useState(null);
  useEffect(() => {
    fetchEmojiCount(setEmojiCount);
  }, []);

  // --- Adjust zoom and crop when a new image is uploaded ---
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

  // --- Listen for PWA install prompt and show install button ---
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

  // --- Handler for resizing the text box and repositioning the quote bubble tail ---
  const handleResizeTextBox = (newSize) => {
    setTextBoxSize(newSize);
    // Move tail to center bottom of new box
    setTailBase({ x: newSize.width / 2, y: newSize.height });
    setArrowTip({ x: newSize.width / 2, y: newSize.height + 24 });
  };  

  // --- Handler for PWA install button ---
  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null)
        setShowInstall(false)
      })
    }
  }

  // --- Handler for crop completion from the cropper ---
  const onCropComplete = useCallback(async (_, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, [imageSrc, keepOriginalBg]);

  // --- Main function: crop, process, decorate, and export the emoji/meme image ---
  const showCroppedImage = useCallback(async () => {
    setCroppedImage(null); // Hide preview and buttons immediately
    try {
      setLoading(true); // Show loading indicator

      // Step 1: Crop the image to the selected area
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels, 'image/png', true);
      console.log("Cropped blob:", blob);

      // Step 2: Handle background logic (removal, color, pattern)
      let finalBlob = await processBackground(blob, {
        keepOriginalBg,
        backgroundColor,
        backgroundType,
        customBackgrounds
      });

      // Step 3: Prepare canvas for drawing
      // Create a canvas and draw the processed image onto it
      const img = await createImageBitmap(finalBlob);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      // Calculate scaling for decorations/text
      const previewWidth = 320;
      const previewHeight = 320;
      const scaleX = canvas.width / previewWidth;
      const scaleY = canvas.height / previewHeight;

      // Step 4: Draw text, quote bubble, and decorations
      drawTextAndDecorations(ctx, {
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
      });

      // Step 5: Convert canvas to blob for export/preview
      const withTextBlob = await new Promise((resolve) =>
        canvas.toBlob(resolve, 'image/png')
      );

      console.log("Final blob:", finalBlob);

      // Step 6: Show the final image in the UI
      const finalUrl = URL.createObjectURL(withTextBlob);
      console.log("Final image URL:", finalUrl);
      setCroppedImage(finalUrl);

      // Step 7: Increment emoji/meme counter
      await incrementEmojiCount(setEmojiCount);

    } catch (e) {
      // Error handling for any step above
      console.error(e);
      setErrorMessage(e.message || 'Something went wrong while processing the image.');
      setShowErrorModal(true);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  }, [
    imageSrc, croppedAreaPixels, backgroundColor, emojiText, fontColor, fontSize, isBold,
    isQuoteBubble, arrowTip, tailBase, keepOriginalBg, backgroundType, textBoxSize, textPosition
  ]); // End of showCroppedImage

  // --- Handler to reset all states and UI to initial values ---
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
    handleResizeTextBox({ width: 180, height: 60 });
    setTextPosition({ x: 0, y: 0 });
    setIsQuoteBubble(false); // Reset quote bubble checkbox
    setTailBase({ x: 90, y: 60 }); // Reset tailBase to default (center bottom of default box)
    setArrowTip({ x: 90, y: 84 }); // Reset arrowTip to default (below the box)
  }

  // --- Style for the crop container (round or square) ---
  const cropContainerStyle = {
    backgroundColor: '#fff',
    border: 'none',
    borderRadius: isRound ? '9999px' : '0.5rem',
    boxShadow: 'none',
    overflow: 'hidden',
    width: '100%',
    height: '100%',
  }

  // --- Main render: UI layout and all components ---
  return (
    // Main app container with background image and styles
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen space-y-4 p-4"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>

      {/* Overlay for darkening background */}
      <div className="absolute inset-0 bg-black bg-opacity-30 z-0 pointer-events-none"></div> 
      {/* Header and emoji count */}
      {!imageSrc && <Header emojiCount={emojiCount} />}
      
      {/* Upload buttons (shown if no image is selected) */}
      {!imageSrc && <UploadButtons onImageSelect={setImageSrc} />}

      {/* Image cropper and options (shown if image is selected) */}
      {imageSrc && (
        <>
          {/* Cropper section with all cropping and text controls */}
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
              tailBase={tailBase}
              setTailBase={setTailBase}
              arrowTip={arrowTip}
              setArrowTip={setArrowTip} 
              handleResizeTextBox={handleResizeTextBox}
            />
          </div>

          {/* Tabs for background, text, and style options */}
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
          {/* Panel for reset and create actions */}
          <ResetCreatePanel
            onReset={handleReset}
            onCreate={showCroppedImage}
          />
        </>
      )}

      {/* Loading indicator shown during processing */}
      {loading && <LoadingIndicator />}

      {/* Cropped emoji preview with share/download actions */}
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
                //text: "Check out this emoji I made!",
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
      {/* Install PWA/share buttons */}
      <InstallShareButtons showInstall={showInstall} handleInstallClick={handleInstallClick} />

      {/* Error modal for user feedback */}
      <ErrorModal
        open={showErrorModal}
        errorMessage={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />

      {/* Contact modal for user messages */}
      <ContactModal
        open={showContactModal}
        onClose={() => setShowContactModal(false)}
        contactForm={contactForm}
        setContactForm={setContactForm}
        contactSubmitted={contactSubmitted}
        setContactSubmitted={setContactSubmitted}
      />

      {/* About modal for app info */}
      <AboutModal
        open={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />

      {/* Footer with About and Contact links */}
      <Footer
        onAbout={() => setShowAboutModal(true)}
        onContact={() => {
          setContactSubmitted(false); // Reset submitted state
          setContactForm({ name: '', email: '', message: '' }); // Optionally clear form fields
          setShowContactModal(true);
        }}
      />
      {/* Floating reset button (shown if image is loaded) */}
      {imageSrc && (
        <button
          onClick={handleReset}
          className={`${buttonBase} fixed bottom-8 right-8 z-50 py-4 px-6 rounded-full shadow-lg transition-all duration-200 bg-red-500 hover:bg-red-600`}
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