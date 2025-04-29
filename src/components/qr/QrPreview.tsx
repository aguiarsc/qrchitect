import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { Button } from '@/components/ui/button';
import type { QrFormValues, ContentType } from './QrForm';

// Map our form values to the QR code styling library's expected values
const mapDotType = (type: string): "square" | "dots" | "rounded" => {
  return type as "square" | "dots" | "rounded";
};

const mapCornerSquareType = (type: string): "square" | "dot" | "extra-rounded" => {
  if (type === "circle") return "dot";
  if (type === "rounded") return "extra-rounded";
  return "square";
};

const mapCornerDotType = (type: string): "square" | "dot" => {
  if (type === "circle" || type === "diamond") return "dot";
  return "square";
};

// Function to format content based on content type
const formatContent = (contentType: ContentType, content: string): string => {
  switch (contentType) {
    case 'url':
      // For URLs, ensure they have a protocol
      return content.startsWith('http://') || content.startsWith('https://') 
        ? content 
        : `https://${content}`;
    case 'email':
      // Format as a mailto: link
      return content.startsWith('mailto:') ? content : `mailto:${content}`;
    case 'phone':
      // Format as a tel: link
      return content.startsWith('tel:') ? content : `tel:${content}`;
    case 'text':
      // Plain text needs no formatting
      return content;
    default:
      return content;
  }
};

// Function to create a linear gradient for the QR code
const createQrGradient = (startColor: string, endColor: string, angle: number) => {
  // Return gradient configuration compatible with qr-code-styling
  return {
    type: 'linear',
    colorStops: [
      { offset: 0, color: startColor },
      { offset: 1, color: endColor }
    ],
    rotation: angle
  };
};

interface QrPreviewProps {
  options: QrFormValues;
}

export const QrPreview: React.FC<QrPreviewProps> = ({ options }) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const formattedContent = formatContent(options.contentType, options.content);

    // Define base options and conditional color/gradient logic
    const baseDotsOptions = { type: mapDotType(options.dotStyle) };
    const baseCornersSquareOptions = { type: mapCornerSquareType(options.eyeStyle) };
    const baseCornersDotOptions = { type: mapCornerDotType(options.eyeballStyle) };

    const dotsOptions = options.useGradient
      ? { ...baseDotsOptions, gradient: createQrGradient(options.gradientStartColor, options.gradientEndColor, options.gradientAngle), color: undefined }
      : { ...baseDotsOptions, color: options.foregroundColor, gradient: undefined };

    const cornersSquareOptions = options.useGradient
      ? { ...baseCornersSquareOptions, gradient: createQrGradient(options.gradientStartColor, options.gradientEndColor, options.gradientAngle), color: undefined }
      : { ...baseCornersSquareOptions, color: options.foregroundColor, gradient: undefined };
        
    const cornersDotOptions = options.useGradient
      ? { ...baseCornersDotOptions, gradient: createQrGradient(options.gradientStartColor, options.gradientEndColor, options.gradientAngle), color: undefined }
      : { ...baseCornersDotOptions, color: options.foregroundColor, gradient: undefined };

    if (!qrCodeRef.current) {
      qrCodeRef.current = new QRCodeStyling({
        width: 300,
        height: 300,
        data: formattedContent,
        margin: 10,
        qrOptions: { typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'Q' },
        imageOptions: { hideBackgroundDots: true, imageSize: 0.3, margin: 0 },
        dotsOptions: dotsOptions, // Apply conditional options
        backgroundOptions: { color: options.backgroundColor },
        cornersSquareOptions: cornersSquareOptions, // Apply conditional options
        cornersDotOptions: cornersDotOptions // Apply conditional options
      });

      if (qrRef.current) {
        qrCodeRef.current.append(qrRef.current);
      }
    } else {
      qrCodeRef.current.update({
        data: formattedContent,
        dotsOptions: dotsOptions, // Apply conditional options
        backgroundOptions: { color: options.backgroundColor },
        cornersSquareOptions: cornersSquareOptions, // Apply conditional options
        cornersDotOptions: cornersDotOptions // Apply conditional options
      });
    }
    
    // Handle logo update separately
    if (options.logo instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          qrCodeRef.current?.update({ image: e.target.result });
        }
      };
      reader.readAsDataURL(options.logo);
    } else if (options.logo === null) {
      // Explicitly remove logo if cleared
      qrCodeRef.current?.update({ image: undefined });
    }

  // Include all dependencies from options that affect the QR code appearance
  }, [options]);

  const handleDownload = (extension: 'png' | 'svg') => {
    if (!qrCodeRef.current) return;
    
    // Use content type as a prefix for better filename organization
    const contentTypePrefix = options.contentType.charAt(0).toUpperCase() + options.contentType.slice(1);
    const fileName = `qrchitect-${contentTypePrefix}-${new Date().getTime()}`;
    
    qrCodeRef.current.download({
      extension: extension,
      name: fileName
    });
  };

  // Animation classes for hover effect
  const animationClasses = isHovered 
    ? 'transform scale-110 shadow-xl' 
    : 'transform scale-100 shadow-lg';

  return (
    <div className="flex flex-col items-center space-y-6">
      <div 
        className={`p-6 bg-white dark:bg-gray-800 rounded-lg transition-all duration-500 ease-in-out ${animationClasses}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div ref={qrRef} className="w-[300px] h-[300px]"></div>
      </div>
      
      <div className="flex space-x-4">
        <Button onClick={() => handleDownload('png')}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download PNG
        </Button>
        <Button variant="outline" onClick={() => handleDownload('svg')}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download SVG
        </Button>
      </div>
    </div>
  );
};
