// Player class
// type: 0 = human, 1 = CPU
export class player {
    constructor(type = 1, name = "", startingMoney = 1000) {
        this.type = type;
        this.name = name;
        this.money = startingMoney;
    };

    setType(type) {
        this.type = type;
    }

    getType() {
        return this.type;
    }

    updateMoney(money) {
        this.money += money;
    }

    getMoney() {
        return this.money;
    }

    getName() {
        return this.name;
    }

    resetMoney() {
        this.money = 0;
    }

    // Static CPU names
    static CPUFirstNames = {
        0: "Joe",
        1: "Anna",
        2: "Sam",
        3: "Kate",
        4: "Max",
        5: "Lily"
    };
    static CPULastNames = {
        0: "Smith",
        1: "Johnson",
        2: "Brown",
        3: "Davis",
        4: "Miller",
        5: "Wilson"
    };

    static generateCPUName() {
        const firstNames = Object.values(player.CPUFirstNames);
        const lastNames = Object.values(player.CPULastNames);
        const first = firstNames[Math.floor(Math.random() * firstNames.length)];
        const last = lastNames[Math.floor(Math.random() * lastNames.length)];
        return `${first} ${last}`;
    }
}