import React, { useState } from 'react';
import Tabs from './Tabs';
import BackgroundColorPicker from './BackgroundColorPicker';
import StyleOptions from './StyleOptions';
import EmojiTextInput from './EmojiTextInput';

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
        {/*{activeTab === 'Style' && (
          <StyleOptions
            isRound={props.isRound}
            setIsRound={props.setIsRound}
            // ...other style props if needed
          />
        )}*/}
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