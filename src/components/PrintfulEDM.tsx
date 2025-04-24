'use client';

import { useEffect, useRef } from 'react';

interface PrintfulEDMProps {
  nonce: string;
  productId: number;
  variantId: number;
  onTemplateSaved?: (template: any) => void;
}

declare global {
  interface Window {
    PFDesignMaker: any;
  }
}

const PrintfulEDM: React.FC<PrintfulEDMProps> = ({ nonce, productId, variantId, onTemplateSaved }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!nonce || !productId || !variantId) return;

    const script = document.createElement('script');
    script.src = 'https://designmaker.printful.com/embed.js';
    script.onload = () => {
      if (window.PFDesignMaker && containerRef.current) {
        new window.PFDesignMaker({
          container: containerRef.current,
          nonce,
          initProduct: {
            productId,
            variantId,
          },
          onTemplateSaved: onTemplateSaved || (() => {}),
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [nonce, productId, variantId, onTemplateSaved]);

  return <div ref={containerRef} style={{ width: '100%', height: '600px' }} />;
};

export default PrintfulEDM;
