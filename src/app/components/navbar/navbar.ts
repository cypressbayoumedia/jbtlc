import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  protected readonly mobileMenuOpen = signal(false);

  protected readonly navLinks = signal([
    { label: 'HOME', path: '/' },
    { label: 'OUR STORY', path: '/our-story' },
    { label: 'SHOP', path: '/shop' },
    { label: 'TEA COLLECTIONS', path: '/tea-collections' },
    { label: 'LEARN', path: '/learn' },
    { label: 'CONTACT', path: '/contact' },
  ]);

  toggleMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
