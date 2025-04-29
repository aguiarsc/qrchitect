import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup
} from '@/components/ui/select';
import { ColorPicker } from '@/components/ui/color-picker';
import { GradientPicker } from '@/components/ui/gradient-picker';
import { Textarea } from '@/components/ui/textarea';

// Define the content type options
export type ContentType = 'url' | 'email' | 'phone' | 'text';

// Define form schema with Zod
const formSchema = z.object({
  contentType: z.enum(['url', 'email', 'phone', 'text']),
  content: z.string().min(1, { message: 'Content is required' }),
  useGradient: z.boolean().default(false),
  foregroundColor: z.string().min(4),
  backgroundColor: z.string().min(4),
  gradientStartColor: z.string().min(4),
  gradientEndColor: z.string().min(4),
  gradientAngle: z.number().min(0).max(360),
  dotStyle: z.enum(['square', 'dots', 'rounded']),
  eyeStyle: z.enum(['square', 'circle', 'rounded']),
  eyeballStyle: z.enum(['square', 'circle', 'diamond']),
  logo: z.instanceof(File).optional(),
});

export type QrFormValues = z.infer<typeof formSchema>;

interface QrFormProps {
  onFormChange: (values: QrFormValues) => void;
}

export const QrForm: React.FC<QrFormProps> = ({ onFormChange }) => {
  const { control, watch, formState: { errors }, setValue } = useForm<QrFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contentType: 'url',
      content: 'https://example.com',
      useGradient: false,
      foregroundColor: '#000000',
      backgroundColor: '#FFFFFF',
      gradientStartColor: '#000000',
      gradientEndColor: '#666666',
      gradientAngle: 45,
      dotStyle: 'square',
      eyeStyle: 'square',
      eyeballStyle: 'square',
    },
  });

  const contentType = watch('contentType');
  const useGradient = watch('useGradient');

  // Set placeholder and validation based on content type
  React.useEffect(() => {
    const currentContent = watch('content');
    if (contentType === 'url' && (!currentContent || !currentContent.includes('://'))) {
      setValue('content', 'https://example.com');
    } else if (contentType === 'email' && (!currentContent || !currentContent.includes('@'))) {
      setValue('content', 'example@email.com');
    } else if (contentType === 'phone' && (!currentContent || !currentContent.includes('+'))) {
      setValue('content', '+1234567890');
    } else if (contentType === 'text' && (!currentContent || currentContent.includes('://') || currentContent.includes('@') || currentContent.includes('+'))) {
      setValue('content', 'Hello World!');
    }
  }, [contentType, setValue, watch]);

  // Watch for changes in form values
  React.useEffect(() => {
    const subscription = watch((value) => {
      if (value.contentType && value.content && value.foregroundColor && value.backgroundColor && 
          value.dotStyle && value.eyeStyle && value.eyeballStyle) {
        onFormChange(value as QrFormValues);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [watch, onFormChange]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onFormChange({
        ...watch(),
        logo: file,
      });
    }
  };

  const getContentConfig = () => {
    switch (contentType) {
      case 'url':
        return {
          label: 'URL',
          placeholder: 'https://example.com',
          description: 'Enter the URL for your QR code'
        };
      case 'email':
        return {
          label: 'Email Address',
          placeholder: 'example@email.com',
          description: 'Enter an email address'
        };
      case 'phone':
        return {
          label: 'Phone Number',
          placeholder: '+1234567890',
          description: 'Enter a phone number with country code'
        };
      case 'text':
        return {
          label: 'Text',
          placeholder: 'Enter any text here',
          description: 'Enter plain text for your QR code'
        };
      default:
        return {
          label: 'Content',
          placeholder: 'Enter content',
          description: 'Enter content for your QR code'
        };
    }
  };

  const contentConfig = getContentConfig();

  return (
    <form className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Content Type</label>
        <Controller
          name="contentType"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="url">URL</SelectItem>
                  <SelectItem value="email">Email Address</SelectItem>
                  <SelectItem value="phone">Phone Number</SelectItem>
                  <SelectItem value="text">Plain Text</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{contentConfig.label}</label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            contentType === 'text' ? (
              <Textarea 
                placeholder={contentConfig.placeholder} 
                className="resize-y min-h-[100px]"
                {...field} 
              />
            ) : (
              <Input 
                placeholder={contentConfig.placeholder} 
                {...field} 
              />
            )
          )}
        />
        {errors.content && (
          <p className="text-xs text-red-500 mt-1">{errors.content.message}</p>
        )}
        {contentConfig.description && (
          <p className="text-xs text-muted-foreground mt-1">{contentConfig.description}</p>
        )}
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-base font-medium">Style Options</h3>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Background Color</label>
          <Controller
            name="backgroundColor"
            control={control}
            render={({ field }) => (
              <ColorPicker
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium">Foreground Style</label>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Solid</span>
              <Controller
                name="useGradient"
                control={control}
                render={({ field }) => (
                  <div 
                    className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors duration-300 ${field.value ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
                    onClick={() => {
                      const newUseGradient = !field.value;
                      field.onChange(newUseGradient);
                      if (newUseGradient) {
                        const currentFgColor = watch('foregroundColor');
                        setValue('gradientStartColor', currentFgColor, { shouldDirty: true });
                        setValue('gradientEndColor', currentFgColor, { shouldDirty: true });
                      } else {
                        setValue('foregroundColor', watch('gradientStartColor'), { shouldDirty: true });
                      }
                    }}
                  >
                    <div 
                      className={`w-3 h-3 rounded-full bg-white transform transition-transform duration-300 ${field.value ? 'translate-x-5' : 'translate-x-0'}`} 
                    />
                  </div>
                )}
              />
              <span className="text-xs text-gray-500 dark:text-gray-400">Gradient</span>
            </div>
          </div>
          
          {useGradient ? (
            <Controller
              name="gradientStartColor"
              control={control}
              render={({ field: startField }) => (
                <Controller
                  name="gradientEndColor"
                  control={control}
                  render={({ field: endField }) => (
                    <Controller
                      name="gradientAngle"
                      control={control}
                      render={({ field: angleField }) => (
                        <GradientPicker
                          startColor={startField.value}
                          endColor={endField.value}
                          angle={angleField.value}
                          onStartColorChange={(color) => startField.onChange(color)}
                          onEndColorChange={(color) => endField.onChange(color)}
                          onAngleChange={(angle) => angleField.onChange(angle)}
                        />
                      )}
                    />
                  )}
                />
              )}
            />
          ) : (
            <Controller
              name="foregroundColor"
              control={control}
              render={({ field }) => (
                <ColorPicker
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Dot Style</label>
          <Controller
            name="dotStyle"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a dot style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="dots">Dots</SelectItem>
                    <SelectItem value="rounded">Rounded</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Eye Frame Style</label>
          <Controller
            name="eyeStyle"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an eye style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="circle">Circle</SelectItem>
                    <SelectItem value="rounded">Rounded</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Eye Ball Style</label>
          <Controller
            name="eyeballStyle"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an eyeball style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="circle">Circle</SelectItem>
                    <SelectItem value="diamond">Diamond</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Logo (Optional)</label>
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="logo-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 border-gray-300 dark:border-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, or SVG (MAX. 800x800px)
              </p>
            </div>
            <input
              id="logo-upload"
              type="file"
              accept=".png,.jpg,.jpeg,.svg"
              className="hidden"
              onChange={handleLogoChange}
            />
          </label>
        </div>
      </div>
    </form>
  );
};
