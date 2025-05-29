// components/EmojiButton.tsx
import { Button } from '@mui/material';
import React from 'react';
import { twMerge } from 'tailwind-merge';

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
        'rounded-full px-4 py-2 text-white font-semibold capitalize shadow-md transition-all hover:scale-105',
        className
      )}
    >
      {label}
    </Button>
  );
};
