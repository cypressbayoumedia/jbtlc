import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { inject } from '@angular/core';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);

  protected readonly submitted = signal(false);
  protected readonly sending = signal(false);

  protected readonly contactForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  protected readonly subjectOptions = signal([
    'General Inquiry',
    'Wholesale / Bulk Orders',
    'Product Question',
    'Shipping & Returns',
    'Collaboration / Partnership',
    'Other',
  ]);

  protected readonly isFormValid = computed(() => this.contactForm.valid);

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.sending.set(true);

    // Simulate sending — replace with real service call later
    setTimeout(() => {
      this.sending.set(false);
      this.submitted.set(true);
      this.contactForm.reset();
    }, 1500);
  }

  resetForm(): void {
    this.submitted.set(false);
  }
}
