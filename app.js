// Layout
function toggleClassMenuMobile(){
  const buttonMenu = document.getElementById('open-menu');
  const menu = document.getElementById('menu')
  buttonMenu.classList.toggle('active');
  menu.classList.toggle('active');
}

function toggleClassModal(){
  console.log('Clicou');
  const modal = document.getElementById('modal');
  const modalWrapper = document.getElementById('modal-wrapper');

  modal.classList.toggle('show-modal');
  modalWrapper.classList.toggle('show');
}

function switchTheme(){
  let currentTheme = document.getElementsByTagName('html')[0].dataset;
  const buttonsSwitchTheme = document.querySelectorAll('.theme-switcher');

  if(currentTheme.theme === 'light'){
    buttonsSwitchTheme.forEach(button => {
      button.attributes.src.value = './assets/sun.svg';
    })

    currentTheme.theme = 'dark';
  }
  else{
    buttonsSwitchTheme.forEach(button => {
      button.attributes.src.value = './assets/moon.svg';
    })

    currentTheme.theme = 'light';
  }
}

// App
const tasks = [
  {
    "title": "Nome Tarefa",
    "description": "Descrição da Tarefa",
    "date": "30/10/2021",
    "status": "opened"
  }
]

function init(){
  getDate();

  tasks.forEach((task,index) => buildCardTask(task,index));
}

function reload(){
 document.getElementById('tasks-list').innerHTML = '';

  init();
}

function getDate(){
  const currentDate = new Date;
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maior', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const weekDays = ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'];

  const day = currentDate.getDate();
  const month = months[currentDate.getMonth()];
  const year = currentDate.getFullYear();
  const weekDay = weekDays[currentDate.getDay()];

  document.getElementById('currentDate').innerHTML = `${weekDay}, ${day} de ${month} de ${year}`;
}

function toggleComplete(index){
  tasks[index].status = 'completed';

  console.log(tasks);

  const task = document.querySelector(`[data-index='${index}']`);

  task.classList.toggle('completed');
}

function compareDate(date){
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0);
  currentDate.setMilliseconds(0);

  const dateTask = new Date(date.split('/').reverse());
  const differenceDates = currentDate - dateTask;
  

  if(differenceDates > 0){
    return 'past'
  }
  else if(differenceDates < 0){
    return 'future'
  }
}

function buildCardTask(task, index){
  const classDate = compareDate(task.date);
  const html = `
      <div class="task-header">
        <h3>${task.title}</h3>
        <span class="date-task ${classDate}">${task.date}</span>
      </div>
      <p>${task.description}</p>
      <div class="actions">
        <img src="./assets/check-circle.svg" alt="Marcar como concluida" onclick="toggleComplete(${index})"/>
        <img src="./assets/trash.svg" alt="Excluir" onclick="removeTask(${index})"/>
      </div>
  `; 

  const taskList = document.getElementById('tasks-list');

  const taskItem = document.createElement('div');
  taskItem.classList.add('card-task');
  taskItem.innerHTML = html;
  taskItem.dataset.index = index;

  taskList.appendChild(taskItem);

}

function emptyInputsForm(){
  document.getElementById('task-title').value = '';
  document.getElementById('description').value = '';
  document.getElementById('date').value = '';
}

function addTask(event){
  event.preventDefault();

  const title = document.getElementById('task-title').value;
  const description = document.getElementById('description').value;
  let date = document.getElementById('date').value.split('-');
  date = `${date[2]}/${date[1]}/${date[0]}`;

  const newTask = {
    title,
    description,
    date,
    "status": "opened"
  }

  tasks.push(newTask);

  reload();

  emptyInputsForm();

  toggleClassModal();

}

function removeTask(index){
  tasks.splice(index,1);
  console.log(tasks);

  reload();
}

init();