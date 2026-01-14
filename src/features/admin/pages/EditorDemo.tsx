import { useState } from 'react';
import { AdminHeader } from '../components/AdminHeader';
import { TiptapEditor } from '../components/TiptapEditor';
import { Eye, Code } from 'lucide-react';

export const EditorDemo = () => {
  const [content, setContent] = useState('<h1>Chào mừng đến với Editor</h1><p>Bắt đầu viết nội dung của bạn tại đây...</p>');
  const [showPreview, setShowPreview] = useState(false);
  const [showHTML, setShowHTML] = useState(false);

  return (
    <div className="min-h-screen bg-cream-50">
      <AdminHeader
        title="Tiptap Editor Demo"
        subtitle="Editor WYSIWYG giống Notion với đầy đủ tính năng"
      />

      <div className="p-8 max-w-6xl mx-auto">
        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-gray-900">Editor</h2>
            <span className="text-sm text-gray-500">
              {content.length} ký tự
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                showPreview
                  ? 'bg-coral-500 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>{showPreview ? 'Ẩn Preview' : 'Xem Preview'}</span>
            </button>
            <button
              onClick={() => setShowHTML(!showHTML)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                showHTML
                  ? 'bg-coral-500 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>{showHTML ? 'Ẩn HTML' : 'Xem HTML'}</span>
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <TiptapEditor
            content={content}
            onChange={setContent}
            placeholder="Bắt đầu viết... Gõ / để xem các lệnh nhanh"
          />
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Preview</h3>
              <span className="text-sm text-gray-500">Xem trước nội dung</span>
            </div>
            <div
              className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        )}

        {/* HTML Code Panel */}
        {showHTML && (
          <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">HTML Code</h3>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(content);
                  alert('Đã copy HTML vào clipboard!');
                }}
                className="text-sm text-coral-600 hover:text-coral-700 font-medium"
              >
                Copy HTML
              </button>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <code className="text-sm font-mono">{content}</code>
            </pre>
          </div>
        )}

        {/* Features List */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Tính năng</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureItem title="Text Formatting" items={['Bold, Italic, Underline', 'Strikethrough', 'Inline Code', 'Highlight']} />
            <FeatureItem title="Headings" items={['Heading 1, 2, 3', 'Paragraph', 'Text Alignment']} />
            <FeatureItem title="Lists & Blocks" items={['Bullet List', 'Numbered List', 'Blockquote', 'Code Block']} />
            <FeatureItem title="Media" items={['Images', 'Links']} />
            <FeatureItem title="Menus" items={['Bubble Menu', 'Floating Menu', 'Toolbar']} />
            <FeatureItem title="Actions" items={['Undo / Redo', 'Keyboard Shortcuts']} />
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="bg-white rounded-xl shadow-sm p-8 mt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Phím tắt</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ShortcutItem shortcut="Ctrl + B" description="Bold" />
            <ShortcutItem shortcut="Ctrl + I" description="Italic" />
            <ShortcutItem shortcut="Ctrl + U" description="Underline" />
            <ShortcutItem shortcut="Ctrl + Shift + X" description="Strikethrough" />
            <ShortcutItem shortcut="Ctrl + E" description="Code" />
            <ShortcutItem shortcut="Ctrl + Alt + 1" description="Heading 1" />
            <ShortcutItem shortcut="Ctrl + Alt + 2" description="Heading 2" />
            <ShortcutItem shortcut="Ctrl + Alt + 3" description="Heading 3" />
            <ShortcutItem shortcut="Ctrl + Shift + 7" description="Ordered List" />
            <ShortcutItem shortcut="Ctrl + Shift + 8" description="Bullet List" />
            <ShortcutItem shortcut="Ctrl + Z" description="Undo" />
            <ShortcutItem shortcut="Ctrl + Shift + Z" description="Redo" />
          </div>
        </div>
      </div>
    </div>
  );
};

interface FeatureItemProps {
  title: string;
  items: string[];
}

const FeatureItem = ({ title, items }: FeatureItemProps) => (
  <div className="p-4 bg-gray-50 rounded-lg">
    <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
    <ul className="space-y-1">
      {items.map((item, idx) => (
        <li key={idx} className="text-sm text-gray-600 flex items-center">
          <span className="w-1.5 h-1.5 bg-coral-500 rounded-full mr-2"></span>
          {item}
        </li>
      ))}
    </ul>
  </div>
);

interface ShortcutItemProps {
  shortcut: string;
  description: string;
}

const ShortcutItem = ({ shortcut, description }: ShortcutItemProps) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <span className="text-sm text-gray-600">{description}</span>
    <kbd className="px-3 py-1 bg-white border border-gray-300 rounded text-xs font-mono text-gray-700">
      {shortcut}
    </kbd>
  </div>
);

