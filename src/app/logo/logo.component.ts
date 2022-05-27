import {AfterViewInit, Component} from '@angular/core';
import {TimelineDefinition} from '@motionone/dom/types/timeline/types';
import {timeline} from 'motion';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['../box/box.component.css']
})
export class LogoComponent implements AfterViewInit {

  constructor() { }

  ngAfterViewInit() {
    const sequence: TimelineDefinition = [
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
    ];
    timeline(sequence)
  }
}
