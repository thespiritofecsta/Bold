import React from 'react';
import './MarqueeBar.css'; // We'll create this CSS file for the animation

const MarqueeBar: React.FC = () => {
  const categories = ['Politics', 'Culture', 'News', 'Sports', 'Crypto', 'E-Sports', 'Technology', 'Finance', 'Entertainment'];
  // Added &nbsp; for spacing between categories
  const marqueeText = `Be Bold, Bet on: ${categories.join('&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;')} &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; `;

  return (
    <div className="bg-[#7fff5d] text-black py-1 overflow-hidden whitespace-nowrap">
      <div className="marquee">
        <span dangerouslySetInnerHTML={{ __html: marqueeText.repeat(5) }} /> {/* Use dangerouslySetInnerHTML to render HTML entities */}
      </div>
    </div>
  );
};

export default MarqueeBar;
