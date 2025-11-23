
export class Player {
    constructor(name, id, type, hideHand=false) {
        this.name = name;
        this.id = id;
        this.type = type;

        this.hand = [];
        this.bestHand = [];

        this.money = 0;

        this.hideHand = hideHand;
    }

    resetHand() {
        this.hand = [];
    }
};
