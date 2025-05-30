import { useState, useCallback, useEffect } from 'react'
import getCroppedImg from './utils/utils'
import Header from './components/Header';
import InstallShareButtons from './components/InstallShareButtons';
import CropperSection from './components/CropperSection';
import BackgroundColorPicker from './components/BackgroundColorPicker';
import StyleOptions from './components/StyleOptions';
import EmojiPreview from './components/EmojiPreview';
import LoadingIndicator from './components/LoadingIndicator';
import ErrorModal from './components/ErrorModal';
import UploadButtons from './components/UploadButtons';
import ContactModal from './components/ContactModal';
import AboutModal from './components/AboutModal';
import Footer from './components/Footer';
import { applyBackgroundColor, incrementEmojiCount, fetchEmojiCount } from './utils/utils';
import { removeBackgroundLocal } from './lib/removeBackground';
import EmojiTextInput from './components/EmojiTextInput';
import { wrapText } from './utils/utils';
import { getWrappedLines } from './utils/utils';

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
  const [borderStyle, setBorderStyle] = useState('solid')
  const [showShadow, setShowShadow] = useState(true)
  const [isRound, setIsRound] = useState(true)
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [emojiText, setEmojiText] = useState('');
  const [fontColor, setFontColor] = useState('#ffffff'); // Default to white
  const cropperDiameter = 256; // or whatever your cropper's pixel size is

  const [emojiCount, setEmojiCount] = useState(null);
  useEffect(() => {
    fetchEmojiCount(setEmojiCount);
  }, []);

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

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null)
        setShowInstall(false)
      })
    }
  }

  const onCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels)
  }, [])

  const showCroppedImage = useCallback(async () => {
    try {
      setLoading(true);

      // Step 1: Crop the image
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels, 'image/png', true);
      console.log("Cropped blob:", blob);

      // Step 2: Remove the background
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

      // Step 3: Apply background color if selected
      let finalBlob;
      if (backgroundColor) {
        finalBlob = await applyBackgroundColor(bgRemoved, backgroundColor);
      } else {
        finalBlob = bgRemoved;
      }

      // Convert blob to image
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
      ctx.drawImage(img, 0, 0);

      // Draw text (customize font, color, position as needed)
      if (emojiText) {
        ctx.font = `bold ${Math.floor(canvas.height / 8)}px sans-serif`;
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
        const startY = canvas.height / 2 - ((lines.length - 1) / 2) * lineHeight;

        lines.forEach((line, i) => {
          ctx.strokeText(line.trim(), canvas.width / 2, startY + i * lineHeight);
          ctx.fillText(line.trim(), canvas.width / 2, startY + i * lineHeight);
        });
      }

      if (isRound) {
        ctx.restore();
      }

      // Convert canvas back to blob
      const withTextBlob = await new Promise((resolve) =>
        canvas.toBlob(resolve, 'image/png')
      );

      console.log("Final blob:", finalBlob);

      // Step 4: Generate final image preview
      const finalUrl = URL.createObjectURL(withTextBlob);
      console.log("Final image URL:", finalUrl);
      setCroppedImage(finalUrl);

      // Step 5: Increment the emoji counter
      await incrementEmojiCount(setEmojiCount);
    } catch (e) {
        console.error(e);
        setErrorMessage(e.message || 'Something went wrong while processing the image.');
        setShowErrorModal(true);
      } finally {
            setLoading(false);
    }
  }, [imageSrc, croppedAreaPixels, backgroundColor, emojiText, fontColor]);

  const handleReset = () => {
    setImageSrc(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
    setCroppedImage(null)
    setEmojiText('')
  }

  const cropContainerStyle = {
    backgroundColor: backgroundColor || '#fff',
    border: borderStyle === 'solid' ? '4px solid white' : 'none',
    borderRadius: isRound ? '9999px' : '0.5rem',
    boxShadow: showShadow ? '0 10px 15px rgba(0, 0, 0, 0.3)' : 'none',
    overflow: 'hidden',
  }

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen space-y-4 p-4"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
      <div className="absolute inset-0 bg-black bg-opacity-30 z-0 pointer-events-none"></div> 
      <Header emojiCount={emojiCount} />
      <InstallShareButtons showInstall={showInstall} handleInstallClick={handleInstallClick} />
      
      {!imageSrc && <UploadButtons onImageSelect={setImageSrc} />}

      {imageSrc && (
        <>
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
            {emojiText && (
              <div
                className="absolute left-1/2 top-1/2 flex flex-col items-center justify-center"
                style={{
                  transform: 'translate(-50%, -50%)',
                  width: '65%', // match maxWidth/circleDiameter ratio
                  maxWidth: '65%',
                  height: '100%', // fill the cropper area
                  color: fontColor,
                  textShadow: '2px 2px 4px #000',
                  fontWeight: 'bold',
                  fontSize: `calc(${cropperDiameter}px / 8)`, // match canvas font size
                  lineHeight: 1.2,
                  pointerEvents: 'none',
                  textAlign: 'center',
                  fontFamily: 'sans-serif',
                  zIndex: 10,
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                {getWrappedLines(
                  { measureText: (t) => ({ width: t.length * (cropperDiameter / 16) }) }, // crude estimate for preview
                  emojiText,
                  cropperDiameter * 0.65
                ).map((line, i) => (
                  <span key={i}>{line.trim()}</span>
                ))}
              </div>
            )}
          </div>
          <BackgroundColorPicker
            backgroundColor={backgroundColor}
            setBackgroundColor={setBackgroundColor}
          />
          <StyleOptions
            borderStyle={borderStyle}
            setBorderStyle={setBorderStyle}
            showShadow={showShadow}
            setShowShadow={setShowShadow}
            isRound={isRound}
            setIsRound={setIsRound}
          />
          <EmojiTextInput emojiText={emojiText} setEmojiText={setEmojiText} />
          <label className="flex items-center space-x-2 mb-2">
            <span className="text-emerald-400 font-semibold drop-shadow-md mb-2">Choose Text Color (defaults to white):</span>
            <input
              type="color"
              value={fontColor}
              onChange={e => setFontColor(e.target.value)}
              className="w-8 h-8 p-0 border border-gray-400 rounded"
            />
          </label>

          <button type="button" className="btn-primary mt-4 cursor-pointer" onClick={showCroppedImage}>
            Crop Image and Preview Emoji
          </button>
          <button type="button" className="btn-primary mt-4 cursor-pointer" onClick={handleReset}>
            Start Over
          </button>

        </>
      )}

      {loading && <LoadingIndicator />}

      <EmojiPreview
        croppedImage={croppedImage}
        isRound={isRound}
        borderStyle={borderStyle}
        showShadow={showShadow}
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
      <ErrorModal
        open={showErrorModal}
        errorMessage={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />
      <ContactModal
        open={showContactModal}
        onClose={() => setShowContactModal(false)}
        contactForm={contactForm}
        setContactForm={setContactForm}
        contactSubmitted={contactSubmitted}
        setContactSubmitted={setContactSubmitted}
      />
      <AboutModal
        open={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />
      <Footer
        onAbout={() => setShowAboutModal(true)}
        onContact={() => setShowContactModal(true)}
      />
    </div>
  )
}
