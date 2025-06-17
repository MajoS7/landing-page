import { Component,inject ,WritableSignal, signal} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'landing-page';
  fb: FormBuilder = inject(FormBuilder);
  exito:WritableSignal<boolean|undefined> = signal(undefined);;
  cargando = signal(false);
  contactForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    mensaje: ['']
  });


  async onSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (this.contactForm.valid) {
      const formData = this.contactForm.value;
      console.log('Formulario enviado:', formData);
      this.cargando.set(true);
      const res = await fetch("/.netlify/functions/formulario-contacto", {
        method:'POST',
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify(formData)
      })
       this.cargando.set(false);
       this.exito.set(res.ok);
    }
  }
}
