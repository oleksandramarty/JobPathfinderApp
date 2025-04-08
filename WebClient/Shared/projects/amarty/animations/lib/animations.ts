import { trigger, state, style, animate, transition } from '@angular/animations';

export const fadeInOut = trigger('fadeInOut', [
  state('void', style({ opacity: 0, transform: 'translateY(-20px)' })), // Исходное состояние (сверху)
  state('*', style({ opacity: 1, transform: 'translateY(0)' })), // Финальное состояние
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(-20px)' }), // Начинаем анимацию сверху
    animate('200ms ease-out'),
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(20px)' })), // Уход вверх
  ]),
]);

export const slideInFromLeft = trigger('slideInFromLeft', [
  state('open', style({
    left: '0',
    zIndex: 1000
  })),
  state('closed', style({
    left: '-100%',
    zIndex: -1
  })),
  transition('closed => open', [
    animate('300ms ease-in')
  ]),
  transition('open => closed', [
    animate('300ms ease-out')
  ])
]);

export const slideInOut = trigger('slideInOut', [
  state('in', style({
    height: '*',
    overflow: 'hidden'
  })),
  state('out', style({
    height: '0',
    overflow: 'hidden'
  })),
  transition('in <=> out', animate('300ms ease-in-out'))
]);
