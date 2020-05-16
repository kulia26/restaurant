let taskOrder = []; // {{type: 1|2|3, table: 0|1|2|3}} 
let tableStates = [0, 0, 0, 0];  // 0 - empty, 1 - choosing, 2 - making order, 3 - dirty 

let bots = [
  {
    state: 0, // 0 - free, 1 - preparing order, 2 - clean table, 3 - fire
    table: 0
  },
  {
    state: 0,
    table: 0
  }
];

const work = async (robotId, to) => {
  const robot = document.getElementById('robot-' + robotId);
  const toElement = document.getElementById(to);

  moveRobot(robot, toElement);
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
              bots[i] = {
                state: 0,
                table: 0
              };
              pingBot(i);
            }, 4000);
          }, 4000);
        }, 4000);
      }
    }
    else {
      work(i + 1, "bar");
    }
  }

}

const animateTable = () => {
  const tables = document.getElementsByClassName('table');
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    table.addEventListener('click', (event) => {
      let tableInstance = document.getElementById(event.target.id);
      let tableIndex = parseInt(event.target.id[event.target.id.length - 1]) - 1;
      // if (tableStates[tableIndex] == 0) {
      //   tableInstance.classList.toggle('empty');
      //   tableInstance.classList.toggle('choosing');
      //   tableStates[tableIndex] = 1;
      //   pingBot();
      // }
      console.log(tableStates[tableIndex])
      if (tableStates[tableIndex] == 1) {
        tableInstance.classList.toggle('choosing');
        tableInstance.classList.toggle('waiting');
        tableStates[tableIndex] = 2;
        taskOrder.push({ state: 1, table: tableIndex + 1 });
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
  document.getElementById('go').addEventListener('click', () => {
    const robot = document.getElementById('robot-1');
    const to = document.getElementById('to').value;
    const toElement = document.getElementById(to);

    moveRobot(robot, toElement);
  })

  document.getElementById('visitor').addEventListener('click', () => {
    for (let i = 0; i < tableStates.length; i++) {
      if (tableStates[i] == 0) {
        const table = document.getElementById('table-' + (i + 1));
        table.classList.toggle('empty');
        table.classList.toggle('choosing');
        tableStates[i] = 1;
        break;
      }
    }
  })
}

window.onload = animate;