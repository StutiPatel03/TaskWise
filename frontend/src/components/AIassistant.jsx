import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useState } from 'react'
import { MessageCircle, Send, Bot, User, Sparkles, LoaderCircle } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const suggestedQuestions = [
  'Give me a summary of the student data',
  'Which department has the highest average marks?',
  'How many students have attendance below 75%?',
  'Does study time relate to academic performance?',
]

export default function AIAssistant({ analysis }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hi! I’m your Student Data Assistant. Upload and analyze a spreadsheet first, then ask me about academic performance, attendance, departments, or student trends.',
    },
  ])
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function sendMessage(text = question) {
    const prompt = text.trim()

    if (!prompt || loading) return

    if (!analysis) {
      setError('Please upload and analyze a spreadsheet before asking questions.')
      return
    }

    setMessages((previous) => [
      ...previous,
      { role: 'user', content: prompt },
    ])
    setQuestion('')
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: prompt }),
        credentials: 'include',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Could not get an answer.')
      }

      setMessages((previous) => [
        ...previous,
        {
          role: 'assistant',
          content: result.answer,
        },
      ])
    } catch (err) {
      setError(
        err.message === 'Failed to fetch'
          ? 'Cannot connect to Flask. Make sure the backend is running.'
          : err.message
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-100 p-3 text-indigo-700">
            <Sparkles size={25} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              AI Student Assistant
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Explore your uploaded student data using natural language.
            </p>
          </div>
        </div>
      </div>

      <div className="flex min-h-105 flex-col rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center gap-3 border-b border-slate-200 p-4">
          <div className="rounded-full bg-indigo-50 p-2 text-indigo-600">
            <MessageCircle size={20} />
          </div>
          <div>
            <p className="font-semibold text-slate-900">
              Student Data Assistant
            </p>
            <p className="text-xs text-slate-500">
              Answers based on your analyzed dataset
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
          {messages.map((message, index) => (
            <div
              key={`${index}-${message.role}`}
              className={`flex items-start gap-3 ${
                message.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`rounded-full p-2 ${
                  message.role === 'user'
                    ? 'bg-slate-100 text-slate-700'
                    : 'bg-indigo-100 text-indigo-700'
                }`}
              >
                {message.role === 'user' ? (
                  <User size={17} />
                ) : (
                  <Bot size={17} />
                )}
              </div>
              
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === 'user'
                    ? 'whitespace-pre-wrap bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-800'
                }`}
                >
                {message.role === 'user' ? (
                    message.content
                ) : (
                    <div className="max-w-none [&_h1]:mb-3 [&_h1]:mt-1 [&_h1]:text-lg [&_h1]:font-bold [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-base [&_h2]:font-bold [&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:text-sm [&_h3]:font-bold [&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_strong]:font-semibold [&_strong]:text-slate-900 [&_table]:my-3 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-200 [&_th]:p-2 [&_th]:text-left [&_td]:border [&_td]:border-slate-300 [&_td]:p-2 [&_hr]:my-3">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                    </ReactMarkdown>
                    </div>
                )}
              </div>

            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <LoaderCircle size={17} className="animate-spin" />
              Analyzing your question...
            </div>
          )}

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}
        </div>

        <div className="border-t border-slate-200 p-4">
          <form
            onSubmit={(event) => {
              event.preventDefault()
              sendMessage()
            }}
            className="flex items-center gap-3"
          >
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask something about your student data..."
              disabled={loading}
              className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="rounded-xl bg-indigo-600 p-3 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Send message"
            >
              <Send size={19} />
            </button>
          </form>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">
          Try asking
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {suggestedQuestions.map((item) => (
            <button
              key={item}
              type="button"
              disabled={loading}
              onClick={() => sendMessage(item)}
              className="rounded-xl border border-slate-200 bg-white p-3 text-left text-sm text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-50"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
