import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SearchComponent } from "./search/search.component";
import { MapComponent } from "./map/map.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MapComponent, MapComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'search-address';
}
