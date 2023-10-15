import { Component } from '@angular/core';
import { View } from '@syncfusion/ej2-angular-schedule';
@Component({
  selector: 'app-root',
  // template: `<ejs-schedule [currentView]='setView'></ejs-schedule>`,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-schedular-app';
  public setView: View = 'Day'
}
