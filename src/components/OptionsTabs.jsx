import { useState } from 'react';
import Tabs from './Tabs';
import BackgroundColorPicker from './BackgroundColorPicker';
import EmojiTextInput from './EmojiTextInput';

/**
 * OptionsTabs provides tabbed controls for background and text customization.
 * 
 * @param {object} props - All customization state and handlers from parent.
 *   - backgroundColor, setBackgroundColor, keepOriginalBg, setKeepOriginalBg, backgroundType, setBackgroundType
 *   - emojiText, setEmojiText, fontColor, setFontColor, fontSize, setFontSize, isBold, setIsBold
 *   - isQuoteBubble, setIsQuoteBubble, presetTextColors
 */
export default function OptionsTabs(props) {
  const [activeTab, setActiveTab] = useState('Background');
  const tabs = ['Background', 'Text'];

  return (
    <div>
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="mt-4">
        {activeTab === 'Background' && (
          <BackgroundColorPicker
            backgroundColor={props.backgroundColor}
            setBackgroundColor={props.setBackgroundColor}
            keepOriginalBg={props.keepOriginalBg}
            setKeepOriginalBg={props.setKeepOriginalBg}
            backgroundType={props.backgroundType}
            setBackgroundType={props.setBackgroundType}
          />
        )}
        {activeTab === 'Text' && (
          <EmojiTextInput
            emojiText={props.emojiText}
            setEmojiText={props.setEmojiText}
            fontColor={props.fontColor}
            setFontColor={props.setFontColor}
            fontSize={props.fontSize}
            setFontSize={props.setFontSize}
            isBold={props.isBold}
            setIsBold={props.setIsBold}
            isQuoteBubble={props.isQuoteBubble}
            setIsQuoteBubble={props.setIsQuoteBubble}
            presetTextColors={props.presetTextColors}
          />
        )}
      </div>
    </div>
  );
}