import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-our-story',
  templateUrl: './our-story.html',
  styleUrl: './our-story.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OurStoryComponent {}
