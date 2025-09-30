// @ts-nocheck
import { useState, useRef } from 'react'
import { 
  Bold, Italic, Strikethrough, List, ListOrdered, Link, Image, 
  AlignLeft, AlignCenter, AlignRight, Smile, Code, Quote, Heading1, Heading2
} from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export function RichTextEditor({ value, onChange, placeholder = "Start writing..." }) {
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const editorRef = useRef(null)
  const fileInputRef = useRef(null)

  const emojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
    '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
    '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
    '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
    '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
    '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
    '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😯', '😦', '😧',
    '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢',
    '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '💩', '👻', '💀',
    '☠️', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽',
    '🙀', '😿', '😾', '🙈', '🙉', '🙊', '👶', '👧', '🧒', '👦',
    '👩', '🧑', '👨', '👵', '🧓', '👴', '👮‍♀️', '👮', '👮‍♂️', '🕵️‍♀️',
    '🕵️', '🕵️‍♂️', '💂‍♀️', '💂', '💂‍♂️', '👷‍♀️', '👷', '👷‍♂️', '🤴', '👸',
    '👳‍♀️', '👳', '👳‍♂️', '👲', '🧕', '🤵‍♀️', '🤵', '🤵‍♂️', '👰‍♀️', '👰',
    '👰‍♂️', '🤰', '🤱', '👼', '🎅', '🤶', '🧙‍♀️', '🧙', '🧙‍♂️', '🧝‍♀️',
    '🧝', '🧝‍♂️', '🧛‍♀️', '🧛', '🧛‍♂️', '🧟‍♀️', '🧟', '🧟‍♂️', '🧞‍♀️', '🧞',
    '🧞‍♂️', '🧜‍♀️', '🧜', '🧜‍♂️', '🧚‍♀️', '🧚', '🧚‍♂️', '👼', '🤰', '🤱',
    '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '💽', '💾', '💿', '📀',
    '📱', '📲', '📟', '📠', '🔋', '🔌', '💡', '🔦', '🕯️', '🪔',
    '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '🪙', '💰', '💳',
    '💎', '⚖️', '🪜', '🧰', '🪛', '🔧', '🔨', '⚒️', '🛠️', '⛏️',
    '🪚', '🔩', '⚙️', '🪤', '🧲', '🧪', '🧫', '🧬', '🦠', '🧻',
    '🧺', '🧽', '🪣', '🧴', '🪒', '🧷', '🪡', '🧹', '🪠', '🧼',
    '🪢', '🧿', '🪞', '🪟', '🪝', '🪜', '🧸', '🪆', '🪄', '🪅',
    '🪩', '🪨', '🪧', '🪪', '🪦', '🪦', '🪦', '🪦', '🪦', '🪦'
  ]

  const insertText = (text) => {
    const textarea = editorRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newValue = value.substring(0, start) + text + value.substring(end)
    onChange(newValue)
    
    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + text.length, start + text.length)
    }, 0)
  }

  const wrapText = (before, after) => {
    const textarea = editorRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const newValue = value.substring(0, start) + before + selectedText + after + value.substring(end)
    onChange(newValue)
    
    // Set cursor position
    setTimeout(() => {
      textarea.focus()
      if (selectedText) {
        textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
      } else {
        textarea.setSelectionRange(start + before.length, start + before.length)
      }
    }, 0)
  }

  const insertEmoji = (emoji) => {
    insertText(emoji)
    setShowEmojiPicker(false)
  }

  const insertLink = () => {
    if (linkUrl && linkText) {
      const linkMarkdown = `[${linkText}](${linkUrl})`
      insertText(linkMarkdown)
      setLinkUrl('')
      setLinkText('')
      setShowLinkInput(false)
      toast.success('Link inserted successfully!')
    } else {
      toast.error('Please enter both URL and text for the link')
    }
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB')
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageMarkdown = `![${file.name}](${e.target.result})`
        insertText(imageMarkdown)
        toast.success('Image inserted successfully!')
      }
      reader.readAsDataURL(file)
    }
  }

  const toolbarButtons = [
    { icon: Bold, action: () => wrapText('**', '**'), tooltip: 'Bold' },
    { icon: Italic, action: () => wrapText('*', '*'), tooltip: 'Italic' },
    { icon: Strikethrough, action: () => wrapText('~~', '~~'), tooltip: 'Strikethrough' },
    { icon: Heading1, action: () => wrapText('# ', ''), tooltip: 'Heading 1' },
    { icon: Heading2, action: () => wrapText('## ', ''), tooltip: 'Heading 2' },
    { icon: Code, action: () => wrapText('`', '`'), tooltip: 'Inline Code' },
    { icon: Quote, action: () => wrapText('> ', ''), tooltip: 'Quote' },
    { icon: List, action: () => wrapText('- ', ''), tooltip: 'Bullet List' },
    { icon: ListOrdered, action: () => wrapText('1. ', ''), tooltip: 'Numbered List' },
    { icon: AlignLeft, action: () => wrapText('<div style="text-align: left;">', '</div>'), tooltip: 'Align Left' },
    { icon: AlignCenter, action: () => wrapText('<div style="text-align: center;">', '</div>'), tooltip: 'Align Center' },
    { icon: AlignRight, action: () => wrapText('<div style="text-align: right;">', '</div>'), tooltip: 'Align Right' },
  ]

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-gray-50 border border-gray-200 rounded-t-lg p-2">
        <div className="flex flex-wrap gap-1">
          {/* Formatting buttons */}
          {toolbarButtons.map((button, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={button.action}
              className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600 hover:text-gray-900"
              title={button.tooltip}
            >
              <button.icon size={16} />
            </motion.button>
          ))}
          
          {/* Divider */}
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          
          {/* Link button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLinkInput(!showLinkInput)}
            className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600 hover:text-gray-900"
            title="Insert Link"
          >
            <Link size={16} />
          </motion.button>
          
          {/* Image upload button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600 hover:text-gray-900"
            title="Upload Image"
          >
            <Image size={16} />
          </motion.button>
          
          {/* Emoji button */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600 hover:text-gray-900"
              title="Insert Emoji"
            >
              <Smile size={16} />
            </motion.button>
            
            {/* Emoji Picker */}
            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50 max-w-64 max-h-64 overflow-y-auto"
              >
                <div className="grid grid-cols-8 gap-1">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => insertEmoji(emoji)}
                      className="p-1 hover:bg-gray-100 rounded text-lg"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Link Input */}
        {showLinkInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2 p-3 bg-white border border-gray-200 rounded-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Link text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                className="input text-sm"
              />
              <input
                type="url"
                placeholder="URL"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="input text-sm"
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={insertLink}
                className="px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700"
              >
                Insert Link
              </button>
              <button
                onClick={() => setShowLinkInput(false)}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Editor */}
      <textarea
        ref={editorRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-[200px] p-4 border border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-y"
      />

      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Help text */}
      <div className="text-sm text-gray-500">
        <p>💡 <strong>Tips:</strong></p>
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li>Use <code>**bold**</code> for <strong>bold text</strong></li>
          <li>Use <code>*italic*</code> for <em>italic text</em></li>
          <li>Use <code>`code`</code> for <code>inline code</code></li>
          <li>Use <code>- item</code> for bullet lists</li>
          <li>Use <code>1. item</code> for numbered lists</li>
          <li>Use <code>[text](url)</code> for links</li>
          <li>Use <code>![alt](url)</code> for images</li>
        </ul>
      </div>
    </div>
  )
} 