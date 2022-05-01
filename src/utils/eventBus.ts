import mitt, { Emitter, EventType } from "mitt";

export const emitter = mitt();

// 全局状态通知，维护一个区局event
const useEventBus = (): Emitter<Record<EventType, unknown>>[] => {
  return [emitter];
};

export default useEventBus;
