// Layout
function toggleMenuMobile(){
  const buttonMenu = document.getElementById('open-menu');
  const menu = document.getElementById('menu')
  buttonMenu.classList.toggle('active');
  menu.classList.toggle('active');
}

function toggleModal(){
  const modal = document.getElementById('modal');
  const modalWrapper = document.getElementById('modal-wrapper');

  modal.classList.toggle('show-modal');
  modalWrapper.classList.toggle('show');
}

function switchTheme(){
  const currentTheme = document.getElementsByTagName('body')[0].dataset;
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

// App

function getTasks(){
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function uploadTasks(tasks){
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getStatusFilter(){
  const status = document.querySelector('#menu li.current').id;

  return status;
}

function currentStatusMenuItem(element){
  const itensMenu = document.querySelectorAll('#menu li');
  itensMenu.forEach(item => item.classList.remove('current'));

  element.classList.add('current');
  const currentFilter = getStatusFilter();

  reload(currentFilter);
}

function handleButtonModal(text, visibility){
  const buttonModal = document.getElementById('add-tasks');

  buttonModal.style.visibility = visibility;

  buttonModal.textContent = text;
}

function handleFieldDateModal(status = 'none'){
  const fieldDate = document.getElementById('date');
  fieldDate.value = '';
  fieldDate.removeAttribute('disabled');

  if(status === 'today'){
    const today = new Date();

    const todayDay = (
      String(today.getDate()).length === 1 
      ? `0${today.getDate()}`
      : today.getDate()
    );

    const todayMonth = (
      String(today.getMonth()+1).length == 1 
      ? `0${today.getMonth()+1}`
      : today.getMonth()+1
    );

    const todayYear = today.getFullYear();

    fieldDate.value = `${todayYear}-${todayMonth}-${todayDay}`;
    fieldDate.setAttribute('disabled','disabled');
  }
}

function handleMessagingEmptyTasks(status, element){
  element.classList.add('show');
  if(status === 'today'){
    element.textContent = 'Não há tarefas para hoje';
  }
  else if(status === 'opened'){ 
    element.textContent = 'Não há tarefas em aberto';
  }
  else if(status === 'completed'){
    element.textContent = 'Não há tarefas concluídas';
  }
  else{
    element.textContent = 'Não há tarefas cadastradas';
  } 
}

function checkEmptyTasks(status, tasks){
  const msg = document.getElementById('msg');
  msg.textContent = '';
  msg.classList.remove('show');

  if(tasks.length === 0){
    handleMessagingEmptyTasks(status, msg);
    return true;
  }
  
  return false
  
}

function getTasksWithStatus(status){
  const tasks = getTasks();

  handleFieldDateModal();

  if(status === 'today'){
    handleButtonModal('Adicionar Tarefa com conclusão para hoje', 'visible');
    handleFieldDateModal('today');

    const isToday = (task) => compareDate(task.date) === 'today';
    const tasksFiltered = tasks.filter(isToday).reverse();

    if(!checkEmptyTasks(status, tasksFiltered)){
      tasksFiltered.forEach((task) => buildCardTask(task))
    }

  }
  else if(status === 'all'){
    handleButtonModal('Adicionar Tarefa', 'visible');

    const tasksFiltered = tasks.reverse();
    if(!checkEmptyTasks(status, tasksFiltered)){
      tasksFiltered.forEach((task) => buildCardTask(task))
    }
  }
  else{
    status === 'completed'  
    ? handleButtonModal('', 'hidden')
    : handleButtonModal('Adicionar Tarefa', 'visible');

    const filterTasks = (task) => task.status === status;
  
    const tasksFiltered = tasks.filter(filterTasks).reverse();

    if(!checkEmptyTasks(status, tasksFiltered)){
      tasksFiltered.forEach((task) => buildCardTask(task))
    }
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

function toggleCompleted(id){
  const tasks = getTasks();

  const indexTask = tasks.findIndex(task => task.id === id);
  const task = document.querySelector(`[data-id='${id}']`);
  const isOpened = task.classList.contains('opened');

  if(isOpened){
    tasks[indexTask].status = 'completed';
    task.classList.add('completed');
    task.classList.remove('opened');
  } 
  else{
    tasks[indexTask].status = 'opened';
    task.classList.add('opened');
    task.classList.remove('completed');
  }

  uploadTasks(tasks);

  const currentStatus = getStatusFilter();

  if(currentStatus === 'opened' || currentStatus === 'completed'){
    reload(currentStatus);
  } 

  const toast = document.getElementById('toast-completed');

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hide');
  }, 3000)
}

function compareDate(date){
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0);
  currentDate.setMilliseconds(0);

  const dateTask = new Date(date.split('/').reverse());
  const differenceDates = currentDate - dateTask;
  
  if(differenceDates > 0){
    return 'past';
  }
  else if(differenceDates < 0){
    return 'future';
  }
  else{
    return 'today';
  }
}

function buildCardTask(task){
  const classDate = compareDate(task.date);
  const html = `
      <div class="task-header">
        <h3>${task.title}</h3>
        <span class="date-task ${classDate}">${task.date}</span>
      </div>
      <p>${task.description}</p>
      <div class="actions">
        <img src="./assets/check-circle.svg" alt="Marcar como concluida" onclick="toggleCompleted(${task.id})"/>
        <img src="./assets/trash.svg" alt="Excluir" onclick="removeTask(${task.id})"/>
      </div>
  `; 

  const taskList = document.getElementById('tasks-list');

  const taskItem = document.createElement('div');
  taskItem.classList.add('card-task');
  taskItem.classList.add(task.status);
  taskItem.dataset.id = task.id;
  taskItem.innerHTML = html;

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

  const tasks = getTasks();
  const id = (
    tasks.length === 0
    ? 1
    : tasks[(tasks.length)-1].id + 1
  );

  const newTask = {
    id,
    title,
    description,
    date,
    "status": "opened"
  }

  tasks.push(newTask);
  uploadTasks(tasks);

  emptyInputsForm();

  toggleModal();

  const currentFilter = getStatusFilter();

  reload(currentFilter);
}

function removeTask(id){
  const tasks = getTasks();

  const index = tasks.findIndex(task => task.id === id);
  tasks.splice(index,1);
  uploadTasks(tasks);

  const currentFilter = getStatusFilter();

  reload(currentFilter);

  const toast = document.getElementById('toast-delete');

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hide');
  }, 3000)
}

init();