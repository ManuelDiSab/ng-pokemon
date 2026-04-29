import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { VoiceMenu } from '../../_tipi/VoiceMenu.type';

@Component({
    selector: 'app-navbar',
    standalone: false,
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements AfterViewInit {

    @ViewChild('navbar') navbar!: ElementRef

    menuOpen: boolean = false
    isDesktop: boolean = false

    
    menuVoices: VoiceMenu[] = [
        { name: 'Disclaimer', link: 'homepage' },
        { name: 'Pokedex', link: 'pokedex' },
        { name: 'Quiz', link: 'quiz' }
    ]

    ngAfterViewInit(): void {
        this.isDesktopFunction()
    }

    /**
     * IT: Funzione per aprire il menu | EN: Function to open the menu 
     */
    toggleMenu() {
        this.menuOpen = !this.menuOpen
    }
    /**
     * IT: Funzione per chiudere il menu | EN: Function to close the menu 
     */
    closeMenu() {
        this.menuOpen = false
    }

    // IT: Listener per il cambio di grandezza della pagina | EN: Listener for window's resing changes
    @HostListener('window:resize')
    onResize() {
        this.isDesktopFunction()
    }
    /**
     * IT: FUnzione per controllare se lo schermo sia un desktop o meno | EN:Function to control if is a desktop screen or not
     */
    isDesktopFunction() {
        this.isDesktop = window.innerWidth >= 1024
    }


    /**
     * IT: Gestisce la chiusura del menu mobile quando l'utente clicca fuori dalla navbar.
     * Attivo solo su dispositivi non desktop.
     * EN:Manages the closing of the mobile menu when the user clicks outside the navbar. 
     * Only active on non-desktop devices.
     * @param e IT: Evento del click globale sulla finestra | EN: global click event on the window
     */
    @HostListener('window:click', ['$event'])
    onClickOutsideMenu(e: Event) {
        if (!this.isDesktop && this.menuOpen) {
            const clickInside = this.navbar?.nativeElement.contains(e?.target)
            if (!clickInside) {
                this.menuOpen = false
            }
        }
    }


}
