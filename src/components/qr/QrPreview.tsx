import React, { useEffect, useRef } from 'react';
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

interface QrPreviewProps {
  options: QrFormValues;
}

export const QrPreview: React.FC<QrPreviewProps> = ({ options }) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    const formattedContent = formatContent(options.contentType, options.content);

    if (!qrCodeRef.current) {
      qrCodeRef.current = new QRCodeStyling({
        width: 300,
        height: 300,
        data: formattedContent,
        margin: 10,
        qrOptions: { typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'Q' },
        imageOptions: { hideBackgroundDots: true, imageSize: 0.3, margin: 0 },
        dotsOptions: {
          type: mapDotType(options.dotStyle),
          color: options.foregroundColor
        },
        backgroundOptions: { color: options.backgroundColor },
        cornersSquareOptions: {
          type: mapCornerSquareType(options.eyeStyle),
          color: options.foregroundColor
        },
        cornersDotOptions: {
          type: mapCornerDotType(options.eyeballStyle),
          color: options.foregroundColor
        }
      });

      if (qrRef.current) {
        qrCodeRef.current.append(qrRef.current);
      }
    } else {
      qrCodeRef.current.update({
        data: formattedContent,
        dotsOptions: {
          type: mapDotType(options.dotStyle),
          color: options.foregroundColor
        },
        backgroundOptions: { color: options.backgroundColor },
        cornersSquareOptions: {
          type: mapCornerSquareType(options.eyeStyle),
          color: options.foregroundColor
        },
        cornersDotOptions: {
          type: mapCornerDotType(options.eyeballStyle),
          color: options.foregroundColor
        }
      });
    }

    // Handle logo if present
    if (options.logo && qrCodeRef.current) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && qrCodeRef.current) {
          qrCodeRef.current.update({
            image: e.target.result.toString()
          });
        }
      };
      reader.readAsDataURL(options.logo);
    } else if (qrCodeRef.current) {
      qrCodeRef.current.update({
        image: undefined
      });
    }
  }, [options]);

  const handleDownload = (fileType: 'png' | 'svg') => {
    if (!qrCodeRef.current) return;
    
    // Use content type as a prefix for better filename organization
    const contentTypePrefix = options.contentType.charAt(0).toUpperCase() + options.contentType.slice(1);
    const fileName = `qrchitect-${contentTypePrefix}-${new Date().getTime()}`;
    
    qrCodeRef.current.download({
      extension: fileType,
      name: fileName
    });
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
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
