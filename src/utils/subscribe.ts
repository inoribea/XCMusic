/*---------------------------------------------------------------*
 * YiktLLW .. 2025-03-21 .. Johannes Brahms
 * subscribe.ts 为订阅模块，用于订阅事件
 * 在需要使用的地方，创建一个Subscriber实例
 * 然后使用on方法订阅事件，使用exec方法执行事件
 * 使用off方法取消订阅，使用offAll方法取消某个id订阅的所有事件
 *---------------------------------------------------------------*/

import { markRaw } from "vue";

interface SubscriberItem {
  globalIndex: number;
  id: number | string;
  func: Function;
  type: string;
}

export class Subscriber<
  EventsCallbacks extends Record<string, (...args: any) => any>,
> {
  _subscribes: Array<SubscriberItem> = markRaw([]);
  /**
   *  单个订阅的全局索引
   */
  globalIndex = 0;
  /**
   * 允许订阅的事件类型
   */
  allowedEvents: { [key: string]: string };
  /**
   * 订阅事件类
   * @param {Array<string>} allowedEvents 允许订阅的事件类型
   */
  constructor(allowedEvents: { [key: string]: string }) {
    this.allowedEvents = allowedEvents;
  }
  /**
   * 添加订阅，私有函数，请勿在外部调用
   */
  push({
    id,
    func,
    type,
  }: {
    id: string | number;
    func: Function;
    type: string;
  }) {
    this._subscribes.push({
      globalIndex: this.globalIndex,
      id: id,
      func: func,
      type: type,
    });
    this.globalIndex++;
  }
  /**
   * 更新订阅，私有函数，请勿在外部调用
   */
  updateSubscribe(globalIndex: string | number, func: Function) {
    let index = this._subscribes.findIndex(
      (item) => item.globalIndex === globalIndex,
    );
    if (index !== -1) {
      this._subscribes[index].func = func;
    }
  }
  /**
   * 订阅一种事件
   * @returns 返回订阅的回调函数，可以?.()调用，来达到立即执行的效果
   */
  on<K extends keyof EventsCallbacks>(
    /** 用来标识订阅者的唯一ID */
    id: string,
    /** 需要订阅的事件类型 */
    type: K,
    /** 回调函数 */
    func: EventsCallbacks[K],
  ): EventsCallbacks[K] | undefined {
    if (typeof func !== "function") {
      console.error("func is not a function: ", JSON.stringify(func, null, 4));
      return;
    }
    if (id === "" || type === "") {
      console.error("id or type is empty");
      return;
    }
    if (!(type in this.allowedEvents)) {
      console.error(
        "type is not in allowedEvents: ",
        type,
        "allowedEvents: ",
        JSON.stringify(this.allowedEvents, null, 4),
      );
      return;
    }
    let arrayWithId = this._subscribes.filter((item) => item.id === id);
    if (arrayWithId.length === 0) {
      // 如果没有这个id的订阅，则直接添加到订阅列表。
      this.push({
        id: id as string,
        func: func,
        type: type as string,
      });
    }
    // 如果有这个id的订阅
    else {
      let index = arrayWithId.findIndex(
        (_item: { type: string | undefined }) => _item.type === type,
      );
      if (index === -1) {
        // 如果有这个id的订阅，但是没有这个type的订阅，则直接添加到订阅列表。
        this.push({
          id: id as string,
          func: func,
          type: type as string,
        });
      } else {
        // 如果有这个id的订阅，而且也有这个type的订阅，则更新这个订阅。
        this.updateSubscribe(arrayWithId[index]?.globalIndex, func);
      }
    }
    return func;
  }

  /**
   * 取消订阅一种事件
   * @param {Object} options - 事件处理的参数对象
   * @param {string} [options.id=''] - 用来标识订阅者的唯一id
   * @param {string} [options.type=''] - 要取消订阅的事件类型
   */
  off<K extends keyof EventsCallbacks>(id: string, type: K) {
    if (!(type in this.allowedEvents)) {
      console.error(
        "type is not in allowedEvents: ",
        type,
        "allowedEvents: ",
        JSON.stringify(this.allowedEvents, null, 4),
      );
      return;
    }
    let arrayWithId = this._subscribes.filter((item) => item.id === id);
    if (arrayWithId.length !== 0) {
      arrayWithId.forEach((item: { type: string; globalIndex: number }) => {
        if (item.type === type) {
          let index = this._subscribes.findIndex(
            (_item: { globalIndex: number }) =>
              _item.globalIndex === item.globalIndex,
          );
          this._subscribes.splice(index, 1);
        }
      });
    }
  }
  /**
   * 取消某个id订阅的所有事件
   */
  offAll(id: string) {
    let arrayWithId = this._subscribes.filter((item) => item.id === id);
    arrayWithId.forEach((item: { globalIndex: number }) => {
      let index = this._subscribes.findIndex(
        (_item: { globalIndex: number }) =>
          _item.globalIndex === item.globalIndex,
      );
      this._subscribes.splice(index, 1);
    });
  }
  /**
   * 执行某种事件
   * @param {string} type - 要执行的事件类型
   */
  exec<K extends keyof EventsCallbacks>(
    type: K,
    ...args: Parameters<EventsCallbacks[K]>
  ) {
    if (!(type in this.allowedEvents)) {
      console.error(
        "type is not in allowedEvents: ",
        type,
        "allowedEvents: ",
        JSON.stringify(this.allowedEvents, null, 4),
      );
      return;
    }
    this._subscribes.forEach((item) => {
      if (item.type === type) {
        item.func(...args);
      }
    });
  }
  /**
   * 清空所有订阅
   */
  clear() {
    this._subscribes = [];
    this.globalIndex = 0;
  }
}
