import Tabs from './Tabs';
import BackgroundColorPicker from './BackgroundColorPicker';
import EmojiTextInput from './EmojiTextInput';

export default function OptionsTabs(props) {
  const tabs = ['Background', 'Text'];

  return (
    <div>
      <Tabs tabs={tabs} activeTab={props.activeTab} setActiveTab={props.setActiveTab} />
      <div className="mt-4">
        {props.activeTab === 'Background' && (
          <BackgroundColorPicker
            backgroundColor={props.backgroundColor}
            setBackgroundColor={props.setBackgroundColor}
            keepOriginalBg={props.keepOriginalBg}
            setKeepOriginalBg={props.setKeepOriginalBg}
            backgroundType={props.backgroundType}
            setBackgroundType={props.setBackgroundType}
          />
        )}
        {props.activeTab === 'Text' && (
          <div>
            <button
              onClick={() =>
                props.setTextBoxes([
                  ...props.textBoxes,
                  {
                    id: Date.now(),
                    text: '',
                    position: { x: 0, y: 0 },
                    size: { width: 180, height: 60 },
                    isQuoteBubble: false,
                    fontColor: '#ffffff',
                    fontSize: 24,
                    isBold: true,
                    tailBase: { x: 90, y: 60 },
                    arrowTip: { x: 90, y: 84 },
                  }
                ])
              }
              className="mb-2 px-3 py-1 bg-emerald-500 text-white rounded"
            >
              + Add Text Box
            </button>
            {props.textBoxes.map((box, idx) => (
              <div key={box.id} className="mb-2 border p-2 rounded bg-gray-50">
                <EmojiTextInput
                  emojiText={box.text}
                  setEmojiText={val => {
                    const newBoxes = [...props.textBoxes];
                    newBoxes[idx].text = val;
                    props.setTextBoxes(newBoxes);
                  }}
                  fontColor={box.fontColor}
                  setFontColor={val => {
                    const newBoxes = [...props.textBoxes];
                    newBoxes[idx].fontColor = val;
                    props.setTextBoxes(newBoxes);
                  }}
                  fontSize={box.fontSize}
                  setFontSize={val => {
                    const newBoxes = [...props.textBoxes];
                    newBoxes[idx].fontSize = val;
                    props.setTextBoxes(newBoxes);
                  }}
                  isBold={box.isBold}
                  setIsBold={val => {
                    const newBoxes = [...props.textBoxes];
                    newBoxes[idx].isBold = val;
                    props.setTextBoxes(newBoxes);
                  }}
                  isQuoteBubble={box.isQuoteBubble}
                  setIsQuoteBubble={val => {
                    const newBoxes = [...props.textBoxes];
                    const w = newBoxes[idx].size?.width ?? 180;
                    const h = newBoxes[idx].size?.height ?? 60;
                    if (val) {
                      newBoxes[idx] = {
                        ...newBoxes[idx],
                        isQuoteBubble: true,
                        tailBase: { x: w / 2, y: h },
                        arrowTip: { x: w / 2, y: h + 24 }
                      };
                    } else {
                      newBoxes[idx] = {
                        ...newBoxes[idx],
                        isQuoteBubble: false
                      };
                    }
                    props.setTextBoxes(newBoxes);
                  }}
                  presetTextColors={props.presetTextColors}
                />
                <button
                  onClick={() => props.setTextBoxes(props.textBoxes.filter((_, i) => i !== idx))}
                  className="text-red-500 text-xs mt-1"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}