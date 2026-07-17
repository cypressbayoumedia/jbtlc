import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-tea-collections',
  templateUrl: './tea-collections.html',
  styleUrl: './tea-collections.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeaCollectionsComponent {}
