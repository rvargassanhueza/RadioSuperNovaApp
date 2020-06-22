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
  // contador: number = 0;

  constructor(
    public platform: Platform,
    public alertController: AlertController,
    public network: Network,
    public dialogs: Dialogs

    ) {
      this.subscribe = this.platform.backButton.subscribeWithPriority(10,()=>{
        console.log("this.subscribe: ",this.subscribe);
        this.confirmMessage();
      });
      
      this.network.onDisconnect().subscribe(()=>{
        this.dialogs.alert('Se ha desconectado de internet','Radio SuperNova');
        this.exitApp();
      });

      if(this.network.type === 'none'){
        
        this.exitForInternet();}

      this.network.onConnect().subscribe(()=>{
        if(this.network.type !== 'wifi'){
          this.dialogs.alert('estás conectado a través de tu internet móvil, si puedes cámbiate a wifi para no consumir tus datos', 'Radio SuperNova');
        }
      });
    }

  ngOnInit(){

    const play = document.getElementById('play');
    const stop = document.getElementById('pause');
    const loader = document.getElementById('loader');
    const conect = this.network;
    const dialog = this.dialogs;
    const audio = new Audio();
    audio.src = 'http://104.131.18.232/proxy/supernova?mp=/stream';
    audio.load();
  
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
      if(conect.type === 'none'){
          dialog.alert(
            'Radio SuperNova',
            'no estás conectado a internet', 
          );
          setTimeout(()=>{
            navigator["app"].exitApp();
          },2000)
      }else{
        audio.loop = true;
        const data = audio.play();
        data.then(function(i) {
          // Automatic playback started!
          play.style.display = "none";
          stop.style.display = "block";
          loader.style.display = "none";
        }).catch(function(error) {
          console.log("reproduce error "+ error);
        });        
      }
    });
  }

async confirmMessage(){
  
  const alert = await this.alertController.create({
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
          this.exitApp();
        }
      }
    ]
  });
  await alert.present();
}

async exitForInternet(){
  const alert = await this.alertController.create({
    cssClass: 'my-custom-class',
    header: 'Radio SuperNova',
    message: 'no estás conectado a internet',
    buttons: [
       {
        text: 'Acepto',
        handler: () => {
          this.exitApp();
        }
      }
    ]
  });
  await alert.present();
}

exitApp(){
  navigator["app"].exitApp();
}
  ngOnDestroy() {
    
    if(this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  }
}
