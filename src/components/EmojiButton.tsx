import { Button } from '@mui/material';
import React from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * EmojiButton is a reusable styled button component for emoji/meme actions.
 * Combines MUI Button with Tailwind CSS for consistent appearance.
 * 
 * @param {React.ReactNode} icon - Icon to display at the start of the button.
 * @param {React.ReactNode} label - Button label/content.
 * @param {function} [onClick] - Click handler.
 * @param {string} [className] - Additional Tailwind classes.
 * @param {any} [component] - Optional component override for MUI Button.
 * @param {string} [htmlFor] - Optional htmlFor attribute (for label usage).
 */
interface EmojiButtonProps {
  icon: React.ReactNode;
  label: React.ReactNode;
  onClick?: () => void;
  className?: string;
  component?: any;
  htmlFor?: string;
}

export const EmojiButton: React.FC<EmojiButtonProps> = ({
  icon,
  label,
  onClick,
  className = '',
  component,
  htmlFor,
}) => {
  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={icon}
      onClick={onClick}
      component={component}
      htmlFor={htmlFor}
      className={twMerge(
        // Rounded, padded, styled button with hover effect
        'rounded-full px-4 py-2 text-white font-semibold capitalize shadow-md transition-all hover:scale-105',
        className
      )}
    >
      {label}
    </Button>
  );
};