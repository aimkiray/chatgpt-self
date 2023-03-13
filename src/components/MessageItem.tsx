import type { Accessor } from "solid-js"
import type { ChatMessage } from "../types"
import MarkdownIt from "markdown-it"
// @ts-ignore
import mdKatex from "markdown-it-katex"
import mdHighlight from "markdown-it-highlightjs"
import Clipboard from "./Clipboard"
import { preWrapperPlugin } from "../markdown"
import "../styles/message.css"
import { useCopyCode } from "../hooks"

interface Props {
  role: ChatMessage["role"]
  message: Accessor<string> | string
}

export default ({ role, message }: Props) => {
  useCopyCode()
  const roleClass = {
    system: "border-t-gray-300",
    user: "border-t-sky-300",
    assistant: "border-t-rose-300"
  }

  const htmlString = () => {
    const md = MarkdownIt({
      html: true,
      linkify: true
    })
      .use(mdKatex)
      .use(mdHighlight, {
        inline: true
      })
      .use(preWrapperPlugin)

    if (typeof message === "function") {
      return md.render(message().trim())
    } else if (typeof message === "string") {
      return md.render(message.trim())
    }
    return ""
  }

  // createEffect(() => {
  //   console.log(htmlString())
  // })

  return (
    <div
      class="my-2 rounded-lg transition-colors md:hover:bg-slate/5 dark:md:hover:bg-slate/2 relative message-item"
      // class:op-75={role === "user"}
    >
      <div
        class={`message prose prose-slate dark:prose-invert dark:text-slate break-words overflow-hidden border-t-2 ${roleClass[role]}`}
        style="box-shadow: inset 0 2px 0 rgb(0 0 0 / 0.05);"
        innerHTML={htmlString()}
      />
      <Clipboard
        message={(() => {
          if (typeof message === "function") {
            return message().trim()
          } else if (typeof message === "string") {
            return message.trim()
          }
          return ""
        })()}
      />
    </div>
  )
}
