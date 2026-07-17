import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.html',
  styleUrl: './shop.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopComponent {}
