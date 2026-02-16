import { Machine, MachineStatus } from './types';

export const MACHINES: Machine[] = [
  {
    id: 'm1',
    name: 'Messer MultiTherm',
    model: 'Плазменный комплекс ЧПУ',
    description: 'Основной узел раскроя листовых деталей. Оснащен головками для плазменной и газовой резки.',
    image: 'https://images.unsplash.com/photo-1530124560677-bdaeaef2f9cd?auto=format&fit=crop&q=80&w=800',
    status: MachineStatus.WORK,
    operations: ['1'],
    tools: ['ШЦ-II-250', 'Линейка 1000мм', 'УШС-3'],
    consumables: ['Электрод 130А', 'Сопло 130А', 'Электрод 260А', 'Сопло 260А', 'Завихритель', 'Защитный колпак'],
    bbox: { x: 450, y: 150, width: 220, height: 160 }
  },
  {
    id: 'm2',
    name: 'Kaltenbach KBS 620',
    model: 'Ленточнопильный станок',
    description: 'Высокопроизводительная пила для профильного проката. Используется для финишной резки в размер.',
    image: 'https://images.unsplash.com/photo-1590950751299-bb179d16116d?auto=format&fit=crop&q=80&w=800',
    status: MachineStatus.WORK,
    operations: ['5'],
    tools: ['Угломер стальной', 'Рулетка 10м'],
    consumables: ['Полотно M42 54x1.6x8800', 'Полотно M51 (Hard)', 'СОЖ Концентрат'],
    bbox: { x: 900, y: 450, width: 200, height: 120 }
  },
  {
    id: 'm3',
    name: 'Voortman V630',
    model: 'Сверлильная линия',
    description: 'Автоматическая линия для сверления и разметки балок с трех сторон.',
    image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&q=80&w=800',
    status: MachineStatus.REPAIR,
    operations: ['6'],
    tools: ['Нутромер', 'Калибры-пробки'],
    consumables: ['Сверло Твердосплавное D18', 'Сверло D22', 'Пластины WCMX 06T308', 'Сменные ножи разметки'],
    bbox: { x: 400, y: 450, width: 250, height: 180 }
  },
  {
    id: 'm5',
    name: 'Gietart GW 1500',
    model: 'Дробемётная установка',
    description: 'Входной узел очистки проката. Обеспечивает степень очистки Sa 2.5.',
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=800',
    status: MachineStatus.WORK,
    operations: ['19'],
    tools: ['Профилометр Elcometer', 'Скребок'],
    consumables: ['Дробь стальная колотая G25', 'Дробь литая S330', 'Лопатки турбин'],
    bbox: { x: 50, y: 300, width: 200, height: 300 }
  },
  {
    id: 'm7',
    name: 'NKO UZ-15',
    model: 'Кромкоскалывающий станок',
    description: 'Пресс для подготовки кромок под сварку на листах и полосах.',
    image: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=800',
    status: MachineStatus.WORK,
    operations: ['20'],
    tools: ['Угловой шаблон', 'Глубиномер'],
    consumables: ['Фреза скалывающая (к-т)', 'Вставки карбидные'],
    bbox: { x: 800, y: 150, width: 150, height: 150 }
  },
  {
    id: 'm8',
    name: 'Участок финишной зачистки',
    model: 'Зачистной пост',
    description: 'Ручная доработка деталей: снятие грата, зачистка брызг металла.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    status: MachineStatus.IDLE,
    operations: ['21'],
    tools: ['УШМ Bosch Professional', 'Пневмозубило'],
    consumables: ['Круг лепестковый P60', 'Круг фибровый 3M Cubitron', 'Защитные перчатки'],
    bbox: { x: 1050, y: 150, width: 120, height: 120 }
  }
];