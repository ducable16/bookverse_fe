import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import { createLowlight } from 'lowlight';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Code,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  Code2,
  Highlighter,
  Indent,
  Outdent,
  Wand2,
  Eraser,
} from 'lucide-react';
import { useState } from 'react';
import './tiptap-styles.css';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
}

export const TiptapEditor = ({
  content,
  onChange,
  placeholder = 'Bắt đầu viết hoặc gõ "/" để xem lệnh...',
  editable = true,
}: TiptapEditorProps) => {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // We'll use CodeBlockLowlight instead
      }),
      Placeholder.configure({
        placeholder,
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-coral-600 underline hover:text-coral-700 cursor-pointer',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight: createLowlight(),
        HTMLAttributes: {
          class: 'code-block',
        },
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none',
      },
      handleKeyDown: (view, event) => {
        // Handle Tab key for indentation
        if (event.key === 'Tab') {
          event.preventDefault();
          
          const { state, dispatch } = view;
          const { selection } = state;
          
          if (event.shiftKey) {
            // Shift+Tab: Remove indentation (6 spaces or 1 tab)
            const { from } = selection;
            const textBefore = state.doc.textBetween(Math.max(0, from - 6), from);
            
            // Check if there are spaces or tab to remove
            if (textBefore === '      ' || textBefore.endsWith('\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0')) {
              // Remove 6 spaces
              const tr = state.tr.delete(from - 6, from);
              dispatch(tr);
              return true;
            } else if (textBefore.endsWith('\t')) {
              // Remove tab character
              const tr = state.tr.delete(from - 1, from);
              dispatch(tr);
              return true;
            }
            return true;
          } else {
            // Tab: Insert 6 spaces (non-breaking spaces for better HTML rendering)
            const tab = '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0';
            const tr = state.tr.insertText(tab, selection.from, selection.to);
            dispatch(tr);
            return true;
          }
        }
        return false;
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('Nhập URL hình ảnh:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setShowLinkInput(false);
      setLinkUrl('');
    }
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
    setShowLinkInput(false);
  };

  const handleIndent = () => {
    if (!editor) return;
    const tab = '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0';
    editor.chain().focus().insertContent(tab).run();
  };

  const handleOutdent = () => {
    if (!editor) return;
    const { state, dispatch } = editor.view;
    const { selection } = state;
    const { from } = selection;
    const textBefore = state.doc.textBetween(Math.max(0, from - 6), from);
    
    if (textBefore === '      ' || textBefore.endsWith('\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0')) {
      const tr = state.tr.delete(from - 6, from);
      dispatch(tr);
    } else if (textBefore.endsWith('\t')) {
      const tr = state.tr.delete(from - 1, from);
      dispatch(tr);
    }
  };

  const handleBeautify = () => {
    if (!editor) return;
    
    const { state, dispatch } = editor.view;
    const { doc } = state;
    
    // Thu thập tất cả nodes cần modify
    const nodesToModify: Array<{ node: any; pos: number }> = [];
    doc.descendants((node, pos) => {
      if (node.type.name === 'paragraph' || 
          node.type.name === 'heading' || 
          node.type.name === 'listItem') {
        const textContent = node.textContent;
        const trimmedContent = textContent.replace(/^[\s\u00A0]+/, '');
        if (trimmedContent.length > 0 && trimmedContent !== textContent) {
          nodesToModify.push({ node, pos });
        } else if (trimmedContent.length > 0 && !textContent.startsWith('\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0')) {
          // Node chưa có indent
          nodesToModify.push({ node, pos });
        }
      }
      return true;
    });
    
    // Apply changes từ cuối lên đầu để tránh position shifting
    let tr = state.tr;
    for (let i = nodesToModify.length - 1; i >= 0; i--) {
      const { node, pos } = nodesToModify[i];
      const textContent = node.textContent;
      const trimmedContent = textContent.replace(/^[\s\u00A0]+/, '');
      
      if (trimmedContent.length > 0) {
        const indent = '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0';
        const newContent = indent + trimmedContent;
        const from = pos + 1;
        const to = pos + 1 + textContent.length;
        
        if (textContent.length > 0) {
          tr = tr.replaceWith(from, to, state.schema.text(newContent));
        } else {
          tr = tr.insertText(newContent, from);
        }
      }
    }
    
    if (tr.docChanged) {
      dispatch(tr);
    }
  };

  const handleClearIndent = () => {
    if (!editor) return;
    
    const { state, dispatch } = editor.view;
    const { doc } = state;
    
    // Thu thập tất cả nodes cần modify
    const nodesToModify: Array<{ node: any; pos: number }> = [];
    doc.descendants((node, pos) => {
      if (node.type.name === 'paragraph' || 
          node.type.name === 'heading' || 
          node.type.name === 'listItem') {
        const textContent = node.textContent;
        const trimmedContent = textContent.replace(/^[\s\u00A0]+/, '');
        if (trimmedContent !== textContent && trimmedContent.length > 0) {
          nodesToModify.push({ node, pos });
        }
      }
      return true;
    });
    
    // Apply changes từ cuối lên đầu
    let tr = state.tr;
    for (let i = nodesToModify.length - 1; i >= 0; i--) {
      const { node, pos } = nodesToModify[i];
      const textContent = node.textContent;
      const trimmedContent = textContent.replace(/^[\s\u00A0]+/, '');
      
      if (trimmedContent.length > 0) {
        const from = pos + 1;
        const to = pos + 1 + textContent.length;
        tr = tr.replaceWith(from, to, state.schema.text(trimmedContent));
      }
    }
    
    if (tr.docChanged) {
      dispatch(tr);
    }
  };

  return (
    <div className="tiptap-editor-container">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-white border border-gray-200 rounded-t-lg p-2 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('strike') ? 'bg-gray-200' : ''}`}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('code') ? 'bg-gray-200' : ''}`}
            title="Inline Code"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>

        {/* Headings */}
        <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}`}
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>
        </div>

        {/* Lists & Quote */}
        <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`}
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('codeBlock') ? 'bg-gray-200' : ''}`}
            title="Code Block"
          >
            <Code2 className="w-4 h-4" />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}`}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}`}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}`}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>

        {/* Indent/Outdent */}
        <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
          <button
            type="button"
            onClick={handleOutdent}
            className="p-2 rounded hover:bg-gray-100"
            title="Outdent (Shift+Tab)"
          >
            <Outdent className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleIndent}
            className="p-2 rounded hover:bg-gray-100"
            title="Indent (Tab)"
          >
            <Indent className="w-4 h-4" />
          </button>
        </div>

        {/* Beautify & Clear */}
        <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
          <button
            type="button"
            onClick={handleBeautify}
            className="p-2 rounded hover:bg-gray-100"
            title="Beautify - Thụt lề đồng nhất (6 spaces)"
          >
            <Wand2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleClearIndent}
            className="p-2 rounded hover:bg-gray-100"
            title="Clear Indent - Loại bỏ thụt lề"
          >
            <Eraser className="w-4 h-4" />
          </button>
        </div>

        {/* Highlight */}
        <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('highlight') ? 'bg-gray-200' : ''}`}
            title="Highlight"
          >
            <Highlighter className="w-4 h-4" />
          </button>
        </div>

        {/* Link & Image */}
        <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
          <button
            type="button"
            onClick={() => setShowLinkInput(!showLinkInput)}
            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
            title="Add Link"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={addImage}
            className="p-2 rounded hover:bg-gray-100"
            title="Add Image"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Undo/Redo */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            className="p-2 rounded hover:bg-gray-100"
            title="Undo"
            disabled={!editor.can().undo()}
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            className="p-2 rounded hover:bg-gray-100"
            title="Redo"
            disabled={!editor.can().redo()}
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Link Input */}
      {showLinkInput && (
        <div className="bg-gray-50 border-x border-gray-200 p-3 flex items-center space-x-2">
          <input
            type="url"
            placeholder="Nhập URL..."
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setLink();
              }
            }}
            className="flex-1 px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-coral-400 text-sm"
            autoFocus
          />
          <button
            type="button"
            onClick={setLink}
            className="px-3 py-1.5 bg-coral-500 text-white rounded hover:bg-coral-600 text-sm"
          >
            Thêm
          </button>
          {editor.isActive('link') && (
            <button
              type="button"
              onClick={removeLink}
              className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 text-sm"
            >
              Gỡ link
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setShowLinkInput(false);
              setLinkUrl('');
            }}
            className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 text-sm"
          >
            Hủy
          </button>
        </div>
      )}

      {/* Bubble Menu - appears when text is selected */}
      {/* Note: BubbleMenu requires @tiptap/extension-bubble-menu package */}
      {/* Uncomment after installing: npm install @tiptap/extension-bubble-menu */}
      {/* {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="bubble-menu bg-gray-900 text-white rounded-lg shadow-lg p-1 flex items-center space-x-1"
        >
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-700 ${editor.isActive('bold') ? 'bg-gray-700' : ''}`}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-700 ${editor.isActive('italic') ? 'bg-gray-700' : ''}`}
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-gray-700 ${editor.isActive('underline') ? 'bg-gray-700' : ''}`}
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-gray-700 ${editor.isActive('strike') ? 'bg-gray-700' : ''}`}
          >
            <Strikethrough className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-2 rounded hover:bg-gray-700 ${editor.isActive('code') ? 'bg-gray-700' : ''}`}
          >
            <Code className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-600 mx-1"></div>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run()}
            className={`p-2 rounded hover:bg-gray-700 ${editor.isActive('highlight') ? 'bg-gray-700' : ''}`}
          >
            <Highlighter className="w-4 h-4" />
          </button>
        </BubbleMenu>
      )} */}

      {/* Floating Menu - appears on empty lines */}
      {/* Note: FloatingMenu requires @tiptap/extension-floating-menu package */}
      {/* Uncomment after installing: npm install @tiptap/extension-floating-menu */}
      {/* {editor && (
        <FloatingMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="floating-menu bg-white border border-gray-200 rounded-lg shadow-lg p-1 flex items-center space-x-1"
        >
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className="p-2 rounded hover:bg-gray-100"
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className="p-2 rounded hover:bg-gray-100"
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className="p-2 rounded hover:bg-gray-100"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
        </FloatingMenu>
      )} */}

      {/* Editor Content */}
      <div className="border-x border-b border-gray-200 rounded-b-lg bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
