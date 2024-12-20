import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiRestService {
  private apiRest = inject(HttpClient);
  private urlRest: string = 'http://localhost:3000';
  private urlGit: string = 'https://api.github.com/search/users?q';
  private urlInfo: string = 'https://api.github.com/users';

  getAlluser(name: string) {
    return this.apiRest.get(`${this.urlGit}=${name}`);
  }

  getOneUser(user: string) {
    return this.apiRest.get(`${this.urlInfo}/${user}`);
  }

  initMySql() {
    return this.apiRest.get(`${this.urlRest}/initDB`);
  }

  saveUsers(data: any[]) {
    return this.apiRest.post(`${this.urlRest}/saveUsers`, data);
  }

  saveInfoUser(data: object) {
    return this.apiRest.post(`${this.urlRest}/saveUserInfo`, data);
  }

  getEstadistica(url: string) {
    return this.apiRest.get(`${this.urlRest}/${url}`);
  }

  getAllUsers() {
    return this.apiRest.get(`${this.urlRest}/getUsers`);
  }
}

