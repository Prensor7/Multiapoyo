import { Component, inject } from '@angular/core';
import { BuscadorComponent } from "../buscador/buscador.component";
import { TabsModule } from 'primeng/tabs'
import { CardModule } from 'primeng/card'
import { ButtonModule } from 'primeng/button'
import { ApiRestService } from '../../services/api-rest.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DatosComponent } from "../datos/datos.component";
import { EstadiscticaComponent } from "../estadisctica/estadisctica.component";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    BuscadorComponent,
    DatosComponent,
    TabsModule,
    CardModule,
    ButtonModule,
    ToastModule,
    DatosComponent,
    EstadiscticaComponent
  ],
  providers: [MessageService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private toastService = inject(MessageService);
  private apiRest = inject(ApiRestService);
  navNum: number = 0;

  onInitDatabase() {
    this.apiRest.initMySql().subscribe({
      next: (resp: any) => {
        this.toastService.add({
          severity: 'success',
          summary: 'Información',
          detail: resp.result,
        });
      }, error: (err) => {
        this.toastService.add({
          severity: 'warn',
          summary: 'Alerta',
          detail: err,
        });
      }
    });
  }
}
