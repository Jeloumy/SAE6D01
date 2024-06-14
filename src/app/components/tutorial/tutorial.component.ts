import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrl: './tutorial.component.scss'
})
export class TutorialComponent {
  showTutorial(): void {
    Swal.fire({
      title: 'Bienvenue dans notre application!',
      html: `
        <h3>Comment utiliser l'application:</h3>
        <ul style="text-align: left;">
          <li>1. Utilisez le bouton de géolocalisation pour détecter votre position.</li>
          <li>2. Sélectionnez votre profil en cliquant sur la photo de profil.</li>
          <li>3. Pour modifier ou supprimer un profil, cliquez sur les boutons correspondants dans la sélection de profil.</li>
          <li>4. Pour créer un nouveau profil, cliquez sur le bouton "+ ajouter" en bas du sélecteur de profil.</li>
        </ul>
      `,
      icon: 'info',
      confirmButtonText: 'OK'
    });
  }
}
