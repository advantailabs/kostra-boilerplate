'use client';

import { Button } from '@/components/atom/Button';
import { useFileUpload } from '@/hooks/useFileUpload';
import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import CodeBlock from '@tiptap/extension-code-block';
import Color from '@tiptap/extension-color';
import Image from '@tiptap/extension-image';
import Italic from '@tiptap/extension-italic';
import Link from '@tiptap/extension-link';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
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
  CheckSquare,
  ChevronDown,
  CodeIcon,
  ImageIcon,
  Italic as ItalicIcon,
  LinkIcon,
  List,
  ListOrdered,
  Palette,
  QuoteIcon,
  StrikethroughIcon,
  Underline as UnderlineIcon,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Custom Image Resize Extension
const ImageResize = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        renderHTML: attributes => {
          if (!attributes.width) {
            return {};
          }
          return {
            width: attributes.width,
          };
        },
        parseHTML: element => element.getAttribute('width'),
      },
      height: {
        default: null,
        renderHTML: attributes => {
          if (!attributes.height) {
            return {};
          }
          return {
            height: attributes.height,
          };
        },
        parseHTML: element => element.getAttribute('height'),
      },
      style: {
        default: null,
        renderHTML: attributes => {
          if (!attributes.style) {
            return {};
          }
          return {
            style: attributes.style,
          };
        },
        parseHTML: element => element.getAttribute('style'),
      },
      align: {
        default: 'center',
        renderHTML: attributes => {
          if (!attributes.align) {
            return {};
          }
          return {
            align: attributes.align,
          };
        },
        parseHTML: element => element.getAttribute('align') || 'center',
      },
    };
  },
  addCommands() {
    return {
      ...this.parent?.(),
      setImageAlign:
        (align: 'left' | 'center' | 'right') =>
        ({ commands }: { commands: any }) => {
          return commands.updateAttributes('image', { align });
        },
    };
  },
});

interface EditorProps {
  onImageUpload?: (_image: File) => void;
  initialContent?: string;
  onContentChange?: (_content: string) => void;
}

