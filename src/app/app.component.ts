import { NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProgressBarModule } from 'primeng/progressbar';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, ProgressBarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public title = 'landing-page';
  private fb: FormBuilder = inject(FormBuilder);
  private toastr: ToastrService = inject(ToastrService);
  public isLoading = signal(false);
  public contactForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ],
    ],
    message: ['', Validators.required],
  });

  public async onSubmit() {
    if (this.contactForm.valid) {
      this.isLoading.set(true);
      try {
        const res: Response = await fetch(
          '/.netlify/functions/formulario-contacto',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.contactForm.value),
          }
        );
        this.isLoading.set(false);
        if (res.ok) {
          this.toastr.success('Correo enviado exitosamente');
          this.contactForm.reset();
        } else {
          this.toastr.error('Error al enviar el correo');
        }
      } catch (error) {
        this.isLoading.set(false);
        this.toastr.error('Ocurrió un error inesperado');
      }
    } else {
      this.contactForm.markAllAsTouched();
    }
  }

  public fieldValid(field: string): boolean {
    const control = this.contactForm.get(field);
    return (control?.invalid && control?.touched) || false;
  }
}
