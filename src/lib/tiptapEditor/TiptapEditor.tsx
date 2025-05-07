'use client'

import { Bold, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import { FontSize } from '@/lib/tiptapEditor/extensions/fontSize'
import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'

export interface TiptapEditorRef {
  getHTML: () => string
}
interface TiptapEditorProps {
  initialContent?: string
  onChange?: (html: string) => void
}

const TiptapEditor = forwardRef<TiptapEditorRef, TiptapEditorProps>(
  ({ initialContent = '', onChange }, ref) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const editor = useEditor({
      extensions: [
        StarterKit,
        TextStyle,
        Color,
        Image,
        FontSize,
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
      ],
      content: initialContent,
      onUpdate: ({ editor }) => {
        const html = editor.getHTML()
        onChange?.(html)
      },
    })

    useImperativeHandle(ref, () => ({
      getHTML: () => editor?.getHTML() ?? '',
    }))

    useEffect(() => {
      if (editor && initialContent) {
        editor.commands.setContent(initialContent)
      }
    }, [initialContent, editor])
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file || !editor) return

      const reader = new FileReader()
      reader.onload = () => {
        const base64 = reader.result as string
        editor.chain().focus().setImage({ src: base64 }).run()
      }
      reader.readAsDataURL(file)
    }

    return (
      <div className="p-1 w-full border rounded-md bg-white">
        {/* 커스텀 툴바 */}
        <div className="flex gap-2 flex-wrap mb-1 py-1 border-b">
          <button
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className="px-2 py-1 border rounded hover:bg-gray-100"
          >
            <Bold />
          </button>

          <select
            onChange={(e) => editor?.chain().focus().setFontSize(e.target.value).run()}
            className="px-2 py-1 border rounded"
          >
            <option value="16px">기본</option>
            <option value="20px">크게</option>
            <option value="24px">더 크게</option>
          </select>

          <input
            type="color"
            onChange={(e) => editor?.chain().focus().setColor(e.target.value).run()}
            className="w-10 h-10 p-0"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-2 py-1 border rounded hover:bg-gray-100"
          >
            <ImageIcon />
          </button>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            ref={fileInputRef}
            className="hidden"
          />

          <button
            onClick={() => editor?.chain().focus().setTextAlign('left').run()}
            className="px-2 py-1 border rounded hover:bg-gray-100"
          >
            <AlignLeft />
          </button>

          <button
            onClick={() => editor?.chain().focus().setTextAlign('center').run()}
            className="px-2 py-1 border rounded hover:bg-gray-100"
          >
            <AlignCenter />
          </button>

          <button
            onClick={() => editor?.chain().focus().setTextAlign('right').run()}
            className="px-2 py-1 border rounded hover:bg-gray-100"
          >
            <AlignRight />
          </button>
        </div>

        <EditorContent
          editor={editor}
          className="prose max-w-none min-h-[300px] focus:outline-none"
        />
      </div>
    )
  },
)

TiptapEditor.displayName = 'TiptapEditor'

export default TiptapEditor
