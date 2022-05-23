export interface GameInterface {
  id: string;
  x: number;
  y: number;
  playerNumber: number;
  players: ObjectPlayer;
  player?: Player;
  creator?: string;
  boxes?: BoxInterface[];
  colors?: string[];
}

export class Game implements GameInterface {
  id: string;
  x: number = 4;
  y: number = 4;
  playerNumber: number;
  boxes: Box[] = [];
  players: ObjectPlayer = {};
  player: Player;
  creator: string = null;
  readonly colors = ['#e066a4', '#4c74dc', '#27b013', '#de9932', '#4dd14d', '#d63a3a', '#d63ad1'];

  constructor(params: GameInterface) {
    this.id = params.id;
    this.x = params.x;
    this.y = params.y;
    this.playerNumber = params.playerNumber;
    this.players = params.players;
    if (params.player) this.player = params.player;
    if (params.creator) this.creator = params.creator;
    if (params.boxes) {
      this.boxes = params.boxes.map(box => new Box(box));
    }
    else {
      for (let id = 0; id < (this.x * this.y); id++) {
        this.boxes.push(new Box({id}));
      }
    }
  }

  getColumns() {
    return Array(this.y).fill(0).map((x,i) => i);
  }

  getRows() {
    return Array(this.x).fill(0).map((x,i) => i);
  }

  /**
   * return true if the player name is available
   * @param playerName
   */
  verifyPlayerName(playerName: string): boolean {
    return !this.players.hasOwnProperty(playerName);
  }

  addPlayer(playerName: string) {
    if (this.verifyPlayerName(playerName)){
      const index = Object.keys(this.players).indexOf(playerName);
      const turn = Object.keys(this.players).length === 0;
      this.players[playerName] = {score: 0, turn, color: this.colors[index], name: playerName}
      if (index === 0) {
        this.player = this.players[playerName];
      }
    } else {
      console.error('Player exist');
      alert(`${playerName} username exists`)
    }
  }

  getBox(id: number): Box {
    return this.boxes.find(b => b.id === id) || null;
  }

  /**
   * return true if all boxes are filled
   */
  gameEnded(): boolean {
    return this.boxes.filter(box => box.active).length === this.x * this.y;
  }

  getActivePlayer(): [string, Player] {
    const playersNames = Object.keys(this.players);
    for (let name of playersNames) {
      if (this.players[name].turn) {
        return [name, this.players[name]];
      }
    }
    return null;
  }

  changeTurns(): void {
    const [name, player] = this.getActivePlayer();
    player.turn = false;
    const playersNames = Object.keys(this.players);
    const index = playersNames.indexOf(name);
    const nextIndex = index+1 >= playersNames.length ? 0 : index+1
    const newName = playersNames[nextIndex];
    this.players[newName].turn = true;
    this.player = this.players[newName];
  }

  updateScore(add = 1) {
    const [, player] = this.getActivePlayer();
    player.score += add;
  }

  resetLines(): void {
    for (let box of this.boxes)
      for (let line of Object.values(box.lines))
        if (line.last) line.last = false;
  }

  getWinner(): Player {
    const playersNames = Object.keys(this.players);
    let winner = playersNames[0];
    let draw = true;
    for (let i = 1; i < playersNames.length; i++) {
      if (this.players[playersNames[i]].score > this.players[winner].score) {
        winner = playersNames[i];
        draw = false;
      }
    }
    return draw ? null : this.players[winner];
  }

  public toJSON(): { [x: string]: any } {
    const json = {...this as GameInterface};
    json.boxes = this.boxes.map(b => b.toJSON());
    delete json.id;
    delete json.colors;
    return json;
  }
}

interface BoxInterface {
  id: number;
  lines?: LineInterface;
  active?: boolean;
  color?: string ;
}

export class Box implements BoxInterface {
  id: number = null;
  lines: LineInterface;
  active = false;
  color: string = null;

  constructor(params: BoxInterface) {
    this.id = params.id;
    if (params.active) this.active = params.active;
    if (params.color) this.color = params.color;
    if (params.lines) {
      this.lines = params.lines;
    } else {
      this.lines = {
        'top': {active: false, last: false},
        'right': {active: false, last: false},
        'left': {active: false, last: false},
        'bottom': {active: false, last: false}
      }
    }
  }

  updateActive(): boolean {
    for(let line of Object.values(this.lines))
      if (!line.active) return false;
    this.active = true;
    return true;
  }

  getLine(position: Position): LineValue {
    return this.lines[position] || null;
  }

  updateLine(position: Position): void {
    const line = this.lines[position];
    line.active = true;
    line.last = true;
    this.updateActive();
  }

  /**
   * return true id the line is active
   * @param position
   */
  verifyLine(position: Position): boolean {
    return this.lines[position].active;
  }

  setColor(color: string) {
    this.color = color;
  }

  public toJSON(): BoxInterface {
    return {...this as BoxInterface};
  }
}

type Position = 'top' | 'left' | 'right' | 'bottom';

type LineInterface = {
  [key in 'top' | 'left' | 'right' | 'bottom']: LineValue;
};

interface LineValue {
  active: boolean;
  last: boolean;
}

export interface Player {
  score: number;
  turn: boolean;
  color?: string;
  name: string
}

export interface ObjectPlayer {
  [key: string]: Player
}
