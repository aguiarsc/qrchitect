import React, { useState } from 'react';
import { QrForm, QrFormValues } from '@/components/qr/QrForm';
import { QrPreview } from '@/components/qr/QrPreview';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export const MainPage: React.FC = () => {
  const [qrOptions, setQrOptions] = useState<QrFormValues>({
    contentType: 'url',
    content: 'https://example.com',
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',
    dotStyle: 'square',
    eyeStyle: 'square',
    eyeballStyle: 'square',
  });

  const handleFormChange = (values: QrFormValues) => {
    setQrOptions(values);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">QRCHITECT</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">Design stunning QR codes effortlessly</p>
          </div>
          <ThemeToggle />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 lg:col-span-1 xl:col-span-2">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Customize Your QR Code</h2>
            <QrForm onFormChange={handleFormChange} />
          </div>

          <div className="xl:col-span-3 flex flex-col items-center justify-start">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Preview</h2>
            <div className="w-full flex justify-center">
              <QrPreview options={qrOptions} />
            </div>
            
            <div className="mt-8 w-full flex justify-center">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 max-w-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Usage Instructions</h3>
                <ol className="text-gray-600 dark:text-gray-300 space-y-2 list-decimal pl-5">
                  <li className="pl-1">Choose your content type (URL, email, phone, or text)</li>
                  <li className="pl-1">Enter your content in the input field</li>
                  <li className="pl-1">Customize the colors and style of your QR code</li>
                  <li className="pl-1">Add an optional logo to make it unique</li>
                  <li className="pl-1">Download your QR code as PNG or SVG</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-12 text-center text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} QRCHITECT | Premium QR Code Generator</p>
        </footer>
      </div>
    </div>
  );
};
