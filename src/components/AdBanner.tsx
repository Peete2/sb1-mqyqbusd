import React from 'react';

interface AdBannerProps {
  type: 'sidebar' | 'inline';
}

export default function AdBanner({ type }: AdBannerProps) {
  const classes = {
    sidebar: 'w-full h-[600px] bg-accent-blue rounded-lg p-4',
    inline: 'w-full h-[250px] my-8 bg-accent-blue rounded-lg p-4'
  };

  return (
    <div className={classes[type]}>
      <div className="w-full h-full border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 font-medium">Advertisement</p>
          <p className="text-sm text-gray-400">{type === 'sidebar' ? '300x600' : '728x250'}</p>
        </div>
      </div>
    </div>
  );
}