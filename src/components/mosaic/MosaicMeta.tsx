import { useEffect } from 'react';
import type { Mosaic, PostContent, QuoteContent, ImageContent } from '../../types/mosaic';

interface MosaicMetaProps {
  mosaic: Mosaic;
}

/**
 * Updates document meta tags for social sharing.
 * In a real app, this would be handled server-side for proper OG tag rendering.
 * This client-side version updates tags dynamically for SPAs.
 */
export function MosaicMeta({ mosaic }: MosaicMetaProps) {
  useEffect(() => {
    // Get description based on mosaic type
    const getDescription = (): string => {
      switch (mosaic.type) {
        case 'post':
          return (mosaic.content as PostContent).text.slice(0, 160);
        case 'quote':
          return `"${(mosaic.content as QuoteContent).text}" — ${(mosaic.content as QuoteContent).source || 'Unknown'}`;
        case 'image':
          return (mosaic.content as ImageContent).caption || `Image by ${mosaic.author.displayName}`;
        case 'code':
          return `Code snippet by ${mosaic.author.displayName}`;
        case 'poll':
          return `Poll by ${mosaic.author.displayName}`;
        case 'gallery':
          return `Gallery by ${mosaic.author.displayName}`;
        case 'video':
          return `Video by ${mosaic.author.displayName}`;
        case 'thread':
          return `Thread by ${mosaic.author.displayName}`;
        case 'collage':
          return `Collage by ${mosaic.author.displayName}`;
        case 'diagram':
          return `Diagram by ${mosaic.author.displayName}`;
        default:
          return `Mosaic by ${mosaic.author.displayName}`;
      }
    };

    // Get image URL for OG tags
    const getImageUrl = (): string | null => {
      if (mosaic.type === 'image') {
        return (mosaic.content as ImageContent).url;
      }
      if (mosaic.background?.type === 'image') {
        return mosaic.background.url;
      }
      // Could generate a preview image URL here
      return null;
    };

    const title = `${mosaic.author.displayName} on Rendered Useful`;
    const description = getDescription();
    const imageUrl = getImageUrl();
    const url = `${window.location.origin}/mosaics/${mosaic.id}`;

    // Update document title
    document.title = title;

    // Helper to set/create meta tag
    const setMetaTag = (property: string, content: string, isName = false) => {
      const attr = isName ? 'name' : 'property';
      let meta = document.querySelector(`meta[${attr}="${property}"]`) as HTMLMetaElement | null;
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, property);
        document.head.appendChild(meta);
      }
      
      meta.content = content;
    };

    // Open Graph tags
    setMetaTag('og:title', title);
    setMetaTag('og:description', description);
    setMetaTag('og:url', url);
    setMetaTag('og:type', 'article');
    if (imageUrl) {
      setMetaTag('og:image', imageUrl);
    }

    // Twitter Card tags
    setMetaTag('twitter:card', imageUrl ? 'summary_large_image' : 'summary', true);
    setMetaTag('twitter:title', title, true);
    setMetaTag('twitter:description', description, true);
    if (imageUrl) {
      setMetaTag('twitter:image', imageUrl, true);
    }

    // Cleanup: restore original title on unmount
    return () => {
      document.title = 'Rendered Useful';
    };
  }, [mosaic]);

  return null;
}

export default MosaicMeta;
