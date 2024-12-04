/* eslint-disable @typescript-eslint/ban-ts-comment */
export type ApplicationTarget = 'app' | 'editor'

export interface BroadcastData {
  target: ApplicationTarget
  event: string
  data?: unknown
}

export default class RemoteController {
  app: EventTarget
  editor: EventTarget
  isApp = true;

  protected _broadcastChannel?: BroadcastChannel | undefined = undefined;

  constructor(id: string) {
    this.app = new EventTarget();
    this.editor = new EventTarget();
    this._broadcastChannel = new BroadcastChannel(id);
    this._broadcastChannel.addEventListener('message', this.messageHandler);
  }

  dispose() {
    this._broadcastChannel?.removeEventListener('message', this.messageHandler);
    this._broadcastChannel?.close();
  }

  send(data: BroadcastData) {
    this._broadcastChannel?.postMessage(data);
  }

  // Getters

  get isEditor(): boolean {
    return !this.isApp;
  }

  // Handlers

  private messageHandler = (evt: MessageEvent) => {
    const data = evt.data as BroadcastData;
    const target = data.target === 'app' ? this.editor : this.app;
    // @ts-ignore
    target.dispatchEvent(new CustomEvent(data.event, { detail: data.data }));
  }
}
