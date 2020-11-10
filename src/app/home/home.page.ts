import { Component, ViewChild, ElementRef } from '@angular/core';
import { CameraSource, Plugins, CameraResultType } from '@capacitor/core';
import { Platform, ActionSheetController } from '@ionic/angular';
const { Camera } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  sourceImage:String ;
  convertedImage: String;
  imgUrl: String ;
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  constructor(private plt: Platform, private actionSheetCtrl: ActionSheetController) {}

  

  async addImage(source: CameraSource) {
    const image = await Camera.getPhoto({
      quality: 60,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source
    });
    
    this.sourceImage = image.base64String;
    
    const blobData = this.b64toBlob(image.base64String, `image/${image.format}`);
    const imageName = '#';
    
  
    console.log("Image URL is"+this.sourceImage);
    this.convertedImage= "data:image/jpg;base64,"+this.sourceImage;
    this.imgUrl=image.webPath;
    
  }
  
 

  async selectImageSource() {
    const buttons = [
      {
        text: 'Take Photo',
        icon: 'camera',
        handler: () => {
          this.addImage(CameraSource.Camera);
        }
      },
      {
        text: 'Choose From Photos',
        icon: 'image',
        handler: () => {
          this.addImage(CameraSource.Photos);
          
        }
      }
    ];

    // Only allow file selection inside a browser
    if (!this.plt.is('hybrid')) {
      buttons.push({
        text: 'Choose a File',
        icon: 'attach',
        handler: () => {
          this.fileInput.nativeElement.click();
        }
      });
    }

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Select Image Source',
      buttons
    });
    await actionSheet.present();
  }
   b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
 
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
 
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
 
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
 
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
  
}
