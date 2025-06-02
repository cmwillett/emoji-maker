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
import Draggable from 'react-draggable';
import EmojiTextOverlay from './components/EmojiTextOverlay';
import EmojiActions from './components/EmojiActions';
import OptionsTabs from './components/OptionsTabs';
import ResetCreatePanel from './components/ResetCreatePanel';

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
  const cropperDiameter = 256; // or whatever your cropper's pixel size is
  const previewCanvas = document.createElement('canvas');
  const previewCtx = previewCanvas.getContext('2d');
  previewCtx.font = `bold ${Math.floor(cropperDiameter / 8)}px sans-serif`;
  const [keepOriginalBg, setKeepOriginalBg] = useState(true);

  //Fetch initial emoji count
  const [emojiCount, setEmojiCount] = useState(null);
  useEffect(() => {
    fetchEmojiCount(setEmojiCount);
  }, []);

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
  const onCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels)
  }, [])

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

        if (backgroundType === 'bubbles' || backgroundType === 'fire' || backgroundType === 'clouds' || backgroundType === 'forest trail') {
            const img = await createImageBitmap(bgRemoved);
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            // Draw pattern
            const patternImg = new window.Image();
            const patternMap = {
              bubbles: '/bubbles.png',
              fire: '/fire.png',
              clouds: '/clouds.png',
              'forest trail': '/forestTrail.jpg'
            }
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
      if (emojiText) {
        ctx.font = `bold ${Math.floor(canvas.height / 12)}px sans-serif`;
        ctx.fillStyle = fontColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4;

        // Use a diameter-based maxWidth for circular output
        const circleDiameter = Math.min(canvas.width, canvas.height);
        const maxWidth = circleDiameter * 0.65; // 65% for extra padding
        const lineHeight = Math.floor(canvas.height / 8) * 1.2;

        // Get wrapped lines using your imported getWrappedLines
        const lines = getWrappedLines(ctx, emojiText, maxWidth);

        // Center the block vertically in the circle
        // Bottom-align the block in the circle
        const startY = canvas.height - (lines.length * lineHeight) + lineHeight / 5;

        // Draw each line upward from the bottom
        lines.forEach((line, i) => {
          ctx.strokeText(line.trim(), canvas.width / 2, startY + i * lineHeight);
          ctx.fillText(line.trim(), canvas.width / 2, startY + i * lineHeight);
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
  }, [imageSrc, croppedAreaPixels, backgroundColor, emojiText, fontColor, keepOriginalBg, backgroundType]);

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
  }

  //Style for the crop container
  const cropContainerStyle = {
    backgroundColor: '#fff',
    border: 'none',
    borderRadius: isRound ? '9999px' : '0.5rem',
    boxShadow: 'none',
    overflow: 'hidden',
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
      <Header emojiCount={emojiCount} />
      <InstallShareButtons showInstall={showInstall} handleInstallClick={handleInstallClick} />
      
      {/*Show the upload buttons if no image is selected*/}
      {!imageSrc && <UploadButtons onImageSelect={setImageSrc} />}

      {/*Show the image cropper section if an image is selected*/}
      {imageSrc && (
        <>
          {/* Show the cropper options, including emoji text and background */}
          <div className="relative w-fit mx-auto">
            <CropperSection
              imageSrc={imageSrc}
              crop={crop}
              setCrop={setCrop}
              zoom={zoom}
              setZoom={setZoom}
              onCropComplete={onCropComplete}
              cropContainerStyle={cropContainerStyle}
            />
            {/* Show the emoji text overlay if emojiText is set */}
            {emojiText && (
              <EmojiTextOverlay
                emojiText={emojiText}
                previewCtx={previewCtx}
                cropperDiameter={cropperDiameter}
                fontColor={fontColor}
              />
            )}
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
            presetTextColors={[
              "#ffffff", "#000000", "#ff0000", "#00ff00", "#0000ff",
              "#ffa500", "#800080", "#00ffff", "#ff69b4", "#ffd700", "#87ceeb"
            ]}
          />
          <ResetCreatePanel
            onReset={handleReset}
            onCreate={showCroppedImage}
          />
          {/* Show the emoji actions for customization 
          <EmojiActions
            backgroundColor={backgroundColor}
            setBackgroundColor={setBackgroundColor}
            isRound={isRound}
            setIsRound={setIsRound}
            emojiText={emojiText}
            setEmojiText={setEmojiText}
            fontColor={fontColor}
            setFontColor={setFontColor}
            onCrop={showCroppedImage}
            onReset={handleReset}
            keepOriginalBg={keepOriginalBg}
            setKeepOriginalBg={setKeepOriginalBg}
          /> */}
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
    </div>
  )
}
