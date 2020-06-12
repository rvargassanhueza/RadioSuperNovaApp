import { Component } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';

import { Network } from '@ionic-native/network/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage  {
  audio: any;
  subscribe: any;
  constructor(
    public platform: Platform,
    public alertController: AlertController,
    public network: Network,
    public dialogs: Dialogs

    ) {
      this.subscribe = this.platform.backButton.subscribeWithPriority(666666,()=>{
        if(this.constructor.name == "HomePage"){
          this.confirmMessage();
        }
      });

      this.network.onDisconnect().subscribe(()=>{
        this.dialogs.alert('Se ha desconectado de internet');
        navigator["app"].exitApp();
      });

      this.network.onConnect().subscribe(()=>{
        if(this.network.type !== 'wifi'){
          this.dialogs.alert('estás conectado a través de tu internet móvil, si puedes cámbiate a wifi para no consumir tus datos');
        }
        setTimeout(()=>{
          this.dialogs.alert('estás conectado a internet a través de '+this.network.type);
        },2000)
      });
    }

  ngOnInit(){

    const play = document.getElementById('play');
    const stop = document.getElementById('pause');
    const loader = document.getElementById('loader');

    const audio = new Audio ('http://104.131.18.232/proxy/supernova?mp=/stream;');
  
      play.style.display ="block";
      loader.style.display ="none";
      stop.style.display= "none";
  
      audio.addEventListener('playing',function(){
        loader.style.display ="none";
        play.style.display="none";
        stop.style.display="block";
      });
  
    audio.addEventListener('waiting',function(){
      loader.style.display ="block";
      play.style.display="none";
      stop.style.display="none";
    });
  
    stop.addEventListener('click', function(){
      audio.pause();
        play.style.display = "block";
        stop.style.display = "none";
        loader.style.display = "none";
    });
  
    play.addEventListener('click', function(){
      audio.play();
      audio.loop = true;
        play.style.display = "none";
        stop.style.display = "block";
        loader.style.display = "none";
    });
  }
async confirmMessage(){
  const alert = await this.alertController.create({
    cssClass: 'my-custom-class',
    header: 'Radio SuperNova',
    message: 'estás seguro que deseas salir de la app?',
    buttons: [
      {
        text: 'No',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
        }
      }, {
        text: 'Acepto',
        handler: () => {
          navigator["app"].exitApp();
        }
      }
    ]
  });

  await alert.present();
}
  ngOnDestroy() {
    
    if(this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  }
}
