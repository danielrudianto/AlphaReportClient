import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User, Position } from './interface/user.interface';

@Injectable({
    providedIn: "root"
})
export class UserService {
  constructor(
    private http: HttpClient
  ) { }

  getUsers() {
    return this.http.get("https://localhost:44331/Api/User", {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*"
      })
    });
  }

  updateUser(value: User) {
    return this.http.put("https://localhost:44331/Api/User", value, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*"
      })
    })
  }

  insertUser(value: User) {
    return this.http.post("https://localhost:44331/Api/User", JSON.stringify(value), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*"
      })
    })
  }

  deleteUser(userId: number) {
    return this.http.delete("https://localhost:44331/Api/User?id=" + userId, {
      headers: new HttpHeaders({
        "Access-Control-Allow-Origin": "*",
      })
    })
  }

  enableUser(userId: number) {
    return this.http.get("https://localhost:44331/Api/User/Enable?id=" + userId, {
      headers: new HttpHeaders({
        "Access-Control-Allow-Origin": "*",
      })
    })
  }

  insertPosition(position: Position) {
    return this.http.post("https://localhost:44331/Api/UserPosition", JSON.stringify(position), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*"
      })
    })
  }

  deletePosition(positionId: number) {
    return this.http.delete("https://localhost:44331/Api/UserPosition/" + positionId, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*"
      })
    })
  }
}
