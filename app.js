// Layout
function toggleClassMenuMobile(){
  const buttonMenu = document.getElementById('open-menu');
  const menu = document.getElementById('menu')
  buttonMenu.classList.toggle('active');
  menu.classList.toggle('active');
}

function toggleClassModal(){
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
    "id": 1,
    "title": "Nome Tarefa",
    "description": "Descrição da Tarefa",
    "date": "30/10/2021",
    "status": "opened"
  },
  {
    "id": 2,
    "title": "Nome Tarefa",
    "description": "Descrição da Tarefa",
    "date": "30/10/2021",
    "status": "completed"
  },
  {
    "id": 3,
    "title": "Nome Tarefa",
    "description": "Descrição da Tarefa",
    "date": "01/11/2021",
    "status": "opened"
  },
  {
    "id": 4,
    "title": "Nome Tarefa",
    "description": "Descrição da Tarefa",
    "date": "02/11/2021",
    "status": "completed"
  }
]

function getStatusFilter(){
  const status = document.querySelector('#menu li.current').id;

  return status;
}

function currentStatusMenuItem(element){
  const itensMenu = document.querySelectorAll('#menu li');
  itensMenu.forEach(item => item.classList.remove('current'))

  element.classList.add('current');
  const currentFilter = getStatusFilter();

  reload(currentFilter);
}

function getTasksWithStatus(status){
  const buttonModal = document.getElementById('add-tasks');
  buttonModal.style.visibility = 'visible';
  buttonModal.textContent = 'Adicionar Tarefa';

  const fieldDate = document.getElementById('date');
  fieldDate.value = '';
  fieldDate.removeAttribute('disabled');

  if(status === 'today'){
    buttonModal.textContent = 'Adicionar Tarefa com conclusão para hoje';
    const isToday = (task) => compareDate(task.date) !== 'future' && compareDate(task.date) !== 'past';

    const tasksFiltered = tasks.filter(isToday);
    tasksFiltered.forEach((task) => buildCardTask(task))

    const today = new Date();
    const todayDay = String(today.getDate()).length == 1 
    ? `0${today.getDate()}`
    : today.getDate();
    const todayMonth = String(today.getMonth()+1).length == 1 
    ? `0${today.getMonth()+1}`
    : today.getMonth()+1;
    const todayYear = today.getFullYear();

    fieldDate.value = `${todayYear}-${todayMonth}-${todayDay}`;
    fieldDate.setAttribute('disabled','disabled');
  }
  else if(status === 'all'){
    const tasksFiltered = tasks;
    tasksFiltered.forEach((task) => buildCardTask(task))
  }
  else{
    const filterTasks = (task) => task.status === status;
  
    if(status === 'completed') document.getElementById('add-tasks').style.visibility = 'hidden';

    const tasksFiltered = tasks.filter(filterTasks);
    tasksFiltered.forEach((task) => buildCardTask(task))
  }
}

function init(status = 'today'){
  getDate();

  getTasksWithStatus(status);
  
}

function reload(status){
  document.getElementById('tasks-list').innerHTML = '';

  init(status);
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

function toggleCompleted(id,status){
  const index = tasks.findIndex(task => task.id === id);

  if(status === 'opened') tasks[index].status = 'completed';
  if(status === 'completed') tasks[index].status = 'opened';

  const task = document.querySelector(`[data-id='${id}']`);

  task.classList.toggle('completed');
  task.classList.toggle('opened');

  const currentStatus = getStatusFilter();

  if(currentStatus === 'opened' || currentStatus === 'completed'){
    reload(currentStatus);
  } 
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

function buildCardTask(task){
  const classDate = compareDate(task.date);
  let html = `
      <div class="task-header">
        <h3>${task.title}</h3>
        <span class="date-task ${classDate}">${task.date}</span>
      </div>
      <p>${task.description}</p>
      <div class="actions">
        <img src="./assets/check-circle.svg" alt="Marcar como concluida" onclick="toggleCompleted(${task.id}, '${task.status}')"/>
        <img src="./assets/trash.svg" alt="Excluir" onclick="removeTask(${task.id})"/>
      </div>
  `; 

  const taskList = document.getElementById('tasks-list');

  const taskItem = document.createElement('div');
  taskItem.classList.add('card-task');
  taskItem.classList.add(task.status);
  taskItem.innerHTML = html;
  taskItem.dataset.id = task.id;

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

  const id = tasks[(tasks.length)-1].id + 1;

  const newTask = {
    id,
    title,
    description,
    date,
    "status": "opened"
  }

  tasks.push(newTask);

  emptyInputsForm();

  toggleClassModal();

  const currentFilter = getStatusFilter();

  reload(currentFilter);

}

function removeTask(id){
  const index = tasks.findIndex(task => task.id === id);
  tasks.splice(index,1);

  const currentFilter = getStatusFilter();

  reload(currentFilter);
}

init()