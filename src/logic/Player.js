
export class Player {
    constructor(name, id, type, isHuman, hideHand=false) {
        this.name = name;
        this.id = id;
        this.type = type;

        this.isHuman = isHuman;

        this.hand = [];
        this.bestHand = [];

        this.money = 500;

        this.hideHand = hideHand;

        this.folded = false;
        this.isActive = true;

        this.isDealer = false;
    }

    resetHand() {
        this.hand = [];
        this.folded = false;
        this.isActive = true;
    }

    fold() {
        this.folded = true;
        this.isActive = false;
    }

    isCPU() {
        return !this.isHuman;
    }

    setDealer(isDealer) {
        this.isDealer = isDealer;
    }
};
