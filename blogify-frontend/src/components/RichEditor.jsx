import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Heading2, Heading3, Quote, Code, Minus } from 'lucide-react';

const ToolbarBtn = ({ onClick, active, title, children }) => (
    <button
        type="button"
        onClick={onClick}
        title={title}
        style={{
            background: active ? 'var(--accent-primary)' : 'transparent',
            color: active ? '#fff' : 'var(--text-primary)',
            border: '1px solid var(--glass-border)',
            borderRadius: '6px',
            padding: '5px 8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '32px',
            height: '32px',
            transition: 'all 0.15s'
        }}
    >
        {children}
    </button>
);

const RichEditor = ({ content, onChange }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({ openOnClick: false }),
            Placeholder.configure({ placeholder: 'Write your brilliant article here...' }),
        ],
        content: content || '',
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // Keep editor in sync with content prop (for loading drafts / resetting form)
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            // If the content is plain text (doesn't start with a tag), wrap newlines in <p>
            const isHtml = /<[a-z][\s\S]*>/i.test(content);
            const formattedContent = (!isHtml && content) 
                ? content.split('\n').map(line => `<p>${line}</p>`).join('')
                : (content || '');
            
            editor.commands.setContent(formattedContent);
        }
    }, [content, editor]);

    if (!editor) return null;

    return (
        <div style={{ border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            {/* Toolbar */}
            <div style={{
                display: 'flex', flexWrap: 'wrap', gap: '4px', padding: '10px 12px',
                background: 'var(--bg-secondary)', borderBottom: '1px solid var(--glass-border)'
            }}>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
                    <Bold size={15} />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
                    <Italic size={15} />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
                    <UnderlineIcon size={15} />
                </ToolbarBtn>
                <div style={{ width: '1px', background: 'var(--glass-border)', margin: '0 4px' }} />
                <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">
                    <Heading2 size={15} />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">
                    <Heading3 size={15} />
                </ToolbarBtn>
                <div style={{ width: '1px', background: 'var(--glass-border)', margin: '0 4px' }} />
                <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">
                    <List size={15} />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered List">
                    <ListOrdered size={15} />
                </ToolbarBtn>
                <div style={{ width: '1px', background: 'var(--glass-border)', margin: '0 4px' }} />
                <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">
                    <Quote size={15} />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline Code">
                    <Code size={15} />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider">
                    <Minus size={15} />
                </ToolbarBtn>
            </div>

            {/* Editor Content */}
            <EditorContent
                editor={editor}
                style={{ minHeight: '300px', padding: '16px', fontSize: '1rem', lineHeight: '1.7', color: 'var(--text-primary)' }}
            />
        </div>
    );
};

export default RichEditor;
