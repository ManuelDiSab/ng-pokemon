import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { VoiceMenu } from '../../_tipi/VoiceMenu.type';

@Component({
    selector: 'app-navbar',
    standalone: false,
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements AfterViewInit {

    @ViewChild('navbar')navbar!:ElementRef

    menuOpen: boolean = false
    isDesktop:boolean = false

    menuVoices: VoiceMenu[] = [
        { name: 'Disclaimer', link: 'homepage' },
        { name: 'Pokedex', link: 'pokedex' },
        { name: 'Quiz', link: 'quiz' }
    ]

    ngAfterViewInit(): void {
        this.isDesktopFun()
    }

    /**
     * Function to open the menu
     */
    toggleMenu() {
        this.menuOpen = !this.menuOpen
    }
    /**
     * Function to close the menu 
     */
    closeMenu() {
        this.menuOpen = false
    }

    @HostListener('window:resize')
    onResize(){
        this.isDesktopFun()
    }
    /**
     * Control if is a desktop screen or not
     */
    isDesktopFun(){
        this.isDesktop = window.innerWidth >=1024
    }


    @HostListener('window:click', ['$event'])
    onClickOutsideMenu(e:Event){
        if(!this.isDesktop && this.menuOpen){
            const clickInside = this.navbar?.nativeElement.contains(e?.target)
            if(!clickInside){
                this.menuOpen = false
            }
        }
    }

   
}
