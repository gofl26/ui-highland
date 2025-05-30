'use client'

import { Color } from '@tiptap/extension-color'
import { Image } from '@tiptap/extension-image'
import { TextAlign } from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Bold, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'

import { FontSize } from '@/lib/tiptapEditor/extensions/fontSize'

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
      <div className="w-full rounded-md border bg-white p-1">
        {/* 커스텀 툴바 */}
        <div className="mb-1 flex flex-wrap gap-2 border-b py-1">
          <button
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className="rounded border px-2 py-1 hover:bg-gray-100"
          >
            <Bold />
          </button>

          <select
            onChange={(e) => editor?.chain().focus().setFontSize(e.target.value).run()}
            className="rounded border px-2 py-1"
          >
            <option value="16px">기본</option>
            <option value="20px">크게</option>
            <option value="24px">더 크게</option>
          </select>

          <input
            type="color"
            onChange={(e) => editor?.chain().focus().setColor(e.target.value).run()}
            className="size-10 p-0"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded border px-2 py-1 hover:bg-gray-100"
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
            className="rounded border px-2 py-1 hover:bg-gray-100"
          >
            <AlignLeft />
          </button>

          <button
            onClick={() => editor?.chain().focus().setTextAlign('center').run()}
            className="rounded border px-2 py-1 hover:bg-gray-100"
          >
            <AlignCenter />
          </button>

          <button
            onClick={() => editor?.chain().focus().setTextAlign('right').run()}
            className="rounded border px-2 py-1 hover:bg-gray-100"
          >
            <AlignRight />
          </button>
        </div>

        <EditorContent
          editor={editor}
          className="prose min-h-[300px] max-w-none focus:outline-none"
        />
      </div>
    )
  },
)

TiptapEditor.displayName = 'TiptapEditor'

export default TiptapEditor
