# Tiptap Editor - Notion-like WYSIWYG Editor

## 📍 Location
`src/features/admin/components/TiptapEditor.tsx`

## 🎯 Tổng quan

Tiptap Editor là một editor WYSIWYG (What You See Is What You Get) mạnh mẽ với giao diện giống Notion. Editor này được xây dựng trên nền tảng Tiptap v2 và cung cấp đầy đủ tính năng để tạo và chỉnh sửa nội dung phong phú.

## ✨ Tính năng

### 1. Text Formatting
- **Bold** (Ctrl+B)
- *Italic* (Ctrl+I)
- <u>Underline</u> (Ctrl+U)
- ~~Strikethrough~~ (Ctrl+Shift+X)
- `Inline Code` (Ctrl+E)
- ==Highlight== (Nút toolbar)

### 2. Headings
- Heading 1 (Ctrl+Alt+1)
- Heading 2 (Ctrl+Alt+2)
- Heading 3 (Ctrl+Alt+3)

### 3. Lists & Blocks
- Bullet List (Ctrl+Shift+8)
- Numbered List (Ctrl+Shift+7)
- Blockquote
- Code Block (với syntax highlighting qua lowlight)

### 4. Text Alignment
- Align Left
- Align Center
- Align Right

### 5. Media
- Images (thêm qua URL)
- Links (tạo, chỉnh sửa, xóa)

### 6. Interactive Menus

#### 🎈 Bubble Menu
- Xuất hiện khi bạn **select text**
- Cung cấp các công cụ format nhanh: Bold, Italic, Underline, Strikethrough, Code, Highlight
- Dark theme với animation mượt mà

#### 🎯 Floating Menu
- Xuất hiện trên **dòng trống**
- Cung cấp shortcuts để tạo Heading, List nhanh chóng
- Light theme để phân biệt với Bubble Menu

#### 🛠️ Toolbar
- Thanh công cụ đầy đủ ở trên cùng
- Sticky position (dính trên đầu khi scroll)
- Bao gồm tất cả tính năng format

### 7. Actions
- Undo (Ctrl+Z)
- Redo (Ctrl+Shift+Z)

## 🔧 Cách sử dụng

### Basic Usage

```tsx
import { TiptapEditor } from '../components/TiptapEditor';

function MyComponent() {
  const [content, setContent] = useState('<p>Initial content</p>');

  return (
    <TiptapEditor
      content={content}
      onChange={setContent}
      placeholder="Bắt đầu viết..."
      editable={true}
    />
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `string` | `''` | HTML content của editor |
| `onChange` | `(content: string) => void` | - | Callback khi nội dung thay đổi |
| `placeholder` | `string` | `'Bắt đầu viết...'` | Placeholder text |
| `editable` | `boolean` | `true` | Cho phép chỉnh sửa hay không |

### Read Only Mode

```tsx
// Hiển thị nội dung dạng read-only
<TiptapEditor
  content={articleContent}
  editable={false}
/>
```

### Integration với Form

```tsx
import { TiptapEditor } from '../components/TiptapEditor';
import { useState } from 'react';

