import { Star } from 'lucide-react';

const StarRating = ({ value = 0, onChange, size = 'md', readOnly = false }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readOnly && onChange && onChange(star)}
          disabled={readOnly}
          className={`transition-transform duration-100 ${
            !readOnly ? 'hover:scale-110 cursor-pointer' : 'cursor-default'
          } focus:outline-none disabled:cursor-default`}
          aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
        >
          <Star
            className={`${sizes[size]} ${
              star <= value
                ? 'fill-amber-400 text-amber-400'
                : 'fill-gray-200 text-gray-300'
            } transition-colors duration-100`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
