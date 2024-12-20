import { Component, inject } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FieldsetModule } from 'primeng/fieldset';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Tooltip } from 'primeng/tooltip';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiRestService } from '../../services/api-rest.service';
import { noGlobalValidator } from '../../validators/no-globlal';
import { UserInfoInterfaces, UserInterfaces } from '../../interfaces/user-info.interface';
import { Dialog } from 'primeng/dialog';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [
    InputTextModule,
    ButtonModule,
    TableModule,
    FieldsetModule,
    ReactiveFormsModule,
    ToastModule,
    Tooltip,
    Dialog,
    CommonModule,
  ],
  providers: [MessageService],
  templateUrl: './buscador.component.html',
  styleUrl: './buscador.component.css'
})
export class BuscadorComponent {
  private toastService = inject(MessageService);
  private apiRest = inject(ApiRestService);

  listUsuario: UserInterfaces[] = [];
  loading: boolean = false;
  myForm: FormGroup;
  modal: boolean = false;
  infoUser: UserInfoInterfaces = {
    login: null,
    id: null,
    avatar_url: null,
    public_repos: null,
    public_gists: null,
    followers: null,
    following: null,
    created_at: null,
  };

  constructor() {
    this.myForm = new FormGroup({
      "usuario": new FormControl('', [Validators.required, Validators.minLength(4), noGlobalValidator()]),
    });
  }

  validForm() {
    if (this.myForm.invalid) {
      Object.values(this.myForm.controls).forEach(control => {
        control.markAsDirty();
      });
      return false;
    }
    return true;
  }

  onSearch() {
    if (this.validForm()) {
      this.loading = true;
      this.apiRest.getAlluser(this.myForm.value.usuario).subscribe({
        next: (resp: any) => {
          if (resp.total_count === 0) {
            this.toastService.add({
              severity: 'warn',
              summary: 'Alerta',
              detail: 'No existen usuarios',
            });
          }
          this.listUsuario = [...resp.items].slice(0, 10);
          this.loading = false;
        }, error: (err) => {
          this.toastService.add({
            severity: 'warn',
            summary: 'Alerta',
            detail: err,
          });
          this.loading = false;
        }
      });
    } else {
      this.toastService.add({
        severity: 'warn',
        summary: 'Alerta',
        detail: 'Ingrese todos los campos',
      });
    }
  }

  onSaveUsers() {
    if (this.listUsuario.length !== 0) {
      this.apiRest.saveUsers(this.listUsuario).subscribe({
        next: (resp: any) => {
          this.toastService.add({
            severity: 'success',
            summary: 'Info',
            detail: resp.result,
          });
        }, error: (err) => {
          this.toastService.add({
            severity: 'warn',
            summary: 'Alerta',
            detail: err.error.result,
          });
        }
      });
    } else {
      this.toastService.add({
        severity: 'warn',
        summary: 'Alerta',
        detail: 'Primero realiza una busqueda',
      });
    }
  }

  onOpenGitHub(url: string) {
    window.open(url, '_blank');
  }

  onOpenInfo(url: string) {
    this.loading = true;
    this.apiRest.getOneUser(url).subscribe({
      next: (resp: any) => {
        this.infoUser = { ...resp };
        this.modal = true;
        this.loading = false;
      }, error: (err) => {
        this.loading = false;
      }
    });
  }

  onSaveInfoUser() {
    this.apiRest.saveInfoUser(this.infoUser).subscribe({
      next: (resp: any) => {
        this.toastService.add({
          severity: 'success',
          summary: 'Info',
          detail: resp.result,
        });
      }, error: (err) => {
        this.toastService.add({
          severity: 'warn',
          summary: 'Alerta',
          detail: err.error.result,
        });
      }
    });
  }
}
