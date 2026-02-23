'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { EmailType } from '@/lib/prisma/generated/enums';
import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import Color from '@tiptap/extension-color';
import Italic from '@tiptap/extension-italic';
import Link from '@tiptap/extension-link';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold as BoldIcon,
  ChevronDown,
  Code,
  Eye,
  Italic as ItalicIcon,
  List,
  ListOrdered,
  Plus,
  Underline as UnderlineIcon,
  X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useEmailTemplates } from '../../../../hooks/useEmailTemplates';
import { EmailTemplate } from '../../../../services/api/email-templates';
import { Modal } from '../../../molecules/common/Modal';
import { Textarea } from '../../../ui/textarea';

interface EmailTemplateEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  template?: EmailTemplate | null;
  mode: 'create' | 'edit';
}

// Variables are now stored as simple array of field names

const EMPTY_FORM_DATA = {
  name: '',
  subject: '',
  fromEmail: '',
  fromName: '',
  replyToEmail: '',
  emailType: 'TRANSACTIONAL' as const,
  body: '',
};

export function EmailTemplateEditorModal({
  isOpen,
  onClose,
  onSuccess,
  template,
  mode,
}: EmailTemplateEditorModalProps) {

  // Tiptap editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      Bold,
      Italic,
      Underline,
      BulletList.configure({
        HTMLAttributes: {
          class: 'list-disc ml-4',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'list-decimal ml-4',
        },
      }),
      ListItem.configure({
        HTMLAttributes: {
          class: '',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
      }),
      TextStyle,
      Color,
    ],
    content: '',
    immediatelyRender: false, // Fix SSR hydration mismatch
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none focus:outline-hidden min-h-full p-4 text-gray-900 dark:text-white',
        'data-placeholder': 'Start writing your email template...',
      },
    },
    onUpdate: ({ editor }) => {
      if (!isSourceMode) {
        const html = editor.getHTML();
        setSourceContent(html);
        setFormData(prev => ({ ...prev, body: html }));
      }
    },
  });

  const initializeTemplateData = () => {
    if (isOpen) {
      if (template && mode === 'edit') {
        return {
          name: template.name || '',
          subject: template.subject || '',
          fromEmail: template.fromEmail || '',
          fromName: template.fromName || '',
          replyToEmail: template.replyToEmail || '',
          emailType: template.emailType as EmailType || 'TRANSACTIONAL',
          body: template.body || '',
        }
      }
    }
    return { ...EMPTY_FORM_DATA };
  };
  const initializeTemplateVariables = () => {
    if (isOpen) {
      if (template && mode === 'edit') {
        if (template.variables) {
          if (Array.isArray(template.variables)) {
            // New array format
            return template.variables
          } else if (typeof template.variables === 'object') {
            // Old object format - convert to array of keys
            return Object.keys(template.variables);
          } else {
            // Fallback for any other format
            return [];
          }
        }
      }
    }
    return [];
  }

  // Form state
  const [formData, setFormData] = useState(initializeTemplateData);

  // Editor state
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [sourceContent, setSourceContent] = useState(() => {
    if (isOpen) {
      if (template && mode === 'edit') {
        return template.body || '';
      }
    }
    return '';
  }
  );

  // Variables state - now stored as array of field names
  const [variables, setVariables] = useState<string[]>(initializeTemplateVariables);
  const [newVariableName, setNewVariableName] = useState('');

  // Heading state
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false);

  // Dynamic height calculation based on variables
  const getDynamicHeight = () => {
    const variableHeight = variables.length * 40; // 40px per variable
    return `calc(100vh - 200px + ${variableHeight}px)`;
  };

  // Refs
  const sourceTextareaRef = useRef<HTMLTextAreaElement>(null);
  const comboboxPortalRef = useRef<HTMLDivElement>(null);

  // Available user fields for email templates (exact fields from User table in Prisma schema)
  const availableFields = [
    'name',
    'email',
    'profilePicture',
    'role',
    'isOnboarded',
    'credits',
    'stripeCustomerId',
    'plan',
    'isOverDue',
    'planExpiringAt',
  ];

  // Helper function to format field names for display
  const formatFieldName = (field: string) => {
    return field
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
      .trim();
  };

  // Initializes editor with existing template content
  useEffect(() => {
    if (isOpen) {
      if (template && mode === 'edit') {
        // Set editor content
        if (editor) {
          editor.commands.setContent(template.body || '');
          setSourceContent(template.body || '');
        }
      }
    }
  }, [isOpen, template, mode, editor]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.heading-dropdown')) {
        setShowHeadingDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cleanup effect to ensure editor is properly destroyed when component unmounts
  useEffect(() => {
    return () => {
      if (editor) {
        editor.commands.clearContent();
        editor.commands.blur();
        editor.destroy();
      }
    };
  }, [editor]);

  // Get mutations from the hook
  const { createEmailTemplate, updateEmailTemplate, isCreating, isUpdating } = useEmailTemplates();

  // Helper functions for editor
  const setHeading = (level: 1 | 2 | 3 | 4 | 5 | 6 | 0) => {
    if (!editor) return;
    if (level === 0) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor
        .chain()
        .focus()
        .toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 })
        .run();
    }
    setShowHeadingDropdown(false);
  };

  const getCurrentHeading = () => {
    if (!editor) return 0;
    for (let i = 1; i <= 6; i += 1) {
      if (editor.isActive('heading', { level: i })) {
        return i;
      }
    }
    return 0;
  };

  const headingLabels = {
    0: 'Paragraph',
    1: 'Heading 1',
    2: 'Heading 2',
    3: 'Heading 3',
    4: 'Heading 4',
    5: 'Heading 5',
    6: 'Heading 6',
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle source mode toggle
  const handleSourceModeToggle = (checked: boolean) => {
    setIsSourceMode(checked);

    if (checked) {
      // Switching to source mode - get HTML from editor
      if (editor) {
        const html = editor.getHTML();
        setSourceContent(html);
      }
      return;
    }

    // Switching to design mode - set HTML to editor
    if (editor && sourceContent) {
      editor.commands.setContent(sourceContent);
    }
  };

  // Handle textarea sizing when switching to source mode
  useEffect(() => {
    if (isSourceMode && sourceTextareaRef.current) {
      const textarea = sourceTextareaRef.current;
      // Ensure proper overflow handling
      textarea.style.overflowY = 'auto';
      textarea.style.resize = 'none';
    }
  }, [isSourceMode]);

  // Handle source content change
  const handleSourceContentChange = (value: string) => {
    setSourceContent(value);
    setFormData(prev => ({ ...prev, body: value }));
  };

  // Add new variable
  const handleAddVariable = () => {
    if (newVariableName && !variables.includes(newVariableName)) {
      setVariables(prev => [...prev, newVariableName]);
      setNewVariableName('');
    }
  };

  // Remove variable
  const handleRemoveVariable = (variableName: string) => {
    setVariables(prev => prev.filter(v => v !== variableName));
  };

  // Generate preview HTML with variable replacement
  const generatePreviewHTML = () => {
    let html = isSourceMode ? sourceContent : editor?.getHTML() || '';

    // Replace variables with placeholder text for preview
    variables.forEach(variableName => {
      const regex = new RegExp(`{{${variableName}}}`, 'g');
      const placeholderText = `[${formatFieldName(variableName)}]`;
      html = html.replace(regex, placeholderText);
    });

    return html;
  };

  // Sanitize HTML for safe preview rendering
  const sanitizePreviewHTML = (html: string | null | undefined): string => {
    const fallbackHTML = '<p class="text-gray-500 italic">Preview will appear here...</p>';

    if (!html || html.trim() === '') {
      return fallbackHTML;
    }

    // Comprehensive XSS protection without external dependencies
    const sanitizedHTML = html
      // Remove all script tags and their content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      // Remove dangerous tags completely
      .replace(
        /<\/?(?:script|object|embed|iframe|form|input|button|link|meta|style|applet|frameset|frame)\b[^>]*>/gi,
        '',
      )
      // Remove all event handlers (onclick, onload, etc.)
      .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
      // Remove javascript: protocols
      .replace(/javascript:/gi, '')
      // Remove vbscript: protocols
      .replace(/vbscript:/gi, '')
      // Remove data: protocols except safe image types
      .replace(/data:(?!image\/(png|jpg|jpeg|gif|svg|webp))/gi, '')
      // Remove expression() in CSS
      .replace(/expression\s*\(/gi, '')
      // Remove dangerous CSS properties
      .replace(/style\s*=\s*["'][^"']*["']/gi, match => {
        // Only allow safe CSS properties
        const safeStyles = match
          .replace(/position\s*:\s*fixed/gi, '')
          .replace(/position\s*:\s*absolute/gi, '')
          .replace(/z-index\s*:\s*\d+/gi, '')
          .replace(/opacity\s*:\s*0/gi, '')
          .replace(/display\s*:\s*none/gi, '')
          .replace(/visibility\s*:\s*hidden/gi, '');
        return safeStyles;
      })
      // Remove dangerous attributes but preserve safe style attributes
      .replace(/\s*(?:on\w+|href|src|action|method|target)\s*=\s*["'][^"']*["']/gi, match => {
        // Only allow safe href attributes for links
        if (match.includes('href=') && match.includes('http')) {
          return match;
        }
        return '';
      })
      // Remove any remaining dangerous content - be more selective
      .replace(/<[^>]*>/g, tag => {
        // Only allow safe HTML tags
        const safeTags = [
          'p',
          'br',
          'strong',
          'em',
          'u',
          's',
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'ul',
          'ol',
          'li',
          'blockquote',
          'a',
          'span',
          'div',
          'pre',
          'code',
        ];
        const tagName = tag.match(/<\/?(\w+)/)?.[1]?.toLowerCase();
        if (tagName && safeTags.includes(tagName)) {
          // Clean the tag of any dangerous attributes while preserving safe ones
          return tag
            .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
            .replace(/\s*href\s*=\s*["'](?!https?:\/\/)[^"']*["']/gi, ''); // Remove non-HTTP hrefs
        }
        return '';
      });

    return sanitizedHTML || fallbackHTML;
  };

  const resetForm = () => {
    setFormData({ ...EMPTY_FORM_DATA });
    setSourceContent('');
    setVariables([]);
    setNewVariableName('');
    setShowHeadingDropdown(false);
    setIsSourceMode(false);
    editor?.commands.setContent('');
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (
      !formData.name.trim() ||
      !formData.subject.trim() ||
      !formData.fromEmail.trim() ||
      !formData.fromName.trim() ||
      !formData.body.trim()
    ) {
      return;
    }

    try {
      const body = isSourceMode ? sourceContent : editor?.getHTML() || '';

      const templateData = {
        ...formData,
        emailType: formData.emailType as EmailType,
        body,
        variables, // Store as array of variable names
      };

      if (mode === 'create') {
        await createEmailTemplate(templateData);
        resetForm();
        onSuccess();
      } else if (template) {
        await updateEmailTemplate({ id: template.id, data: templateData });
        resetForm();
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  // Check if form is valid
  const bodyContent = isSourceMode ? sourceContent : editor?.getHTML() || '';
  const isFormValid =
    formData.name.trim() &&
    formData.subject.trim() &&
    formData.fromEmail.trim() &&
    formData.fromName.trim() &&
    bodyContent.trim() &&
    bodyContent !== '<p></p>' &&
    bodyContent !== '';

  return (
    <>
      {/* Email template editor specific styles */}
      <style>{`
        .email-template-editor .ProseMirror {
          color: rgb(17 24 39);
        }
        .dark .email-template-editor .ProseMirror {
          color: rgb(255 255 255);
        }
        .email-template-editor .ProseMirror h1,
        .email-template-editor .ProseMirror h2,
        .email-template-editor .ProseMirror h3,
        .email-template-editor .ProseMirror h4,
        .email-template-editor .ProseMirror h5,
        .email-template-editor .ProseMirror h6 {
          color: rgb(17 24 39);
        }
        .dark .email-template-editor .ProseMirror h1,
        .dark .email-template-editor .ProseMirror h2,
        .dark .email-template-editor .ProseMirror h3,
        .dark .email-template-editor .ProseMirror h4,
        .dark .email-template-editor .ProseMirror h5,
        .dark .email-template-editor .ProseMirror h6 {
          color: rgb(255 255 255);
        }
        .email-template-editor .ProseMirror strong,
        .email-template-editor .ProseMirror b {
          color: rgb(17 24 39);
        }
        .dark .email-template-editor .ProseMirror strong,
        .dark .email-template-editor .ProseMirror b {
          color: rgb(255 255 255);
        }
        .email-template-editor .ProseMirror p {
          color: rgb(17 24 39);
        }
        .dark .email-template-editor .ProseMirror p {
          color: rgb(255 255 255);
        }
        .email-template-editor .ProseMirror li {
          color: rgb(17 24 39);
        }
        .dark .email-template-editor .ProseMirror li {
          color: rgb(255 255 255);
        }
        .email-template-editor .ProseMirror blockquote {
          color: rgb(17 24 39);
        }
        .dark .email-template-editor .ProseMirror blockquote {
          color: rgb(255 255 255);
        }
        .email-template-editor .ProseMirror code {
          color: rgb(17 24 39);
        }
        .dark .email-template-editor .ProseMirror code {
          color: rgb(255 255 255);
        }
      `}</style>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={mode === 'create' ? 'Create Email Template' : 'Edit Email Template'}
        fullScreen
        removePadding
        footer={
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={handleSubmit}
              disabled={!isFormValid || isCreating || isUpdating}
              isLoading={isCreating || isUpdating}
            >
              {mode === 'create' ? 'Create Template' : 'Save Template'}
            </Button>
          </div>
        }
      >
        <div ref={comboboxPortalRef} className="flex min-h-0 flex-1 overflow-hidden">
          {/* Left Column - Template Details */}
          <div className="flex w-full max-w-[450px] flex-shrink-0 flex-col gap-4 overflow-y-auto border-r border-gray-300 bg-background p-4 [-ms-overflow-style:none] [scrollbar-width:none] md:w-[450px] dark:border-gray-800">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Template Details
              </h3>

              {/* Template Name */}
              <Field>
                <FieldLabel htmlFor="name">
                  Template Name <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  placeholder="Enter template name"
                />
              </Field>

              {/* Email Type */}
              <Field>
                <FieldLabel>
                  Email Type <span className="text-destructive">*</span>
                </FieldLabel>
                <RadioGroup
                  value={formData.emailType}
                  onValueChange={value => handleInputChange('emailType', value)}
                  className="grid grid-cols-2 gap-2">
                  <FieldLabel htmlFor="transactional">
                    <Field orientation="horizontal">
                      <RadioGroupItem value="TRANSACTIONAL" id="transactional" />
                      <div className="font-medium">Transactional</div>
                    </Field>
                  </FieldLabel>
                  <FieldLabel htmlFor="promotional">
                    <Field orientation="horizontal">
                      <RadioGroupItem value="PROMOTIONAL" id="promotional" />
                      <div className="font-medium">Promotional</div>
                    </Field>
                  </FieldLabel>
                </RadioGroup>
              </Field>

              {/* From Name */}
              <Field>
                <FieldLabel htmlFor="fromName">
                  From Name <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="fromName"
                  value={formData.fromName}
                  onChange={e => handleInputChange('fromName', e.target.value)}
                  placeholder="Enter sender name"
                />
              </Field>

              {/* From Email */}
              <Field>
                <FieldLabel htmlFor="fromEmail">
                  From Email <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="fromEmail"
                  type="email"
                  value={formData.fromEmail}
                  onChange={e => handleInputChange('fromEmail', e.target.value)}
                  placeholder="Enter sender email"
                />
              </Field>

              {/* Reply-To Email */}
              <Field>
                <FieldLabel htmlFor="replyToEmail">Reply-To Email</FieldLabel>
                <Input
                  id="replyToEmail"
                  type="email"
                  value={formData.replyToEmail}
                  onChange={e => handleInputChange('replyToEmail', e.target.value)}
                  placeholder="Enter reply-to email"
                />
              </Field>

              {/* Subject */}
              <Field>
                <FieldLabel htmlFor="subject">
                  Subject <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={e => handleInputChange('subject', e.target.value)}
                  placeholder="Enter email subject"
                />
              </Field>
            </div>

            {/* Variables Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Template Variables
              </h3>

              {/* Add New Variable */}
              <div className="flex gap-2">
                <Combobox
                  items={availableFields}
                  value={
                    newVariableName && availableFields.includes(newVariableName)
                      ? newVariableName
                      : null
                  }
                  onValueChange={value => setNewVariableName(value ?? '')}
                  itemToStringValue={item => item}
                  itemToStringLabel={item => item}
                  isItemEqualToValue={(a, b) => a === b}
                >
                  <ComboboxInput placeholder="Select a field" className="w-full" />
                  <ComboboxContent
                    positionerClassName="z-[1001]"
                    container={comboboxPortalRef}
                  >
                    <ComboboxEmpty>No items found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item} value={item}>
                          {item}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                <Button type="button" onClick={handleAddVariable} disabled={!newVariableName}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Variables List - Display as pill badges */}
              {variables.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Selected Variables
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {variables.map(variableName => (
                      <Badge
                        key={variableName}
                        variant="default"
                        className="flex items-center gap-1.5 py-1 pr-1 pl-2.5 text-xs"
                      >
                        {variableName}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleRemoveVariable(variableName)}
                          title="Remove variable"
                          className="rounded-full p-0.5 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30"
                          aria-label={`Remove ${variableName}`}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Editor and Preview Side by Side */}
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden p-4">
            <div className="flex min-h-0 w-full flex-1 flex-col gap-4 lg:flex-row">
              {/* Left Column - Email Body Editor */}
              <div className="flex min-h-0 w-full flex-col lg:w-1/2">
                <div className="mb-4 flex flex-shrink-0 items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Email Body
                  </h3>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="source-mode" className="text-sm">
                      Source Mode
                    </Label>
                    <Switch
                      id="source-mode"
                      checked={isSourceMode}
                      onCheckedChange={handleSourceModeToggle}
                    />
                  </div>
                </div>

                {isSourceMode ? (
                  <div className="flex min-h-0 flex-1 flex-col rounded-lg border border-gray-300 dark:border-gray-700">
                    <div className="flex items-center rounded-t-lg gap-2 border-b border-gray-300 bg-gray-200 p-2 dark:border-gray-700 dark:bg-gray-800">
                      <Code className="h-4 w-4" />
                      <span className="text-sm font-medium">HTML Source</span>
                    </div>
                    <div className="flex min-h-0 flex-1 overflow-hidden">
                      <Textarea
                        ref={sourceTextareaRef}
                        value={sourceContent}
                        onChange={e => handleSourceContentChange(e.target.value)}
                        placeholder="Enter HTML content..."
                        className="min-h-full w-full resize-none overflow-y-auto rounded-none border-0 bg-transparent font-mono text-sm text-gray-900 focus:ring-0 focus:ring-offset-0 dark:text-white"
                        style={{
                          minHeight: '400px',
                          height: '100%',
                          maxHeight: getDynamicHeight(),
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="email-template-editor flex min-h-0 flex-1 flex-col bg-white dark:bg-background rounded-lg border border-gray-300 dark:border-gray-700">
                    {/* Editor Toolbar */}
                    <div className="flex flex-wrap rounded-t-lg items-center gap-1 border-b border-gray-300 bg-gray-200 p-2 dark:border-gray-700 dark:bg-background">
                      {/* Heading Dropdown */}
                      <div className="heading-dropdown relative">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setShowHeadingDropdown(!showHeadingDropdown)}
                          className="flex min-w-[120px] items-center justify-between gap-1 px-2 py-1 text-xs"
                        >
                          <span>
                            {headingLabels[getCurrentHeading() as keyof typeof headingLabels]}
                          </span>
                          <ChevronDown className="h-3 w-3" />
                        </Button>

                        {showHeadingDropdown && (
                          <div className="absolute left-0 z-[9999] min-w-[120px] rounded-md border border-gray-300 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800">
                            <button
                              onClick={() => setHeading(0)}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              Paragraph
                            </button>
                            {([1, 2, 3, 4, 5, 6] as const).map(level => (
                              <button
                                key={level}
                                onClick={() => setHeading(level)}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                Heading {level}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600" />

                      {/* Text Formatting */}
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => editor?.chain().focus().toggleBold().run()}
                        className={
                          editor?.isActive('bold') ? 'bg-gray-400 dark:bg-gray-700' : ''
                        }
                      >
                        <BoldIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => editor?.chain().focus().toggleItalic().run()}
                        className={
                          editor?.isActive('italic') ? 'bg-gray-400 dark:bg-gray-700' : ''
                        }
                      >
                        <ItalicIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => editor?.chain().focus().toggleUnderline().run()}
                        className={
                          editor?.isActive('underline') ? 'bg-gray-400 dark:bg-gray-700' : ''
                        }
                      >
                        <UnderlineIcon className="h-4 w-4" />
                      </Button>

                      <div className="mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600" />

                      {/* Lists */}
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => editor?.chain().focus().toggleBulletList().run()}
                        className={
                          editor?.isActive('bulletList') ? 'bg-gray-400 dark:bg-gray-700' : ''
                        }
                      >
                        <List className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                        className={
                          editor?.isActive('orderedList') ? 'bg-gray-400 dark:bg-gray-700' : ''
                        }
                      >
                        <ListOrdered className="h-4 w-4" />
                      </Button>

                      <div className="mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600" />

                      {/* Text Alignment */}
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                        className={
                          editor?.isActive({ textAlign: 'left' })
                            ? 'bg-gray-400 dark:bg-gray-700'
                            : ''
                        }
                      >
                        <AlignLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                        className={
                          editor?.isActive({ textAlign: 'center' })
                            ? 'bg-gray-400 dark:bg-gray-700'
                            : ''
                        }
                      >
                        <AlignCenter className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                        className={
                          editor?.isActive({ textAlign: 'right' })
                            ? 'bg-gray-400 dark:bg-gray-700'
                            : ''
                        }
                      >
                        <AlignRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex min-h-0 flex-1 overflow-hidden">
                      <EditorContent
                        editor={editor}
                        className="h-full max-h-full w-full overflow-y-auto [&_.ProseMirror:empty:before]:pointer-events-none [&_.ProseMirror:empty:before]:float-left [&_.ProseMirror:empty:before]:h-0 [&_.ProseMirror:empty:before]:text-gray-400! [&_.ProseMirror:empty:before]:content-[attr(data-placeholder)] [&_.ProseMirror]:h-full [&_.ProseMirror]:max-h-full [&_.ProseMirror]:overflow-y-auto [&_.ProseMirror]:p-4 [&_.ProseMirror]:text-gray-900 [&_.ProseMirror]:outline-hidden [&_.ProseMirror]:dark:text-white"
                        style={{ maxHeight: getDynamicHeight() }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Live Preview */}
              <div className="flex min-h-0 w-full flex-col lg:w-1/2">
                <div className="mb-4 flex flex-shrink-0 items-center gap-2">
                  <Eye className="h-5 w-5" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Live Preview
                  </h3>
                </div>

                <div className="flex min-h-0 flex-1 overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
                  <div
                    className="flex h-full w-full overflow-y-auto bg-background"
                    style={{ maxHeight: getDynamicHeight() }}
                  >
                    <div
                      className="prose prose-sm dark:docs-prose-dark min-h-full w-full  bg-white dark:bg-background max-w-none p-4"
                      dangerouslySetInnerHTML={{
                        __html: sanitizePreviewHTML(generatePreviewHTML()),
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
