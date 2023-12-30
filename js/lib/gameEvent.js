class GameEvent {
  constructor() {}
  bind(el, eventName, eventHandler, selector) {
    if (selector) {
      const wrappedHandler = (e) => {
        if (!e.target) return;
        const el = e.target.closest(selector);
        if (el) {
          eventHandler.call(el, e);
        }
      };
      el.addEventListener(eventName, wrappedHandler);
      return wrappedHandler;
    } else {
      const wrappedHandler = (e) => {
        eventHandler.call(el, e);
      };
      el.addEventListener(eventName, wrappedHandler);
      return wrappedHandler;
    }
  }
  trigger(el, eventType) {
    if (typeof eventType === "string" && typeof el[eventType] === "function") {
      el[eventType]();
    } else {
      const event =
        typeof eventType === "string"
          ? new Event(eventType, { bubbles: true })
          : eventType;
      el.dispatchEvent(event);
    }
  }
  bindKeyboardEvent(key, event, action) {
    window.addEventListener(event, function (e) {
      if (e.code == key || e.key == key){
        action(e);
      }
    }.bind(this));
  }
}
