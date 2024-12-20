import { ChangeDetectorRef, Component, inject, PLATFORM_ID } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ApiRestService } from '../../services/api-rest.service';
import { MessageService } from 'primeng/api';
import { ChartModule } from 'primeng/chart';
import { ToastModule } from 'primeng/toast';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-estadisctica',
  standalone: true,
  imports: [
    ButtonModule,
    ChartModule,
    CardModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './estadisctica.component.html',
  styleUrl: './estadisctica.component.css'
})
export class EstadiscticaComponent {
  private toastService = inject(MessageService);
  private apiRest = inject(ApiRestService);
  private platformId = inject(PLATFORM_ID);

  basicDataFollowers: any;
  basicDataFollowing: any;
  basicDataScore: any;
  basicOptions: any;

  listFollowers: any[] = [];
  listFollowing: any[] = [];
  listScore: any[] = [];
  loadingFollowers: boolean = false;
  loadingFollowing: boolean = false;
  loadingScore: boolean = false;


  constructor(private cd: ChangeDetectorRef) { }

  onSincronizar() {
    this.onGetFollowers();
    this.onGetFollowing();
    this.onGetScore();
  }

  onGetFollowers() {
    this.loadingFollowers = true;
    this.apiRest.getEstadistica('getFollowers').subscribe({
      next: (resp: any) => {
        if (resp.data.length === 0) {
          this.toastService.add({
            severity: 'warn',
            summary: 'Alerta',
            detail: 'No existen datos guardados',
          });
        } else {
          this.listFollowers = [...resp.data];
          this.chartSeguidores();
        }
        this.loadingFollowers = false;
      }, error: (err) => {
        this.loadingFollowers = false;
      }
    });
  }

  onGetFollowing() {
    this.loadingFollowing = true;
    this.apiRest.getEstadistica('getFollowing').subscribe({
      next: (resp: any) => {
        if (resp.data.length === 0) {
          this.toastService.add({
            severity: 'warn',
            summary: 'Alerta',
            detail: 'No existen datos guardados',
          });
        } else {
          this.listFollowing = [...resp.data];
          this.chartSeguidos();
        }
        this.loadingFollowing = false;
      }, error: (err) => {
        this.loadingFollowing = false;
      }
    });
  }

  onGetScore() {
    this.loadingScore = true;
    this.apiRest.getEstadistica('getScore').subscribe({
      next: (resp: any) => {
        if (resp.data.length === 0) {
          this.toastService.add({
            severity: 'warn',
            summary: 'Alerta',
            detail: 'No existen datos guardados',
          });
        } else {
          this.listScore = [...resp.data];
          this.chartScore();
        }
        this.loadingScore = false;
      }, error: (err) => {
        this.loadingScore = false;
      }
    });
  }

  chartSeguidores() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
      const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

      this.basicDataFollowers = {
        labels: this.listFollowers.map(item => item.login),
        datasets: [
          {
            label: 'Seguidores',
            data: this.listFollowers.map(item => item.followers),
            backgroundColor: [
              'rgba(249, 115, 22, 0.2)',
              'rgba(6, 182, 212, 0.2)',
              'rgba(139, 92, 246, 0.2)',
            ],
            borderColor: ['rgb(249, 115, 22)', 'rgb(6, 182, 212)', 'rgb(139, 92, 246)'],
            borderWidth: 1,
          },
        ],
      };

      this.basicOptions = {
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
        },
      };
      this.cd.markForCheck()
    }
  }

  chartSeguidos() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
      const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

      this.basicDataFollowing = {
        labels: this.listFollowing.map(item => item.login),
        datasets: [
          {
            label: 'Seguidos',
            data: this.listFollowing.map(item => item.following),
            backgroundColor: [
              'rgba(249, 115, 22, 0.2)',
              'rgba(6, 182, 212, 0.2)',
              'rgba(139, 92, 246, 0.2)',
            ],
            borderColor: ['rgb(249, 115, 22)', 'rgb(6, 182, 212)', 'rgb(139, 92, 246)'],
            borderWidth: 1,
          },
        ],
      };

      this.basicOptions = {
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
        },
      };
      this.cd.markForCheck()
    }
  }

  chartScore() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
      const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

      this.basicDataScore = {
        labels: this.listScore.map(item => item.login),
        datasets: [
          {
            label: 'Seguidos',
            data: this.listScore.map(item => item.score),
            backgroundColor: [
              'rgba(249, 115, 22, 0.2)',
              'rgba(6, 182, 212, 0.2)',
              'rgba(139, 92, 246, 0.2)',
            ],
            borderColor: ['rgb(249, 115, 22)', 'rgb(6, 182, 212)', 'rgb(139, 92, 246)'],
            borderWidth: 1,
          },
        ],
      };

      this.basicOptions = {
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
        },
      };
      this.cd.markForCheck()
    }
  }
}
