import {AfterViewInit, Component} from '@angular/core';
import {ApiService} from '../api.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GameInterface} from '../Game.model';
import {animate, timeline} from "motion"
import {TimelineDefinition} from '@motionone/dom/types/timeline/types';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../box/box.component.css']
})
export class HomeComponent implements AfterViewInit {
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

  ngAfterViewInit() {
    const sequence: any = [
      [".box.logo .circle", {scale: [0, 1.3, 0]}, {duration: 0.3, offset: [0, 0.7, 1]}],
      [".dot.tl", {scale: [0, 1]}, {duration: 0.2, delay: 0.2}],
      [".line.top", {width: [0, '100%']}, {duration: 0.05}],
      [".dot.tr", {scale: [0, 1]}, {duration: 0.2}],
      [".line.right", {height: [0, '100%']}, {duration: 0.01}],
      [".dot.br", {scale: [0, 1]}, {duration: 0.2}],
      [".line.bottom", {width: [0, '100%']}, {duration: 0.01}],
      [".dot.bl", {scale: [0, 1]}, {duration: 0.2}],
      [".line.left", {height: [0, '100%']}, {duration: 0.01}],
      [".box.logo", {rotate: [360]}, {duration: 0.4}],
      [".box.logo .circle", {scale: [0, 1]}, {at: "-0.5"}],
      [".dot.tl", {backgroundColor: 'white'}],
      [".line.top", {backgroundColor: 'white'}, { at: "<" }],
      [".dot.tr", {backgroundColor: 'white'}, { at: "<" }],
      [".line.right", {backgroundColor: 'white'}, { at: "<" }],
      [".dot.br", {backgroundColor: 'white'}, { at: "<" }],
      [".line.bottom", {backgroundColor: 'white'}, { at: "<" }],
      [".dot.bl", {backgroundColor: 'white'}, { at: "<" }],
      [".line.left", {backgroundColor: 'white'}, { at: "<" }],
      [".form-container h1", {opacity: [0, 1], scale: [0, 1]}, {at: "-0.5"}],
      ["form", {translate: [-90, 0], opacity: [0, 1]}]
    ]
    timeline(sequence)


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
