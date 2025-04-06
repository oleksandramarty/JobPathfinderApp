import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { generateRandomId } from '@amarty/utils';

@Component({
  selector: 'app-night-sky',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './night-sky.component.html',
  styleUrls: ['./night-sky.component.scss'],
  host: { 'data-id': generateRandomId(12) }
})
export class NightSkyComponent implements OnInit {
  constructor(private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.generateStars();
  }

  private _starsArray: number[] = [100, 30, 20, 50, 30];

  // Maximum number of stars per type
  // Not greater than 5
  private _starsMultiplier = 1;

  private generateStars(): void {
    const starsContainer = this.renderer.selectRootElement('.stars', true);
    if (!starsContainer) {
      return;
    }

    for (let i = 0; i < this._starsArray[0] * this._starsMultiplier; i++) {
      this.createStar(starsContainer, 'star-1', this.getRandomInt(0, 40), this.getRandomInt(0, 100));
      this.createStar(starsContainer, 'star-2', this.getRandomInt(20, 70), this.getRandomInt(0, 100));
    }

    for (let i = 0; i < this._starsArray[1] * this._starsMultiplier; i++) {
      this.createStar(starsContainer, 'star-0', this.getRandomInt(0, 50), this.getRandomInt(0, 100));
      this.createStar(starsContainer, 'star-1', this.getRandomInt(0, 50), this.getRandomInt(0, 100));
      this.createStar(starsContainer, 'star-2', this.getRandomInt(0, 50), this.getRandomInt(0, 100));
    }

    for (let i = 0; i < this._starsArray[2] * this._starsMultiplier; i++) {
      this.createStar(starsContainer, 'star-0', this.getRandomInt(40, 75), this.getRandomInt(0, 100));
      this.createStar(starsContainer, 'star-1', this.getRandomInt(40, 75), this.getRandomInt(0, 100));
    }

    for (let i = 0; i < this._starsArray[3] * this._starsMultiplier; i++) {
      this.createStar(starsContainer, 'star-0', this.getRandomInt(0, 100), this.getRandomInt(0, 100));
      this.createStar(starsContainer, 'star-1', this.getRandomInt(0, 100), this.getRandomInt(0, 100));
      this.createStar(starsContainer, 'star-2', this.getRandomInt(0, 100), this.getRandomInt(0, 100));
      this.createStar(starsContainer, 'star-4', this.getRandomInt(0, 70), this.getRandomInt(0, 100));
    }

    for (let i = 0; i < this._starsArray[4] * this._starsMultiplier; i++) {
      this.createStar(starsContainer, 'star-4', this.getRandomInt(0, 100), this.getRandomInt(0, 100));
    }
  }

  private createStar(container: Element, starClass: string, top: number, left: number): void {
    const star = this.renderer.createElement('div');
    this.renderer.addClass(star, 'blink');
    this.renderer.addClass(star, 'star');
    this.renderer.addClass(star, starClass);
    this.renderer.setStyle(star, 'top', `${top}vh`);
    this.renderer.setStyle(star, 'left', `${left}vw`);
    this.renderer.setStyle(star, 'animation-duration', `${this.getRandomInt(3000, 8000)}ms`);
    this.renderer.appendChild(container, star);
  }

  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
  }
}
