document.addEventListener("DOMContentLoaded", function() {
    const tabs = document.querySelectorAll('.tabButton');
    const contents = document.querySelectorAll('.content');
  
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
  
        const targetId = tab.id.replace('Tab', 'Content');
        contents.forEach(content => {
          content.classList.remove('active');
          if (content.id === targetId) {
            content.classList.add('active');
          }
        });
      });
    });
  });
  