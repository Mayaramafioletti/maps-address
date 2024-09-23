import { Component, EventEmitter, Output, ViewChild, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GoogleMapsService } from '../services/google-maps.service';
import { GoogleMap } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [GoogleMap, CommonModule, FormsModule, HttpClientModule, MapComponent],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements AfterViewInit, OnChanges {
  @Input() address: string = '';
  @Output() addressChange = new EventEmitter<string>();
  @Output() confirmAddress = new EventEmitter<{ lat: number; lng: number }>();
  @Output() selectedPosition = new EventEmitter<{ lat: number; lng: number }>();
  
  @ViewChild('addresstext') addresstext: any;

  addressInvalid = false;
  suggestions: any[] = [];
  pagetoken: string | undefined = '';
  hasMoreResults = false;
  selectedSuggestion: any = null;
  center: { lat: number; lng: number } | null = null; // Adicionando a propriedade center

  constructor(private googleMapsService: GoogleMapsService) {}

  ngAfterViewInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['address'] && changes['address'].currentValue) {
      this.searchAddress();
    }
  }

  searchAddress(loadMore: boolean = false) {
    if (!loadMore) this.pagetoken = '';
    if (this.address.length > 2) {
      this.googleMapsService.getAddress(this.address, this.pagetoken).subscribe(result => {
        this.suggestions = result.results || [];
        this.addressInvalid = this.suggestions.length === 0;
        this.pagetoken = result.next_page_token;
        this.hasMoreResults = !!this.pagetoken;
        this.selectedPosition.emit(this.suggestions[0].geometry.location);
      }, () => {
        this.suggestions = [];
        this.addressInvalid = true;
      });
    } else {
      this.suggestions = [];
    }
  }

  loadMoreResults() {
    if (this.pagetoken) {
      this.searchAddress(true);
    }
  }

  selectSuggestion(suggestion: any) {
    this.selectedSuggestion = suggestion;
    this.address = suggestion.formatted_address || suggestion.name;
    this.addressChange.emit(this.address);
    if (suggestion.geometry?.location) {
      const location = suggestion.geometry.location;
      this.center = {
        lat: location.lat instanceof Function ? location.lat() : location.lat,
        lng: location.lng instanceof Function ? location.lng() : location.lng
      };
    }
  }

  confirmSelection() {
    if (this.selectedSuggestion) {
      const location = this.selectedSuggestion.geometry.location;
      const lat = location.lat instanceof Function ? location.lat() : location.lat;
      const lng = location.lng instanceof Function ? location.lng() : location.lng;
      this.confirmAddress.emit({ lat, lng });
      this.suggestions = [];
      this.selectedSuggestion = null;
    }
  }
}
