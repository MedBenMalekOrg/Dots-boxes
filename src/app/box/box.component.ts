import {Component, Input} from '@angular/core';
import {GameService} from '../game.service';
import {Box, Game} from '../Game.model';
import {ApiService} from '../api.service';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.css']
})
export class BoxComponent {
  @Input() id: number;
  @Input() lastRight: boolean;
  @Input() lastBottom: boolean;
  @Input() game: Game;
  constructor(private gameService: GameService, private api: ApiService) {}

  async handleLine(position: 'top' | 'left' | 'right' | 'bottom'): Promise<void> {
    if (this.game.getBox(this.id).verifyLine(position)) return;
    const player = ApiService.getPlayerLocal();
    if (player === null || player !== this.game.player.name ) return;
    this.game.resetLines();
    let topBox: Box = null;
    let previousBox: Box = null;
    switch (position) {
      case 'top':
        this.game.getBox(this.id).updateLine('top');
        if (this.game.getBox(this.id).active) {
          this.game.getBox(this.id).setColor(this.game.player.color);
          this.game.updateScore();
        }
        if (this.id > this.game.x - 1) {
          topBox = this.game.getBox(this.id - this.game.x);
          topBox.updateLine('bottom');
          if (topBox.active) {
            topBox.setColor(this.game.player.color)
            this.game.updateScore();
          }
        }
        break;
      case 'left':
        this.game.getBox(this.id).updateLine('left');
        if (this.game.getBox(this.id).active) {
          this.game.getBox(this.id).setColor(this.game.player.color);
          this.game.updateScore();
        }
        if (this.id % this.game.x > 0) {
          previousBox = this.game.getBox(this.id - 1);
          previousBox.updateLine('right');
          if (previousBox.active) {
            previousBox.setColor(this.game.player.color);
            this.game.updateScore();
          }
        }
        break;
      case 'right':
        this.game.getBox(this.id).updateLine('right');
        if (this.game.getBox(this.id).active) {
          this.game.getBox(this.id).setColor(this.game.player.color);
          this.game.updateScore();
        }
        break;
      case 'bottom':
        this.game.getBox(this.id).updateLine('bottom');
        if (this.game.getBox(this.id).active) {
          this.game.getBox(this.id).setColor(this.game.player.color);
          this.game.updateScore();
        }
        break;
    }
    if (!this.game.getBox(this.id).active
      && (!topBox || !topBox.active)
      && (!previousBox || !previousBox.active)) {
      this.game.changeTurns();
    }
    await this.api.updateGame(this.game);
    if (this.game.gameEnded()) {
      this.gameService.setModal({
        header: 'Game finished',
        text: `${this.game.getWinner() ? this.game.getWinner().name + ' won!' : 'Draw'}`
      })
    }
  }
}
