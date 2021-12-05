window.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('.menu'),
  menuItem = document.querySelectorAll('.menu_item'),
  hamburger = document.querySelector('.hamburger');

  hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('hamburger_active');
      menu.classList.toggle('menu_active');
  });

  menuItem.forEach(item => {
      item.addEventListener('click', () => {
          hamburger.classList.toggle('hamburger_active');
          menu.classList.toggle('menu_active');
      });
  });

  /* открытие окна */
    function openModal(modalSelector) {
        const modal = document.querySelector(modalSelector);
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        
    }

    /* закрытие окна */
    function closeModal(modalSelector) {
        const modal = document.querySelector(modalSelector);
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    function modal(triggerSelector, modalSelector) {
        //Modal window
        const modal = document.querySelector(modalSelector),
            modalTrigger = document.querySelectorAll(triggerSelector);

        modalTrigger.forEach(btn => {
            btn.addEventListener('click', () => openModal(modalSelector));
        });


        /* закрытие окна, если нажатие происходит вне окна (на подложку) */
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.getAttribute('data-close') == '') {
                closeModal(modalSelector);
            }
        });

        /* закрытие окна при нажатии на кнопку esc */
        document.addEventListener('keydown', (e) => {
            if (e.code === "Escape" && modal.classList.contains('show')) {
                closeModal(modalSelector);
            }
        });

    }

    modal('[data-modal]', '.modal');
});