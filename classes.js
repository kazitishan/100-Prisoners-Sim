// Represents a single box
export class Box {
    constructor(boxNumber, paperNumber) {
        this.boxNumber = boxNumber;
        this.paperNumber = paperNumber;
    }
}

// Represents a single prisoner
export class Prisoner {
    constructor(number) {
        this.number = number;
    }
}

// Represents one simulation of the solution
export class Simulation {
    constructor() {
        this.boxes = [];
        this.prisoners = [];
        this.prisonersWon = false;
        this.loops = [];
        this.longestLoop = 0;
        // Represents the number of prisoners that found their number
        this.foundCount = 0;
    }

    // Makes the prisoners and boxes
    fillPrisonersandBoxes() {
        // Represents what numbers are available to be put into the boxes for the paper slips
        let availableNumbers = [];

        // Filling available numbers from 1-100
        // Making the prisoners from 1-100
        for (let i = 1; i <= 100; i++) {
            availableNumbers.push(i);
            this.prisoners.push(new Prisoner(i));
        }

        // Shuffling the available numbers for the paper slips in the boxes
        for (let i = availableNumbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [availableNumbers[i], availableNumbers[j]] = [availableNumbers[j], availableNumbers[i]];
        }

        // Making the boxes
        for (let i = 0; i < 100; i++) {
            this.boxes.push(new Box(i + 1, availableNumbers[i]));
        }
    }

    // Finds all the loops in the boxes
    findLoops() {
        const visited = new Array(100).fill(false);

        for (let i = 0; i < 100; i++) {
            if (!visited[i]) {
                let currentBoxNum = i + 1;
                let loop = [];

                while (!visited[currentBoxNum - 1]) {
                    visited[currentBoxNum - 1] = true;
                    let currentPaperNum = this.boxes[currentBoxNum - 1].paperNumber;
                    // Box Number, Paper Number
                    loop.push([currentBoxNum, currentPaperNum]);
                    currentBoxNum = currentPaperNum;
                }

                this.loops.push(loop);
                if (loop.length > this.longestLoop) {
                    this.longestLoop = loop.length;
                }
            }
        }
    }

    // Plays the solution
    play() {
        // Represents the amount of prisoners that found their number
        let prisonersCount = 0;

        // For each prisoner
        for (let i = 0; i < this.prisoners.length; i++) {
            let searches = 0;
            let found = false;

            // The number the prisoner is searching for
            let prisonerNumber = this.prisoners[i].number;

            // The first box the prisoner will look in is the box with the same number as the prisoner
            let currentBoxNum = prisonerNumber;

            // Represents the searching of the prisoner
            // Searches until the prisoner has searched 50 boxes or they have found their number
            while (searches < 50 && found == false) {
                // Represents the number in the box
                let paperNumInBox = this.boxes[currentBoxNum - 1].paperNumber;
                // If the prisoner found their number
                if (paperNumInBox == prisonerNumber) {
                    found = true;
                    prisonersCount++;
                } else currentBoxNum = paperNumInBox;
                searches++;
            }
            // If the prisoner doesn't find their number, the simulation is lost
            if (found == false) return false;
        }

        // If all prisoners found their number
        return true;
    }

    // Simulates the entire solution
    simulate() {
        this.fillPrisonersandBoxes();
        this.findLoops();
        this.prisonersWon = this.play();
        if (this.longestLoop <= 50) this.foundCount = 100;
        else this.foundCount = 100 - this.longestLoop;
    }
}