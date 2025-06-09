import { galleryImages } from '../constants/galleryImages';

export default function GalleryMemes({ onSelect }) {
  // Group by type
  const grouped = {};
  galleryImages.forEach(img => {
    if (!grouped[img.type]) grouped[img.type] = [];
    grouped[img.type].push(img);
  });

  // Sort types and images
  const sortedTypes = Object.keys(grouped).sort((a, b) => a.localeCompare(b));
  sortedTypes.forEach(type => {
    grouped[type].sort((a, b) => a.label.localeCompare(b.label));
  });

  return (
    <div className="my-6">
      {sortedTypes.map(type => (
        <div key={type} className="mb-8 w-full">
          <h3 className="text-emerald-400 font-bold text-lg mb-2 capitalize text-center">{type}</h3>
          <div className="flex justify-center w-full">
            <div className={`grid gap-4 justify-items-center ${grouped[type].length < 4 ? `grid-cols-${grouped[type].length}` : 'grid-cols-4'}`}>
              {grouped[type].map((img, idx) => (
                <div key={img.src + idx} className="flex flex-col items-center w-32">
                  <img
                    src={img.src}
                    alt={img.label}
                    className="rounded shadow cursor-pointer w-full h-24 object-cover"
                    onClick={() => onSelect(img)}
                  />
                  <span className="mt-1 text-xs text-center text-white break-words w-full">{img.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}