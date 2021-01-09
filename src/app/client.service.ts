import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Client, ClientContact } from './interface/client.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn:'root'
})
export class ClientService {
  constructor(
    private http: HttpClient
  ) { }

  getClients() {
    return this.http.get(
      "https://localhost:44331/Api/Client", {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*"
      })
    });
  }

  insertItem(value: Client) {
    return this.http.post("https://localhost:44331/Api/Client", JSON.stringify(value), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*"
      })
    })
  }

  updateClient(value: Client) {
    return this.http.put("https://localhost:44331/Api/Client", JSON.stringify(value), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*"
      })
    })
  }

  addContact(value: ClientContact) {
    return this.http.post("https://localhost:44331/Api/ClientContact", JSON.stringify(value), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*"
      })
    })
  }

  updateContact(value: ClientContact) {
    return this.http.put("https://localhost:44331/Api/ClientContact", JSON.stringify(value), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*"
      })
    })
  }

  deleteContact(clientId: number) {
    return this.http.delete("https://localhost:44331/Api/ClientContact/" + clientId, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*"
      })
    })
  }

  deleteClient(clientId: number) {
    return this.http.delete("https://localhost:44331/Api/Client/" + clientId, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*"
      })
    })
  }
}
