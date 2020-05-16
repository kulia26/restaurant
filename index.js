let taskOrder = []; // {{type: 1|2|3, table: 0|1|2|3}} 
let tableStates = [0, 0, 0, 0];  // 0 - empty, 1 - choosing, 2 - making order, 3 - dirty 

let bots = [
  {
    state: 0, // 0 - free, 1 - preparing order, 2 - clean table, 3 - fire
    task: {}
  },
  {
    state: 0,
    task: {}
  }
];

const animateTable = () => {
  const tables = document.getElementsByClassName('table');
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    table.addEventListener('click', (event) => {
      let tableInstance = document.getElementById(event.target.id);
      let tableIndex = parseInt(event.target.id[event.target.id.length - 1]);
      if (tableStates[tableIndex] == 0) {
        tableInstance.classList.toggle('empty');
        tableInstance.classList.toggle('choosing');
        tableStates[tableIndex] = 1;
      }
      else if (tableStates[tableIndex] == 1) {
        tableInstance.classList.toggle('choosing');
        tableInstance.classList.toggle('waiting');
        tableStates[tableIndex] = 2;
        taskOrder.push({ type: 1, table: tableIndex });
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
        const tables = document.getElementsByClassName('table');
        const table = tables[i];
        table.classList.toggle('empty');
        table.classList.toggle('choosing');
        tableStates[i] = 1;
        break;
      }
    }
  })
}

window.onload = animate;