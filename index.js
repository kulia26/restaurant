let taskOrder = []; // {{type: 1|2|3, table: 0|1|2|3}} 
let tableStates = [0, 0, 0, 0];  // 0 - empty, 1 - choosing, 2 - making order, 3 - dirty 

let bots = [
  {
    state: 0, // 0 - free, 1 - preparing order, 2 - clean table, 3 - fire
    table: 0,
    onBar: true
  },
  {
    state: 0,
    table: 0,
    onBar: true
  }
];

const work = async (robotId, to) => {
  const robot = document.getElementById('robot-' + robotId);
  const toElement = document.getElementById(to);

  moveRobot(robot, toElement);
  bots[robotId - 1].onBar = to == 'bar';
}

const turnTable = (tableId, newSt, stIndex) => {
  const table = document.getElementById('table-' + tableId);
  table.className = 'table ' + newSt;
  tableStates[tableId - 1] = stIndex;
}

const turnWaitingTable = (tableId, prev) => {
  const table = document.getElementById('table-' + tableId);
  table.classList.toggle(prev);
  table.classList.toggle('choosing');
  tableStates[tableId - 1] = 1;
}

const turnEmptyTable = (tableId) => {
  const table = document.getElementById('table-' + tableId);
  table.classList.toggle('dirty');
  table.classList.toggle('empty');
  tableStates[tableId - 1] = 0;
}


const pingBot = async (i) => {
  if (bots[i].state === 0) {

    if (taskOrder.length > 0) {
      bots[i] = taskOrder.shift();
      if (bots[i].state == 1) {
        await work(i + 1, "table-" + bots[i].table);
        setTimeout(function () {
          work(i + 1, "kitchen");
          setTimeout(function () {
            work(i + 1, "table-" + bots[i].table);
            setTimeout(function () {
              turnTable(bots[i].table, 'choosing', 1);
              bots[i] = {
                state: 0,
                table: 0
              };
              pingBot(i);
            }, 4000);
          }, 4000);
        }, 4000);
      } else if (bots[i].state == 2) {
        await work(i + 1, "table-" + bots[i].table);
        setTimeout(function () {
          turnTable(bots[i].table, 'empty', 0);
          bots[i] = {
            state: 0,
            table: 0
          };
          pingBot(i);
        }, 4000);
      }
    }
    else if (!bots[i].onBar) {
      work(i + 1, "bar");
    }
  }

}

const animateTable = () => {
  const tables = document.getElementsByClassName('table');
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    table.addEventListener('click', (event) => {
      let tableIndex = parseInt(event.target.id[event.target.id.length - 1]) - 1;
      if (tableStates[tableIndex] == 1) {
        turnTable(tableIndex + 1, 'waiting', 2)
        taskOrder.push({ state: 1, table: tableIndex + 1 });
        for (let i = 0; i < bots.length; i++) {
          pingBot(i);
        }
      }
    })
    table.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      let tableIndex = parseInt(event.target.id[event.target.id.length - 1]) - 1;
      if (tableStates[tableIndex] == 1) {
        turnTable(tableIndex + 1, 'dirty', 3)
        taskOrder.push({ state: 2, table: tableIndex + 1 });
        for (let i = 0; i < bots.length; i++) {
          pingBot(i);
        }
      }
    })
  }
}


const moveRobot = (robot, to) => {
  robot.classList.add('run');
  console.dir(to.offsetTop);
  let left = robot.offsetLeft;
  let top = robot.offsetTop;
  let toLeft = to.offsetLeft;
  let toTop = to.offsetTop;
  console.dir({ left, top, toLeft, toTop })
  const speedX = (toLeft - left) / 300;
  const speedY = (toTop - top) / 300;
  if (speedX < 0) {
    robot.classList.add('left');
  } else {
    robot.classList.remove('left');
  }
  let time = 2000;
  let interval = setInterval(() => {
    left += speedX;
    top += speedY;
    robot.style.left = Math.floor(left) + 'px';
    robot.style.top = Math.floor(top) + 'px';
  }, time / 300)

  setTimeout(() => {

    clearInterval(interval)
    robot.classList.remove('run');

  }, time);
}

const animate = () => {
  animateTable();

  document.getElementById('visitor').addEventListener('click', () => {
    for (let i = 0; i < tableStates.length; i++) {
      if (tableStates[i] == 0) {
        turnTable(i + 1, 'choosing', 1);
        break;
      }
    }
  })
  document.getElementById('fire').addEventListener('click', () => {
    taskOrder = [];
    bots = [
      {
        state: 0,
        table: 0,
        onBar: false
      },
      {
        state: 0,
        table: 0,
        onBar: false
      }
    ];

    let dirtyTables = [];
    for (let i = 0; i < tableStates.length; i++) {
      if (tableStates[i] !== 0) {
        turnTable(i + 1, 'dirty', 3);
        dirtyTables.push({ state: 2, table: i + 1 });
      }
    }
    for (let i = 0; i < bots.length; i++) {
      work(i + 1, "kitchen");
      setTimeout(function () {
        bots[i] = {
          state: 0,
          table: 0
        };
        taskOrder = dirtyTables;
        console.log(dirtyTables);
        pingBot(i);
      }, 10000);
    }
  })

}

window.onload = animate;