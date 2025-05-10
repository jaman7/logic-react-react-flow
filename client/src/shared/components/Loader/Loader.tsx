import React from 'react';
import { motion } from 'framer-motion';
import './Loader.scss';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 'medium', color = '#007bff' }) => {
  const sizes = {
    small: '20px',
    medium: '40px',
    large: '60px',
  };

  return (
    <motion.div
      className="loader"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
      style={{
        width: sizes[size],
        height: sizes[size],
        border: `4px solid ${color}`,
        borderTopColor: 'transparent',
        borderRadius: '50%',
      }}
    />
  );
};

export default Loader;
