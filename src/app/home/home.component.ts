import {Component} from '@angular/core';
import {ApiService} from '../api.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GameInterface} from '../Game.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../box/box.component.css']
})
export class HomeComponent {
  gameForm: FormGroup;
  blockButton = false;

  constructor(private api: ApiService, private formBuilder: FormBuilder) {
    this.gameForm = this.formBuilder.group({
      name: [ApiService.getPlayerLocal(), Validators.required],
      number: [2, [Validators.required, Validators.max(6), Validators.min(2)]],
      boxesX: [5, Validators.required],
      boxesY: [5, Validators.required],
    });
  }

  async onCreate() {
    this.blockButton = true;
    const player = {
      score: 0,
      turn: true,
      color: '#e066a4',
      name: this.gameForm.value.name
    }
    const payload: GameInterface = {
      id: null,
      creator: this.gameForm.value.name,
      x: this.gameForm.value.boxesX,
      y: this.gameForm.value.boxesY,
      playerNumber: this.gameForm.value.number,
      players: {[this.gameForm.value.name as string]: player},
      player
    };
    await this.api.createGame(payload);
    this.blockButton = false;
  }
}
