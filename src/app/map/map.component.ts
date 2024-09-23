import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { AddressService } from '../services/address.service';
import { SearchComponent } from '../search/search.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMap, MapMarker, SearchComponent, CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent {
  @ViewChild('map', { static: false }) map!: GoogleMap;
  @Input() location: any;
  @Input() center: any;
  @Output() addressSelected = new EventEmitter<string>();

  geocoder = new google.maps.Geocoder();
  enderecos: any[] = [];
  enderecoSelecionado: string = '';
  enderecoSelecionadoIndex: number | null = null;
  @Input() selectedPosition: { lat: number; lng: number } | null = null;
  selectedAddress: string = '';
  incorrectPosition: { lat: number; lng: number } | null = null;

  constructor(private addressService: AddressService) {}

  ngOnInit(): void {
    this.addressService.getEnderecos().subscribe(data => this.enderecos = data);
  }
  ngAfterViewInit(): void {
    this.ajustarZoom(); // Ajusta o zoom ao carregar o mapa
  }

  ajustarZoom(): void {
    if (!this.selectedPosition || !this.incorrectPosition || !this.map) return;

    const bounds = new google.maps.LatLngBounds();

    // Adiciona ambos os marcadores aos limites
    bounds.extend(new google.maps.LatLng(this.selectedPosition.lat, this.selectedPosition.lng));
    bounds.extend(new google.maps.LatLng(this.incorrectPosition.lat, this.incorrectPosition.lng));

    // Ajusta o mapa para mostrar ambos os marcadores com uma margem de 50 pixels
    const padding = 100;  // Ajuste conforme necessário
    this.map.googleMap?.fitBounds(bounds, padding);
}
  onRowClick(element: any, index: number): void {
    this.resetSelection();
    this.enderecoSelecionadoIndex = index;
    this.enderecoSelecionado = this.formatAddress(element);
    this.incorrectPosition = { lat: parseFloat(element.lat), lng: parseFloat(element.lng) };
    setTimeout(() => {
      this.center = this.incorrectPosition;
      this.ajustarZoom(); // Ajusta o zoom após o recenter do mapa
    }, 1000);
    this.geocodeAddress(this.enderecoSelecionado);
  }

  substituirEndereco(confirmedAddress: { lat: number; lng: number }): void {
    if (this.enderecoSelecionadoIndex !== null) {
      const addressId = this.enderecos[this.enderecoSelecionadoIndex].addressId;
      this.enderecos[this.enderecoSelecionadoIndex] = {
        ...this.enderecos[this.enderecoSelecionadoIndex],
        lat: confirmedAddress.lat.toString(),
        long: confirmedAddress.lng.toString(),
      };
      this.incorrectPosition = confirmedAddress;
      this.center = confirmedAddress;

      this.addressService.updateEndereco(addressId, confirmedAddress.lat, confirmedAddress.lng).subscribe(response => {
        console.log('Coordenadas atualizadas com sucesso:', response);
      });
      this.removerEnderecoComAtraso(this.enderecoSelecionadoIndex);
    } else {
      console.error('Endereço selecionado não encontrado.');
    }
  }


  onMapClick(event: google.maps.MapMouseEvent): void {
    if (event.latLng) {
      this.selectedPosition = { lat: event.latLng.lat(), lng: event.latLng.lng() };
      this.geocodeLatLng(this.selectedPosition);
    }
    this.ajustarZoom();
  }

  confirmarEnderecoMapa(): void {
    if (this.selectedPosition && this.enderecoSelecionadoIndex !== null) {
      this.substituirEndereco({ lat: this.selectedPosition.lat, lng: this.selectedPosition.lng });
      this.selectedAddress = '';

      this.removerEnderecoComAtraso(this.enderecoSelecionadoIndex);
    } else {
      console.error('Nenhum endereço selecionado para confirmar.');
    }
  }

  removerEnderecoComAtraso(index: number): void {
    setTimeout(() => {
      this.enderecos.splice(index, 1); 
      this.resetSelection(); 
    }, 2000); 
  }

  substituirEnderecoComCoordenadas(novoEndereco: string, lat: number, lng: number): void {
    if (this.enderecoSelecionadoIndex !== null) {
      const addressParts = this.parseAddress(novoEndereco);
      if (addressParts) {
        this.enderecos[this.enderecoSelecionadoIndex] = {
          ...this.enderecos[this.enderecoSelecionadoIndex],
          ...addressParts,
          lat: lat.toString(),
          long: lng.toString(),
        };
      } else {
        console.error('Não foi possível dividir o novo endereço.');
      }
    } else {
      console.error('Nenhum endereço selecionado para substituir.');
    }
  }

  parseAddress(fullAddress: string) {
    const addressRegex = /^(.+?),\s*(\d+.*?[-\d]*),\s*(.+?)\s*-\s*(.+?),\s*(\d{5}-\d{3}),\s*(.+)$/;
    const match = fullAddress.match(addressRegex);
    return match ? {
      address: match[1],
      neighborhood: match[2],
      city: match[3],
      state: match[4],
      zipcode: match[5],
    } : null;
  }

  geocodeAddress(address: string): void {
    this.geocoder.geocode({ address }, (results, status) => {

      if (status === 'OK' && results && results[0]) {
        const { lat, lng } = results[0].geometry.location;
        this.location = results[0];
        this.center = { lat: lat(), lng: lng() };
      } else {
        console.error('Geocode falhou: ' + status);
      }
    });
  }

  geocodeLatLng({ lat, lng }: { lat: number; lng: number }): void {
    this.geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        this.selectedAddress = results[0].formatted_address;
      } else {
        console.error('Geocode reversa falhou: ' + status);
      }
    });
  }

  resetSelection(): void {
    this.enderecoSelecionado = '';
    this.selectedPosition = null;
    this.selectedAddress = '';
  }

  private formatAddress(element: any): string {
    return `${element.address}, ${element.neighborhood}, ${element.city}, ${element.state}, ${element.zipcode}`;
  }
}
