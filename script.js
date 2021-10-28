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

getDate();

const buttonMenu = document.getElementById('open-menu');
const menu = document.getElementById('menu')

function toggleClassMenuMobile(){
  buttonMenu.classList.toggle('active');
  menu.classList.toggle('active');

}
buttonMenu.addEventListener('click',toggleClassMenuMobile);


function toggleClassModal(){
  console.log('Clicou');
  const modal = document.getElementById('modal');
  const modalWrapper = document.getElementById('modal-wrapper');

  modal.classList.toggle('show-modal');
  modalWrapper.classList.toggle('show');
}

const buttonsSwitchTheme = document.querySelectorAll('.theme-switcher');

buttonsSwitchTheme.forEach(button => button.addEventListener('click',switchTheme));

function switchTheme(){
  let currentTheme = document.getElementsByTagName('html')[0].dataset;

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

