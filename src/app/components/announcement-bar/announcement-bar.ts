import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-announcement-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="announcement-bar" role="banner" aria-label="Site announcement">
      <div class="announcement-content">
        <span class="leaf-icon" aria-hidden="true">🌿</span>
        <span class="announcement-text">FROM THE TROPICS TO THE BAYOU.</span>
        <span class="leaf-icon" aria-hidden="true">🌿</span>
      </div>
    </div>
  `,
  styles: `
    .announcement-bar {
      background-color: var(--color-olive);
      height: var(--announcement-height);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 var(--space-md);
      position: relative;
      z-index: 100;
    }

    .announcement-content {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }

    .leaf-icon {
      font-size: 0.85rem;
      opacity: 0.8;
      animation: sway 3s ease-in-out infinite;
    }

    .leaf-icon:last-child {
      animation-delay: 1.5s;
      transform: scaleX(-1);
    }

    .announcement-text {
      font-family: var(--font-body);
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.2em;
      color: var(--color-cream);
      text-transform: uppercase;
    }

    @keyframes sway {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(5deg); }
      75% { transform: rotate(-5deg); }
    }

    @media (max-width: 480px) {
      .announcement-text {
        font-size: 0.65rem;
        letter-spacing: 0.12em;
      }
    }
  `
})
export class AnnouncementBarComponent {}
