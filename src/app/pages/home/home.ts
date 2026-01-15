import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
//import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class Home {
  private countdown = signal(this.calculateCountdown());

  public days = computed(() => Math.floor(this.countdown() / (1000 * 60 * 60 * 24)));
  public hours = computed(() => Math.floor((this.countdown() % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  public minutes = computed(() => Math.floor((this.countdown() % (1000 * 60 * 60)) / (1000 * 60)));
  public seconds = computed(() => Math.floor((this.countdown() % (1000 * 60)) / 1000));

  constructor() {
    setInterval(() => this.countdown.set(this.calculateCountdown()), 1000);
  }

  private calculateCountdown(): number {
    const launchDate = new Date('2026-01-31T23:59:59').getTime();
    const now = new Date().getTime();
    return launchDate - now;
  }
}
