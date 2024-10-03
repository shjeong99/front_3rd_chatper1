// eventManager.js

// 이벤트 위임을 위한 전역 이벤트 맵
// 이 맵은 이벤트 타입별로 요소와 해당 요소의 이벤트 핸들러를 저장합니다.
const eventMap = new Map();

// 이벤트 위임이 설정될 루트 요소
let rootElement = null;

// TODO: setupEventListeners 함수 구현
// 이 함수는 루트 요소에 이벤트 위임을 설정합니다.
// 주의: 이벤트 캡처링을 사용하여 이벤트를 상위에서 하위로 전파
export function setupEventListeners(root) {
  // 1. rootElement 설정
  rootElement = root;

  // 2. 기존에 설정된 이벤트 리스너 제거 (있다면)
  // 3. eventMap에 등록된 모든 이벤트 타입에 대해 루트 요소에 이벤트 리스너 추가
  Array.from(eventMap.keys()).forEach((eventType) => {
    removeEvent(rootElement, eventType, handleEvent);
    rootElement.addEventListener(eventType, handleEvent);
  });
}

// TODO: handleEvent 함수 구현
// 이 함수는 실제 이벤트가 발생했을 때 호출되는 핸들러입니다.
function handleEvent(event) {
  // 1. 이벤트 타겟에서 시작하여 루트 요소까지 버블링
  const target = event.target;
  const type = event.type;

  // 2. 각 요소에 대해 해당 이벤트 타입의 핸들러가 있는지 확인
  const handlers = eventMap.get(type);
  if (handlers && handlers.has(target)) {
    // 3. 핸들러가 있다면 실행
    for (const [element, handler] of handlers) {
      if (typeof element === "object" && element === target) {
        event.preventDefault();
        handler(event);
        break;
      }
      if (typeof element === "string" && target.matches(element)) {
        event.preventDefault();
        handler(event);
        break;
      }
    }
  }
  // 이를 통해 하위 요소에서 발생한 이벤트를 상위에서 효율적으로 처리할 수 있습니다.
}

// TODO: addEvent 함수 구현
export function addEvent(element, eventType, handler) {
  // 이 함수를 통해 개별 요소에 직접 이벤트를 붙이지 않고도 이벤트 처리 가능

  // 1. eventMap에 이벤트 타입과 요소, 핸들러 정보 저장
  if (!eventMap.has(eventType)) {
    eventMap.set(eventType, new Map());
  }

  // 2. 필요한 경우 루트 요소에 새 이벤트 리스너 추가
  const eventHandlers = eventMap.get(eventType);
  eventHandlers.set(element, handler);
}

// TODO: removeEvent 함수 구현
export function removeEvent(element, eventType, handler) {
  // 1. eventMap에서 해당 요소와 이벤트 타입에 대한 핸들러 제거
  if (eventMap.has(eventType)) {
    const eventHandlers = eventMap.get(eventType);

    if (eventHandlers.has(element)) {
      eventHandlers.delete(element); // 요소에 대한 핸들러 제거
    }

    // 2. 해당 이벤트 타입의 모든 핸들러가 제거되면 루트 요소의 리스너도 제거
    if (eventHandlers.size === 0) {
      rootElement.removeEventListener(eventType, handleEvent, true);
      eventMap.delete(eventType); // 이벤트 타입도 eventMap에서 제거
    }
  }
  // 이를 통해 더 이상 필요 없는 이벤트 핸들러를 정리하고 메모리 누수 방지
}