function ChapterForm() {
  const [formData, setFormData] = useState({
    title: '',
    chapterNumber: 1,
    content: '<p>Nội dung chương...</p>',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Gửi data lên server
    await chaptersService.create({
      bookId: Number(bookId),
      ...formData,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Tiêu đề chương"
      />
      
      <TiptapEditor
        content={formData.content}
        onChange={(content) => setFormData({ ...formData, content })}
        placeholder="Viết nội dung chương..."
      />
      
      <button type="submit">Lưu chương</button>
    </form>
  );
}
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + B` | Bold |
| `Ctrl + I` | Italic |
| `Ctrl + U` | Underline |
| `Ctrl + Shift + X` | Strikethrough |
| `Ctrl + E` | Inline Code |
| `Ctrl + Alt + 1` | Heading 1 |
| `Ctrl + Alt + 2` | Heading 2 |
| `Ctrl + Alt + 3` | Heading 3 |
| `Ctrl + Shift + 7` | Ordered List |
| `Ctrl + Shift + 8` | Bullet List |
| `Ctrl + Shift + 9` | Blockquote |
| `Ctrl + Z` | Undo |
| `Ctrl + Shift + Z` | Redo |

## 🎨 Styling & Customization

### Custom Styles

Editor sử dụng Tailwind CSS và có thể tùy chỉnh thông qua file `tiptap-styles.css`.

File CSS nằm tại: `src/features/admin/components/tiptap-styles.css`

### Key CSS Classes

```css
.tiptap-editor-container  /* Container wrapper */
.ProseMirror              /* Editor content area */
.bubble-menu              /* Bubble menu styling */
.floating-menu            /* Floating menu styling */
```

## 🚀 Use Cases

### 1. Chapter Content Editor (Đang dùng)
```tsx
// In ChapterManagement.tsx
<TiptapEditor
  content={formData.content}
  onChange={(content) => setFormData({ ...formData, content })}
  placeholder="Viết nội dung chương..."
/>
```

### 2. Book Description Editor
```tsx
<TiptapEditor
  content={book.description}
  onChange={updateDescription}
  placeholder="Mô tả sách..."
/>
```

### 3. Author Bio Editor
```tsx
<TiptapEditor
  content={author.bio}
  onChange={updateBio}
  placeholder="Tiểu sử tác giả..."
/>
```

### 4. Display Content (Read-Only)
```tsx
<TiptapEditor
  content={chapter.content}
  editable={false}
/>
```

## 💡 Best Practices

1. **Always sanitize HTML output** khi lưu vào database
   ```tsx
   import DOMPurify from 'dompurify';
   
   const sanitizedContent = DOMPurify.sanitize(content);
   ```

2. **Use debouncing** cho onChange callback để giảm số lần API call
   ```tsx
   import { useDebouncedCallback } from 'use-debounce';
   
   const debouncedOnChange = useDebouncedCallback(
     (value) => onChange(value),
     500
   );
   ```

3. **Validate content** trước khi submit
   ```tsx
   if (!content || content === '<p></p>') {
     alert('Vui lòng nhập nội dung!');
     return;
   }
   ```

4. **Handle images properly** - upload lên server thay vì dùng base64
   ```tsx
   // TODO: Implement image upload service
   const uploadedUrl = await uploadService.uploadImage(file);
   editor.chain().focus().setImage({ src: uploadedUrl }).run();
   ```

5. **Provide good UX** - loading states, autosave, error handling
   ```tsx
   // Auto-save every 30 seconds
   useEffect(() => {
     const interval = setInterval(() => {
       if (hasUnsavedChanges) {
         autoSave();
       }
     }, 30000);
     return () => clearInterval(interval);
   }, [hasUnsavedChanges]);
   ```

## 🐛 Troubleshooting

### Editor không hiển thị
- ✅ Kiểm tra xem `tiptap-styles.css` đã được import chưa
- ✅ Xác nhận các dependencies đã được cài đặt đúng
- ✅ Check console để xem có lỗi gì không

### Styles không áp dụng
- ✅ Import CSS file: `import './tiptap-styles.css'`
- ✅ Kiểm tra Tailwind config đã include path này chưa
- ✅ Clear cache và rebuild: `npm run dev`

### Images không hiển thị
- ✅ Validate URL trước khi insert
- ✅ Check CORS nếu dùng external images
- ✅ Xem xét sử dụng image upload service

### Bubble Menu không xuất hiện
- ✅ Chắc chắn đang select text
- ✅ Check z-index conflicts
- ✅ Xem console có error về Tippy.js không

## 📦 Dependencies

Đã được cài đặt:
```json
{
  "@tiptap/react": "^2.x",
  "@tiptap/starter-kit": "^2.x",
  "@tiptap/extension-placeholder": "^2.x",
  "@tiptap/extension-underline": "^2.x",
  "@tiptap/extension-text-align": "^2.x",
  "@tiptap/extension-image": "^2.x",
  "@tiptap/extension-link": "^2.x",
  "@tiptap/extension-code-block-lowlight": "^2.x",
  "@tiptap/extension-color": "^2.x",
  "@tiptap/extension-highlight": "^2.x",
  "lowlight": "^3.x"
}
```

## 🎬 Demo

Xem demo đầy đủ tại: `/admin/editor`

Hoặc test trực tiếp trong Chapter Management: `/admin/chapters/:bookId`

## 🔮 Future Enhancements

### Có thể thêm:
1. **Slash Commands** - Gõ `/` để xem menu commands
2. **Drag & Drop** - Kéo thả để sắp xếp blocks
3. **Task Lists** - Checkbox lists
4. **Tables** - Bảng biểu
5. **Mentions** - @mention users
6. **Emojis** - Emoji picker
7. **Image Upload** - Direct upload thay vì URL
8. **Collaboration** - Real-time editing
9. **Version History** - Lưu lịch sử chỉnh sửa
10. **Word Count** - Đếm số từ

### Cách thêm extension mới:

```tsx
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';

const editor = useEditor({
  extensions: [
    // ... existing extensions
    TaskList,
    TaskItem.configure({
      nested: true,
    }),
  ],
});
```

## 📝 Notes

- Editor hiện tại đang được sử dụng trong **Chapter Management**
- Props interface tương thích ngược với version cũ
- Có thể dùng cho bất kỳ rich text input nào trong app
- Support cả read-only mode để display content

## 🤝 Contributing

Khi cần customize editor:
1. Sửa file `TiptapEditor.tsx` để thêm/sửa features
2. Sửa file `tiptap-styles.css` để thay đổi appearance
3. Test kỹ trên cả desktop và mobile
4. Cập nhật README này nếu có thay đổi quan trọng

## 📄 License

MIT

---

**Last Updated:** 2026-01-14
**Version:** 2.0.0 (Notion-like)
**Maintainer:** BookVerse Team

