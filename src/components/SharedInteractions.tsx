/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useRef } from 'react';
import { RemoteProps } from '../types';
import './SharedInteractions.css'

export default function SharedInteractions(props: RemoteProps) {
  const colorEvent = 'backgroundColor';
  const dragEvent = 'moveDot';

  const containerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const dot = dotRef.current;
    const input = inputRef.current;
    if (!container || !dot || !input) return;

    // Color Input

    function changeBG(value: string) {
      container!.style.backgroundColor = value;
    }

    function onChangeInput(evt: Event) {
      // @ts-ignore
      const value = evt.target.value;
      changeBG(value);
      props.remote.send({
        target: props.remote.isApp ? 'editor' : 'app',
        event: colorEvent,
        data: value,
      })
    }

    input.addEventListener('input', onChangeInput);
    input.addEventListener('change', onChangeInput);

    // Interaction Events

    let mouseDown = false;

    function moveDot(x: number, y: number, send = false) {
      dot!.style.left = `${(x * 100).toFixed(2)}%`;
      dot!.style.top = `${(y * 100).toFixed(2)}%`;
      if (send) {
        props.remote.send({
          target: props.remote.isApp ? 'editor' : 'app',
          event: dragEvent,
          data: { x, y },
        })
      }
    }

    function onPointerDown(evt: PointerEvent) {
      if (evt.target === input) {
        evt.preventDefault();
        return;
      }

      mouseDown = true;
      const bounds = container!.getBoundingClientRect();
      const x = evt.layerX / bounds.width;
      const y = evt.layerY / bounds.height;
      moveDot(x, y, true);
    }

    function onPointerMove(evt: PointerEvent) {
      if (mouseDown) {
        const bounds = container!.getBoundingClientRect();
        const x = evt.layerX / bounds.width;
        const y = evt.layerY / bounds.height;
        moveDot(x, y, true);
      }
    }

    function onPointerUp() {
      mouseDown = false;
    }

    function onTouchDown(evt: TouchEvent) {
      if (evt.target === input) {
        evt.preventDefault();
        return;
      }

      mouseDown = true;
      const bounds = container!.getBoundingClientRect();
      const x = evt.touches[0].clientX / bounds.width;
      const y = evt.touches[0].clientY / bounds.height;
      moveDot(x, y, true);
    }

    function onTouchMove(evt: TouchEvent) {
      if (mouseDown) {
        const bounds = container!.getBoundingClientRect();
        const x = (evt.touches[0].clientX - bounds.left) / bounds.width;
        const y = (evt.touches[0].clientY - bounds.top) / bounds.height;
        moveDot(x, y, true);
      }
    }

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('touchstart', onTouchDown);
    container.addEventListener('touchmove', onTouchMove);
    container.addEventListener('touchend', onPointerUp);

    // BC Events

    const target = props.remote.isApp ? props.remote.editor : props.remote.app;

    function onColorUpdate(evt: unknown) {
      const event = evt as CustomEvent;
      changeBG(event.detail);
      if (input) input.value = event.detail;
    }

    function onMoveDot(evt: unknown) {
      const event = evt as CustomEvent;
      moveDot(event.detail.x, event.detail.y);
    }

    target.addEventListener(colorEvent, onColorUpdate);
    target.addEventListener(dragEvent, onMoveDot);

    return () => {
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('touchstart', onTouchDown);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onPointerUp);
      input.removeEventListener('input', onChangeInput);
      input.removeEventListener('change', onChangeInput);
      target.removeEventListener('backgroundColor', onColorUpdate);
      target.removeEventListener('moveDot', onMoveDot);
    }
  }, [props])

  return (
    <div id='SharedInteractions' ref={containerRef}>
      <input type='color' ref={inputRef} />
      <div className='dot' ref={dotRef} />
    </div>
  );
}