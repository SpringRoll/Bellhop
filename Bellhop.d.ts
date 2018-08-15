export as namespace BellhopIframe;

interface PriorityFunction extends Function {
  _priority: number;
}

export class BellhopEventDispatcher {
  constructor();
  destroy(): void;
  listenerSorter(a: PriorityFunction, b: PriorityFunction): number;
  off(name: string, callback: Function): void;
  on(name: string, callback: Function, priority?: number): void;
  trigger(event: object | string): void;

}

export class Bellhop extends BellhopEventDispatcher {
  constructor(id?: number | string);
  _sendLater: any[];
  connected: boolean;
  connecting: boolean;
  id: string;
  iframe: HTMLIFrameElement | null;
  isChild: boolean;
  origin: string;
  connect(iframe?: HTMLIFrameElement, origin?: string ): Bellhop;
  destroy(): void;
  disconnect(): void;
  fetch(event: string, callback: Function, data?: object, runOnce?: boolean): void;
  onConnectionReceived(message: object);
  receive(message: MessageEvent);
  respond(event: string, data?: object, runOnce?: boolean): void;
  send(type: string, data?: any): void;
  target(): Window | HTMLIFrameElement | ParentNode;
}