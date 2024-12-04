import { useEffect, useRef } from 'react';
import { RemoteProps } from '../types';
import './BasicChat.css'

function getSimpleTimestamp() {
  const now = new Date();
  const hour = now.getHours();
  const hours = String(hour % 12).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const amPM = hour < 12 ? 'am' : (hour < 24 ? 'pm' : 'am');
  return `${hours}:${minutes}:${seconds}${amPM}`;
}

export default function BasicChat(props: RemoteProps) {
  const eventType = 'message';
  // References
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMessage = (evt: unknown) => {
      const event = evt as CustomEvent;
      if (inputRef.current && messagesRef.current) {
        const msgEl = messagesRef.current;
        const currentText = msgEl.innerHTML;
        const msg = `<span>${getSimpleTimestamp()}</span> - ${event.detail}`
        if (currentText.length > 0) {
          const bottom = msgEl.scrollTop + msgEl.clientHeight >= msgEl.scrollHeight;
          msgEl.innerHTML = `${currentText}<br>${msg}`;
          if (bottom) messagesRef.current.scrollTo(0, messagesRef.current.scrollHeight);
        } else {
          messagesRef.current.innerHTML = msg;
        }
      }
    }

    if (props.remote.isApp) {
      props.remote.editor.addEventListener(eventType, onMessage);
    } else {
      props.remote.app.addEventListener(eventType, onMessage);
    }
    return () => {
      props.remote.editor.removeEventListener(eventType, onMessage);
      props.remote.app.removeEventListener(eventType, onMessage);
    };
  }, [props]);

  function sendMessage() {
    const text = inputRef.current?.value;
    if (text?.length === 0) return;
    props.remote.send({
      target: props.remote.isApp ? 'editor' : 'app',
      event: 'message',
      data: text,
    })
    inputRef.current!.value = ''
  }

  return (
    <div id='BasicChat'>
      <div ref={messagesRef}></div>
      <input
        ref={inputRef}
        onKeyDown={(evt) => {
          if (evt.key === 'Enter') sendMessage();
        }}
      ></input>
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
