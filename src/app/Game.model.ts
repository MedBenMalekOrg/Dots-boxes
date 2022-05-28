export interface GameInterface {
  id: string;
  x: number;
  y: number;
  playerNumber: number;
  players: ObjectPlayer;
  player: Player;
  creator: string;
  boxes?: BoxInterface[];
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
    this.players = Object.keys(params.players).sort().reduce(
      (players: ObjectPlayer, name: string) => {
        players[name] = params.players[name];
        return players;
      },
      {}
    );
    this.player = params.player;
    this.creator = params.creator;
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

  private verifyPlayerName(playerName: string): boolean {
    return !this.players.hasOwnProperty(playerName);
  }

  addPlayer(playerName: string) {
    if (this.verifyPlayerName(playerName)){
      const turn = Object.keys(this.players).length === 0;
      this.players[playerName] = {score: 0, turn, color: this.colors[Object.keys(this.players).length], name: playerName}
      if (Object.keys(this.players).length === 0) this.player = this.players[playerName];
    } else {
      console.error('Player exist');
      alert(`${playerName} username exists, chose another one`);
    }
  }

  getBox(id: number): Box {
    return this.boxes.find(b => b.id === id) || null;
  }

  gameEnded(): boolean {
    return this.boxes.filter(box => box.active).length === this.x * this.y;
  }

  changeTurns(): void {
    this.players[this.player.name].turn = false;
    const playersNames = Object.keys(this.players);
    const index = playersNames.indexOf(this.player.name);
    const nextIndex = index+1 >= playersNames.length ? 0 : index+1
    const newName = playersNames[nextIndex];
    this.players[newName].turn = true;
    this.player = this.players[newName];
  }

  getLastLine(): [string, number][] {
    let list: [string, number][] = [];
    for (const box of this.boxes.reverse()) {
      const position = box.getLastLine();
      if (position) list.push([position, box.id]);
    }
    return list;
  }

  updateScore() {
    this.players[this.player.name].score += 1;
  }

  resetLines(): void {
    for (let box of this.boxes)
      for (let line of Object.values(box.lines))
        if (line.last) line.last = false;
  }

  getWinnerText(): string {
    const players: Player[] = Object.values(this.players);
    const winnerScore = Math.max(...players.map(p => p.score));
    const winners = players.filter(p => p.score === winnerScore);
    if (winners.length === 1) {
      return `The winner is ${winners[0].name}`;
    } else if (winners.length === players.length) {
      return 'It\'s a draw!';
    } else {
      return `The players ${winners.map(p => p.name).join(' and ')} won the game!`
    }
  }

  replay() {
    this.boxes = [];
    for (let id = 0; id < (this.x * this.y); id++) this.boxes.push(new Box({id}));
    const players: ObjectPlayer = {};
    let index = 0;
    for (const name of Object.keys(this.players)) {
      players[name] = {score: 0, turn: name === this.creator, color: this.colors[index], name}
      if (name === this.creator) this.player = players[name];
      index++;
    }
    this.players = players;
  }

  public toJSON(): { [x: string]: any } {
    const json = {...this as GameInterface};
    json.boxes = this.boxes.map(b => b.toJSON());
    delete json.id;
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

  getLastLine(): string {
    for (let position of ['top', 'left', 'right', 'bottom'])
      if (this.lines[(position as Position)].last === true) return position;
    return null;
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
