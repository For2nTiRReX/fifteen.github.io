import { Injectable } from '@angular/core';
import { CanActivate , Router } from '@angular/router';
import { PlayerServiceService } from './player-service.service';
import { Player } from '../models/player';

@Injectable()
export class PlayerAuthGuardService implements CanActivate {

  constructor( public playerServiceService: PlayerServiceService, private router: Router) {}
  canActivate(): boolean {
    if (this.playerServiceService.getPlayer() instanceof Player) {
        return true;
    } else {
      if (localStorage.getItem('player')) {
         const localStorageUser =  JSON.parse(localStorage.getItem('player'));
         return this.playerServiceService.loginUser(localStorageUser.name).then( player => {
             if ( player instanceof Player) {
                return true;
             }
         });
      } else {
          this.router.navigate(['/login']);
          return false;
      }
    }
  }

}