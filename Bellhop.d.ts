export as namespace Bellhop;

interface PriorityFunction extends Function {
  private _priority: number;
}

export class BellhopEventDispatcher {
  constructor();
  on(name: string, callback: Function, priority?: number): void;
  off(name: string, callback: Function): void;
  trigger(event: object | string): void;
  destroy(): void;
  private listenerSorter(a: PriorityFunction, b: PriorityFunction): number;

}

export class Bellhop extends BellhopEventDispatcher {
  constructor(id?: number | string);
  private id: string;
  private connected: boolean;
  private isChild: boolean;
  private connecting: boolean;
  private origin: string;
  private _sendLater: any[];
  private iframe: HTMLIFrameElement | null;
  private receive(message: MessageEvent);
  private onConnectionReceived(message: object);
  connect(iframe?: HTMLIFrameElement, origin?: string ): Bellhop;
  disconnect(): void;
  send(type: string, data?: any): void;
  fetch(event: string, callback: Function, data?: object, runOnce?: boolean): void;
  respond(event: string, data?: object, runOnce?: boolean): void;
  destroy(): void;
  target(): Window | HTMLIFrameElement | ParentNode;
}