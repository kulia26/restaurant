const animateTable = () =>{
  const tables = document.getElementsByClassName('table');
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    table.addEventListener('click', (event) => {
      table.classList.toggle('empty');
      table.classList.toggle('choosing');
      // Для нужной подсветки столика просто добавьте нужный клас, 
      // и уберите пустой клас
      // toggle меняет наличие класа на противоположное, ( то есть если клас есть то убирает, если нету то добавляет)
      //
    })
  }
}

const moveRobot = (robot, to) =>{
  robot.classList.add('run');
  console.dir(to.offsetTop);
  let left  = robot.offsetLeft;
  let top = robot.offsetTop;
  let toLeft = to.offsetLeft;
  let toTop = to.offsetTop;
  console.dir({left, top, toLeft, toTop})
  const speedX = (toLeft - left)/300;
  const speedY = (toTop - top)/300;
  if(speedX < 0){
    robot.classList.add('left');
  }else{
    robot.classList.remove('left');
  }
  let time = 2000;
  let interval = setInterval(()=>{
    left += speedX;
    top += speedY;
    robot.style.left = Math.floor(left) + 'px';
    robot.style.top =  Math.floor(top)  + 'px'; 
  }, time/300)

  setTimeout(()=>{
    
    clearInterval(interval)
    robot.classList.remove('run');
    
  }, time);

}

const animate = () => {
  animateTable();
  document.getElementById('go').addEventListener('click', ()=>{
    const robot = document.getElementById('robot-1');
    const to = document.getElementById('to').value;
    const toElement = document.getElementById(to);
    
    moveRobot(robot, toElement);
  })
  
}

window.onload = animate;