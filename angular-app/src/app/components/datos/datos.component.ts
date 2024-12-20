import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ApiRestService } from '../../services/api-rest.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Dialog } from 'primeng/dialog';
import { UserInfoInterfaces } from '../../interfaces/user-info.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-datos',
  standalone: true,
  imports: [
    ButtonModule,
    TableModule,
    ToastModule,
    Dialog,
    CommonModule,
  ],
  providers: [MessageService],
  templateUrl: './datos.component.html',
  styleUrl: './datos.component.css'
})
export class DatosComponent {
  private toastService = inject(MessageService);
  private apiRest = inject(ApiRestService);

  listUsuario: any[] = [];
  loading: boolean = false;
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

  onSincronizar() {
    this.loading = true;
    this.apiRest.getAllUsers().subscribe({
      next: (resp: any) => {
        if (resp.data.length === 0) {
          this.toastService.add({
            severity: 'warn',
            summary: 'Alerta',
            detail: 'No existen datos guardados',
          });
        } else {
          this.listUsuario = [...resp.data];
        }
        this.loading = false;
      }, error: (err) => {
        this.loading = false;
      }
    });
  }

  onOpenGitHub(url: string) {
    this.loading = true;
    window.open(url, '_blank');
    this.loading = false;
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
