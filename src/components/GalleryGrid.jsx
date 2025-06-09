import { Tooltip } from '@mui/material';

/**
 * GalleryGrid displays a grid of selectable images.
 * @param {Object[]} images - Array of image objects { src, label }
 * @param {function} onSelect - Called with the image src when an image is clicked
 */
export default function GalleryGrid({ images, onSelect }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
      {images.map((img, idx) => (
        <Tooltip
          key={img.src + idx}
          title={img.label}
          arrow
          placement="bottom"
          componentsProps={{
            tooltip: {
              sx: {
                fontSize: '1.1rem',
                padding: '10px 16px',
                backgroundColor: '#34d399',
                color: '#1e293b',
                fontWeight: 600,
                letterSpacing: '0.01em',
                boxShadow: 3,
              },
            },
            arrow: {
              sx: {
                color: '#34d399',
              }
            }
          }}
        >
          <img
            src={img.src.startsWith('/') ? img.src : '/' + img.src}
            alt={img.label}
            className="w-full h-48 object-contain bg-gray-900 rounded shadow cursor-pointer hover:scale-105 transition"
            onClick={() => onSelect(img.src)}
            style={{ display: 'block' }}
          />
        </Tooltip>
      ))}
    </div>
  );
}