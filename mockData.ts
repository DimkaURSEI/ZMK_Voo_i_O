
import { Machine, MachineStatus } from './types';

export const MACHINES: Machine[] = [
  {
    id: 'm1',
    name: 'Messer MultiTherm',
    model: 'Плазменный комплекс ЧПУ',
    description: 'Основная установка для раскроя листовых деталей толщиной до 50мм. Оборудована суппортом для газовой резки (до 150мм). Используется для изготовления фасонных деталей колонн и связей.',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800',
    status: MachineStatus.WORK,
    operations: ['1'],
    tools: ['Штангенциркуль ШЦ-II-250', 'Линейка стальная 1000мм', 'Шаблон сварщика УШС-3'],
    consumables: ['Сопло плазменное 130A', 'Электрод медный', 'Защитный колпачок каретки'],
    bbox: { x: 50, y: 150, width: 250, height: 180 }
  },
  {
    id: 'm2',
    name: 'Kaltenbach KBS 620',
    model: 'Ленточнопильный станок',
    description: 'Высокопроизводительный станок для резки тяжелого профиля. Позволяет выполнять резы под углом до 60 градусов. Интегрирован с автоматической системой рольгангов.',
    image: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=800',
    status: MachineStatus.IDLE,
    operations: ['5'],
    tools: ['Угломер оптический', 'Рулетка 10м (I класс)', 'Маркер промышленный'],
    consumables: ['Полотно ленточное 54мм', 'СОЖ концентрат Shell', 'Гидравлические фильтры'],
    bbox: { x: 350, y: 400, width: 300, height: 150 }
  },
  {
    id: 'm3',
    name: 'Voortman V630',
    model: 'Сверлильная линия',
    description: 'Линия для автоматического сверления и фрезерования отверстий в балках с трех сторон одновременно. Исключает ручную разметку.',
    image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&q=80&w=800',
    status: MachineStatus.REPAIR,
    operations: ['6', '13'],
    tools: ['Нутромер индикаторный', 'Набор калибров-пробок', 'Глубиномер'],
    consumables: ['Сверла твердосплавные D14-D32', 'Сменные пластины для фрезерования', 'Датчики касания'],
    bbox: { x: 700, y: 200, width: 200, height: 250 }
  },
  {
    id: 'm4',
    name: 'Faccin 4HEL',
    model: '4-х валковая машина',
    description: 'Применяется для гибки обечаек и конических элементов резервуаров. ЧПУ управление обеспечивает высокую точность радиуса.',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    status: MachineStatus.WORK,
    operations: ['11'],
    tools: ['Шаблоны радиусные R500-R2000', 'Щупы зазоров', 'Нивелир лазерный'],
    consumables: ['Смазка подшипников валов', 'Масло Shell Tellus 46', 'Уплотнения цилиндров'],
    bbox: { x: 100, y: 550, width: 220, height: 200 }
  }
];