function Editor({
  onImageUpload,
  initialContent = '<p>Write Something here...</p>',
  onContentChange,
}: EditorProps) {
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadFile, isUploading } = useFileUpload({
    uploadPurpose: 'BlogImage',
    objectName: 'blog',
    objectId: 0,
    onSuccess: () => {},
  });

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        !target.closest('.heading-dropdown') &&
        !target.closest('.link-dropdown') &&
        !target.closest('.color-dropdown')
      ) {
        setShowHeadingDropdown(false);
        setShowLinkInput(false);
        setShowColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    editable: true,
    enableInputRules: true,
    enablePasteRules: true,
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
          class: 'list-disc',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'list-decimal',
        },
      }),
      ListItem.configure({
        HTMLAttributes: {
          class: '',
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'bg-gray-100 dark:bg-gray-800 p-4 rounded-md font-mono text-sm',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'list-none pl-0',
        },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'flex items-center gap-2',
        },
      }),
      ImageResize.configure({
        HTMLAttributes: {
          class: 'tiptap-image',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
      }),
      TextStyle,
      Color,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          'mx-auto focus:outline-none min-h-[150px] cursor-text text-gray-900 dark:text-white text-sm',
        'data-placeholder': 'Write something here...',
      },
    },
    onUpdate: ({ editor }) => {
      // Get HTML content
      const html = editor.getHTML();

      // Call the onContentChange callback if provided
      if (onContentChange) {
        onContentChange(html);
      }
    },
  });

  // Update editor content when initialContent changes
  useEffect(() => {
    if (editor && initialContent && editor.getHTML() !== initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  // Add image click handler for selection
  useEffect(() => {
    if (!editor) return;

    const handleImageClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'IMG') {
        event.preventDefault();
        editor.commands.setNodeSelection(editor.state.selection.from);
      }
    };

    const editorElement = editor.view.dom;
    editorElement.addEventListener('click', handleImageClick);

    return () => {
      editorElement.removeEventListener('click', handleImageClick);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor.chain().focus().toggleUnderline().run();
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run();
  const toggleTaskList = () => editor.chain().focus().toggleTaskList().run();
  const toggleStrike = () => editor.chain().focus().toggleStrike().run();
  const toggleCode = () => editor.chain().focus().toggleCode().run();
  const toggleCodeBlock = () => editor.chain().focus().toggleCodeBlock().run();
  const toggleBlockquote = () => editor.chain().focus().toggleBlockquote().run();

  const setTextAlign = (align: 'left' | 'center' | 'right') => {
    editor.chain().focus().setTextAlign(align).run();
  };

  const resizeImage = (width: number, height?: number) => {
    const currentImage = editor.getAttributes('image');
    editor
      .chain()
      .focus()
      .updateAttributes('image', {
        width: `${width}px`,
        height: height ? `${height}px` : 'auto',
        align: currentImage.align || 'center',
        style: `max-width: 100%; height: auto; cursor: pointer; width: ${width}px;`,
      })
      .run();
  };

  const setImageAlign = (align: 'left' | 'center' | 'right') => {
    editor.chain().focus().updateAttributes('image', { align }).run();
  };

  const setTextColor = (color: string) => {
    editor.chain().focus().setMark('textStyle', { color }).run();
    setSelectedColor(color);
    setShowColorPicker(false);
  };

  const setLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
    setShowLinkInput(false);
  };

  const handleLinkButtonClick = () => {
    const currentLink = editor.getAttributes('link').href;
    if (currentLink) {
      setLinkUrl(currentLink);
    } else {
      setLinkUrl('');
    }
    setShowLinkInput(!showLinkInput);
  };

  const setHeading = (level: 1 | 2 | 3 | 4 | 5 | 6 | 0) => {
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

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (event: { target: { files: FileList | null } }) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || undefined;
    if (!file) return;

    try {
      if (file.size > 5 * 1024 * 1024) {
        console.error('File cannot be greater than 5MB');
        return;
      }

      const publicUrl = await uploadFile(file);

      if (publicUrl) {
        editor
          .chain()
          .focus()
          .setImage({
            src: publicUrl,
          })
          .run();

        // Set default medium size and center alignment after image is inserted
        setTimeout(() => {
          editor
            .chain()
            .focus()
            .updateAttributes('image', {
              width: '400px',
              height: 'auto',
              align: 'center',
              style: 'max-width: 100%; height: auto; cursor: pointer; width: 400px;',
            })
            .run();
        }, 100);

        // Call the optional callback if provided
        if (onImageUpload) {
          onImageUpload(file);
        }
      }
    } catch (err) {
      console.error('Image upload failed:', err);
    }
  };

  const getCurrentHeading = () => {
    for (let i = 1; i <= 6; i += 1) {
      if (editor.isActive('heading', { level: i })) {
        return i;
      }
    }
    return 0;
  };

  const getCurrentImageAlign = () => {
    if (editor.isActive('image')) {
      return editor.getAttributes('image').align || 'center';
    }
    return 'center';
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

  const presetColors = [
    '#000000',
    '#ffffff',
    '#ff0000',
    '#00ff00',
    '#0000ff',
    '#ffff00',
    '#ff00ff',
    '#00ffff',
    '#ffa500',
    '#800080',
    '#008000',
    '#ffc0cb',
    '#a52a2a',
    '#808080',
    '#000080',
  ];

  return (
    <div className="flex h-full w-full flex-col">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-2 border-b border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-950">
        {/* Heading Dropdown */}
        <div className="heading-dropdown relative">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setShowHeadingDropdown(!showHeadingDropdown)}
            className="flex min-w-[120px] items-center justify-between gap-1 px-2 py-1 text-xs"
          >
            <span>{headingLabels[getCurrentHeading() as keyof typeof headingLabels]}</span>
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

        <div className="mx-2 h-6 w-px bg-gray-300" />

        {/* Bold */}
        <Button
          type="button"
          variant={editor.isActive('bold') ? 'primary' : 'secondary'}
          onClick={toggleBold}
          className="flex items-center gap-1 px-2 py-1 text-xs"
        >
          <BoldIcon className="h-4 w-4" />
        </Button>

        {/* Italic */}
        <Button
          type="button"
          variant={editor.isActive('italic') ? 'primary' : 'secondary'}
          onClick={toggleItalic}
          className="flex items-center gap-1 px-2 py-1 text-xs"
        >
          <ItalicIcon className="h-4 w-4" />
        </Button>

        {/* Underline */}
        <Button
          type="button"
          variant={editor.isActive('underline') ? 'primary' : 'secondary'}
          onClick={toggleUnderline}
          className="flex items-center gap-1 px-2 py-1 text-xs"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>

        {/* Strike */}
        <Button
          type="button"
          variant={editor.isActive('strike') ? 'primary' : 'secondary'}
          onClick={toggleStrike}
          className="flex items-center gap-1 px-2 py-1 text-xs"
        >
          <StrikethroughIcon className="h-4 w-4" />
        </Button>

        <div className="mx-2 h-6 w-px bg-gray-300" />

        {/* Text Color Button */}
        <div className="color-dropdown relative">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="flex items-center gap-1 px-2 py-1 text-xs"
          >
            <Palette className="h-4 w-4" />
          </Button>

          {showColorPicker && (
            <div className="absolute left-0 top-full z-[9999] mt-1 min-w-[200px] rounded-md border border-gray-300 bg-white p-3 shadow-lg dark:border-gray-600 dark:bg-gray-800">
              <div className="mb-3 grid grid-cols-5 gap-2">
                {presetColors.map(color => (
                  <button
                    key={color}
                    onClick={() => setTextColor(color)}
                    className="h-8 w-8 rounded border border-gray-300 transition-transform hover:scale-110"
                    style={{ backgroundColor: color }}
                    title={color}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={selectedColor}
                  onChange={e => setSelectedColor(e.target.value)}
                  className="h-8 w-8 cursor-pointer rounded border border-gray-300"
                  aria-label="Color picker"
                />
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => setTextColor(selectedColor)}
                  className="px-2 py-1 text-xs"
                >
                  Apply
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mx-2 h-6 w-px bg-gray-300" />

        {/* Text Alignment Buttons */}
        <Button
          type="button"
          variant={editor.isActive({ textAlign: 'left' }) ? 'primary' : 'secondary'}
          onClick={() => setTextAlign('left')}
          className="flex items-center gap-1 px-2 py-1 text-xs"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant={editor.isActive({ textAlign: 'center' }) ? 'primary' : 'secondary'}
          onClick={() => setTextAlign('center')}
          className="flex items-center gap-1 px-2 py-1 text-xs"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant={editor.isActive({ textAlign: 'right' }) ? 'primary' : 'secondary'}
          onClick={() => setTextAlign('right')}
          className="flex items-center gap-1 px-2 py-1 text-xs"
        >
          <AlignRight className="h-4 w-4" />
        </Button>

        <div className="mx-2 h-6 w-px bg-gray-300" />

        {/* Code */}
        <Button
          type="button"
          variant={editor.isActive('code') ? 'primary' : 'secondary'}
          onClick={toggleCode}
          className="flex items-center gap-1 px-2 py-1 text-xs"
        >
          <CodeIcon className="h-4 w-4" />
        </Button>

        {/* Code Block */}
        <Button
          type="button"
          variant={editor.isActive('codeBlock') ? 'primary' : 'secondary'}
          onClick={toggleCodeBlock}
          className="flex items-center gap-1 px-2 py-1 text-xs"
        >
          <CodeIcon className="h-4 w-4" />
          <span>Block</span>
        </Button>

        {/* Blockquote */}
        <Button
          type="button"
          variant={editor.isActive('blockquote') ? 'primary' : 'secondary'}
          onClick={toggleBlockquote}
          className="flex items-center gap-1 px-2 py-1 text-xs"
        >
          <QuoteIcon className="h-4 w-4" />
        </Button>

        <div className="mx-2 h-6 w-px bg-gray-300" />

        {/* Link Button */}
        <div className="link-dropdown relative">
          <Button
            type="button"
            variant={editor.isActive('link') ? 'primary' : 'secondary'}
            onClick={handleLinkButtonClick}
            className="flex items-center gap-1 px-2 py-1 text-xs"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>

          {showLinkInput && (
            <div className="absolute left-0 top-full z-[9999] mt-1 min-w-[300px] rounded-md border border-gray-300 bg-white p-2 shadow-lg dark:border-gray-600 dark:bg-gray-800">
              <input
                type="url"
                placeholder="Enter URL..."
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                aria-label="Link URL"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    setLink();
                  }
                  if (e.key === 'Escape') {
                    setShowLinkInput(false);
                  }
                }}
              />
              <div className="mt-2 flex gap-1">
                <Button
                  type="button"
                  variant="primary"
                  onClick={setLink}
                  className="px-2 py-1 text-xs"
                >
                  Set Link
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={removeLink}
                  className="px-2 py-1 text-xs"
                >
                  Remove
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Image */}
        <Button
          type="button"
          variant="secondary"
          onClick={triggerImageUpload}
          disabled={isUploading}
          className="flex items-center gap-1 px-2 py-1 text-xs"
        >
          <ImageIcon className={`h-4 w-4 ${isUploading ? 'animate-spin' : ''}`} />
          {isUploading && <span>Uploading...</span>}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={e => handleImageUpload(e)}
          className="hidden"
        />

        {/* Image Resize Controls */}
        {editor.isActive('image') && (
          <>
            <div className="mx-2 h-6 w-px bg-gray-300" />
            <Button
              type="button"
              variant="secondary"
              onClick={() => resizeImage(200)}
              className="px-2 py-1 text-xs"
            >
              Small
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => resizeImage(400)}
              className="px-2 py-1 text-xs"
            >
              Medium
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => resizeImage(600)}
              className="px-2 py-1 text-xs"
            >
              Large
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => resizeImage(800)}
              className="px-2 py-1 text-xs"
            >
              XL
            </Button>

            {/* Image Alignment Controls */}
            <div className="mx-2 h-6 w-px bg-gray-300" />
            <Button
              type="button"
              variant={getCurrentImageAlign() === 'left' ? 'primary' : 'secondary'}
              onClick={() => setImageAlign('left')}
              className="flex items-center gap-1 px-2 py-1 text-xs"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={getCurrentImageAlign() === 'center' ? 'primary' : 'secondary'}
              onClick={() => setImageAlign('center')}
              className="flex items-center gap-1 px-2 py-1 text-xs"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={getCurrentImageAlign() === 'right' ? 'primary' : 'secondary'}
              onClick={() => setImageAlign('right')}
              className="flex items-center gap-1 px-2 py-1 text-xs"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </>
        )}

        <div className="mx-2 h-6 w-px bg-gray-300" />

        <Button
          type="button"
          variant={editor.isActive('bulletList') ? 'primary' : 'secondary'}
          onClick={toggleBulletList}
          className="flex items-center gap-1 px-2 py-1 text-xs"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant={editor.isActive('orderedList') ? 'primary' : 'secondary'}
          onClick={toggleOrderedList}
          className="flex items-center gap-1 px-2 py-1 text-xs"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant={editor.isActive('taskList') ? 'primary' : 'secondary'}
          onClick={toggleTaskList}
          className="flex items-center gap-1 px-2 py-1 text-xs"
        >
          <CheckSquare className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <div
        className="scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 dark:scrollbar-track-gray-800 dark:scrollbar-thumb-gray-600 dark:hover:scrollbar-thumb-gray-500 flex-1 cursor-text overflow-y-auto"
        onClick={e => {
          e.stopPropagation();
          if (editor && !editor.isFocused) {
            editor.commands.focus();
          }
        }}
      >
        <EditorContent
          editor={editor}
          className="tiptap-editor-content cursor-text focus:outline-none"
        />
      </div>
    </div>
  );
}

export default Editor;
