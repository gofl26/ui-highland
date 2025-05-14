'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import { FontSize } from '@/lib/tiptapEditor/extensions/fontSize'

interface TiptapViewerProps {
  htmlContent: string
}

const TiptapViewer = ({ htmlContent }: TiptapViewerProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Image,
      FontSize,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: htmlContent,
    editable: false,
  })

  if (!editor) return null

  return (
    <div className="w-full">
      <EditorContent editor={editor} />
    </div>
  )
}

export default TiptapViewer
