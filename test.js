function deepClone(obj, seen = new WeakMap()) {
    if (obj === null || typeof obj !== 'object') return obj; // Примитивные значения и null
    
    if (seen.has(obj)) return seen.get(obj); // Обработка циклических ссылок
    
    let copy;
    
    if (obj instanceof Date) {
        copy = new Date(obj);
    } else if (obj instanceof Map) {
        copy = new Map();
        obj.forEach((value, key) => copy.set(key, deepClone(value, seen)));
    } else if (obj instanceof Set) {
        copy = new Set();
        obj.forEach(value => copy.add(deepClone(value, seen)));
    } else if (Array.isArray(obj)) {
        copy = [];
        obj.forEach((value, index) => copy[index] = deepClone(value, seen));
    } else {
        copy = Object.create(Object.getPrototypeOf(obj)); // Сохранение прототипа
        seen.set(obj, copy); // Запоминаем объект перед рекурсией
        Reflect.ownKeys(obj).forEach(key => copy[key] = deepClone(obj[key], seen)); // Копируем свойства, включая символы
    }
    
    return copy;
}

const obj = {
    num: 42,
    bool: true,
    str: "hello",
    date: new Date(),
    arr: [1, 2, { nested: "value" }],
    map: new Map([["key", "value"]]),
    set: new Set([1, 2, 3]),
    func: function() { return "test func"; },
    sym: Symbol("sym"),
    nestedObj: {}
};

obj.nestedObj.self = obj;

const clone = deepClone(obj);

console.log("Оригинал:", obj);
console.log("Копия:", clone);
console.log("Одинаковы ли объекты?", obj === clone);
console.log("Одинаковы ли массивы?", obj.arr === clone.arr);
console.log("Одинаковы ли карты?", obj.map === clone.map);
console.log("Одинаковы ли множества?", obj.set === clone.set);
console.log("Копия функции:", clone.func());
console.log("Цикл сохранился?", clone.nestedObj.self === clone);
