import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrl: './tutorial.component.scss',
})
export class TutorialComponent {
  showTutorial(): void {
    Swal.fire({
      title: "Comment utiliser l'application",
      html: `
        <div id="modal-content" class="max-h-[40vh] overflow-y-auto">
          <ul class="text-left flex flex-col gap-2">
            <li><strong>1.</strong> Utilisez le <strong>bouton de géolocalisation</strong> pour détecter votre position.</li>
            <li><strong>2.</strong> Sélectionnez votre profil en cliquant sur la <strong>photo de profil</strong>.</li>
            <li><strong>3.</strong> Pour <strong>modifier ou supprimer un profil</strong>, cliquez sur les boutons correspondants dans la sélection de profil.</li>
            <li><strong>4.</strong> Pour <strong>créer un nouveau profil</strong>, cliquez sur le bouton <strong>"Ajouter un profil"</strong> en bas du sélecteur de profil.</li>
            <li><strong>5.</strong> Pour effectuer une <strong>recherche</strong>, tapez des mots-clés dans la barre de recherche.</li>
            <li><strong>6.</strong> Pour une <strong>recherche avancée</strong>, cliquez sur le bouton <strong>"Plus de filtres"</strong>. Notez que des pré-filtres peuvent être appliqués selon le profil sélectionné.</li>
            <li><strong>7.</strong> Vous pouvez <strong>zoomer</strong> et <strong>dézoomer</strong> la carte.</li>
            <li><strong>8.</strong> Vous pouvez également <strong>changer de calque</strong> sur la carte.</li>
            <li><strong>9.</strong> Affichez les <strong>résultats sous forme de filtres</strong> pour mieux organiser les informations.</li>
            <li><strong>10.</strong> Cliquez sur un <strong>résultat</strong> pour afficher une page plus détaillée du lieu.</li>
          </ul>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'OK',
      customClass: {
        popup: 'modal-custom',
      },
    }).then(() => {
      // Remove scroll buttons when modal is closed
      const scrollUpButton = document.getElementById('scroll-up');
      const scrollDownButton = document.getElementById('scroll-down');
      if (scrollUpButton) scrollUpButton.remove();
      if (scrollDownButton) scrollDownButton.remove();
    });

    // Add scroll buttons dynamically
    setTimeout(() => {
      const modalPopup = document.querySelector('.swal2-popup');
      if (modalPopup) {
        const scrollUpButton = document.createElement('button');
        scrollUpButton.id = 'scroll-up';
        scrollUpButton.className = 'btn bg-accent';
        scrollUpButton.textContent = '↑';
        scrollUpButton.style.position = 'fixed';
        scrollUpButton.style.left = 'calc(50% + 300px)'; // Adjust position as needed
        scrollUpButton.style.top = 'calc(50% - 60px)';
        scrollUpButton.style.zIndex = '9999'; // Ensure the button is on top of everything
        scrollUpButton.style.width = '50px'; // Increase button size
        scrollUpButton.style.height = '50px'; // Increase button size
        scrollUpButton.style.fontSize = '30px'; // Increase font size

        const scrollDownButton = document.createElement('button');
        scrollDownButton.id = 'scroll-down';
        scrollDownButton.className = 'btn bg-accent';
        scrollDownButton.textContent = '↓';
        scrollDownButton.style.position = 'fixed';
        scrollDownButton.style.left = 'calc(50% + 300px)'; // Adjust position as needed
        scrollDownButton.style.top = 'calc(50% + 20px)';
        scrollDownButton.style.zIndex = '9999'; // Ensure the button is on top of everything
        scrollDownButton.style.width = '50px'; // Increase button size
        scrollDownButton.style.height = '50px'; // Increase button size
        scrollDownButton.style.fontSize = '30px'; // Increase font size

        document.body.appendChild(scrollUpButton);
        document.body.appendChild(scrollDownButton);

        // Add scroll event listeners
        const modalContent = document.getElementById('modal-content');
        if (modalContent) {
          let scrollInterval: any;

          scrollUpButton.addEventListener('mousedown', () => {
            scrollInterval = setInterval(() => {
              modalContent.scrollBy(0, -10);
            }, 50);
          });

          scrollDownButton.addEventListener('mousedown', () => {
            scrollInterval = setInterval(() => {
              modalContent.scrollBy(0, 10);
            }, 50);
          });

          document.addEventListener('mouseup', () => {
            clearInterval(scrollInterval);
          });

          scrollUpButton.addEventListener('mouseleave', () => {
            clearInterval(scrollInterval);
          });

          scrollDownButton.addEventListener('mouseleave', () => {
            clearInterval(scrollInterval);
          });
        }
      }
    }, 0); // Delay to ensure the modal is fully rendered
  }
}
