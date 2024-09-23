// Interface para representar um endereço completo
export interface Address {
    addressId: number;
    address: string;
    number: number;
    neighborhood: string;
    city: string;
    state: string;
    zipcode: string;
    lat: number;
    lng: number;
  }
  
  // Interface para representar o formato de atualização de coordenadas
  export interface AddressUpdate {
    addressId: number;
    lat: number;
    lng: number;
  }