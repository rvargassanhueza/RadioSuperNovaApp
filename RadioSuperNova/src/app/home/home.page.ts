import { Component } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';

import { Network } from '@ionic-native/network/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';

import { Media, MediaObject } from '@ionic-native/media/ngx';
import { MusicControls } from '@ionic-native/music-controls/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage  {
  file: MediaObject;
  audio: any;
  subscribe: any;
  showToggle:boolean = true;
  // contador: number = 0;

  constructor(
    public platform: Platform,
    public alertController: AlertController,
    public network: Network,
    public dialogs: Dialogs,
    public musicControls: MusicControls, 
    public media: Media

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

    showToggleFun(){
      if(this.showToggle == true){
        this.showToggle = false;
      }else{
        this.showToggle = true;
      }
    }

    settingMusicControl(){
      this.musicControls.destroy(); // it's the same with or without the destroy 
      this.musicControls.create({
        track       : 'Test track',        // optional, default : ''
        artist      : 'test artist',                       // optional, default : ''
        cover       : '',      // optional, default : nothing
        // cover can be a local path (use fullpath 'file:///storage/emulated/...', or only 'my_image.jpg' if my_image.jpg is in the www folder of your app)
        //           or a remote url ('http://...', 'https://...', 'ftp://...')
        isPlaying   : true,                         // optional, default : true
        dismissable : true,                         // optional, default : false
      
        // hide previous/next/close buttons:
        hasPrev   : false,      // show previous button, optional, default: true
        hasNext   : false,      // show next button, optional, default: true
        hasClose  : true,       // show close button, optional, default: false
        hasSkipForward : false,  // show skip forward button, optional, default: false
        hasSkipBackward : false, // show skip backward button, optional, default: false
        skipForwardInterval: 15, // display number for skip forward, optional, default: 0
        skipBackwardInterval: 15, // display number for skip backward, optional, default: 0
      // iOS only, optional
        album       : 'test album',     // optional, default: ''
        duration : 0, // optional, default: 0
        elapsed : 0, // optional, default: 0
      
        // Android only, optional
        // text displayed in the status bar when the notific\ation (and the ticker) are updated
        ticker    : 'Now playing test'
       });
       this.musicControls.subscribe().subscribe((action) => {
        console.log('action', action);
            const message = JSON.parse(action).message;
            console.log('message', message);
            switch(message) {
              case 'music-controls-next':
                 // Do something
                 break;
              case 'music-controls-previous':
                 // Do something
                 break;
              case 'music-controls-pause':
                 // Do something
                 console.log('music pause');
                 this.file.pause();
                 this.musicControls.listen(); 
                 this.musicControls.updateIsPlaying(false);
                 break;
              case 'music-controls-play':
                 // Do something
                 console.log('music play');
                 this.file.play();
                 this.musicControls.listen(); 
                 this.musicControls.updateIsPlaying(true);
                 break;
              case 'music-controls-destroy':
                 // Do something
                 break;
              // External controls (iOS only)
              case 'music-controls-toggle-play-pause' :
                // Do something
                break;
              case 'music-controls-seek-to':
                // Do something
                break;
              case 'music-controls-skip-forward':
                // Do something
                break;
              case 'music-controls-skip-backward':
                // Do something
                break;
  
                // Headset events (Android only)
                // All media button events are listed below
              case 'music-controls-media-button' :
                  // Do something
                  break;
              case 'music-controls-headset-unplugged':
                  // Do something
                  break;
              case 'music-controls-headset-plugged':
                  // Do something
                  break;
              default:
                  break;
            }
      });
      this.musicControls.listen(); // activates the observable above
      this.musicControls.updateIsPlaying(true);
    }

   ngOnInit(){

    const play = document.getElementById('play');
    const stop = document.getElementById('pause');
    const loader = document.getElementById('loader');
    const conect = this.network;
    const dialog = this.dialogs;
  //   const audio = new Audio();
  //   audio.src = 'http://104.131.18.232/proxy/supernova?mp=/stream';
  //   audio.load();
  
      play.style.display ="block";
      loader.style.display ="none";
      stop.style.display= "none";
  
  //     audio.addEventListener('playing',function(){
  //       loader.style.display ="none";
  //       play.style.display="none";
  //       stop.style.display="block";
  //     });
  
  //   audio.addEventListener('waiting',function(){
  //     loader.style.display ="block";
  //     play.style.display="none";
  //     stop.style.display="none";
  //   });
  
  //   stop.addEventListener('click', function(){
  //      audio.pause();
  //       play.style.display = "block";
  //       stop.style.display = "none";
  //       loader.style.display = "none";
  //   });
  
  //   play.addEventListener('click', function(){
  //     if(conect.type === 'none'){
  //         dialog.alert(
  //           'Radio SuperNova',
  //           'no estás conectado a internet', 
  //         );
  //         setTimeout(()=>{
  //           navigator["app"].exitApp();
  //         },2000)
  //     }else{
  //       audio.loop = true;
  //       const data = audio.play();
  //       data.then(function(i) {
  //         // Automatic playback started!
  //         play.style.display = "none";
  //         stop.style.display = "block";
  //         loader.style.display = "none";
  //       }).catch(function(error) {
  //         console.log("reproduce error "+ error);
  //       });        
  //     }
  //   });
   }

  play(){
    this.showToggle = false;
    this.file = this.media.create('http://104.131.18.232/proxy/supernova?mp=/stream');
    this.file.play();
    // this.settingMusicControl();
  }

  pause(){
    this.showToggle = true;
    this.file.pause();
    // this.musicControls.listen();
    // this.musicControls.updateIsPlaying(false);
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
